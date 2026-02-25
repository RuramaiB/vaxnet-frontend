<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">SMS Broadcasting</h1>
          <p class="text-gray-600 mt-1">Send vaccination reminders and updates to parents</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-600">
            <span class="font-semibold">{{ selectedRecipients.length }}</span> recipients selected
          </div>
          <button
            @click="loadSampleData"
            class="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Load Sample Data
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <UiStatCard
        title="Total Recipients"
        :value="totalRecipients"
        subtitle="Parents registered"
        :icon="UserGroupIcon"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100"
      />
      <UiStatCard
        title="Messages Sent"
        :value="messageHistory.length"
        subtitle="This month"
        :icon="ChatBubbleLeftRightIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Success Rate"
        value="98.2%"
        subtitle="Delivery rate"
        :icon="CheckCircleIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Cost Estimate"
        :value="`$${costEstimate}`"
        subtitle="For this message"
        :icon="CurrencyDollarIcon"
        icon-color="text-yellow-600"
        icon-bg-color="bg-yellow-100"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Filters -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Location Filters (Targets Parents Only) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Filter by Location</h3>
          <p class="text-xs text-gray-500 mb-2">Extracting categories from all registered parents.</p>
          
          <!-- Province Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select
              v-model="selectedProvince"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Provinces</option>
              <option v-for="p in availableCategories.provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <!-- District Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select
              v-model="selectedDistrict"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Districts</option>
              <option v-for="d in availableCategories.districts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Town Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Town</label>
            <select
              v-model="selectedTown"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Towns</option>
              <option v-for="t in availableCategories.towns" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <!-- City Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              v-model="selectedCity"
              @change="handleFilterChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              <option v-for="c in availableCategories.cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="pt-2 border-t border-gray-100">
            <button
              @click="clearAllRecipients"
              class="text-sm text-gray-600 hover:text-gray-500 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Middle Column: Parent Selection List -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-280px)]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Parents List</h3>
            <div class="space-x-2">
              <button
                @click="selectAllFiltered"
                class="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Select All
              </button>
              <button
                @click="deselectAllFiltered"
                class="text-xs font-medium text-gray-500 hover:text-gray-600"
              >
                Deselect All
              </button>
            </div>
          </div>

          <!-- List controls -->
          <div class="mb-4">
            <div class="relative">
              <input
                v-model="parentSearchQuery"
                type="text"
                placeholder="Find in list..."
                class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2 pr-2">
            <div
              v-for="parent in displayedParents"
              :key="parent.id"
              class="flex items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all cursor-pointer"
              @click="toggleSelection(parent)"
            >
              <input
                type="checkbox"
                :checked="isParentSelected(parent.id)"
                class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
              />
              <div class="ml-3 flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">{{ parent.firstname }} {{ parent.lastname }}</div>
                <div class="text-xs text-gray-500 truncate">{{ parent.phoneNumber }}</div>
                <div v-if="parent.provinceId || parent.districtId" class="text-[10px] text-gray-400 truncate">
                  {{ parent.provinceId }} {{ parent.districtId ? '• ' + parent.districtId : '' }}
                </div>
              </div>
            </div>

            <!-- Empty State for List -->
            <div v-if="displayedParents.length === 0" class="text-center py-12">
              <UserGroupIcon class="mx-auto h-10 w-10 text-gray-300" />
              <p class="mt-2 text-sm text-gray-500">No parents found matching filters</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>Showing {{ displayedParents.length }} parents</span>
            <span>{{ selectedRecipients.length }} selected</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Message Composition -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Message Composition -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Compose Message</h3>
          
          <!-- Message Template Quick Select -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="template in messageTemplates"
                :key="template.id"
                @click="useTemplate(template)"
                class="p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div class="font-medium text-gray-900">{{ template.title }}</div>
                <div class="text-xs text-gray-500 truncate">{{ template.message }}</div>
              </button>
            </div>
          </div>

          <!-- Message Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Your Message <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="messageContent"
              rows="6"
              maxlength="160"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-sans"
              placeholder="Type your message here (160 characters max)..."
            ></textarea>
            <div class="flex justify-between mt-2">
              <div class="text-sm text-gray-500">
                {{ messageContent.length }}/160 characters
              </div>
              <div class="text-sm text-gray-500">
                {{ messageSegments }} SMS segment{{ messageSegments !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>

          <!-- Message Preview -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Message Preview</label>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="text-sm text-gray-600 mb-2">SMS Preview:</div>
              <div class="bg-white p-3 rounded border border-gray-300 font-sans text-gray-800">
                {{ messageContent || 'Your message will appear here...' }}
              </div>
              <div class="text-xs text-gray-500 mt-2">
                From: Child VaxNet • This message will be sent to {{ selectedRecipients.length }} recipient{{ selectedRecipients.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>

          <!-- Scheduling -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Schedule Message</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="scheduleType"
                  type="radio"
                  value="now"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span class="ml-2 text-gray-700">Send now</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="scheduleType"
                  type="radio"
                  value="scheduled"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span class="ml-2 text-gray-700">Schedule for later</span>
              </label>
            </div>
            
            <div v-if="scheduleType === 'scheduled'" class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  v-model="scheduledDate"
                  type="date"
                  :min="minDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  v-model="scheduledTime"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Send Button -->
          <div class="pt-6 border-t border-gray-200">
            <button
              @click="sendBroadcast"
              :disabled="!canSend"
              class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!isSending" class="flex items-center justify-center">
                <PaperAirplaneIcon class="w-5 h-5 mr-2" />
                {{ scheduleType === 'now' ? 'Send Broadcast Now' : 'Schedule Broadcast' }}
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
            <p class="text-xs text-gray-500 mt-2 text-center">
              Cost estimate: ${{ costEstimate }} • {{ selectedRecipients.length }} recipients • {{ messageSegments }} segment{{ messageSegments !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>

        <!-- Message History -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Message History</h3>
            <div class="flex space-x-2">
              <select
                v-model="historyFilter"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
            <div
              v-for="message in filteredHistory"
              :key="message.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="flex items-center">
                    <span class="font-medium text-gray-900">{{ message.title }}</span>
                    <span :class="[
                      'ml-2 px-2 py-1 text-xs rounded-full',
                      message.status === 'sent' ? 'bg-green-100 text-green-800' :
                      message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ message.status }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    {{ formatDate(message.timestamp) }} • {{ message.recipients }} recipients
                  </div>
                </div>
                <button
                  @click="resendMessage(message)"
                  class="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Resend
                </button>
              </div>
              <div class="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-2">
                {{ message.content }}
              </div>
                <div class="text-xs text-gray-500">
                  Cost: ${{ message.cost.toFixed(2) }}
                </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHistory.length === 0" class="text-center py-12">
            <ChatBubbleLeftRightIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No messages sent yet</h3>
            <p class="mt-1 text-sm text-gray-500">Your broadcast history will appear here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon class="w-8 h-8 text-green-600" />
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Broadcast Sent!</h3>
        
        <p class="text-gray-600 mb-6">
          Your message has been successfully sent to {{ selectedRecipients.length }} recipients.
        </p>
        
        <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <div class="text-sm text-gray-700 space-y-2">
            <div class="flex justify-between">
              <span>Recipients:</span>
              <span class="font-medium">{{ selectedRecipients.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>Message segments:</span>
              <span class="font-medium">{{ messageSegments }}</span>
            </div>
            <div class="flex justify-between">
              <span>Estimated cost:</span>
              <span class="font-medium">${{ costEstimate }}</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery time:</span>
              <span class="font-medium">{{ scheduleType === 'now' ? 'Immediate' : scheduledDate + ' ' + scheduledTime }}</span>
            </div>
          </div>
        </div>
        
        <button
          @click="showSuccessModal = false"
          class="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
        >
          Done
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  UserGroupIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

// Recipients data
const recipients = ref<any[]>([])

// Message templates
const messageTemplates = ref([
  { id: 't1', title: 'Vaccination Reminder', message: 'Reminder: Your child is due for vaccination this week. Please visit your nearest health facility.' },
  { id: 't2', title: 'Appointment Confirmation', message: 'Your vaccination appointment is confirmed for [DATE] at [TIME]. Please bring your child\'s immunization card.' },
  { id: 't3', title: 'Campaign Announcement', message: 'Vaccination campaign this Saturday at [FACILITY]. Free vaccines for all children under 5 years.' },
  { id: 't4', title: 'Follow-up Required', message: 'Important: Your child missed a scheduled vaccination. Please visit the health facility as soon as possible.' }
])

// Message history
const messageHistory = ref<any[]>([])

// Categories from DB
const availableCategories = ref({
    provinces: [] as string[],
    districts: [] as string[],
    towns: [] as string[],
    cities: [] as string[]
})

// Search and Filtered data
const parentSearchQuery = ref('')

// Display parents based on local filters
const displayedParents = computed(() => {
  return recipients.value.filter(p => {
    const matchesSearch = !parentSearchQuery.value || 
      (p.firstname && p.firstname.toLowerCase().includes(parentSearchQuery.value.toLowerCase())) ||
      (p.lastname && p.lastname.toLowerCase().includes(parentSearchQuery.value.toLowerCase())) ||
      (p.phoneNumber && p.phoneNumber.includes(parentSearchQuery.value))
    
    const matchesProvince = !selectedProvince.value || p.provinceId === selectedProvince.value
    const matchesDistrict = !selectedDistrict.value || p.districtId === selectedDistrict.value
    const matchesTown = !selectedTown.value || p.town === selectedTown.value
    const matchesCity = !selectedCity.value || p.city === selectedCity.value
    
    return matchesSearch && matchesProvince && matchesDistrict && matchesTown && matchesCity
  })
})

const isParentSelected = (id: string) => {
  return selectedRecipients.value.some(r => r.id === id)
}

const toggleSelection = (parent: any) => {
  const index = selectedRecipients.value.findIndex(r => r.id === parent.id)
  if (index > -1) {
    selectedRecipients.value.splice(index, 1)
  } else {
    selectedRecipients.value.push(parent)
  }
}

const selectAllFiltered = () => {
  displayedParents.value.forEach(p => {
    if (!isParentSelected(p.id)) {
      selectedRecipients.value.push(p)
    }
  })
}

const deselectAllFiltered = () => {
  const idsToRemove = displayedParents.value.map(p => p.id)
  selectedRecipients.value = selectedRecipients.value.filter(r => !idsToRemove.includes(r.id))
}

// Form state
const selectedProvince = ref('')
const selectedDistrict = ref('')
const selectedTown = ref('')
const selectedCity = ref('')
const selectedRecipients = ref<any[]>([])
const messageContent = ref('')
const scheduleType = ref('now')
const scheduledDate = ref('')
const scheduledTime = ref('10:00')
const historyFilter = ref('all')
const isSending = ref(false)
const showSuccessModal = ref(false)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Computed properties
const filteredHistory = computed(() => {
  const now = new Date()
  const filter = historyFilter.value
  if (filter === 'all') return messageHistory.value
  const filtered = messageHistory.value.filter(msg => {
    const msgDate = new Date(msg.timestamp)
    if (filter === 'today') return msgDate.toDateString() === now.toDateString()
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return msgDate >= weekAgo
    }
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return msgDate >= monthAgo
    }
    return true
  })
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const totalRecipients = computed(() => recipients.value.length)

const messageSegments = computed(() => {
  if (!messageContent.value) return 0
  return Math.ceil(messageContent.value.length / 160)
})

const costEstimate = computed(() => {
  return (selectedRecipients.value.length * messageSegments.value * 0.01).toFixed(2)
})

const canSend = computed(() => {
  return messageContent.value.trim().length > 0 && 
         selectedRecipients.value.length > 0 &&
         !isSending.value
})

const fetchCategories = () => {
  // Deriving categories locally from the parents list
  const cats = {
    provinces: new Set<string>(),
    districts: new Set<string>(),
    towns: new Set<string>(),
    cities: new Set<string>()
  }

  recipients.value.forEach(p => {
    if (p.provinceId) cats.provinces.add(p.provinceId)
    if (p.districtId) cats.districts.add(p.districtId)
    if (p.town) cats.towns.add(p.town)
    if (p.city) cats.cities.add(p.city)
  })

  availableCategories.value = {
    provinces: Array.from(cats.provinces).sort(),
    districts: Array.from(cats.districts).sort(),
    towns: Array.from(cats.towns).sort(),
    cities: Array.from(cats.cities).sort()
  }
}

const fetchRecipients = async () => {
    try {
        // Fetch ALL parents from standard auth endpoint
        const response = await fetch('http://localhost:8080/api/v1/auth/get-all-users-by-/PARENT')
        recipients.value = await response.json()
        fetchCategories()
    } catch (e) {
        console.error('Failed to fetch recipients', e)
    }
}

// Methods
const handleFilterChange = () => {
    // Local computed property 'displayedParents' handles this
}

const removeRecipient = (id: string) => {
  const index = selectedRecipients.value.findIndex(r => r.id === id)
  if (index > -1) {
    selectedRecipients.value.splice(index, 1)
  }
}

const clearAllRecipients = () => {
  selectedRecipients.value = []
  selectedProvince.value = ''
  selectedDistrict.value = ''
  selectedTown.value = ''
  selectedCity.value = ''
}

const useTemplate = (template: any) => {
  messageContent.value = template.message
}

const sendBroadcast = async () => {
  if (selectedRecipients.value.length === 0 || !messageContent.value.trim()) return

  isSending.value = true
  try {
    const response = await fetch('http://localhost:8080/api/broadcasting/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phones: selectedRecipients.value.map(r => r.phoneNumber).filter(p => p != null),
        message: messageContent.value
      })
    })

    if (response.ok) {
      // Add to local history
      messageHistory.value.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        recipients: selectedRecipients.value.length,
        content: messageContent.value,
        status: 'Delivered',
        cost: parseFloat(costEstimate.value)
      })

      showSuccessModal.value = true
      messageContent.value = ''
      selectedRecipients.value = []
      selectedProvince.value = ''
      selectedDistrict.value = ''
      selectedTown.value = ''
      selectedCity.value = ''
    }
  } catch (e) {
    console.error('Failed to send broadcast', e)
    alert('Failed to send broadcast. Please check backend connection.')
  } finally {
    isSending.value = false
  }
}

const resendMessage = (message: any) => {
  if (confirm('Resend this message to the same recipients?')) {
    messageContent.value = message.content
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadSampleData = () => {
  messageContent.value = 'Important: Free vaccination campaign this Saturday at local health facilities from 8AM to 4PM. Bring your child\'s immunization card.'
}

// Initialize
onMounted(() => {
  scheduledDate.value = minDate.value
  fetchCategories()
  fetchRecipients()
})
</script>

<style scoped>
/* Custom scrollbar styling */
.max-h-60::-webkit-scrollbar,
.max-h-80::-webkit-scrollbar,
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track,
.max-h-80::-webkit-scrollbar-track,
.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb,
.max-h-80::-webkit-scrollbar-thumb,
.max-h-96::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover,
.max-h-80::-webkit-scrollbar-thumb:hover,
.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Message preview styling */
textarea {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}
</style>
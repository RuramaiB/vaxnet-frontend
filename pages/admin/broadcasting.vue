<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-8 overflow-hidden">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Direct SMS Broadcast</h1>
          <p class="text-gray-500 mt-1">Select recipients and send immunization reminders instantly.</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
            <span class="text-blue-700 font-bold text-lg">{{ selectedRecipients.length }}</span>
            <span class="text-blue-600/70 text-sm font-medium ml-1">selected</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Simple Parent Selection -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 class="text-lg font-bold text-gray-900">Parent Directory</h3>
            <button @click="toggleSelectAll" class="text-sm font-semibold text-blue-600 hover:text-blue-700">
              {{ allInFilteredSelected ? 'Deselect All' : 'Select All' }}
            </button>
          </div>
          
          <div class="p-4 border-b border-gray-100">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                v-model="parentSearchQuery"
                type="text"
                placeholder="Search by name or phone..."
                class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <div
              v-for="parent in displayedParents"
              :key="parent.id"
              @click="toggleSelection(parent)"
              :class="['group flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all',
                       isParentSelected(parent.id) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:border-gray-200']"
            >
              <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mr-4',
                            isParentSelected(parent.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300']">
                <CheckIcon v-if="isParentSelected(parent.id)" class="w-3.5 h-3.5 text-white stroke-[3px]" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-gray-900 truncate">{{ parent.firstname }} {{ parent.lastname }}</div>
                <div class="text-xs text-gray-500 font-medium">{{ parent.phoneNumber }}</div>
              </div>
              <div class="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {{ parent.city || 'Zimbabwe' }}
              </div>
            </div>

            <div v-if="displayedParents.length === 0" class="text-center py-20">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon class="h-8 w-8 text-gray-400" />
              </div>
              <p class="text-gray-500 font-medium">No parents found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Message Box -->
      <div class="lg:col-span-7">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">
          <div class="mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Compose Your Message</h3>
            <p class="text-sm text-gray-500">Keep it clear and professional. Character limits apply for standard SMS.</p>
          </div>

          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-wider">SMS Content</label>
            <div class="relative">
              <textarea
                v-model="messageContent"
                rows="10"
                class="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-lg leading-relaxed resize-none"
                placeholder="Type your message here..."
                maxlength="160"
              ></textarea>
              <div class="absolute bottom-4 right-6 text-sm font-bold" :class="messageContent.length > 140 ? 'text-orange-500' : 'text-gray-400'">
                {{ messageContent.length }} / 160
              </div>
            </div>
            
            <div class="mt-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div class="absolute top-0 right-0 p-8 opacity-10">
                <ChatBubbleBottomCenterTextIcon class="w-24 h-24" />
              </div>
              <div class="relative z-10">
                <div class="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Real-time Preview</div>
                <div class="text-lg font-medium leading-relaxed opacity-90 italic">
                  "{{ messageContent || 'Your message will appear here...' }}"
                </div>
                <div class="mt-6 flex items-center gap-6 border-t border-white/10 pt-6">
                  <div class="text-xs">
                    <span class="opacity-50 block uppercase tracking-widest mb-1">Recipients</span>
                    <span class="font-bold text-sm">{{ selectedRecipients.length > 0 ? selectedRecipients.length : 'Simulation Default' }}</span>
                  </div>
                  <div class="text-xs">
                    <span class="opacity-50 block uppercase tracking-widest mb-1">Segments</span>
                    <span class="font-bold text-sm">1 SMS</span>
                  </div>
                  <div class="ml-auto text-xs bg-white/10 px-3 py-1.5 rounded-full">
                    {{ selectedRecipients.length > 0 ? 'Estimated Cost: ' : 'Simulation Mode: ' }}
                    <span class="text-blue-300 font-bold">{{ selectedRecipients.length > 0 ? '$' + (selectedRecipients.length * 0.05).toFixed(2) : 'FREE (Testing)' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-gray-100 flex gap-4">
            <button
              @click="clearAll"
              class="px-8 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Clear All
            </button>
            <button
              @click="sendBroadcast"
              :disabled="!canSend"
              class="flex-1 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 py-4 flex items-center justify-center gap-2"
            >
              <PaperAirplaneIcon v-if="!isSending" class="w-6 h-6" />
              <svg v-else class="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSending ? 'Sending Broadcast...' : 'Initiate Broadcast' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-10 text-center animate-in zoom-in duration-300">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckBadgeIcon class="w-10 h-10 text-green-600" />
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p class="text-gray-500 mb-8">Successfully broadcasted to {{ lastSendCount }} recipients across Zimbabwe.</p>
        <button
          @click="showSuccessModal = false"
          class="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  CheckIcon,
  CheckBadgeIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline'
import { useToast } from '~/composables/useToast'

const { success: notifySuccess } = useToast()
const recipients = ref<any[]>([])
const selectedRecipients = ref<any[]>([])
const parentSearchQuery = ref('')
const messageContent = ref('')
const isSending = ref(false)
const showSuccessModal = ref(false)
const lastSendCount = ref(0)
/* ... existing helpers ... */
const displayedParents = computed(() => {
  return recipients.value.filter(p => {
    const q = parentSearchQuery.value.toLowerCase()
    return !q || 
      `${p.firstname} ${p.lastname}`.toLowerCase().includes(q) ||
      (p.phoneNumber && p.phoneNumber.includes(q))
  })
})

const allInFilteredSelected = computed(() => {
  if (displayedParents.value.length === 0) return false
  return displayedParents.value.every(p => isParentSelected(p.id))
})

const isParentSelected = (id: string | number) => {
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

const toggleSelectAll = () => {
  if (allInFilteredSelected.value) {
    const displayedIds = new Set(displayedParents.value.map(p => p.id))
    selectedRecipients.value = selectedRecipients.value.filter(r => !displayedIds.has(r.id))
  } else {
    displayedParents.value.forEach(p => {
      if (!isParentSelected(p.id)) selectedRecipients.value.push(p)
    })
  }
}

const canSend = computed(() => {
  return messageContent.value.trim().length > 0 && 
         !isSending.value
})

const fetchRecipients = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/get-all-users-by-/PARENT')
    const data = await response.json()
    recipients.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Failed to fetch parents', e)
  }
}

const sendBroadcast = async () => {
  if (!canSend.value) return
  isSending.value = true
  try {
    const response = await fetch('http://localhost:8080/api/broadcasting/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phones: selectedRecipients.value.map(r => r.phoneNumber).filter(Boolean),
        message: messageContent.value
      })
    })

    if (response.ok) {
      lastSendCount.value = selectedRecipients.value.length
      notifySuccess(`Broadcast successfully initiated to ${lastSendCount.value} parents.`)
      messageContent.value = ''
      selectedRecipients.value = []
    }
  } catch (e) {
    console.error('Failed to send broadcast', e)
    alert('Communication error. Please check your backend connection.')
  } finally {
    isSending.value = false
  }
}

const clearAll = () => {
  selectedRecipients.value = []
  messageContent.value = ''
}

onMounted(async () => {
  await fetchRecipients()
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
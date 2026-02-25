<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vaccine Management</h1>
          <p class="text-gray-600 mt-1">Manage vaccine inventory and distribution</p>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon class="h-5 w-5" />
          Add Vaccine
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UiStatCard
        title="Total Vaccines"
        :value="vaccines.length"
        subtitle="In the system"
        :icon="BeakerIcon"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100"
      />
      <UiStatCard
        title="In Distribution"
        :value="getStatusCount('In Distribution')"
        subtitle="Currently active"
        :icon="TruckIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Scheduled"
        :value="getStatusCount('Scheduled')"
        subtitle="Starting soon"
        :icon="CalendarIcon"
        icon-color="text-yellow-600"
        icon-bg-color="bg-yellow-100"
      />
      <UiStatCard
        title="Completed"
        :value="getStatusCount('Completed')"
        subtitle="Distribution ended"
        :icon="CheckCircleIcon"
        icon-color="text-purple-600"
        icon-bg-color="bg-purple-100"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search vaccines..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div class="flex gap-2">
          <button
            v-for="status in statusFilters"
            :key="status"
            @click="toggleStatusFilter(status)"
            :class="[
              'px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap',
              selectedStatuses.includes(status)
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ status }}
          </button>
        </div>
      </div>
    </div>

    <!-- Vaccines List -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="filteredVaccines.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <BeakerIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No vaccines found</h3>
      <p class="text-gray-600 mb-4">{{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first vaccine' }}</p>
      <button
        v-if="!searchQuery"
        @click="openAddModal"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
      >
        <PlusIcon class="h-5 w-5" />
        Add Vaccine
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="vaccine in filteredVaccines"
        :key="vaccine.vaccineID"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ vaccine.vaccineName }}</h3>
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    getStatusColor(getVaccineStatus(vaccine))
                  ]"
                >
                  {{ getVaccineStatus(vaccine) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ vaccine.manufacturer }}</p>
            </div>
          </div>

          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <GlobeAmericasIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-700">Origin: <span class="font-medium">{{ vaccine.countryOfOrigin }}</span></span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <ClipboardDocumentListIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-700">Doses Required: <span class="font-medium">{{ vaccine.requiredDoses }}</span></span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <FireIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-700">Storage: <span class="font-medium">{{ vaccine.storageTemperature }}</span></span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <UsersIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-700">Age Group: <span class="font-medium">{{ vaccine.ageGroup }}</span></span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <CalendarIcon class="h-4 w-4 text-gray-400" />
              <span class="text-gray-700">
                Distribution: <span class="font-medium">{{ formatDate(vaccine.startDate) }} - {{ formatDate(vaccine.endDate) }}</span>
              </span>
            </div>
          </div>

          <!-- Distribution Centers -->
          <div v-if="vaccine.distributionCenters && vaccine.distributionCenters.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Distribution Centers</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="center in vaccine.distributionCenters"
                :key="center"
                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {{ center }}
              </span>
            </div>
          </div>

          <!-- Progress Bar for In Distribution vaccines -->
          <div v-if="getVaccineStatus(vaccine) === 'In Distribution'" class="mb-4">
            <div class="flex justify-between text-xs text-gray-600 mb-1">
              <span>Distribution Progress</span>
              <span>{{ getDistributionProgress(vaccine) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: getDistributionProgress(vaccine) + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex gap-2 pt-4 border-t border-gray-100">
            <button
              @click="viewDetails(vaccine)"
              class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <EyeIcon class="h-4 w-4" />
              View Details
            </button>
            <button
              @click="openEditModal(vaccine)"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <PencilIcon class="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Vaccine Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-7xl mx-auto w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">
                {{ isEditMode ? 'Edit Vaccine' : 'Add New Vaccine' }}
              </h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vaccine Name *</label>
                <input
                  v-model="formData.vaccineName"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., COVID-19 mRNA"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
                <input
                  v-model="formData.manufacturer"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Pfizer-BioNTech"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country of Origin *</label>
                <input
                  v-model="formData.countryOfOrigin"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., United States"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Required Doses *</label>
                <input
                  v-model="formData.requiredDoses"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 2 doses, 21 days apart"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Storage Temperature *</label>
                <input
                  v-model="formData.storageTemperature"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., -70°C to -80°C"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Age Group *</label>
                <input
                  v-model="formData.ageGroup"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 18+ years"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Distribution Centers *</label>
              <p class="text-xs text-gray-500 mb-2">Select facilities where this vaccine will be distributed</p>
              <div class="space-y-2">
                <div
                  v-for="(center, index) in formData.distributionCenters"
                  :key="index"
                  class="flex gap-2"
                >
                  <select
                    v-model="formData.distributionCenters[index]"
                    required
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a facility</option>
                    <option 
                      v-for="facility in facilities" 
                      :key="facility.facilityID" 
                      :value="facility.facilityName"
                    >
                      {{ facility.facilityName }} - {{ facility.facilityDistrict }}
                    </option>
                  </select>
                  <button
                    v-if="formData.distributionCenters.length > 1"
                    type="button"
                    @click="removeDistributionCenter(index)"
                    class="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="addDistributionCenter"
                  class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <PlusIcon class="h-4 w-4" />
                  Add Another Facility
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  v-model="formData.endDate"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Saving...' : (isEditMode ? 'Update Vaccine' : 'Add Vaccine') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Vaccine Details Modal -->
    <Teleport to="body">
      <div
        v-if="showDetailsModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeDetailsModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">Vaccine Details</h2>
              <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <div v-if="selectedVaccine" class="p-6 space-y-6">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-bold text-gray-900">{{ selectedVaccine.vaccineName }}</h3>
                <span
                  :class="[
                    'px-3 py-1 text-sm font-semibold rounded-full',
                    getStatusColor(getVaccineStatus(selectedVaccine))
                  ]"
                >
                  {{ getVaccineStatus(selectedVaccine) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Manufacturer</h4>
                <p class="text-gray-900">{{ selectedVaccine.manufacturer }}</p>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Country of Origin</h4>
                <p class="text-gray-900">{{ selectedVaccine.countryOfOrigin }}</p>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Required Doses</h4>
                <p class="text-gray-900">{{ selectedVaccine.requiredDoses }}</p>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Storage Temperature</h4>
                <p class="text-gray-900">{{ selectedVaccine.storageTemperature }}</p>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Age Group</h4>
                <p class="text-gray-900">{{ selectedVaccine.ageGroup }}</p>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-500 mb-1">Distribution Period</h4>
                <p class="text-gray-900">
                  {{ formatDate(selectedVaccine.startDate) }} - {{ formatDate(selectedVaccine.endDate) }}
                </p>
              </div>
            </div>

            <div v-if="selectedVaccine.distributionCenters && selectedVaccine.distributionCenters.length > 0">
              <h4 class="text-sm font-semibold text-gray-500 mb-2">Distribution Centers</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="center in selectedVaccine.distributionCenters"
                  :key="center"
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg"
                >
                  {{ center }}
                </span>
              </div>
            </div>

            <div v-if="getVaccineStatus(selectedVaccine) === 'In Distribution'">
              <h4 class="text-sm font-semibold text-gray-500 mb-2">Distribution Progress</h4>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="bg-green-600 h-3 rounded-full flex items-center justify-end pr-2"
                  :style="{ width: getDistributionProgress(selectedVaccine) + '%' }"
                >
                  <span class="text-xs text-white font-semibold">{{ getDistributionProgress(selectedVaccine) }}%</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                {{ getDaysRemaining(selectedVaccine) }} days remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BeakerIcon,
  TruckIcon,
  CalendarIcon,
  CheckCircleIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon,
  FireIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'

interface Vaccine {
  vaccineID?: string
  vaccineName: string
  manufacturer: string
  countryOfOrigin: string
  requiredDoses: string
  storageTemperature: string
  ageGroup: string
  distributionCenters: string[]
  startDate: string
  endDate: string
}

const vaccines = ref<Vaccine[]>([])
const facilities = ref<any[]>([])
const loading = ref(true)
const loadingFacilities = ref(true)
const searchQuery = ref('')
const selectedStatuses = ref<string[]>(['Scheduled', 'In Distribution', 'Completed'])
const statusFilters = ['Scheduled', 'In Distribution', 'Completed']

// Modal state
const showModal = ref(false)
const showDetailsModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const selectedVaccine = ref<Vaccine | null>(null)

const formData = ref<Vaccine>({
  vaccineName: '',
  manufacturer: '',
  countryOfOrigin: '',
  requiredDoses: '',
  storageTemperature: '',
  ageGroup: '',
  distributionCenters: [''],
  startDate: '',
  endDate: ''
})

const filteredVaccines = computed(() => {
  return vaccines.value.filter(vaccine => {
    const matchesSearch = 
      vaccine.vaccineName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      vaccine.manufacturer?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const status = getVaccineStatus(vaccine)
    const matchesStatus = selectedStatuses.value.includes(status)
    
    return matchesSearch && matchesStatus
  })
})

// Fetch vaccines from API
const fetchVaccines = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:8080/api/vaccines/get-all-vaccines')
    const data = await response.json()
    
    if (Array.isArray(data)) {
      vaccines.value = data
    } else if (data.vaccines && Array.isArray(data.vaccines)) {
      vaccines.value = data.vaccines
    }
  } catch (error) {
    console.error('Error fetching vaccines:', error)
  } finally {
    loading.value = false
  }
}

// Fetch facilities from API
const fetchFacilities = async () => {
  try {
    loadingFacilities.value = true
    const response = await fetch('http://localhost:8080/api/facilities/get-all-facilities')
    const data = await response.json()
    
    if (Array.isArray(data)) {
      facilities.value = data.filter(f => f.status === 'Active')
    } else if (data.facilities && Array.isArray(data.facilities)) {
      facilities.value = data.facilities.filter(f => f.status === 'Active')
    }
  } catch (error) {
    console.error('Error fetching facilities:', error)
  } finally {
    loadingFacilities.value = false
  }
}

// Get vaccine status based on dates
const getVaccineStatus = (vaccine: Vaccine): string => {
  const now = new Date()
  const startDate = new Date(vaccine.startDate)
  const endDate = new Date(vaccine.endDate)
  
  if (now < startDate) {
    return 'Scheduled'
  } else if (now >= startDate && now <= endDate) {
    return 'In Distribution'
  } else {
    return 'Completed'
  }
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Scheduled':
      return 'bg-yellow-100 text-yellow-800'
    case 'In Distribution':
      return 'bg-green-100 text-green-800'
    case 'Completed':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusCount = (status: string): number => {
  return vaccines.value.filter(v => getVaccineStatus(v) === status).length
}

const getDistributionProgress = (vaccine: Vaccine): number => {
  const now = new Date()
  const startDate = new Date(vaccine.startDate)
  const endDate = new Date(vaccine.endDate)
  
  const totalDuration = endDate.getTime() - startDate.getTime()
  const elapsed = now.getTime() - startDate.getTime()
  
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
  return Math.round(progress)
}

const getDaysRemaining = (vaccine: Vaccine): number => {
  const now = new Date()
  const endDate = new Date(vaccine.endDate)
  
  const diff = endDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const toggleStatusFilter = (status: string) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }
}

// Modal functions
const openAddModal = () => {
  isEditMode.value = false
  formData.value = {
    vaccineName: '',
    manufacturer: '',
    countryOfOrigin: '',
    requiredDoses: '',
    storageTemperature: '',
    ageGroup: '',
    distributionCenters: [''],
    startDate: '',
    endDate: ''
  }
  showModal.value = true
}

const openEditModal = (vaccine: Vaccine) => {
  isEditMode.value = true
  formData.value = {
    ...vaccine,
    distributionCenters: [...vaccine.distributionCenters],
    vaccineID: vaccine.vaccineID
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const addDistributionCenter = () => {
  formData.value.distributionCenters.push('')
}

const removeDistributionCenter = (index: number) => {
  formData.value.distributionCenters.splice(index, 1)
}

const submitForm = async () => {
  try {
    submitting.value = true
    
    // Filter out empty distribution centers
    const cleanedData = {
      ...formData.value,
      distributionCenters: formData.value.distributionCenters.filter(c => c.trim() !== '')
    }

    if (isEditMode.value) {
      // Update vaccine
      const response = await fetch(`http://localhost:8080/api/vaccines/edit-vaccine/${formData.value.vaccineID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      })

      if (response.ok) {
        alert('Vaccine updated successfully!')
        await fetchVaccines()
        closeModal()
      } else {
        alert('Failed to update vaccine')
      }
    } else {
      // Add new vaccine
      const response = await fetch('http://localhost:8080/api/vaccines/add-new-vaccine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      })

      if (response.ok) {
        alert('Vaccine added successfully!')
        await fetchVaccines()
        closeModal()
      } else {
        alert('Failed to add vaccine')
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('An error occurred. Please try again.')
  } finally {
    submitting.value = false
  }
}

const viewDetails = (vaccine: Vaccine) => {
  selectedVaccine.value = vaccine
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedVaccine.value = null
}

onMounted(async () => {
  await Promise.all([fetchVaccines(), fetchFacilities()])
})
</script>

<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vaccination Records Management</h1>
          <p class="text-gray-600 mt-1">Manage and track all vaccination records</p>
        </div>
        <button
          @click="showAddVaccinationModal = true"
          class="bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Vaccination Record
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <UiStatCard
        title="Total Vaccinations"
        :value="vaccinationRecords.length"
        subtitle="Records logged"
        :icon="UserGroupIcon"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100"
      />
      <UiStatCard
        title="Today's Vaccinations"
        :value="todayVaccinations"
        subtitle="Administered today"
        :icon="CheckCircleIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Upcoming Vaccinations"
        :value="upcomingVaccinations"
        subtitle="Scheduled"
        :icon="ClockIcon"
        icon-color="text-yellow-600"
        icon-bg-color="bg-yellow-100"
      />
      <UiStatCard
        title="Facilities"
        :value="facilities.length"
        subtitle="Active facilities"
        :icon="BuildingOfficeIcon"
        icon-color="text-purple-600"
        icon-bg-color="bg-purple-100"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600">Loading vaccination records...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <ExclamationCircleIcon class="h-6 w-6 text-red-600 mr-3" />
        <div>
          <h3 class="font-semibold text-red-800">Error loading data</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
          <button
            @click="fetchData"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by child name or vaccine..."
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Facility</label>
          <select
            v-model="facilityFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Facilities</option>
            <option v-for="facility in facilities" :key="facility.facilityID" :value="facility.facilityID">
              {{ facility.facilityName }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Vaccine Type</label>
          <select
            v-model="vaccineFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Vaccines</option>
            <option v-for="vaccine in vaccines" :key="vaccine.id" :value="vaccine.id">
              {{ vaccine.vaccineName }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            v-model="dateRangeFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Vaccination Records Table -->
    <div v-if="!loading && !error" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Child Details
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vaccine Details
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facility
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="record in filteredVaccinationRecords"
              :key="record.vaccinationId"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getChildFullName(record.childT?.birthCertificationUser) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ getChildDOB(record.childT?.birthCertificationUser) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ getVaccineName(record.vaccineT?.vaccineUp) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ record.vaccine?.ageGroup || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ record.facility.facilityName }}
                </div>
                <div class="text-xs text-gray-500">
                  {{record.facility.facilityAddress }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(record.vaccinationDate) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ record.vaccinatedAt }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    record.status === 'completed' ? 'bg-green-100 text-green-800' :
                    record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    record.status === 'missed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ record.status || 'pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewRecordDetails(record)"
                  class="text-primary-600 hover:text-primary-900 mr-4"
                >
                  View Details
                </button>
                <!-- <button
                  @click="editVaccinationRecord(record)"
                  class="text-green-600 hover:text-green-900"
                >
                  Edit
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredVaccinationRecords.length === 0" class="text-center py-12">
        <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No vaccination records found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ filteredVaccinationRecords.length }}</span> of <span class="font-medium">{{ vaccinationRecords.length }}</span> records
      </div>
    </div>

    <!-- Add/Edit Vaccination Record Modal -->
    <div v-if="showAddVaccinationModal || showEditVaccinationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Vaccination Record' : 'Add New Vaccination Record' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form @submit.prevent="saveVaccinationRecord" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Child Selection -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Child Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Child *
                </label>
                <select
                  v-model="vaccinationForm.birthCertificateNumber"
                  required
                  @change="onChildSelect"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a child</option>
                  <option 
                    v-for="child in children" 
                    :key="child.birthCertificateNumber"
                    :value="child.birthCertificateNumber"
                  >
                    {{ child.firstName }} {{ child.lastName }} - DOB: {{ formatDate(child.dateOfBirth) }}
                  </option>
                </select>
              </div>
              
              <div v-if="selectedChild" class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date of Birth:</span>
                  <span class="font-medium">{{ formatDate(selectedChild.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gender:</span>
                  <span class="font-medium">{{ selectedChild.gender || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Weight:</span>
                  <span class="font-medium">{{ selectedChild.birthWeight || 'N/A' }} kg</span>
                </div>
              </div>
            </div>
            
            <!-- Vaccine Selection -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Vaccine Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Vaccine *
                </label>
                <select
                  v-model="vaccinationForm.vaccineID"
                  required
                  @change="onVaccineSelect"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a vaccine</option>
                  <option 
                    v-for="vaccine in vaccines" 
                    :key="vaccine.vaccineID "
                    :value="vaccine.vaccineID "
                  >
                    {{ vaccine.vaccineName  }} - {{ vaccine.ageGroup }}
                  </option>
                </select>
              </div>
              
              <div v-if="selectedVaccine" class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Age Group:</span>
                  <span class="font-medium">{{ selectedVaccine.ageGroup }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Manufacturer:</span>
                  <span class="font-medium">{{ selectedVaccine.manufacturer }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Doses Required:</span>
                  <span class="font-medium">{{ selectedVaccine.requiredDoses || 1 }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Facility Selection -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Facility Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Facility *
                </label>
                <select
                  v-model="vaccinationForm.facilityID"
                  required
                  @change="onFacilitySelect"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a facility</option>
                  <option 
                    v-for="facility in facilities" 
                    :key="facility.facilityID"
                    :value="facility.facilityID"
                  >
                    {{ facility.facilityName }} - {{ facility.facilityType }}
                  </option>
                </select>
              </div>
              
              <div v-if="selectedFacility" class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium">{{ selectedFacility.facilityAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ selectedFacility.facilityPhone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="font-medium">{{ selectedFacility.facilityType }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vaccination Details -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Vaccination Details</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vaccination Date *
                </label>
                <input
                  v-model="vaccinationForm.vaccinationDate"
                  type="date"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  v-model="vaccinationForm.status"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div class="mt-6 space-y-4">
            <h4 class="font-semibold text-gray-900">Additional Information</h4>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                v-model="vaccinationForm.notes"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any additional notes or observations..."
              ></textarea>
            </div>
          </div>
          
          <!-- Modal Actions -->
          <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isEditing ? 'Update Record' : 'Save Record' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Record Details Modal -->
    <div v-if="selectedRecord" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedRecord.child.firstName }} {{ selectedRecord.child.lastName }}</h3>
              <p class="text-gray-600">{{ selectedRecord.vaccinationID }}</p>
            </div>
            <button
              @click="selectedRecord = null"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Child Information -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Child Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Name:</span>
                  <span class="font-medium">{{ getChildFullName(selectedRecord.childT?.birthCertificationUser) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date of Birth:</span>
                  <span class="font-medium">{{ getChildDOB(selectedRecord.childT?.birthCertificationUser) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Certificate:</span>
                  <span class="font-medium">{{ selectedRecord.child?.birthCertificateNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vaccine Information -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Vaccine Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Vaccine Name:</span>
                  <span class="font-medium">{{ selectedRecord.vaccine?.vaccineName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Manufacturer:</span>
                  <span class="font-medium">{{ selectedRecord.vaccine?.manufacturer || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Age Group:</span>
                  <span class="font-medium">{{ selectedRecord.vaccine?.ageGroup || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Facility Information -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Facility Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Facility Name:</span>
                  <span class="font-medium">{{ getFacilityName(selectedRecord.facility.facilityID) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium">{{ getFacilityAddress(selectedRecord.facility.facilityID) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ getFacilityPhone(selectedRecord.facility.facilityID) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vaccination Details -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Vaccination Details</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date:</span>
                  <span class="font-medium">{{ formatDate(selectedRecord.vaccinationDate) }}</span>
                </div>
               
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="font-medium capitalize">{{ selectedRecord.status || 'pending' }}</span>
                </div>
                
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          <div v-if="selectedRecord.notes" class="mt-6 bg-gray-50 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">Additional Notes</h4>
            <p class="text-gray-700">{{ selectedRecord.notes }}</p>
          </div>
          
          <!-- Actions -->
          <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              @click="editSelectedRecord"
              class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700"
            >
              Edit Record
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
  InboxIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

// Reactive state
const loading = ref(false)
const error = ref('')
const vaccinationRecords = ref<any[]>([])
const children = ref<any[]>([])
const vaccines = ref<any[]>([])
const facilities = ref<any[]>([])

// Filter states
const searchQuery = ref('')
const facilityFilter = ref('all')
const vaccineFilter = ref('all')
const dateRangeFilter = ref('all')

// Modal states
const showAddVaccinationModal = ref(false)
const showEditVaccinationModal = ref(false)
const selectedRecord = ref<any>(null)
const saving = ref(false)

// Form state
const vaccinationForm = ref({
  birthCertificateNumber: '',
  vaccineID: '',
  facilityID: '',
  vaccinationDate: '',
  vaccinatedAt: '',
  status: 'completed',
  batchNumber: '',
  administeredBy: '',
  notes: ''
})

// Computed properties
const selectedChild = computed(() => {
  return children.value.find(c => c.birthCertificateNumber === vaccinationForm.value.birthCertificateNumber || c.id === vaccinationForm.value.birthCertificateNumber)
})

const selectedVaccine = computed(() => {
  return vaccines.value.find(v => v.vaccineID === vaccinationForm.value.vaccineID || v.vaccination === vaccinationForm.value.vaccineID)
})

const selectedFacility = computed(() => {
  return facilities.value.find(f => f.facilityID === vaccinationForm.value.facilityID)
})

const isEditing = computed(() => showEditVaccinationModal.value)

const todayVaccinations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return vaccinationRecords.value.filter(r => r.vaccinationDate === today).length
})

const upcomingVaccinations = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  return vaccinationRecords.value.filter(r => {
    const recordDate = new Date(r.vaccinationDate)
    return recordDate > today && recordDate <= nextWeek && r.status === 'scheduled'
  }).length
})

const filteredVaccinationRecords = computed(() => {
  let filtered = [...vaccinationRecords.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => {
      const childName = getChildFullName(record.childT?.birthCertificationUser).toLowerCase()
      const vaccineName = getVaccineName(record.vaccineT?.vaccineUp).toLowerCase()
      return childName.includes(query) || vaccineName.includes(query)
    })
  }

  // Facility filter
  if (facilityFilter.value !== 'all') {
    filtered = filtered.filter(record => record.facilityID === facilityFilter.value)
  }

  // Vaccine filter
  if (vaccineFilter.value !== 'all') {
    filtered = filtered.filter(record => record.vaccineID === vaccineFilter.value)
  }

  // Date range filter
  if (dateRangeFilter.value !== 'all') {
    const today = new Date()
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.vaccinationDate)
      
      switch (dateRangeFilter.value) {
        case 'today':
          return recordDate.toDateString() === today.toDateString()
        case 'week':
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          return recordDate >= startOfWeek
        case 'month':
          return recordDate.getMonth() === today.getMonth() && 
                 recordDate.getFullYear() === today.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered
})

// Helper functions
const getChildFullName = (childId: string) => {
  const child = children.value.find(c => c.birthCertificationUser === childId || c.id === childId)
  return child ? `${child.firstName} ${child.lastName}` : 'Unknown Child'
}

const getChildDOB = (childId: string) => {
  const child = children.value.find(c => c.birthCertificationUser === childId || c.id === childId)
  return child ? formatDate(child.dateOfBirth) : 'N/A'
}

const getVaccineName = (vaccineID: string) => {
  const vaccine = vaccines.value.find(v => v.id === vaccineID || v.vaccination === vaccineID)
  return vaccine ? (vaccine.vaccineName || vaccine.vaccinations) : 'Unknown Vaccine'
}

const getFacilityName = (facilityID: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityID)
  return facility ? facility.facilityName : 'Unknown Facility'
}

const getFacilityLocation = (facilityID: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityID)
  return facility ? (facility.location || facility.facilityAddress) : 'N/A'
}

const getFacilityAddress = (facilityID: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityID)
  return facility ? facility.facilityAddress : 'N/A'
}

const getFacilityPhone = (facilityID: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityID)
  return facility ? facility.facilityPhone : 'N/A'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Event handlers
const onChildSelect = () => {
  // You can add additional logic here if needed
}

const onVaccineSelect = () => {
  // You can add additional logic here if needed
}

const onFacilitySelect = () => {
  // You can add additional logic here if needed
}

const viewRecordDetails = (record: any) => {
  selectedRecord.value = record
}

const editSelectedRecord = () => {
  showEditVaccinationModal.value = true
  populateEditForm(selectedRecord.value)
  selectedRecord.value = null
}

const editVaccinationRecord = (record: any) => {
  showEditVaccinationModal.value = true
  populateEditForm(record)
}

const populateEditForm = (record: any) => {
  vaccinationForm.value = {
    birthCertificateNumber: record.child.birthCertificateNumber,
    vaccineID: record.vaccineT?.vaccineUp || record.vaccineID || '',
    facilityID: record.facilityID || '',
    vaccinationDate: record.vaccinationDate || '',
    vaccinatedAt: record.vaccinatedAt || '',
    status: record.status || 'completed',
    batchNumber: record.vaccineT?.batchNumber || record.batchNumber || '',
    administeredBy: record.administeredBy || '',
    notes: record.notes || ''
  }
}

const closeModal = () => {
  showAddVaccinationModal.value = false
  showEditVaccinationModal.value = false
  selectedRecord.value = null
  resetForm()
}

const resetForm = () => {
  vaccinationForm.value = {
    birthCertificateNumber: '',
    vaccineID: '',
    facilityID: '',
    vaccinationDate: new Date().toISOString().split('T')[0],
    vaccinatedAt: '',
    status: 'completed',
    batchNumber: '',
    administeredBy: '',
    notes: ''
  }
}

// API functions
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Fetch all data in parallel
    const [vaccinationsRes, childrenRes, vaccinesRes, facilitiesRes] = await Promise.allSettled([
      $fetch('http://localhost:8080/api/vaccinations/get-all-vaccination-records'),
      $fetch('http://localhost:8080/api/children/get-all-children'),
      $fetch('http://localhost:8080/api/vaccines/get-all-vaccines'),
      $fetch('http://localhost:8080/api/facilities/get-all-facilities')
    ])

    // Handle vaccination records
    if (vaccinationsRes.status === 'fulfilled') {
      vaccinationRecords.value = Array.isArray(vaccinationsRes.value) ? vaccinationsRes.value : []
    } else {
      console.error('Failed to fetch vaccination records:', vaccinationsRes.reason)
      vaccinationRecords.value = []
    }

    // Handle children
    if (childrenRes.status === 'fulfilled') {
      children.value = Array.isArray(childrenRes.value) ? childrenRes.value : []
    } else {
      console.error('Failed to fetch children:', childrenRes.reason)
      children.value = []
    }

    // Handle vaccines
    if (vaccinesRes.status === 'fulfilled') {
      vaccines.value = Array.isArray(vaccinesRes.value) ? vaccinesRes.value : []
    } else {
      console.error('Failed to fetch vaccines:', vaccinesRes.reason)
      vaccines.value = []
    }

    // Handle facilities
    if (facilitiesRes.status === 'fulfilled') {
      facilities.value = Array.isArray(facilitiesRes.value) ? facilitiesRes.value : []
    } else {
      console.error('Failed to fetch facilities:', facilitiesRes.reason)
      facilities.value = []
    }

  } catch (err: any) {
    error.value = err.message || 'Failed to fetch data'
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

const saveVaccinationRecord = async () => {
  saving.value = true
  
  try {
    const payload = {
      birthCertificateNumber: vaccinationForm.value.birthCertificateNumber,
      vaccineID: vaccinationForm.value.vaccineID,
      facilityID: vaccinationForm.value.facilityID,
      vaccinationDate: vaccinationForm.value.vaccinationDate,
      vaccinatedAt: vaccinationForm.value.vaccinatedAt,
      status: vaccinationForm.value.status,
      narration: vaccinationForm.value.notes
    }

    if (isEditing.value) {
      // For editing, you would typically need the record ID
      // Since we don't have it in the form, this is for adding only
      // You would need to implement edit functionality separately
      alert('Edit functionality needs to be implemented with record ID')
    } else {
      const response = await $fetch('http://localhost:8080/api/vaccinations/add-new-vaccination-record', {
        method: 'POST',
        body: payload
      })
      
      if (response) {
        // Refresh the data
        await fetchData()
        closeModal()
      }
    }
  } catch (err: any) {
    alert(`Error saving vaccination record: ${err.message}`)
    console.error('Error saving vaccination record:', err)
  } finally {
    saving.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchData()
  resetForm()
})
</script>
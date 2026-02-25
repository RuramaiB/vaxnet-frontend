<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Facility Locator</h1>
          <p class="text-gray-600 mt-1">Find healthcare facilities across Zimbabwe</p>
        </div>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon class="h-5 w-5" />
          Add Facility
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <UiStatCard
        title="Total Facilities"
        :value="facilities.length"
        subtitle="Across all provinces"
        :icon="BuildingOfficeIcon"
        icon-color="text-primary-600"
        icon-bg-color="bg-primary-100"
      />
      <UiStatCard
        title="Active Today"
        :value="facilities.filter(f => f.status === 'Active').length"
        subtitle="Currently operational"
        :icon="CheckCircleIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Average Wait Time"
        value="25 min"
        subtitle="Across all facilities"
        :icon="ClockIcon"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100"
      />
    </div>

    <div class="lg:flex lg:space-x-6">
      <!-- Sidebar for facilities -->
      <div class="lg:w-1/3 mb-6 lg:mb-0">
        <UiCard class="h-full">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">All Facilities</h3>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in facilityTypes"
                  :key="type"
                  @click="toggleFilter(type)"
                  :class="[
                    'px-3 py-1.5 text-sm rounded-full transition-colors',
                    selectedTypes.includes(type)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ type }}
                </button>
              </div>
            </div>

            <div class="relative mb-4">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or city..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div v-if="loading" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>

            <div v-else class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div
                v-for="facility in filteredFacilities"
                :key="facility.facilityID"
                class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                :class="{ 'border-primary-400 bg-primary-50': selectedFacility?.facilityID === facility.facilityID }"
                @click="selectFacility(facility)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-semibold text-gray-900 group-hover:text-primary-700">{{ facility.facilityName }}</h4>
                      <span
                        :class="[
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          facility.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ facility.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-2">{{ facility.facilityDistrict }}</p>
                    <p class="text-sm text-gray-500 mb-3">{{ facility.facilityAddress }}</p>
                    
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <div class="flex items-center gap-1">
                        <UserIcon class="h-4 w-4" />
                        <span>{{ facility.facilityType }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <PhoneIcon class="h-4 w-4" />
                        <span>{{ facility.facilityPhone }}</span>
                      </div>
                    </div>

                    <button
                      @click.stop="openEditModal(facility)"
                      class="mt-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <PencilIcon class="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                  <MapPinIcon class="h-5 w-5 text-gray-400 group-hover:text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>

      <!-- Map Container -->
      <div class="lg:w-2/3 h-[600px] z-40">
        <div class="relative w-full h-full rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div id="map" class="w-full h-full"></div>
          
          <!-- Map Controls -->
          <div class="absolute top-4 right-4 space-y-2">
            <button
              @click="resetView"
              class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Reset View"
            >
              <ArrowsPointingOutIcon class="h-5 w-5 text-gray-700" />
            </button>
            <button
              @click="locateUser"
              class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Find My Location"
            >
              <MapPinIcon class="h-5 w-5 text-primary-600" />
            </button>
          </div>
          
          <!-- Map Legend -->
          <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">Facility Types</h4>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <span class="text-xs text-gray-700">Hospital</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-xs text-gray-700">Clinic</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-xs text-gray-700">Health Center</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                <span class="text-xs text-gray-700">Private</span>
              </div>
            </div>
          </div>
          
          <!-- Selected Facility Info -->
          <div
            v-if="selectedFacility"
            class="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-gray-900">{{ selectedFacility.facilityName }}</h3>
              <button
                @click="selectedFacility = null"
                class="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ selectedFacility.facilityAddress }}</p>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <PhoneIcon class="h-4 w-4 text-gray-500" />
                <span class="text-gray-700">{{ selectedFacility.facilityPhone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <BuildingOfficeIcon class="h-4 w-4 text-gray-500" />
                <span class="text-gray-700">{{ selectedFacility.facilityType }} • {{ selectedFacility.facilityDistrict }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Facility Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">
                {{ isEditMode ? 'Edit Facility' : 'Add New Facility' }}
              </h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
              <input
                v-model="formData.facilityName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter facility name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Facility Address *</label>
              <input
                v-model="formData.facilityAddress"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter facility address"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                v-model="formData.facilityPhone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+263 XXX XXX XXX"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Facility Type *</label>
                <select
                  v-model="formData.facilityType"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select type</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Health Center">Health Center</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  v-model="formData.status"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <select
                v-model="formData.facilityDistrict"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select district</option>
                <option v-for="district in zimbabweDistricts" :key="district" :value="district">
                  {{ district }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Facility Coordinates *</label>
              <div class="flex gap-2">
                <input
                  v-model="formData.facilityCoordinates"
                  type="text"
                  required
                  readonly
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Click 'Pick Location' to select coordinates"
                />
                <button
                  type="button"
                  @click="openCoordinatePicker"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <MapPinIcon class="h-5 w-5" />
                  Pick Location
                </button>
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
                {{ submitting ? 'Saving...' : (isEditMode ? 'Update Facility' : 'Add Facility') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Coordinate Picker Modal -->
    <Teleport to="body">
      <div
        v-if="showCoordinatePicker"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
        @click.self="closeCoordinatePicker"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-900">Pick Facility Location</h2>
              <button @click="closeCoordinatePicker" class="text-gray-400 hover:text-gray-600">
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-1">Click on the map or search for a location</p>
          </div>

          <div class="p-4 border-b border-gray-200">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="locationSearch"
                @keyup.enter="searchLocation"
                type="text"
                placeholder="Search for a location..."
                class="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                @click="searchLocation"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
              >
                Search
              </button>
            </div>
            <div v-if="tempCoordinates" class="mt-2 text-sm text-gray-600">
              Selected: {{ tempCoordinates }}
            </div>
          </div>

          <div class="flex-1 relative">
            <div id="coordinate-map" class="w-full h-full"></div>
          </div>

          <div class="p-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              @click="closeCoordinatePicker"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="confirmCoordinates"
              :disabled="!tempCoordinates"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
  ArrowsPointingOutIcon,
  PhoneIcon,
  UserIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'

// Zimbabwe districts
const zimbabweDistricts = [
  // Harare Metropolitan
  'Harare', 'Chitungwiza', 'Epworth',
  // Bulawayo Metropolitan
  'Bulawayo',
  // Manicaland
  'Chimanimani', 'Chipinge', 'Makoni', 'Mutare', 'Mutasa', 'Nyanga', 'Buhera',
  // Mashonaland Central
  'Bindura', 'Guruve', 'Mbire', 'Mazowe', 'Mount Darwin', 'Muzarabani', 'Rushinga', 'Shamva',
  // Mashonaland East
  'Chikomba', 'Goromonzi', 'Marondera', 'Mudzi', 'Murehwa', 'Mutoko', 'Seke', 'UMP',
  // Mashonaland West
  'Chegutu', 'Hurungwe', 'Kariba', 'Makonde', 'Zvimba',
  // Masvingo
  'Bikita', 'Chiredzi', 'Chivi', 'Gutu', 'Masvingo', 'Mwenezi', 'Zaka',
  // Matabeleland North
  'Binga', 'Bubi', 'Hwange', 'Lupane', 'Nkayi', 'Tsholotsho', 'Umguza',
  // Matabeleland South
  'Beitbridge', 'Bulilima', 'Gwanda', 'Insiza', 'Mangwe', 'Matobo', 'Umzingwane',
  // Midlands
  'Chirumhanzu', 'Gokwe North', 'Gokwe South', 'Gweru', 'Kwekwe', 'Mberengwa', 'Shurugwi', 'Zvishavane'
]

// Fix for default marker icons
if (process.client) {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png'
  })
}

const facilities = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedFacility = ref<any>(null)
const selectedTypes = ref<string[]>(['Hospital', 'Clinic', 'Health Center', 'Private'])
const facilityTypes = ['Hospital', 'Clinic', 'Health Center', 'Private']

// Modal state
const showModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formData = ref<any>({
  facilityName: '',
  facilityAddress: '',
  facilityPhone: '',
  facilityDistrict: '',
  facilityType: '',
  status: '',
  facilityCoordinates: '',
  facilityID: null
})

// Coordinate picker state
const showCoordinatePicker = ref(false)
const tempCoordinates = ref('')
const locationSearch = ref('')

let map: L.Map
let coordinatePickerMap: L.Map
let markers: L.Marker[] = []
let tempMarker: L.Marker | null = null

const filteredFacilities = computed(() => {
  return facilities.value.filter(f => {
    const matchesSearch = f.facilityName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         f.facilityDistrict?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = selectedTypes.value.includes(f.facilityType)
    return matchesSearch && matchesType
  })
})

// Fetch facilities from API
const fetchFacilities = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:8080/api/facilities/get-all-facilities')
    const data = await response.json()
    
    if (Array.isArray(data)) {
      facilities.value = data
    } else if (data.facilities && Array.isArray(data.facilities)) {
      facilities.value = data.facilities
    }
  } catch (error) {
    console.error('Error fetching facilities:', error)
  } finally {
    loading.value = false
  }
}

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'Hospital': return '#ef4444'
    case 'Clinic': return '#3b82f6'
    case 'Health Center': return '#22c55e'
    case 'Private': return '#a855f7'
    default: return '#6b7280'
  }
}

const createIcon = (type: string) => {
  return L.divIcon({
    html: `
      <div class="relative">
        <svg class="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24">
          <path fill="${getMarkerColor(type)}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })
}

const parseCoordinates = (coords: string) => {
  if (!coords) return null
  
  // Try parsing lat,lng format
  const parts = coords.split(',').map(p => parseFloat(p.trim()))
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] }
  }
  
  return null
}

const initMap = () => {
  if (!process.client) return

  map = L.map('map').setView([-19.0154, 29.1549], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  addMarkers()
}

const addMarkers = () => {
  if (!map) return
  
  markers.forEach(marker => map.removeLayer(marker))
  markers = []

  filteredFacilities.value.forEach(facility => {
    const coords = parseCoordinates(facility.facilityCoordinates)
    if (!coords) return

    const marker = L.marker([coords.lat, coords.lng], {
      icon: createIcon(facility.facilityType)
    }).addTo(map)
    
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-gray-900">${facility.facilityName}</h3>
        <p class="text-sm text-gray-600">${facility.facilityAddress}</p>
        <p class="text-sm text-gray-500">${facility.facilityDistrict}</p>
        <div class="mt-2 flex items-center justify-between">
          <span class="px-2 py-1 text-xs rounded-full ${
            facility.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }">${facility.status}</span>
          <span class="text-xs text-gray-500">${facility.facilityType}</span>
        </div>
      </div>
    `)
    
    marker.on('click', () => {
      selectFacility(facility)
    })
    
    markers.push(marker)
  })
}

const selectFacility = (facility: any) => {
  selectedFacility.value = facility
  const coords = parseCoordinates(facility.facilityCoordinates)
  if (coords && map) {
    map.setView([coords.lat, coords.lng], 14)
  }
}

const resetView = () => {
  selectedFacility.value = null
  if (map) {
    map.setView([-19.0154, 29.1549], 7)
  }
}

const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      if (map) {
        map.setView([latitude, longitude], 12)
        L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: '<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>',
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(map).bindPopup('Your location').openPopup()
      }
    })
  }
}

const toggleFilter = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

// Modal functions
const openAddModal = () => {
  isEditMode.value = false
  formData.value = {
    facilityName: '',
    facilityAddress: '',
    facilityPhone: '',
    facilityDistrict: '',
    facilityType: '',
    status: 'Active',
    facilityCoordinates: ''
  }
  showModal.value = true
}

const openEditModal = (facility: any) => {
  isEditMode.value = true
  formData.value = {
    facilityName: facility.facilityName,
    facilityAddress: facility.facilityAddress,
    facilityPhone: facility.facilityPhone,
    facilityDistrict: facility.facilityDistrict,
    facilityType: facility.facilityType,
    status: facility.status,
    facilityCoordinates: facility.facilityCoordinates,
    facilityID: facility.facilityID
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = {
    facilityName: '',
    facilityAddress: '',
    facilityPhone: '',
    facilityDistrict: '',
    facilityType: '',
    status: '',
    facilityCoordinates: ''
  }
}

const submitForm = async () => {
  try {
    submitting.value = true
    
    const payload = {
      facilityName: formData.value.facilityName,
      facilityAddress: formData.value.facilityAddress,
      facilityPhone: formData.value.facilityPhone,
      facilityDistrict: formData.value.facilityDistrict,
      facilityType: formData.value.facilityType,
      status: formData.value.status,
      facilityCoordinates: formData.value.facilityCoordinates
    }

    if (isEditMode.value) {
      // Update existing facility
      const response = await fetch(`http://localhost:8080/api/facilities/edit-facility/${formData.value.facilityID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert('Facility updated successfully!')
        await fetchFacilities()
        closeModal()
        if (map) {
          addMarkers()
        }
      } else {
        alert('Failed to update facility')
      }
    } else {
      // Add new facility
      const response = await fetch('http://localhost:8080/api/facilities/add-new-facility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert('Facility added successfully!')
        await fetchFacilities()
        closeModal()
        if (map) {
          addMarkers()
        }
      } else {
        alert('Failed to add facility')
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('An error occurred. Please try again.')
  } finally {
    submitting.value = false
  }
}

// Coordinate picker functions
const openCoordinatePicker = async () => {
  showCoordinatePicker.value = true
  tempCoordinates.value = formData.value.facilityCoordinates
  
  await nextTick()
  initCoordinatePicker()
}

const closeCoordinatePicker = () => {
  showCoordinatePicker.value = false
  tempCoordinates.value = ''
  locationSearch.value = ''
  if (coordinatePickerMap) {
    coordinatePickerMap.remove()
    coordinatePickerMap = null as any
  }
  if (tempMarker) {
    tempMarker = null
  }
}

const initCoordinatePicker = () => {
  if (!process.client) return

  coordinatePickerMap = L.map('coordinate-map').setView([-19.0154, 29.1549], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(coordinatePickerMap)

  // If editing and coordinates exist, show them
  if (tempCoordinates.value) {
    const coords = parseCoordinates(tempCoordinates.value)
    if (coords) {
      placeMarker(coords.lat, coords.lng)
      coordinatePickerMap.setView([coords.lat, coords.lng], 13)
    }
  }

  // Add click handler
  coordinatePickerMap.on('click', (e: L.LeafletMouseEvent) => {
    placeMarker(e.latlng.lat, e.latlng.lng)
  })
}

const placeMarker = (lat: number, lng: number) => {
  if (!coordinatePickerMap) return

  // Remove existing temp marker
  if (tempMarker) {
    coordinatePickerMap.removeLayer(tempMarker)
  }

  // Add new marker
  tempMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: `
        <div class="relative">
          <svg class="w-10 h-10 drop-shadow-lg" viewBox="0 0 24 24">
            <path fill="#dc2626" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })
  }).addTo(coordinatePickerMap)

  tempMarker.bindPopup('Selected Location').openPopup()
  
  // Update temp coordinates
  tempCoordinates.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

const searchLocation = async () => {
  if (!locationSearch.value.trim() || !coordinatePickerMap) return

  try {
    // Using Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch.value + ', Zimbabwe')}&limit=1`
    )
    const data = await response.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lon)
      
      coordinatePickerMap.setView([latitude, longitude], 13)
      placeMarker(latitude, longitude)
    } else {
      alert('Location not found. Please try a different search term.')
    }
  } catch (error) {
    console.error('Error searching location:', error)
    alert('Error searching location. Please try again.')
  }
}

const confirmCoordinates = () => {
  if (tempCoordinates.value) {
    formData.value.facilityCoordinates = tempCoordinates.value
    closeCoordinatePicker()
  }
}

onMounted(async () => {
  await fetchFacilities()
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
  if (coordinatePickerMap) {
    coordinatePickerMap.remove()
  }
})

// Watch for changes in filtered facilities
watch(filteredFacilities, () => {
  if (map) {
    addMarkers()
  }
})
</script>
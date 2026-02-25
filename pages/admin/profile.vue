<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
      <p class="text-gray-600 mt-1">Manage your account settings and information</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <UiCard>
        <div class="flex flex-col items-center">
          <!-- Initials Avatar -->
          <div class="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {{ userInitials }}
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ userData.firstname }} {{ userData.lastname }}</h3>
          <p class="text-gray-600 capitalize">{{ userData.role || 'User' }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ userData.email }}</p>
          
          <!-- Gender Badge -->
          <div class="mt-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {{ userData.gender || 'Not specified' }}
            </span>
          </div>

          <!-- Active Status -->
          <div class="mt-2">
            <span v-if="userData.enabled" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Active
            </span>
            <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Inactive
            </span>
          </div>

          <button 
            @click="isEditing = !isEditing"
            class="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full"
          >
            {{ isEditing ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
        </div>
      </UiCard>

      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  v-model="formData.firstname"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  v-model="formData.lastname"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="formData.email"
                :disabled="!isEditing"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                v-model="formData.dateOfBirth"
                :disabled="!isEditing"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select 
                v-model="formData.gender"
                :disabled="!isEditing"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 capitalize"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                v-model="formData.role"
                disabled
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
              />
            </div>

            <!-- Authorities Section -->
            <div v-if="userData.authorities && userData.authorities.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(auth, index) in userData.authorities"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {{ auth.authority }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Edit Mode Actions -->
          <div v-if="isEditing" class="mt-6 flex justify-end space-x-3">
            <button 
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveChanges"
              :disabled="isSaving"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>
                Save Changes
              </span>
            </button>
          </div>
        </UiCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// User data state
interface Authority {
  authority: string
}

interface UserData {
  id: string
  firstname: string
  lastname: string
  email: string
  dateOfBirth: string
  gender: string
  postalAddress: string
  password: string
  role: string
  enabled: boolean
  username: string
  authorities: Authority[]
}

const userData = ref<UserData>({
  id: '',
  firstname: '',
  lastname: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  postalAddress: '',
  password: '',
  role: '',
  enabled: false,
  username: '',
  authorities: []
})

const formData = ref({ ...userData.value })
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const isEditing = ref(false)

// Compute user initials for avatar
const userInitials = computed(() => {
  const { firstname, lastname } = userData.value
  if (firstname && lastname) {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  } else if (firstname) {
    return firstname.charAt(0).toUpperCase()
  } else if (lastname) {
    return lastname.charAt(0).toUpperCase()
  }
  return 'U'
})

// Fetch user data from backend
const fetchUserData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Get current user email from localStorage
    const userEmail = localStorage.getItem('email')
    
    
    // Fetch user data from API
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/get-user-by-/${encodeURIComponent(userEmail)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${parsedAuth.access_token}`
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`)
    }
    
    const data = await response.json()
    userData.value = {
      id: data.id || '',
      firstname: data.firstname || '',
      lastname: data.lastname || '',
      email: data.email || '',
      dateOfBirth: data.dateOfBirth || '',
      gender: data.gender || '',
      postalAddress: data.postalAddress || '',
      password: data.password || '', // Note: You probably shouldn't display this
      role: data.role || '',
      enabled: data.enabled || false,
      username: data.username || '',
      authorities: data.authorities || []
    }
    
    // Copy to form data
    formData.value = { ...userData.value }
    
  } catch (error: any) {
    console.error('Error fetching user data:', error)
    errorMessage.value = error.message || 'Failed to load user profile'
  } finally {
    isLoading.value = false
  }
}

// Cancel edit mode
const cancelEdit = () => {
  isEditing.value = false
  formData.value = { ...userData.value }
}

// Save changes (you'll need to implement this endpoint)
const saveChanges = async () => {
  isSaving.value = true
  try {
    // Here you would call your update endpoint
    // For example: PUT /api/v1/auth/update-user/{id}
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update local data
    userData.value = { ...formData.value }
    isEditing.value = false
    
    // Show success message (you can use a toast notification)
    alert('Profile updated successfully!')
    
  } catch (error: any) {
    console.error('Error saving changes:', error)
    errorMessage.value = error.message || 'Failed to save changes'
  } finally {
    isSaving.value = false
  }
}

// Fetch user data on component mount
onMounted(() => {
  fetchUserData()
})
</script>
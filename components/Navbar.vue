<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div class="flex items-center">
      <button @click="toggleMobileSidebar" class="md:hidden mr-4">
        <Bars3Icon class="w-6 h-6 text-gray-700" />
      </button>
      <h2 class="text-lg font-semibold text-gray-900 hidden sm:block">
        VaxNet Dashboard
        <span v-if="userRole" class="text-sm font-normal text-primary-600 ml-2 capitalize">
          ({{ userRole }})
        </span>
      </h2>
    </div>

    <div class="flex items-center space-x-4">
      <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
        <BellIcon class="w-6 h-6" />
        <span v-if="unreadNotifications > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center space-x-3 focus:outline-none"
        >
          <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {{ userInitials }}
          </div>
          <div class="hidden sm:block text-left">
            <span class="text-sm font-medium text-gray-700 block">{{ userName }}</span>
            <span class="text-xs text-gray-500 capitalize">{{ userRole || 'User' }}</span>
          </div>
          <ChevronDownIcon class="w-4 h-4 text-gray-600" />
        </button>

        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
        >
          <NuxtLink 
            to="/admin/profile" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            @click="isDropdownOpen = false"
          >
            <UserIcon class="w-4 h-4 mr-2" />
            My Profile
          </NuxtLink>
          
          <hr class="my-1 border-gray-200">
          <button 
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <ArrowLeftOnRectangleIcon class="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div 
      v-if="isDropdownOpen" 
      class="fixed inset-0 z-0" 
      @click="isDropdownOpen = false"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  BellIcon, 
  ChevronDownIcon, 
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/vue/24/outline'

const router = useRouter()
const isDropdownOpen = ref(false)
const unreadNotifications = ref(0)
const userData = ref<any>(null)
const isLoading = ref(false)

// User data from localStorage (initial data from login)
const userEmail = localStorage.getItem('email')

// Fetch detailed user data from API
const fetchUserData = async () => {
  if (!userEmail) return
  isLoading.value = true
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/auth/get-user-by-/${encodeURIComponent(userEmail)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    
    if (response.ok) {
      const data = await response.json()
      userData.value = data
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const userName = computed(() => {
  if (userData.value?.firstname && userData.value?.lastname) {
    return `${userData.value.firstname} ${userData.value.lastname}`
  }
  return userData.value?.email || 'User'
})

const userInitials = computed(() => {
  const name = userName.value
  if (!name) return 'U'
  
  const nameParts = name.split(' ')
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
  }
  return name.charAt(0).toUpperCase()
})

const userRole = computed(() => {
  const role = localStorage.getItem('role')
  return role || null
})

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const toggleMobileSidebar = () => {
  // Emit event for parent component to handle
  emit('toggle-sidebar')
}

const handleLogout = () => {
  // Clear all auth data
  localStorage.removeItem('vaxnet_auth')
  sessionStorage.removeItem('vaxnet_auth')
  
  // Redirect to login page
  router.push('/auth/login')
}

// Lifecycle
onMounted(() => {
  // Fetch user data when component mounts
  fetchUserData()
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative') && isDropdownOpen.value) {
      isDropdownOpen.value = false
    }
  })
})

// Define emits
const emit = defineEmits(['toggle-sidebar'])
</script>

<style scoped>
/* Smooth dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo and Brand -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="text-left">
            <h1 class="text-2xl font-bold text-gray-900">VaxNet</h1>
            <p class="text-sm text-gray-600">Digital Immunization System</p>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p class="text-gray-600 mt-2">Sign in to access your dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email/Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter your username or email"
                :class="{ 'border-red-300': errors.username }"
              />
            </div>
            <p v-if="errors.username" class="mt-2 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                @click="showForgotPassword = true"
                class="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                :class="{ 'border-red-300': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              Remember me for 30 days
            </label>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading" class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          </button>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </form>

        <!-- Registration Link -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Don't have an account?
            <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
              Request access
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Demo Credentials -->
      <!-- <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600 mb-2 font-medium">Demo credentials:</p>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Username:</p>
            <p class="font-mono text-gray-900">healthcare@example.com</p>
          </div>
          <div>
            <p class="text-gray-500">Password:</p>
            <p class="font-mono text-gray-900">demo123</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Use these credentials for testing purposes</p>
      </div> -->
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Reset Password</h3>
          <button
            @click="showForgotPassword = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p class="text-gray-600 mb-6">Enter your email address and we'll send you a link to reset your password.</p>
        
        <form @submit.prevent="handlePasswordReset" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <button
            type="submit"
            class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')

const validateForm = () => {
  let valid = true
  errors.value = { username: '', password: '' }

  if (!form.value.username.trim()) {
    errors.value.username = 'Username or email is required'
    valid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
    valid = false
  } 

  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Use the backend endpoint for login validation
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.username,
        password: form.value.password
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Check if login was successful based on response structure
    // Based on the provided response, the API returns:
    // - message: 'check your email for verification code'
    // - role: 'PARENT' (or other roles)
    // - result: email
    // - access_token: JWT token
    // - refresh_token: JWT refresh token
    
    if (data.message && data.access_token) {
      // Store all information in localStorage
      
      localStorage.setItem('email', data.email)
      localStorage.setItem('role', data.role)
      localStorage.setItem('accessToken', data.access_token)
      
      
      // Redirect based on role
      if (data.role === 'PARENT') {
        router.push('/parent/')
      } else if (data.role === 'ADMIN') {
        router.push('/admin/')
      } else {
        // Handle other roles or default redirect
        errorMessage.value = 'Unknown user role. Please contact support.'
        localStorage.removeItem('vaxnet_auth')
      }
    } else {
      // Handle failed login
      errorMessage.value = data.message || 'Login failed. Please check your credentials.'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handlePasswordReset = () => {
  // You can implement actual password reset with backend endpoint
  alert(`Password reset link sent to ${resetEmail.value}`)
  showForgotPassword.value = false
  resetEmail.value = ''
}

// Optional: Check if user is already logged in on component mount
// const checkExistingAuth = () => {
//   const authData = localStorage.getItem('vaxnet_auth')
//   if (authData) {
//     try {
//       const parsedAuth = JSON.parse(authData)
//       if (parsedAuth.isLoggedIn && parsedAuth.access_token) {
//         // Check token expiration if needed (you can add JWT expiration check)
//         // For now, redirect based on stored role
//         if (parsedAuth.role === 'PARENT') {
//           router.push('/parent/')
//         } else if (parsedAuth.role === 'ADMIN') {
//           router.push('/admin/')
//         }
//       }
//     } catch (e) {
//       console.error('Error parsing auth data:', e)
//       localStorage.removeItem('vaxnet_auth')
//     }
//   }
// }

// // Run the check when component mounts
// checkExistingAuth()
</script>

<style scoped>
/* Smooth transitions */
button, input {
  transition: all 0.2s ease;
}

/* Focus styles */
input:focus, button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
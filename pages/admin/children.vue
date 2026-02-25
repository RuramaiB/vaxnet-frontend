<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Children Registry</h1>
          <p class="text-gray-600 mt-1">Manage children's personal and medical information</p>
        </div>
        <button
          @click="openAddModal"
          class="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Register New Child
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Children</p>
            <p class="text-2xl font-bold text-gray-900">{{ children.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Male</p>
            <p class="text-2xl font-bold text-gray-900">{{ children.filter(c => c.gender === 'MALE').length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Female</p>
            <p class="text-2xl font-bold text-gray-900">{{ children.filter(c => c.gender === 'FEMALE').length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Avg Age</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageAge }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Children</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or birth certificate..."
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            v-model="genderFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="firstName">First Name (A-Z)</option>
            <option value="dateOfBirth">Date of Birth (Newest)</option>
            <option value="dateOfBirthDesc">Date of Birth (Oldest)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Children Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading children...</p>
      </div>

      <div v-else-if="error" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading children</h3>
        <p class="mt-1 text-sm text-red-600">{{ error }}</p>
        <button @click="fetchChildren" class="mt-4 text-blue-600 hover:text-blue-700 font-medium">
          Try again
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Child Details
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date of Birth
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Birth Information
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent/Guardian
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="child in filteredChildren"
              :key="child.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    :class="[
                      'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
                      child.gender === 'MALE' ? 'bg-blue-100' : 'bg-pink-100'
                    ]"
                  >
                    <svg class="h-6 w-6" :class="child.gender === 'MALE' ? 'text-blue-600' : 'text-pink-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ child.firstName }} {{ child.lastName }}</div>
                    <div class="text-sm text-gray-500">{{ child.birthCertificateNumber || 'No certificate' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(child.dateOfBirth) }}</div>
                <div class="text-sm text-gray-500">{{ calculateAge(child.dateOfBirth) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <span :class="[
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    child.gender === 'MALE' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  ]">
                    {{ child.gender }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-1">{{ child.placeOfBirth || 'N/A' }}</div>
                <div v-if="child.birthWeight" class="text-xs text-gray-500">Weight: {{ child.birthWeight }}kg</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ child.parent.firstname }} {{ child.parent.lastname }}</div>
                <div class="text-sm text-gray-500">{{ child.relationshipToParent || 'Parent' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewChildDetails(child)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && !error && filteredChildren.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No children found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by registering a new child</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ filteredChildren.length }}</span> of <span class="font-medium">{{ children.length }}</span> children
      </div>
    </div>

    <!-- Add Child Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Register New Child</h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form @submit.prevent="saveChild" class="p-6">
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.dateOfBirth"
                  type="date"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.gender"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Birth Certificate Number <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.birthCertificateNumber"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter certificate number"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Place of Birth <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.placeOfBirth"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hospital/Clinic name"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Physical Address <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.physicalAddress"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Residential address"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Birth Weight (kg) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.birthWeight"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.2"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Birth Height (cm) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.birthHeight"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                v-model="formData.medicalConditionsInput"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any medical conditions (comma-separated)"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parent Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.parentEmail"
                type="email"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="parent@example.com"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Parent <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.relationshipToParent"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select relationship</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Guardian</option>
                <option value="Grandparent">Grandparent</option>
              </select>
            </div>
          </div>
          
          <div v-if="saveError" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ saveError }}</p>
          </div>
          
          <!-- Modal Actions -->
          <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              :disabled="saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="saving"
            >
              {{ saving ? 'Registering...' : 'Register Child' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Details Modal -->
    <div v-if="selectedChild" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedChild.firstName }} {{ selectedChild.lastName }}</h3>
              <p class="text-gray-600">Birth Certificate: {{ selectedChild.birthCertificateNumber || 'Not provided' }}</p>
            </div>
            <button
              @click="selectedChild = null"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Child Details -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Child Details</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Full Name:</span>
                  <span class="font-medium">{{ selectedChild.firstName }} {{ selectedChild.lastName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date of Birth:</span>
                  <span class="font-medium">{{ formatDate(selectedChild.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Age:</span>
                  <span class="font-medium">{{ calculateAge(selectedChild.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gender:</span>
                  <span class="font-medium">{{ selectedChild.gender }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Place of Birth:</span>
                  <span class="font-medium">{{ selectedChild.placeOfBirth }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Weight:</span>
                  <span class="font-medium">{{ selectedChild.birthWeight || 'N/A' }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Height:</span>
                  <span class="font-medium">{{ selectedChild.birthHeight || 'N/A' }} cm</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium text-right">{{ selectedChild.physicalAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Certificate:</span>
                  <span class="font-medium">{{ selectedChild.birthCertificateNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Parent/Guardian Details -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Parent/Guardian Details</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Full Name:</span>
                  <span class="font-medium">{{ selectedChild.parent.firstname }} {{ selectedChild.parent.lastname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date of Birth:</span>
                  <span class="font-medium">{{ selectedChild.parent.dateOfBirth || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gender:</span>
                  <span class="font-medium">{{ selectedChild.parent.gender || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ selectedChild.parent.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Relationship:</span>
                  <span class="font-medium">{{ selectedChild.relationshipToParent || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Medical Information -->
          <div v-if="selectedChild.medicalConditions?.length" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-4">Medical Conditions</h4>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(condition, index) in selectedChild.medicalConditions" :key="index" class="text-gray-700">
                {{ condition }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// API configuration
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:8080/api'

// State
const children = ref([])
const loading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const genderFilter = ref('all')
const sortBy = ref('firstName')
const showAddModal = ref(false)
const selectedChild = ref(null)
const saving = ref(false)
const saveError = ref(null)

// Form data - Matching API requirements exactly
const formData = ref({
  birthCertificateNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  physicalAddress: '',
  gender: '',
  birthWeight: '',
  birthHeight: '',
  medicalConditionsInput: '',
  parentEmail: '',
  relationshipToParent: ''
})

// Computed
const filteredChildren = computed(() => {
  let filtered = [...children.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(child =>
      child.firstName?.toLowerCase().includes(query) ||
      child.lastName?.toLowerCase().includes(query) ||
      child.birthCertificateNumber?.toLowerCase().includes(query)
    )
  }

  // Gender filter
  if (genderFilter.value !== 'all') {
    filtered = filtered.filter(child => child.gender === genderFilter.value)
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'firstName':
        return (a.firstName || '').localeCompare(b.firstName || '')
      case 'dateOfBirth':
        return new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime()
      case 'dateOfBirthDesc':
        return new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime()
      default:
        return 0
    }
  })

  return filtered
})

const averageAge = computed(() => {
  if (children.value.length === 0) return '0'
  const totalMonths = children.value.reduce((sum, child) => {
    const age = calculateAgeInMonths(child.dateOfBirth)
    return sum + age
  }, 0)
  const avgMonths = totalMonths / children.value.length
  const years = Math.floor(avgMonths / 12)
  const months = Math.round(avgMonths % 12)
  return years > 0 ? `${years}y ${months}m` : `${months}m`
})

// Methods
const fetchChildren = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch(`${API_BASE}/children/get-all-children`)
    children.value = response || []
  } catch (err) {
    console.error('Error fetching children:', err)
    error.value = err.message || 'Failed to load children'
  } finally {
    loading.value = false
  }
}

const saveChild = async () => {
  saving.value = true
  saveError.value = null
  
  try {
    // Parse medical conditions
    const medicalConditions = formData.value.medicalConditionsInput
      ? formData.value.medicalConditionsInput.split(',').map(c => c.trim()).filter(Boolean)
      : []

    // Prepare payload matching API requirements exactly
    const payload = {
      birthCertificateNumber: formData.value.birthCertificateNumber,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      dateOfBirth: formData.value.dateOfBirth,
      placeOfBirth: formData.value.placeOfBirth,
      physicalAddress: formData.value.physicalAddress,
      gender: formData.value.gender,
      birthWeight: formData.value.birthWeight,
      birthHeight: formData.value.birthHeight,
      medicalConditions: medicalConditions,
      parentEmail: formData.value.parentEmail,
      relationshipToParent: formData.value.relationshipToParent
    }

    // Send as JSON
    await $fetch(`${API_BASE}/children/add-new-child`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // Refresh the list
    await fetchChildren()
    closeModal()
  } catch (err) {
    console.error('Error saving child:', err)
    saveError.value = err.data?.message || err.message || 'Failed to register child'
  } finally {
    saving.value = false
  }
}

const viewChildDetails = (child) => {
  selectedChild.value = child
}

const openAddModal = () => {
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  saveError.value = null
  // Reset form data
  formData.value = {
    birthCertificateNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    physicalAddress: '',
    gender: '',
    birthWeight: '',
    birthHeight: '',
    medicalConditionsInput: '',
    parentEmail: '',
    relationshipToParent: ''
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const calculateAge = (dateString) => {
  if (!dateString) return 'N/A'
  const birthDate = new Date(dateString)
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`
  } else if (years < 2) {
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`
  } else {
    return `${years} years`
  }
}

const calculateAgeInMonths = (dateString) => {
  if (!dateString) return 0
  const birthDate = new Date(dateString)
  const today = new Date()
  const years = today.getFullYear() - birthDate.getFullYear()
  const months = today.getMonth() - birthDate.getMonth()
  return years * 12 + months
}

// Lifecycle
onMounted(() => {
  fetchChildren()
})
</script>
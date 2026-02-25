<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-10">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.195a4 4 0 01-4.9 1.096L15 21m0 0l-3-3m3 3l3-3" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900">VaxNet</h1>
            <p class="text-xs text-gray-600">Parent Portal</p>
          </div>
        </div>
      </div>


      <!-- Navigation -->
      <nav class="p-4">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="currentPage = item.id"
          :class="[
            'w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors',
            currentPage === item.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Logout -->
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <button
          @click="logout"
          class="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium">Sign Out</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64 flex-1">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-5">
        <div class="flex w-full justify-between items-center">
        <div class="px-8 py-4">
          <h2 class="text-2xl font-bold text-gray-900">{{ currentPageTitle }}</h2>
          <p class="text-sm text-gray-600 mt-1">{{ currentPageSubtitle }}</p>
        </div>
        <p class="text-xs text-gray-600 pr-5">{{ parentEmail }}</p>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-8">
        <!-- Dashboard Page -->
        <div v-if="currentPage === 'dashboard'">
          <!-- Child Profile Card -->
          <div v-if="activeChild" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Active Child Profile</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Full Name</p>
                    <p class="font-medium text-gray-900">{{ activeChild.firstName }} {{ activeChild.lastName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Birth Date</p>
                    <p class="font-medium text-gray-900">{{ formatDate(activeChild.dateOfBirth) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Birth Certificate</p>
                    <p class="font-medium text-gray-900">{{ activeChild.birthCertificateNumber }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Gender</p>
                    <p class="font-medium text-gray-900">{{ activeChild.gender }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Child Selected -->
          <div v-else class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 class="text-sm font-semibold text-yellow-900 mb-1">No Child Selected</h3>
                <p class="text-sm text-yellow-800">Please select or register a child to view their information and appointments.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Quick Stats -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-blue-50 rounded-lg">
                  <p class="text-sm text-gray-600">Total Children</p>
                  <p class="text-2xl font-bold text-blue-600">{{ children.length }}</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg">
                  <p class="text-sm text-gray-600">Total Appointments</p>
                  <p class="text-2xl font-bold text-green-600">{{ appointments.length }}</p>
                </div>
                <div class="p-4 bg-purple-50 rounded-lg">
                  <p class="text-sm text-gray-600">Upcoming</p>
                  <p class="text-2xl font-bold text-purple-600">{{ upcomingAppointments.length }}</p>
                </div>
                <div class="p-4 bg-orange-50 rounded-lg">
                  <p class="text-sm text-gray-600">Completed</p>
                  <p class="text-2xl font-bold text-orange-600">{{ completedAppointments.length }}</p>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="grid grid-cols-2 gap-4">
                <button
                  @click="showBookingModal = true"
                  class="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-gray-900 text-center">Book Appointment</p>
                </button>
                
                <button
                  @click="currentPage = 'children'"
                  class="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.195a4 4 0 01-4.9 1.096L15 21m0 0l-3-3m3 3l3-3" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-gray-900 text-center">View Children</p>
                </button>
                
                <button
                  @click="currentPage = 'appointments'"
                  class="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-gray-900 text-center">View Appointments</p>
                </button>
                
                <button
                  class="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition-colors group"
                >
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200">
                      <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p class="text-sm font-medium text-gray-900 text-center">Help & Support</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Recent Appointments -->
          <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
            <div class="space-y-3">
              <div
                v-for="appointment in recentAppointments"
                :key="appointment.appointmentID"
                class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium text-gray-900">{{ getChildName(appointment.child.birthCertificateNumber) }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ formatDate(appointment.dateOfAppointment) }} at {{ appointment.timeOfAppointment }}</p>
                    <p class="text-xs text-gray-500 mt-1">Facility ID: {{ appointment.facilityID }}</p>
                  </div>
                  <span :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    appointment.appointmentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.appointmentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ appointment.appointmentStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments Page -->
        <div v-if="currentPage === 'appointments'">
          <div class="mb-6 flex justify-between items-center">
            <div class="flex space-x-2">
              <button
                v-for="filter in ['all', 'confirmed', 'pending', 'cancelled']"
                :key="filter"
                @click="appointmentFilter = filter"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  appointmentFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
              </button>
            </div>
            <button
              @click="showBookingModal = true"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + New Appointment
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="appointment in filteredAppointments"
              :key="appointment.appointmentID"
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <p class="font-semibold text-gray-900 text-lg">{{ getChildName(appointment.child.birthCertificateNumber) }}</p>
                  <p class="text-sm text-gray-600 mt-1">Birth Cert: {{ appointment.child.birthCertificateNumber }}</p>
                </div>
                <span :class="[
                  'px-3 py-1 text-xs font-semibold rounded-full',
                  appointment.appointmentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                  appointment.appointmentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  appointment.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ appointment.appointmentStatus }}
                </span>
              </div>
              
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(appointment.dateOfAppointment) }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ appointment.timeOfAppointment }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Facility ID: {{ appointment.facilityID }}
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Reason:</span> {{ appointment.reasonForAppointment }}
                </div>
              </div>

              <div v-if="appointment.appointmentStatus === 'confirmed'" class="flex space-x-2">
                <button
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  class="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredAppointments.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-gray-900 font-medium">No appointments found</p>
            <p class="text-sm text-gray-600 mt-1">Try adjusting your filters or book a new appointment</p>
          </div>
        </div>

        <!-- Children Records Page -->
        <div v-if="currentPage === 'children'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              v-for="child in children"
              :key="child.birthCertificateNumber"
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ child.firstName }} {{ child.lastName }}</h3>
                  <p class="text-sm text-gray-600 mt-1">Birth Certificate: {{ child.birthCertificateNumber }}</p>
                </div>
                <button
                  @click="setActiveChild(child)"
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    activeChild?.birthCertificateNumber === child.birthCertificateNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  {{ activeChild?.birthCertificateNumber === child.birthCertificateNumber ? 'Active' : 'Set Active' }}
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-gray-600">Date of Birth</p>
                  <p class="font-medium text-gray-900">{{ formatDate(child.dateOfBirth) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Place of Birth</p>
                  <p class="font-medium text-gray-900">{{ child.placeOfBirth }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Gender</p>
                  <p class="font-medium text-gray-900">{{ child.gender }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Physical Address</p>
                  <p class="font-medium text-gray-900">{{ child.physicalAddress }}</p>
                </div>
              </div>

              <div v-if="child.medicalConditions && child.medicalConditions.length > 0" class="mb-4">
                <p class="text-xs text-gray-600 mb-2">Medical Conditions</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="condition in child.medicalConditions"
                    :key="condition"
                    class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {{ condition }}
                  </span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <p class="text-xs text-gray-600 mb-2">Caregiver: {{ child.relationshipToParent }}</p>
                <button
                  @click="viewChildAppointments(child.birthCertificateNumber)"
                  class="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  View Appointments
                </button>
              </div>
            </div>
          </div>

          <div v-if="children.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.195a4 4 0 01-4.9 1.096L15 21m0 0l-3-3m3 3l3-3" />
            </svg>
            <p class="mt-2 text-gray-900 font-medium">No children registered</p>
            <p class="text-sm text-gray-600 mt-1">Register your first child to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Book Vaccination Appointment</h3>
            <button
              @click="closeBookingModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form @submit.prevent="submitBooking" class="p-6 space-y-6">
          <!-- Child Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Child *
            </label>
            <select
              v-model="bookingForm.birthCertificateNumber"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a child</option>
              <option v-for="child in children" :key="child.birthCertificateNumber" :value="child.birthCertificateNumber">
                {{ child.firstName }} {{ child.lastName }} ({{ child.birthCertificateNumber }})
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Date Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date *
              </label>
              <input
                v-model="bookingForm.dateOfAppointment"
                type="date"
                :min="minBookingDate"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <!-- Time Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time *
              </label>
              <select
                v-model="bookingForm.timeOfAppointment"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time</option>
                <option value="08:00">08:00 AM</option>
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

          <!-- Facility Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Facility ID *
            </label>
            <input
              v-model="bookingForm.facilityID"
              type="text"
              required
              placeholder="Enter facility ID"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reason for Appointment *
            </label>
            <textarea
              v-model="bookingForm.reasonForAppointment"
              rows="3"
              required
              placeholder="e.g., Routine vaccination, Follow-up, etc."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <!-- Confirmation -->
          <div class="p-4 bg-blue-50 rounded-lg">
            <label class="flex items-start">
              <input
                v-model="bookingForm.confirmed"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 mt-1"
              />
              <span class="ml-2 text-sm text-gray-700">
                I confirm that the information provided is accurate and I understand the appointment requirements.
              </span>
            </label>
          </div>
          
          <!-- Modal Actions -->
          <div class="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="closeBookingModal"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Appointment Booked!</h3>
        
        <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Appointment ID:</span>
              <span class="font-mono font-medium">{{ bookingSuccess.appointmentID }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Date:</span>
              <span class="font-medium">{{ formatDate(bookingSuccess.dateOfAppointment) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Time:</span>
              <span class="font-medium">{{ bookingSuccess.timeOfAppointment }}</span>
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 mb-6">
          Your appointment has been successfully booked. You will receive a confirmation notification shortly.
        </p>
        
        <button
          @click="showSuccessModal = false"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Navigation
      currentPage: 'dashboard',
      navItems: [
        { id: 'dashboard', label: 'Dashboard', icon: 'HomeIcon' },
        { id: 'appointments', label: 'Appointments', icon: 'CalendarIcon' },
        { id: 'children', label: 'Children Records', icon: 'UsersIcon' }
      ],
      
      // User data
      parentName: '',
      parentEmail: localStorage.getItem('email') || '',
      
      // Children data
      children: [],
      activeChild: null,
      
      // Appointments data
      appointments: [],
      appointmentFilter: 'all',
      
      // Modals
      showBookingModal: false,
      showSuccessModal: false,
      
      // Booking form
      bookingForm: {
        birthCertificateNumber: '',
        dateOfAppointment: '',
        timeOfAppointment: '',
        facilityID: '',
        reasonForAppointment: '',
        confirmed: false
      },
      
      // Booking success data
      bookingSuccess: {}
    }
  },
  
  computed: {
    currentPageTitle() {
      const titles = {
        dashboard: 'Dashboard',
        appointments: 'Appointments',
        children: 'Children Records'
      }
      return titles[this.currentPage] || 'Dashboard'
    },
    
    currentPageSubtitle() {
      const subtitles = {
        dashboard: 'Overview of your vaccination management',
        appointments: 'Manage your children\'s vaccination appointments',
        children: 'View and manage your children\'s information'
      }
      return subtitles[this.currentPage] || ''
    },
    
    minBookingDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    },
    
    filteredAppointments() {
      if (this.appointmentFilter === 'all') {
        return this.appointments
      }
      return this.appointments.filter(apt => apt.appointmentStatus === this.appointmentFilter)
    },
    
    upcomingAppointments() {
      return this.appointments.filter(apt => 
        apt.appointmentStatus === 'confirmed' || apt.appointmentStatus === 'pending'
      )
    },
    
    completedAppointments() {
      return this.appointments.filter(apt => apt.appointmentStatus === 'completed')
    },
    
    recentAppointments() {
      return this.appointments.slice(0, 5)
    }
  },
  
  methods: {
    async fetchChildren() {
      try {
        const response = await fetch(`http://localhost:8080/api/children/get-children-by-parent-email/${this.parentEmail}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch children')
        }
        
        const data = await response.json()
        
        // Handle both single object and array responses
        if (data) {
          this.children = Array.isArray(data) ? data : [data]
          
          // Set first child as active if available
          if (this.children.length > 0 && !this.activeChild) {
            this.activeChild = this.children[0]
          }
        } else {
          this.children = []
        }
      } catch (error) {
        console.error('Error fetching children:', error)
        this.children = []
        this.activeChild = null
      }
    },
    
    async fetchAppointments() {
      if (!this.activeChild || !this.activeChild.birthCertificateNumber) {
        this.appointments = []
        return
      }
      
      try {
        const response = await fetch(`http://localhost:8080/api/appointments/get-appointments-by-child/${this.activeChild.birthCertificateNumber}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
        
        const data = await response.json()
        
        // Handle both single object and array responses
        if (data) {
          this.appointments = Array.isArray(data) ? data : [data]
        } else {
          this.appointments = []
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
        this.appointments = []
      }
    },
    
    async submitBooking() {
      try {
        const response = await fetch('http://localhost:8080/api/appointments/add-new-appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dateOfAppointment: this.bookingForm.dateOfAppointment,
            timeOfAppointment: this.bookingForm.timeOfAppointment,
            birthCertificateNumber: this.bookingForm.birthCertificateNumber,
            reasonForAppointment: this.bookingForm.reasonForAppointment,
            facilityID: this.bookingForm.facilityID,
            appointmentStatus: 'pending'
          })
        })
        
        const data = await response.json()
        
        if (data.appointment) {
          this.bookingSuccess = data.appointment
          this.showBookingModal = false
          this.showSuccessModal = true
          await this.fetchAppointments()
        }
      } catch (error) {
        console.error('Error booking appointment:', error)
        alert('Failed to book appointment. Please try again.')
      }
    },
    
    closeBookingModal() {
      this.showBookingModal = false
      this.bookingForm = {
        birthCertificateNumber: '',
        dateOfAppointment: '',
        timeOfAppointment: '',
        facilityID: '',
        reasonForAppointment: '',
        confirmed: false
      }
    },
    
    setActiveChild(child) {
      this.activeChild = child
      this.fetchAppointments()
    },
    
    viewChildAppointments(birthCertNumber) {
      const child = this.children.find(c => c.birthCertificateNumber === birthCertNumber)
      if (child) {
        this.setActiveChild(child)
        this.currentPage = 'appointments'
      }
    },
    
    getChildName(birthCertNumber) {
      if (!birthCertNumber || !this.children || this.children.length === 0) {
        return 'Unknown'
      }
      const child = this.children.find(c => c.birthCertificateNumber === birthCertNumber)
      return child ? `${child.firstName || ''} ${child.lastName || ''}`.trim() : 'Unknown'
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    logout() {
      window.location.href = '/'
    }
  },
  
  mounted() {
    this.fetchChildren()
  
  },
  
  watch: {
    activeChild() {
      if (this.activeChild) {
        this.fetchAppointments()
      }
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Focus styles */
input:focus, select:focus, textarea:focus {
  outline: none;
}
</style>
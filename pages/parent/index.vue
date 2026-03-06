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

          <!-- Add Child button row -->
          <div class="flex justify-between items-center mb-6">
            <p class="text-sm text-gray-500">{{ children.length }} child(ren) registered</p>
            <button @click="showAddChildModal = true"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
              </svg>
              Add Child
            </button>
          </div>

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

              <div class="pt-4 border-t border-gray-200 flex gap-2">
                <button
                  @click="viewChildAppointments(child.birthCertificateNumber)"
                  class="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  View Appointments
                </button>
                <button
                  @click="goToImmunizations(child)"
                  class="flex-1 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                >
                  ðŸ’‰ Immunizations
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
            <button @click="showAddChildModal = true"
              class="mt-4 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              + Register First Child
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <!-- Immunizations Page â€” Premium Redesign                          -->
    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <div v-if="currentPage === 'immunizations'" class="min-h-screen" style="background:#f0f4ff">

      <!-- No Child Selected State -->
      <div v-if="!activeChild" class="flex flex-col items-center justify-center py-24">
        <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">No Child Selected</h3>
        <p class="text-sm text-gray-500 mb-4 text-center max-w-sm">Select a child from Children Records and tap "Immunizations" to view their schedule</p>
        <button @click="currentPage = 'children'" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Go to Children Records
        </button>
      </div>

      <div v-else>

        <!-- â”€â”€ HERO HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
        <div class="relative overflow-hidden rounded-none" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)">
          <!-- Decorative blobs -->
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full" style="background: radial-gradient(circle, #38bdf8 0%, transparent 70%)"></div>
            <div class="absolute -bottom-8 left-20 w-48 h-48 rounded-full" style="background: radial-gradient(circle, #6366f1 0%, transparent 70%)"></div>
          </div>

          <div class="relative z-10 px-6 pt-7 pb-6">
            <!-- Child info row -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style="background: linear-gradient(135deg, #3b82f6, #6366f1)">
                {{ activeChild.firstName.charAt(0) }}{{ activeChild.lastName.charAt(0) }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-white leading-tight">{{ activeChild.firstName }} {{ activeChild.lastName }}</h2>
                <p class="text-blue-300 text-xs mt-0.5">Zimbabwe National Immunization Schedule &middot; CHW Job Aid</p>
              </div>
              <div class="ml-auto">
                <button @click="fetchImmunizationSchedule"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-200 border border-blue-700 hover:bg-blue-800 transition-colors">
                  <svg class="w-3.5 h-3.5" :class="loadingImmunization ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            <!-- Stats + Circular Progress -->
            <div v-if="immunizationSchedule" class="flex items-center gap-6">
              <!-- Circular SVG progress ring -->
              <div class="relative flex-shrink-0">
                <svg width="88" height="88" viewBox="0 0 88 88">
                  <!-- Track -->
                  <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                  <!-- Progress -->
                  <circle cx="44" cy="44" r="36" fill="none" stroke="#38bdf8" stroke-width="8"
                    stroke-linecap="round"
                    :stroke-dasharray="226.2"
                    :stroke-dashoffset="226.2 - (226.2 * immunizationSchedule.doses.filter(d => d.status === 'ADMINISTERED').length / immunizationSchedule.doses.length)"
                    transform="rotate(-90 44 44)"
                    style="transition: stroke-dashoffset 1s ease"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-xl font-bold text-white leading-none">
                    {{ Math.round(immunizationSchedule.doses.filter(d => d.status === 'ADMINISTERED').length / immunizationSchedule.doses.length * 100) }}%
                  </span>
                  <span class="text-blue-300 text-[9px] font-medium mt-0.5">COMPLETE</span>
                </div>
              </div>

              <!-- Stat pills -->
              <div class="flex flex-wrap gap-3 flex-1">
                <div class="flex flex-col px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.08)">
                  <span class="text-xl font-bold text-white">{{ immunizationSchedule.doses.filter(d => d.status === 'ADMINISTERED').length }}</span>
                  <span class="text-xs text-blue-200 mt-0.5">Given</span>
                </div>
                <div class="flex flex-col px-3 py-2 rounded-xl" style="background: rgba(239,68,68,0.2)">
                  <span class="text-xl font-bold text-red-300">{{ immunizationSchedule.doses.filter(d => d.status === 'OVERDUE').length }}</span>
                  <span class="text-xs text-red-300 mt-0.5">Overdue</span>
                </div>
                <div class="flex flex-col px-3 py-2 rounded-xl" style="background: rgba(234,179,8,0.2)">
                  <span class="text-xl font-bold text-yellow-200">{{ immunizationSchedule.doses.filter(d => d.status === 'DUE' || d.status === 'DUE_SOON').length }}</span>
                  <span class="text-xs text-yellow-200 mt-0.5">Due Soon</span>
                </div>
                <div class="flex flex-col px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.05)">
                  <span class="text-xl font-bold text-gray-300">{{ immunizationSchedule.doses.filter(d => d.status === 'NOT_YET_DUE').length }}</span>
                  <span class="text-xs text-gray-400 mt-0.5">Pending</span>
                </div>
              </div>
            </div>

            <!-- Next due alert -->
            <div v-if="nextDue" class="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
              style="background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3)">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background: rgba(251,191,36,0.25)">
                <svg class="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-yellow-200 text-xs font-semibold">Next Vaccination Due</p>
                <p class="text-white text-sm font-bold">{{ nextDue.vaccineName }}</p>
              </div>
              <div class="text-right">
                <p class="text-yellow-200 text-xs">{{ formatDate(nextDue.scheduledDate) }}</p>
              </div>
            </div>
          </div>
        </div><!-- end hero -->

        <!-- â”€â”€ LOADING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
        <div v-if="loadingImmunization" class="flex flex-col items-center justify-center py-20">
          <div class="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
          <p class="text-gray-500 text-sm">Loading immunization scheduleâ€¦</p>
        </div>

        <!-- â”€â”€ VACCINE LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
        <div v-else-if="immunizationSchedule" class="px-4 py-5 space-y-3">

          <!-- Overdue urgent alert -->
          <div v-if="immunizationSchedule.doses.some(d => d.status === 'OVERDUE')"
            class="flex items-start gap-3 px-4 py-3 rounded-2xl mb-2"
            style="background: linear-gradient(135deg, #fef2f2, #fff1f2); border: 1px solid #fecaca">
            <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-red-800">
                {{ immunizationSchedule.doses.filter(d => d.status === 'OVERDUE').length }} Overdue Dose(s) - Action Required
              </p>
              <p class="text-xs text-red-600 mt-0.5">Please visit your nearest health facility as soon as possible to catch up on missed vaccinations.</p>
            </div>
          </div>

          <!-- Group label helper: we use vaccineKey to detect milestone groups -->
          <!-- Each dose is rendered as a premium card -->
          <div v-for="(dose, index) in immunizationSchedule.doses" :key="dose.vaccineKey">

            <!-- Milestone age group header (shows when age group changes) -->
            <div v-if="index === 0 || dose.scheduledAgeWeeks !== immunizationSchedule.doses[index - 1].scheduledAgeWeeks"
              class="flex items-center gap-3 mt-4 mb-2">
              <div class="h-px flex-1" style="background: linear-gradient(90deg, #c7d2fe, transparent)"></div>
              <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                style="background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ formatScheduledAge(dose.scheduledAgeWeeks) }}
              </div>
              <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, #c7d2fe)"></div>
            </div>

            <!-- Vaccine card -->
            <div :class="[
                'relative rounded-2xl overflow-hidden transition-all duration-200',
                dose.status === 'ADMINISTERED' ? 'shadow-sm' : 'shadow hover:shadow-md hover:-translate-y-0.5'
              ]"
              style="background: white; border: 1px solid #e5e7eb">

              <!-- Left accent bar -->
              <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                :style="{
                  background:
                    dose.status === 'ADMINISTERED' ? 'linear-gradient(180deg, #22c55e, #16a34a)' :
                    dose.status === 'OVERDUE'       ? 'linear-gradient(180deg, #ef4444, #dc2626)' :
                    dose.status === 'DUE'           ? 'linear-gradient(180deg, #f59e0b, #d97706)' :
                    dose.status === 'DUE_SOON'      ? 'linear-gradient(180deg, #f97316, #ea580c)' :
                                                      'linear-gradient(180deg, #d1d5db, #9ca3af)'
                }">
              </div>

              <div class="pl-5 pr-4 py-4">
                <div class="flex items-start gap-3">

                  <!-- Status icon circle -->
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    :style="{
                      background:
                        dose.status === 'ADMINISTERED' ? '#f0fdf4' :
                        dose.status === 'OVERDUE'       ? '#fef2f2' :
                        dose.status === 'DUE'           ? '#fffbeb' :
                        dose.status === 'DUE_SOON'      ? '#fff7ed' : '#f9fafb'
                    }">
                    <!-- Administered: checkmark -->
                    <svg v-if="dose.status === 'ADMINISTERED'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                    </svg>
                    <!-- Overdue: exclamation -->
                    <svg v-else-if="dose.status === 'OVERDUE'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <!-- Due: calendar -->
                    <svg v-else-if="dose.status === 'DUE' || dose.status === 'DUE_SOON'" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <!-- Pending: circle outline -->
                    <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke-width="2"/>
                    </svg>
                  </div>

                  <!-- Main content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="font-bold text-gray-900 text-sm leading-snug">{{ dose.vaccineName }}</p>
                        <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <!-- Dosage chip -->
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            <span class="font-bold text-gray-500">Dose:</span> {{ dose.dosage }}
                          </span>
                          <!-- Route chip -->
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                            <span class="font-bold">Route:</span> {{ dose.route }}
                          </span>
                          <!-- Site chip -->
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700" :title="dose.site">
                            <span class="font-bold">Site:</span> {{ dose.site }}
                          </span>
                        </div>
                      </div>

                      <!-- Status badge -->
                      <div class="flex-shrink-0 text-right">
                        <span :class="[
                          'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                          dose.status === 'ADMINISTERED' ? 'bg-green-100 text-green-800' :
                          dose.status === 'OVERDUE'       ? 'bg-red-100 text-red-800' :
                          dose.status === 'DUE'           ? 'bg-amber-100 text-amber-800' :
                          dose.status === 'DUE_SOON'      ? 'bg-orange-100 text-orange-800' :
                                                            'bg-gray-100 text-gray-500'
                        ]">
                          {{
                            dose.status === 'ADMINISTERED' ? 'Given' :
                            dose.status === 'OVERDUE'       ? 'Overdue' :
                            dose.status === 'DUE'           ? 'Due Now' :
                            dose.status === 'DUE_SOON'      ? 'Due Soon' :
                                                              'Upcoming'
                          }}
                        </span>
                      </div>
                    </div>

                    <!-- Bottom row: scheduled date + administered date + catch-up button -->
                    <div class="flex items-center justify-between mt-2.5 pt-2.5" style="border-top: 1px dashed #f3f4f6">
                      <div class="flex items-center gap-4">
                        <div>
                          <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Scheduled</p>
                          <p class="text-xs font-semibold text-gray-700">{{ formatDate(dose.scheduledDate) }}</p>
                        </div>
                        <div v-if="dose.administeredDate">
                          <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Date Given</p>
                          <p class="text-xs font-semibold text-green-700">{{ formatDate(dose.administeredDate) }}</p>
                        </div>
                        <div v-if="dose.batchNumber && dose.batchNumber !== 'N/A'">
                          <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Batch</p>
                          <p class="text-xs font-mono text-gray-600">{{ dose.batchNumber }}</p>
                        </div>
                      </div>

                      <!-- Catch-up button: only if older than required AND not yet administered -->
                      <button
                        v-if="dose.status !== 'ADMINISTERED' && isChildOlderThanRequired(dose)"
                        @click="openUpdateRecordModal(dose)"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 2px 8px rgba(245,158,11,0.4)"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Update Records
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom legend -->
          <div class="mt-6 flex flex-wrap gap-3 px-1 pb-4">
            <span v-for="l in [
              {label: 'Administered', bg: '#f0fdf4', color: '#15803d', dot: '#22c55e'},
              {label: 'Due Now',      bg: '#fffbeb', color: '#92400e', dot: '#f59e0b'},
              {label: 'Due Soon',     bg: '#fff7ed', color: '#9a3412', dot: '#f97316'},
              {label: 'Overdue',      bg: '#fef2f2', color: '#991b1b', dot: '#ef4444'},
              {label: 'Upcoming',     bg: '#f9fafb', color: '#6b7280', dot: '#d1d5db'},
            ]" :key="l.label"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              :style="{background: l.bg, color: l.color}">
              <span class="w-2 h-2 rounded-full inline-block" :style="{background: l.dot}"></span>
              {{ l.label }}
            </span>
          </div>

        </div><!-- end vaccine list -->

        <!-- Error state -->
        <div v-else class="flex flex-col items-center justify-center py-20">
          <div class="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-gray-700 font-semibold mb-1">Could not load schedule</p>
          <button @click="fetchImmunizationSchedule" class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">Try again</button>
        </div>

      </div>
    </div><!-- end immunizations page -->










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

          <!-- Facility Selection with AI Suggestions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Facility ID *
            </label>
            <div class="space-y-3">
              <input
                v-model="bookingForm.facilityID"
                type="text"
                required
                placeholder="Enter facility ID or select a suggestion below"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <!-- Suggestions -->
              <div v-if="suggestedFacilities.length > 0" class="space-y-2">
                <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Suggested Facilities In Your District</p>
                <div class="flex flex-wrap gap-2">
                  <button 
                    v-for="fac in suggestedFacilities" 
                    :key="fac.facilityID"
                    type="button"
                    @click="bookingForm.facilityID = fac.facilityID"
                    :class="[
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                      bookingForm.facilityID === fac.facilityID ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <div class="flex flex-col items-start">
                      <span>{{ fac.facilityName }}</span>
                      <span class="text-[9px] opacity-70">{{ fac.facilityType }} · {{ fac.facilityDistrict }}</span>
                    </div>
                  </button>
                </div>
              </div>
              <div v-else-if="loadingSuggestions" class="flex items-center gap-2 text-xs text-gray-400">
                <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Looking for facilities in child's district...
              </div>
            </div>
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

    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <!-- Add Child Modal                                                 -->
    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <div v-if="showAddChildModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Register a Child</h3>
            <p class="text-sm text-gray-500 mt-0.5">Their immunization schedule will be auto-generated after registration</p>
          </div>
          <button @click="showAddChildModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitAddChild" class="p-6 space-y-5">
          <!-- Row 1: First Name / Last Name -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input v-model="addChildForm.firstName" type="text" required placeholder="e.g. Tinotenda"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input v-model="addChildForm.lastName" type="text" required placeholder="e.g. Moyo"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
          </div>

          <!-- Row 2: Birth Certificate / Date of Birth -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birth Certificate Number *</label>
              <input v-model="addChildForm.birthCertificateNumber" type="text" required placeholder="e.g. 23-123456A72"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input v-model="addChildForm.dateOfBirth" type="date" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
          </div>

          <!-- Row 3: Gender / Place of Birth -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select v-model="addChildForm.gender" required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
              <input v-model="addChildForm.placeOfBirth" type="text" placeholder="e.g. Harare"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
          </div>

          <!-- Row 4: Birth Weight / Birth Height -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birth Weight (kg)</label>
              <input v-model="addChildForm.birthWeight" type="text" placeholder="e.g. 3.2"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Birth Height (cm)</label>
              <input v-model="addChildForm.birthHeight" type="text" placeholder="e.g. 50"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
            </div>
          </div>

          <!-- Physical Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input v-model="addChildForm.physicalAddress" type="text" placeholder="e.g. 42 Baines Ave, Harare"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
          </div>

          <!-- Relationship to Parent -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Your Relationship to Child *</label>
            <select v-model="addChildForm.relationshipToParent" required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Select relationship</option>
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Guardian">Guardian</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Error / Info banner -->
          <div v-if="addChildError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {{ addChildError }}
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            ðŸ’¡ After registration, the system will automatically generate the full Zimbabwe CHW immunization schedule for this child.
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showAddChildModal = false"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" :disabled="addingChild"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg v-if="addingChild" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ addingChild ? 'Registering...' : 'Register Child' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <!-- Update Immunization Records Modal (Catch-Up)                    -->
    <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
    <div v-if="showUpdateRecordModal && updateDose" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Update Immunization Record</h3>
            <p class="text-sm text-gray-500 mt-0.5">Record a previously administered dose</p>
          </div>
          <button @click="showUpdateRecordModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Vaccine info -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <span class="text-2xl">ðŸ’‰</span>
              <div>
                <p class="font-bold text-gray-900">{{ updateDose.vaccineName }}</p>
                <p class="text-xs text-gray-600 mt-0.5">Expected age: {{ formatScheduledAge(updateDose.scheduledAgeWeeks) }} Â· {{ updateDose.route }} Â· {{ updateDose.site }}</p>
                <div class="mt-1">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    âš  This child is older than the expected vaccination age for this dose
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Date administered -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Administered *</label>
            <input v-model="updateRecordForm.administeredDate" type="date" required
              :max="today"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"/>
          </div>

          <!-- Batch number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Batch Number (optional)</label>
            <input v-model="updateRecordForm.batchNumber" type="text" placeholder="e.g. ZWB-2024-001"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"/>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            This will mark <strong>{{ updateDose.vaccineName }}</strong> as administered for <strong>{{ activeChild?.firstName }}</strong> on the selected date.
          </div>

          <div v-if="updateRecordError" class="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            {{ updateRecordError }}
          </div>

          <div class="flex gap-3 pt-1">
            <button @click="showUpdateRecordModal = false"
              class="flex-1 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button @click="submitUpdateRecord" :disabled="updatingRecord"
              class="flex-1 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
              <svg v-if="updatingRecord" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ updatingRecord ? 'Saving...' : 'Save Record' }}
            </button>
          </div>
        </div>
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
        { id: 'children', label: 'Children Records', icon: 'UsersIcon' },
        { id: 'immunizations', label: 'Immunizations', icon: 'ClipboardDocumentCheckIcon' }
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
      bookingSuccess: {},
      suggestedFacilities: [],
      loadingSuggestions: false,

      // Immunization data
      immunizationSchedule: null,
      loadingImmunization: false,

      // Add Child modal
      showAddChildModal: false,
      addingChild: false,
      addChildError: '',
      addChildForm: {
        firstName: '',
        lastName: '',
        birthCertificateNumber: '',
        dateOfBirth: '',
        gender: '',
        placeOfBirth: '',
        physicalAddress: '',
        birthWeight: '',
        birthHeight: '',
        relationshipToParent: ''
      },

      // Update Record modal
      showUpdateRecordModal: false,
      updateDose: null,
      updatingRecord: false,
      updateRecordError: '',
      updateRecordForm: {
        administeredDate: '',
        batchNumber: ''
      },
      today: new Date().toISOString().split('T')[0]
    }
  },
  
  computed: {
    currentPageTitle() {
      const titles = {
        dashboard: 'Dashboard',
        appointments: 'Appointments',
        children: 'Children Records',
        immunizations: 'Immunization Schedule'
      }
      return titles[this.currentPage] || 'Dashboard'
    },
    
    currentPageSubtitle() {
      const subtitles = {
        dashboard: 'Overview of your vaccination management',
        appointments: 'Manage your children\'s vaccination appointments',
        children: 'View and manage your children\'s information',
        immunizations: 'Zimbabwe national immunization checklist for your child'
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
    },

    nextDue() {
      if (!this.immunizationSchedule) return null
      return this.immunizationSchedule.doses.find(d =>
        d.status === 'DUE' || d.status === 'DUE_SOON'
      ) || null
    }
  },

  watch: {
    currentPage(page) {
      if (page === 'immunizations') {
        this.fetchImmunizationSchedule()
      }
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
      // Also refresh immunization schedule if on that page
      if (this.currentPage === 'immunizations') {
        this.fetchImmunizationSchedule()
      }
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

    formatScheduledAge(weeks) {
      if (weeks === 0) return 'At Birth'
      if (weeks < 8) return `${weeks} weeks`
      const months = Math.round(weeks / 4.33)
      if (months < 24) return `${months} months`
      const years = Math.round(weeks / 52.18)
      return `${years} years`
    },

    /**
     * Returns true if the child's current age in weeks is greater than the dose's
     * scheduledAgeWeeks â€” meaning they are older than the expected vaccination age.
     */
    isChildOlderThanRequired(dose) {
      if (!this.activeChild || !this.activeChild.dateOfBirth || !dose.scheduledAgeWeeks) return false
      const dob = new Date(this.activeChild.dateOfBirth)
      const ageWeeks = Math.floor((Date.now() - dob.getTime()) / (7 * 24 * 60 * 60 * 1000))
      return ageWeeks > dose.scheduledAgeWeeks
    },

    goToImmunizations(child) {
      this.setActiveChild(child)
      this.currentPage = 'immunizations'
    },

    openUpdateRecordModal(dose) {
      this.updateDose = dose
      this.updateRecordForm.administeredDate = ''
      this.updateRecordForm.batchNumber = ''
      this.updateRecordError = ''
      this.showUpdateRecordModal = true
    },

    async submitUpdateRecord() {
      if (!this.updateRecordForm.administeredDate) {
        this.updateRecordError = 'Please select the date the vaccine was administered.'
        return
      }
      this.updatingRecord = true
      this.updateRecordError = ''
      try {
        const bcn = this.activeChild.birthCertificateNumber
        const res = await fetch(
          `http://localhost:8080/api/immunization/administer/${bcn}/${this.updateDose.vaccineKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batchNumber: this.updateRecordForm.batchNumber || 'N/A',
              administeredDate: this.updateRecordForm.administeredDate
            })
          }
        )
        if (res.ok) {
          this.showUpdateRecordModal = false
          // Refresh the immunization schedule
          await this.fetchImmunizationSchedule()
        } else {
          this.updateRecordError = 'Failed to update record. Please try again.'
        }
      } catch (e) {
        this.updateRecordError = 'Network error â€” please check your connection.'
      } finally {
        this.updatingRecord = false
      }
    },

    async submitAddChild() {
      this.addingChild = true
      this.addChildError = ''
      try {
        const payload = {
          ...this.addChildForm,
          parentEmail: this.parentEmail
        }
        const res = await fetch('http://localhost:8080/api/children/add-new-child', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (res.ok) {
          this.showAddChildModal = false
          // Reset form
          this.addChildForm = {
            firstName: '', lastName: '', birthCertificateNumber: '',
            dateOfBirth: '', gender: '', placeOfBirth: '',
            physicalAddress: '', birthWeight: '', birthHeight: '',
            relationshipToParent: ''
          }
          // Reload children list
          await this.fetchChildren()
        } else {
          const err = await res.text()
          this.addChildError = err || 'Failed to register child. Please check the details and try again.'
        }
      } catch (e) {
        this.addChildError = 'Network error â€” please check your connection and try again.'
      } finally {
        this.addingChild = false
      }
    },

    async fetchSuggestedFacilities(birthCertificateNumber) {
      if (!birthCertificateNumber) {
        this.suggestedFacilities = []
        return
      }
      
      const child = this.children.find(c => c.birthCertificateNumber === birthCertificateNumber)
      if (!child) return

      this.loadingSuggestions = true
      try {
        // Fallback to birthplace or address extraction if no explicit district field exists on child
        const district = child.placeOfBirth || (child.physicalAddress ? child.physicalAddress.split(',').pop() : 'Harare')
        const res = await fetch(`http://localhost:8080/api/facilities/by-district/${district.trim()}`)
        if (res.ok) {
          this.suggestedFacilities = await res.json()
        } else {
          this.suggestedFacilities = []
        }
      } catch (e) {
        console.error('Error fetching suggested facilities:', e)
      } finally {
        this.loadingSuggestions = false
      }
    },

    async fetchImmunizationSchedule() {
      if (!this.activeChild || !this.activeChild.birthCertificateNumber) {
        this.immunizationSchedule = null
        return
      }
      this.loadingImmunization = true
      try {
        const resp = await fetch(`http://localhost:8080/api/immunization/schedule/${this.activeChild.birthCertificateNumber}`)
        if (resp.ok) {
          this.immunizationSchedule = await resp.json()
        } else {
          this.immunizationSchedule = null
        }
      } catch (e) {
        console.error('Error fetching immunization schedule:', e)
        this.immunizationSchedule = null
      } finally {
        this.loadingImmunization = false
      }
    },
    
    logout() {
      window.location.href = '/'
    }
  },
  
  mounted() {
    this.fetchChildren()
  
  },
  
  watch: {
    'bookingForm.birthCertificateNumber'(val) {
      if (val) this.fetchSuggestedFacilities(val)
    },
    activeChild(newVal) {
      if (newVal) {
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

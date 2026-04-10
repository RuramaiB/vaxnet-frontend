<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Appointments</h1>
          <p class="text-gray-600 mt-1">Manage and schedule vaccination appointments</p>
        </div>
        <button
          @click="showAddAppointmentModal = true"
          class="bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Schedule New Appointment
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <UiStatCard
        title="Total Appointments"
        :value="appointments.length"
        subtitle="All appointments"
        :icon="CalendarIcon"
        icon-color="text-blue-600"
        icon-bg-color="bg-blue-100"
      />
      <UiStatCard
        title="Today's Appointments"
        :value="todayAppointments"
        subtitle="Scheduled for today"
        :icon="CheckCircleIcon"
        icon-color="text-green-600"
        icon-bg-color="bg-green-100"
      />
      <UiStatCard
        title="Upcoming"
        :value="upcomingAppointments"
        subtitle="Next 7 days"
        :icon="ClockIcon"
        icon-color="text-yellow-600"
        icon-bg-color="bg-yellow-100"
      />
      <UiStatCard
        title="Missed"
        :value="missedAppointments"
        subtitle="Require follow-up"
        :icon="ExclamationCircleIcon"
        icon-color="text-red-600"
        icon-bg-color="bg-red-100"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600">Loading appointments...</p>
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
              placeholder="Search by child or guardian name..."
              class="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="MISSED">Missed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            v-model="dateRangeFilter"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="past">Past Appointments</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Appointments Table -->
    <div v-if="!loading && !error" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Child Details
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment Details
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facility
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
              v-for="appointment in filteredAppointments"
              :key="appointment.appointmentID"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ appointment.child?.firstName }} {{ appointment.child?.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      DOB: {{ formatDate(appointment.child?.dateOfBirth) }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ appointment.child?.birthCertificateNumber }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDateTime(appointment.dateOfAppointment, appointment.timeOfAppointment) }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ appointment.reasonForAppointment || 'Vaccination Appointment' }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-if="appointment.child?.parent">
                    Guardian: {{ appointment.child.parent.firstname }} {{ appointment.child.parent.lastname }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ appointment.facility?.facilityName }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ appointment.facility?.facilityType }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ appointment.facility?.facilityDistrict }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    appointment.appointmentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    appointment.appointmentStatus === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    appointment.appointmentStatus === 'MISSED' ? 'bg-red-100 text-red-800' :
                    appointment.appointmentStatus === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                    appointment.appointmentStatus === 'RESCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ formatStatus(appointment.appointmentStatus) }}
                </span>
                <div v-if="isUpcomingAppointment(appointment)" class="text-xs text-gray-500 mt-1">
                  In {{ getDaysUntilAppointment(appointment) }} days
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="viewAppointmentDetails(appointment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="View Details"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="editAppointment(appointment)"
                    class="text-green-600 hover:text-green-900"
                    title="Edit Appointment"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="updateAppointmentStatus(appointment, 'COMPLETED')"
                    v-if="appointment.appointmentStatus === 'SCHEDULED'"
                    class="text-blue-600 hover:text-blue-900"
                    title="Mark as Completed"
                  >
                    <CheckCircleIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="cancelAppointment(appointment)"
                    v-if="appointment.appointmentStatus === 'SCHEDULED'"
                    class="text-red-600 hover:text-red-900"
                    title="Cancel Appointment"
                  >
                    <XCircleIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredAppointments.length === 0" class="text-center py-12">
        <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ filteredAppointments.length }}</span> of <span class="font-medium">{{ appointments.length }}</span> appointments
      </div>
    </div>

    <!-- Add/Edit Appointment Modal -->
    <div v-if="showAddAppointmentModal || showEditAppointmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Appointment' : 'Schedule New Appointment' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form @submit.prevent="saveAppointment" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Child Selection -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Child Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Child *
                </label>
                <select
                  v-model="appointmentForm.birthCertificateNumber"
                  required
                  @change="onChildSelect"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a child</option>
                  <option 
                    v-for="child in sortedChildren" 
                    :key="child.birthCertificateNumber || child.id"
                    :value="child.birthCertificateNumber || child.id"
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
                  <span class="text-gray-600">Age:</span>
                  <span class="font-medium">{{ calculateAge(selectedChild.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gender:</span>
                  <span class="font-medium">{{ selectedChild.gender || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Parent/Guardian:</span>
                  <span class="font-medium">
                    {{ selectedChild.parent?.firstname }} {{ selectedChild.parent?.lastname }}
                  </span>
                </div>
                <div v-if="childUpcomingAppointments.length > 0" class="mt-2 pt-2 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-1">Upcoming Appointments:</p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="(apt, index) in childUpcomingAppointments.slice(0, 3)" :key="index">
                      • {{ formatDate(apt.dateOfAppointment) }} - {{ apt.facility?.facilityName }}
                    </li>
                    <li v-if="childUpcomingAppointments.length > 3" class="text-primary-600">
                      + {{ childUpcomingAppointments.length - 3 }} more...
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- Appointment Details -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Appointment Details</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    v-model="appointmentForm.dateOfAppointment"
                    type="date"
                    required
                    :min="minAppointmentDate"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    v-model="appointmentForm.timeOfAppointment"
                    type="time"
                    required
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Appointment
                </label>
                <input
                  v-model="appointmentForm.reasonForAppointment"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., BCG Vaccination, Follow-up, etc."
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  v-model="appointmentForm.appointmentStatus"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="MISSED">Missed</option>
                  <option value="RESCHEDULED">Rescheduled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <!-- Facility Selection -->
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-900">Facility Information</h4>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Facility *
                </label>
                <select
                  v-model="appointmentForm.facilityID"
                  required
                  @change="onFacilitySelect"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a facility</option>
                  <option 
                    v-for="facility in filteredFacilities" 
                    :key="facility.facilityID"
                    :value="facility.facilityID"
                    :disabled="!facility.status || facility.status.toLowerCase() !== 'active'"
                  >
                    {{ facility.facilityName }} - {{ facility.facilityType }}
                    <template v-if="!facility.status || facility.status.toLowerCase() !== 'active'">
                      (Inactive)
                    </template>
                  </option>
                </select>
                <div v-if="selectedFacility && (!selectedFacility.status || selectedFacility.status.toLowerCase() !== 'active')" 
                     class="text-sm text-yellow-600 mt-2">
                  ⚠ This facility is currently inactive
                </div>
              </div>
              
              <div v-if="selectedFacility" class="bg-gray-50 rounded-lg p-4 space-y-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Address:</span>
                      <span class="font-medium text-right">{{ selectedFacility.facilityAddress }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Phone:</span>
                      <span class="font-medium text-right">{{ selectedFacility.facilityPhone }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">District:</span>
                      <span class="font-medium text-right">{{ selectedFacility.facilityDistrict }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Type:</span>
                      <span class="font-medium text-right">{{ selectedFacility.facilityType }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="facilityAppointmentStats" class="mt-2 pt-2 border-t border-gray-200">
                  <p class="text-sm font-medium text-gray-700 mb-1">Appointments on Selected Date:</p>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-blue-50 p-2 rounded">
                      <div class="font-semibold text-blue-700">{{ facilityAppointmentStats.selectedDateCount }}</div>
                      <div class="text-blue-600">Already Scheduled</div>
                    </div>
                    <div class="bg-green-50 p-2 rounded">
                      <div class="font-semibold text-green-700">{{ facilityAppointmentStats.availableSlots }}</div>
                      <div class="text-green-600">Available Slots</div>
                    </div>
                  </div>
                </div>
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
                v-model="appointmentForm.notes"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any additional notes or special instructions..."
              ></textarea>
            </div>
            
            <div v-if="appointmentForm.appointmentStatus === 'COMPLETED'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vaccines Administered
                </label>
                <input
                  v-model="appointmentForm.vaccinesAdministered"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., BCG, Polio, etc."
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Healthcare Worker
                </label>
                <input
                  v-model="appointmentForm.healthcareWorker"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Name of healthcare worker"
                />
              </div>
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
              :disabled="saving || !isFormValid"
              class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span v-if="saving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isEditing ? 'Update Appointment' : 'Schedule Appointment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Appointment Details Modal -->
    <div v-if="selectedAppointment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Appointment Details</h3>
              <p class="text-gray-600">Appointment ID: {{ selectedAppointment.appointmentID }}</p>
            </div>
            <button
              @click="selectedAppointment = null"
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
                  <span class="font-medium">{{ selectedAppointment.child?.firstName }} {{ selectedAppointment.child?.lastName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Date of Birth:</span>
                  <span class="font-medium">{{ formatDate(selectedAppointment.child?.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Age:</span>
                  <span class="font-medium">{{ calculateAge(selectedAppointment.child?.dateOfBirth) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Gender:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.gender || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Birth Certificate:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.birthCertificateNumber || 'N/A' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Appointment Details -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Appointment Details</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date:</span>
                  <span class="font-medium">{{ formatDate(selectedAppointment.dateOfAppointment) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Time:</span>
                  <span class="font-medium">{{ formatTime(selectedAppointment.timeOfAppointment) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Reason:</span>
                  <span class="font-medium">{{ selectedAppointment.reasonForAppointment || 'Vaccination Appointment' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span :class="[
                    'font-medium',
                    selectedAppointment.appointmentStatus === 'COMPLETED' ? 'text-green-600' :
                    selectedAppointment.appointmentStatus === 'SCHEDULED' ? 'text-blue-600' :
                    selectedAppointment.appointmentStatus === 'MISSED' ? 'text-red-600' :
                    'text-gray-600'
                  ]">
                    {{ formatStatus(selectedAppointment.appointmentStatus) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Facility Information -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Facility Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Facility Name:</span>
                  <span class="font-medium">{{ selectedAppointment.facility?.facilityName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium">{{ selectedAppointment.facility?.facilityAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ selectedAppointment.facility?.facilityPhone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="font-medium">{{ selectedAppointment.facility?.facilityType }}</span>
                </div>
              </div>
            </div>
            
            <!-- Parent Information -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-900 mb-4">Parent/Guardian Information</h4>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Name:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.parent?.firstname }} {{ selectedAppointment.child?.parent?.lastname }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.parent?.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.parent?.phone || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Address:</span>
                  <span class="font-medium">{{ selectedAppointment.child?.physicalAddress || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Medical Information -->
          <div v-if="selectedAppointment.child?.medicalConditions && selectedAppointment.child.medicalConditions.length > 0" class="mt-6 bg-gray-50 rounded-lg p-6">
            <h4 class="font-semibold text-gray-900 mb-3">Medical Conditions</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="(condition, index) in selectedAppointment.child.medicalConditions" :key="index" class="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                {{ condition }}
              </span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              @click="editSelectedAppointment"
              class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700"
            >
              Edit Appointment
            </button>
            <button
              @click="sendReminder(selectedAppointment)"
              v-if="selectedAppointment.appointmentStatus === 'SCHEDULED'"
              class="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700"
            >
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

// Reactive state
const loading = ref(false)
const error = ref('')
const appointments = ref<any[]>([])
const children = ref<any[]>([])
const facilities = ref<any[]>([])

// Filter states
const searchQuery = ref('')
const statusFilter = ref('all')
const facilityFilter = ref('all')
const dateRangeFilter = ref('all')

// Modal states
const showAddAppointmentModal = ref(false)
const showEditAppointmentModal = ref(false)
const selectedAppointment = ref<any>(null)
const saving = ref(false)

// Form state
const appointmentForm = ref({
  birthCertificateNumber: '',
  facilityID: '',
  dateOfAppointment: '',
  timeOfAppointment: '',
  reasonForAppointment: '',
  appointmentStatus: 'SCHEDULED',
  notes: '',
  vaccinesAdministered: '',
  healthcareWorker: ''
})

// Computed properties
const selectedChild = computed(() => {
  return children.value.find(c => c.birthCertificateNumber === appointmentForm.value.birthCertificateNumber || c.id === appointmentForm.value.birthCertificateNumber)
})

const selectedFacility = computed(() => {
  return facilities.value.find(f => f.facilityID === appointmentForm.value.facilityID)
})

const isEditing = computed(() => showEditAppointmentModal.value)

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value.filter(a => a.dateOfAppointment === today && a.appointmentStatus === 'SCHEDULED').length
})

const upcomingAppointments = computed(() => {
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  
  return appointments.value.filter(a => {
    const appointmentDate = new Date(a.dateOfAppointment)
    return appointmentDate > today && 
           appointmentDate <= nextWeek && 
           a.appointmentStatus === 'SCHEDULED'
  }).length
})

const missedAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value.filter(a => {
    const isMissedStatus = a.appointmentStatus === 'MISSED'
    const isOverdue = a.appointmentStatus === 'SCHEDULED' && a.dateOfAppointment < today
    return isMissedStatus || isOverdue
  }).length
})

const sortedChildren = computed(() => {
  return [...children.value].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
    return nameA.localeCompare(nameB)
  })
})

const childUpcomingAppointments = computed(() => {
  if (!appointmentForm.value.birthCertificateNumber) return []
  
  const today = new Date()
  return appointments.value.filter(appointment => 
    (appointment.child?.birthCertificateNumber === appointmentForm.value.birthCertificateNumber ||
     appointment.child?.id === appointmentForm.value.birthCertificateNumber) &&
    appointment.appointmentStatus === 'SCHEDULED' &&
    new Date(appointment.dateOfAppointment) >= today
  ).sort((a, b) => new Date(a.dateOfAppointment).getTime() - new Date(b.dateOfAppointment).getTime())
})

const filteredFacilities = computed(() => {
  // Sort facilities by status (active first) then by name
  return [...facilities.value].sort((a, b) => {
    const aActive = a.status && a.status.toLowerCase() === 'active'
    const bActive = b.status && b.status.toLowerCase() === 'active'
    
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    
    return a.facilityName.localeCompare(b.facilityName)
  })
})

const facilityAppointmentStats = computed(() => {
  if (!selectedFacility.value || !appointmentForm.value.dateOfAppointment) return null
  
  const selectedDateAppointments = appointments.value.filter(a => 
    a.facility?.facilityID === selectedFacility.value.facilityID &&
    a.dateOfAppointment === appointmentForm.value.dateOfAppointment &&
    a.appointmentStatus !== 'CANCELLED'
  ).length
  
  // Assume each facility has 20 appointment slots per day
  const maxSlotsPerDay = 20
  const availableSlots = Math.max(0, maxSlotsPerDay - selectedDateAppointments)
  
  return {
    selectedDateCount: selectedDateAppointments,
    availableSlots: availableSlots
  }
})

const minAppointmentDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return appointmentForm.value.birthCertificateNumber && 
         appointmentForm.value.facilityID && 
         appointmentForm.value.dateOfAppointment &&
         appointmentForm.value.timeOfAppointment
})

const filteredAppointments = computed(() => {
  let filtered = [...appointments.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(appointment => {
      const childName = `${appointment.child?.firstName || ''} ${appointment.child?.lastName || ''}`.toLowerCase()
      const guardianName = `${appointment.child?.parent?.firstname || ''} ${appointment.child?.parent?.lastname || ''}`.toLowerCase()
      return childName.includes(query) || guardianName.includes(query)
    })
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(appointment => appointment.appointmentStatus === statusFilter.value)
  }

  // Facility filter
  if (facilityFilter.value !== 'all') {
    filtered = filtered.filter(appointment => appointment.facility?.facilityID === facilityFilter.value)
  }

  // Date range filter
  if (dateRangeFilter.value !== 'all') {
    const today = new Date()
    filtered = filtered.filter(appointment => {
      const appointmentDate = new Date(appointment.dateOfAppointment)
      
      switch (dateRangeFilter.value) {
        case 'today':
          return appointmentDate.toDateString() === today.toDateString()
        case 'tomorrow':
          const tomorrow = new Date(today)
          tomorrow.setDate(today.getDate() + 1)
          return appointmentDate.toDateString() === tomorrow.toDateString()
        case 'week':
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
        case 'month':
          return appointmentDate.getMonth() === today.getMonth() && 
                 appointmentDate.getFullYear() === today.getFullYear()
        case 'past':
          return appointmentDate < today
        default:
          return true
      }
    })
  }

  // Sort by date (upcoming first, then by time)
  filtered.sort((a, b) => {
    const dateA = new Date(`${a.dateOfAppointment}T${a.timeOfAppointment || '00:00'}`)
    const dateB = new Date(`${b.dateOfAppointment}T${b.timeOfAppointment || '00:00'}`)
    return dateA.getTime() - dateB.getTime()
  })

  return filtered
})

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (timeString: string) => {
  if (!timeString) return 'N/A'
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

const formatDateTime = (dateString: string, timeString: string) => {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'SCHEDULED': 'Scheduled',
    'COMPLETED': 'Completed',
    'MISSED': 'Missed',
    'CANCELLED': 'Cancelled',
    'RESCHEDULED': 'Rescheduled'
  }
  return statusMap[status] || status
}

const calculateAge = (dob: string) => {
  if (!dob) return 'N/A'
  const birthDate = new Date(dob)
  const today = new Date()
  
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`
}

const isUpcomingAppointment = (appointment: any) => {
  if (!appointment.dateOfAppointment || appointment.appointmentStatus !== 'SCHEDULED') return false
  const appointmentDate = new Date(appointment.dateOfAppointment)
  const today = new Date()
  return appointmentDate >= today
}

const getDaysUntilAppointment = (appointment: any) => {
  if (!appointment.dateOfAppointment) return 0
  const appointmentDate = new Date(appointment.dateOfAppointment)
  const today = new Date()
  const diffTime = appointmentDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Event handlers
const onChildSelect = () => {
  if (!appointmentForm.value.birthCertificateNumber) return
  
  // Auto-set appointment date to tomorrow for new appointments
  if (!isEditing.value) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    appointmentForm.value.dateOfAppointment = tomorrow.toISOString().split('T')[0]
    appointmentForm.value.timeOfAppointment = '09:00' // Default morning appointment
  }
  
  // Auto-select facility based on child's previous appointments or location
  if (!appointmentForm.value.facilityID) {
    const previousFacility = getChildPreferredFacility()
    if (previousFacility) {
      appointmentForm.value.facilityID = previousFacility
    }
  }
  
  // Set reason for appointment based on child's age and vaccination schedule
  if (!appointmentForm.value.reasonForAppointment && !isEditing.value) {
    const childAge = calculateAge(selectedChild.value?.dateOfBirth)
    appointmentForm.value.reasonForAppointment = `Vaccination appointment for ${childAge} old child`
  }
}

const onFacilitySelect = () => {
  if (!appointmentForm.value.facilityID) return
  
  // Warn if facility is inactive
  if (selectedFacility.value && (!selectedFacility.value.status || selectedFacility.value.status.toLowerCase() !== 'active')) {
    console.warn('Selected facility is inactive')
  }
  
  // Suggest appointment times based on facility availability
  if (!appointmentForm.value.timeOfAppointment && !isEditing.value) {
    const suggestedTime = getSuggestedAppointmentTime()
    if (suggestedTime) {
      appointmentForm.value.timeOfAppointment = suggestedTime
    }
  }
  
  // Check facility capacity for selected date
  if (facilityAppointmentStats.value && facilityAppointmentStats.value.availableSlots < 5) {
    console.warn('Limited availability on selected date')
  }
}

const getChildPreferredFacility = () => {
  if (!appointmentForm.value.birthCertificateNumber) return null
  
  // Find the facility where the child has had the most appointments
  const childAppointments = appointments.value.filter(a => 
    a.child?.birthCertificateNumber === appointmentForm.value.birthCertificateNumber ||
    a.child?.id === appointmentForm.value.birthCertificateNumber
  )
  
  const facilityCounts: Record<string, number> = {}
  childAppointments.forEach(appointment => {
    if (appointment.facility?.facilityID) {
      facilityCounts[appointment.facility.facilityID] = (facilityCounts[appointment.facility.facilityID] || 0) + 1
    }
  })
  
  // Return the most used facility
  let maxCount = 0
  let preferredFacility = null
  for (const [facilityID, count] of Object.entries(facilityCounts)) {
    if (count > maxCount) {
      maxCount = count
      preferredFacility = facilityID
    }
  }
  
  return preferredFacility
}

const getSuggestedAppointmentTime = () => {
  if (!appointmentForm.value.dateOfAppointment || !selectedFacility.value) return null
  
  // Get appointments for selected date at this facility
  const dateAppointments = appointments.value.filter(a => 
    a.facility?.facilityID === selectedFacility.value.facilityID &&
    a.dateOfAppointment === appointmentForm.value.dateOfAppointment &&
    a.appointmentStatus !== 'CANCELLED'
  )
  
  // Common appointment times
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  
  // Find the first available slot
  for (const slot of timeSlots) {
    const slotTaken = dateAppointments.some(a => a.timeOfAppointment === slot)
    if (!slotTaken) {
      return slot
    }
  }
  
  return '09:00' // Default if all slots are taken
}

// Appointment actions
const viewAppointmentDetails = (appointment: any) => {
  selectedAppointment.value = appointment
}

const editSelectedAppointment = () => {
  showEditAppointmentModal.value = true
  populateEditForm(selectedAppointment.value)
  selectedAppointment.value = null
}

const editAppointment = (appointment: any) => {
  showEditAppointmentModal.value = true
  populateEditForm(appointment)
}

const populateEditForm = (appointment: any) => {
  appointmentForm.value = {
    birthCertificateNumber: appointment.child?.birthCertificateNumber || appointment.birthCertificateNumber || '',
    facilityID: appointment.facility?.facilityID || appointment.facilityID || '',
    dateOfAppointment: appointment.dateOfAppointment || '',
    timeOfAppointment: appointment.timeOfAppointment || '',
    reasonForAppointment: appointment.reasonForAppointment || '',
    appointmentStatus: appointment.appointmentStatus || 'SCHEDULED',
    notes: appointment.notes || '',
    vaccinesAdministered: appointment.vaccinesAdministered || '',
    healthcareWorker: appointment.healthcareWorker || ''
  }
}

const updateAppointmentStatus = async (appointment: any, status: string) => {
  if (confirm(`Are you sure you want to mark this appointment as ${formatStatus(status)}?`)) {
    try {
      // In a real application, you would call an API endpoint to update the status
      // For now, we'll update it locally
      appointment.appointmentStatus = status
      
      if (status === 'COMPLETED') {
        // Prompt for additional information
        const vaccines = prompt('Enter vaccines administered (comma-separated):')
        const healthcareWorker = prompt('Enter healthcare worker name:')
        
        if (vaccines) appointment.vaccinesAdministered = vaccines
        if (healthcareWorker) appointment.healthcareWorker = healthcareWorker
      }
      
      // Show success message
      alert(`Appointment marked as ${formatStatus(status)}`)
    } catch (err) {
      alert('Failed to update appointment status')
      console.error(err)
    }
  }
}

const cancelAppointment = async (appointment: any) => {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    try {
      appointment.appointmentStatus = 'CANCELLED'
      alert('Appointment cancelled successfully')
    } catch (err) {
      alert('Failed to cancel appointment')
      console.error(err)
    }
  }
}

const sendReminder = async (appointment: any) => {
  try {
    // In a real application, you would call an API to send email/SMS reminder
    alert(`Reminder sent for appointment on ${formatDate(appointment.dateOfAppointment)}`)
  } catch (err) {
    alert('Failed to send reminder')
    console.error(err)
  }
}

const closeModal = () => {
  showAddAppointmentModal.value = false
  showEditAppointmentModal.value = false
  selectedAppointment.value = null
  resetForm()
}

const resetForm = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  appointmentForm.value = {
    birthCertificateNumber: '',
    facilityID: '',
    dateOfAppointment: tomorrow.toISOString().split('T')[0],
    timeOfAppointment: '09:00',
    reasonForAppointment: '',
    appointmentStatus: 'SCHEDULED',
    notes: '',
    vaccinesAdministered: '',
    healthcareWorker: ''
  }
}

// API functions
const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Fetch all data in parallel
    const [appointmentsRes, childrenRes, facilitiesRes] = await Promise.allSettled([
      $fetch('http://localhost:8080/api/appointments/get-all-appointments'),
      $fetch('http://localhost:8080/api/children/get-all-children'),
      $fetch('http://localhost:8080/api/facilities/get-all-facilities')
    ])

    // Handle appointments
    if (appointmentsRes.status === 'fulfilled') {
      appointments.value = Array.isArray(appointmentsRes.value) ? appointmentsRes.value : []
    } else {
      console.error('Failed to fetch appointments:', appointmentsRes.reason)
      appointments.value = []
    }

    // Handle children
    if (childrenRes.status === 'fulfilled') {
      children.value = Array.isArray(childrenRes.value) ? childrenRes.value : []
    } else {
      console.error('Failed to fetch children:', childrenRes.reason)
      children.value = []
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

const saveAppointment = async () => {
  saving.value = true
  
  try {
    const payload = {
      birthCertificateNumber: appointmentForm.value.birthCertificateNumber,
      facilityID: appointmentForm.value.facilityID,
      dateOfAppointment: appointmentForm.value.dateOfAppointment,
      timeOfAppointment: appointmentForm.value.timeOfAppointment,
      reasonForAppointment: appointmentForm.value.reasonForAppointment,
      appointmentStatus: appointmentForm.value.appointmentStatus,
      notes: appointmentForm.value.notes,
      vaccinesAdministered: appointmentForm.value.vaccinesAdministered,
      healthcareWorker: appointmentForm.value.healthcareWorker
    }

    if (isEditing.value) {
      // For editing, you would typically need the appointment ID
      // You would need to implement edit functionality with the proper endpoint
      alert('Edit functionality needs to be implemented with appointment ID')
    } else {
      const response = await $fetch('http://localhost:8080/api/appointments/add-new-appointment', {
        method: 'POST',
        body: payload
      })
      
      if (response) {
        // Refresh the data
        await fetchData()
        closeModal()
        alert('Appointment scheduled successfully!')
      }
    }
  } catch (err: any) {
    alert(`Error saving appointment: ${err.message}`)
    console.error('Error saving appointment:', err)
  } finally {
    saving.value = false
  }
}

// Watch for changes
watch(() => appointmentForm.value.dateOfAppointment, (newDate) => {
  // Check facility availability for the new date
  if (newDate && selectedFacility.value) {
    // You could add logic to warn about high demand dates
  }
})

// Lifecycle hooks
onMounted(() => {
  fetchData()
  resetForm()
})
</script>
<template>
  <NuxtLayout name="admin-layout">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">System Dashboard</h1>
          <p class="text-gray-600 mt-1">Comprehensive overview of the immunization management system</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-500">
            Last updated: {{ lastUpdated }}
          </div>
          <button
            @click="refreshData"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            :disabled="loading"
          >
            <ArrowPathIcon class="h-5 w-5 mr-2" :class="{ 'animate-spin': loading }" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600 mr-3" />
        <div>
          <h3 class="font-semibold text-red-800">Error loading dashboard data</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
          <button
            @click="fetchAllData"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- System Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UiStatCard
          title="Total Children"
          :value="stats.totalChildren"
          subtitle="Registered children"
          :icon="UsersIcon"
          icon-color="text-blue-600"
          icon-bg-color="bg-blue-100"
          :trend="stats.childrenTrend"
        />
        <UiStatCard
          title="Active Facilities"
          :value="stats.activeFacilities"
          subtitle="Operating facilities"
          :icon="BuildingOfficeIcon"
          icon-color="text-green-600"
          icon-bg-color="bg-green-100"
          :trend="stats.facilitiesTrend"
        />
        <UiStatCard
          title="Today's Appointments"
          :value="stats.todayAppointments"
          subtitle="Scheduled for today"
          :icon="CalendarIcon"
          icon-color="text-purple-600"
          icon-bg-color="bg-purple-100"
        />
        <UiStatCard
          title="Coverage Rate"
          :value="`${stats.coverageRate}%`"
          subtitle="Overall vaccination coverage"
          :icon="ChartBarIcon"
          icon-color="text-primary-600"
          icon-bg-color="bg-primary-100"
          :trend="stats.coverageTrend"
        />
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UiStatCard
          title="Total Vaccinations"
          :value="stats.totalVaccinations"
          subtitle="Doses administered"
          :icon="CheckCircleIcon"
          icon-color="text-green-600"
          icon-bg-color="bg-green-100"
          :trend="stats.vaccinationsTrend"
        />
        <UiStatCard
          title="Upcoming Appointments"
          :value="stats.upcomingAppointments"
          subtitle="Next 7 days"
          :icon="ClockIcon"
          icon-color="text-yellow-600"
          icon-bg-color="bg-yellow-100"
        />
        <UiStatCard
          title="Missed Appointments"
          :value="stats.missedAppointments"
          subtitle="Require follow-up"
          :icon="ExclamationTriangleIcon"
          icon-color="text-red-600"
          icon-bg-color="bg-red-100"
          :trend="stats.missedTrend"
        />
        <UiStatCard
          title="Completion Rate"
          :value="`${stats.completionRate}%`"
          subtitle="Appointment success rate"
          :icon="CheckBadgeIcon"
          icon-color="text-indigo-600"
          icon-bg-color="bg-indigo-100"
          :trend="stats.completionTrend"
        />
      </div>

      <!-- Charts and Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Recent Activity -->
        <div class="lg:col-span-2">
          <UiCard>
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Recent System Activity</h3>
              <button
                @click="showAllActivity"
                class="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                View All
              </button>
            </div>
            
            <div class="space-y-4">
              <!-- Recent Vaccinations -->
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CheckCircleIcon class="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 class="font-medium text-blue-900">Recent Vaccinations</h4>
                  </div>
                  <span class="text-blue-700 font-semibold">{{ recentVaccinations.length }} new</span>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="vaccination in recentVaccinations.slice(0, 3)"
                    :key="vaccination.id"
                    class="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ vaccination.childName }}</p>
                      <p class="text-sm text-gray-600">{{ vaccination.vaccine }} • {{ vaccination.facility }}</p>
                    </div>
                    <span class="text-sm text-gray-500">{{ vaccination.date }}</span>
                  </div>
                </div>
              </div>

              <!-- Recent Appointments -->
              <div class="bg-purple-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <CalendarIcon class="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 class="font-medium text-purple-900">Recent Appointments</h4>
                  </div>
                  <span class="text-purple-700 font-semibold">{{ recentAppointments.length }} scheduled</span>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="appointment in recentAppointments.slice(0, 3)"
                    :key="appointment.id"
                    class="flex items-center justify-between bg-white rounded-lg p-3 border border-purple-100"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ appointment.childName }}</p>
                      <p class="text-sm text-gray-600">{{ appointment.vaccine || 'Vaccination' }} • {{ formatTime(appointment.time) }}</p>
                    </div>
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ formatStatus(appointment.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- New Children -->
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <UserPlusIcon class="h-5 w-5 text-green-600" />
                    </div>
                    <h4 class="font-medium text-green-900">New Registrations</h4>
                  </div>
                  <span class="text-green-700 font-semibold">{{ newChildren.length }} new</span>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="child in newChildren.slice(0, 3)"
                    :key="child.id"
                    class="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ child.fullName }}</p>
                      <p class="text-sm text-gray-600">DOB: {{ formatDate(child.dob) }} • {{ child.gender }}</p>
                    </div>
                    <span class="text-sm text-gray-500">{{ child.age }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UiCard>
        </div>

        <!-- Quick Actions -->
        <div>
          <UiCard>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                @click="navigateTo('/admin/children/')"
                class="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                    <UserPlusIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">Add New Child</p>
                    <p class="text-sm text-gray-600">Register a new child</p>
                  </div>
                </div>
                <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                @click="navigateTo('/admin/appointments/')"
                class="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200">
                    <CalendarIcon class="h-6 w-6 text-purple-600" />
                  </div>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">Schedule Appointment</p>
                    <p class="text-sm text-gray-600">Book new appointment</p>
                  </div>
                </div>
                <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-purple-600" />
              </button>

              <button
                @click="navigateTo('/admin/patients/')"
                class="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200">
                    <CheckCircleIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">Record Vaccination</p>
                    <p class="text-sm text-gray-600">Add vaccination record</p>
                  </div>
                </div>
                <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-green-600" />
              </button>

              <button
                @click="navigateTo('/admin/facilities')"
                class="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200">
                    <BuildingOfficeIcon class="h-6 w-6 text-orange-600" />
                  </div>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">Manage Facilities</p>
                    <p class="text-sm text-gray-600">View all facilities</p>
                  </div>
                </div>
                <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-orange-600" />
              </button>

              <button
                @click="navigateTo('/admin/analytics')"
                class="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200">
                    <ChartBarIcon class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div class="text-left">
                    <p class="font-medium text-gray-900">View Analytics</p>
                    <p class="text-sm text-gray-600">Detailed reports & insights</p>
                  </div>
                </div>
                <ArrowRightIcon class="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </UiCard>
        </div>
      </div>

     <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Facility Performance -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Facility Performance</h3>
          <div class="h-80">
            <UiBarChart
              class="h-full"
              :data="facilityPerformanceData"
              title="Vaccinations by Facility"
              :horizontal="true"
            />
          </div>
        </UiCard>

        <!-- Age Group Coverage -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Age Group Coverage</h3>
          <div class="h-80">
            <UiBarChart
              class="h-full"
              :data="ageGroupCoverageData"
              title="Coverage by Age Group"
            />
          </div>
        </UiCard>
         
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Facility Type Distribution</h3>
          <div class="h-64">
            <UiBarChart
              class="h-full"
              :data="facilityTypeData"
              title="Facilities by Type"
              :horizontal="true"
            />
          </div>
        </UiCard>
    
      </div>
      <!-- System Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- System Alerts -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div class="space-y-4">
            <div
              v-for="alert in systemAlerts"
              :key="alert.id"
              :class="[
                'p-4 rounded-lg border flex items-start',
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                alert.type === 'error' ? 'bg-red-50 border-red-200' :
                'bg-blue-50 border-blue-200'
              ]"
            >
              <div class="flex-shrink-0 mt-0.5">
                <ExclamationTriangleIcon
                  v-if="alert.type === 'warning'"
                  class="h-5 w-5 text-yellow-600"
                />
                <XCircleIcon
                  v-else-if="alert.type === 'error'"
                  class="h-5 w-5 text-red-600"
                />
                <InformationCircleIcon
                  v-else
                  class="h-5 w-5 text-blue-600"
                />
              </div>
              <div class="ml-3 flex-1">
                <div class="flex justify-between">
                  <p class="font-medium text-gray-900">{{ alert.title }}</p>
                  <span class="text-sm text-gray-500">{{ alert.time }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ alert.message }}</p>
                <button
                  v-if="alert.action"
                  @click="handleAlertAction(alert)"
                  class="mt-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  {{ alert.action }}
                </button>
              </div>
            </div>
            
            <div v-if="systemAlerts.length === 0" class="text-center py-8">
              <CheckCircleIcon class="mx-auto h-12 w-12 text-green-400" />
              <p class="mt-2 text-sm font-medium text-gray-900">All systems operational</p>
              <p class="mt-1 text-sm text-gray-500">No alerts at this time</p>
            </div>
          </div>
        </UiCard>

        <!-- Recent Appointments Table -->
        <UiCard>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Appointments</h3>
            <button
              @click="navigateTo('/appointments')"
              class="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              View All
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vaccine
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="appointment in recentAppointmentsTable"
                  :key="appointment.id"
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="viewAppointmentDetails(appointment)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon class="h-5 w-5 text-blue-600" />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ appointment.childName }}</div>
                        <div class="text-xs text-gray-500">{{ appointment.dob }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ appointment.vaccine || 'Vaccination' }}</div>
                    <div class="text-xs text-gray-500">{{ appointment.facility }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(appointment.date) }}</div>
                    <div class="text-xs text-gray-500">{{ formatTime(appointment.time) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ formatStatus(appointment.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </div>

      <!-- Performance Summary -->
      <div class="mb-8">
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div class="text-3xl font-bold text-blue-600">{{ stats.monthlyVaccinations }}</div>
              <div class="text-sm text-blue-700 font-medium">Vaccinations This Month</div>
              <div class="text-xs text-blue-600 mt-1">
                <ArrowTrendingUpIcon class="inline h-4 w-4" />
                {{ stats.vaccinationsTrend }}% from last month
              </div>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div class="text-3xl font-bold text-green-600">{{ stats.weeklyCompletions }}</div>
              <div class="text-sm text-green-700 font-medium">Appointments This Week</div>
              <div class="text-xs text-green-600 mt-1">
                <ArrowTrendingUpIcon class="inline h-4 w-4" />
                {{ stats.completionTrend }}% completion rate
              </div>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div class="text-3xl font-bold text-purple-600">{{ stats.newRegistrations }}</div>
              <div class="text-sm text-purple-700 font-medium">New Registrations</div>
              <div class="text-xs text-purple-600 mt-1">
                <ArrowTrendingUpIcon class="inline h-4 w-4" />
                {{ stats.childrenTrend }}% growth this month
              </div>
            </div>
            
            <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div class="text-3xl font-bold text-orange-600">{{ stats.avgResponseTime }}</div>
              <div class="text-sm text-orange-700 font-medium">Avg. Response Time</div>
              <div class="text-xs text-orange-600 mt-1">
                <ArrowTrendingDownIcon class="inline h-4 w-4" />
                12% faster than last week
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '#app'
import {
  UsersIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  ArrowRightIcon,
  UserIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Reactive state
const loading = ref(false)
const error = ref('')
const lastUpdated = ref('')
const coveragePeriod = ref('all')

// Data stores
const children = ref<any[]>([])
const vaccines = ref<any[]>([])
const facilities = ref<any[]>([])
const vaccinationRecords = ref<any[]>([])
const appointments = ref<any[]>([])

// Computed stats
const stats = computed(() => {
  const totalChildren = children.value.length
  const activeFacilities = facilities.value.filter(f => f.status && f.status.toLowerCase() === 'active').length
  const totalVaccinations = vaccinationRecords.value.length
  
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.value.filter(a => a.dateOfAppointment === today && a.appointmentStatus === 'SCHEDULED').length
  
  const upcomingDate = new Date()
  upcomingDate.setDate(upcomingDate.getDate() + 7)
  const upcomingAppointments = appointments.value.filter(a => {
    const appointmentDate = new Date(a.dateOfAppointment)
    return appointmentDate >= new Date() && 
           appointmentDate <= upcomingDate && 
           a.appointmentStatus === 'SCHEDULED'
  }).length
  
  const missedAppointments = appointments.value.filter(a => a.appointmentStatus === 'MISSED').length
  
  // Calculate coverage rate
  const vaccinatedChildren = new Set(
    vaccinationRecords.value.map(record => record.childT?.birthCertificationUser || record.childId)
  ).size
  const coverageRate = totalChildren > 0 ? Math.round((vaccinatedChildren / totalChildren) * 100) : 0
  
  // Calculate completion rate
  const completedAppointments = appointments.value.filter(a => a.appointmentStatus === 'COMPLETED').length
  const totalRelevantAppointments = appointments.value.filter(a => 
    ['SCHEDULED', 'COMPLETED', 'MISSED'].includes(a.appointmentStatus)
  ).length
  const completionRate = totalRelevantAppointments > 0 ? Math.round((completedAppointments / totalRelevantAppointments) * 100) : 0
  
  // Additional performance metrics
  const thisMonth = new Date().getMonth()
  const monthlyVaccinations = vaccinationRecords.value.filter(record => {
    const recordDate = new Date(record.vaccinationDate)
    return recordDate.getMonth() === thisMonth
  }).length
  
  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - 7)
  const weeklyCompletions = appointments.value.filter(a => {
    const appointmentDate = new Date(a.dateOfAppointment)
    return appointmentDate >= thisWeekStart && a.appointmentStatus === 'COMPLETED'
  }).length
  
  const newRegistrations = children.value.filter(child => {
    if (!child.createdAt) return false
    const createdAt = new Date(child.createdAt)
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return createdAt >= monthAgo
  }).length
  
  return {
    totalChildren: totalChildren.toLocaleString(),
    activeFacilities: activeFacilities.toString(),
    todayAppointments: todayAppointments.toString(),
    coverageRate,
    totalVaccinations: totalVaccinations.toLocaleString(),
    upcomingAppointments: upcomingAppointments.toString(),
    missedAppointments: missedAppointments.toString(),
    completionRate,
    monthlyVaccinations: monthlyVaccinations.toLocaleString(),
    weeklyCompletions: weeklyCompletions.toString(),
    newRegistrations: newRegistrations.toString(),
    avgResponseTime: '2.4h',
    // Simplified trends (in real app, compare with previous period)
    childrenTrend: 5.2,
    facilitiesTrend: 2.1,
    vaccinationsTrend: 12.5,
    coverageTrend: 3.7,
    completionTrend: 4.2,
    missedTrend: -1.5
  }
})

const recentVaccinations = computed(() => {
  return [...vaccinationRecords.value]
    .sort((a, b) => new Date(b.vaccinationDate).getTime() - new Date(a.vaccinationDate).getTime())
    .slice(0, 5)
    .map(record => {
      const childId = record.childT?.birthCertificationUser || record.childId
      const child = children.value.find(c => c.birthCertificateNumber === childId || c.id === childId)
      
      return {
        id: record.vaccinationId,
        childName: child ? `${child.firstName} ${child.lastName}` : 'Unknown Child',
        vaccine: getVaccineName(record.vaccineT?.vaccineUp || record.vaccineId),
        facility: getFacilityName(record.facilityId),
        date: formatDate(record.vaccinationDate)
      }
    })
})

const recentAppointments = computed(() => {
  return [...appointments.value]
    .sort((a, b) => new Date(b.dateOfAppointment).getTime() - new Date(a.dateOfAppointment).getTime())
    .slice(0, 6)
    .map(appointment => ({
      id: appointment.appointmentID,
      childName: `${appointment.child?.firstName} ${appointment.child?.lastName}`,
      vaccine: appointment.reasonForAppointment,
      facility: appointment.facility?.facilityName,
      date: appointment.dateOfAppointment,
      time: appointment.timeOfAppointment,
      status: appointment.appointmentStatus
    }))
})

const recentAppointmentsTable = computed(() => {
  return recentAppointments.value.map(appointment => ({
    ...appointment,
    dob: formatDate(appointment.child?.dateOfBirth),
    facility: appointment.facility || 'Unknown Facility'
  }))
})

const newChildren = computed(() => {
  return [...children.value]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.dateOfBirth || 0)
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.dateOfBirth || 0)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)
    .map(child => ({
      id: child.birthCertificateNumber || child.id,
      fullName: `${child.firstName} ${child.lastName}`,
      dob: child.dateOfBirth,
      gender: child.gender || 'Unknown',
      age: calculateAge(child.dateOfBirth)
    }))
})

const facilityPerformanceData = computed(() => {
  // Count vaccinations by facility
  const facilityCounts: Record<string, { count: number, name: string }> = {}
  
  vaccinationRecords.value.forEach(record => {
    const facilityID = record.facilityID
    const facilityName = getFacilityName(facilityID)
    if (!facilityCounts[facilityID]) {
      facilityCounts[facilityID] = { count: 0, name: facilityName }
    }
    facilityCounts[facilityID].count++
  })
  
  // Sort by count and take top 10
  const sortedFacilities = Object.entries(facilityCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
  
  const labels = sortedFacilities.map(([_, data]) => data.name)
  const data = sortedFacilities.map(([_, data]) => data.count)
  
  return {
    labels,
    datasets: [
      {
        label: 'Vaccinations',
        data,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1
      }
    ]
  }
})

const ageGroupCoverageData = computed(() => {
  // Define age groups
  const ageGroups = [
    { label: '0-6 months', min: 0, max: 6 },
    { label: '7-12 months', min: 7, max: 12 },
    { label: '1-2 years', min: 13, max: 24 },
    { label: '2-5 years', min: 25, max: 60 },
    { label: '5+ years', min: 61, max: 999 }
  ]
  
  // Count children and vaccinations by age group
  const groupCounts = ageGroups.map(group => ({
    label: group.label,
    total: 0,
    vaccinated: 0
  }))
  
  // Get vaccinated children IDs
  const vaccinatedbirthCertificateNumbers = new Set(
    vaccinationRecords.value.map(record => record.childT?.birthCertificationUser || record.birthCertificateNumber)
  )
  
  // Count children by age group
  children.value.forEach(child => {
    if (!child.dateOfBirth) return
    const dob = new Date(child.dateOfBirth)
    const today = new Date()
    let months = (today.getFullYear() - dob.getFullYear()) * 12
    months += today.getMonth() - dob.getMonth()
    
    for (let i = 0; i < ageGroups.length; i++) {
      if (months >= ageGroups[i].min && months <= ageGroups[i].max) {
        groupCounts[i].total++
        if (vaccinatedbirthCertificateNumbers.has(child.birthCertificateNumber || child.id)) {
          groupCounts[i].vaccinated++
        }
        break
      }
    }
  })
  
  // Calculate coverage percentages
  const labels = groupCounts.map(g => g.label)
  const data = groupCounts.map(g => g.total > 0 ? Math.round((g.vaccinated / g.total) * 100) : 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Coverage (%)',
        data,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1
      }
    ]
  }
})
const facilityTypeData = computed(() => {
  const typeCounts: Record<string, number> = {}
  
  facilities.value.forEach(facility => {
    const type = facility.facilityType || 'Unknown'
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })
  
  const labels = Object.keys(typeCounts)
  const data = Object.values(typeCounts)
  
  return {
    labels,
    datasets: [
      {
        label: 'Number of Facilities',
        data,
        backgroundColor: '#8b5cf6',
        borderColor: '#7c3aed',
        borderWidth: 1
      }
    ]
  }
})

const topFacilities = computed(() => {
  // Calculate facility performance
  const facilityStats = facilities.value.map(facility => {
    const facilityVaccinations = vaccinationRecords.value.filter(
      record => record.facilityID === facility.facilityID
    ).length
    
    const facilityAppointments = appointments.value.filter(
      appointment => appointment.facility?.facilityID === facility.facilityID
    )
    
    const completedAppointments = facilityAppointments.filter(
      appointment => appointment.appointmentStatus === 'COMPLETED'
    ).length
    
    const completionRate = facilityAppointments.length > 0 
      ? Math.round((completedAppointments / facilityAppointments.length) * 100)
      : 0
    
    return {
      id: facility.facilityID,
      name: facility.facilityName,
      district: facility.facilityDistrict || 'Unknown',
      type: facility.facilityType || 'Unknown',
      vaccinations: facilityVaccinations,
      completionRate
    }
  })
  
  // Sort by number of vaccinations and take top 5
  return facilityStats
    .sort((a, b) => b.vaccinations - a.vaccinations)
    .slice(0, 5)
})

const systemAlerts = computed(() => {
  const alerts = []
  const now = new Date()
  
  // Check for missed appointments
  const recentMissed = appointments.value.filter(a => 
    a.appointmentStatus === 'MISSED' && 
    new Date(a.dateOfAppointment) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  )
  
  if (recentMissed.length > 0) {
    alerts.push({
      id: 'missed-appointments',
      type: 'warning',
      title: `${recentMissed.length} Missed Appointments`,
      message: 'Recent appointments require follow-up',
      time: 'Today',
      action: 'View Details'
    })
  }
  
  // Check for low coverage
  if (stats.value.coverageRate < 85) {
    alerts.push({
      id: 'low-coverage',
      type: 'warning',
      title: 'Low Coverage Rate',
      message: `Overall coverage is ${stats.value.coverageRate}%, below target of 90%`,
      time: 'Today',
      action: 'Review Analytics'
    })
  }
  
  // Check for inactive facilities
  const inactiveFacilities = facilities.value.filter(f => 
    f.status && f.status.toLowerCase() !== 'active'
  )
  
  if (inactiveFacilities.length > 0) {
    alerts.push({
      id: 'inactive-facilities',
      type: 'info',
      title: `${inactiveFacilities.length} Inactive Facilities`,
      message: 'Some facilities are not currently active',
      time: 'Today',
      action: 'Manage Facilities'
    })
  }
  
  return alerts
})

// Helper functions
const getVaccineName = (vaccineId: string) => {
  const vaccine = vaccines.value.find(v => v.id === vaccineId || v.vaccination === vaccineId)
  return vaccine ? (vaccine.vaccineName || vaccine.vaccinations || 'Unknown Vaccine') : 'Unknown Vaccine'
}

const getFacilityName = (facilityId: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityId)
  return facility ? facility.facilityName : 'Unknown Facility'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
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
  
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12
  months += today.getMonth() - birthDate.getMonth()
  
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`
  }
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
}

// Data fetching
const fetchAllData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Fetch all data from endpoints
    const [childrenRes, vaccinesRes, facilitiesRes, vaccinationsRes, appointmentsRes] = await Promise.allSettled([
      $fetch('http://localhost:8080/api/children/get-all-children'),
      $fetch('http://localhost:8080/api/vaccines/get-all-vaccines'),
      $fetch('http://localhost:8080/api/facilities/get-all-facilities'),
      $fetch('http://localhost:8080/api/vaccinations/get-all-vaccination-records'),
      $fetch('http://localhost:8080/api/appointments/get-all-appointments')
    ])

    // Handle children data
    if (childrenRes.status === 'fulfilled') {
      children.value = Array.isArray(childrenRes.value) ? childrenRes.value : []
    } else {
      console.error('Failed to fetch children:', childrenRes.reason)
      children.value = []
    }

    // Handle vaccines data
    if (vaccinesRes.status === 'fulfilled') {
      vaccines.value = Array.isArray(vaccinesRes.value) ? vaccinesRes.value : []
    } else {
      console.error('Failed to fetch vaccines:', vaccinesRes.reason)
      vaccines.value = []
    }

    // Handle facilities data
    if (facilitiesRes.status === 'fulfilled') {
      facilities.value = Array.isArray(facilitiesRes.value) ? facilitiesRes.value : []
    } else {
      console.error('Failed to fetch facilities:', facilitiesRes.reason)
      facilities.value = []
    }

    // Handle vaccination records
    if (vaccinationsRes.status === 'fulfilled') {
      vaccinationRecords.value = Array.isArray(vaccinationsRes.value) ? vaccinationsRes.value : []
    } else {
      console.error('Failed to fetch vaccination records:', vaccinationsRes.reason)
      vaccinationRecords.value = []
    }

    // Handle appointments
    if (appointmentsRes.status === 'fulfilled') {
      appointments.value = Array.isArray(appointmentsRes.value) ? appointmentsRes.value : []
    } else {
      console.error('Failed to fetch appointments:', appointmentsRes.reason)
      appointments.value = []
    }

    // Update last updated timestamp
    lastUpdated.value = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

  } catch (err: any) {
    error.value = err.message || 'Failed to fetch dashboard data'
    console.error('Error fetching dashboard data:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchAllData()
}

// Navigation
const navigateTo = (path: string) => {
  router.push(path)
}

const showAllActivity = () => {
  navigateTo('/admin/analytics')
}

const viewAppointmentDetails = (appointment: any) => {
  navigateTo(`/admin/appointments/${appointment.id}`)
}

const handleAlertAction = (alert: any) => {
  switch (alert.id) {
    case 'missed-appointments':
      navigateTo('/appointments?status=MISSED')
      break
    case 'low-coverage':
      navigateTo('/admin/analytics')
      break
    case 'inactive-facilities':
      navigateTo('/admin/facilities')
      break
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchAllData()
})
</script>
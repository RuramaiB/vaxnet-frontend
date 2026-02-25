<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vaccination Analytics Dashboard</h1>
          <p class="text-gray-600 mt-1">Comprehensive analysis of vaccination coverage and trends</p>
        </div>
        <div class="flex items-center space-x-4">
          <select
            v-model="dateRange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
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
      <p class="mt-4 text-gray-600">Loading analytics data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex items-center">
        <ExclamationCircleIcon class="h-6 w-6 text-red-600 mr-3" />
        <div>
          <h3 class="font-semibold text-red-800">Error loading analytics data</h3>
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

    <!-- Analytics Dashboard -->
    <div v-else>
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UiStatCard
          title="Total Children"
          :value="formatNumber(totalChildren)"
          subtitle="Registered in system"
          :icon="UserGroupIcon"
          icon-color="text-blue-600"
          icon-bg-color="bg-blue-100"
          :trend="childrenTrend"
        />
        <UiStatCard
          title="Total Vaccinations"
          :value="formatNumber(totalVaccinations)"
          subtitle="Doses administered"
          :icon="CheckCircleIcon"
          icon-color="text-green-600"
          icon-bg-color="bg-green-100"
          :trend="vaccinationsTrend"
        />
        <UiStatCard
          title="Appointments"
          :value="formatNumber(totalAppointments)"
          subtitle="Scheduled & Completed"
          :icon="CalendarIcon"
          icon-color="text-purple-600"
          icon-bg-color="bg-purple-100"
          :trend="appointmentsTrend"
        />
        <UiStatCard
          title="Active Facilities"
          :value="formatNumber(activeFacilities)"
          subtitle="Operating facilities"
          :icon="BuildingOfficeIcon"
          icon-color="text-orange-600"
          icon-bg-color="bg-orange-100"
          :trend="facilitiesTrend"
        />
      </div>

      <!-- Coverage Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UiStatCard
          title="Overall Coverage"
          :value="`${overallCoverage}%`"
          subtitle="Vaccination coverage"
          :icon="ChartBarIcon"
          icon-color="text-primary-600"
          icon-bg-color="bg-primary-100"
          :trend="coverageTrend"
        />
        <UiStatCard
          title="Completion Rate"
          :value="`${completionRate}%`"
          subtitle="Appointments completed"
          :icon="CheckBadgeIcon"
          icon-color="text-green-600"
          icon-bg-color="bg-green-100"
          :trend="completionTrend"
        />
        <UiStatCard
          title="Missed Rate"
          :value="`${missedRate}%`"
          subtitle="Appointments missed"
          :icon="XCircleIcon"
          icon-color="text-red-600"
          icon-bg-color="bg-red-100"
          :trend="missedTrend"
        />
        <UiStatCard
          title="Avg. Age"
          :value="averageAge"
          subtitle="Children's average age"
          :icon="ClockIcon"
          icon-color="text-yellow-600"
          icon-bg-color="bg-yellow-100"
        />
      </div>


      <!-- Charts Row 2 -->
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

    

      <!-- Facility Type Distribution -->
     

      <!-- Data Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Facilities -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Facilities</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vaccinations
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="facility in topFacilities" :key="facility.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ facility.name }}</div>
                    <div class="text-sm text-gray-500">{{ facility.district }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {{ facility.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                    {{ formatNumber(facility.vaccinations) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          class="bg-green-600 h-2.5 rounded-full" 
                          :style="{ width: `${facility.completionRate}%` }"
                        ></div>
                      </div>
                      <span class="ml-2 text-sm font-medium text-gray-700">{{ facility.completionRate }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>

        <!-- Recent Vaccinations -->
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Vaccinations</h3>
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
                    Date
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="vaccination in recentVaccinations" :key="vaccination.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ vaccination.childName }}</div>
                    <div class="text-sm text-gray-500">{{ vaccination.childAge }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {{ vaccination.vaccine }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-900">
                    {{ formatDate(vaccination.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ vaccination.facility }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiCard>
      </div>

      <!-- Insights Summary -->
      <div class="mt-8">
        <UiCard>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <TrendingUpIcon class="h-5 w-5 text-blue-600" />
                </div>
                <h4 class="font-medium text-blue-900">Growth Trend</h4>
              </div>
              <p class="text-sm text-blue-700">
                Vaccinations increased by {{ vaccinationsTrend }}% compared to last month
              </p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircleIcon class="h-5 w-5 text-green-600" />
                </div>
                <h4 class="font-medium text-green-900">High Completion</h4>
              </div>
              <p class="text-sm text-green-700">
                {{ completionRate }}% of appointments are completed successfully
              </p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <BuildingOfficeIcon class="h-5 w-5 text-purple-600" />
                </div>
                <h4 class="font-medium text-purple-900">Facility Coverage</h4>
              </div>
              <p class="text-sm text-purple-700">
                {{ activeFacilities }} active facilities serving {{ totalChildren }} children
              </p>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Reactive state
const loading = ref(false)
const error = ref('')
const dateRange = ref('month')
const trendPeriod = ref('month')

// Data stores
const children = ref<any[]>([])
const vaccines = ref<any[]>([])
const facilities = ref<any[]>([])
const vaccinationRecords = ref<any[]>([])
const appointments = ref<any[]>([])

// Computed properties for metrics
const totalChildren = computed(() => children.value.length)
const totalVaccinations = computed(() => vaccinationRecords.value.length)
const totalAppointments = computed(() => appointments.value.length)
const activeFacilities = computed(() => 
  facilities.value.filter(f => f.status && f.status.toLowerCase() === 'active').length
)

const overallCoverage = computed(() => {
  if (totalChildren.value === 0) return 0
  const vaccinatedChildren = new Set(
    vaccinationRecords.value.map(record => record.childT?.birthCertificationUser || record.birthCertificateNumber)
  ).size
  return Math.round((vaccinatedChildren / totalChildren.value) * 100)
})

const completionRate = computed(() => {
  const completed = appointments.value.filter(a => a.appointmentStatus === 'COMPLETED').length
  const total = appointments.value.filter(a => 
    ['SCHEDULED', 'COMPLETED', 'MISSED'].includes(a.appointmentStatus)
  ).length
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const missedRate = computed(() => {
  const missed = appointments.value.filter(a => a.appointmentStatus === 'MISSED').length
  const total = appointments.value.filter(a => 
    ['SCHEDULED', 'COMPLETED', 'MISSED'].includes(a.appointmentStatus)
  ).length
  return total > 0 ? Math.round((missed / total) * 100) : 0
})

const averageAge = computed(() => {
  if (children.value.length === 0) return '0'
  const totalMonths = children.value.reduce((sum, child) => {
    if (!child.dateOfBirth) return sum
    const dob = new Date(child.dateOfBirth)
    const today = new Date()
    let months = (today.getFullYear() - dob.getFullYear()) * 12
    months += today.getMonth() - dob.getMonth()
    return sum + months
  }, 0)
  
  const avgMonths = Math.round(totalMonths / children.value.length)
  if (avgMonths < 12) return `${avgMonths}m`
  const years = Math.floor(avgMonths / 12)
  const months = avgMonths % 12
  return months > 0 ? `${years}y ${months}m` : `${years}y`
})

// Trend calculations (simplified - in real app would compare with historical data)
const childrenTrend = computed(() => 5.2)
const vaccinationsTrend = computed(() => 12.5)
const appointmentsTrend = computed(() => 8.3)
const facilitiesTrend = computed(() => 2.1)
const coverageTrend = computed(() => 3.7)
const completionTrend = computed(() => 4.2)
const missedTrend = computed(() => -1.5)

// Chart data computations




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

const recentVaccinations = computed(() => {
  // Get recent vaccinations (last 10)
  const recent = [...vaccinationRecords.value]
    .sort((a, b) => new Date(b.vaccinationDate).getTime() - new Date(a.vaccinationDate).getTime())
    .slice(0, 10)
  
  return recent.map(record => {
    const birthCertificateNumber = record.childT?.birthCertificationUser || record.birthCertificateNumber
    const child = children.value.find(c => c.birthCertificateNumber === birthCertificateNumber || c.id === birthCertificateNumber)
    
    return {
      id: record.vaccinationId,
      childName: child ? `${child.firstName} ${child.lastName}` : 'Unknown Child',
      childAge: child && child.dateOfBirth ? calculateAge(child.dateOfBirth) : 'N/A',
      vaccine: getVaccineName(record.vaccineT?.vaccineUp || record.vaccineID),
      date: record.vaccinationDate,
      facility: getFacilityName(record.facilityID)
    }
  })
})

// Helper functions
const getVaccineName = (vaccineID: string) => {
  const vaccine = vaccines.value.find(v => v.id === vaccineID || v.vaccination === vaccineID)
  return vaccine ? (vaccine.vaccineName || vaccine.vaccinations || 'Unknown Vaccine') : 'Unknown Vaccine'
}

const getFacilityName = (facilityID: string) => {
  const facility = facilities.value.find(f => f.facilityID === facilityID)
  return facility ? facility.facilityName : 'Unknown Facility'
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
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

  } catch (err: any) {
    error.value = err.message || 'Failed to fetch analytics data'
    console.error('Error fetching analytics data:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchAllData()
}

// Watch for date range changes
watch(dateRange, () => {
  // In a real application, you would filter data based on date range
  // For now, we'll just refresh the data
  fetchAllData()
})

// Lifecycle hooks
onMounted(() => {
  fetchAllData()
})
</script>
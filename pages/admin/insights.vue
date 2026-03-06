<template>
  <div class="min-h-screen bg-gray-50 flex">
    <Sidebar />

    <main class="flex-1 ml-64 p-8">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 font-heading">AI Data Insights</h1>
          <p class="text-gray-500 mt-1">National Immunization Performance & AI-Generated Narrative Analysis</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="fetchData" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
          <div class="px-4 py-2 bg-blue-600 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-200">
            Live Analysis
          </div>
        </div>
      </header>

      <!-- KPI Grid -->
      <div v-if="overview" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="kpi in kpis" :key="kpi.label" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', kpi.bg]">
            <component :is="kpi.icon" class="w-6 h-6" :class="kpi.color" />
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ kpi.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ kpi.value }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- AI Narrative Analysis -->
        <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <!-- Decorative accent -->
          <div class="absolute top-0 right-0 p-8 opacity-5">
            <svg class="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          
          <div class="p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-lg">✨</span>
              </div>
              <h2 class="text-xl font-bold text-gray-900 font-heading">AI Narrative Insight Report</h2>
            </div>
            
            <div v-if="narrative" class="prose prose-blue max-w-none">
              <div class="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 leading-relaxed text-gray-700 whitespace-pre-wrap">
                {{ narrative.narrative }}
              </div>
            </div>
            <div v-else-if="loading" class="space-y-4">
              <div class="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div class="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            </div>
            
            <div v-if="narrative" class="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generated at {{ narrative.generatedAt }}
            </div>
          </div>
        </div>

        <!-- Fully Vaccinated Progress -->
        <div v-if="overview" class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
          <h3 class="text-lg font-bold text-gray-900 mb-8 font-heading">Full Compliance Rate</h3>
          
          <div class="relative flex items-center justify-center">
            <svg class="w-48 h-48" viewBox="0 0 100 100">
              <!-- Background -->
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" stroke-width="8" />
              <!-- Progress -->
              <circle cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="263.89"
                :stroke-dashoffset="263.89 - (263.89 * overview.fullyVaccinatedPercent / 100)"
                class="transition-all duration-1000 ease-out"
                transform="rotate(-90 50 50)" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-black text-gray-900">{{ overview.fullyVaccinatedPercent }}%</span>
              <span class="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">Children</span>
            </div>
          </div>
          
          <p class="mt-8 text-sm text-center text-gray-500 leading-relaxed">
            Percentage of registered children who have received <strong>all doses</strong> scheduled for their current age.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- District Performance Heatmap -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 font-heading">Regional Distribution</h3>
            <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">By District</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50/50">
                <tr>
                  <th class="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">District</th>
                  <th class="px-4 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled</th>
                  <th class="px-4 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Coverage</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="d in districtData" :key="d.district" class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-8 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ d.district }}</td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{{ d.children }}</td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center justify-end gap-3">
                      <div class="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-1000"
                          :style="{ width: d.coveragePercent + '%', backgroundColor: getHeatColor(d.coveragePercent) }"></div>
                      </div>
                      <span class="text-xs font-bold tabular-nums" :style="{ color: getHeatColor(d.coveragePercent) }">{{ d.coveragePercent }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vaccine Specific Coverage -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 font-heading">Vaccine Uptake Analysis</h3>
            <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">By Antigen</span>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="v in vaccineData" :key="v.vaccineKey" class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-semibold text-gray-700">{{ v.vaccineName }}</span>
                <span class="tabular-nums font-bold text-gray-900">{{ v.coveragePercent }}%</span>
              </div>
              <div class="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-sm"
                  :style="{ width: v.coveragePercent + '%' }"></div>
              </div>
              <div class="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>{{ v.administered }} Administered</span>
                <span>{{ v.overdue }} Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- UI Icons Mapping (Nuxt Lucide Icons helper or manually) -->
    <div v-if="false">
      <UsersIcon /> <CheckCircleIcon /> <AlertCircleIcon /> <ChartBarIcon />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const overview = ref(null)
const narrative = ref(null)
const districtData = ref([])
const vaccineData = ref([])
const loading = ref(true)

const fetchData = async () => {
  loading.value = true
  try {
    const [ov, nar, dist, vacc] = await Promise.all([
      fetch('http://localhost:8080/api/insights/overview').then(r => r.json()),
      fetch('http://localhost:8080/api/insights/narrative').then(r => r.json()),
      fetch('http://localhost:8080/api/insights/by-district').then(r => r.json()),
      fetch('http://localhost:8080/api/insights/vaccine-coverage').then(r => r.json())
    ])
    overview.value = ov
    narrative.value = nar
    districtData.value = dist
    vaccineData.value = vacc
  } catch (e) {
    console.error('Failed to fetch insights:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const kpis = computed(() => {
  if (!overview.value) return []
  return [
    { label: 'Total Children', value: overview.value.totalChildren, icon: 'UsersIcon', bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'National Coverage', value: `${overview.value.coveragePercent}%`, icon: 'CheckCircleIcon', bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Total Doses', value: overview.value.administeredDoses, icon: 'ChartBarIcon', bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Overdue Children', value: overview.value.overdueChildren, icon: 'AlertCircleIcon', bg: 'bg-red-50', color: 'text-red-600' }
  ]
})

const getHeatColor = (pct) => {
  if (pct >= 90) return '#16a34a'
  if (pct >= 80) return '#22c55e'
  if (pct >= 60) return '#f59e0b'
  if (pct >= 40) return '#ea580c'
  return '#dc2626'
}

// Icon fallbacks (since we might not have lucide-vue easily)
const UsersIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.195a4 4 0 01-4.9 1.096L15 21m0 0l-3-3m3 3l3-3" /></svg>' }
const CheckCircleIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const AlertCircleIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' }
const ChartBarIcon = { template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" /></svg>' }
</script>

<style scoped>
.font-heading {
  font-family: 'Outfit', sans-serif;
}
</style>

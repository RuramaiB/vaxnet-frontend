<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Immunization Tracker</h1>
          <p class="text-gray-600 mt-1">Zimbabwe National Immunization Schedule — CHW Job Aid</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span class="text-sm font-medium text-red-700">{{ overdueCount }} Overdue</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span class="text-sm font-medium text-yellow-700">{{ dueSoonCount }} Due Soon</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-6 h-[calc(100vh-180px)]">

      <!-- ── Left Panel: Children List ────────────────────────────── -->
      <div class="w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="childSearch" type="text" placeholder="Search children..." class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="overflow-y-auto flex-1">
          <div v-if="loadingChildren" class="p-8 text-center">
            <div class="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>

          <div
            v-for="child in filteredChildren"
            :key="child.birthCertificateNumber"
            @click="selectChild(child)"
            :class="['flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors',
                     selectedChild?.birthCertificateNumber === child.birthCertificateNumber ? 'bg-blue-50 border-l-4 border-l-blue-600' : '']"
          >
            <div :class="['w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold',
                          child.gender === 'MALE' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
              {{ (child.firstName?.[0] || '') + (child.lastName?.[0] || '') }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ child.firstName }} {{ child.lastName }}</p>
              <p class="text-xs text-gray-500">{{ calculateAge(child.dateOfBirth) }}</p>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <span v-if="getChildOverdueCount(child.birthCertificateNumber) > 0"
                class="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                {{ getChildOverdueCount(child.birthCertificateNumber) }} overdue
              </span>
              <span v-else-if="getChildDueCount(child.birthCertificateNumber) > 0"
                class="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                {{ getChildDueCount(child.birthCertificateNumber) }} due
              </span>
              <span v-else class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                up to date
              </span>
            </div>
          </div>

          <div v-if="!loadingChildren && filteredChildren.length === 0" class="p-8 text-center text-gray-500 text-sm">
            No children found
          </div>
        </div>
      </div>

      <!-- ── Right Panel: Immunization Card ──────────────────────── -->
      <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">

        <!-- Empty state -->
        <div v-if="!selectedChild" class="flex flex-col items-center justify-center h-full text-gray-400">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium text-gray-500">Select a child</p>
          <p class="text-sm text-gray-400 mt-1">to view their immunization card</p>
        </div>

        <!-- Child Immunization Card -->
        <div v-else>
          <!-- Card Header -->
          <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-bold text-white">{{ selectedChild.firstName }} {{ selectedChild.lastName }}</h2>
                <div class="flex items-center gap-4 mt-2 text-blue-100 text-sm">
                  <span>DOB: {{ formatDate(selectedChild.dateOfBirth) }}</span>
                  <span>Age: {{ calculateAge(selectedChild.dateOfBirth) }}</span>
                  <span>BCN: {{ selectedChild.birthCertificateNumber }}</span>
                </div>
              </div>
              <!-- Progress Ring -->
              <div class="text-center">
                <div class="text-3xl font-bold text-white">{{ administerCount }}/{{ totalDoses }}</div>
                <div class="text-xs text-blue-200 mt-1">Doses given</div>
                <div class="w-full bg-blue-400 rounded-full h-2 mt-2">
                  <div class="bg-white h-2 rounded-full transition-all" :style="{width: progressPct + '%'}"></div>
                </div>
              </div>
            </div>

            <!-- Summary badges -->
            <div class="flex gap-3 mt-4">
              <span class="flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                <span class="w-2 h-2 bg-green-300 rounded-full"></span> {{ administerCount }} Administered
              </span>
              <span class="flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                <span class="w-2 h-2 bg-red-300 rounded-full"></span> {{ overdueInCard }} Overdue
              </span>
              <span class="flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                <span class="w-2 h-2 bg-yellow-300 rounded-full"></span> {{ dueInCard }} Due
              </span>
              <span class="flex items-center gap-1 bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                <span class="w-2 h-2 bg-gray-300 rounded-full"></span> {{ notYetDueInCard }} Pending
              </span>
            </div>
          </div>

          <!-- Loading schedule -->
          <div v-if="loadingSchedule" class="p-12 text-center">
            <div class="animate-spin inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mb-3"></div>
            <p class="text-gray-600">Loading immunization schedule...</p>
          </div>

          <!-- Vaccine Table (CHW Job Aid style) -->
          <div v-else-if="schedule">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vaccine</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age Due</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route / Site</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch No.</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="dose in schedule.doses"
                    :key="dose.vaccineKey"
                    :class="['transition-colors', getRowBg(dose.status)]"
                  >
                    <td class="px-4 py-3">
                      <div class="font-semibold text-gray-900 text-sm">{{ dose.vaccineName }}</div>
                      <div class="text-xs text-gray-500">{{ dose.dosage }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ formatScheduledAge(dose.scheduledAgeWeeks) }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">
                      <div>{{ formatDate(dose.scheduledDate) }}</div>
                      <div v-if="dose.administeredDate" class="text-xs text-green-600">Given: {{ formatDate(dose.administeredDate) }}</div>
                    </td>
                    <td class="px-4 py-3 text-xs text-gray-600">
                      <div>{{ dose.route }}</div>
                      <div class="text-gray-400">{{ dose.site }}</div>
                    </td>
                    <td class="px-4 py-3">
                      <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap', getStatusClass(dose.status)]">
                        <span :class="['w-1.5 h-1.5 rounded-full', getStatusDotClass(dose.status)]"></span>
                        {{ getStatusLabel(dose.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span v-if="dose.batchNumber" class="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">{{ dose.batchNumber }}</span>
                      <span v-else class="text-xs text-gray-400">—</span>
                    </td>
                    <td class="px-4 py-3">
                      <div v-if="dose.status !== 'ADMINISTERED'" class="flex items-center gap-2">
                        <input
                          v-model="batchInputs[dose.vaccineKey]"
                          type="text"
                          placeholder="Batch #"
                          class="w-24 text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          @click="administerVaccine(dose)"
                          :disabled="administeringKey === dose.vaccineKey"
                          class="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {{ administeringKey === dose.vaccineKey ? '...' : '✓ Given' }}
                        </button>
                      </div>
                      <div v-else class="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Administered
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const API_BASE = 'http://localhost:8080/api'

interface Child {
  birthCertificateNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  parent?: { firstname: string; lastname: string; email: string }
}

interface VaccineDose {
  vaccineKey: string
  vaccineName: string
  scheduledAgeWeeks: number
  maxAgeWeeks: number
  route: string
  site: string
  dosage: string
  scheduledDate: string
  administeredDate: string | null
  batchNumber: string | null
  status: string
}

interface Schedule {
  id: string
  child: Child
  doses: VaccineDose[]
}

// State
const children = ref<Child[]>([])
const selectedChild = ref<Child | null>(null)
const schedule = ref<Schedule | null>(null)
const loadingChildren = ref(false)
const loadingSchedule = ref(false)
const childSearch = ref('')
const batchInputs = ref<Record<string, string>>({})
const administeringKey = ref<string | null>(null)

// Per-child status caches (for the left panel badges)
const childStatusCache = ref<Record<string, { overdue: number; due: number }>>({})

// Computed
const filteredChildren = computed(() => {
  const q = childSearch.value.toLowerCase()
  return children.value.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.birthCertificateNumber?.toLowerCase().includes(q)
  )
})

const totalDoses = computed(() => schedule.value?.doses.length ?? 22)
const administerCount = computed(() => schedule.value?.doses.filter(d => d.status === 'ADMINISTERED').length ?? 0)
const overdueInCard = computed(() => schedule.value?.doses.filter(d => d.status === 'OVERDUE').length ?? 0)
const dueInCard = computed(() => schedule.value?.doses.filter(d => d.status === 'DUE' || d.status === 'DUE_SOON').length ?? 0)
const notYetDueInCard = computed(() => schedule.value?.doses.filter(d => d.status === 'NOT_YET_DUE').length ?? 0)
const progressPct = computed(() => totalDoses.value > 0 ? Math.round((administerCount.value / totalDoses.value) * 100) : 0)

const overdueCount = computed(() => Object.values(childStatusCache.value).filter(s => s.overdue > 0).length)
const dueSoonCount = computed(() => Object.values(childStatusCache.value).filter(s => s.due > 0).length)

// Fetch all children
const fetchChildren = async () => {
  loadingChildren.value = true
  try {
    const resp = await fetch(`${API_BASE}/children/get-all-children`)
    const data = await resp.json()
    children.value = Array.isArray(data) ? data : []
    // Pre-load status caches
    for (const child of children.value) {
      loadChildStatus(child.birthCertificateNumber)
    }
  } catch (e) {
    console.error('Failed to load children', e)
  } finally {
    loadingChildren.value = false
  }
}

const loadChildStatus = async (bcn: string) => {
  try {
    const resp = await fetch(`${API_BASE}/immunization/schedule/${bcn}`)
    if (!resp.ok) return
    const data: Schedule = await resp.json()
    childStatusCache.value[bcn] = {
      overdue: data.doses.filter(d => d.status === 'OVERDUE').length,
      due: data.doses.filter(d => d.status === 'DUE' || d.status === 'DUE_SOON').length
    }
  } catch { /* silent */ }
}

const getChildOverdueCount = (bcn: string) => childStatusCache.value[bcn]?.overdue ?? 0
const getChildDueCount = (bcn: string) => childStatusCache.value[bcn]?.due ?? 0

// Select a child and load their schedule
const selectChild = async (child: Child) => {
  selectedChild.value = child
  schedule.value = null
  loadingSchedule.value = true
  batchInputs.value = {}
  try {
    const resp = await fetch(`${API_BASE}/immunization/schedule/${child.birthCertificateNumber}`)
    if (resp.ok) {
      schedule.value = await resp.json()
      // Pre-fill batch inputs
      schedule.value?.doses.forEach(d => {
        batchInputs.value[d.vaccineKey] = ''
      })
    }
  } catch (e) {
    console.error('Failed to load schedule', e)
  } finally {
    loadingSchedule.value = false
  }
}

// Mark a dose as administered
const administerVaccine = async (dose: VaccineDose) => {
  if (!selectedChild.value) return
  administeringKey.value = dose.vaccineKey
  try {
    const batchNumber = batchInputs.value[dose.vaccineKey]?.trim() || 'N/A'
    const resp = await fetch(
      `${API_BASE}/immunization/administer/${selectedChild.value.birthCertificateNumber}/${dose.vaccineKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchNumber })
      }
    )
    if (resp.ok) {
      schedule.value = await resp.json()
      // Update the left panel cache
      loadChildStatus(selectedChild.value.birthCertificateNumber)
    }
  } catch (e) {
    console.error('Failed to administer vaccine', e)
  } finally {
    administeringKey.value = null
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const calculateAge = (dob: string) => {
  if (!dob) return '—'
  const birth = new Date(dob)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years === 0) return `${months}m`
  if (years < 2) return `${years}y ${months}m`
  return `${years} yrs`
}

const formatScheduledAge = (weeks: number) => {
  if (weeks === 0) return 'At Birth'
  if (weeks < 8) return `${weeks} weeks`
  const months = Math.round(weeks / 4.33)
  if (months < 24) return `${months} months`
  const years = Math.round(weeks / 52.18)
  return `${years} years`
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ADMINISTERED': return 'bg-green-100 text-green-800'
    case 'OVERDUE':       return 'bg-red-100 text-red-800'
    case 'DUE':           return 'bg-yellow-100 text-yellow-800'
    case 'DUE_SOON':      return 'bg-orange-100 text-orange-800'
    default:              return 'bg-gray-100 text-gray-600'
  }
}

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'ADMINISTERED': return 'bg-green-500'
    case 'OVERDUE':       return 'bg-red-500'
    case 'DUE':           return 'bg-yellow-500'
    case 'DUE_SOON':      return 'bg-orange-500'
    default:              return 'bg-gray-400'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ADMINISTERED': return 'Administered'
    case 'OVERDUE':       return 'Overdue'
    case 'DUE':           return 'Due Now'
    case 'DUE_SOON':      return 'Due Soon'
    default:              return 'Not Yet Due'
  }
}

const getRowBg = (status: string) => {
  switch (status) {
    case 'OVERDUE':  return 'bg-red-50   hover:bg-red-100'
    case 'DUE':      return 'bg-yellow-50 hover:bg-yellow-100'
    case 'DUE_SOON': return 'bg-orange-50 hover:bg-orange-100'
    default:         return 'hover:bg-gray-50'
  }
}

onMounted(fetchChildren)
</script>

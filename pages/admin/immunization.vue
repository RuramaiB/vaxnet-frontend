<template>
  <NuxtLayout name="admin-layout">
    <div class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Immunization Record</h1>
        <p class="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">Zimbabwe National Child Health System</p>
      </div>
      <div class="flex gap-4">
        <div class="px-6 py-3 bg-white rounded-2xl shadow-sm border border-orange-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div class="text-2xl font-black text-gray-900 leading-none">{{ overdueCount }}</div>
            <div class="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">Overdue Doses</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-8 h-[calc(100vh-220px)]">
      <!-- ── Left Panel: Patient Directory ────────────────────────────── -->
      <div class="w-80 flex-shrink-0 flex flex-col gap-4">
        <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              v-model="childSearch" 
              type="text" 
              placeholder="Search by name or BCN..." 
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div class="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-50">
            <h3 class="font-bold text-gray-900">Registered Children</h3>
          </div>
          <div class="overflow-y-auto flex-1 custom-scrollbar">
            <div
              v-for="child in filteredChildren"
              :key="child.birthCertificateNumber"
              @click="selectChild(child)"
              :class="['group flex items-center gap-4 p-5 cursor-pointer transition-all border-b border-gray-50',
                       selectedChild?.birthCertificateNumber === child.birthCertificateNumber ? 'bg-blue-50/50' : 'hover:bg-gray-50']"
            >
              <div :class="['w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-bold shadow-sm',
                            child.gender === 'MALE' ? 'bg-blue-600 text-white' : 'bg-pink-500 text-white']">
                {{ child.firstName?.[0] }}{{ child.lastName?.[0] }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 truncate">{{ child.firstName }} {{ child.lastName }}</p>
                <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{{ child.birthCertificateNumber }}</p>
              </div>
              <div v-if="getChildOverdueCount(child.birthCertificateNumber) > 0" class="w-2 h-2 rounded-full bg-red-500 shadow-sm animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Right Panel: The "Road to Health" Physical Card ────────────── -->
      <div class="flex-1 overflow-y-auto custom-scrollbar rounded-[2.5rem] bg-[#f9f7f2] border-4 border-white shadow-2xl relative">
        <!-- Paper Texture Overlay -->
        <div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

        <div v-if="!selectedChild" class="h-full flex flex-col items-center justify-center p-12 text-center">
          <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
            <IdentificationIcon class="w-12 h-12 text-gray-300" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Patient File Not Selected</h2>
          <p class="text-gray-500 mt-2 max-w-xs mx-auto">Please select a child from the directory to view their official immunization record.</p>
        </div>

        <div v-else class="p-10 relative z-10">
          <!-- Official Card Header -->
          <div class="mb-10 border-b-4 border-gray-900/10 pb-8 flex justify-between items-start">
            <div class="flex gap-8">
              <div class="w-32 h-32 bg-white rounded-3xl p-2 border-2 border-gray-900/5 shadow-inner flex items-center justify-center overflow-hidden">
                <img v-if="selectedChild.gender === 'MALE'" src="https://api.dicebear.com/7.x/avataaars/svg?seed=boy" class="w-full h-full object-cover" />
                <img v-else src="https://api.dicebear.com/7.x/avataaars/svg?seed=girl" class="w-full h-full object-cover" />
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-4xl font-black text-gray-900 lowercase italic" style="font-family: 'Times New Roman', serif;">
                    {{ selectedChild.firstName }} <span class="uppercase not-italic text-blue-800">{{ selectedChild.lastName }}</span>
                  </h2>
                </div>
                <div class="grid grid-cols-2 gap-x-12 gap-y-2 mt-4">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Birth</span>
                    <span class="text-lg font-bold text-gray-800">{{ formatDate(selectedChild.dateOfBirth) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration No.</span>
                    <span class="text-lg font-mono font-bold text-gray-800">{{ selectedChild.birthCertificateNumber }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Biological Sex</span>
                    <span class="text-lg font-bold text-gray-800">{{ selectedChild.gender }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clinic Group</span>
                    <span class="text-lg font-bold text-gray-800">Primary Healthcare</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Progress Stamp -->
            <div class="relative">
              <div class="absolute -top-4 -left-4 w-32 h-32 border-4 border-red-600/20 rounded-full flex items-center justify-center rotate-[-15deg] pointer-events-none">
                <div class="text-center font-black text-red-600/30 uppercase text-xs">
                  Official Record<br/>VaxNet System
                </div>
              </div>
              <div class="bg-white rounded-[2rem] p-6 shadow-xl border-t-4 border-blue-600 w-48 text-center ring-8 ring-white/50">
                <div class="text-4xl font-black text-gray-900">{{ administerCount }}</div>
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Doses Completed</div>
                <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 transition-all duration-1000" :style="{width: progressPct + '%'}"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- The Table -->
          <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border-2 border-gray-900/5">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-900 text-white font-black uppercase tracking-widest text-[10px]">
                  <th class="p-6">Milestone/Vaccine</th>
                  <th class="p-6">Date Due</th>
                  <th class="p-6">Route / Site</th>
                  <th class="p-6">Batch No.</th>
                  <th class="p-6">Official Status</th>
                  <th class="p-6">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y-2 divide-gray-50">
                <tr 
                  v-for="dose in schedule?.doses" 
                  :key="dose.vaccineKey"
                  :class="['group transition-all', getRowTint(dose.status)]"
                >
                  <td class="p-6">
                    <div class="text-sm font-black text-gray-900">{{ dose.vaccineName }}</div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">{{ formatScheduledAge(dose.scheduledAgeWeeks) }} Milestone</div>
                  </td>
                  <td class="p-6">
                    <div class="text-sm font-bold text-gray-900">{{ formatDate(dose.scheduledDate) }}</div>
                    <div v-if="dose.administeredDate" class="text-[10px] text-green-600 font-black uppercase mt-1">Given: {{ formatDate(dose.administeredDate) }}</div>
                  </td>
                  <td class="p-6">
                    <div class="text-xs font-bold text-gray-700">{{ dose.route }}</div>
                    <div class="text-[10px] text-gray-400 font-medium lowercase italic">{{ dose.site }}</div>
                  </td>
                  <td class="p-6">
                    <div v-if="dose.batchNumber" class="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">
                      #{{ dose.batchNumber }}
                    </div>
                    <span v-else class="text-xs text-gray-300">—</span>
                  </td>
                  <td class="p-6">
                    <div :class="['inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm', getStatusColors(dose.status)]">
                      <div :class="['w-1.5 h-1.5 rounded-full', getDotColor(dose.status)]"></div>
                      {{ dose.status.replace(/_/g, ' ') }}
                    </div>
                  </td>
                  <td class="p-6">
                    <div v-if="dose.status !== 'ADMINISTERED'" class="flex items-center gap-2">
                      <input 
                        v-model="batchInputs[dose.vaccineKey]"
                        type="text" 
                        placeholder="Batch" 
                        class="w-20 px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-gray-900 transition-all"
                      />
                      <button 
                        @click="administerVaccine(dose)"
                        :disabled="administeringKey === dose.vaccineKey"
                        class="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-black shadow-lg shadow-gray-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {{ administeringKey === dose.vaccineKey ? '...' : 'Administer' }}
                      </button>
                    </div>
                    <div v-else class="flex items-center gap-2 text-green-600 font-black text-xs uppercase italic drop-shadow-sm">
                      <CheckBadgeIcon class="w-5 h-5" />
                      Verified
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  IdentificationIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/solid'
import { useToast } from '~/composables/useToast'

const API_BASE = 'http://localhost:8080/api'
const { success, error: notifyError } = useToast()

interface Child {
  birthCertificateNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
}

interface VaccineDose {
  vaccineKey: string
  vaccineName: string
  scheduledAgeWeeks: number
  route: string
  site: string
  dosage: string
  scheduledDate: string
  administeredDate: string | null
  batchNumber: string | null
  status: string
}

interface Schedule {
  child: Child
  doses: VaccineDose[]
}

const children = ref<Child[]>([])
const selectedChild = ref<Child | null>(null)
const schedule = ref<Schedule | null>(null)
const childSearch = ref('')
const batchInputs = ref<Record<string, string>>({})
const administeringKey = ref<string | null>(null)
const childStatusCache = ref<Record<string, number>>({})

const filteredChildren = computed(() => {
  const q = childSearch.value.toLowerCase()
  return children.value.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.birthCertificateNumber.includes(q)
  )
})

const overdueCount = computed(() => Object.values(childStatusCache.value).filter(c => c > 0).length)
const progressPct = computed(() => {
  if (!schedule.value) return 0
  const total = schedule.value.doses.length
  const done = schedule.value.doses.filter(d => d.status === 'ADMINISTERED').length
  return Math.round((done / total) * 100)
})
const administerCount = computed(() => schedule.value?.doses.filter(d => d.status === 'ADMINISTERED').length || 0)

const fetchChildren = async () => {
  try {
    const resp = await fetch(`${API_BASE}/children/get-all-children`)
    children.value = await resp.json()
    // Pre-cache status (simplified)
    children.value.forEach(c => loadChildStatus(c.birthCertificateNumber))
  } catch (e) {
    notifyError('Network failure. Cannot load patient directory.')
  }
}

const loadChildStatus = async (bcn: string) => {
  try {
    const resp = await fetch(`${API_BASE}/immunization/schedule/${bcn}`)
    const data = await resp.json()
    childStatusCache.value[bcn] = data.doses.filter((d: any) => d.status === 'OVERDUE' || d.status === 'MISSED').length
  } catch {}
}

const getChildOverdueCount = (bcn: string) => childStatusCache.value[bcn] || 0

const selectChild = async (child: Child) => {
  selectedChild.value = child
  schedule.value = null
  try {
    const resp = await fetch(`${API_BASE}/immunization/schedule/${child.birthCertificateNumber}`)
    schedule.value = await resp.json()
  } catch (e) {
    notifyError('Could not retrieve immunization record.')
  }
}

const administerVaccine = async (dose: VaccineDose) => {
  const batch = batchInputs.value[dose.vaccineKey]?.trim()
  if (!batch) {
    notifyError('Batch number is required for official records.')
    return
  }

  administeringKey.value = dose.vaccineKey
  try {
    const resp = await fetch(`${API_BASE}/immunization/administer/${selectedChild.value?.birthCertificateNumber}/${dose.vaccineKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchNumber: batch })
    })
    
    if (resp.ok) {
      schedule.value = await resp.json()
      success(`Successfully recorded ${dose.vaccineName} administration. Parent notified via Twilio.`)
      loadChildStatus(selectedChild.value?.birthCertificateNumber!)
      batchInputs.value[dose.vaccineKey] = ''
    }
  } catch (e) {
    notifyError('Verification failed. Try again.')
  } finally {
    administeringKey.value = null
  }
}

const formatDate = (d: string) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-ZW', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatScheduledAge = (w: number) => {
  if (w === 0) return 'Birth'
  if (w < 39) return `${w} Weeks`
  if (w < 78) return '9 Months'
  return '18 Months'
}

const getStatusColors = (s: string) => {
  switch (s) {
    case 'ADMINISTERED': return 'bg-green-100 text-green-800'
    case 'OVERDUE': return 'bg-red-100 text-red-800'
    case 'MISSED': return 'bg-rose-100 text-rose-800 animate-pulse'
    case 'DUE': return 'bg-orange-100 text-orange-800'
    case 'DUE_SOON': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-500'
  }
}

const getDotColor = (s: string) => {
  switch (s) {
    case 'ADMINISTERED': return 'bg-green-600'
    case 'OVERDUE': return 'bg-red-600'
    case 'MISSED': return 'bg-rose-600'
    case 'DUE': return 'bg-orange-600'
    case 'DUE_SOON': return 'bg-yellow-600'
    default: return 'bg-gray-400'
  }
}

const getRowTint = (s: string) => {
  switch (s) {
    case 'OVERDUE': 
    case 'MISSED': return 'bg-red-50/30'
    case 'DUE': return 'bg-orange-50/30'
    case 'ADMINISTERED': return 'bg-green-50/10'
    default: return 'hover:bg-gray-50/50'
  }
}

onMounted(fetchChildren)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>

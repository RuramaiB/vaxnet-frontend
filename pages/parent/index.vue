<template>
  <NuxtLayout name="parent-layout">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Parent Dashboard</h1>
      <p class="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">VaxNet Child Health System</p>
    </div>

    <!-- Child Profile Card -->
    <div v-if="activeChild" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
      <!-- Decorative background accent -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8 opacity-50"></div>
      
      <div class="flex justify-between items-start relative z-10">
        <div class="flex gap-6">
          <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-sm', 
                       activeChild.gender === 'MALE' ? 'bg-blue-600 text-white' : 'bg-pink-500 text-white']">
            {{ activeChild.firstName?.[0] }}{{ activeChild.lastName?.[0] }}
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Active Child Profile</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                <p class="font-bold text-gray-800">{{ activeChild.firstName }} {{ activeChild.lastName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Birth Date</p>
                <p class="font-bold text-gray-800">{{ formatDate(activeChild.dateOfBirth) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">BCN</p>
                <p class="font-mono font-bold text-gray-800">{{ activeChild.birthCertificateNumber }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                <p class="font-bold text-gray-800 capitalize">{{ activeChild.gender }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Child Selected -->
    <div v-else class="bg-amber-50 border border-amber-100 rounded-2xl p-8 mb-8 flex items-center gap-4">
      <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
        <ExclamationTriangleIcon class="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <h3 class="font-bold text-amber-900">No Child Selected</h3>
        <p class="text-sm text-amber-800">Please select or register a child in the <NuxtLink to="/parent/children" class="underline font-bold">Children Records</NuxtLink> page.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Quick Stats -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Quick Overview</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Total Children</p>
            <p class="text-3xl font-black text-blue-900">{{ children.length }}</p>
          </div>
          <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Appointments</p>
            <p class="text-3xl font-black text-emerald-900">{{ appointments.length }}</p>
          </div>
          <div class="p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <p class="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Upcoming</p>
            <p class="text-3xl font-black text-purple-900">{{ upcomingAppointments.length }}</p>
          </div>
          <div class="p-6 bg-orange-50 rounded-2xl border border-orange-100" :class="{'animate-pulse !bg-red-50 !border-red-100': nextDue}">
            <p class="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2" :class="{'text-red-600': nextDue}">Next Due</p>
            <p class="text-lg font-black text-orange-900 truncate" :class="{'text-red-900': nextDue}">{{ nextDue ? nextDue.vaccineName : 'None' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Navigator Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/parent/appointments" class="p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarIcon class="w-6 h-6" />
            </div>
            <p class="font-bold text-gray-900">Book Visit</p>
            <p class="text-xs text-gray-500 mt-1">Schedule new vaccination</p>
          </NuxtLink>
          
          <NuxtLink to="/parent/children" class="p-6 bg-white border border-gray-100 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserGroupIcon class="w-6 h-6" />
            </div>
            <p class="font-bold text-gray-900">My Children</p>
            <p class="text-xs text-gray-500 mt-1">Manage profiles & BCNs</p>
          </NuxtLink>

          <NuxtLink to="/parent/immunization" class="p-6 bg-white border border-gray-100 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all group">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <ClipboardDocumentCheckIcon class="w-6 h-6" />
            </div>
            <p class="font-bold text-gray-900">Health Card</p>
            <p class="text-xs text-gray-500 mt-1">Digital immunization record</p>
          </NuxtLink>

          <button class="p-6 bg-white border border-gray-100 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all group text-left">
            <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <QuestionMarkCircleIcon class="w-6 h-6" />
            </div>
            <p class="font-bold text-gray-900">Support</p>
            <p class="text-xs text-gray-500 mt-1">Get help from clinic</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
      <div class="space-y-4">
        <div v-for="apt in recentAppointments" :key="apt.appointmentID" class="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-50">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <CalendarIcon class="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ getChildName(apt.child.birthCertificateNumber) }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(apt.dateOfAppointment) }} at {{ apt.timeOfAppointment }}</p>
            </div>
          </div>
          <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest', 
                         apt.appointmentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800']">
            {{ apt.appointmentStatus }}
          </span>
        </div>
        <div v-if="recentAppointments.length === 0" class="text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">
          No recent activity to display
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  CalendarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const API_BASE = 'http://localhost:8080/api'
const parentEmail = ref(localStorage.getItem('email') || '')

const children = ref<any[]>([])
const activeChild = ref<any>(null)
const appointments = ref<any[]>([])
const immunizationSchedule = ref<any>(null)

const upcomingAppointments = computed(() => appointments.value.filter(a => a.appointmentStatus === 'pending' || a.appointmentStatus === 'confirmed'))
const recentAppointments = computed(() => appointments.value.slice(0, 5))
const nextDue = computed(() => {
  if (!immunizationSchedule.value) return null
  return immunizationSchedule.value.doses.find((d: any) => d.status === 'DUE' || d.status === 'DUE_SOON')
})

const fetchChildren = async () => {
  if (!parentEmail.value) return
  try {
    const res = await fetch(`${API_BASE}/children/get-children-by-parent-email/${parentEmail.value}`)
    if (res.ok) {
      children.value = await res.json()
      if (children.value.length > 0) {
        activeChild.value = children.value[0]
        await fetchAppointments()
        await fetchImmunizationSchedule()
      }
    }
  } catch (e) {
    console.error('Error fetching children:', e)
  }
}

const fetchAppointments = async () => {
  if (!activeChild.value) return
  try {
    const res = await fetch(`${API_BASE}/appointments/get-appointments-by-child/${activeChild.value.birthCertificateNumber}`)
    if (res.ok) {
        appointments.value = await res.json()
    }
  } catch (e) {
    console.error('Error fetching appointments:', e)
  }
}

const fetchImmunizationSchedule = async () => {
  if (!activeChild.value) return
  try {
    const res = await fetch(`${API_BASE}/immunization/schedule/${activeChild.value.birthCertificateNumber}`)
    if (res.ok) {
      immunizationSchedule.value = await res.json()
    }
  } catch (e) {
    console.error('Error fetching schedule:', e)
  }
}

const getChildName = (bcn: string) => {
  const child = children.value.find(c => c.birthCertificateNumber === bcn)
  return child ? `${child.firstName} ${child.lastName}` : 'Unknown'
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-ZW', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(() => {
  fetchChildren()
})
</script>

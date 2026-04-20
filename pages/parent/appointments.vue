<template>
  <NuxtLayout name="parent-layout">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Appointments</h1>
        <p class="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">Manage your children's vaccination visits</p>
      </div>
      <button
        @click="showBookingModal = true"
        class="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        New Appointment
      </button>
    </div>

    <div class="mb-8 flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="filter in ['all', 'confirmed', 'pending', 'cancelled']"
        :key="filter"
        @click="appointmentFilter = filter"
        :class="[
          'px-6 py-2 rounded-xl font-bold whitespace-nowrap transition-all border',
          appointmentFilter === filter
            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
            : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'
        ]"
      >
        {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="appointment in filteredAppointments"
        :key="appointment.appointmentID"
        class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
      >
        <div class="flex justify-between items-start mb-6">
          <div class="flex gap-4">
             <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <CalendarIcon class="w-6 h-6" />
             </div>
             <div>
                <p class="font-bold text-gray-900 text-lg">{{ getChildName(appointment.child.birthCertificateNumber) }}</p>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">BCN: {{ appointment.child.birthCertificateNumber }}</p>
             </div>
          </div>
          <span :class="[
            'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm',
            appointment.appointmentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
            appointment.appointmentStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
            appointment.appointmentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          ]">
            {{ appointment.appointmentStatus }}
          </span>
        </div>
        
        <div class="space-y-3 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
          <div class="flex items-center text-sm font-bold text-gray-700">
            <CalendarIcon class="w-4 h-4 mr-3 text-gray-400" />
            {{ formatDate(appointment.dateOfAppointment) }}
          </div>
          <div class="flex items-center text-sm font-bold text-gray-700">
            <ClockIcon class="w-4 h-4 mr-3 text-gray-400" />
            {{ appointment.timeOfAppointment }}
          </div>
          <div class="flex items-center text-sm font-bold text-gray-700">
            <MapPinIcon class="w-4 h-4 mr-3 text-gray-400" />
            Facility ID: {{ appointment.facilityID }}
          </div>
          <div class="pt-2 border-t border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reason</p>
            <p class="text-sm font-medium text-gray-600 leading-relaxed">{{ appointment.reasonForAppointment }}</p>
          </div>
        </div>

        <div v-if="appointment.appointmentStatus === 'confirmed'" class="flex gap-3">
          <button class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-xs font-black shadow-lg shadow-gray-900/10 hover:scale-105 transition-all">
            View Details
          </button>
          <button class="flex-1 px-4 py-3 border-2 border-red-100 text-red-600 rounded-xl text-xs font-black hover:bg-red-50 transition-all">
            Cancel Visit
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredAppointments.length === 0" class="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 mt-8">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CalendarIcon class="w-10 h-10 text-gray-300" />
      </div>
      <p class="text-gray-900 font-bold text-lg">No appointments found</p>
      <p class="text-sm text-gray-400 mt-1 uppercase tracking-widest font-black">Try a different filter or book a new visit</p>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border-8 border-white ring-1 ring-gray-900/5">
        <div class="p-8 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-black text-gray-900">Book Vaccination</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Official Clinical Appointment</p>
          </div>
          <button @click="closeBookingModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon class="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <form @submit.prevent="submitBooking" class="p-8 space-y-8">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Select Child *</label>
            <select
              v-model="bookingForm.birthCertificateNumber"
              required
              class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all"
            >
              <option value="">Choose a child profile</option>
              <option v-for="child in children" :key="child.birthCertificateNumber" :value="child.birthCertificateNumber">
                {{ child.firstName }} {{ child.lastName }} ({{ child.birthCertificateNumber }})
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Preferred Date *</label>
              <input
                v-model="bookingForm.dateOfAppointment"
                type="date"
                :min="minBookingDate"
                required
                class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all"
              />
            </div>
            
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Time Slot *</label>
              <select
                v-model="bookingForm.timeOfAppointment"
                required
                class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all"
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

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Health Facility *</label>
            <div class="space-y-4">
              <select
                v-model="bookingForm.facilityID"
                required
                class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all"
              >
                <option value="">Choose a clinic or hospital</option>
                <option v-for="fac in facilities" :key="fac.facilityID" :value="fac.facilityID">
                  {{ fac.facilityName }} ({{ fac.facilityDistrict }})
                </option>
              </select>
              
              <div v-if="suggestedFacilities.length > 0" class="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-50">
                <p class="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">AI Recommended In Your District</p>
                <div class="flex flex-wrap gap-3">
                  <button 
                    v-for="fac in suggestedFacilities" 
                    :key="fac.facilityID"
                    type="button"
                    @click="bookingForm.facilityID = fac.facilityID"
                    :class="[
                      'px-4 py-3 rounded-xl text-xs font-bold border transition-all text-left flex flex-col gap-1',
                      bookingForm.facilityID === fac.facilityID ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300'
                    ]"
                  >
                    <span>{{ fac.facilityName }}</span>
                    <span class="text-[9px] opacity-70 italic">{{ fac.facilityType }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reason for Visit *</label>
            <textarea
              v-model="bookingForm.reasonForAppointment"
              rows="3"
              required
              placeholder="e.g., Routine vaccination, Follow-up, etc."
              class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all"
            ></textarea>
          </div>
          
          <div class="p-6 bg-gray-50 rounded-[2rem]">
            <label class="flex items-start gap-4">
              <input
                v-model="bookingForm.confirmed"
                type="checkbox"
                required
                class="h-5 w-5 text-blue-600 rounded-lg border-none bg-white focus:ring-blue-600 mt-1 cursor-pointer"
              />
              <span class="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                I verify that this information is accurate and I am authorized to book for this child Profile.
              </span>
            </label>
          </div>
          
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              @click="closeBookingModal"
              class="flex-1 px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black hover:bg-gray-50 transition-all uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-2xl shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-xs"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center relative overflow-hidden">
         <!-- Geometric Accent -->
         <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full opacity-50"></div>
         
        <div class="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
          <CheckBadgeIcon class="w-10 h-10 text-emerald-600" />
        </div>
        
        <h3 class="text-3xl font-black text-gray-900 mb-2 relative z-10">Confirmed!</h3>
        <p class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-8">Registered In VaxNet System</p>
        
        <div class="bg-gray-50 p-6 rounded-[2rem] mb-8 text-left border border-gray-100">
          <div class="space-y-4 text-xs font-bold">
            <div class="flex justify-between items-center pb-3 border-b border-gray-100">
              <span class="text-gray-400 uppercase tracking-widest text-[9px]">ID No.</span>
              <span class="font-mono text-gray-800">#{{ bookingSuccess.appointmentID }}</span>
            </div>
            <div class="flex justify-between items-center pb-3 border-b border-gray-100">
              <span class="text-gray-400 uppercase tracking-widest text-[9px]">Date</span>
              <span class="text-gray-800">{{ formatDate(bookingSuccess.dateOfAppointment) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 uppercase tracking-widest text-[9px]">Time</span>
              <span class="text-gray-800">{{ bookingSuccess.timeOfAppointment }}</span>
            </div>
          </div>
        </div>
        
        <button 
          @click="showSuccessModal = false"
          class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:scale-[1.02] transition-all uppercase text-xs"
        >
          View My Calendar
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  CheckBadgeIcon,
  CheckIcon
} from '@heroicons/vue/24/solid'

const API_BASE = 'http://localhost:8080/api'
const parentEmail = ref(localStorage.getItem('email') || '')

const appointments = ref<any[]>([])
const children = ref<any[]>([])
const facilities = ref<any[]>([])
const appointmentFilter = ref('all')
const showBookingModal = ref(false)
const showSuccessModal = ref(false)
const loadingSuggestions = ref(false)
const suggestedFacilities = ref<any[]>([])

const bookingForm = ref({
  birthCertificateNumber: '',
  dateOfAppointment: '',
  timeOfAppointment: '',
  facilityID: '',
  reasonForAppointment: '',
  confirmed: false
})

const bookingSuccess = ref<any>({})

const filteredAppointments = computed(() => {
  if (appointmentFilter.value === 'all') return appointments.value
  return appointments.value.filter(a => a.appointmentStatus === appointmentFilter.value)
})

const minBookingDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const fetchChildren = async () => {
  if (!parentEmail.value) return
  try {
    const res = await fetch(`${API_BASE}/children/get-children-by-parent-email/${parentEmail.value}`)
    if (res.ok) {
      children.value = await res.json()
      await fetchAppointments()
    }
  } catch (e) {
    console.error('Error fetching children:', e)
  }
}

const fetchAppointments = async () => {
    // Collect all appointments for all children of this parent
    const allApts: any[] = []
    for (const child of children.value) {
        try {
            const res = await fetch(`${API_BASE}/appointments/get-appointments-by-child/${child.birthCertificateNumber}`)
            if (res.ok) {
                const data = await res.json()
                allApts.push(...data)
            }
        } catch {}
    }
    appointments.value = allApts.sort((a, b) => new Date(b.dateOfAppointment).getTime() - new Date(a.dateOfAppointment).getTime())
}

const fetchFacilities = async () => {
  try {
    const res = await fetch(`${API_BASE}/facilities/get-all-facilities`)
    if (res.ok) facilities.value = await res.json()
  } catch (e) {}
}

const fetchSuggestions = async (bcn: string) => {
  const child = children.value.find(c => c.birthCertificateNumber === bcn)
  if (!child) return
  loadingSuggestions.value = true
  try {
    const district = child.placeOfBirth || (child.physicalAddress ? child.physicalAddress.split(',').pop() : 'Harare')
    const res = await fetch(`${API_BASE}/facilities/by-district/${district.trim()}`)
    if (res.ok) suggestedFacilities.value = await res.json()
  } catch (e) {
  } finally {
    loadingSuggestions.value = false
  }
}

const submitBooking = async () => {
  try {
    const res = await fetch(`${API_BASE}/appointments/add-new-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bookingForm.value,
        appointmentStatus: 'pending'
      })
    })
    
    if (res.ok) {
        const data = await res.json()
        bookingSuccess.value = data.appointment
        showBookingModal.value = false
        showSuccessModal.value = true
        await fetchAppointments()
        // Reset form
        bookingForm.value = {
          birthCertificateNumber: '',
          dateOfAppointment: '',
          timeOfAppointment: '',
          facilityID: '',
          reasonForAppointment: '',
          confirmed: false
        }
    }
  } catch (e) {
    alert('Booking failed. Please check connectivity.')
  }
}

const closeBookingModal = () => {
  showBookingModal.value = false
}

const getChildName = (bcn: string) => {
  const child = children.value.find(c => c.birthCertificateNumber === bcn)
  return child ? `${child.firstName} ${child.lastName}` : 'Unknown'
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-ZW', { day: '2-digit', month: 'long', year: 'numeric' })
}

watch(() => bookingForm.value.birthCertificateNumber, (val) => {
  if (val) fetchSuggestions(val)
})

onMounted(() => {
  fetchChildren()
  fetchFacilities()
})
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
</style>

<template>
  <NuxtLayout name="parent-layout">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Children Records</h1>
        <p class="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">Manage official profiles for your children</p>
      </div>
      <button
        @click="showAddChildModal = true"
        class="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Register New Child
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        v-for="child in children"
        :key="child.birthCertificateNumber"
        class="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all group relative overflow-hidden"
      >
        <!-- Background Accent -->
        <div :class="['absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] -mr-8 -mt-8 opacity-10 transition-colors', 
                      child.gender === 'MALE' ? 'bg-blue-600' : 'bg-pink-500']"></div>

        <div class="flex justify-between items-start mb-8 relative z-10">
          <div class="flex gap-6">
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm', 
                         child.gender === 'MALE' ? 'bg-blue-600 text-white' : 'bg-pink-500 text-white']">
              {{ child.firstName?.[0] }}{{ child.lastName?.[0] }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ child.firstName }} {{ child.lastName }}</h3>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Reg No: {{ child.birthCertificateNumber }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest', 
                          child.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600']">
              {{ child.gender }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-8 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50">
          <div>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
            <p class="font-bold text-gray-800 text-sm">{{ formatDate(child.dateOfBirth) }}</p>
          </div>
          <div>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Place of Birth</p>
            <p class="font-bold text-gray-800 text-sm truncate">{{ child.placeOfBirth }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Physical Address</p>
            <p class="font-bold text-gray-800 text-sm truncate">{{ child.physicalAddress }}</p>
          </div>
        </div>

        <div v-if="child.medicalConditions && child.medicalConditions.length > 0" class="mb-8">
           <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Pre-existing Conditions</p>
           <div class="flex flex-wrap gap-2">
             <span v-for="cond in child.medicalConditions" :key="cond" class="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 uppercase tracking-tight">
               {{ cond }}
             </span>
           </div>
        </div>

        <div class="flex gap-3">
          <NuxtLink :to="'/parent/immunization?child=' + child.birthCertificateNumber" class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold text-center shadow-lg shadow-gray-900/10 hover:scale-105 transition-all">
            Open Health Card
          </NuxtLink>
          <NuxtLink :to="'/parent/appointments'" class="flex-1 px-4 py-3 border-2 border-gray-100 text-gray-600 rounded-xl text-xs font-bold text-center hover:border-blue-500 hover:text-blue-600 transition-all">
            Schedule Visit
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="children.length === 0" class="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 mt-8">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <UserGroupIcon class="w-10 h-10" />
      </div>
      <p class="text-gray-900 font-bold text-lg">No children registered</p>
      <p class="text-sm text-gray-400 mt-1 uppercase tracking-widest font-black">Register your first child to start tracking their health</p>
      <button @click="showAddChildModal = true" class="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">
        + Start Enrollment
      </button>
    </div>

    <!-- Add Child Modal -->
    <div v-if="showAddChildModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar border-8 border-white ring-1 ring-gray-900/5">
        <div class="p-8 border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-black text-gray-900">Enroll Child</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Official Clinical Enrollment</p>
          </div>
          <button @click="closeAddChildModal" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon class="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <form @submit.prevent="submitAddChild" class="p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">First Name *</label>
              <input v-model="addChildForm.firstName" type="text" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Last Name *</label>
              <input v-model="addChildForm.lastName" type="text" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Birth Certificate No. *</label>
              <input v-model="addChildForm.birthCertificateNumber" type="text" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Date of Birth *</label>
              <input v-model="addChildForm.dateOfBirth" type="date" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Biological Sex *</label>
              <select v-model="addChildForm.gender" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all">
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Place of Birth *</label>
              <input v-model="addChildForm.placeOfBirth" type="text" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Physical Address *</label>
              <input v-model="addChildForm.physicalAddress" type="text" required class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Relationship to Parent *</label>
              <input v-model="addChildForm.relationshipToParent" type="text" required placeholder="e.g., Mother, Father, Guardian" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Weight (kg)</label>
                  <input v-model="addChildForm.birthWeight" type="text" placeholder="3.5" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
               </div>
               <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Height (cm)</label>
                  <input v-model="addChildForm.birthHeight" type="text" placeholder="50" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold transition-all" />
               </div>
            </div>
          </div>

          <div v-if="addChildError" class="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold">
            <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
            {{ addChildError }}
          </div>
          
          <div class="flex gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              @click="closeAddChildModal"
              class="flex-1 px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black hover:bg-gray-50 transition-all uppercase text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="addingChild"
              class="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-2xl shadow-gray-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-xs disabled:opacity-50"
            >
              {{ addingChild ? 'Enrolling...' : 'Enroll Child' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const API_BASE = 'http://localhost:8080/api'
const parentEmail = ref(localStorage.getItem('email') || '')

const children = ref<any[]>([])
const showAddChildModal = ref(false)
const addingChild = ref(false)
const addChildError = ref('')

const addChildForm = ref({
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
})

const fetchChildren = async () => {
  if (!parentEmail.value) return
  try {
    const res = await fetch(`${API_BASE}/children/get-children-by-parent-email/${parentEmail.value}`)
    if (res.ok) {
      children.value = await res.json()
    }
  } catch (e) {
    console.error('Error fetching children:', e)
  }
}

const submitAddChild = async () => {
  addingChild.value = true
  addChildError.value = ''
  try {
    const res = await fetch(`${API_BASE}/children/add-new-child`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...addChildForm.value,
        parentEmail: parentEmail.value
      })
    })
    
    if (res.ok) {
      showAddChildModal.value = false
      // Reset form
      addChildForm.value = {
        firstName: '', lastName: '', birthCertificateNumber: '',
        dateOfBirth: '', gender: '', placeOfBirth: '',
        physicalAddress: '', birthWeight: '', birthHeight: '',
        relationshipToParent: ''
      }
      await fetchChildren()
    } else {
      const err = await res.text()
      addChildError.value = err || 'Enrollment failed. Please check details.'
    }
  } catch (e) {
    addChildError.value = 'Network error. Try again later.'
  } finally {
    addingChild.value = false
  }
}

const closeAddChildModal = () => {
  showAddChildModal.value = false
  addChildError.value = ''
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-ZW', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(() => {
  fetchChildren()
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

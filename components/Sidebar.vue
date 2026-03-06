<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block">
    <div class="flex items-center justify-center h-16 border-b border-gray-200">
      <h1 class="text-xl font-bold text-primary-600">Child VaxNet</h1>
    </div>
    <nav class="mt-6">
      <NuxtLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
        active-class="bg-primary-50 text-primary-600 border-r-4 border-primary-600"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3" />
        <span class="font-medium">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  MapPinIcon,
  UsersIcon,
  BeakerIcon,
  MegaphoneIcon,
  UserCircleIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboard', path: '/admin/', icon: HomeIcon },
  { name: 'Appointments', path: '/admin/appointments', icon: CalendarIcon },
  { name: 'Facility Locator', path: '/admin/facilities', icon: MapPinIcon },
  { name: 'Vaccination Records', path: '/admin/patients', icon: UsersIcon },
  { name: 'Children', path: '/admin/children', icon: UserGroupIcon },
  { name: 'Immunization Tracker', path: '/admin/immunization', icon: ClipboardDocumentCheckIcon },
  { name: 'AI Insights', path: '/admin/insights', icon: SparklesIcon },
  { name: 'Vaccines', path: '/admin/vaccines', icon: BeakerIcon },
  { name: 'Broadcasting', path: '/admin/broadcasting', icon: MegaphoneIcon },
  { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Profile', path: '/admin/profile', icon: UserCircleIcon },
]
</script>


<template>
  <div class="antialiased font-sans">
    <ToastContainer />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');

html {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, .font-heading {
  font-family: 'Outfit', sans-serif;
}
</style>

<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">VaxNet</h1>
                <p class="text-sm text-gray-500">Digital Immunization System</p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-6">
            <a href="#features" class="text-gray-700 hover:text-primary-600 font-medium">Features</a>
            <a href="#how-it-works" class="text-gray-700 hover:text-primary-600 font-medium">How It Works</a>
            <a href="#contact" class="text-gray-700 hover:text-primary-600 font-medium">Contact</a>
            <NuxtLink to="/auth/login" class="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm">
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl font-bold text-gray-900 leading-tight">
              Centralized Digital
              <span class="text-primary-600">Immunization</span>
              Management
            </h1>
            <p class="mt-6 text-xl text-gray-600">
              Streamline childhood vaccination tracking, appointment scheduling, and coverage monitoring with our comprehensive digital platform.
            </p>
            <div class="mt-10 flex space-x-4">
              <NuxtLink to="/admin/" class="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md">
                Get Started
              </NuxtLink>
              <a href="#features" class="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Learn More
              </a>
            </div>
            <div class="mt-12 flex items-center space-x-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">15K+</div>
                <div class="text-gray-500">Children Registered</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">98%</div>
                <div class="text-gray-500">Coverage Rate</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-gray-900">250+</div>
                <div class="text-gray-500">Healthcare Facilities</div>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-semibold text-gray-900">Dashboard Preview</h3>
                <div class="flex space-x-2">
                  <div class="w-3 h-3 rounded-full bg-red-400"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              
              <!-- Dashboard Preview -->
              <div class="space-y-4">
                <div class="grid grid-cols-4 gap-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">15,428</div>
                    <div class="text-sm text-gray-600">Total Children</div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">1,245</div>
                    <div class="text-sm text-gray-600">Upcoming Vaccinations</div>
                  </div>
                  <div class="bg-red-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">89</div>
                    <div class="text-sm text-gray-600">Missed Appointments</div>
                  </div>
                  <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-gray-900">98.2%</div>
                    <div class="text-sm text-gray-600">Coverage Rate</div>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="font-medium text-gray-900">Recent Appointments</h4>
                    <span class="text-xs text-gray-500">Today</span>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">Tendai Moyo</div>
                        <div class="text-sm text-gray-500">BCG Vaccine</div>
                      </div>
                      <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-gray-900">Rudo Chiweshe</div>
                        <div class="text-sm text-gray-500">Polio Vaccine</div>
                      </div>
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">Powerful Features</h2>
          <p class="mt-4 text-xl text-gray-600">Everything you need for effective immunization management</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Digital Immunization Records</h3>
            <p class="text-gray-600">Maintain secure, accessible digital records for every child's vaccination history.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Smart Appointment Scheduling</h3>
            <p class="text-gray-600">Automated reminders and scheduling based on immunization calendars.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Real-time Analytics</h3>
            <p class="text-gray-600">Monitor coverage rates and track progress with interactive dashboards.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Facility Locator</h3>
            <p class="text-gray-600">Find nearby vaccination centers with real-time availability and directions.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Secure & HIPAA Compliant</h3>
            <p class="text-gray-600">Enterprise-grade security with data encryption and privacy controls.</p>
          </div>
          
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Mobile Responsive</h3>
            <p class="text-gray-600">Access the system on any device - desktop, tablet, or mobile.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900">How Child VaxNet Works</h2>
          <p class="mt-4 text-xl text-gray-600">Simple steps to better immunization management</p>
        </div>
        
        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-3">Register Child</h3>
            <p class="text-gray-600">Create digital records with birth details and medical history</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-3">Schedule Vaccinations</h3>
            <p class="text-gray-600">Automated scheduling based on immunization calendar</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-3">Track Progress</h3>
            <p class="text-gray-600">Monitor completion and receive reminder notifications</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-primary-600">4</span>
            </div>
            <h3 class="font-semibold text-gray-900 mb-3">Generate Reports</h3>
            <p class="text-gray-600">Analytics and reports for healthcare providers and authorities</p>
          </div>
        </div>
        
        <div class="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
          <h3 class="text-2xl font-bold mb-6">Ready to Transform Immunization Management?</h3>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">Join healthcare facilities across the country using Child VaxNet to improve vaccination coverage and child health outcomes.</p>
          <NuxtLink to="/auth/login" class="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Get Started Today
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">VaxNet</h2>
                <p class="text-gray-400 text-sm">Digital Immunization System</p>
              </div>
            </div>
            <p class="text-gray-400">Improving child health through digital immunization management.</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-6">Product</h3>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" class="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-6">Resources</h3>
            <ul class="space-y-3 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-6">Contact Us</h3>
            <ul class="space-y-3 text-gray-400">
              <li class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@childvaxnet.org</span>
              </li>
              <li class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+263 242 700 000</span>
              </li>
            </ul>
            <div class="mt-6 flex space-x-4">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2026 VaxNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Simple scroll handler for smooth scrolling
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Custom scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
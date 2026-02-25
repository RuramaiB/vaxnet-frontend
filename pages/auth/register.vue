<template>
    <div
        class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center p-4">
        <div class="w-full max-w-4xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <div class="flex items-center justify-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.195a4 4 0 01-4.9 1.096L15 21m0 0l-3-3m3 3l3-3" />
                        </svg>
                    </div>
                    <div class="text-left">
                        <h1 class="text-2xl font-bold text-gray-900">VaxNet</h1>
                        <p class="text-sm text-gray-600">Parent Registration Portal</p>
                    </div>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Register Your Child for Vaccination</h2>
                <p class="text-gray-600">Create an account to schedule appointments and track immunizations</p>
            </div>

            <!-- Progress Steps -->
            <div class="mb-10">
                <div class="flex items-center justify-between max-w-2xl mx-auto">
                    <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
                        <div class="flex flex-col items-center">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2',
                                currentStep >= step.id
                                    ? 'bg-primary-600 border-primary-600 text-white'
                                    : currentStep === step.id
                                        ? 'border-primary-600 text-primary-600 bg-white'
                                        : 'border-gray-300 text-gray-400 bg-white'
                            ]">
                                {{ step.id }}
                            </div>
                            <span :class="[
                                'mt-2 text-xs font-medium',
                                currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                            ]">
                                {{ step.label }}
                            </span>
                        </div>
                        <div v-if="index < steps.length - 1" :class="[
                            'h-0.5 w-16 mx-4',
                            currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                        ]"></div>
                    </div>
                </div>
            </div>

            <!-- Registration Form -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-7xl mx-auto">
                <!-- Step 1: Parent Information -->
                <div v-if="currentStep === 1" class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Parent/Guardian Information</h3>
                    <p class="text-gray-600 mb-6">Enter your personal details to create an account</p>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="parentName" class="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input id="parentName" v-model="form.parent.name" type="text" required
                                    class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="John Doe" />
                            </div>
                        </div>

                        <div>
                            <label for="relationship" class="block text-sm font-medium text-gray-700 mb-2">
                                Relationship to Child *
                            </label>
                            <select id="relationship" v-model="form.parent.relationship" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                <option value="">Select relationship</option>
                                <option value="mother">Mother</option>
                                <option value="father">Father</option>
                                <option value="guardian">Legal Guardian</option>
                                <option value="grandparent">Grandparent</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input id="email" v-model="form.parent.email" type="email" required
                                    class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="parent@example.com" />
                            </div>
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input id="phone" v-model="form.parent.phone" type="tel" required
                                    class="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="+263 77 123 4567" />
                            </div>
                        </div>

                        <div>
                            <label for="idNumber" class="block text-sm font-medium text-gray-700 mb-2">
                                National ID Number *
                            </label>
                            <input id="idNumber" v-model="form.parent.idNumber" type="text" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="00-1234567A00" />
                        </div>

                        <div>
                            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                                Residential Address *
                            </label>
                            <input id="address" v-model="form.parent.address" type="text" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="123 Main Street, Harare" />
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                Create Password *
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input id="password" v-model="form.parent.password"
                                    :type="showPassword ? 'text' : 'password'" required
                                    class="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="At least 8 characters" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                            <p class="mt-2 text-xs text-gray-500">Must include at least 8 characters with letters and
                                numbers</p>
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input id="confirmPassword" v-model="form.parent.confirmPassword" type="password" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Re-enter your password" />
                        </div>
                    </div>
                </div>

                <!-- Step 2: Child Information -->
                <div v-if="currentStep === 2" class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Child Information</h3>
                    <p class="text-gray-600 mb-6">Add your child's details for vaccination registration</p>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label for="childName" class="block text-sm font-medium text-gray-700 mb-2">
                                Child's Full Name *
                            </label>
                            <input id="childName" v-model="form.child.name" type="text" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Jane Doe" />
                        </div>

                        <div>
                            <label for="childGender" class="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                            </label>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input v-model="form.child.gender" type="radio" value="male"
                                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" />
                                    <span class="ml-2 text-gray-700">Male</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input v-model="form.child.gender" type="radio" value="female"
                                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" />
                                    <span class="ml-2 text-gray-700">Female</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth *
                            </label>
                            <input id="dateOfBirth" v-model="form.child.dob" type="date" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label for="birthWeight" class="block text-sm font-medium text-gray-700 mb-2">
                                Birth Weight (kg)
                            </label>
                            <input id="birthWeight" v-model="form.child.birthWeight" type="number" step="0.01"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="3.2" />
                        </div>

                        <div>
                            <label for="birthPlace" class="block text-sm font-medium text-gray-700 mb-2">
                                Place of Birth *
                            </label>
                            <input id="birthPlace" v-model="form.child.birthPlace" type="text" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Hospital/Clinic Name" />
                        </div>

                        <div>
                            <label for="birthCertificate" class="block text-sm font-medium text-gray-700 mb-2">
                                Birth Certificate Number
                            </label>
                            <input id="birthCertificate" v-model="form.child.birthCertificate" type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="ZC123456" />
                        </div>
                    </div>

                    <div>
                        <h4 class="font-medium text-gray-900 mb-3">Medical History</h4>
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input v-model="form.child.allergies" type="checkbox"
                                    class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                <span class="ml-2 text-gray-700">Any known allergies</span>
                            </label>
                            <label class="flex items-center">
                                <input v-model="form.child.chronicConditions" type="checkbox"
                                    class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                <span class="ml-2 text-gray-700">Chronic medical conditions</span>
                            </label>
                            <label class="flex items-center">
                                <input v-model="form.child.previousVaccinations" type="checkbox"
                                    class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                <span class="ml-2 text-gray-700">Previous vaccinations received</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="additionalInfo" class="block text-sm font-medium text-gray-700 mb-2">
                            Additional Medical Notes
                        </label>
                        <textarea id="additionalInfo" v-model="form.child.additionalInfo" rows="3"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Any other relevant medical information..."></textarea>
                    </div>
                </div>

                <!-- Step 3: Vaccination Preferences -->
                <div v-if="currentStep === 3" class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Vaccination Preferences</h3>
                    <p class="text-gray-600 mb-6">Configure your vaccination preferences and notifications</p>

                    <div class="space-y-6">
                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Preferred Vaccination Center</h4>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label for="preferredCenter" class="block text-sm font-medium text-gray-700 mb-2">
                                        Select Center *
                                    </label>
                                    <select id="preferredCenter" v-model="form.preferences.preferredCenter" required
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Choose a center</option>
                                        <option value="parirenyatwa">Parirenyatwa Hospital, Harare</option>
                                        <option value="harare-central">Harare Central Hospital</option>
                                        <option value="mpilo">Mpilo Central Hospital, Bulawayo</option>
                                        <option value="chitungwiza">Chitungwiza Central Hospital</option>
                                        <option value="nearest">Nearest Available Center</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="preferredSchedule" class="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Schedule
                                    </label>
                                    <select id="preferredSchedule" v-model="form.preferences.preferredSchedule"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="weekday-morning">Weekday Morning (8AM-12PM)</option>
                                        <option value="weekday-afternoon">Weekday Afternoon (1PM-5PM)</option>
                                        <option value="saturday">Saturday Morning (8AM-1PM)</option>
                                        <option value="any">Any Available Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Notification Preferences</h4>
                            <div class="space-y-3">
                                <label class="flex items-center justify-between">
                                    <div>
                                        <span class="text-gray-700">SMS Reminders</span>
                                        <p class="text-sm text-gray-500">Receive appointment reminders via SMS</p>
                                    </div>
                                    <input v-model="form.preferences.smsNotifications" type="checkbox"
                                        class="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                </label>
                                <label class="flex items-center justify-between">
                                    <div>
                                        <span class="text-gray-700">Email Notifications</span>
                                        <p class="text-sm text-gray-500">Receive vaccination updates via email</p>
                                    </div>
                                    <input v-model="form.preferences.emailNotifications" type="checkbox"
                                        class="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                </label>
                                <label class="flex items-center justify-between">
                                    <div>
                                        <span class="text-gray-700">Vaccination Alerts</span>
                                        <p class="text-sm text-gray-500">Get alerts for upcoming vaccines</p>
                                    </div>
                                    <input v-model="form.preferences.vaccinationAlerts" type="checkbox"
                                        class="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Consent & Agreement</h4>
                            <div class="space-y-3">
                                <label class="flex items-start">
                                    <input v-model="form.preferences.consent" type="checkbox" required
                                        class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 mt-1" />
                                    <span class="ml-2 text-gray-700">
                                        I consent to my child receiving vaccinations according to the national
                                        immunization schedule.
                                        I understand the benefits and risks associated with vaccinations.
                                    </span>
                                </label>
                                <label class="flex items-start">
                                    <input v-model="form.preferences.dataConsent" type="checkbox" required
                                        class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 mt-1" />
                                    <span class="ml-2 text-gray-700">
                                        I consent to the collection and processing of my child's health data for
                                        immunization purposes
                                        in accordance with the Privacy Policy.
                                    </span>
                                </label>
                                <label class="flex items-start">
                                    <input v-model="form.preferences.terms" type="checkbox" required
                                        class="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 mt-1" />
                                    <span class="ml-2 text-gray-700">
                                        I agree to the Terms of Service and have read the Privacy Policy.
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button v-if="currentStep > 1" type="button" @click="previousStep"
                        class="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 text-md rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Previous</span>
                    </button>

                    <div v-else></div>

                    <button v-if="currentStep < 3" type="button" @click="nextStep"
                        class="flex items-center gap-2 bg-primary-600 text-white px-8 py-3 text-md rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span>Continue</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button v-if="currentStep === 3" type="button" @click="submitRegistration" :disabled="isSubmitting"
                        class="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <template v-if="!isSubmitting">
                            <span>Complete Registration</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </template>

                        <template v-else>
                            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>Processing...</span>
                        </template>
                    </button>
                </div>

            </div>

            <!-- Login Link -->
            <div class="mt-6 text-center">
                <p class="text-gray-600">
                    Already have an account?
                    <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
                        Sign in here
                    </NuxtLink>
                </p>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h3 class="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h3>

                <p class="text-gray-600 mb-6">
                    Your account has been created and your child is now registered for immunization tracking.
                    You can now schedule appointments and receive vaccination reminders.
                </p>

                <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                    <p class="text-sm text-gray-700 mb-2">
                        <span class="font-semibold">Next Steps:</span>
                    </p>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li class="flex items-center">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Check your email for verification
                        </li>
                        <li class="flex items-center">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Schedule your child's first appointment
                        </li>
                        <li class="flex items-center">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            Download the vaccination schedule
                        </li>
                    </ul>
                </div>

                <div class="flex space-x-4">
                    <button @click="showSuccessModal = false"
                        class="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50">
                        Stay Here
                    </button>
                    <button @click="goToDashboard"
                        class="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Step tracking
const currentStep = ref(1)
const steps = [
    { id: 1, label: 'Parent Info' },
    { id: 2, label: 'Child Info' },
    { id: 3, label: 'Preferences' }
]

// Form state
const form = ref({
    parent: {
        name: '',
        relationship: '',
        email: '',
        phone: '',
        idNumber: '',
        address: '',
        password: '',
        confirmPassword: ''
    },
    child: {
        name: '',
        gender: '',
        dob: '',
        birthWeight: '',
        birthPlace: '',
        birthCertificate: '',
        allergies: false,
        chronicConditions: false,
        previousVaccinations: false,
        additionalInfo: ''
    },
    preferences: {
        preferredCenter: '',
        preferredSchedule: 'weekday-morning',
        smsNotifications: true,
        emailNotifications: true,
        vaccinationAlerts: true,
        consent: false,
        dataConsent: false,
        terms: false
    }
})

const showPassword = ref(false)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)

const nextStep = () => {
    if (validateCurrentStep()) {
        currentStep.value++
    }
}

const previousStep = () => {
    currentStep.value--
}

const validateCurrentStep = () => {
    // Basic validation for each step
    if (currentStep.value === 1) {
        if (!form.value.parent.name.trim()) {
            alert('Please enter parent name')
            return false
        }
        if (!form.value.parent.email.trim()) {
            alert('Please enter email address')
            return false
        }
        if (form.value.parent.password.length < 8) {
            alert('Password must be at least 8 characters')
            return false
        }
        if (form.value.parent.password !== form.value.parent.confirmPassword) {
            alert('Passwords do not match')
            return false
        }
    }

    if (currentStep.value === 2) {
        if (!form.value.child.name.trim()) {
            alert('Please enter child name')
            return false
        }
        if (!form.value.child.dob) {
            alert('Please select date of birth')
            return false
        }
    }

    return true
}

const submitRegistration = async () => {
    if (!form.value.preferences.consent || !form.value.preferences.dataConsent || !form.value.preferences.terms) {
        alert('Please agree to all consent statements')
        return
    }

    isSubmitting.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Store registration data
        localStorage.setItem('vaxnet_registration', JSON.stringify(form.value))
        localStorage.setItem('vaxnet_parent_auth', JSON.stringify({
            email: form.value.parent.email,
            name: form.value.parent.name
        }))

        showSuccessModal.value = true
    } catch (error) {
        alert('Registration failed. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}

const goToDashboard = () => {
    router.push('/parent-dashboard')
}
</script>

<style scoped>
/* Smooth transitions */
input,
select,
textarea,
button {
    transition: all 0.2s ease;
}

/* Custom focus styles */
input:focus,
select:focus,
textarea:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
    background-color: #2563eb;
    border-color: #2563eb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr !important;
    }
}
</style>
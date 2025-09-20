<script setup lang="ts">
interface Props {
  show: boolean
  text?: string
  spinnerSrc?: string
  altText?: string
}

const props = defineProps<Props>()

// Defaults
const text = props.text ?? 'Loading...'
const altText = props.altText ?? 'Loading spinner'
</script>


<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
    <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <!-- Spinner: either custom image or default SVG -->
      <img v-if="spinnerSrc" :src="spinnerSrc" :alt="altText" class="w-18 h-18" />
      <svg v-else class="w-12 h-12 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>

      <!-- Loading Text -->
      <span class="text-gray-700 text-lg font-medium">{{ text }}</span>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, defineProps } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  onSubmit?: (value: string) => void
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

const localValue = ref(props.modelValue)

const submit = () => {
  if (!localValue.value.trim()) return
  props.onSubmit?.(localValue.value)
  localValue.value = ''
  emit('update:modelValue', localValue.value)
}
</script>

<template>
  <!-- Outer wrapper -->
  <div class="w-full max-w-4xl mx-auto flex flex-col items-center space-y-4">
    
    <!-- Heading -->
    <h1 class=" text-3xl font-bold text-center">What do you have in mind?</h1>
    
    <!-- Card container -->
    <div class="w-full bg-white border p-1 rounded-xl relative">
      <textarea
        v-model="localValue"
        :placeholder="placeholder"
        class="w-full p-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>

      <button
        @click="submit"
        class="absolute bottom-4 right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>

  </div>
</template>


<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface Props {
  modelValue: boolean
  size?: number
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'update:modelValue', value: boolean) => void>()

const toggle = () => emit('update:modelValue', !props.modelValue)
const circleSize = computed(() => `${props.size || 24}px`)
</script>

<template>
  <div
    :style="{ width: circleSize, height: circleSize }"
    @click="toggle"
    class="flex items-center justify-center cursor-pointer rounded-full border-2  relative"
  >
    <!-- Black filled circle with white check when checked -->
    <div
      v-if="modelValue"
      class="w-full h-full bg-black flex items-center justify-center rounded-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  type?: 'button' | 'submit'
}

const props = defineProps<Props>()
</script>

<template>
  <button
    :type="props.type || 'button'"
    class="w-full bg-black text-white rounded-lg py-2 font-medium hover:bg-gray-800 transition"
  >
    <slot />
  </button>
</template>

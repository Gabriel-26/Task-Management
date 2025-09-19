<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  searchValue?: string
  onSearch?: (val: string) => void
}

const props = defineProps<Props>()
</script>

<template>
  <header class="flex items-center justify-between bg-white p-4 rounded-t-xl shadow-sm">
    <div class="text-2xl font-bold">🌀</div>

    <input 
      type="text"
      :value="props.searchValue"
      @input="props.onSearch?.(($event.target as HTMLInputElement).value)"
      placeholder="Search"
      class="border border-gray-300 rounded-full px-4 py-1 w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <div class="w-8 h-8 rounded-full bg-gray-300"></div>
  </header>
</template>

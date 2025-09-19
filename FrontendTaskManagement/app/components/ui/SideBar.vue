<script setup lang="ts">
import { defineProps, ref } from 'vue'

interface Props {
  sections: {
    title?: string
    items: string[]
  }[]
}

const props = defineProps<Props>()

// Track the currently selected item
const activeItem = ref<string>('')

// Function to set active item
const selectItem = (item: string) => {
  activeItem.value = item
}
</script>

<template>
  <aside class="w-64 bg-white p-6 overflow-y-auto rounded-l-xl">
    <template v-for="(section, sIndex) in props.sections" :key="sIndex">
      <span v-if="section.title" class="text-gray-400 text-xs mb-2 block">{{ section.title }}</span>
      <p
        v-for="(item, index) in section.items"
        :key="index"
        @click="selectItem(item)"
        :class="[
          'mb-1 cursor-pointer px-2 py-1 rounded transition-colors',
          activeItem === item ? 'bg-black text-white' : 'hover:bg-gray-200'
        ]"
      >
        {{ item }}
      </p>
      <p class="mb-4" v-if="sIndex < props.sections.length - 1">&nbsp;</p>
    </template>
  </aside>
</template>

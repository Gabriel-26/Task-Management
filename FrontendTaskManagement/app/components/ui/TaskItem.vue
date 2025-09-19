<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import CircleCheckbox from './CircleCheckbox.vue'

interface Props {
  task: string
  done: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggleDone', task: string): void
  (e: 'delete', task: string): void
}>()

const handleToggle = () => emit('toggleDone', props.task)
const handleDelete = () => emit('delete', props.task)
</script>

<template>
  <div
    class="flex items-center border justify-between mb-2 p-2 rounded-lg w-full hover:bg-gray-100 transition"
  >
    <!-- Checkbox -->
   <CircleCheckbox v-model="props.done" @click="handleToggle" class="mr-3" />


    <!-- Task text -->
    <p
      :class="[
        'flex-1 text-sm select-none',
        props.done ? 'line-through text-gray-400' : 'text-gray-800'
      ]"
    >
      {{ props.task }}
    </p>

    <!-- Trash icon -->
    <div @click="handleDelete" class="cursor-pointer ml-3">
      <Trash2 class="w-5 h-5 text-gray-400 hover:text-red-500" />
    </div>
  </div>
</template>

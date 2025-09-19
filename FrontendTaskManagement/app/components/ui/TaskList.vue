<script setup lang="ts">
import { ref, defineProps } from 'vue'
import TaskItem from './TaskItem.vue'

interface Props {
  tasks: { text: string; done: boolean }[]
}

const props = defineProps<Props>()
const tasks = ref(props.tasks)

const toggleDone = (taskText: string) => {
  const task = tasks.value.find(t => t.text === taskText)
  if (task) task.done = !task.done
}

const removeTask = (taskText: string) => {
  tasks.value = tasks.value.filter(t => t.text !== taskText)
}
</script>

<template>
  <div class="w-full max-w-3xl mt-6 space-y-4">
    <TaskItem
      v-for="task in tasks"
      :key="task.text"
      :task="task.text"
      :done="task.done"
      @toggleDone="toggleDone"
      @delete="removeTask"
    />
  </div>
</template>

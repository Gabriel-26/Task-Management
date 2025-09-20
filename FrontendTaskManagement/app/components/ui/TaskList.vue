<script setup lang="ts">
import { defineProps } from 'vue'
import TaskItem from './TaskItem.vue'
import { useTaskStore } from '../store/tasks'
import { default as Draggable } from 'vuedraggable'

interface Props {
  tasks: { text: string; done: boolean; id: number; priority?: number }[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'delete', taskId: number): void
  (e: 'toggleDone', taskId: number): void
}>()

const taskStore = useTaskStore()

const toggleDone = (taskId: number) => {
  console.log('[toggleDone] clicked for taskId:', taskId)
  taskStore.toggleComplete(taskId)
  emit('toggleDone', taskId)
}


const removeTask = async (taskId: number) => {
  await taskStore.deleteTaskAPI(taskId)
  emit('delete', taskId)
}

const handleEdit = (payload: { id: number; text: string }) => {
  // Return the promise so TaskItem can await it
  return taskStore.editTaskAPI(payload.id, payload.text)
}

const editTask = (id: number, text: string) => {
  return taskStore.editTaskAPI(id, text)
}
// Called after drag ends
const onDragEnd = async (evt: any) => {
  const { oldIndex, newIndex } = evt
  if (oldIndex === undefined || newIndex === undefined) return

  const task = props.tasks[oldIndex]
  if (!task) return

  // Update task order in store & API
  await taskStore.updateTaskOrder(task.id, newIndex)
}
</script>

<template>
  <div class="w-full max-w-3xl mt-6">
    <Draggable
      v-model="props.tasks"
      item-key="id"
      @end="onDragEnd"
      handle=".cursor-move"
      class="space-y-4"
    >
      <template #item="{ element }">
       <TaskItem
  :id="element.id"
  :task="element.text"
  :done="element.done"
  :priority="element.priority"
  @toggleDone="toggleDone"
  @delete="removeTask"
  :edit-task="editTask"
/>

      </template>
    </Draggable>
  </div>
</template>

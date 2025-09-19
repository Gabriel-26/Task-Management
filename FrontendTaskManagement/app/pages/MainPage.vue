<script setup lang="ts">
import { ref } from 'vue'
// import HeaderBar from '~/components/ui/HeaderBar.vue'
// import SideBar from '~/components/ui/SideBar.vue'
// import TaskCard from '~/components/ui/TaskCard.vue'
import { TaskCard, SideBar, HeaderBar, TaskList } from '~/components/ui'

const newTask = ref('')
const taskList = ref<{ text: string; done: boolean }[]>([
  { text: 'Finish Vue/Nuxt tutorial', done: false },
  { text: 'Write daily report', done: true },
])
const sections = [
  { items: ['Today', 'Yesterday', 'Sunday, Jul 27'] },
  { title: 'Last week', items: ['Saturday, Jul 26', 'Friday, Jul 25', 'Thursday, Jul 24'] },
  { title: '3rd Week of Jul', items: ['Saturday, Jul 19', 'Friday, Jul 18'] }
]

const submitTask = (value: string) => {
  console.log('Task submitted:', value)
}
</script>

<template>
    <HeaderBar />
    <div class="flex flex-1 overflow-hidden mt-4">
      <SideBar :sections="sections" />
      <main class="flex-1 flex items-center justify-center p-6">
        <TaskCard
                v-if="taskList.length === 0"
                v-model="newTask"  placeholder="Write the task you plan to do today here..." :onSubmit="submitTask" />
          <!-- Task list -->
      <TaskList
        v-if="taskList.length > 0"
        :tasks="taskList"
      />
      </main>
    </div>
</template>

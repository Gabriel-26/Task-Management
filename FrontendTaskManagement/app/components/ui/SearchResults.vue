<script setup lang="ts">
import { computed } from "vue";
import TaskList from "./TaskList.vue";
import { useTaskStore } from "../store/tasks";

const taskStore = useTaskStore();

// Precompute the mapped tasks, so Vue only recomputes when searchResults changes
const mappedSearchResults = computed(() =>
  taskStore.searchResults.map((t) => ({
    id: t.id,
    text: t.statement,
    done: t.completed,
  }))
);
</script>

<template>
  <div class="w-full max-w-3xl mt-6">
    <TaskList :tasks="mappedSearchResults" />
  </div>
</template>

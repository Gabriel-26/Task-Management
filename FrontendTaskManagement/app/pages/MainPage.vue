<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import {
  TaskCard,
  SideBar,
  HeaderBar,
  TaskList,
  TaskInput,
  LoadingOverlay,
  SearchResults,
} from "~/components/ui";
import { useTaskStore } from "../components/store/tasks";

const taskStore = useTaskStore();
const newTask = ref("");

// Submit new task
const submitTask = async (value: string) => {
  if (!value.trim()) return;
  try {
    await taskStore.addTaskAPI(value);
    newTask.value = ""; // clear after API finishes
  } catch (err) {
    console.error("[submitTask] failed:", err);
  }
};

const searchQuery = ref("");
const searchLoading = ref(false);

// Watch search input and call backend directly
watch(searchQuery, async (val) => {
  console.log("[Watcher] searchQuery changed:", val);

  if (!val.trim()) {
    taskStore.searchResults = [];
    searchLoading.value = false;
    return;
  }

  searchLoading.value = true;
  await taskStore.searchTasks(val);
  searchLoading.value = false;
});

const loading = ref(true);

onMounted(async () => {
  // taskStore.initPersistence() // watch for changes -> localStorage
  taskStore.hydrateSidebar();
  await taskStore.initTasks();
  loading.value = false;
  // console.log("taskstore active item check", taskStore.activeItem)
});

const filteredTasks = computed(() => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const allTasks = Object.values(taskStore.tasksByDate).flat();

  const result = allTasks.filter((t) => {
    const due = new Date(t.due_date);
    let key = "";

    if (due.toDateString() === today.toDateString()) key = "Today";
    else if (due.toDateString() === yesterday.toDateString()) key = "Yesterday";
    else
      key = due.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric", // ✅ include the year
      });

    return key === taskStore.activeItem;
  });

  return result;
});
</script>

<template>
  <!-- Full-page loading overlay -->
  <LoadingOverlay
    :show="loading"
    text="Loading tasks..."
    spinnerSrc="/GT2.gif"
  />

  <HeaderBar v-model:searchQuery="searchQuery" />

  <div class="flex overflow-hidden mt-4" style="height: 91vh">
    <SideBar />

    <main class="flex-1 flex flex-col p-6">
      <!-- Show search results if available -->
      <div
        v-if="taskStore.searchResults.length > 0 || searchLoading"
        class="flex flex-col h-full"
      >
        <!-- Heading stays at the top -->
        <h2 class="font-semibold text-lg mb-2">Search Results</h2>

        <!-- Scrollable search results -->
        <div class="flex-1 overflow-y-auto">
          <div class="w-full max-w-3xl mx-auto">
            <!-- Loading spinner, only when searching -->
            <div
              v-if="searchLoading"
              class="flex justify-center items-center py-6"
            >
              <div
                class="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"
              ></div>
              <span class="ml-2 text-gray-500 text-sm">Searching tasks...</span>
            </div>

            <!-- Only show results when not loading -->
            <SearchResults v-else />
          </div>
        </div>
      </div>

      <!-- Show normal tasks if no search results -->
      <div v-else class="flex flex-col h-full">
        <h2 class="font-semibold text-lg">{{ taskStore.activeItem }}</h2>

        <!-- Center TaskCard if no tasks -->
        <!-- Center TaskCard if no tasks -->
        <div
          v-if="filteredTasks.length === 0"
          class="flex flex-col items-center mt-36"
        >
          <TaskCard
            v-model="newTask"
            placeholder="Write the task you plan to do today here..."
            :onSubmit="submitTask"
            :key="'card-' + taskStore.activeItem"
          />
        </div>

        <!-- Task list and bottom input only show if there are tasks -->
        <div class="flex-1 flex flex-col overflow-y-auto">
          <!-- Scrollable task list -->
          <div class="w-full max-w-3xl mx-auto flex-1 overflow-y-auto">
            <TaskList
              :tasks="
                filteredTasks.map((t) => ({
                  text: t.statement,
                  done: t.completed,
                  id: t.id,
                  priority: t.priority, // <— make sure this exists
                }))
              "
            />
          </div>

          <!-- Task input sticks to the bottom -->
          <div class="w-full max-w-3xl mx-auto mt-4">
            <TaskInput
              v-model="newTask"
              placeholder="What else do you need to do?"
              :onSubmit="submitTask"
              :key="'input-' + taskStore.activeItem"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

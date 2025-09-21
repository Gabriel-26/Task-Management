<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onBeforeUnmount } from "vue";

interface Props {
  searchQuery: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
}>();

const inputValue = ref(props.searchQuery);
let timer: ReturnType<typeof setTimeout> | null = null;

const onInput = (e: Event) => {
  inputValue.value = (e.target as HTMLInputElement).value;

  // Clear previous timer
  if (timer) clearTimeout(timer);

  // Set new timer
  timer = setTimeout(() => {
    emit("update:searchQuery", inputValue.value);
  }, 300);
};

// Clean up timer on unmount
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

// Sync props.searchQuery if parent changes it externally
watch(
  () => props.searchQuery,
  (newVal) => {
    inputValue.value = newVal;
  }
);
</script>

<template>
  <header
    class="flex items-center justify-between bg-white p-4 rounded-t-xl shadow-sm"
  >
    <div class="text-2xl font-bold">🌀</div>

    <input
      type="text"
      :value="inputValue"
      @input="onInput"
      placeholder="Search"
      class="border border-gray-300 rounded-full px-4 py-1 w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <div class="w-8 h-8 rounded-full bg-gray-300"></div>
  </header>
</template>

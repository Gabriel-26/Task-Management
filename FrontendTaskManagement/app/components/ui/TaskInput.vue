<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

interface Props {
  modelValue: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const localValue = ref(props.modelValue);

const submit = () => {
  if (!localValue.value.trim()) return;
  const valueToSubmit = localValue.value;
  props.onSubmit?.(valueToSubmit);
  localValue.value = "";
  emit("update:modelValue", ""); // explicitly clear v-model
};
</script>

<template>
  <div class="w-full h-full flex flex-col justify-end items-center pb-6">
    <!-- Input container -->
    <div class="w-full max-w-3xl flex items-center relative">
      <input
        v-model="localValue"
        :placeholder="placeholder"
        class="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @keyup.enter="submit"
      />
      <button
        @click="submit"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

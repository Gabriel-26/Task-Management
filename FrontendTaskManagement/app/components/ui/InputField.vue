<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Props {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  modelValue: string;
}

const props = defineProps<Props>();

// Typed emit for v-model support
const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

// Generate a unique id if none is passed
const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

// Handle input events
const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="mb-4">
    <!-- Render label only if provided -->
    <label
      v-if="props.label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ props.label }}
    </label>

    <input
      :id="inputId"
      :type="props.type || 'text'"
      :placeholder="props.placeholder"
      class="w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      :value="props.modelValue"
      @input="onInput"
    />
  </div>
</template>

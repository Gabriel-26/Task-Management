<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

interface Props {
  title?: string;
  message?: string;
  show: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "update:show", value: boolean): void;
}>();

const visible = ref(props.show);

watch(
  () => props.show,
  (v) => (visible.value = v)
);

const confirm = () => {
  emit("confirm");
  visible.value = false;
  emit("update:show", false);
};

const cancel = () => {
  emit("cancel");
  visible.value = false;
  emit("update:show", false);
};
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-80">
      <h3 class="text-lg font-semibold mb-2">{{ props.title || "Confirm" }}</h3>
      <p class="text-sm text-gray-600 mb-4">
        {{ props.message || "Are you sure?" }}
      </p>
      <div class="flex justify-end space-x-2">
        <button
          @click="cancel"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

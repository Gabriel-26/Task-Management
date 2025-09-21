<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Trash2, Check } from "lucide-vue-next";
import CircleCheckbox from "./CircleCheckbox.vue";
import ConfirmDialog from "./ConfirmDialog.vue";

interface Props {
  id: number;
  task: string;
  done: boolean;
  priority?: number;
  editTask: (id: number, text: string, priority?: number) => Promise<void>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "toggleDone", taskId: number): void;
  (e: "delete", taskId: number): void;
  (e: "edit", payload: { id: number; text: string }): Promise<void>;
}>();

const editing = ref(false);
const editText = ref(props.task);
const showConfirm = ref(false);
const saving = ref(false);
const localPriority = ref(props.priority);

watch(
  () => props.task,
  (newVal) => {
    editText.value = newVal;
  }
);
// watch(() => props.priority, (val) => {
//   localPriority.value = val
// })
// Compute color based on priority
const priorityColor = computed(() => {
  switch (localPriority.value) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-400";
    case 3:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
});
const cyclePriority = async () => {
  // Treat undefined as 0 → first click should be 1
  const current =
    typeof localPriority.value === "number" ? localPriority.value : 0;
  const next = current >= 3 ? 1 : current + 1;

  localPriority.value = next; // update UI instantly
  saving.value = true;
  try {
    console.log(
      "[cyclePriority] sending to editTask:",
      props.id,
      props.task,
      next
    );

    await props.editTask(props.id, props.task, next);
  } finally {
    saving.value = false;
  }
};

// Handlers
const handleToggle = () => emit("toggleDone", props.id);
const handleDelete = () => {
  showConfirm.value = true;
};
const onConfirmDelete = () => emit("delete", props.id);
const startEdit = () => {
  editing.value = true;
  editText.value = props.task;
};
const confirmEdit = async () => {
  if (!editText.value.trim() || editText.value === props.task) {
    editing.value = false;
    return;
  }
  saving.value = true;
  try {
    await props.editTask(props.id, editText.value);
  } finally {
    saving.value = false;
    editing.value = false;
  }
};
</script>

<template>
  <div
    class="flex items-center border justify-between mb-2 p-2 rounded-lg w-full hover:bg-gray-100 transition"
  >
    <!-- Drag handle -->
    <div class="cursor-move mr-2 text-gray-400 hover:text-gray-600">≡</div>

    <!-- Checkbox -->
    <CircleCheckbox v-model="props.done" @click="handleToggle" class="mr-3" />

    <!-- Priority indicator -->
    <!-- Priority selector -->
    <div class="flex items-center">
      <div
        class="w-2 h-6 rounded mr-2 cursor-pointer"
        :class="priorityColor"
        @click="cyclePriority"
        title="Click to change priority"
      ></div>
    </div>
    <!-- Task text or input -->
    <div class="flex-1 relative">
      <p
        v-if="!editing"
        @click="startEdit"
        :class="[
          props.done ? 'line-through text-gray-400' : 'text-gray-800',
          'cursor-text',
        ]"
      >
        {{ props.task }}
      </p>
      <div v-else class="flex items-center">
        <input
          v-model="editText"
          class="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm p-1"
          @keyup.enter="confirmEdit"
          @blur="confirmEdit"
          :disabled="saving"
        />
        <button
          @click="confirmEdit"
          class="ml-2 text-blue-500 hover:text-blue-700"
          :disabled="saving"
        >
          <Check class="w-4 h-4" />
        </button>
        <div
          v-if="saving"
          class="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <!-- Trash icon -->
    <div @click="handleDelete" class="cursor-pointer ml-3">
      <Trash2 class="w-5 h-5 text-gray-400 hover:text-red-500" />
    </div>

    <ConfirmDialog
      :show="showConfirm"
      title="Delete Task?"
      message="This action cannot be undone."
      @confirm="onConfirmDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

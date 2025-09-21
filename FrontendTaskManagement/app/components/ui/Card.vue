<script setup lang="ts">
import { defineProps } from "vue";

interface Props {
  padding?: string;
  maxWidth?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl border',
      props.padding || 'p-12',
      props.maxWidth || 'w-full max-w-md',
    ]"
  >
    <slot />
  </div>
</template>

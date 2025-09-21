<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "../store/tasks";

const taskStore = useTaskStore();
const selectItem = (item: string) => {
  console.log("Sidebar item clicked:", item);
  taskStore.setActiveItem(item);
};

// Helper to format a date nicely
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Current month info
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Generate all dates of the current month
const days: Date[] = [];
const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
for (
  let d = new Date(firstDayOfMonth);
  d <= lastDayOfMonth;
  d.setDate(d.getDate() + 1)
) {
  days.push(new Date(d));
}

// Helper to get week number in month (1-based)
const getWeekOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const adjustedDate = dayOfMonth + firstDay.getDay(); // offset by first day
  return Math.ceil(adjustedDate / 7);
};

// Only keep dates ≤ today
const pastDates = days.filter((d) => d <= today);

// Calculate yesterday
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

// Function to get label for a date
const getLabel = (d: Date) => {
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(d);
};

// Group days into sections
let sectionsArr: { title?: string; items: string[] }[] = [];

const currentWeekNumber = getWeekOfMonth(today);

// Current week
const currentWeek = pastDates
  .filter((d) => getWeekOfMonth(d) === currentWeekNumber)
  .map(getLabel);
sectionsArr.push({ title: "This week", items: currentWeek });

// Previous weeks
for (let w = currentWeekNumber - 1; w >= 1; w--) {
  const weekItems = pastDates
    .filter((d) => getWeekOfMonth(d) === w)
    .sort((a, b) => b.getTime() - a.getTime()) // newest first
    .map(getLabel);

  const title =
    w === currentWeekNumber - 1
      ? "Last week"
      : `Week ${w} of ${today.toLocaleDateString("en-US", { month: "long" })}`;
  sectionsArr.push({ title, items: weekItems });
}

// Final reactive
const sections = ref(sectionsArr);
</script>

<template>
  <aside class="w-64 bg-white p-6 overflow-y-auto rounded-l-xl">
    <template v-for="(section, sIndex) in sections" :key="sIndex">
      <span
        v-if="section.title"
        class="text-gray-400 text-xs mb-2 px-4 block"
        >{{ section.title }}</span
      >
      <p
        v-for="(item, index) in section.items"
        :key="index"
        @click="selectItem(item)"
        :class="[
          'mb-1 cursor-pointer px-4 py-1 rounded-lg transition-colors text-sm',
          taskStore.activeItem === item
            ? 'bg-black text-white'
            : 'hover:bg-gray-200',
        ]"
      >
        {{ item }}
      </p>

      <p class="mb-4" v-if="sIndex < sections.length - 1">&nbsp;</p>
    </template>
  </aside>
</template>

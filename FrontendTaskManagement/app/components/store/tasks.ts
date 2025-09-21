// stores/tasks.ts
import { defineStore } from "pinia";
import { api } from "~/components/auth/useAPI";

export interface Task {
  id: number;
  user_id: number;
  statement: string;
  due_date: string;
  completed: boolean;
  priority: number;
  order: number;
  created_at: string;
  updated_at: string;
}
function activeItemToDate(item: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (item === "Today") return today.toLocaleDateString("en-CA");
  if (item === "Yesterday") return yesterday.toLocaleDateString("en-CA");

  // parse other formats like "Mon, Sep 16, 2025"
  const parsed = new Date(item);
  if (!isNaN(parsed.getTime())) return parsed.toLocaleDateString("en-CA");

  console.warn("[activeItemToDate] failed to parse item:", item);
  return today.toLocaleDateString("en-CA");
}

// Utility to normalize date into YYYY-MM-DD
function normalizeDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0] ?? "";
}

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasksByDate: {} as Record<string, Task[]>,
    activeItem: "Today",
    searchResults: [] as Task[], // <-- add search results state
  }),

  getters: {
    allTasks: (state) => Object.values(state.tasksByDate).flat(),

    sections: (state) => {
      const allTasks = Object.values(state.tasksByDate).flat();
      const today = new Date();

      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const tasksThisMonth = allTasks.filter(
        (t) =>
          t.due_date &&
          !isNaN(new Date(t.due_date).getTime()) &&
          new Date(t.due_date).getMonth() === currentMonth &&
          new Date(t.due_date).getFullYear() === currentYear
      );

      const dateMap: Record<string, Task[]> = {};

      tasksThisMonth.forEach((t) => {
        const dateObj = new Date(t.due_date);
        const dateStr =
          dateObj.toDateString() === today.toDateString()
            ? "Today"
            : new Date(dateObj.getTime() - 86400000).toDateString() ===
              today.toDateString()
            ? "Yesterday"
            : dateObj.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
        if (!dateMap[dateStr]) dateMap[dateStr] = [];
        dateMap[dateStr].push(t);
      });

      const sortedDates = Object.keys(dateMap).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );

      const sectionsArr: { title: string; items: string[] }[] = [];

      const todayStr = "Today";
      const yesterdayStr = "Yesterday";
      if (dateMap[todayStr]) {
        sectionsArr.push({
          title: todayStr,
          items: dateMap[todayStr].map((t) => t.statement),
        });
      }
      if (dateMap[yesterdayStr]) {
        sectionsArr.push({
          title: yesterdayStr,
          items: dateMap[yesterdayStr].map((t) => t.statement),
        });
      }

      sortedDates.forEach((d) => {
        if (d !== todayStr && d !== yesterdayStr) {
          const tasks = dateMap[d] ?? [];
          sectionsArr.push({ title: d, items: tasks.map((t) => t.statement) });
        }
      });

      return sectionsArr;
    },

    filteredTasks: (state) => {
      const allTasks = Object.values(state.tasksByDate).flat();
      return allTasks.filter((t) => {
        const due = new Date(t.due_date);
        const dateStr =
          due.toDateString() === new Date().toDateString()
            ? "Today"
            : new Date(due.getTime() - 86400000).toDateString() ===
              new Date().toDateString()
            ? "Yesterday"
            : due.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
        return dateStr === state.activeItem;
      });
    },
  },

  actions: {
    async setActiveItem(item: string) {
      this.activeItem = item;
      localStorage.setItem("activeItem", item); // persist sidebar state

      const formatDateSafe = (d: Date): string | null => {
        if (isNaN(d.getTime())) {
          console.warn("[formatDateSafe] Invalid date:", d);
          return null;
        }
        return d.toISOString().split("T")[0] ?? null;
      };

      let targetDate: string | null = null;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (item === "Today") targetDate = formatDateSafe(today);
      else if (item === "Yesterday") targetDate = formatDateSafe(yesterday);
      else targetDate = new Date(item).toLocaleDateString("en-CA"); // stays correct

      console.log("[setActiveItem] resolved targetDate:", targetDate);

      if (targetDate && !this.tasksByDate[targetDate]) {
        console.log(
          "[setActiveItem] fetching tasks for targetDate:",
          targetDate
        );
        await this.fetchTasks(targetDate, targetDate);
      } else {
        console.log("[setActiveItem] tasks already cached for:", targetDate);
      }
    },

    async initTasks() {
      this.hydrateTasks(); // load cached tasks
      this.hydrateSidebar(); // restore sidebar selection
      this.initPersistence(); // auto-save any task changes
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const todayStr = today.toISOString().split("T")[0] ?? "";
      const yesterdayStr = yesterday.toISOString().split("T")[0] ?? "";

      // Fetch only if not in localStorage
      if (!this.tasksByDate[todayStr] || !this.tasksByDate[yesterdayStr]) {
        await this.fetchTasks(yesterdayStr, todayStr);
      }

      this.prefetchMonth(today);
    },

    async prefetchMonth(refDate: Date) {
      const year = refDate.getFullYear();
      const month = refDate.getMonth();
      const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
      const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];

      this.fetchTasks(firstDay, lastDay).catch((err) => {
        console.error("[prefetchMonth] failed:", err);
      });
    },

    async fetchTasks(from?: string, to?: string, force = false) {
      const key: string = from && to ? `${from}_${to}` : "default";

      if (this.tasksByDate[key] && !force) {
        console.log("[fetchTasks] cache hit for key:", key);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const response = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
          params: { from, to },
        });

        console.log("[fetchTasks] raw API response:", response.data);

        const tasks: Task[] = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        console.log("[fetchTasks] tasks array:", tasks);

        // Merge tasks into store by date
        tasks.forEach((t) => {
          if (!t.due_date) return;
          const dateKey = t.due_date.split("T")[0] ?? "";

          if (!this.tasksByDate[dateKey] || force)
            this.tasksByDate[dateKey] = [];

          const existingIndex = this.tasksByDate[dateKey].findIndex(
            (e) => e.id === t.id
          );
          if (existingIndex >= 0) {
            // Update existing task
            this.tasksByDate[dateKey][existingIndex] = t;
          } else {
            // Add new task
            this.tasksByDate[dateKey].push(t);
          }
        });

        console.log("[fetchTasks] tasksByDate after merge:", this.tasksByDate);

        // Persist after every fetch
        localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
      } catch (err) {
        console.error("[fetchTasks] error:", err);
      }
    },

    async addTaskAPI(statement: string) {
      if (!statement.trim()) return;

      const taskDate = activeItemToDate(this.activeItem); // "YYYY-MM-DD"
      const token = localStorage.getItem("auth_token");
      const tempId = Date.now();

      const newTask: Task = {
        id: tempId,
        user_id: Number(localStorage.getItem("user_id") || 0),
        statement,
        due_date: taskDate,
        completed: false,
        priority: 0,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistically add locally
      this.addTask(newTask);

      try {
        // Send to API
        const response = await api.post(
          "/tasks",
          { statement, due_date: taskDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const savedTask: Task = response.data.data;
        const key = normalizeDate(taskDate);
        if (!this.tasksByDate[key]) this.tasksByDate[key] = [];

        // Merge saved task, remove temp if exists
        this.tasksByDate[key] = [
          ...this.tasksByDate[key].filter(
            (t) => t.id !== tempId && t.id !== savedTask.id
          ),
          savedTask,
        ];

        // Persist after update
        localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));

        // Optional: refresh filteredTasks based on current activeItem
        await this.setActiveItem(this.activeItem);
      } catch (err) {
        console.error("[addTaskAPI] failed:", err);

        // Remove temp task
        const key = normalizeDate(taskDate);
        this.tasksByDate[key] = (this.tasksByDate[key] ?? []).filter(
          (t) => t.id !== tempId
        );
        localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
      }
    },

    async editTaskAPI(taskId: number, newStatement: string, priority?: number) {
      if (!newStatement.trim() && priority === undefined) return; // allow updates with only priority

      let taskToUpdate: Task | null = null;
      let keyFound: string | null = null;

      // Find the task in tasksByDate
      for (const key in this.tasksByDate) {
        const task = this.tasksByDate[key]?.find((t) => t.id === taskId);
        if (task) {
          taskToUpdate = task;
          keyFound = key;
          break;
        }
      }

      if (!taskToUpdate || !keyFound) {
        console.warn("[editTaskAPI] Task not found:", taskId);
        return;
      }

      const oldStatement = taskToUpdate.statement;
      const oldPriority = taskToUpdate.priority;

      if (newStatement.trim()) taskToUpdate.statement = newStatement;
      if (priority !== undefined) taskToUpdate.priority = priority;
      taskToUpdate.updated_at = new Date().toISOString();

      // Persist immediately to localStorage for real-time update
      localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));

      try {
        const token = localStorage.getItem("auth_token");
        const payload: any = {};
        if (newStatement.trim()) payload.statement = newStatement;
        if (priority !== undefined) payload.priority = priority; // <-- include priority

        console.log("[editTaskAPI] sending payload to API:", payload);

        const response = await api.put(`/tasks/${taskId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedTask: Task = response.data.data;
        // Replace the task in the store with the one returned from API
        if (keyFound) {
          this.tasksByDate[keyFound] =
            this.tasksByDate[keyFound]?.map((t) =>
              t.id === taskId ? updatedTask : t
            ) ?? [];
        }

        this.updateSearchResults(taskId, updatedTask); // sync again with API result
        localStorage.setItem(
          "tasksByDate",
          JSON.stringify({ [keyFound]: this.tasksByDate[keyFound] })
        );
      } catch (err) {
        console.error("[editTaskAPI] API update failed:", err);
        // Rollback locally if API fails
        taskToUpdate.statement = oldStatement;
        if (priority !== undefined) taskToUpdate.priority = oldPriority;
        taskToUpdate.updated_at = new Date().toISOString();
        localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
      }
    },

    async deleteTaskAPI(taskId: number) {
      let keyFound: string | undefined;

      // find the task in tasksByDate
      for (const key in this.tasksByDate) {
        if (this.tasksByDate[key]?.some((t) => t.id === taskId)) {
          keyFound = key;
          break;
        }
      }

      if (!keyFound) return;

      // remove locally
      this.tasksByDate[keyFound] =
        this.tasksByDate[keyFound]?.filter((t) => t.id !== taskId) ?? [];
      this.updateSearchResults(taskId, null); // ✅ remove from searchResults

      localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));

      // send DELETE request
      try {
        const token = localStorage.getItem("auth_token");
        await api.delete(`/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("[deleteTaskAPI] failed to delete task:", err);
      }
    },
    //update order for each task based on its date/group so multiple tasks might have same
    //number in their order field
    //doesnt follow last number base on seeder
    async updateTaskOrder(taskId: number, newIndex: number) {
      // Find the task and its date group
      let taskToMove: Task | undefined;
      let keyFound: string | undefined;

      for (const key in this.tasksByDate) {
        const task = this.tasksByDate[key]?.find((t) => t.id === taskId);
        if (task) {
          taskToMove = task;
          keyFound = key;
          break;
        }
      }

      if (!taskToMove || !keyFound) {
        console.warn("[updateTaskOrder] Task not found:", taskId);
        return;
      }

      // Get all tasks in this group and sort by their current order
      const tasks = [...(this.tasksByDate[keyFound] ?? [])].sort(
        (a, b) => a.order - b.order
      );

      // Remove the dragged task
      const filteredTasks = tasks.filter((t) => t.id !== taskId);

      // Insert it at the new index
      filteredTasks.splice(newIndex, 0, taskToMove);

      // Reassign order numbers sequentially
      filteredTasks.forEach((t, index) => {
        t.order = index + 1;
      });

      // Update store
      this.tasksByDate[keyFound] = filteredTasks;
      localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));

      // Send order update for dragged task
      try {
        const token = localStorage.getItem("auth_token");
        await api.patch(
          `/tasks/${taskId}/order`,
          { order: taskToMove.order },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("[updateTaskOrder] API update failed:", err);
        // Optional: rollback if API fails
      }
    },

    async searchTasks(query: string) {
      if (!query.trim()) {
        this.searchResults = [];
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const url = "/tasks/search";
        console.log("[searchTasks] Calling API:", url, "with query:", query);

        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: query },
        });

        console.log("[searchTasks] API response:", response.data);

        const tasks: Task[] = Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        this.searchResults = tasks;
        console.log("[searchTasks] searchResults updated:", this.searchResults);
      } catch (err) {
        console.error("[searchTasks] API error:", err);
        this.searchResults = [];
      }
    },
    async toggleComplete(taskId: number) {
      console.log("[toggleComplete] called for taskId:", taskId);

      let taskToUpdate: Task | null = null;
      let keyFound: string | null = null;

      // Find the task in tasksByDate
      for (const key in this.tasksByDate) {
        const task = this.tasksByDate[key]?.find((t) => t.id === taskId);
        if (task) {
          taskToUpdate = task;
          keyFound = key;
          break;
        }
      }

      if (!taskToUpdate || !keyFound) {
        console.warn("[toggleComplete] task not found:", taskId);
        return;
      }

      // Optimistically toggle locally
      taskToUpdate.completed = !taskToUpdate.completed;
      taskToUpdate.updated_at = new Date().toISOString();
      console.log(
        "[toggleComplete] optimistic local toggle:",
        taskToUpdate.completed
      );

      localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
      this.updateSearchResults(taskId, { completed: taskToUpdate.completed });

      try {
        const token = localStorage.getItem("auth_token");
        console.log(
          "[toggleComplete] calling API PATCH /tasks/" + taskId + "/toggle"
        );
        const response = await api.patch(
          `/tasks/${taskId}/toggle`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedTask: Task = response.data.data;
        console.log("[toggleComplete] API returned:", updatedTask);

        if (keyFound) {
          const tasks = this.tasksByDate[keyFound] ?? [];
          this.tasksByDate[keyFound] = tasks.map((t) =>
            t.id === taskId ? updatedTask : t
          );
          this.updateSearchResults(taskId, updatedTask);
          localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
        }
      } catch (err) {
        console.error("[toggleComplete] API failed:", err);
        // rollback
        taskToUpdate.completed = !taskToUpdate.completed;
        localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
        this.updateSearchResults(taskId, { completed: taskToUpdate.completed });
      }
    },

    updateSearchResults(
      taskId: number,
      updatedTask: Partial<Task> | null = null
    ) {
      const task = this.searchResults.find((t) => t.id === taskId);
      if (!task) return;

      if (updatedTask) {
        // Mutate the existing object directly instead of creating a new one
        Object.assign(task, updatedTask);
      } else {
        const index = this.searchResults.findIndex((t) => t.id === taskId);
        if (index !== -1) this.searchResults.splice(index, 1);
      }
    },

    hydrateSidebar() {
      const saved = localStorage.getItem("activeItem");
      if (saved) {
        this.activeItem = saved;
      }
    },
    hydrateTasks() {
      const stored = localStorage.getItem("tasksByDate");
      if (stored) {
        try {
          this.tasksByDate = JSON.parse(stored);
          console.log("[hydrateTasks] loaded tasks from localStorage");
        } catch (err) {
          console.error("[hydrateTasks] failed to parse localStorage:", err);
          this.tasksByDate = {};
        }
      }
    },

    addTask(task: Task) {
      const key = normalizeDate(task.due_date);
      if (!this.tasksByDate[key]) this.tasksByDate[key] = [];
      this.tasksByDate[key].push(task);
      localStorage.setItem("tasksByDate", JSON.stringify(this.tasksByDate));
    },

    // toggleComplete(taskId: number) {
    //   for (const key in this.tasksByDate) {
    //     const tasks = this.tasksByDate[key]
    //     if (!tasks) continue
    //     const task = tasks.find((t) => t.id === taskId)
    //     if (task) {
    //       task.completed = !task.completed
    //       localStorage.setItem('tasksByDate', JSON.stringify(this.tasksByDate))
    //       break
    //     }
    //   }
    // },

    // Optional: automatic persistence for any state change
    initPersistence() {
      this.$subscribe((_mutation, state) => {
        localStorage.setItem("tasksByDate", JSON.stringify(state.tasksByDate));
      });
    },
  },
});

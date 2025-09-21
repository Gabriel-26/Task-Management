<script setup lang="ts">
import { ref } from "vue";
import { NotepadText } from "lucide-vue-next";
import { InputField, Button, Card } from "~/components/ui";
import { api } from "../components/auth/useAPI";
import { useRouter } from "vue-router";
import { useTaskStore } from "~/components/store/tasks";

interface LoginForm {
  email: string;
  password: string;
}

const form = ref<LoginForm>({
  email: "",
  password: "",
});

const loading = ref(false);
const toast = ref<{ message: string; type: "success" | "error" } | null>(null);
const toastTimeout = ref<number | null>(null);

const passwordInputId = `password-${Math.random().toString(36).substr(2, 9)}`;

const router = useRouter();
const taskStore = useTaskStore();

// Show toast for 3 seconds
const showToast = (message: string, type: "success" | "error" = "error") => {
  toast.value = { message, type };
  if (toastTimeout.value) clearTimeout(toastTimeout.value);
  toastTimeout.value = window.setTimeout(() => {
    toast.value = null;
  }, 3000);
};

const handleLogin = async (): Promise<void> => {
  loading.value = true;

  try {
    const { data } = await api.post("/login", form.value);
    const token = data.token;

    if (!token) {
      showToast("Login failed. Please try again.", "error");
      return;
    }

    localStorage.setItem("auth_token", token);
    showToast("Login successful!", "success");

    await taskStore.fetchTasks();
    router.push("/mainpage");
  } catch (error: any) {
    if (error.response?.status === 422) {
      // Backend validation errors
      const validationErrors = error.response.data.errors;
      showToast(
        validationErrors.email?.[0] ||
          validationErrors.password?.[0] ||
          "Validation error",
        "error"
      );
    } else if (error.response?.status === 401) {
      showToast("Invalid email or password", "error");
    } else {
      showToast(error.message || "Something went wrong", "error");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex h-screen flex-col items-center justify-center bg-white space-y-6 px-4"
  >
    <NotepadText class="w-12 h-12 text-black" />

    <Card class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p class="text-gray-500 text-center mb-6">
        Login to continue using this app
      </p>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Email Field -->
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          v-model="form.email"
        />

        <!-- Password Field -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label
              :for="passwordInputId"
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a href="#" class="text-xs text-black hover:underline"
              >Forgot your password?</a
            >
          </div>

          <InputField
            id="passwordInputId"
            type="password"
            placeholder="Enter your password"
            v-model="form.password"
          />
        </div>

        <!-- Submit Button -->
        <Button type="submit" :disabled="loading">
          <span
            v-if="loading"
            class="animate-spin mr-2 border-2 border-t-2 border-gray-200 rounded-full w-4 h-4 inline-block"
          ></span>
          Login
        </Button>
      </form>
    </Card>

    <!-- Floating Toast -->
    <transition name="fade">
      <div
        v-if="toast"
        :class="[
          'fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

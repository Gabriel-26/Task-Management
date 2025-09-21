<script setup lang="ts">
import { ref } from "vue";
import { InputField, Button, Card } from "~/components/ui";
import { NotepadText } from "lucide-vue-next";

interface LoginForm {
  email: string;
  password: string;
}

const form = ref<LoginForm>({
  email: "",
  password: "",
});

const handleLogin = async (): Promise<void> => {
  console.log(form.value.email, form.value.password);
};
</script>

<template>
  <div
    class="flex h-screen flex-col items-center justify-center bg-white space-y-6"
  >
    <!-- Icon outside the card -->
    <NotepadText class="w-12 h-12 text-black" />

    <!-- Card -->
    <Card>
      <!-- Title -->
      <h1 class="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p class="text-gray-500 text-center mb-6">
        Login to continue using this app
      </p>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          v-model="form.email"
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          v-model="form.password"
        >
          <template #extra>
            <div class="text-xs text-right mt-1">
              <a href="#" class="text-black hover:underline"
                >Forgot your password?</a
              >
            </div>
          </template>
        </InputField>

        <Button type="submit" color="primary">Login</Button>
      </form>
    </Card>
  </div>
</template>

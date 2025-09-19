<script setup lang="ts">
import { ref } from 'vue'
import { NotepadText } from 'lucide-vue-next'
// import Card from '~/components/ui/Card.vue'
// import InputField from '~/components/ui/InputField.vue'
// import Button from '~/components/ui/Button.vue'
import { InputField, Button, Card } from '~/components/ui'


interface LoginForm {
  email: string
  password: string
}

const form = ref<LoginForm>({
  email: '',
  password: ''
})

// Unique id for password input for accessibility
const passwordInputId = `password-${Math.random().toString(36).substr(2, 9)}`

const handleLogin = async (): Promise<void> => {
  console.log(form.value.email, form.value.password)
}
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center bg-white space-y-6">
    <!-- Logo/Icon -->
    <NotepadText class="w-12 h-12 text-black" />

    <Card>
      <h1 class="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p class="text-gray-500 text-center mb-6">Login to continue using this app</p>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Email Field -->
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          v-model="form.email"
        />

        <!-- Password Field with label + forgot link -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <label :for="passwordInputId" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" class="text-xs text-black hover:underline">Forgot your password?</a>
          </div>

          <InputField
            id="passwordInputId"
            type="password"
            placeholder="Enter your password"
            v-model="form.password"
          />
        </div>

        <!-- Submit Button -->
        <Button type="submit">Login</Button>
      </form>
    </Card>
  </div>
</template>

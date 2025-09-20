// composables/useApi.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api', // your Laravel API base URL
  withCredentials: true,                // for Laravel Sanctum cookie support
  headers: {
    'Content-Type': 'application/json',
  },
})

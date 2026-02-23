import axios from "axios"
import { useAuthStore } from "@/store/authStore"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set")
}

export const api = axios.create({
  baseURL: baseURL || "",
  withCredentials: false
})

export const apiBaseUrl = baseURL || ""

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token || localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearAuth()
      window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  }
)
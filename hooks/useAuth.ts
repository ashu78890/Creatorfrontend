import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuthStore, type AuthUser } from "@/store/authStore"

interface AuthResponse {
  success: boolean
  token: string
  user: AuthUser
  message?: string
}

export function useAuth() {
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>("/api/auth/login", payload)
      return data
    },
    onSuccess: (data) => {
      queryClient.clear()
      setAuth(data.token, data.user)
      toast.success("Logged in successfully")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed"
      toast.error(message)
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (payload: { name?: string; firstName?: string; lastName?: string; email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>("/api/auth/register", payload)
      return data
    },
    onSuccess: (data) => {
      queryClient.clear()
      setAuth(data.token, data.user)
      toast.success("Account created")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Registration failed"
      toast.error(message)
    }
  })

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    loginStatus: loginMutation,
    registerStatus: registerMutation
  }
}
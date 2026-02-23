import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface Payment {
  _id: string
  deal: { _id: string; brandName?: string; dealName?: string } | string
  amount: number
  received: number
  status: "pending" | "partially_paid" | "paid"
  dueDate?: string
  paidAt?: string
  notes?: string
}

interface PaymentsResponse {
  success: boolean
  data: Payment[]
}

interface PaymentResponse {
  success: boolean
  data: Payment
}

export function usePayments(params?: { dealId?: string; status?: string }) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const { data } = await api.get<PaymentsResponse>("/api/payments", { params })
      return data.data
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to load payments"
      toast.error(message)
    }
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      dealId: string
      amount: number
      received: number
      status?: "pending" | "partially_paid" | "paid"
      dueDate?: string
      paidAt?: string
      notes?: string
    }) => {
      const { data } = await api.post<PaymentResponse>("/api/payments", payload)
      return data.data
    },
    onSuccess: () => {
      toast.success("Payment recorded")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["deal"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to record payment"
      toast.error(message)
    }
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Payment> }) => {
      const { data } = await api.put<PaymentResponse>(`/api/payments/${id}`, payload)
      return data.data
    },
    onSuccess: () => {
      toast.success("Payment updated")
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update payment"
      toast.error(message)
    }
  })
}
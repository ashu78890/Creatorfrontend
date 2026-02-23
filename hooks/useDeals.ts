import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface Deliverable {
  type: string
  status: "pending" | "completed"
  dueDate: string
  platform?: string
}

export interface Deal {
  _id: string
  brandName: string
  brandHandle?: string
  platform: string
  dealName: string
  status: "active" | "completed" | "cancelled"
  paymentStatus: "pending" | "partially_paid" | "paid"
  amount: number
  amountReceived: number
  dueDate?: string
  createdDate?: string
  notes?: string
  deliverables: Deliverable[]
  daysLeft?: number | null
}

interface DealsResponse {
  success: boolean
  data: Deal[]
}

interface DealResponse {
  success: boolean
  data: Deal & { payments?: unknown[] }
}

interface DealRemindersResponse {
  success: boolean
  data: Array<{
    id: string
    type: "deliverable" | "payment"
    message: string
    dueDate: string
    status: "upcoming" | "overdue"
    daysLeft: number
  }>
}

export function useDeals(params?: {
  search?: string
  platform?: string
  paymentStatus?: string
  status?: string
}) {
  const query = useQuery<Deal[], Error>({
    queryKey: ["deals", params],
    queryFn: async () => {
      const { data } = await api.get<DealsResponse>("/api/deals", { params })
      return data.data
    }
  })

  useEffect(() => {
    if (!query.error) return
    const message = (query.error as any)?.response?.data?.message || "Failed to load deals"
    toast.error(message)
  }, [query.error])

  return query
}

export function useDeal(id?: string) {
  const query = useQuery<DealResponse["data"], Error>({
    queryKey: ["deal", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<DealResponse>(`/api/deals/${id}`)
      return data.data
    }
  })

  useEffect(() => {
    if (!query.error) return
    const message = (query.error as any)?.response?.data?.message || "Failed to load deal"
    toast.error(message)
  }, [query.error])

  return query
}

export function useDealReminders(id?: string) {
  const query = useQuery<DealRemindersResponse["data"], Error>({
    queryKey: ["deal-reminders", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<DealRemindersResponse>(`/api/deals/${id}/reminders`)
      return data.data
    }
  })

  useEffect(() => {
    if (!query.error) return
    const message = (query.error as any)?.response?.data?.message || "Failed to load reminders"
    toast.error(message)
  }, [query.error])

  return query
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Deal>) => {
      const { data } = await api.post<DealResponse>("/api/deals", payload)
      return data.data
    },
    onSuccess: () => {
      toast.success("Deal created")
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create deal"
      toast.error(message)
    }
  })
}

export function useUpdateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Deal> }) => {
      const { data } = await api.put<DealResponse>(`/api/deals/${id}`, payload)
      return data.data
    },
    onSuccess: (deal) => {
      toast.success("Deal updated")
      queryClient.invalidateQueries({ queryKey: ["deal", deal._id] })
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update deal"
      toast.error(message)
    }
  })
}

export function useDeleteDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{ success: boolean }>(`/api/deals/${id}`)
      return data
    },
    onSuccess: () => {
      toast.success("Deal deleted")
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete deal"
      toast.error(message)
    }
  })
}
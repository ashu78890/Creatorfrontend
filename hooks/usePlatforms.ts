import { type UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"

export interface PlatformItem {
  id: string
  label: string
}

interface PlatformsResponse {
  success: boolean
  data: {
    system: PlatformItem[]
    user: PlatformItem[]
    all: PlatformItem[]
  }
}

export type PlatformsData = PlatformsResponse["data"]

export function usePlatforms(): UseQueryResult<PlatformsData, Error> {
  const query = useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const { data } = await api.get<PlatformsResponse>("/api/platforms")
      return data.data
    }
  })

  if (query.isError && query.error) {
    const message = (query.error as any)?.response?.data?.message || "Failed to load platforms"
    toast.error(message)
  }

  return query
}

export function useAddCustomPlatform() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post<{ success: boolean; data: { platform: PlatformItem } }>(
        "/api/platforms",
        { name }
      )
      return data.data
    },
    onSuccess: (payload) => {
      queryClient.setQueryData<PlatformsResponse["data"]>(["platforms"], (current) => {
        if (!current) return current
        const nextUser = [...current.user, payload.platform]
        return {
          ...current,
          user: nextUser,
          all: [...current.system, ...nextUser]
        }
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to add platform"
      toast.error(message)
    }
  })
}

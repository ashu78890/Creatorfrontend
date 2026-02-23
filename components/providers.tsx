"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1
          },
          mutations: {
            retry: 0
          }
        }
      })
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
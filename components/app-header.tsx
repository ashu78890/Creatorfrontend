"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, Menu, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { type NotificationItem, useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications"
import { useNotificationStream } from "@/hooks/useNotificationStream"
import { api } from "@/lib/api"
import { formatCurrency } from "@/lib/currency"

interface AppHeaderProps {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<{ deals: any[]; payments: any[] }>({
    deals: [],
    payments: []
  })
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { data: notificationsData, isLoading } = useNotifications()
  const markAllRead = useMarkAllNotificationsRead()
  const markRead = useMarkNotificationRead()

  useNotificationStream()

  const displayName = user?.firstName || user?.name || "Creator"
  const initials = (displayName || "C").split(" ").map((p) => p[0]).join("").slice(0, 2)
  const notifications = notificationsData?.notifications || []
  const unreadCount = notificationsData?.unreadCount || 0
  const currency = user?.currency || "USD"

  const searchHint = useMemo(() => searchQuery.trim(), [searchQuery])
  const hasResults = searchResults.deals.length > 0 || searchResults.payments.length > 0
  const showHint = searchHint.length < 2
  const showEmpty = searchHint.length >= 2 && !searchLoading && !hasResults

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    if (searchHint.length < 2) {
      setSearchResults({ deals: [], payments: [] })
      return
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true)
        const { data } = await api.get("/api/search", { params: { q: searchHint } })
        setSearchResults(data.data)
      } catch {
        setSearchResults({ deals: [], payments: [] })
      } finally {
        setSearchLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchHint, searchOpen])

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.readAt) {
      markRead.mutate(item._id)
    }

    const metadata = item.metadata as { dealId?: string; paymentId?: string } | undefined

    if (metadata?.dealId) {
      router.push(`/deals/${metadata.dealId}`)
      return
    }

    if (metadata?.paymentId) {
      router.push("/payments")
      return
    }

    if (item.type === "billing_event") {
      router.push("/settings")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[60px] px-4 lg:px-6 bg-card/80 backdrop-blur-md border-b border-border/60">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Welcome back, {displayName}</h1>
          <p className="text-[13px] text-muted-foreground">Here&apos;s what&apos;s happening with your deals</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-[18px] w-[18px]" />
        </Button>

        {/* Notifications */}
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={(open) => {
            setNotificationsOpen(open)
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center ring-2 ring-card">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
            <DropdownMenuLabel className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
              <span className="text-[13px] font-semibold">Notifications</span>
              <button
                type="button"
                className="text-[11px] font-medium text-primary hover:text-primary/80 disabled:text-muted-foreground"
                onClick={() => markAllRead.mutate()}
                disabled={unreadCount === 0 || markAllRead.isPending}
              >
                Mark all read
              </button>
            </DropdownMenuLabel>
            <div className="max-h-[320px] overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-6 text-center text-[12px] text-muted-foreground">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-[12px] text-muted-foreground">No notifications yet</div>
              ) : (
                notifications.map((item) => (
                  <DropdownMenuItem
                    key={item._id}
                    className={
                      item.readAt
                        ? "flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer focus:bg-muted/60"
                        : "flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer bg-muted/40 focus:bg-muted/60"
                    }
                    onClick={() => {
                      handleNotificationClick(item)
                    }}
                  >
                    <span className={item.readAt ? "text-[13px] font-medium" : "text-[13px] font-semibold"}>
                      {item.title}
                    </span>
                    <span className={item.readAt ? "text-[12px] text-muted-foreground" : "text-[12px] text-foreground/80"}>
                      {item.message}
                    </span>
                    <span className="text-[11px] text-muted-foreground/70">
                      {new Date(item.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1.5 hidden sm:block" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 hover:bg-muted/60">
              <Avatar className="h-7 w-7 ring-1 ring-border">
                <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-[13px] font-medium">{displayName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1" sideOffset={8}>
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="text-[13px] font-semibold">{displayName}</div>
              <div className="text-[12px] text-muted-foreground font-normal">{user?.email || ""}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="text-[13px] px-2 py-1.5 cursor-pointer"
              onClick={() => router.push("/settings#profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[13px] px-2 py-1.5 cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-[13px] px-2 py-1.5 cursor-pointer"
              onClick={() => router.push("/settings#billing")}
            >
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="text-[13px] px-2 py-1.5 cursor-pointer text-destructive focus:text-destructive"
              onClick={() => {
                queryClient.clear()
                clearAuth()
                router.replace("/")
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search deals, payments..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {showHint && (
            <CommandGroup heading="Search">
              <CommandItem disabled>Type at least 2 characters to search.</CommandItem>
            </CommandGroup>
          )}
          {searchLoading && (
            <CommandGroup heading="Search">
              <CommandItem disabled>Searching...</CommandItem>
            </CommandGroup>
          )}
          {showEmpty && (
            <CommandGroup heading="Search">
              <CommandItem disabled>No results found.</CommandItem>
            </CommandGroup>
          )}
          {searchResults.deals.length > 0 && (
            <CommandGroup heading="Deals">
              {searchResults.deals.map((deal) => (
                <CommandItem
                  key={deal._id}
                  onSelect={() => {
                    setSearchOpen(false)
                    router.push(`/deals/${deal._id}`)
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">{deal.brandName}</span>
                    <span className="text-[12px] text-muted-foreground">
                      {deal.dealName} • {formatCurrency(deal.amount || 0, currency)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {searchResults.payments.length > 0 && (
            <CommandGroup heading="Payments">
              {searchResults.payments.map((payment) => (
                <CommandItem
                  key={payment._id}
                  onSelect={() => {
                    setSearchOpen(false)
                    router.push("/payments")
                  }}
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">
                      {(payment.deal?.brandName || "Payment")}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {payment.deal?.dealName || ""} • {formatCurrency(payment.amount || 0, currency)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {searchHint.length >= 2 && (
            <CommandGroup heading="Actions">
              <CommandItem
                disabled={searchLoading}
                onSelect={() => {
                  setSearchOpen(false)
                  router.push(`/deals?search=${encodeURIComponent(searchHint)}`)
                }}
              >
                View all results in Deals
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </header>
  )
}

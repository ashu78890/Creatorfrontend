"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddDealModal } from "@/components/add-deal-modal"
import {
  Plus,
  Search,
  Instagram,
  Youtube,
  Grid3X3,
  List,
  AlertCircle,
  MoreVertical,
  Eye,
  Pencil,
  ArrowUpRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDeals, useDeleteDeal, type Deal } from "@/hooks/useDeals"
import { useBillingStatus } from "@/hooks/useBilling"
import { usePlatforms } from "@/hooks/usePlatforms"
import { toast } from "sonner"
import { EditDealModal } from "@/components/edit-deal-modal"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency } from "@/lib/currency"

export default function DealsPage() {
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editDeal, setEditDeal] = useState<Deal | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Deal | null>(null)
  const normalizedSearch = searchQuery.trim()
  const { data: deals = [], isLoading, isFetching } = useDeals({
    search: normalizedSearch || undefined,
    platform: platformFilter,
    paymentStatus: statusFilter
  })
  const { data: allDeals = [] } = useDeals()
  const deleteDeal = useDeleteDeal()
  const { data: billing } = useBillingStatus()
  const { data: platformsData } = usePlatforms()
  const currency = useAuthStore((state) => state.user?.currency || "USD")
  const isPro = billing?.pricingPlan === "pro"
  const isFiltered = normalizedSearch.length > 0 || platformFilter !== "all" || statusFilter !== "all"
  const totalDealCount = isFiltered ? allDeals.length : deals.length
  const dealLimitReached = !isPro && totalDealCount >= 3
  const showListSkeleton = isLoading || isFetching
  const emptyMessage = isFiltered
    ? "No deals match your filters."
    : "No deals yet. Add your first deal to get started."

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteDeal.mutateAsync(deleteTarget._id)
    setDeleteTarget(null)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "youtube":
        return <Youtube className="w-4 h-4" />
      default:
        return <Instagram className="w-4 h-4" />
    }
  }

  const platformOptions = platformsData?.all?.length
    ? platformsData.all
    : [
        { id: "instagram", label: "Instagram" },
        { id: "youtube", label: "YouTube" },
        { id: "tiktok", label: "TikTok" },
        { id: "other", label: "Other" }
      ]

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] font-medium">
            Paid
          </Badge>
        )
      case "partially_paid":
        return (
          <Badge variant="outline" className="bg-warning/15 text-warning-foreground border-warning/25 text-[10px] font-medium">
            Partial
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-muted/60 text-muted-foreground border-border text-[10px] font-medium">
            Pending
          </Badge>
        )
    }
  }

  const getUrgencyIndicator = (daysLeft: number) => {
    if (daysLeft <= 2) {
      return (
        <div className="flex items-center gap-1 text-destructive text-[12px] font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{daysLeft}d left</span>
        </div>
      )
    }
    if (daysLeft <= 5) {
      return (
        <span className="text-[12px] text-warning-foreground font-medium">{daysLeft}d left</span>
      )
    }
    return <span className="text-[12px] text-muted-foreground">{daysLeft}d left</span>
  }

  const handleAddDeal = () => {
    if (dealLimitReached) {
      toast.error("Free plan includes up to 3 deals. Upgrade to add more.")
      return
    }
    setShowAddDeal(true)
  }

  useEffect(() => {
    const param = searchParams.get("search") || ""
    if (param !== searchQuery) {
      setSearchQuery(param)
    }
  }, [searchParams, searchQuery])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    const normalized = value.trim()
    const params = new URLSearchParams(searchParams.toString())
    if (normalized) {
      params.set("search", normalized)
    } else {
      params.delete("search")
    }

    const query = params.toString()
    router.replace(query ? `/deals?${query}` : "/deals", { scroll: false })
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Deals</h1>
          <p className="text-[13px] text-muted-foreground">Manage all your brand collaborations</p>
        </div>
        <Button onClick={handleAddDeal} className="shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9 text-[13px] border-border/60 focus-visible:border-primary/50"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-36 h-9 text-[13px] border-border/60">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[13px]">All Platforms</SelectItem>
            {platformOptions.map((option) => (
              <SelectItem key={option.id} value={option.id} className="text-[13px]">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32 h-9 text-[13px] border-border/60">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[13px]">All Status</SelectItem>
            <SelectItem value="pending" className="text-[13px]">Pending</SelectItem>
            <SelectItem value="partially_paid" className="text-[13px]">Partial</SelectItem>
            <SelectItem value="paid" className="text-[13px]">Paid</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center border border-border/60 rounded-md overflow-hidden h-9">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "px-2.5 h-full transition-all duration-150",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "px-2.5 h-full transition-all duration-150",
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deals Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {showListSkeleton
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={`deal-skeleton-${idx}`} className="h-44" />
              ))
            : deals.length === 0
              ? (
                <Card className="border-border/60 shadow-sm sm:col-span-2 lg:col-span-3">
                  <CardContent className="py-12 text-center text-[13px] text-muted-foreground">
                    {emptyMessage}
                  </CardContent>
                </Card>
              )
              : deals.map((deal) => (
            <Card
              key={deal._id}
              className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
            >
              <CardContent className="relative p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-[15px] border border-primary/10">
                      {deal.brandName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{deal.brandName}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {deal.brandHandle}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem asChild className="text-[13px]">
                        <Link href={`/deals/${deal._id}`}>
                          <Eye className="w-3.5 h-3.5 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[13px]"
                        onSelect={() => setEditDeal(deal)}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[13px] text-destructive focus:text-destructive"
                        onSelect={() => setDeleteTarget(deal)}
                      >
                        <AlertCircle className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {getPlatformIcon(deal.platform)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {deal.deliverables.map((d) => (
                      <Badge key={`${deal._id}-${d.type}`} variant="secondary" className="text-[10px] font-medium bg-muted/60 text-muted-foreground px-1.5 py-0">
                        {d.type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <p className="text-[16px] font-bold text-foreground tracking-tight">
                      {formatCurrency(deal.amount, currency)}
                    </p>
                    {getPaymentBadge(deal.paymentStatus)}
                  </div>
                  {getUrgencyIndicator(deal.daysLeft || 0)}
                </div>

                <Link 
                  href={`/deals/${deal._id}`}
                  className="absolute inset-0 rounded-xl z-0"
                  aria-label={`View ${deal.brandName} deal`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {showListSkeleton
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={`deal-row-skeleton-${idx}`} className="h-20" />
              ))
            : deals.length === 0
              ? (
                <Card className="border-border/60 shadow-sm">
                  <CardContent className="py-12 text-center text-[13px] text-muted-foreground">
                    {emptyMessage}
                  </CardContent>
                </Card>
              )
              : deals.map((deal) => (
            <Card key={deal._id} className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-[13px] border border-primary/10">
                    {deal.brandName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{deal.brandName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-muted-foreground">{getPlatformIcon(deal.platform)}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {deal.deliverables.map((d) => d.type).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[14px] font-semibold">{formatCurrency(deal.amount, currency)}</p>
                    {getPaymentBadge(deal.paymentStatus)}
                  </div>
                  <div className="hidden md:block w-20 text-right">
                    {getUrgencyIndicator(deal.daysLeft || 0)}
                  </div>
                  <Link 
                    href={`/deals/${deal._id}`}
                    className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddDealModal open={showAddDeal} onOpenChange={setShowAddDeal} />
      <EditDealModal
        open={!!editDeal}
        onOpenChange={(open) => {
          if (!open) setEditDeal(null)
        }}
        deal={editDeal}
      />
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the deal and its payments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteDeal.isPending}
            >
              {deleteDeal.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

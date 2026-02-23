"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/stat-card"
import { AddDealModal } from "@/components/add-deal-modal"
import { useDashboard } from "@/hooks/useDashboard"
import { useBillingStatus } from "@/hooks/useBilling"
import { useDeals } from "@/hooks/useDeals"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency } from "@/lib/currency"
import { toast } from "sonner"
import {
  Handshake,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  ArrowRight,
  Instagram,
  Youtube,
  AlertCircle,
  ChevronRight,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAddDeal, setShowAddDeal] = useState(false)
  const { data, isLoading } = useDashboard()
  const { data: billing, refetch: refetchBilling } = useBillingStatus()
  const { data: allDeals = [] } = useDeals()
  const currency = useAuthStore((state) => state.user?.currency || "USD")
  const isPro = billing?.pricingPlan === "pro"
  const dealLimitReached = !isPro && allDeals.length >= 3

  const paymentStatus = searchParams.get("payment")

  useEffect(() => {
    if (!paymentStatus) return

    if (paymentStatus === "success") {
      toast.success("Payment successful. Welcome to Pro!")
      refetchBilling()
    }

    if (paymentStatus === "cancelled") {
      toast.error("Payment cancelled. You can try again anytime.")
    }

    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete("payment")
    router.replace(nextUrl.pathname)
  }, [paymentStatus, refetchBilling, router])

  const stats = data?.stats
  const upcomingDeadlines = data?.upcomingDeadlines || []
  const recentDeals = data?.recentDeals || []

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

  const getUrgencyStyles = (daysLeft: number) => {
    if (daysLeft <= 2) return "text-destructive bg-destructive/10 border-destructive/20"
    if (daysLeft <= 5) return "text-warning-foreground bg-warning/15 border-warning/25"
    return "text-muted-foreground bg-muted/60 border-muted"
  }

  const handleAddDeal = () => {
    if (dealLimitReached) {
      toast.error("Free plan includes up to 3 deals. Upgrade to add more.")
      return
    }
    setShowAddDeal(true)
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Deals"
          value={isLoading ? "..." : stats?.activeDeals ?? 0}
          icon={Handshake}
          variant="primary"
          trend={stats?.trends?.activeDeals}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={isLoading ? "..." : stats?.upcomingDeadlines ?? 0}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Pending Payments"
          value={isLoading ? "..." : stats?.pendingPayments ?? 0}
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="Total Earnings"
          value={isLoading ? "..." : formatCurrency(stats?.totalEarnings ?? 0, currency)}
          icon={DollarSign}
          variant="success"
          trend={stats?.trends?.totalEarnings}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          onClick={handleAddDeal}
          className="shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Deal
        </Button>
        <Link href="/deals">
          <Button variant="outline" className="border-border/60 hover:border-border hover:bg-muted/50 bg-transparent">
            View All Deals
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <Badge variant="outline" className="text-[10px] font-medium border border-border/60 bg-muted/40">
            Plan: {billing?.pricingPlan === "pro" ? "Pro" : "Free"}
          </Badge>
          <span>Status: {billing?.subscriptionStatus || "inactive"}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upcoming Deadlines */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Upcoming Deadlines</CardTitle>
            <Link href="/calendar" className="text-[13px] text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              View Calendar
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-muted-foreground">
                No upcoming deadlines. You are all caught up.
              </div>
            ) : upcomingDeadlines.map((deadline) => {
              const daysLeft = deadline.daysLeft ?? 0
              return (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-card flex items-center justify-center border border-border/60 shadow-sm text-muted-foreground">
                    {getPlatformIcon(deadline.platform)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">{deadline.brand}</p>
                    <p className="text-[12px] text-muted-foreground">{deadline.deliverable}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {daysLeft <= 2 && (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <Badge variant="outline" className={`text-[11px] font-medium border ${getUrgencyStyles(daysLeft)}`}>
                    {daysLeft === 0
                      ? "Due today"
                      : daysLeft === 1
                        ? "Due tomorrow"
                        : `${daysLeft} days left`}
                  </Badge>
                </div>
              </div>
            )})}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Recent Deals</CardTitle>
            <Link href="/deals" className="text-[13px] text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentDeals.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-muted-foreground">
                No deals yet. Create your first deal to see activity here.
              </div>
            ) : recentDeals.map((deal) => (
              <Link
                key={deal._id}
                href={`/deals/${deal._id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-semibold text-[13px] border border-primary/10">
                    {deal.brandName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{deal.brandName}</p>
                    <div className="flex items-center gap-1.5">
                      {deal.deliverables?.map((d, i) => (
                        <span key={`${deal._id}-${d.type}-${i}`} className="text-[11px] text-muted-foreground">
                          {d.type}{i < (deal.deliverables?.length || 0) - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-foreground">{formatCurrency(deal.amount, currency)}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-medium border ${
                      deal.status === "active"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning-foreground border-warning/20"
                    }`}
                  >
                    {deal.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <AddDealModal open={showAddDeal} onOpenChange={setShowAddDeal} />
    </div>
  )
}

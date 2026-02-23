"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { TrendingUp, TrendingDown, Lightbulb, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/hooks/useAnalytics"
import { useBillingStatus, useCreateCheckoutSession } from "@/hooks/useBilling"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency, formatCurrencyCompact } from "@/lib/currency"

const buildTrend = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) {
      return { change: "0%", positive: true }
    }
    return { change: "New", positive: true }
  }
  const diff = ((current - previous) / Math.abs(previous)) * 100
  const rounded = Math.round(diff)
  return {
    change: `${rounded >= 0 ? "+" : ""}${rounded}%`,
    positive: rounded >= 0
  }
}

export default function AnalyticsPage() {
  const { data: billing, isLoading: billingLoading } = useBillingStatus()
  const checkout = useCreateCheckoutSession()
  const isPro = billing?.pricingPlan === "pro"
  const { data, isLoading } = useAnalytics(isPro)
  const currency = useAuthStore((state) => state.user?.currency || "USD")

  if (billingLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-[13px] text-muted-foreground">Loading your plan...</p>
        </div>
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-[13px] text-muted-foreground">Insights into your creator business</p>
        </div>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <p className="text-[14px] font-semibold text-foreground">Analytics is a Pro feature</p>
            </div>
            <p className="text-[13px] text-muted-foreground">
              Upgrade to unlock advanced insights, performance trends, and platform breakdowns.
            </p>
            <Button
              onClick={() => checkout.mutate()}
              disabled={checkout.isPending}
              className="w-fit"
            >
              {checkout.isPending ? "Redirecting..." : "Upgrade to Pro"}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-60 mt-2" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const monthlyDeals = data?.monthlyDeals || []
  const earningsData = data?.earningsData || []
  const paymentStatus = (data?.paymentStatus || []).map((p) => ({
    ...p,
    color:
      p.name === "Paid"
        ? "#22c55e"
        : p.name === "Partial"
          ? "#f59e0b"
          : "#94a3b8"
  }))
  const platformBreakdown = (data?.platformBreakdown || []).map((p, idx) => ({
    ...p,
    color: ["#8b5cf6", "#ef4444", "#06b6d4", "#22c55e", "#f97316"][idx % 5]
  }))
  const totalDeals = data?.overviewStats.totalDeals || 0
  const totalEarnings = data?.overviewStats.totalEarnings || 0
  const avgDealValue = data?.overviewStats.avgDealValue || 0
  const hasAnalyticsData = totalDeals > 0 || monthlyDeals.length > 0 || earningsData.length > 0

  const lastDeals = monthlyDeals[monthlyDeals.length - 1]?.deals || 0
  const prevDeals = monthlyDeals[monthlyDeals.length - 2]?.deals || 0
  const dealsTrend = buildTrend(lastDeals, prevDeals)

  const lastEarned = earningsData[earningsData.length - 1]?.earned || 0
  const prevEarned = earningsData[earningsData.length - 2]?.earned || 0
  const earningsTrend = buildTrend(lastEarned, prevEarned)

  const lastAvg = lastDeals > 0 ? lastEarned / lastDeals : 0
  const prevAvg = prevDeals > 0 ? prevEarned / prevDeals : 0
  const avgTrend = buildTrend(lastAvg, prevAvg)

  const pendingAmount = paymentStatus
    .filter((status) => status.name !== "Paid")
    .reduce((sum, status) => sum + (status.value || 0), 0)

  const highlights = data?.highlights || []

  const overviewStats = [
    { label: "Total Deals", value: String(totalDeals), change: dealsTrend.change, positive: dealsTrend.positive },
    { label: "Total Earnings", value: formatCurrency(totalEarnings, currency), change: earningsTrend.change, positive: earningsTrend.positive },
    { label: "Avg. Deal Value", value: formatCurrency(avgDealValue, currency), change: avgTrend.change, positive: avgTrend.positive },
    { label: "Pending Amount", value: formatCurrency(pendingAmount, currency), change: null, positive: true },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics</h1>
        <p className="text-[13px] text-muted-foreground">Insights into your creator business</p>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                </div>
                {stat.change ? (
                  <div className={cn(
                    "flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded",
                    stat.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                  )}>
                    {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded text-muted-foreground bg-muted/50">
                    —
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasAnalyticsData ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-12 text-center text-[13px] text-muted-foreground">
            No analytics data yet. Add deals and payments to unlock insights.
          </CardContent>
        </Card>
      ) : (
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Deals Per Month */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Deals Per Month</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                deals: {
                  label: "Deals",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[220px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDeals} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                  <XAxis dataKey="month" className="text-[11px]" axisLine={false} tickLine={false} />
                  <YAxis className="text-[11px]" axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="deals" fill="var(--color-deals)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Earnings Trend */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                earned: {
                  label: "Earned",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[220px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
                  <XAxis dataKey="month" className="text-[11px]" axisLine={false} tickLine={false} />
                  <YAxis
                    className="text-[11px]"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrencyCompact(value, currency)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="earned"
                    stroke="var(--color-earned)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-earned)", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center">
              <ChartContainer
                config={{
                  paid: { label: "Paid", color: "#22c55e" },
                  pending: { label: "Pending", color: "#94a3b8" },
                  partial: { label: "Partial", color: "#f59e0b" },
                }}
                className="h-[180px] w-[180px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {paymentStatus.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="flex justify-center gap-5 mt-4">
              {paymentStatus.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-[12px] text-muted-foreground font-medium">{status.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {platformBreakdown.map((platform) => (
                <div key={platform.platform}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium">{platform.platform}</span>
                    <span className="text-[12px] text-muted-foreground font-medium">{platform.deals} deals</span>
                  </div>
                  <div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${totalDeals ? (platform.deals / totalDeals) * 100 : 0}%`,
                        backgroundColor: platform.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Highlights */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-warning/15 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-warning-foreground" />
            </div>
            Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-3 gap-3">
            {highlights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors group cursor-pointer",
                  insight.type === "warning"
                    ? "bg-warning/5 border-warning/15 hover:bg-warning/10"
                    : insight.type === "success"
                      ? "bg-success/5 border-success/15 hover:bg-success/10"
                      : "bg-primary/5 border-primary/15 hover:bg-primary/10"
                )}
              >
                <div className="flex items-start justify-between">
                  <p className="text-[13px] leading-relaxed">{insight.text}</p>
                  <ArrowUpRight className={cn(
                    "w-4 h-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
                    insight.type === "warning"
                      ? "text-warning-foreground"
                      : insight.type === "success"
                        ? "text-success"
                        : "text-primary"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

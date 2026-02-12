"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const monthlyDeals = [
  { month: "Sep", deals: 3 },
  { month: "Oct", deals: 5 },
  { month: "Nov", deals: 4 },
  { month: "Dec", deals: 7 },
  { month: "Jan", deals: 6 },
  { month: "Feb", deals: 8 },
]

const earningsData = [
  { month: "Sep", earned: 4500 },
  { month: "Oct", earned: 7200 },
  { month: "Nov", earned: 6100 },
  { month: "Dec", earned: 9800 },
  { month: "Jan", earned: 8500 },
  { month: "Feb", earned: 12450 },
]

const paymentStatus = [
  { name: "Paid", value: 18200, color: "#22c55e" },
  { name: "Pending", value: 9500, color: "#94a3b8" },
  { name: "Partial", value: 4300, color: "#f59e0b" },
]

const platformBreakdown = [
  { platform: "Instagram", deals: 15, color: "#8b5cf6" },
  { platform: "YouTube", deals: 8, color: "#ef4444" },
  { platform: "TikTok", deals: 3, color: "#06b6d4" },
]

const insights = [
  {
    id: 1,
    text: "Most of your delays happen with Instagram brands",
    type: "warning",
  },
  {
    id: 2,
    text: "Your YouTube deals have a 100% on-time completion rate",
    type: "success",
  },
  {
    id: 3,
    text: "Consider raising your rates - you're consistently overbooked",
    type: "info",
  },
]

const overviewStats = [
  { label: "Total Deals", value: "26", change: "+23%", positive: true },
  { label: "Total Earnings", value: "$48,550", change: "+31%", positive: true },
  { label: "Avg. Deal Value", value: "$1,867", change: "+12%", positive: true },
  { label: "On-Time Delivery", value: "92%", change: "-3%", positive: false },
]

export default function AnalyticsPage() {
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
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded",
                  stat.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
                )}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
                  <YAxis className="text-[11px]" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
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
                        width: `${(platform.deals / 26) * 100}%`,
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

      {/* Insights */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-warning/15 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-warning-foreground" />
            </div>
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid sm:grid-cols-3 gap-3">
            {insights.map((insight) => (
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

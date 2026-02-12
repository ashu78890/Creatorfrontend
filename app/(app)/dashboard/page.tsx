"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/stat-card"
import { AddDealModal } from "@/components/add-deal-modal"
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

const upcomingDeadlines = [
  {
    id: 1,
    brand: "Nike",
    deliverable: "Instagram Reel",
    dueDate: "2026-02-06",
    daysLeft: 2,
    platform: "instagram",
  },
  {
    id: 2,
    brand: "Spotify",
    deliverable: "YouTube Video",
    dueDate: "2026-02-08",
    daysLeft: 4,
    platform: "youtube",
  },
  {
    id: 3,
    brand: "Adidas",
    deliverable: "Instagram Story",
    dueDate: "2026-02-10",
    daysLeft: 6,
    platform: "instagram",
  },
  {
    id: 4,
    brand: "Adobe",
    deliverable: "Instagram Post",
    dueDate: "2026-02-12",
    daysLeft: 8,
    platform: "instagram",
  },
]

const recentDeals = [
  {
    id: 1,
    brand: "Nike",
    amount: 2500,
    status: "active",
    deliverables: ["Reel", "Story"],
  },
  {
    id: 2,
    brand: "Spotify",
    amount: 4000,
    status: "active",
    deliverables: ["Video"],
  },
  {
    id: 3,
    brand: "Adidas",
    amount: 1800,
    status: "pending",
    deliverables: ["Story", "Post"],
  },
]

export default function DashboardPage() {
  const [showAddDeal, setShowAddDeal] = useState(false)

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

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Deals"
          value={8}
          icon={Handshake}
          variant="primary"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={4}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Pending Payments"
          value={3}
          icon={CreditCard}
          variant="default"
        />
        <StatCard
          title="Total Earnings"
          value="$12,450"
          icon={DollarSign}
          variant="success"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        <Button onClick={() => setShowAddDeal(true)} className="shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Add New Deal
        </Button>
        <Link href="/deals">
          <Button variant="outline" className="border-border/60 hover:border-border hover:bg-muted/50 bg-transparent">
            View All Deals
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
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
            {upcomingDeadlines.map((deadline) => (
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
                  {deadline.daysLeft <= 2 && (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                  <Badge variant="outline" className={`text-[11px] font-medium border ${getUrgencyStyles(deadline.daysLeft)}`}>
                    {deadline.daysLeft === 0
                      ? "Due today"
                      : deadline.daysLeft === 1
                        ? "Due tomorrow"
                        : `${deadline.daysLeft} days left`}
                  </Badge>
                </div>
              </div>
            ))}
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
            {recentDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-semibold text-[13px] border border-primary/10">
                    {deal.brand.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{deal.brand}</p>
                    <div className="flex items-center gap-1.5">
                      {deal.deliverables.map((d, i) => (
                        <span key={d} className="text-[11px] text-muted-foreground">
                          {d}{i < deal.deliverables.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-foreground">${deal.amount.toLocaleString()}</p>
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

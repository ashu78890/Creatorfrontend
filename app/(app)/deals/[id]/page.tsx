"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Instagram,
  Calendar,
  DollarSign,
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  Pencil,
} from "lucide-react"

const dealData = {
  id: 1,
  brand: "Nike",
  brandHandle: "@nike",
  platform: "instagram",
  dealName: "Summer Running Campaign 2026",
  createdDate: "2026-01-15",
  dueDate: "2026-02-06",
  daysLeft: 2,
  amount: 2500,
  amountReceived: 1000,
  paymentStatus: "partially_paid",
  status: "active",
  notes: "Focus on the new Air Max line. Make sure to feature the summer colors prominently.",
  deliverables: [
    { id: 1, type: "Reel", status: "completed", dueDate: "2026-02-04" },
    { id: 2, type: "Story", status: "pending", dueDate: "2026-02-06" },
    { id: 3, type: "Post", status: "pending", dueDate: "2026-02-06" },
  ],
}

const reminders = [
  { id: 1, message: "Story due in 24 hours", type: "deadline", urgent: true },
  { id: 2, message: "Payment pending for 7 days", type: "payment", urgent: false },
  { id: 3, message: "Post content to be approved", type: "approval", urgent: false },
]

export default function DealDetailPage() {
  const [deliverables, setDeliverables] = useState(dealData.deliverables)

  const toggleDeliverable = (id: number) => {
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "completed" ? "pending" : "completed" }
          : d
      )
    )
  }

  const completedCount = deliverables.filter((d) => d.status === "completed").length
  const progressPercentage = (completedCount / deliverables.length) * 100
  const paymentPercentage = (dealData.amountReceived / dealData.amount) * 100

  const getPaymentStatusBadge = () => {
    switch (dealData.paymentStatus) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px] font-medium">
            Fully Paid
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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/deals">
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/60">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-xl font-bold text-foreground tracking-tight">{dealData.brand}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                Active
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground">{dealData.dealName}</p>
          </div>
        </div>
        <Button variant="outline" className="h-9 text-[13px] border-border/60 hover:border-border hover:bg-muted/50 bg-transparent">
          <Pencil className="w-3.5 h-3.5 mr-2" />
          Edit Deal
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Brand Overview */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight">Brand Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-xl border border-primary/10">
                  {dealData.brand.charAt(0)}
                </div>
                <div>
                  <p className="text-[16px] font-semibold">{dealData.brand}</p>
                  <p className="text-[13px] text-muted-foreground">{dealData.brandHandle}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[12px] text-muted-foreground">Instagram</span>
                  </div>
                </div>
              </div>
              {dealData.notes && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-[13px] text-foreground leading-relaxed">{dealData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deal Timeline */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight">Deal Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-muted-foreground">Progress</span>
                  <span className="text-[12px] font-medium">
                    {completedCount} of {deliverables.length} completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1.5" />
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="w-9 h-9 rounded-md bg-card flex items-center justify-center border border-border/60">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Created</p>
                      <p className="text-[13px] font-medium">
                        {new Date(dealData.createdDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="w-9 h-9 rounded-md bg-card flex items-center justify-center border border-border/60">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Due Date</p>
                      <p className="text-[13px] font-medium">
                        {new Date(dealData.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables Checklist */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight">Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={deliverable.status === "completed"}
                      onCheckedChange={() => toggleDeliverable(deliverable.id)}
                      className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />
                    <div>
                      <p
                        className={`text-[13px] ${
                          deliverable.status === "completed"
                            ? "text-muted-foreground line-through"
                            : "font-medium text-foreground"
                        }`}
                      >
                        {deliverable.type}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Due{" "}
                        {new Date(deliverable.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {deliverable.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Payment Tracker */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center justify-between">
                <span>Payment</span>
                {getPaymentStatusBadge()}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="text-center py-3">
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  ${dealData.amountReceived.toLocaleString()}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  of ${dealData.amount.toLocaleString()} received
                </p>
              </div>
              <Progress value={paymentPercentage} className="h-1.5" />
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  ${(dealData.amount - dealData.amountReceived).toLocaleString()}
                </span>
              </div>
              <Button variant="outline" className="w-full h-9 text-[13px] border-border/60 hover:border-border hover:bg-muted/50 bg-transparent">
                <DollarSign className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-primary" />
                </div>
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-lg border ${
                    reminder.urgent
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-muted/30 border-border/60"
                  }`}
                >
                  <p
                    className={`text-[12px] ${
                      reminder.urgent ? "text-destructive font-medium" : "text-foreground"
                    }`}
                  >
                    {reminder.message}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

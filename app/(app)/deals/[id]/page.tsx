"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeal, useDealReminders, useDeleteDeal, useUpdateDeal } from "@/hooks/useDeals"
import { useCreatePayment } from "@/hooks/usePayments"
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
import { EditDealModal } from "@/components/edit-deal-modal"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency } from "@/lib/currency"
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

export default function DealDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const dealId = params?.id
  const { data: deal, isLoading } = useDeal(dealId)
  const { data: reminders = [], refetch: refetchReminders } = useDealReminders(dealId)
  const updateDeal = useUpdateDeal()
  const createPayment = useCreatePayment()
  const deleteDeal = useDeleteDeal()
  const currency = useAuthStore((state) => state.user?.currency || "USD")
  const [deliverables, setDeliverables] = useState(deal?.deliverables || [])
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    setDeliverables(deal?.deliverables || [])
  }, [deal])

  const toggleDeliverable = (index: number) => {
    const next = deliverables.map((d, i) =>
      i === index ? { ...d, status: d.status === "completed" ? "pending" : "completed" } : d
    )
    setDeliverables(next)
    if (dealId) {
      updateDeal.mutate(
        { id: dealId, payload: { deliverables: next } },
        { onSuccess: () => refetchReminders() }
      )
    }
  }

  const completedCount = deliverables.filter((d) => d.status === "completed").length
  const progressPercentage = deliverables.length > 0 ? (completedCount / deliverables.length) * 100 : 0
  const amount = deal?.amount || 0
  const amountReceived = deal?.amountReceived || 0
  const paymentPercentage = amount > 0 ? (amountReceived / amount) * 100 : 0

  const remainingPayment = useMemo(() => Math.max(amount - amountReceived, 0), [amount, amountReceived])

  const getPaymentStatusBadge = () => {
    switch (deal?.paymentStatus) {
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

  const getReminderStyles = (status: "upcoming" | "overdue") => {
    if (status === "overdue") return "text-destructive bg-destructive/10 border-destructive/20"
    return "text-warning-foreground bg-warning/15 border-warning/25"
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-44" />
            <Skeleton className="h-40" />
            <Skeleton className="h-56" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-52" />
            <Skeleton className="h-44" />
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-bold text-foreground tracking-tight">{deal?.brandName}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium">
                {deal?.status || "active"}
              </Badge>
            </div>
            <p className="text-[13px] text-muted-foreground">{deal?.dealName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 text-[13px] border-border/60 hover:border-border hover:bg-muted/50 bg-transparent"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="w-3.5 h-3.5 mr-2" />
            Edit Deal
          </Button>
          <Button
            variant="outline"
            className="h-9 text-[13px] border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
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
                  {deal?.brandName?.charAt(0)}
                </div>
                <div>
                  <p className="text-[16px] font-semibold">{deal?.brandName}</p>
                  <p className="text-[13px] text-muted-foreground">{deal?.brandHandle}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[12px] text-muted-foreground">{deal?.platform}</span>
                  </div>
                </div>
              </div>
              {deal?.notes && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-[13px] text-foreground leading-relaxed">{deal.notes}</p>
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
                        {deal?.createdDate ? new Date(deal.createdDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) : ""}
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
                        {deal?.dueDate ? new Date(deal.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }) : ""}
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
              {deliverables.map((deliverable, index) => (
                <div
                  key={`${deliverable.type}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={deliverable.status === "completed"}
                      onCheckedChange={() => toggleDeliverable(index)}
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
                        {deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        }) : ""}
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
                  {formatCurrency(amountReceived, currency)}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  of {formatCurrency(amount, currency)} received
                </p>
              </div>
              <Progress value={paymentPercentage} className="h-1.5" />
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">
                  {formatCurrency(remainingPayment, currency)}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full h-9 text-[13px] border-border/60 hover:border-border hover:bg-muted/50 bg-transparent"
                onClick={() => {
                  if (!deal?._id || remainingPayment <= 0) return
                  createPayment.mutate({
                    dealId: deal._id,
                    amount: remainingPayment,
                    received: remainingPayment,
                    status: "paid",
                    dueDate: deal.dueDate
                  })
                }}
                disabled={createPayment.isPending || remainingPayment <= 0}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </CardContent>
          </Card>

          {/* Reminders */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-[15px] font-semibold tracking-tight">Reminders</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {reminders.length === 0 ? (
                <div className="py-6 text-center text-[13px] text-muted-foreground">
                  No reminders for this deal.
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-card flex items-center justify-center border border-border/60 text-muted-foreground">
                        {reminder.type === "payment" ? (
                          <DollarSign className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{reminder.message}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(reminder.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-medium border ${getReminderStyles(reminder.status)}`}>
                      {reminder.status === "overdue" ? "Overdue" : "Upcoming"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      <EditDealModal open={editOpen} onOpenChange={setEditOpen} deal={deal || null} />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
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
              onClick={async () => {
                if (!deal?._id) return
                await deleteDeal.mutateAsync(deal._id)
                setDeleteOpen(false)
                router.push("/deals")
              }}
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

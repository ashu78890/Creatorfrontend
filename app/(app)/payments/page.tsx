"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DollarSign, TrendingUp, Clock, CheckCircle2, Download, ArrowUpRight } from "lucide-react"
import { usePayments } from "@/hooks/usePayments"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { formatCurrency } from "@/lib/currency"

export default function PaymentsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const { data: payments = [], isLoading } = usePayments()
  const currency = useAuthStore((state) => state.user?.currency || "USD")
  const totalPaid = payments.reduce((acc, p) => acc + p.received, 0)
  const totalPending = payments.reduce((acc, p) => acc + (p.amount - p.received), 0)
  const totalExpected = payments.reduce((acc, p) => acc + p.amount, 0)

  const getStatusBadge = (status: string) => {
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

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await api.get("/api/payments/export", { responseType: "blob" })
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "payments-report.csv"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to export payments"
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Payments</h1>
          <p className="text-[13px] text-muted-foreground">Track your earnings and pending payments</p>
        </div>
        <Button
          variant="outline"
          className="border-border/60 hover:border-border hover:bg-muted/50 h-9 bg-transparent"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export Report"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earned"
          value={isLoading ? "..." : formatCurrency(totalPaid, currency)}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Pending"
          value={isLoading ? "..." : formatCurrency(totalPending, currency)}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Expected Total"
          value={isLoading ? "..." : formatCurrency(totalExpected, currency)}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Completed"
          value={isLoading ? "..." : payments.filter((p) => p.status === "paid").length}
          icon={CheckCircle2}
          variant="default"
        />
      </div>

      {/* Payments Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60 bg-muted/20">
          <CardTitle className="text-[15px] font-semibold tracking-tight">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/60">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Brand</TableHead>
                <TableHead className="hidden md:table-cell text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Deal</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Amount</TableHead>
                <TableHead className="hidden sm:table-cell text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Received</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Status</TableHead>
                <TableHead className="hidden lg:table-cell text-[11px] font-semibold uppercase tracking-wide text-muted-foreground h-10">Due Date</TableHead>
                <TableHead className="w-10 h-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-[13px] text-muted-foreground">
                    No payments yet. Add a payment to start tracking your earnings.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id} className="group hover:bg-muted/30 border-b border-border/40 last:border-0">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-semibold text-[12px] border border-primary/10">
                          {typeof payment.deal === "string"
                            ? "D"
                            : payment.deal?.brandName?.charAt(0) || "D"}
                        </div>
                        <span className="text-[13px] font-medium">
                          {typeof payment.deal === "string"
                            ? "Deal"
                            : payment.deal?.brandName || "Deal"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[12px] text-muted-foreground py-3">
                      {typeof payment.deal === "string"
                        ? ""
                        : payment.deal?.dealName || ""}
                    </TableCell>
                    <TableCell className="text-[13px] font-semibold py-3">
                      {formatCurrency(payment.amount, currency)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-[13px] text-muted-foreground py-3">
                      {formatCurrency(payment.received, currency)}
                    </TableCell>
                    <TableCell className="py-3">{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-[12px] text-muted-foreground py-3">
                      {payment.dueDate
                        ? new Date(payment.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </TableCell>
                    <TableCell className="py-3">
                      <button className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

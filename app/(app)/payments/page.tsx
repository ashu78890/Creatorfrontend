"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DollarSign, TrendingUp, Clock, CheckCircle2, Download, ArrowUpRight } from "lucide-react"

const payments = [
  {
    id: 1,
    brand: "Nike",
    deal: "Summer Running Campaign",
    amount: 2500,
    received: 1000,
    status: "partially_paid",
    dueDate: "2026-02-15",
  },
  {
    id: 2,
    brand: "Spotify",
    deal: "Podcast Promotion",
    amount: 4000,
    received: 0,
    status: "pending",
    dueDate: "2026-02-20",
  },
  {
    id: 3,
    brand: "Adobe",
    deal: "Creative Tools Review",
    amount: 3200,
    received: 3200,
    status: "paid",
    dueDate: "2026-01-30",
  },
  {
    id: 4,
    brand: "Samsung",
    deal: "Galaxy Launch Event",
    amount: 5500,
    received: 0,
    status: "pending",
    dueDate: "2026-03-01",
  },
  {
    id: 5,
    brand: "Apple",
    deal: "iPhone Review",
    amount: 6000,
    received: 6000,
    status: "paid",
    dueDate: "2026-01-20",
  },
  {
    id: 6,
    brand: "Adidas",
    deal: "Fitness Collection",
    amount: 1800,
    received: 900,
    status: "partially_paid",
    dueDate: "2026-02-25",
  },
]

export default function PaymentsPage() {
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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Payments</h1>
          <p className="text-[13px] text-muted-foreground">Track your earnings and pending payments</p>
        </div>
        <Button variant="outline" className="border-border/60 hover:border-border hover:bg-muted/50 h-9 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earned"
          value={`$${totalPaid.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Pending"
          value={`$${totalPending.toLocaleString()}`}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Expected Total"
          value={`$${totalExpected.toLocaleString()}`}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title="Completed"
          value={payments.filter((p) => p.status === "paid").length}
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
              {payments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-muted/30 border-b border-border/40 last:border-0">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-semibold text-[12px] border border-primary/10">
                        {payment.brand.charAt(0)}
                      </div>
                      <span className="text-[13px] font-medium">{payment.brand}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-[12px] text-muted-foreground py-3">
                    {payment.deal}
                  </TableCell>
                  <TableCell className="text-[13px] font-semibold py-3">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-[13px] text-muted-foreground py-3">
                    ${payment.received.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3">{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-[12px] text-muted-foreground py-3">
                    {new Date(payment.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-3">
                    <button className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

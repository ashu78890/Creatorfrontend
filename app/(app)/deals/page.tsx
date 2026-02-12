"use client"

import { useState } from "react"
import Link from "next/link"
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
import { cn } from "@/lib/utils"

const deals = [
  {
    id: 1,
    brand: "Nike",
    brandHandle: "@nike",
    platform: "instagram",
    deliverables: ["Reel", "Story"],
    dueDate: "2026-02-06",
    daysLeft: 2,
    amount: 2500,
    paymentStatus: "pending",
    status: "active",
  },
  {
    id: 2,
    brand: "Spotify",
    brandHandle: "@spotify",
    platform: "youtube",
    deliverables: ["Video"],
    dueDate: "2026-02-08",
    daysLeft: 4,
    amount: 4000,
    paymentStatus: "partially_paid",
    status: "active",
  },
  {
    id: 3,
    brand: "Adidas",
    brandHandle: "@adidas",
    platform: "instagram",
    deliverables: ["Story", "Post"],
    dueDate: "2026-02-10",
    daysLeft: 6,
    amount: 1800,
    paymentStatus: "pending",
    status: "active",
  },
  {
    id: 4,
    brand: "Adobe",
    brandHandle: "@adobe",
    platform: "instagram",
    deliverables: ["Reel", "Post", "Story"],
    dueDate: "2026-02-12",
    daysLeft: 8,
    amount: 3200,
    paymentStatus: "paid",
    status: "completed",
  },
  {
    id: 5,
    brand: "Samsung",
    brandHandle: "@samsung",
    platform: "youtube",
    deliverables: ["Video", "Short"],
    dueDate: "2026-02-15",
    daysLeft: 11,
    amount: 5500,
    paymentStatus: "pending",
    status: "active",
  },
  {
    id: 6,
    brand: "Apple",
    brandHandle: "@apple",
    platform: "instagram",
    deliverables: ["Reel"],
    dueDate: "2026-02-18",
    daysLeft: 14,
    amount: 6000,
    paymentStatus: "paid",
    status: "completed",
  },
]

export default function DealsPage() {
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.brandHandle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform =
      platformFilter === "all" || deal.platform === platformFilter
    const matchesStatus =
      statusFilter === "all" || deal.paymentStatus === statusFilter
    return matchesSearch && matchesPlatform && matchesStatus
  })

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

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Deals</h1>
          <p className="text-[13px] text-muted-foreground">Manage all your brand collaborations</p>
        </div>
        <Button onClick={() => setShowAddDeal(true)} className="shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-[13px] border-border/60 focus-visible:border-primary/50"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-36 h-9 text-[13px] border-border/60">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[13px]">All Platforms</SelectItem>
            <SelectItem value="instagram" className="text-[13px]">Instagram</SelectItem>
            <SelectItem value="youtube" className="text-[13px]">YouTube</SelectItem>
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
          {filteredDeals.map((deal) => (
            <Card
              key={deal.id}
              className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-[15px] border border-primary/10">
                      {deal.brand.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{deal.brand}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {deal.brandHandle}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem asChild className="text-[13px]">
                        <Link href={`/deals/${deal.id}`}>
                          <Eye className="w-3.5 h-3.5 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[13px]">
                        <Pencil className="w-3.5 h-3.5 mr-2" />
                        Edit
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
                      <Badge key={d} variant="secondary" className="text-[10px] font-medium bg-muted/60 text-muted-foreground px-1.5 py-0">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <p className="text-[16px] font-bold text-foreground tracking-tight">
                      ${deal.amount.toLocaleString()}
                    </p>
                    {getPaymentBadge(deal.paymentStatus)}
                  </div>
                  {getUrgencyIndicator(deal.daysLeft)}
                </div>

                <Link 
                  href={`/deals/${deal.id}`}
                  className="absolute inset-0 rounded-xl"
                  aria-label={`View ${deal.brand} deal`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-[13px] border border-primary/10">
                    {deal.brand.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{deal.brand}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-muted-foreground">{getPlatformIcon(deal.platform)}</span>
                      <span className="text-[12px] text-muted-foreground">
                        {deal.deliverables.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[14px] font-semibold">${deal.amount.toLocaleString()}</p>
                    {getPaymentBadge(deal.paymentStatus)}
                  </div>
                  <div className="hidden md:block w-20 text-right">
                    {getUrgencyIndicator(deal.daysLeft)}
                  </div>
                  <Link 
                    href={`/deals/${deal.id}`}
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
    </div>
  )
}

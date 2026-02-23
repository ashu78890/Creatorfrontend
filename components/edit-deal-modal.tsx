"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateDeal, type Deal } from "@/hooks/useDeals"
import { useAddCustomPlatform, usePlatforms, type PlatformItem } from "@/hooks/usePlatforms"

interface EditDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deal: Deal | null
}

const toDateInput = (value?: string) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ""
  return parsed.toISOString().slice(0, 10)
}

export function EditDealModal({ open, onOpenChange, deal }: EditDealModalProps) {
  const updateDeal = useUpdateDeal()
  const { data: platformsData } = usePlatforms()
  const addPlatform = useAddCustomPlatform()
  const [brandName, setBrandName] = useState("")
  const [brandHandle, setBrandHandle] = useState("")
  const [dealName, setDealName] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [customPlatformName, setCustomPlatformName] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  const platformOptions: PlatformItem[] = platformsData?.all?.length
    ? platformsData.all
    : [
        { id: "instagram", label: "Instagram" },
        { id: "youtube", label: "YouTube" },
        { id: "tiktok", label: "TikTok" },
        { id: "other", label: "Other" }
      ]

  const customPlatformValue = "__custom__"
  const isCustomSelected = platform === customPlatformValue
  const normalizedOptions = platformOptions.some((option: PlatformItem) => option.id === platform)
    ? platformOptions
    : [...platformOptions, { id: platform, label: platform }]

  useEffect(() => {
    if (!deal || !open) return
    setBrandName(deal.brandName || "")
    setBrandHandle(deal.brandHandle || "")
    setDealName(deal.dealName || "")
    setPlatform(deal.platform || "instagram")
    setAmount(deal.amount ? String(deal.amount) : "")
    setPaymentStatus(deal.paymentStatus || "pending")
    setDueDate(toDateInput(deal.dueDate))
    setNotes(deal.notes || "")
  }, [deal, open])

  const canSave =
    brandName.trim().length > 0 &&
    dealName.trim().length > 0 &&
    platform.length > 0 &&
    platform !== customPlatformValue &&
    amount.length > 0

  const handleAddCustomPlatform = async () => {
    const trimmed = customPlatformName.trim()
    if (!trimmed) return
    const result = await addPlatform.mutateAsync(trimmed)
    setPlatform(result.platform.id)
    setCustomPlatformName("")
  }

  const handleSave = async () => {
    if (!deal || !canSave) return

    await updateDeal.mutateAsync({
      id: deal._id,
      payload: {
        brandName: brandName.trim(),
        brandHandle: brandHandle.trim() || undefined,
        dealName: dealName.trim(),
        platform,
        amount: Number(amount),
        paymentStatus: paymentStatus as "pending" | "partially_paid" | "paid",
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
      }
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="brandName" className="text-[13px] font-medium">Brand Name</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="h-9 text-[13px] border-border/60"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brandHandle" className="text-[13px] font-medium">Brand Handle</Label>
            <Input
              id="brandHandle"
              value={brandHandle}
              onChange={(e) => setBrandHandle(e.target.value)}
              className="h-9 text-[13px] border-border/60"
              placeholder="@brand"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dealName" className="text-[13px] font-medium">Deal Name</Label>
            <Input
              id="dealName"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              className="h-9 text-[13px] border-border/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="platform" className="text-[13px] font-medium">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-9 text-[13px] border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {normalizedOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className="text-[13px]">
                      {option.label}
                    </SelectItem>
                  ))}
                  <SelectItem value={customPlatformValue} className="text-[13px]">
                    Add custom platform...
                  </SelectItem>
                </SelectContent>
              </Select>
              {isCustomSelected && (
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={customPlatformName}
                    onChange={(e) => setCustomPlatformName(e.target.value)}
                    placeholder="e.g., Threads"
                    className="h-9 text-[13px] border-border/60"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCustomPlatform}
                    disabled={addPlatform.isPending || !customPlatformName.trim()}
                    className="h-9 text-[13px]"
                  >
                    {addPlatform.isPending ? "Adding..." : "Add"}
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-[13px] font-medium">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-9 text-[13px] border-border/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="paymentStatus" className="text-[13px] font-medium">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="h-9 text-[13px] border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending" className="text-[13px]">Pending</SelectItem>
                  <SelectItem value="partially_paid" className="text-[13px]">Partial</SelectItem>
                  <SelectItem value="paid" className="text-[13px]">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-[13px] font-medium">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 text-[13px] border-border/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-[13px] font-medium">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-[13px] border-border/60 min-h-[90px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!canSave || updateDeal.isPending}
            className="h-9 text-[13px]"
          >
            {updateDeal.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

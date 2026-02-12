"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
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
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowLeft, Check, Instagram, Youtube, Sparkles } from "lucide-react"

interface AddDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const deliverableTypes = [
  { id: "reel", name: "Reel", platform: "instagram" },
  { id: "post", name: "Post", platform: "instagram" },
  { id: "story", name: "Story", platform: "instagram" },
  { id: "video", name: "Video", platform: "youtube" },
  { id: "short", name: "Short", platform: "youtube" },
]

const paymentStatuses = [
  { id: "pending", name: "Pending" },
  { id: "partially_paid", name: "Partially Paid" },
  { id: "paid", name: "Paid" },
]

const steps = [
  { number: 1, label: "Brand" },
  { number: 2, label: "Details" },
  { number: 3, label: "Payment" },
]

export function AddDealModal({ open, onOpenChange }: AddDealModalProps) {
  const [step, setStep] = useState(1)
  const [brandHandle, setBrandHandle] = useState("")
  const [dealName, setDealName] = useState("")
  const [platform, setPlatform] = useState("")
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([])
  const [dueDate, setDueDate] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [notes, setNotes] = useState("")

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSave = () => {
    console.log({
      brandHandle,
      dealName,
      platform,
      selectedDeliverables,
      dueDate,
      paymentAmount,
      paymentStatus,
      notes,
    })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setBrandHandle("")
    setDealName("")
    setPlatform("")
    setSelectedDeliverables([])
    setDueDate("")
    setPaymentAmount("")
    setPaymentStatus("pending")
    setNotes("")
  }

  const canContinue = () => {
    if (step === 1) return brandHandle.length > 0
    if (step === 2) return dealName.length > 0 && platform.length > 0 && selectedDeliverables.length > 0
    if (step === 3) return dueDate.length > 0 && paymentAmount.length > 0
    return false
  }

  const filteredDeliverables = platform
    ? deliverableTypes.filter(
        (d) => d.platform === platform || d.platform === "all"
      )
    : deliverableTypes

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <DialogTitle className="text-[16px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            Add New Deal
          </DialogTitle>
          {/* Step indicator */}
          <div className="flex items-center gap-2 pt-3">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold transition-all",
                  step >= s.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {step > s.number ? <Check className="w-3 h-3" /> : s.number}
                </div>
                <span className={cn(
                  "text-[12px] font-medium hidden sm:block",
                  step >= s.number ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 rounded-full transition-colors",
                    step > s.number ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="px-6 py-5">
          {/* Step 1: Brand Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandHandle" className="text-[13px] font-medium">Brand Handle</Label>
                <Input
                  id="brandHandle"
                  placeholder="@brandname"
                  value={brandHandle}
                  onChange={(e) => setBrandHandle(e.target.value)}
                  className="mt-1.5 h-10 text-[13px] border-border/60 focus-visible:border-primary/50"
                />
              </div>

              {brandHandle && (
                <Card className="border-border/60 bg-muted/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary font-bold text-[15px] border border-primary/10">
                      {brandHandle.replace("@", "").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold">
                        {brandHandle.replace("@", "").charAt(0).toUpperCase() +
                          brandHandle.replace("@", "").slice(1)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                        <Youtube className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Deal Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dealName" className="text-[13px] font-medium">Deal Name</Label>
                <Input
                  id="dealName"
                  placeholder="e.g., Summer Campaign 2026"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  className="mt-1.5 h-10 text-[13px] border-border/60 focus-visible:border-primary/50"
                />
              </div>

              <div>
                <Label htmlFor="platform" className="text-[13px] font-medium">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1.5 h-10 text-[13px] border-border/60">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram" className="text-[13px]">Instagram</SelectItem>
                    <SelectItem value="youtube" className="text-[13px]">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[13px] font-medium">Deliverables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filteredDeliverables.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => toggleDeliverable(type.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 border",
                        selectedDeliverables.includes(type.id)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                          : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Timeline & Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dueDate" className="text-[13px] font-medium">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1.5 h-10 text-[13px] border-border/60 focus-visible:border-primary/50"
                />
              </div>

              <div>
                <Label htmlFor="paymentAmount" className="text-[13px] font-medium">Payment Amount</Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[13px]">
                    $
                  </span>
                  <Input
                    id="paymentAmount"
                    type="number"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-7 h-10 text-[13px] border-border/60 focus-visible:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paymentStatus" className="text-[13px] font-medium">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="mt-1.5 h-10 text-[13px] border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id} className="text-[13px]">
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-[13px] font-medium">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this deal..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5 text-[13px] border-border/60 focus-visible:border-primary/50 min-h-[80px] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/20">
          {step > 1 ? (
            <Button variant="ghost" onClick={handleBack} className="h-9 text-[13px]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canContinue()} className="h-9 text-[13px] shadow-sm shadow-primary/20">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!canContinue()} className="h-9 text-[13px] shadow-sm shadow-primary/20">
              <Check className="w-4 h-4 mr-2" />
              Save Deal
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react"

const platforms = [
  { id: "instagram", name: "Instagram", icon: "IG" },
  { id: "youtube", name: "YouTube", icon: "YT" },
  { id: "tiktok", name: "TikTok", icon: "TT" },
  { id: "twitter", name: "X / Twitter", icon: "X" },
]

const dealTypes = [
  { id: "reels", name: "Reels" },
  { id: "posts", name: "Posts" },
  { id: "stories", name: "Stories" },
  { id: "shorts", name: "Shorts" },
  { id: "videos", name: "Videos" },
  { id: "tweets", name: "Tweets" },
]

const dealVolumes = [
  { id: "1-5", label: "1-5 deals", description: "Just getting started" },
  { id: "5-10", label: "5-10 deals", description: "Growing steadily" },
  { id: "10+", label: "10+ deals", description: "Full-time creator" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([])
  const [selectedVolume, setSelectedVolume] = useState<string>("")

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleDealType = (id: string) => {
    setSelectedDealTypes((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const canContinue = () => {
    if (step === 0) return true
    if (step === 1) return selectedPlatforms.length > 0
    if (step === 2) return selectedDealTypes.length > 0
    if (step === 3) return selectedVolume !== ""
    return false
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between h-[60px] px-6 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CreatorFlow</span>
        </div>
        {step > 0 && (
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  step >= s ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Welcome Screen */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-7 border border-primary/10">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl lg:text-[28px] font-bold text-foreground mb-3 text-balance tracking-tight">
                Manage brand deals without the chaos
              </h1>
              <p className="text-[14px] text-muted-foreground mb-8 text-balance leading-relaxed max-w-sm mx-auto">
                Track your campaigns, deadlines, and payments all in one place. 
                No more scattered DMs, emails, or spreadsheets.
              </p>
              <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-[13px] text-muted-foreground">Track all your brand deals</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-[13px] text-muted-foreground">Never miss a deadline</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-[13px] text-muted-foreground">Get paid on time</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Platforms */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                Which platforms do you use?
              </h2>
              <p className="text-[13px] text-muted-foreground mb-6">
                Select all the platforms where you create content
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {platforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className={cn(
                      "cursor-pointer transition-all duration-150 border-border/60",
                      selectedPlatforms.includes(platform.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "hover:border-primary/40 hover:bg-muted/30"
                    )}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <CardContent className="flex items-center gap-3 p-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-md flex items-center justify-center font-bold text-[12px] transition-colors",
                          selectedPlatforms.includes(platform.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {platform.icon}
                      </div>
                      <span className="text-[13px] font-medium">{platform.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Deal Types */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                What type of content do you create?
              </h2>
              <p className="text-[13px] text-muted-foreground mb-6">
                Select your typical deliverable types for brand deals
              </p>
              <div className="flex flex-wrap gap-2">
                {dealTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleDealType(type.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-md text-[12px] font-medium transition-all duration-150 border",
                      selectedDealTypes.includes(type.id)
                        ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                        : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Volume */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                How many deals do you handle monthly?
              </h2>
              <p className="text-[13px] text-muted-foreground mb-6">
                This helps us personalize your experience
              </p>
              <div className="flex flex-col gap-2.5">
                {dealVolumes.map((volume) => (
                  <Card
                    key={volume.id}
                    className={cn(
                      "cursor-pointer transition-all duration-150 border-border/60",
                      selectedVolume === volume.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "hover:border-primary/40 hover:bg-muted/30"
                    )}
                    onClick={() => setSelectedVolume(volume.id)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-[13px] font-medium">{volume.label}</p>
                        <p className="text-[12px] text-muted-foreground">{volume.description}</p>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          selectedVolume === volume.id
                            ? "border-primary bg-primary"
                            : "border-border"
                        )}
                      >
                        {selectedVolume === volume.id && (
                          <Check className="w-2.5 h-2.5 text-primary-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-[72px] px-6 flex items-center border-t border-border/60">
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={handleBack} className="h-9 text-[13px]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleNext} disabled={!canContinue()} className="h-9 text-[13px] shadow-sm shadow-primary/20">
            {step === 0 ? "Get Started" : step === 3 ? "Complete Setup" : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}

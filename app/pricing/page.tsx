"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    period: "forever",
    features: [
      "Up to 3 active deals",
      "Basic deadline reminders",
      "Payment tracking",
      "Mobile access",
    ],
    limitations: [
      "No calendar view",
      "No analytics",
      "Email support only",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Creator Pro",
    description: "For serious content creators",
    price: 12,
    period: "month",
    features: [
      "Unlimited deals",
      "Advanced payment tracking",
      "Calendar view",
      "Basic analytics",
      "Priority reminders",
      "Export reports",
      "Priority support",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Studio",
    description: "For teams and agencies",
    price: 29,
    period: "month",
    features: [
      "Everything in Pro",
      "Team access (up to 5)",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "White-label options",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Yes, Creator Pro comes with a 14-day free trial. No credit card required.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time with no questions asked.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-[60px] px-4 lg:px-8 bg-background/80 backdrop-blur-md border-b border-border/60">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CreatorFlow</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="h-8 text-[13px]">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to App
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 lg:py-24 text-center">
        <Badge variant="secondary" className="mb-5 text-[12px] font-medium bg-primary/10 text-primary border-primary/20">
          <Sparkles className="w-3 h-3 mr-1.5" />
          Simple Pricing
        </Badge>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance tracking-tight">
          Choose the plan that fits your workflow
        </h1>
        <p className="text-[15px] text-muted-foreground max-w-xl mx-auto text-balance leading-relaxed">
          Start for free and upgrade as you grow. All plans include a 14-day money-back guarantee.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20 lg:pb-28">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200",
                plan.popular && "border-primary shadow-md shadow-primary/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 shadow-sm shadow-primary/20">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2 pt-6">
                <CardTitle className="text-[16px] font-semibold tracking-tight">{plan.name}</CardTitle>
                <CardDescription className="text-[12px]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-2">
                <div className="text-center mb-5">
                  <span className="text-3xl font-bold tracking-tight">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[13px] text-muted-foreground">/{plan.period}</span>
                  )}
                </div>

                <div className="flex-1">
                  <ul className="space-y-2.5 mb-5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-success" />
                        </div>
                        <span className="text-[12px]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-muted/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-[12px]">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  className={cn(
                    "w-full h-9 text-[13px]",
                    plan.popular && "shadow-sm shadow-primary/20"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 pb-20 lg:pb-28">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 tracking-tight">Frequently Asked Questions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="border-border/60 shadow-sm">
                <CardContent className="pt-5 pb-5">
                  <h3 className="text-[13px] font-semibold mb-1.5">{faq.question}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 lg:pb-28">
        <div className="max-w-2xl mx-auto text-center p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/10">
          <h2 className="text-xl lg:text-2xl font-bold mb-3 tracking-tight">
            Ready to streamline your brand deals?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of creators who trust CreatorFlow to manage their partnerships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding">
              <Button className="h-10 text-[13px] shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="h-10 text-[13px] bg-transparent border-border/60 hover:border-border hover:bg-muted/50">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-border/60">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">CF</span>
            </div>
            <span className="text-[12px] text-muted-foreground">
              CreatorFlow &copy; 2026. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

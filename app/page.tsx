import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  CheckCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  Instagram,
  Youtube,
  Clock,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-[60px] px-4 lg:px-8 bg-background/80 backdrop-blur-md border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-[15px] tracking-tight">CreatorFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="h-8 text-[13px] text-muted-foreground hover:text-foreground">Pricing</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="h-8 text-[13px] text-muted-foreground hover:text-foreground">Sign In</Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="h-8 text-[13px] shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-[12px] font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Built for content creators
          </Badge>
          <h1 className="text-4xl lg:text-[56px] font-bold text-foreground mb-6 text-balance leading-[1.1] tracking-tight">
            Manage brand deals without the chaos
          </h1>
          <p className="text-[17px] lg:text-lg text-muted-foreground mb-10 max-w-xl mx-auto text-balance leading-relaxed">
            Stop juggling DMs, emails, and spreadsheets. CreatorFlow helps you track campaigns, 
            deadlines, and payments all in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding">
              <Button size="lg" className="h-11 text-[14px] px-6 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
                Start for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-11 text-[14px] px-6 bg-transparent border-border/60 hover:border-border hover:bg-muted/50">
                View Demo
              </Button>
            </Link>
          </div>
          <p className="text-[12px] text-muted-foreground mt-5">
            No credit card required. Free forever for up to 3 deals.
          </p>
        </div>
      </section>

      {/* Platform Icons */}
      <section className="px-4 pb-20">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-[12px] text-muted-foreground mb-5 uppercase tracking-wide font-medium">
            Perfect for creators on
          </p>
          <div className="flex items-center justify-center gap-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Instagram className="w-5 h-5" />
              <span className="text-[13px] font-medium">Instagram</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Youtube className="w-5 h-5" />
              <span className="text-[13px] font-medium">YouTube</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              <span className="text-[13px] font-medium">TikTok</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 lg:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl lg:text-[32px] font-bold mb-4 tracking-tight">
              Everything you need to manage brand deals
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto">
              From first contact to final payment, CreatorFlow has you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold mb-2 tracking-tight">Track Deliverables</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Keep track of every reel, story, and post. Check them off as you complete them.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold mb-2 tracking-tight">Never Miss Deadlines</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Visual calendar and smart reminders ensure you deliver on time, every time.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold mb-2 tracking-tight">Get Paid Faster</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Track payment status and get alerts when invoices are overdue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-4 h-4 text-warning fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <p className="text-[15px] font-semibold mb-2">Loved by 2,000+ creators</p>
          <p className="text-[14px] text-muted-foreground max-w-md mx-auto">
            &ldquo;CreatorFlow saved me hours every week. I finally know exactly where every deal stands.&rdquo;
          </p>
          <p className="text-[12px] text-muted-foreground mt-3">- Sarah K., Instagram Creator</p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 bg-primary/[0.03] border-y border-border/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">$2M+</p>
            <p className="text-[12px] text-muted-foreground mt-1">Tracked in payments</p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">5,000+</p>
            <p className="text-[12px] text-muted-foreground mt-1">Brand deals managed</p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">98%</p>
            <p className="text-[12px] text-muted-foreground mt-1">On-time delivery rate</p>
          </div>
          <div>
            <p className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">4.9/5</p>
            <p className="text-[12px] text-muted-foreground mt-1">Creator satisfaction</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold mb-3 tracking-tight">
            Stop losing track of your brand deals
          </h2>
          <p className="text-[14px] opacity-90 mb-7 max-w-md mx-auto leading-relaxed">
            Join thousands of creators who use CreatorFlow to stay organized and get paid on time.
          </p>
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="h-11 text-[14px] px-6 shadow-sm hover:shadow-md transition-shadow">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

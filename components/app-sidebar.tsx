"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Handshake,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  X,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deals", href: "/deals", icon: Handshake },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/10 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-[60px] px-5 border-b border-sidebar-border/60">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20 transition-shadow group-hover:shadow-md group-hover:shadow-primary/25">
                <span className="text-primary-foreground font-bold text-sm">CF</span>
              </div>
              <span className="font-semibold text-[15px] text-sidebar-foreground tracking-tight">CreatorFlow</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 hover:bg-sidebar-accent"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-0.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                        : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-sidebar-primary" : "")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Upgrade prompt */}
          <div className="p-3 mx-3 mb-4 rounded-lg bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-[13px] font-semibold text-foreground">Upgrade to Pro</p>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Unlock unlimited deals and advanced analytics
            </p>
            <Link href="/pricing">
              <Button size="sm" className="w-full mt-3 h-8 text-[12px] font-medium shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-shadow">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    positive: boolean
  }
  variant?: "default" | "primary" | "success" | "warning"
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const iconVariants = {
    default: "bg-muted/80 text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
  }

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
            {trend && (
              <p className={cn(
                "text-[11px] font-medium flex items-center gap-1",
                trend.positive ? "text-success" : "text-destructive"
              )}>
                <span className={cn(
                  "inline-flex items-center justify-center w-4 h-4 rounded",
                  trend.positive ? "bg-success/10" : "bg-destructive/10"
                )}>
                  {trend.positive ? "↑" : "↓"}
                </span>
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconVariants[variant])}>
            <Icon className="w-[18px] h-[18px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

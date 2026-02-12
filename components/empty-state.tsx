'use client';

import { Button } from "@/components/ui/button"
import { type LucideIcon, Plus } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction}>
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  )
}

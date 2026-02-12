"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Instagram, Youtube, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const events = [
  { id: 1, brand: "Nike", type: "Reel", date: "2026-02-06", platform: "instagram", color: "primary" },
  { id: 2, brand: "Nike", type: "Story", date: "2026-02-06", platform: "instagram", color: "primary" },
  { id: 3, brand: "Spotify", type: "Video", date: "2026-02-08", platform: "youtube", color: "chart-2" },
  { id: 4, brand: "Adidas", type: "Story", date: "2026-02-10", platform: "instagram", color: "chart-3" },
  { id: 5, brand: "Adidas", type: "Post", date: "2026-02-10", platform: "instagram", color: "chart-3" },
  { id: 6, brand: "Adobe", type: "Reel", date: "2026-02-12", platform: "instagram", color: "chart-4" },
  { id: 7, brand: "Samsung", type: "Video", date: "2026-02-15", platform: "youtube", color: "chart-5" },
  { id: 8, brand: "Apple", type: "Reel", date: "2026-02-18", platform: "instagram", color: "primary" },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getEventsForDate = (date: string) => {
    return events.filter((e) => e.date === date)
  }

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${year}-${m}-${d}`
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary"
      case "chart-2":
        return "bg-chart-2"
      case "chart-3":
        return "bg-chart-3"
      case "chart-4":
        return "bg-chart-4"
      case "chart-5":
        return "bg-chart-5"
      default:
        return "bg-primary"
    }
  }

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Calendar</h1>
        <p className="text-[13px] text-muted-foreground">View your deadlines and posting schedule</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Calendar */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">{months[month]} {year}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-muted/60">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-muted/60">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dateStr = formatDate(day)
                const dayEvents = getEventsForDate(dateStr)
                const isSelected = selectedDate === dateStr
                const isToday = dateStr === "2026-02-04"

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={cn(
                      "aspect-square p-1 rounded-lg transition-all duration-150 relative group",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : isToday
                          ? "bg-primary/10 ring-1 ring-primary/20"
                          : "hover:bg-muted/60"
                    )}
                  >
                    <span className={cn(
                      "text-[13px]",
                      isSelected ? "font-semibold" : isToday ? "font-semibold text-primary" : "text-foreground"
                    )}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "w-1 h-1 rounded-full",
                              isSelected ? "bg-primary-foreground/80" : getColorClass(event.color)
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Events Sidebar */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-[15px] font-semibold tracking-tight">
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn("w-1 h-10 rounded-full", getColorClass(event.color))} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{event.brand}</p>
                      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        {event.platform === "instagram" ? (
                          <Instagram className="w-3 h-3" />
                        ) : (
                          <Youtube className="w-3 h-3" />
                        )}
                        <span>{event.type}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-medium bg-muted/60">{event.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-[13px] text-muted-foreground">
                  {selectedDate
                    ? "No deliverables scheduled"
                    : "Click on a date to see deliverables"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-4 py-3">
          <span className="text-[12px] font-medium text-muted-foreground">Brands:</span>
          {[...new Map(events.map((e) => [e.brand, e])).values()].map((event) => (
            <div key={event.brand} className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full", getColorClass(event.color))} />
              <span className="text-[12px] font-medium">{event.brand}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

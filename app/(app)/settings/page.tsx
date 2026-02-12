"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, DollarSign, Clock, Save, Upload, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    paymentAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [reminders, setReminders] = useState({
    daysBefore: "2",
    reminderTime: "09:00",
  })

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-[13px] text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            Profile Settings
          </CardTitle>
          <CardDescription className="text-[12px]">Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <div className="flex items-center gap-5">
            <Avatar className="w-16 h-16 ring-2 ring-border">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary font-semibold">JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="h-8 text-[12px] border-border/60 bg-transparent">
                <Upload className="w-3.5 h-3.5 mr-2" />
                Upload Photo
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-[13px] font-medium">First Name</Label>
              <Input id="firstName" defaultValue="Jane" className="h-9 text-[13px] border-border/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-[13px] font-medium">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="h-9 text-[13px] border-border/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
              <Input id="email" type="email" defaultValue="jane@creator.com" className="h-9 text-[13px] border-border/60" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[13px] font-medium">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-9 text-[13px] border-border/60" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="h-9 text-[13px] shadow-sm shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-[12px]">Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-0">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13px] font-medium">Deadline Reminders</p>
              <p className="text-[12px] text-muted-foreground">
                Get notified before deliverable deadlines
              </p>
            </div>
            <Switch
              checked={notifications.deadlineReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, deadlineReminders: checked })
              }
            />
          </div>

          <Separator className="bg-border/60" />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13px] font-medium">Payment Alerts</p>
              <p className="text-[12px] text-muted-foreground">
                Get notified about payment status changes
              </p>
            </div>
            <Switch
              checked={notifications.paymentAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, paymentAlerts: checked })
              }
            />
          </div>

          <Separator className="bg-border/60" />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13px] font-medium">Weekly Digest</p>
              <p className="text-[12px] text-muted-foreground">
                Receive a weekly summary of your deals
              </p>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyDigest: checked })
              }
            />
          </div>

          <Separator className="bg-border/60" />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-[13px] font-medium">Marketing Emails</p>
              <p className="text-[12px] text-muted-foreground">
                Receive product updates and tips
              </p>
            </div>
            <Switch
              checked={notifications.marketingEmails}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketingEmails: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            Currency Settings
          </CardTitle>
          <CardDescription className="text-[12px]">Set your preferred currency for payments</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="max-w-xs">
            <Label htmlFor="currency" className="text-[13px] font-medium">Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger className="mt-1.5 h-9 text-[13px] border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd" className="text-[13px]">USD ($)</SelectItem>
                <SelectItem value="eur" className="text-[13px]">EUR (&#8364;)</SelectItem>
                <SelectItem value="gbp" className="text-[13px]">GBP (&#163;)</SelectItem>
                <SelectItem value="inr" className="text-[13px]">INR (&#8377;)</SelectItem>
                <SelectItem value="cad" className="text-[13px]">CAD ($)</SelectItem>
                <SelectItem value="aud" className="text-[13px]">AUD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            Reminder Settings
          </CardTitle>
          <CardDescription className="text-[12px]">Customize when you receive deadline reminders</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid sm:grid-cols-2 gap-4 max-w-md">
            <div className="space-y-1.5">
              <Label htmlFor="daysBefore" className="text-[13px] font-medium">Days Before Deadline</Label>
              <Select
                value={reminders.daysBefore}
                onValueChange={(value) => setReminders({ ...reminders, daysBefore: value })}
              >
                <SelectTrigger className="h-9 text-[13px] border-border/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-[13px]">1 day</SelectItem>
                  <SelectItem value="2" className="text-[13px]">2 days</SelectItem>
                  <SelectItem value="3" className="text-[13px]">3 days</SelectItem>
                  <SelectItem value="5" className="text-[13px]">5 days</SelectItem>
                  <SelectItem value="7" className="text-[13px]">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reminderTime" className="text-[13px] font-medium">Reminder Time</Label>
              <Input
                id="reminderTime"
                type="time"
                value={reminders.reminderTime}
                onChange={(e) => setReminders({ ...reminders, reminderTime: e.target.value })}
                className="h-9 text-[13px] border-border/60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30 shadow-sm">
        <CardHeader className="pb-3 border-b border-destructive/20">
          <CardTitle className="text-[15px] font-semibold tracking-tight text-destructive flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            Danger Zone
          </CardTitle>
          <CardDescription className="text-[12px]">Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium">Delete Account</p>
            <p className="text-[12px] text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button variant="destructive" className="h-9 text-[13px]">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Bell, Menu, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppHeaderProps {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[60px] px-4 lg:px-6 bg-card/80 backdrop-blur-md border-b border-border/60">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-[15px] font-semibold text-foreground tracking-tight">Welcome back, Creator</h1>
          <p className="text-[13px] text-muted-foreground">Here&apos;s what&apos;s happening with your deals</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 text-muted-foreground hover:text-foreground">
          <Search className="h-[18px] w-[18px]" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-card" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
            <DropdownMenuLabel className="px-4 py-3 border-b border-border/60">
              <span className="text-[13px] font-semibold">Notifications</span>
            </DropdownMenuLabel>
            <div className="max-h-[320px] overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer focus:bg-muted/60">
                <span className="text-[13px] font-medium">Payment received</span>
                <span className="text-[12px] text-muted-foreground">Nike paid $2,500 for your campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer focus:bg-muted/60">
                <span className="text-[13px] font-medium">Deadline approaching</span>
                <span className="text-[12px] text-muted-foreground">Adidas Reel due in 2 days</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 px-4 py-3 cursor-pointer focus:bg-muted/60">
                <span className="text-[13px] font-medium">New deal added</span>
                <span className="text-[12px] text-muted-foreground">Spotify campaign saved successfully</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1.5 hidden sm:block" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 hover:bg-muted/60">
              <Avatar className="h-7 w-7 ring-1 ring-border">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">JD</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-[13px] font-medium">Jane Doe</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1" sideOffset={8}>
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="text-[13px] font-semibold">Jane Doe</div>
              <div className="text-[12px] text-muted-foreground font-normal">jane@creator.io</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="text-[13px] px-2 py-1.5 cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] px-2 py-1.5 cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] px-2 py-1.5 cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="text-[13px] px-2 py-1.5 cursor-pointer text-destructive focus:text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

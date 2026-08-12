"use client"

import { useState } from "react"
import {
  BookmarkIcon,
  CalendarIcon,
  HomeIcon,
  MenuIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { buyer } from "@/lib/data"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "explore", label: "Explore", icon: SearchIcon, active: true },
  { id: "saved", label: "Saved", icon: BookmarkIcon, active: false },
  { id: "visits", label: "Visits", icon: CalendarIcon, active: false },
  { id: "messages", label: "Messages", icon: MessageSquareIcon, active: false },
] as const

type AppHeaderProps = {
  current?: (typeof navItems)[number]["id"]
}

export function AppHeader({ current = "explore" }: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const initials = buyer.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-3 px-4">
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Open menu" />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="border-b">
                <SheetTitle>Homefit</SheetTitle>
                <SheetDescription>Find a place worth visiting</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === current
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon data-icon="inline-start" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <a href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HomeIcon className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Homefit</span>
        </a>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = item.id === current
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground",
                  isActive && "bg-muted text-foreground"
                )}
              >
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 px-1.5 sm:px-2.5"
                />
              }
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {buyer.name.split(" ")[0]}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {buyer.name}
                  <span className="mt-0.5 block font-normal text-muted-foreground">
                    Renter account
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <SettingsIcon />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookmarkIcon />
                  Saved listings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <LogOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

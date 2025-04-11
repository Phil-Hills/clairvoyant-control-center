"use client"

import { useState } from "react"
import { Bell, Check, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

const environments = [
  { name: "Development", value: "dev" },
  { name: "Staging", value: "staging" },
  { name: "Production", value: "prod" },
]

export function DashboardNavbar() {
  const [environment, setEnvironment] = useState(environments[0])
  const [syncStatus, setSyncStatus] = useState("synced") // "synced", "syncing", "error"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                {environment.name}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Environments</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {environments.map((env) => (
                <DropdownMenuItem
                  key={env.value}
                  onClick={() => setEnvironment(env)}
                  className="flex items-center justify-between"
                >
                  {env.name}
                  {environment.value === env.value && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge
            variant={syncStatus === "synced" ? "outline" : syncStatus === "syncing" ? "secondary" : "destructive"}
            className="gap-1"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                syncStatus === "synced" ? "bg-green-500" : syncStatus === "syncing" ? "bg-blue-500" : "bg-red-500"
              }`}
            />
            {syncStatus === "synced" ? "GCP Synced" : syncStatus === "syncing" ? "Syncing..." : "Sync Error"}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>PH</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>API Keys</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

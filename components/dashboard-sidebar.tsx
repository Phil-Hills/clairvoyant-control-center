"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, Bot, CheckSquare, FileText, Cloud, Settings, Menu, Key, Terminal, Brain } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}

export function DashboardSidebar({ className, isOpen: propIsOpen, setIsOpen: propSetIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(propIsOpen !== undefined ? propIsOpen : !isMobile)

  const toggleSidebar = () => {
    if (propSetIsOpen) {
      propSetIsOpen(!isOpen)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Agents",
      icon: Bot,
      href: "/agents",
      active: pathname === "/agents" || pathname.startsWith("/agents/"),
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname === "/tasks",
    },
    {
      label: "Logs",
      icon: FileText,
      href: "/logs",
      active: pathname === "/logs",
    },
    {
      label: "GCP Resources",
      icon: Cloud,
      href: "/gcp-resources",
      active: pathname === "/gcp-resources",
    },
    {
      label: "Secrets",
      icon: Key,
      href: "/secrets",
      active: pathname === "/secrets",
    },
    {
      label: "Command Console",
      icon: Terminal,
      href: "/agents/command",
      active: pathname === "/agents/command",
    },
    {
      label: "AgentOS Console",
      icon: Brain,
      href: "/agentos",
      active: pathname === "/agentos",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50 lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Clairvoyant</h2>
          <p className="text-xs text-muted-foreground">Control Center</p>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} onClick={() => isMobile && setIsOpen(false)}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", route.active && "bg-secondary")}
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs">Connected to GCP</span>
          </div>
        </div>
      </div>
    </>
  )
}

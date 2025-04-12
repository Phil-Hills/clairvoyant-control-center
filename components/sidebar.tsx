"use client"

import { Button } from "@/components/ui/button"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "sidebar" | "rail"
  collapsible?: "icon" | "full"
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant = "sidebar", collapsible, isOpen = true, setIsOpen, children, ...props }, ref) => {
    const isCollapsible = collapsible === "icon" || collapsible === "full"
    const isRail = variant === "rail"

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col flex-shrink-0 border-r",
          isRail ? "w-16" : "w-64",
          isCollapsible && "transition-all duration-300",
          isCollapsible && !isOpen && "md:w-16",
          variant === "sidebar" && "bg-sidebar-background text-sidebar-foreground border-sidebar-border",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex h-16 shrink-0 items-center px-4 py-2", className)} {...props} />
})
SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1 overflow-y-auto py-2", className)} {...props} />
})
SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("shrink-0 border-t p-4", className)} {...props} />
})
SidebarFooter.displayName = "SidebarFooter"

interface SidebarRailProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarRail = React.forwardRef<HTMLDivElement, SidebarRailProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("hidden border-l md:block", className)} {...props} />
})
SidebarRail.displayName = "SidebarRail"

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-1", className)} {...props} />
})
SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupContent = React.forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("p-2", className)} {...props} />
  },
)
SidebarGroupContent.displayName = "SidebarGroupContent"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("grid grid-flow-row auto-rows-max text-sm", className)} {...props} />
})
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean
  tooltip?: string
}

const SidebarMenuButton = React.forwardRef<HTMLAnchorElement, SidebarMenuButtonProps>(
  ({ className, isActive, tooltip, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "group flex h-9 w-full items-center justify-start space-x-2 rounded-md px-3 py-1.5 font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(({ className, ...props }, ref) => {
  return <Button ref={ref} variant="ghost" size="icon" className={cn("", className)} {...props} />
})
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}

"use client"

import { useState } from "react"
import { CalendarIcon, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock data for filters
const agents = [
  { id: "agent-1", name: "Data Processor" },
  { id: "agent-2", name: "Content Analyzer" },
  { id: "agent-3", name: "Notification Service" },
  { id: "agent-4", name: "Log Analyzer" },
  { id: "agent-5", name: "Sentiment Analyzer" },
]

const statuses = [
  { id: "running", name: "Running" },
  { id: "success", name: "Success" },
  { id: "failed", name: "Failed" },
  { id: "retrying", name: "Retrying" },
  { id: "queued", name: "Queued" },
]

export function TaskQueueHeader() {
  const { toast } = useToast()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [date, setDate] = useState<Date>()
  const [activeFilters, setActiveFilters] = useState({
    agents: [] as string[],
    statuses: [] as string[],
    date: null as Date | null,
  })

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Refreshed",
        description: "Task queue has been refreshed.",
      })
    }, 1000)
  }

  const handleAutoRefreshChange = (checked: boolean) => {
    setAutoRefresh(checked)
    toast({
      title: checked ? "Auto-refresh enabled" : "Auto-refresh disabled",
      description: checked ? "Task queue will refresh every 15 seconds." : "Task queue will not refresh automatically.",
    })
  }

  const toggleAgentFilter = (agentId: string) => {
    setActiveFilters((prev) => {
      const newAgents = prev.agents.includes(agentId)
        ? prev.agents.filter((id) => id !== agentId)
        : [...prev.agents, agentId]

      return { ...prev, agents: newAgents }
    })
  }

  const toggleStatusFilter = (statusId: string) => {
    setActiveFilters((prev) => {
      const newStatuses = prev.statuses.includes(statusId)
        ? prev.statuses.filter((id) => id !== statusId)
        : [...prev.statuses, statusId]

      return { ...prev, statuses: newStatuses }
    })
  }

  const setDateFilter = (date: Date | undefined) => {
    setDate(date)
    setActiveFilters((prev) => ({ ...prev, date: date || null }))
  }

  const clearAllFilters = () => {
    setActiveFilters({
      agents: [],
      statuses: [],
      date: null,
    })
    setDate(undefined)
    toast({
      title: "Filters cleared",
      description: "All filters have been reset.",
    })
  }

  const getActiveFilterCount = () => {
    return activeFilters.agents.length + activeFilters.statuses.length + (activeFilters.date ? 1 : 0)
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Queue</h1>
          <p className="text-muted-foreground">Monitor queued, running, and completed agent tasks in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>By Agent</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {agents.map((agent) => (
                      <DropdownMenuItem key={agent.id} onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center space-x-2" onClick={() => toggleAgentFilter(agent.id)}>
                          <div className="h-4 w-4 border rounded-sm flex items-center justify-center">
                            {activeFilters.agents.includes(agent.id) && <span>✓</span>}
                          </div>
                          <span>{agent.name}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>By Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {statuses.map((status) => (
                      <DropdownMenuItem key={status.id} onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center space-x-2" onClick={() => toggleStatusFilter(status.id)}>
                          <div className="h-4 w-4 border rounded-sm flex items-center justify-center">
                            {activeFilters.statuses.includes(status.id) && <span>✓</span>}
                          </div>
                          <span>{status.name}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem asChild>
                <div className="px-2 py-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDateFilter} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={clearAllFilters}>Clear all filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={handleAutoRefreshChange} />
        <Label htmlFor="auto-refresh">Auto-refresh every 15 seconds</Label>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { CalendarIcon, Filter, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for agents
const agents = [
  { id: "all", name: "All Agents" },
  { id: "agent-1", name: "Data Processor" },
  { id: "agent-2", name: "Content Analyzer" },
  { id: "agent-3", name: "Notification Service" },
  { id: "agent-4", name: "Log Analyzer" },
  { id: "agent-5", name: "Sentiment Analyzer" },
]

// Severity levels
const severityLevels = [
  { id: "info", name: "INFO" },
  { id: "warning", name: "WARNING" },
  { id: "error", name: "ERROR" },
  { id: "critical", name: "CRITICAL" },
]

export function LogsHeader() {
  const { toast } = useToast()
  const [liveStream, setLiveStream] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(severityLevels.map((level) => level.id))

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Logs Refreshed",
        description: "Log data has been updated.",
      })
    }, 1000)
  }

  const handleLiveStreamChange = (checked: boolean) => {
    setLiveStream(checked)
    toast({
      title: checked ? "Live Stream Enabled" : "Live Stream Disabled",
      description: checked
        ? "Logs will update automatically every 5 seconds."
        : "Automatic log updates have been disabled.",
    })
  }

  const toggleSeverity = (severityId: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(severityId) ? prev.filter((id) => id !== severityId) : [...prev, severityId],
    )
  }

  const clearDateFilter = () => {
    setDate(undefined)
    toast({
      title: "Date Filter Cleared",
      description: "Showing logs from all dates.",
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">
            Inspect logs from all agents and cloud services for debugging and auditing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || liveStream}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                Severity Levels
                <span className="ml-auto bg-primary/10 text-primary text-xs rounded px-1">
                  {selectedSeverities.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Severity Levels</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {severityLevels.map((level) => (
                <DropdownMenuCheckboxItem
                  key={level.id}
                  checked={selectedSeverities.includes(level.id)}
                  onCheckedChange={() => toggleSeverity(level.id)}
                >
                  {level.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
                {date && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearDateFilter()
                    }}
                  >
                    ×
                  </Button>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Switch id="live-stream" checked={liveStream} onCheckedChange={handleLiveStreamChange} />
          <Label htmlFor="live-stream">Live Stream</Label>
        </div>
      </div>
    </div>
  )
}

"use client"

import { format } from "date-fns"
import { Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { LogEntry } from "@/components/logs/logs-view"
import { JsonViewer } from "@/components/logs/json-viewer"
import { useToast } from "@/hooks/use-toast"

interface LogDetailDrawerProps {
  log: LogEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogDetailDrawer({ log, open, onOpenChange }: LogDetailDrawerProps) {
  const { toast } = useToast()

  if (!log) return null

  const copyLogToClipboard = () => {
    const logText = JSON.stringify(log, null, 2)
    navigator.clipboard.writeText(logText)
    toast({
      title: "Copied to clipboard",
      description: "Log details have been copied to your clipboard.",
    })
  }

  // Get severity color
  const getSeverityColor = (severity: LogEntry["severity"]) => {
    switch (severity) {
      case "info":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      case "critical":
        return "text-purple-500"
      default:
        return ""
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Log Details</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Header info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={getSeverityColor(log.severity)}>{log.severity.toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">{format(log.timestamp, "PPpp")}</span>
                </div>
                <h3 className="text-lg font-semibold">{log.message}</h3>
              </div>

              <Separator />

              {/* Log metadata */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Log Information</h4>
                <div className="grid grid-cols-3 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Log ID:</span>
                  <span className="col-span-2 font-mono">{log.id}</span>

                  <span className="text-muted-foreground">Agent:</span>
                  <span className="col-span-2">
                    {log.agentName} ({log.agentId})
                  </span>

                  <span className="text-muted-foreground">Source:</span>
                  <span className="col-span-2">{log.source}</span>

                  {log.taskId && (
                    <>
                      <span className="text-muted-foreground">Task ID:</span>
                      <span className="col-span-2 font-mono">{log.taskId}</span>
                    </>
                  )}

                  {log.tags && log.tags.length > 0 && (
                    <>
                      <span className="text-muted-foreground">Tags:</span>
                      <div className="col-span-2 flex flex-wrap gap-1">
                        {log.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Full message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Full Message</h4>
                  <Button variant="ghost" size="sm" onClick={copyLogToClipboard}>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">{log.message}</div>
              </div>

              {/* JSON metadata */}
              {log.metadata && (
                <>
                  <Separator />
                  <JsonViewer data={log.metadata} title="Metadata" />
                </>
              )}

              {/* Related links */}
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Related Links</h4>
                <div className="space-y-2">
                  {log.taskId && (
                    <Button variant="link" className="h-auto p-0">
                      View Related Task ({log.taskId})
                    </Button>
                  )}
                  <Button variant="link" className="h-auto p-0">
                    View Agent Logs ({log.agentName})
                  </Button>
                  <Button variant="link" className="h-auto p-0">
                    View in Google Cloud Logging
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4 flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

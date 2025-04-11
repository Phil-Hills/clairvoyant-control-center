"use client"

import { format } from "date-fns"
import { Copy, Eye, EyeOff, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SecretDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  secret: any
  isRevealed: boolean
  onReveal: () => void
  onHide: () => void
  onCopy: () => void
  onDelete: () => void
  onEdit: () => void
}

export function SecretDetailDrawer({
  open,
  onOpenChange,
  secret,
  isRevealed,
  onReveal,
  onHide,
  onCopy,
  onDelete,
  onEdit,
}: SecretDetailDrawerProps) {
  if (!secret) return null

  const formatSecretValue = () => {
    if (!isRevealed) {
      if (secret.type === "json-blob") {
        return "{ ... }"
      }
      return "••••••••••••••••••••••"
    }

    if (secret.type === "json-blob") {
      try {
        const parsed = JSON.parse(secret.value)
        return JSON.stringify(parsed, null, 2)
      } catch {
        return secret.value
      }
    }

    return secret.value
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Secret Details</SheetTitle>
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
                  <h3 className="text-lg font-semibold font-mono">{secret.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {secret.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Auto-Rotation: {secret.autoRotation ? <span className="text-green-500">Enabled</span> : "Disabled"}
                  </span>
                  <span>•</span>
                  <span>
                    Last Accessed:{" "}
                    {secret.lastAccessed ? format(secret.lastAccessed, "MMM d, yyyy 'at' h:mm a") : "Never"}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Secret Value */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Secret Value</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={isRevealed ? onHide : onReveal}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={onCopy}>
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-64">
                  <pre className="text-xs font-mono whitespace-pre-wrap">{formatSecretValue()}</pre>
                </div>
              </div>

              <Separator />

              {/* Used By */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Used By</h4>
                <div className="flex flex-wrap gap-2">
                  {secret.usedBy.map((agent: string) => (
                    <Badge key={agent} variant="secondary">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Audit Log */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Audit Log</h4>
                <div className="bg-muted rounded-md p-3">
                  <div className="space-y-2">
                    {secret.auditLog.map((entry: any, index: number) => (
                      <div key={index} className="text-xs">
                        <span className="text-muted-foreground">{format(entry.timestamp, "MMM d, yyyy h:mm a")}</span>
                        <span className="ml-2">
                          {entry.action === "accessed" ? "Accessed by" : "Created by"}{" "}
                          <span className="font-medium">{entry.agent}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security Warning */}
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertDescription>
                  This secret is sensitive information. Do not share it with unauthorized personnel.
                </AlertDescription>
              </Alert>
            </div>
          </ScrollArea>

          <div className="border-t p-4 flex justify-between">
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Secret
            </Button>
            <Button variant="default" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Secret
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

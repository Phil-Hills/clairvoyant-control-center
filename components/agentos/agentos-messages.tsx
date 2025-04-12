"use client"

import type React from "react"

import type { ReactNode } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Terminal, User } from "lucide-react"
import { formatDistance } from "date-fns"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Import syntax highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface AgentOSMessagesProps {
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    action?: "blueprint" | "logs" | "info" | null
    data?: any
    isLoading?: boolean
  }>
  onDeployBlueprint: (blueprint: any) => void
  onCopyBlueprint: (blueprint: any) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function AgentOSMessages({
  messages,
  onDeployBlueprint,
  onCopyBlueprint,
  messagesEndRef,
}: AgentOSMessagesProps) {
  const renderMessageContent = (message: AgentOSMessagesProps["messages"][0]): ReactNode => {
    const parts = message.content.split("```")

    if (parts.length === 1) {
      // No code blocks, just regular text
      return <div className="whitespace-pre-wrap">{message.content}</div>
    }

    // Handle content with code blocks
    return parts.map((part, index) => {
      // Even indices are regular text
      if (index % 2 === 0) {
        return part ? (
          <div key={`text-${index}`} className="whitespace-pre-wrap mb-3">
            {part}
          </div>
        ) : null
      }

      // Odd indices are code blocks
      // Extract language if specified (e.g. ```json)
      const firstLineBreak = part.indexOf("\n")
      const language = firstLineBreak > 0 ? part.substring(0, firstLineBreak).trim() : ""
      const code = firstLineBreak > 0 ? part.substring(firstLineBreak + 1) : part

      return (
        <div key={`code-${index}`} className="relative mb-3 rounded-md overflow-hidden">
          <div className="absolute right-2 top-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-primary/10 hover:bg-primary/20"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
          <SyntaxHighlighter
            language={language || "javascript"}
            style={vscDarkPlus}
            customStyle={{ margin: 0, borderRadius: "0.375rem" }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )
    })
  }

  // Render action-specific UI based on message action type
  const renderActionUI = (message: AgentOSMessagesProps["messages"][0]) => {
    if (!message.action || !message.data) return null

    if (message.action === "blueprint") {
      return (
        <Card className="mt-4 overflow-hidden border-green-500/20">
          <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/20">
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
              Proposed Blueprint
            </Badge>
          </div>
          <div className="p-4 max-h-[300px] overflow-auto">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{ margin: 0, borderRadius: "0.375rem" }}
            >
              {JSON.stringify(message.data, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div className="bg-card px-4 py-2 border-t border-border flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => onCopyBlueprint(message.data)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Blueprint
            </Button>
            <Button size="sm" onClick={() => onDeployBlueprint(message.data)}>
              Deploy Now
            </Button>
          </div>
        </Card>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex items-start gap-4 max-w-4xl", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
        >
          <div className={cn("flex-shrink-0", message.role === "user" ? "mt-2" : "mt-1")}>
            {message.role === "assistant" ? (
              <Avatar className="h-8 w-8 bg-primary/10">
                <Terminal className="h-4 w-4 text-primary" />
              </Avatar>
            ) : (
              <Avatar className="h-7 w-7 bg-muted">
                <User className="h-4 w-4" />
              </Avatar>
            )}
          </div>
          <div className={cn("flex flex-col gap-1 min-w-0", message.role === "user" ? "items-end" : "")}>
            <div
              className={cn(
                "rounded-lg px-4 py-3 max-w-prose",
                message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              {message.isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ) : (
                renderMessageContent(message)
              )}
            </div>

            {!message.isLoading && renderActionUI(message)}

            <span className="text-xs text-muted-foreground px-1">
              {formatDistance(message.timestamp, new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

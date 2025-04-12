"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, TerminalSquare, Send, Loader2 } from "lucide-react"

interface AgentOSInputProps {
  onSubmit: (command: string) => void
  isLoading: boolean
}

export function AgentOSInput({ onSubmit, isLoading }: AgentOSInputProps) {
  const [command, setCommand] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim() || isLoading) return

    onSubmit(command)
    setCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Quick command templates
  const quickCommands = [
    {
      label: "Deploy Cloud Function",
      command: "Create a Cloud Function that processes images from Cloud Storage and sends a notification",
      icon: TerminalSquare,
    },
    {
      label: "Health Checker",
      command: "Deploy a health checker that monitors my APIs and alerts me when they're down",
      icon: Bot,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={isLoading ? "Waiting for response..." : "Send a message..."}
          className="min-h-[60px] resize-none pb-12 text-base"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2">
          <Button type="submit" size="icon" disabled={!command.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      {/* Quick command buttons */}
      {!isLoading && !command && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground py-1 px-2">Try:</span>
          {quickCommands.map((cmd, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setCommand(cmd.command)}
            >
              <cmd.icon className="h-3 w-3" />
              {cmd.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

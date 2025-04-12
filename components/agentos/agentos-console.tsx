"use client"

import { useState, useRef, useEffect } from "react"
import { AgentOSInput } from "@/components/agentos/agentos-input"
import { AgentOSMessages } from "@/components/agentos/agentos-messages"
import { StatusPanel } from "@/components/agentos/status-panel"
import { NotificationCenter } from "@/components/agentos/notification-center"
import { ProjectSelector } from "@/components/agentos/project-selector"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: "blueprint" | "logs" | "info" | null
  data?: any
  isLoading?: boolean
}

export function AgentOSConsole() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to AgentOS Console. I'm connected to project: ${process.env.PROJECT_ID || "Not configured"} and notification topic: ${process.env.NOTIFICATION_TOPIC || "Not configured"}. How can I help you manage your Google Cloud infrastructure today?`,
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isStatusPanelOpen, setIsStatusPanelOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (command: string) => {
    if (!command.trim() || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: command,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Add loading message
    const loadingId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ])
    setIsProcessing(true)

    try {
      // Simulating API call for now
      const response = await fetch("/api/agentos/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          notificationTopic: process.env.NOTIFICATION_TOPIC,
          projectId: process.env.PROJECT_ID,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from agent")
      }

      const data = await response.json()

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: data.message,
                action: data.action,
                data: data.data,
                isLoading: false,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error communicating with agent:", error)

      // Replace loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: "Sorry, I encountered an error while processing your request. Please try again.",
                isLoading: false,
              }
            : msg,
        ),
      )

      toast({
        title: "Communication Error",
        description: "Failed to communicate with the agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeployBlueprint = async (blueprint: any) => {
    try {
      setIsProcessing(true)

      // Simulating deployment API call
      const response = await fetch("/api/admin-agent/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blueprint,
          notificationTopic: process.env.NOTIFICATION_TOPIC,
          projectId: process.env.PROJECT_ID,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to deploy blueprint")
      }

      const result = await response.json()

      // Add system message about successful deployment
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "assistant",
          content: `✅ Blueprint deployed successfully to project ${process.env.PROJECT_ID}! Deployment ID: ${result.deploymentId}`,
          timestamp: new Date(),
        },
      ])

      toast({
        title: "Deployment Successful",
        description: `Your GCP resources have been deployed to ${process.env.PROJECT_ID}.`,
      })
    } catch (error) {
      console.error("Error deploying blueprint:", error)

      // Add system message about failed deployment
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "assistant",
          content: `❌ Failed to deploy blueprint to project ${process.env.PROJECT_ID}. Please check your configuration and try again.`,
          timestamp: new Date(),
        },
      ])

      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your resources.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyBlueprint = (blueprint: any) => {
    navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2))
    toast({
      title: "Blueprint Copied",
      description: "Blueprint JSON has been copied to clipboard",
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-lg font-semibold">AgentOS Console</h1>
        <div className="flex items-center gap-2">
          <ProjectSelector />
          <NotificationCenter />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsStatusPanelOpen(!isStatusPanelOpen)}
          >
            {isStatusPanelOpen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-auto p-6">
            <AgentOSMessages
              messages={messages}
              onDeployBlueprint={handleDeployBlueprint}
              onCopyBlueprint={handleCopyBlueprint}
              messagesEndRef={messagesEndRef}
            />
          </div>
          <div className="border-t p-4 sticky bottom-0 bg-background">
            <AgentOSInput onSubmit={handleSubmit} isLoading={isProcessing} />
          </div>
        </div>

        <div
          className={cn(
            "border-l h-[calc(100vh-6rem)] overflow-auto transition-all duration-300",
            isStatusPanelOpen ? "w-80 xl:w-96" : "w-0",
            "hidden lg:block lg:w-80 xl:w-96",
          )}
        >
          <StatusPanel />
        </div>
      </div>
    </div>
  )
}

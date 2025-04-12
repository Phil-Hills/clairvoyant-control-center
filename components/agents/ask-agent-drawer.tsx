"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, RefreshCw, Sparkles, Terminal, FileText, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for agents
const agents = [
  { id: "admin", name: "Admin", description: "System administrator with full access", avatar: "A" },
  { id: "logbot", name: "LogBot", description: "Log analysis and monitoring specialist", avatar: "L" },
  { id: "builder", name: "Builder", description: "Infrastructure and deployment expert", avatar: "B" },
]

// Mock data for chat history
const initialChatHistory = [
  {
    id: "1",
    agent: "admin",
    content: "Hello! I'm the Admin agent. How can I assist you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: "agent",
  },
]

interface Message {
  id: string
  agent: string
  content: string
  timestamp: Date
  type: "user" | "agent"
  isCommand?: boolean
  commandType?: "debug" | "create" | "summarize" | "other"
}

export function AskAgentDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedAgent, setSelectedAgent] = useState("admin")
  const [inputValue, setInputValue] = useState("")
  const [chatHistory, setChatHistory] = useState<Message[]>(initialChatHistory)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleSubmit = async () => {
    if (!inputValue.trim()) return

    // Check if input is a command
    const isCommand = inputValue.startsWith("/")
    let commandType: "debug" | "create" | "summarize" | "other" | undefined

    if (isCommand) {
      if (inputValue.startsWith("/debug")) {
        commandType = "debug"
      } else if (inputValue.startsWith("/create")) {
        commandType = "create"
      } else if (inputValue.startsWith("/summarize")) {
        commandType = "summarize"
      } else {
        commandType = "other"
      }
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      agent: selectedAgent,
      content: inputValue,
      timestamp: new Date(),
      type: "user",
      isCommand,
      commandType,
    }

    setChatHistory((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      let responseContent = ""

      if (isCommand) {
        switch (commandType) {
          case "debug":
            responseContent = "Debug mode activated. Analyzing agent logs and execution traces..."
            break
          case "create":
            responseContent = "Creating new agent configuration. Please provide the agent specifications."
            break
          case "summarize":
            responseContent = "Generating log summary for the past 24 hours. Found 3 errors and 2 warnings."
            break
          default:
            responseContent = `Command not recognized. Available commands: /debug, /create, /summarize`
        }
      } else {
        // Regular response
        const responses = [
          "I've analyzed the data and found some interesting patterns in your agent activity.",
          "Your cloud resources are currently operating at optimal capacity.",
          "I've detected a potential issue with one of your agent configurations. Would you like me to fix it?",
          "The latest deployment was successful. All systems are operational.",
        ]
        responseContent = responses[Math.floor(Math.random() * responses.length)]
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        agent: selectedAgent,
        content: responseContent,
        timestamp: new Date(),
        type: "agent",
      }

      setChatHistory((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const getCommandIcon = (commandType?: string) => {
    switch (commandType) {
      case "debug":
        return <Terminal className="h-4 w-4 text-yellow-500" />
      case "create":
        return <Sparkles className="h-4 w-4 text-green-500" />
      case "summarize":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const selectedAgentData = agents.find((agent) => agent.id === selectedAgent)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <DrawerTitle>Ask an Agent</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="pt-2">Select an agent and ask questions or issue commands</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col h-full">
          <div className="border-b p-4">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{agent.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{agent.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{agent.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 max-w-[80%]", message.type === "user" ? "ml-auto" : "mr-auto")}
                >
                  {message.type === "agent" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{agents.find((a) => a.id === message.agent)?.avatar || "A"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.isCommand && (
                      <div className="flex items-center gap-2 mb-1">
                        {getCommandIcon(message.commandType)}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            message.commandType === "debug" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                            message.commandType === "create" && "bg-green-500/10 text-green-500 border-green-500/20",
                            message.commandType === "summarize" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                            message.commandType === "other" && "bg-red-500/10 text-red-500 border-red-500/20",
                          )}
                        >
                          {message.commandType || "command"}
                        </Badge>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{selectedAgentData?.avatar || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedAgentData?.name} a question or use /commands...`}
                className="min-h-[80px] flex-1"
              />
              <Button onClick={handleSubmit} disabled={isLoading || !inputValue.trim()} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Try commands: <span className="font-mono">/debug</span>, <span className="font-mono">/create</span>,{" "}
              <span className="font-mono">/summarize logs</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

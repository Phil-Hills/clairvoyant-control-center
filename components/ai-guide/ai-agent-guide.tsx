"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  X,
  Send,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Terminal,
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isCommand?: boolean
  commandType?: string
  isStreaming?: boolean
}

export function AIAgentGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi there! I'm your AI Agent Guide. How can I help you with Clairvoyant Control Center today?",
      timestamp: new Date(),
    },
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Check if it's a command
    const isCommand = inputValue.startsWith("/")
    let commandType = ""

    if (isCommand) {
      const commandParts = inputValue.slice(1).split(" ")
      commandType = commandParts[0]
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      isCommand,
      commandType: isCommand ? commandType : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Add streaming placeholder
    const streamingId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: streamingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      },
    ])
    setIsStreaming(true)

    // Simulate streaming response
    let response = ""
    let streamInterval: NodeJS.Timeout

    if (isCommand) {
      switch (commandType) {
        case "status":
          response =
            "**System Status**\n\n8 agents active\n3 agents idle\n1 agent in error state\n\nAll GCP services operational\nVertex AI: 42% quota used\nLast deployment: 2 hours ago (successful)"
          break
        case "create-agent":
          response =
            "Initiating agent creation wizard...\n\nPlease provide the following information:\n1. Agent name\n2. Agent purpose\n3. Trigger type (schedule, event, manual)\n\nOr use the visual builder at /agents/create"
          break
        case "summarize":
          response =
            "**Log Summary (Last 24h)**\n\n- 1,243 INFO entries\n- 87 WARN entries\n- 12 ERROR entries\n\nMost frequent error: 'Connection timeout to Vertex AI endpoint'\nAffected agents: ContentAnalyzer, DataProcessor\n\nRecommendation: Check network connectivity to Vertex AI"
          break
        case "debug":
          response =
            "**Debug Mode: function-crash**\n\nAnalyzing crash reports...\n\nFound issue in DataProcessor agent:\n```\nError: Cannot read property 'data' of undefined\nat processData (function-xyz123.js:42)\n```\n\nPossible fix: Add null check before accessing data property"
          break
        default:
          response = `Command not recognized: /${commandType}\n\nAvailable commands:\n/status - Check system status\n/create-agent - Start agent creation\n/summarize logs - Summarize recent logs\n/debug [issue] - Debug specific issues`
      }
    } else {
      // Regular responses
      const queries = {
        agent:
          "Agents are autonomous AI workers that perform specific tasks in your Google Cloud environment. They can process data, analyze content, send notifications, and more.",
        memory:
          "Agent memory is the contextual state that persists between executions. You can view and modify agent memory in the Memory Viewer page.",
        logs: "Logs are available in the Logs page. You can filter by agent, severity, and time range to troubleshoot issues.",
        settings:
          "You can configure your platform in the Settings page. This includes GCP integration, agent behavior, and appearance preferences.",
        default:
          "I'm your AI assistant for the Clairvoyant Control Center. I can help you with agents, tasks, logs, resources, and more. Try asking a specific question or use commands like /status.",
      }

      // Determine which response to use
      const lowerInput = userMessage.content.toLowerCase()
      if (lowerInput.includes("agent")) response = queries.agent
      else if (lowerInput.includes("memory")) response = queries.memory
      else if (lowerInput.includes("log")) response = queries.logs
      else if (lowerInput.includes("setting")) response = queries.settings
      else response = queries.default
    }

    // Simulate streaming
    let streamedText = ""
    let charIndex = 0

    streamInterval = setInterval(() => {
      if (charIndex < response.length) {
        streamedText += response[charIndex]
        setMessages((prev) =>
          prev.map((msg) => (msg.id === streamingId ? { ...msg, content: streamedText, isStreaming: true } : msg)),
        )
        charIndex++
      } else {
        clearInterval(streamInterval)
        setMessages((prev) => prev.map((msg) => (msg.id === streamingId ? { ...msg, isStreaming: false } : msg)))
        setIsStreaming(false)
      }
    }, 15) // Adjust speed as needed

    return () => clearInterval(streamInterval)
  }

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)

    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard",
      duration: 2000,
    })

    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getCommandIcon = (commandType?: string) => {
    switch (commandType) {
      case "status":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "create-agent":
        return <Plus className="h-4 w-4 text-green-500" />
      case "summarize":
        return <FileText className="h-4 w-4 text-yellow-500" />
      case "debug":
        return <Terminal className="h-4 w-4 text-red-500" />
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "fixed z-50 flex flex-col shadow-lg transition-all duration-300",
          isExpanded ? "inset-4" : "bottom-4 right-4 h-[550px] w-[380px] max-w-[calc(100vw-2rem)]",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">AI Agent Guide</span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{isExpanded ? "Minimize" : "Maximize"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Close</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "group flex max-w-[90%] flex-col gap-2 rounded-lg p-3",
                    message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.isCommand && (
                    <div className="flex items-center gap-2 mb-1">
                      {getCommandIcon(message.commandType)}
                      <Badge variant="outline" className="text-xs">
                        {message.commandType || "command"}
                      </Badge>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">
                    {message.content}
                    {message.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                    {message.role === "assistant" && message.content && !message.isStreaming && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCopyMessage(message.content, message.id)}
                      >
                        {copiedId === message.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask for help or type a command..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isStreaming || !inputValue.trim()}>
              {isStreaming ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>

        <div className="px-4 pb-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setInputValue("/status")}>
            /status
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInputValue("/create-agent")}>
            /create-agent
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInputValue("/summarize logs")}>
            /summarize logs
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInputValue("/debug function-crash")}>
            /debug function-crash
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AIAgentGuideContextType {
  isOpen: boolean
  toggleGuide: () => void
  openGuide: () => void
  closeGuide: () => void
  messages: Message[]
  addMessage: (message: Omit<Message, "id">) => void
  clearMessages: () => void
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const AIAgentGuideContext = createContext<AIAgentGuideContextType | undefined>(undefined)

export function AIAgentGuideProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI Agent Guide. How can I help you with Clairvoyant Control Center today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])

  const toggleGuide = () => setIsOpen(!isOpen)
  const openGuide = () => setIsOpen(true)
  const closeGuide = () => setIsOpen(false)

  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
    }
    setMessages([...messages, newMessage])

    // If it's a user message, simulate an assistant response
    if (message.role === "user") {
      setTimeout(() => {
        const responses: Record<string, string> = {
          help: "I can help you with creating agents, monitoring tasks, checking logs, and managing resources. What would you like to know more about?",
          create:
            "To create a new agent, go to the Agents page and click the 'Create Agent' button. You'll need to provide a name, description, and configure the agent's behavior.",
          running:
            "Currently, you have 8 active agents running in your environment. Would you like to see their status or manage them?",
          resources:
            "Your GCP resources are currently at 42% utilization. All services are operating normally with no alerts.",
          default:
            "I can help you with various aspects of the Clairvoyant Control Center. Try asking about creating agents, checking status, or managing resources.",
        }

        let responseContent = responses.default
        const lowerContent = message.content.toLowerCase()

        if (lowerContent.includes("help")) responseContent = responses.help
        else if (lowerContent.includes("create") || lowerContent.includes("new agent"))
          responseContent = responses.create
        else if (lowerContent.includes("running") || lowerContent.includes("status"))
          responseContent = responses.running
        else if (lowerContent.includes("resource") || lowerContent.includes("usage"))
          responseContent = responses.resources

        const assistantResponse: Message = {
          id: Math.random().toString(36).substring(2, 9),
          content: responseContent,
          role: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantResponse])
      }, 1000)
    }
  }

  const clearMessages = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI Agent Guide. How can I help you with Clairvoyant Control Center today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <AIAgentGuideContext.Provider
      value={{
        isOpen,
        toggleGuide,
        openGuide,
        closeGuide,
        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AIAgentGuideContext.Provider>
  )
}

export function useAIAgentGuide() {
  const context = useContext(AIAgentGuideContext)
  if (context === undefined) {
    throw new Error("useAIAgentGuide must be used within an AIAgentGuideProvider")
  }
  return context
}

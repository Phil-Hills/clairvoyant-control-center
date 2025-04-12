"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  source: string
  read: boolean
}

// This would normally connect to your backend which listens to the Pub/Sub topic
export function useNotificationService() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  // Simulate connecting to the notification topic
  useEffect(() => {
    console.log(`Connecting to notification topic: ${process.env.NOTIFICATION_TOPIC}`)

    // Simulate receiving notifications
    const interval = setInterval(() => {
      // Only add a notification occasionally (20% chance)
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          title: getRandomTitle(),
          message: getRandomMessage(),
          type: getRandomType(),
          timestamp: new Date(),
          source: getRandomSource(),
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)) // Keep last 50 notifications
        setUnreadCount((prev) => prev + 1)

        // Show toast for important notifications
        if (newNotification.type === "error" || newNotification.type === "warning") {
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === "error" ? "destructive" : "default",
          })
        }
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [toast])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  }
}

// Helper functions for generating random notifications
function getRandomTitle(): string {
  const titles = [
    "Agent Deployed",
    "Task Completed",
    "Resource Created",
    "Function Error",
    "Memory Limit Reached",
    "New Log Entry",
    "API Endpoint Down",
    "Scheduled Task Started",
    "Authentication Failed",
    "Database Backup Complete",
  ]
  return titles[Math.floor(Math.random() * titles.length)]
}

function getRandomMessage(): string {
  const messages = [
    "The agent has been successfully deployed to production.",
    "Task #4872 has completed processing 1,245 items.",
    "New Cloud Function 'image-processor' has been created.",
    "Error in function 'data-analyzer': Out of memory.",
    "Agent 'health-monitor' has reached 85% of memory limit.",
    "Critical log entry detected in 'authentication-service'.",
    "API endpoint 'api.example.com/status' is not responding.",
    "Daily data processing task has started.",
    "Failed login attempt from unauthorized IP address.",
    "Weekly database backup completed successfully.",
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

function getRandomType(): "info" | "success" | "warning" | "error" {
  const types: ("info" | "success" | "warning" | "error")[] = ["info", "success", "warning", "error"]
  return types[Math.floor(Math.random() * types.length)]
}

function getRandomSource(): string {
  const sources = [
    "HealthMonitor",
    "DataProcessor",
    "NotificationService",
    "AuthService",
    "BackupManager",
    "APIGateway",
    "LogAnalyzer",
    "SecurityScanner",
  ]
  return sources[Math.floor(Math.random() * sources.length)]
}

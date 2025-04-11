"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Calendar, MessageSquare, Hand } from "lucide-react"
import cronstrue from "cronstrue"

interface TriggersSectionProps {
  agentConfig: any
  onEdit: () => void
}

export function TriggersSection({ agentConfig, onEdit }: TriggersSectionProps) {
  // Function to parse and display cron expression in human-readable format
  const getCronDescription = (cron: string) => {
    try {
      return cronstrue.toString(cron)
    } catch (error) {
      return "Invalid cron expression"
    }
  }

  // Function to get the appropriate icon for the trigger type
  const getTriggerIcon = () => {
    switch (agentConfig.triggerType) {
      case "manual":
        return <Hand className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "pubsub":
        return <MessageSquare className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trigger Configuration</CardTitle>
            <CardDescription>How and when your agent will be triggered to run</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Triggers</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Trigger Type:</span>
            <Badge className="capitalize flex items-center gap-1">
              {getTriggerIcon()}
              {agentConfig.triggerType}
            </Badge>
          </div>

          {agentConfig.triggerType === "scheduled" && agentConfig.cronExpression && (
            <>
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">Schedule:</span>
                <span className="text-sm font-mono">{agentConfig.cronExpression}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">Runs:</span>
                <span className="text-sm max-w-[70%] text-right">{getCronDescription(agentConfig.cronExpression)}</span>
              </div>
            </>
          )}

          {agentConfig.triggerType === "pubsub" && (
            <>
              {agentConfig.pubsubTopic && (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Pub/Sub Topic:</span>
                  <span className="text-sm max-w-[300px] truncate">{agentConfig.pubsubTopic}</span>
                </div>
              )}

              {agentConfig.pubsubSubscription && (
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Subscription:</span>
                  <span className="text-sm">{agentConfig.pubsubSubscription}</span>
                </div>
              )}
            </>
          )}

          {agentConfig.triggerType === "manual" && (
            <div className="text-sm text-muted-foreground">
              This agent will only run when manually triggered via the API or UI.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

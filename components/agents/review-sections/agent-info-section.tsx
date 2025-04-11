"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"

interface AgentInfoSectionProps {
  agentConfig: any
  onEdit: () => void
}

export function AgentInfoSection({ agentConfig, onEdit }: AgentInfoSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>Basic details about your agent</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Agent Information</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Name:</span>
            <span className="text-sm">{agentConfig.name}</span>
          </div>

          {agentConfig.description && (
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Description:</span>
              <span className="text-sm max-w-[70%] text-right">{agentConfig.description}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Environment:</span>
            <Badge variant="outline" className="capitalize">
              {agentConfig.environment}
            </Badge>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Region:</span>
            <span className="text-sm">{agentConfig.region}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

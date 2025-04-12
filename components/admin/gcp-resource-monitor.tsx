"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Clock, Cloud, ActivityIcon as Function, Key, MessageSquare, XCircle } from "lucide-react"

export function GcpResourceMonitor() {
  // Mock data for GCP resources
  const resources = {
    functions: [
      { name: "agent-log-analyzer", status: "active", region: "us-central1", usage: 65 },
      { name: "agent-data-processor", status: "active", region: "us-east1", usage: 30 },
      { name: "agent-alert-notifier", status: "error", region: "us-west1", usage: 0 },
    ],
    vertexAi: [
      { name: "text-bison-endpoint", status: "active", region: "us-central1", usage: 80 },
      { name: "gemini-pro-endpoint", status: "active", region: "us-central1", usage: 45 },
    ],
    pubsub: [
      { name: "agent-events", status: "active", messageRate: "12/min" },
      { name: "log-stream", status: "active", messageRate: "45/min" },
      { name: "alerts", status: "active", messageRate: "2/min" },
    ],
    scheduler: [
      { name: "daily-report-job", status: "active", schedule: "0 8 * * *" },
      { name: "hourly-scan", status: "active", schedule: "0 * * * *" },
      { name: "weekly-cleanup", status: "active", schedule: "0 0 * * 0" },
    ],
    secrets: [
      { name: "API_KEY_OPENAI", lastRotated: "30 days ago" },
      { name: "DATABASE_CONNECTION", lastRotated: "15 days ago" },
      { name: "SLACK_WEBHOOK", lastRotated: "45 days ago" },
    ],
  }

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="functions">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Function className="h-5 w-5 text-blue-500" />
              <span>Cloud Functions</span>
              <Badge className="ml-2">{resources.functions.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.functions.map((func) => (
                <Card key={func.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(func.status)}
                        <span className="font-medium">{func.name}</span>
                      </div>
                      <Badge variant="outline">{func.region}</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usage</span>
                        <span>{func.usage}%</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Progress value={func.usage} className="h-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current usage: {func.usage}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="vertexAi">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-purple-500" />
              <span>Vertex AI Endpoints</span>
              <Badge className="ml-2">{resources.vertexAi.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.vertexAi.map((endpoint) => (
                <Card key={endpoint.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(endpoint.status)}
                        <span className="font-medium">{endpoint.name}</span>
                      </div>
                      <Badge variant="outline">{endpoint.region}</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usage</span>
                        <span>{endpoint.usage}%</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Progress value={endpoint.usage} className="h-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current usage: {endpoint.usage}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pubsub">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <span>Pub/Sub Topics</span>
              <Badge className="ml-2">{resources.pubsub.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.pubsub.map((topic) => (
                <Card key={topic.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(topic.status)}
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <Badge variant="outline">{topic.messageRate}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scheduler">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span>Scheduler Jobs</span>
              <Badge className="ml-2">{resources.scheduler.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.scheduler.map((job) => (
                <Card key={job.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="font-medium">{job.name}</span>
                      </div>
                      <Badge variant="outline">{job.schedule}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="secrets">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-500" />
              <span>Secrets</span>
              <Badge className="ml-2">{resources.secrets.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2">
              {resources.secrets.map((secret) => (
                <Card key={secret.name} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{secret.name}</span>
                      <Badge variant="outline">Last rotated: {secret.lastRotated}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

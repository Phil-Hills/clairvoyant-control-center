"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Clock, Edit, Terminal, Code, Database, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AgentMemoryCardProps {
  agent: any
  onEdit: () => void
}

export function AgentMemoryCard({ agent, onEdit }: AgentMemoryCardProps) {
  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <CardTitle className="text-base">{agent.name}</CardTitle>
            </div>
            <Badge
              variant="outline"
              className={cn(
                agent.status === "active" && "bg-green-500/10 text-green-500 border-green-500/20",
                agent.status === "idle" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                agent.status === "error" && "bg-red-500/10 text-red-500 border-red-500/20",
              )}
            >
              {agent.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <div>
              <strong>Role:</strong> {agent.role}
            </div>
            <div>
              <strong>Purpose:</strong> {agent.purpose}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {agent.type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {agent.environment}
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(agent.lastActivity).toLocaleTimeString()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Last activity: {new Date(agent.lastActivity).toLocaleString()}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="memory" className="w-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="memory" className="flex-1">
                <Database className="h-3 w-3 mr-1" />
                Memory
              </TabsTrigger>
              <TabsTrigger value="commands" className="flex-1">
                <Terminal className="h-3 w-3 mr-1" />
                Commands
              </TabsTrigger>
            </TabsList>
            <TabsContent value="memory" className="p-0">
              <ScrollArea className="h-[200px] p-4">
                <div className="space-y-4">
                  {Object.entries(agent.memory).map(([section, data]: [string, any]) => (
                    <div key={section}>
                      <h4 className="text-sm font-medium capitalize mb-1 flex items-center">
                        {section === "context" && <Activity className="h-3 w-3 mr-1" />}
                        {section === "variables" && <Code className="h-3 w-3 mr-1" />}
                        {section === "state" && <Database className="h-3 w-3 mr-1" />}
                        {section}
                      </h4>
                      <div className="text-xs space-y-1">
                        {Object.entries(data).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex">
                            <span className="font-mono text-muted-foreground mr-2">{key}:</span>
                            <span className="font-mono">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="commands" className="p-0">
              <ScrollArea className="h-[200px] p-4">
                <div className="space-y-2">
                  {agent.lastCommands.map((cmd: any, index: number) => (
                    <div key={index} className="text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(cmd.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="font-mono bg-muted p-2 rounded-md overflow-x-auto">
                        <Terminal className="h-3 w-3 inline-block mr-1" />
                        {cmd.command}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
            <Edit className="mr-2 h-3 w-3" />
            Modify Memory
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}

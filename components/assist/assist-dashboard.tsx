"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummarizationPanel } from "./summarization-panel"
import { KnowledgeAssistPanel } from "./knowledge-assist-panel"
import { SmartReplyPanel } from "./smart-reply-panel"
import { BuildYourOwnAssistPanel } from "./build-your-own-assist-panel"
import { SimulatorPanel } from "./simulator-panel"
import { AgentspacePanel } from "./agentspace-panel"
import { FileText, BookOpen, MessageSquare, Wrench, PlayCircle, Database } from "lucide-react"

export function AssistDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Assist & Agentspace</h1>
        <p className="text-muted-foreground">Advanced AI assistance tools powered by Google Cloud Vertex AI</p>
      </div>

      <Tabs defaultValue="summarization" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="summarization" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Summarization</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="smart-reply" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Smart Reply</span>
          </TabsTrigger>
          <TabsTrigger value="build-assist" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden md:inline">Build Assist</span>
          </TabsTrigger>
          <TabsTrigger value="simulator" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            <span className="hidden md:inline">Simulator</span>
          </TabsTrigger>
          <TabsTrigger value="agentspace" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden md:inline">Agentspace</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summarization" className="mt-0">
          <SummarizationPanel />
        </TabsContent>

        <TabsContent value="knowledge" className="mt-0">
          <KnowledgeAssistPanel />
        </TabsContent>

        <TabsContent value="smart-reply" className="mt-0">
          <SmartReplyPanel />
        </TabsContent>

        <TabsContent value="build-assist" className="mt-0">
          <BuildYourOwnAssistPanel />
        </TabsContent>

        <TabsContent value="simulator" className="mt-0">
          <SimulatorPanel />
        </TabsContent>

        <TabsContent value="agentspace" className="mt-0">
          <AgentspacePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

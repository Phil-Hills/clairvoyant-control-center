"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskTable } from "@/components/tasks/task-table"
import { Card } from "@/components/ui/card"
import { BarChart } from "lucide-react"

export function TaskQueueTabs() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <Card className="p-2 flex items-center gap-2 text-xs text-muted-foreground">
          <BarChart className="h-4 w-4" />
          <span>
            {activeTab === "all" && "Processing 12 tasks/min"}
            {activeTab === "in-progress" && "5 tasks currently running"}
            {activeTab === "completed" && "87 tasks completed today"}
            {activeTab === "failed" && "3 tasks failed in last hour"}
          </span>
        </Card>
      </div>

      <TabsContent value="all" className="space-y-4">
        <TaskTable filterStatus={null} />
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-4">
        <TaskTable filterStatus="running" />
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        <TaskTable filterStatus="success" />
      </TabsContent>

      <TabsContent value="failed" className="space-y-4">
        <TaskTable filterStatus="failed" />
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskTable } from "./task-table"

export function TaskQueueTabs() {
  const [activeTab, setActiveTab] = useState("all")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="retrying">Retrying</TabsTrigger>
          <TabsTrigger value="queued">Queued</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all">
        <TaskTable filterStatus={null} />
      </TabsContent>
      <TabsContent value="running">
        <TaskTable filterStatus="running" />
      </TabsContent>
      <TabsContent value="success">
        <TaskTable filterStatus="success" />
      </TabsContent>
      <TabsContent value="failed">
        <TaskTable filterStatus="failed" />
      </TabsContent>
      <TabsContent value="retrying">
        <TaskTable filterStatus="retrying" />
      </TabsContent>
      <TabsContent value="queued">
        <TaskTable filterStatus="queued" />
      </TabsContent>
    </Tabs>
  )
}

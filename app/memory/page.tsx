import { DashboardLayout } from "@/components/dashboard-layout"
import { MemoryViewer } from "@/components/memory/memory-viewer"

export default function MemoryPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Memory</h1>
          <p className="text-muted-foreground">Inspect and modify your AI agents' working memory and context</p>
        </div>
        <MemoryViewer />
      </div>
    </DashboardLayout>
  )
}

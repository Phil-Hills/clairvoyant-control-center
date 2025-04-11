import { LogsHeader } from "@/components/logs/logs-header"
import { LogsView } from "@/components/logs/logs-view"

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <LogsHeader />
      <LogsView />
    </div>
  )
}

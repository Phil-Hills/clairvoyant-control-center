import { TaskQueueHeader } from "@/components/tasks/task-queue-header"
import { TaskQueueTabs } from "@/components/tasks/task-queue-tabs"

export default function TaskQueuePage() {
  return (
    <div className="flex flex-col gap-6">
      <TaskQueueHeader />
      <TaskQueueTabs />
    </div>
  )
}

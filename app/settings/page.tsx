import { SettingsForm } from "@/components/settings/settings-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure global platform settings and Google Cloud project details.</p>
        </div>
        <SettingsForm />
      </div>
    </DashboardLayout>
  )
}

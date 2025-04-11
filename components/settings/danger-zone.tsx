"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DisconnectProjectModal } from "@/components/settings/disconnect-project-modal"
import { ResetConfigModal } from "@/components/settings/reset-config-modal"

export function DangerZone() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleExportSettings = async () => {
    setIsExporting(true)

    try {
      // Simulate API call to get settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock settings data
      const settings = {
        projectId: "clairvoyant-control-center",
        region: "us-central1",
        serviceAccountEmail: "clairvoyant-service@project-id.iam.gserviceaccount.com",
        enableBigQueryLogs: true,
        bigQueryDataset: "clairvoyant_logs",
        logRetention: "30",
        autoStreamLogs: true,
        defaultAgentRegion: "us-central1",
        enableDebugMode: false,
        theme: "system",
        autoRefreshInterval: "30",
        exportedAt: new Date().toISOString(),
      }

      // Create a blob and download it
      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `clairvoyant-settings-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Settings Exported",
        description: "Your settings have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting settings:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Danger Zone</CardTitle>
          </div>
          <CardDescription>
            These actions are destructive and may result in data loss. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-destructive/50 p-4">
            <div>
              <h3 className="text-base font-medium">Disconnect GCP Project</h3>
              <p className="text-sm text-muted-foreground">
                Disconnect this control center from the Google Cloud project. All agents will stop functioning.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setIsDisconnectModalOpen(true)}>
              Disconnect Project
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-destructive/50 p-4">
            <div>
              <h3 className="text-base font-medium">Reset All Agent Configurations</h3>
              <p className="text-sm text-muted-foreground">
                Reset all agent configurations to their default values. This cannot be undone.
              </p>
            </div>
            <Button variant="destructive" onClick={() => setIsResetModalOpen(true)}>
              Reset Configurations
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <h3 className="text-base font-medium">Export Settings to JSON</h3>
              <p className="text-sm text-muted-foreground">
                Export all settings to a JSON file that can be backed up or imported later.
              </p>
            </div>
            <Button variant="outline" onClick={handleExportSettings} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DisconnectProjectModal open={isDisconnectModalOpen} onOpenChange={setIsDisconnectModalOpen} />
      <ResetConfigModal open={isResetModalOpen} onOpenChange={setIsResetModalOpen} />
    </>
  )
}

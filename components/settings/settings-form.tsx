"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"
import { GcpProjectSettings } from "@/components/settings/gcp-project-settings"
import { LogSettings } from "@/components/settings/log-settings"
import { PlatformPreferences } from "@/components/settings/platform-preferences"
import { DangerZone } from "@/components/settings/danger-zone"
import { useMediaQuery } from "@/hooks/use-media-query"

// Form schema
const formSchema = z.object({
  // GCP Project Settings
  projectId: z
    .string()
    .min(6, { message: "Project ID must be at least 6 characters." })
    .max(30, { message: "Project ID must be less than 30 characters." })
    .regex(/^[a-z][a-z0-9-]+$/, {
      message: "Project ID can only contain lowercase letters, numbers, and hyphens, and must start with a letter.",
    }),
  region: z.string().min(1, { message: "Region is required." }),
  serviceAccountEmail: z.string().email({ message: "Must be a valid service account email." }),

  // Log Settings
  enableBigQueryLogs: z.boolean().default(false),
  bigQueryDataset: z.string().optional(),
  logRetention: z.string().min(1, { message: "Log retention period is required." }),
  autoStreamLogs: z.boolean().default(true),

  // Platform Preferences
  defaultAgentRegion: z.string().min(1, { message: "Default agent region is required." }),
  enableDebugMode: z.boolean().default(false),
  theme: z.enum(["light", "dark", "system"]),
  autoRefreshInterval: z.string().min(1, { message: "Auto-refresh interval is required." }),
})

type FormValues = z.infer<typeof formSchema>

// Mock initial values
const initialValues: FormValues = {
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
}

export function SettingsForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("gcp")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form data:", data)

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    form.reset(initialValues)
    toast({
      title: "Settings Reset",
      description: "Your settings have been reset to default values.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {isDesktop ? (
          <div className="space-y-8">
            <GcpProjectSettings form={form} />
            <LogSettings form={form} />
            <PlatformPreferences form={form} />
            <DangerZone />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gcp">GCP</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="gcp" className="space-y-6">
              <GcpProjectSettings form={form} />
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <LogSettings form={form} />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <PlatformPreferences form={form} />
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <DangerZone />
            </TabsContent>
          </Tabs>
        )}
      </form>
    </Form>
  )
}

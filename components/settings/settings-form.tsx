"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Trash, Settings, Cloud, Bot, AlertTriangle, Check, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Form schema
const formSchema = z.object({
  // General Settings
  platformName: z.string().min(1, { message: "Platform name is required." }),
  platformFocus: z.string().min(1, { message: "Platform focus is required." }),
  environment: z.string().min(1, { message: "Environment is required." }),
  theme: z.enum(["light", "dark", "system"]),
  accentColor: z.string().min(1, { message: "Accent color is required." }),
  enableAnimations: z.boolean().default(true),

  // GCP Config
  projectId: z
    .string()
    .min(6, { message: "Project ID must be at least 6 characters." })
    .max(30, { message: "Project ID must be less than 30 characters." })
    .regex(/^[a-z][a-z0-9-]+$/, {
      message: "Project ID can only contain lowercase letters, numbers, and hyphens, and must start with a letter.",
    }),
  region: z.string().min(1, { message: "Region is required." }),
  serviceAccountEmail: z.string().email({ message: "Must be a valid service account email." }),
  enableBigQueryLogs: z.boolean().default(false),
  bigQueryDataset: z.string().optional(),

  // Agent Behavior
  enableAutonomousBehavior: z.boolean().default(false),
  defaultAgentTemplate: z.string().min(1, { message: "Default agent template is required." }),
  logRetention: z.string().min(1, { message: "Log retention period is required." }),
  autoRefreshInterval: z.string().min(1, { message: "Auto-refresh interval is required." }),
  enableDebugMode: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

// Mock initial values
const initialValues: FormValues = {
  platformName: "Clairvoyant Control Center",
  platformFocus: "AI agent orchestration and management for Google Cloud",
  environment: "development",
  theme: "system",
  accentColor: "blue",
  enableAnimations: true,

  projectId: "clairvoyant-control-center",
  region: "us-central1",
  serviceAccountEmail: "clairvoyant-service@project-id.iam.gserviceaccount.com",
  enableBigQueryLogs: true,
  bigQueryDataset: "clairvoyant_logs",

  enableAutonomousBehavior: false,
  defaultAgentTemplate: "general",
  logRetention: "30",
  autoRefreshInterval: "30",
  enableDebugMode: false,
}

// Mock authorized agents
const authorizedAgents = [
  { id: "agent-1", name: "Admin", role: "System Administrator", avatar: "A", status: "active" },
  { id: "agent-2", name: "LogBot", role: "Log Analysis Specialist", avatar: "L", status: "active" },
  { id: "agent-3", name: "Builder", role: "Infrastructure Expert", avatar: "B", status: "active" },
  { id: "agent-4", name: "Analyzer", role: "Data Analyst", avatar: "D", status: "idle" },
]

export function SettingsForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [isTestingCredentials, setIsTestingCredentials] = useState(false)
  const [credentialsStatus, setCredentialsStatus] = useState<"idle" | "success" | "error">("idle")

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

  const testCredentials = () => {
    setIsTestingCredentials(true)
    setCredentialsStatus("idle")

    // Simulate API call
    setTimeout(() => {
      setIsTestingCredentials(false)

      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3
      setCredentialsStatus(success ? "success" : "error")

      toast({
        title: success ? "Credentials Valid" : "Credentials Invalid",
        description: success
          ? "Your GCP credentials are valid and have the required permissions."
          : "Your GCP credentials are invalid or missing required permissions.",
        variant: success ? "default" : "destructive",
      })
    }, 2000)
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="gcp" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">GCP</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your platform environment and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="platformName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter platform name" {...field} />
                      </FormControl>
                      <FormDescription>The name displayed throughout the platform</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platformFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What should this platform focus on?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the main focus of this platform..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This helps agents understand their purpose and context</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The current environment for this platform instance</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose between light, dark, or system preference</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accent color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The primary accent color used throughout the interface</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableAnimations"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Animations</FormLabel>
                        <FormDescription>Toggle UI animations and transitions</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gcp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Cloud Configuration</CardTitle>
                <CardDescription>Configure your Google Cloud project settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GCP Project ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter GCP project ID" {...field} />
                      </FormControl>
                      <FormDescription>The Google Cloud project ID for this platform</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Region</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="us-central1">us-central1 (Iowa)</SelectItem>
                          <SelectItem value="us-east1">us-east1 (South Carolina)</SelectItem>
                          <SelectItem value="us-west1">us-west1 (Oregon)</SelectItem>
                          <SelectItem value="europe-west1">europe-west1 (Belgium)</SelectItem>
                          <SelectItem value="asia-east1">asia-east1 (Taiwan)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The default region for deploying resources</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceAccountEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Account Email</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Enter service account email" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={testCredentials}
                          disabled={isTestingCredentials}
                          className="whitespace-nowrap"
                        >
                          {isTestingCredentials ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          ) : credentialsStatus === "success" ? (
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                          ) : credentialsStatus === "error" ? (
                            <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                          ) : null}
                          Test Credentials
                        </Button>
                      </div>
                      <FormDescription>The service account used for GCP operations</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableBigQueryLogs"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable BigQuery Logs</FormLabel>
                        <FormDescription>Store logs in BigQuery for advanced analytics</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("enableBigQueryLogs") && (
                  <FormField
                    control={form.control}
                    name="bigQueryDataset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BigQuery Dataset</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter BigQuery dataset name" {...field} />
                        </FormControl>
                        <FormDescription>The BigQuery dataset where logs will be stored</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Behavior</CardTitle>
                <CardDescription>Configure how agents operate in your environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="enableAutonomousBehavior"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Autonomous Behavior</FormLabel>
                        <FormDescription>Allow agents to operate autonomously without human approval</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultAgentTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Agent Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select default template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Purpose</SelectItem>
                          <SelectItem value="data-processor">Data Processor</SelectItem>
                          <SelectItem value="content-analyzer">Content Analyzer</SelectItem>
                          <SelectItem value="notification">Notification Service</SelectItem>
                          <SelectItem value="security">Security Monitor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The default template used when creating new agents</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logRetention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Log Retention (days)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select log retention period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How long to retain agent logs and activity history</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoRefreshInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auto-refresh Interval (seconds)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select refresh interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Disabled</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How often to automatically refresh data in the UI</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enableDebugMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Debug Mode</FormLabel>
                        <FormDescription>Show additional debugging information in the UI</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authorized Agents</CardTitle>
                <CardDescription>Manage agents that have access to this platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-4">
                    {authorizedAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{agent.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{agent.name}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  agent.status === "active" && "bg-green-500/10 text-green-500 border-green-500/20",
                                  agent.status === "idle" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                )}
                              >
                                {agent.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button variant="outline" className="w-full mt-4">
                  Add New Agent
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  These actions are destructive and cannot be undone. Please proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Reset All Agents</h3>
                    <p className="text-sm text-muted-foreground">
                      This will reset all agent memory and state. Agents will lose their context and learning.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                      Reset All Agents
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Purge All Logs</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all logs from the system, including those stored in BigQuery.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                      Purge All Logs
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Disconnect GCP Project</h3>
                    <p className="text-sm text-muted-foreground">
                      This will disconnect your Google Cloud project from this platform. All agents will stop
                      functioning.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                      Disconnect Project
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium">Delete Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete this platform instance and all associated data.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-2 w-full sm:w-auto">
                      Delete Platform
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-destructive/20 bg-destructive/5">
                <p className="text-xs text-muted-foreground">
                  Note: Some actions may require additional confirmation or administrator privileges.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}

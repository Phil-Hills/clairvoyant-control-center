"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, Cloud, Copy, HelpCircle, Loader2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for GCP regions
const gcpRegions = [
  { value: "us-central1", label: "Iowa (us-central1)" },
  { value: "us-east1", label: "South Carolina (us-east1)" },
  { value: "us-east4", label: "Northern Virginia (us-east4)" },
  { value: "us-west1", label: "Oregon (us-west1)" },
  { value: "us-west2", label: "Los Angeles (us-west2)" },
  { value: "us-west3", label: "Salt Lake City (us-west3)" },
  { value: "us-west4", label: "Las Vegas (us-west4)" },
  { value: "europe-west1", label: "Belgium (europe-west1)" },
  { value: "europe-west2", label: "London (europe-west2)" },
  { value: "europe-west3", label: "Frankfurt (europe-west3)" },
  { value: "europe-west4", label: "Netherlands (europe-west4)" },
  { value: "asia-east1", label: "Taiwan (asia-east1)" },
  { value: "asia-east2", label: "Hong Kong (asia-east2)" },
  { value: "asia-northeast1", label: "Tokyo (asia-northeast1)" },
  { value: "asia-northeast2", label: "Osaka (asia-northeast2)" },
  { value: "asia-northeast3", label: "Seoul (asia-northeast3)" },
  { value: "asia-south1", label: "Mumbai (asia-south1)" },
  { value: "asia-southeast1", label: "Singapore (asia-southeast1)" },
  { value: "australia-southeast1", label: "Sydney (australia-southeast1)" },
]

interface GcpProjectSettingsProps {
  form: UseFormReturn<any>
}

export function GcpProjectSettings({ form }: GcpProjectSettingsProps) {
  const { toast } = useToast()
  const [testingCredentials, setTestingCredentials] = useState(false)
  const [credentialStatus, setCredentialStatus] = useState<"idle" | "connected" | "invalid" | "expired">("idle")

  const handleTestCredentials = async () => {
    const serviceAccountEmail = form.getValues("serviceAccountEmail")
    const projectId = form.getValues("projectId")

    if (!serviceAccountEmail || !projectId) {
      toast({
        title: "Missing Information",
        description: "Please enter both Project ID and Service Account Email before testing.",
        variant: "destructive",
      })
      return
    }

    setTestingCredentials(true)
    setCredentialStatus("idle")

    try {
      // Simulate API call to test credentials
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly succeed or fail for demo purposes
      const statuses = ["connected", "invalid", "expired"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)] as "connected" | "invalid" | "expired"

      setCredentialStatus(randomStatus)

      if (randomStatus === "connected") {
        toast({
          title: "Credentials Valid",
          description: "The GCP credentials are valid and connected.",
        })
      } else if (randomStatus === "invalid") {
        toast({
          title: "Invalid Credentials",
          description: "The service account does not have the required permissions.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Credentials Expired",
          description: "The service account credentials have expired.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing credentials:", error)
      toast({
        title: "Error",
        description: "An error occurred while testing the credentials.",
        variant: "destructive",
      })
    } finally {
      setTestingCredentials(false)
    }
  }

  const handleCopyEmail = () => {
    const email = form.getValues("serviceAccountEmail")
    navigator.clipboard.writeText(email)
    toast({
      title: "Copied to Clipboard",
      description: "Service account email has been copied to clipboard.",
    })
  }

  const getStatusBadge = () => {
    switch (credentialStatus) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        )
      case "invalid":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Invalid
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <CardTitle>GCP Project Settings</CardTitle>
          </div>
          <CardDescription>Configure your Google Cloud Platform project details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Project ID</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        The Google Cloud Project ID where your agents and resources are deployed. This must match your
                        GCP project.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input placeholder="my-gcp-project-id" {...field} />
                </FormControl>
                <FormDescription>
                  Your GCP project ID (e.g., my-project-123). This cannot be changed after project creation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Primary Region</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        The primary GCP region where your resources will be deployed by default. Individual agents can
                        override this setting.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gcpRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The primary GCP region for your project resources.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceAccountEmail"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Service Account Email</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        The service account email that will be used to authenticate with Google Cloud APIs. This account
                        needs appropriate permissions.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="service-account@project-id.iam.gserviceaccount.com" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" size="icon" onClick={handleCopyEmail}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <FormDescription>The service account used for authentication with GCP services.</FormDescription>
                  {getStatusBadge()}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestCredentials}
              disabled={testingCredentials}
              className="min-w-[150px]"
            >
              {testingCredentials ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Credentials"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

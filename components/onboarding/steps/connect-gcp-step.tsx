"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, HelpCircle, Loader2, XCircle } from "lucide-react"
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-flow"
import { useToast } from "@/hooks/use-toast"

interface ConnectGcpStepProps {
  form: UseFormReturn<OnboardingFormValues>
  onNext: () => void
  onPrev: () => void
  isConnectionTested: boolean
  setIsConnectionTested: (value: boolean) => void
}

const GCP_REGIONS = [
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
  { value: "asia-south1", label: "Mumbai (asia-south1)" },
  { value: "asia-southeast1", label: "Singapore (asia-southeast1)" },
  { value: "australia-southeast1", label: "Sydney (australia-southeast1)" },
]

export function ConnectGcpStep({
  form,
  onNext,
  onPrev,
  isConnectionTested,
  setIsConnectionTested,
}: ConnectGcpStepProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "error">("untested")
  const { toast } = useToast()

  const testConnection = async () => {
    const projectId = form.getValues("projectId")
    const region = form.getValues("region")
    const serviceAccountEmail = form.getValues("serviceAccountEmail")

    if (!projectId || !region || !serviceAccountEmail) {
      form.trigger(["projectId", "region", "serviceAccountEmail"])
      return
    }

    setIsTesting(true)

    try {
      // Simulate API call to test connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll assume the connection is successful
      setConnectionStatus("success")
      setIsConnectionTested(true)

      toast({
        title: "Connection Successful",
        description: "Successfully connected to Google Cloud Project.",
      })
    } catch (error) {
      setConnectionStatus("error")
      setIsConnectionTested(false)

      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Cloud. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Service account email copied to clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to Google Cloud</CardTitle>
        <CardDescription>
          Connect Clairvoyant to your Google Cloud project to deploy and manage AI agents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project ID
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Your Google Cloud Project ID. This is a unique identifier for your project, not the project
                        name.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <Input placeholder="my-gcp-project-id" {...field} />
              </FormControl>
              <FormDescription>Enter your Google Cloud Project ID (e.g., my-project-123)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Region
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The primary Google Cloud region where your resources will be deployed.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GCP_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose the Google Cloud region closest to your users</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceAccountEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Service Account Email
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The email address of the service account that Clairvoyant will use to access Google Cloud
                        resources.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="service-account@project-id.iam.gserviceaccount.com" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(field.value)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <FormDescription>Enter the service account email with necessary permissions</FormDescription>
                <div className="flex items-center">
                  {connectionStatus === "success" && (
                    <div className="flex items-center text-sm font-medium text-green-500">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Connected
                    </div>
                  )}
                  {connectionStatus === "error" && (
                    <div className="flex items-center text-sm font-medium text-destructive">
                      <XCircle className="mr-1 h-4 w-4" />
                      Invalid
                    </div>
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="button" variant="secondary" onClick={testConnection} disabled={isTesting} className="w-full">
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={!isConnectionTested}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

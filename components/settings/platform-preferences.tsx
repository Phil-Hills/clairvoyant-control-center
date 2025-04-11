"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Settings, HelpCircle } from "lucide-react"

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

interface PlatformPreferencesProps {
  form: UseFormReturn<any>
}

export function PlatformPreferences({ form }: PlatformPreferencesProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Platform Preferences</CardTitle>
          </div>
          <CardDescription>Configure your platform preferences and defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="defaultAgentRegion"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Default Agent Region</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        The default region where new agents will be deployed if not specified during agent creation.
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
                <FormDescription>The default region for new agent deployments.</FormDescription>
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
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">Enable Debug Mode</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-80">
                        <p>When enabled, additional debug information will be included in logs and agent responses.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormDescription>Include additional debug information in logs and agent responses.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex items-center gap-2">
                  <FormLabel>Theme</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        Choose between light, dark, or system theme. System will follow your device's theme settings.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="light" />
                      </FormControl>
                      <FormLabel className="font-normal">Light</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dark" />
                      </FormControl>
                      <FormLabel className="font-normal">Dark</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="system" />
                      </FormControl>
                      <FormLabel className="font-normal">System</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>Select your preferred theme for the control center.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoRefreshInterval"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Auto-Refresh Interval</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        How often data will be automatically refreshed on dashboard pages when auto-refresh is enabled.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select refresh interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How frequently data will refresh when auto-refresh is enabled.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

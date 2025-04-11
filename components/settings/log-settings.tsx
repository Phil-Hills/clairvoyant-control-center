"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, HelpCircle } from "lucide-react"

interface LogSettingsProps {
  form: UseFormReturn<any>
}

export function LogSettings({ form }: LogSettingsProps) {
  const enableBigQueryLogs = form.watch("enableBigQueryLogs")

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Log Settings</CardTitle>
          </div>
          <CardDescription>Configure how logs are stored and managed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="enableBigQueryLogs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">Enable Logs to BigQuery</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-80">
                        <p>
                          When enabled, all agent logs will be exported to a BigQuery dataset for long-term storage and
                          analysis.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormDescription>Export logs to BigQuery for advanced analytics and querying.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {enableBigQueryLogs && (
            <FormField
              control={form.control}
              name="bigQueryDataset"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>BigQuery Dataset Name</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-80">
                        <p>
                          The name of the BigQuery dataset where logs will be stored. This dataset must exist in your
                          GCP project.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Input placeholder="clairvoyant_logs" {...field} />
                  </FormControl>
                  <FormDescription>
                    The BigQuery dataset name where logs will be exported. Must exist in your GCP project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="logRetention"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Log Retention Period</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-80">
                      <p>
                        How long logs will be retained in the system. Older logs will be automatically deleted after
                        this period.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How long logs will be retained before automatic deletion.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoStreamLogs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-base">Auto-Stream Logs</FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-80">
                        <p>
                          When enabled, the logs page will automatically stream new logs in real-time when in Live Mode.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormDescription>Automatically stream logs in real-time when viewing the logs page.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

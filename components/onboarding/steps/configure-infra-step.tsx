"use client"

import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react"
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-flow"

interface ConfigureInfraStepProps {
  form: UseFormReturn<OnboardingFormValues>
  onNext: () => void
  onPrev: () => void
}

export function ConfigureInfraStep({ form, onNext, onPrev }: ConfigureInfraStepProps) {
  const watchEnableBigQueryLogs = form.watch("enableBigQueryLogs")
  const watchEnableSecretManager = form.watch("enableSecretManager")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Infrastructure</CardTitle>
        <CardDescription>Set up logging and secret management for your AI agents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Logging Configuration</h3>

          <FormField
            control={form.control}
            name="enableBigQueryLogs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Enable Logs to BigQuery
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Store agent logs in BigQuery for advanced analytics and querying.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormDescription>Store agent logs in BigQuery for advanced analytics</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {watchEnableBigQueryLogs && (
            <FormField
              control={form.control}
              name="bigQueryDataset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BigQuery Dataset Name</FormLabel>
                  <FormControl>
                    <Input placeholder="clairvoyant_logs" {...field} />
                  </FormControl>
                  <FormDescription>
                    Name of the BigQuery dataset to store logs (will be created if it doesn't exist)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Secret Management</h3>

          <FormField
            control={form.control}
            name="enableSecretManager"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Enable Secret Manager
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Use Google Cloud Secret Manager to securely store API keys and credentials.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormDescription>Use Google Cloud Secret Manager for secure credential storage</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {watchEnableSecretManager && (
            <FormField
              control={form.control}
              name="secretPrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="clairvoyant-" {...field} />
                  </FormControl>
                  <FormDescription>Prefix for secret names in Secret Manager (helps with organization)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="autoCreateResources"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Auto-create Required Resources
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Automatically create required Google Cloud resources and IAM roles.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormDescription>Automatically create required buckets, datasets, and IAM roles</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MessageSquare, Hand } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import cronstrue from "cronstrue"

interface TriggerConfigSectionProps {
  form: UseFormReturn<any>
}

export function TriggerConfigSection({ form }: TriggerConfigSectionProps) {
  const triggerType = form.watch("triggerType")
  const cronExpression = form.watch("cronExpression")

  // Function to parse and display cron expression in human-readable format
  const getCronDescription = (cron: string) => {
    try {
      return cronstrue.toString(cron)
    } catch (error) {
      return "Invalid cron expression"
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="triggerType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Trigger Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="manual" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <Hand className="mr-2 h-4 w-4" />
                        Manual (Triggered via API)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="scheduled" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Scheduled (Runs on a schedule)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="pubsub" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Pub/Sub (Event-driven)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {triggerType === "scheduled" && (
            <>
              <FormField
                control={form.control}
                name="cronExpression"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cron Expression</FormLabel>
                    <FormControl>
                      <Input placeholder="0 */6 * * *" {...field} />
                    </FormControl>
                    <FormDescription>Schedule in cron format (e.g., "0 */6 * * *" for every 6 hours).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {cronExpression && (
                <Alert>
                  <AlertDescription>
                    <span className="font-medium">Schedule Preview:</span> {getCronDescription(cronExpression)}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          {triggerType === "pubsub" && (
            <>
              <FormField
                control={form.control}
                name="pubsubTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pub/Sub Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="projects/my-project/topics/my-topic" {...field} />
                    </FormControl>
                    <FormDescription>The full path to the Pub/Sub topic that will trigger this agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pubsubSubscription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pub/Sub Subscription</FormLabel>
                    <FormControl>
                      <Input placeholder="my-subscription-name" {...field} />
                    </FormControl>
                    <FormDescription>Name for the subscription that will be created for this agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

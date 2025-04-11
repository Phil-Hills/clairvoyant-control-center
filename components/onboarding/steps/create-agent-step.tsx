"use client"

import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-flow"

interface CreateAgentStepProps {
  form: UseFormReturn<OnboardingFormValues>
  onNext: () => void
  onPrev: () => void
}

export function CreateAgentStep({ form, onNext, onPrev }: CreateAgentStepProps) {
  const watchSkipAgentSetup = form.watch("skipAgentSetup")
  const watchEnableSecretManager = form.watch("enableSecretManager")

  // Mock secrets for the select dropdown
  const mockSecrets = [
    { id: "openai-api-key", name: "OpenAI API Key" },
    { id: "anthropic-api-key", name: "Anthropic API Key" },
    { id: "google-api-key", name: "Google API Key" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your First Agent</CardTitle>
        <CardDescription>Set up a basic AI agent or skip this step and create one later.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="skipAgentSetup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Skip Agent Setup</FormLabel>
                <FormDescription>You can create agents later from the Agents page</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {!watchSkipAgentSetup && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="agentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My First Agent" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your agent</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vertexEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vertex AI Endpoint URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://us-central1-aiplatform.googleapis.com/v1/projects/..." {...field} />
                  </FormControl>
                  <FormDescription>The Vertex AI endpoint URL for your model</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        <FormLabel className="font-normal">Manual (Trigger via API or UI)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="schedule" />
                        </FormControl>
                        <FormLabel className="font-normal">Schedule (Run on a time-based schedule)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pubsub" />
                        </FormControl>
                        <FormLabel className="font-normal">Pub/Sub (Trigger on message)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>How this agent will be triggered to run</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchEnableSecretManager && (
              <FormField
                control={form.control}
                name="secretId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a secret" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {mockSecrets.map((secret) => (
                          <SelectItem key={secret.id} value={secret.id}>
                            {secret.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select a secret to inject into your agent</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}
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

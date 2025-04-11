"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock data for dropdowns
const mockRegions = [
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

const mockCloudFunctions = [
  { value: "data-processor", label: "data-processor" },
  { value: "content-analyzer", label: "content-analyzer" },
  { value: "notification-service", label: "notification-service" },
  { value: "log-analyzer", label: "log-analyzer" },
  { value: "sentiment-analyzer", label: "sentiment-analyzer" },
]

const mockSecrets = [
  { id: "secret-1", name: "API_KEY" },
  { id: "secret-2", name: "DATABASE_URL" },
  { id: "secret-3", name: "AUTH_TOKEN" },
  { id: "secret-4", name: "OPENAI_API_KEY" },
  { id: "secret-5", name: "GOOGLE_APPLICATION_CREDENTIALS" },
]

// Form schema
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Agent name must be at least 3 characters." })
    .max(50, { message: "Agent name must be less than 50 characters." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Agent name can only contain lowercase letters, numbers, and hyphens.",
    }),
  vertexEndpoint: z.string().min(1, { message: "Vertex AI model endpoint is required." }),
  region: z.string().min(1, { message: "GCP region is required." }),
  cloudFunction: z.string().min(1, { message: "Cloud Function is required." }),
  triggerType: z.enum(["manual", "scheduler", "pubsub"], {
    required_error: "Trigger type is required.",
  }),
  secrets: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAgentModal({ open, onOpenChange }: CreateAgentModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      vertexEndpoint: "",
      region: "",
      cloudFunction: "",
      triggerType: "manual",
      secrets: [],
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Form data:", data)

    toast({
      title: "Agent Created",
      description: `Agent "${data.name}" has been created successfully.`,
    })

    setIsSubmitting(false)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>Configure a new AI agent to run in Google Cloud.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="my-agent-name" {...field} />
                    </FormControl>
                    <FormDescription>Lowercase letters, numbers, and hyphens only.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vertexEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vertex AI Model Endpoint</FormLabel>
                    <FormControl>
                      <Input placeholder="projects/*/locations/*/models/*" {...field} />
                    </FormControl>
                    <FormDescription>Full Vertex AI model endpoint path.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCP Region</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockRegions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Region where the agent will be deployed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cloudFunction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cloud Function</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Cloud Function" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCloudFunctions.map((fn) => (
                          <SelectItem key={fn.value} value={fn.value}>
                            {fn.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Cloud Function to bind to this agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        <FormLabel className="font-normal">Manual (Triggered via API)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="scheduler" />
                        </FormControl>
                        <FormLabel className="font-normal">Scheduler (Runs on a schedule)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pubsub" />
                        </FormControl>
                        <FormLabel className="font-normal">Pub/Sub (Event-driven)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secrets"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Secrets</FormLabel>
                    <FormDescription>Select secrets to make available to this agent.</FormDescription>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {mockSecrets.map((secret) => (
                      <FormField
                        key={secret.id}
                        control={form.control}
                        name="secrets"
                        render={({ field }) => {
                          return (
                            <FormItem key={secret.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(secret.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), secret.id])
                                      : field.onChange(field.value?.filter((value) => value !== secret.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{secret.name}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Agent"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

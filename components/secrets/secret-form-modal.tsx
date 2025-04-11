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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for agents
const mockAgents = [
  { id: "agent-1", name: "Data Processor" },
  { id: "agent-2", name: "Content Analyzer" },
  { id: "agent-3", name: "Notification Service" },
  { id: "agent-4", name: "Log Analyzer" },
  { id: "agent-5", name: "Sentiment Analyzer" },
]

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Secret name is required." })
    .max(50, { message: "Secret name must be less than 50 characters." })
    .regex(/^[A-Z0-9_]+$/, {
      message: "Secret name can only contain uppercase letters, numbers, and underscores.",
    }),
  type: z.string().min(1, { message: "Secret type is required." }),
  value: z.string().min(1, { message: "Secret value is required." }),
  autoRotation: z.boolean().default(false),
  agents: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SecretFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingSecret?: any
  onSuccess?: () => void
}

export function SecretFormModal({ open, onOpenChange, existingSecret, onSuccess }: SecretFormModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSecretValue, setShowSecretValue] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingSecret?.name || "",
      type: existingSecret?.type || "",
      value: existingSecret?.value || "",
      autoRotation: existingSecret?.autoRotation || false,
      agents:
        existingSecret?.usedBy
          .map((agent: string) => {
            const foundAgent = mockAgents.find((a) => a.name === agent)
            return foundAgent ? foundAgent.id : null
          })
          .filter(Boolean) || [],
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form data:", data)

      toast({
        title: existingSecret ? "Secret Updated" : "Secret Created",
        description: existingSecret
          ? `Secret "${data.name}" has been updated successfully.`
          : `Secret "${data.name}" has been created successfully.`,
      })

      // Reset the form
      form.reset()
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving secret:", error)
      toast({
        title: "Error",
        description: "There was an error saving the secret. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSecretVisibility = () => {
    setShowSecretValue(!showSecretValue)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{existingSecret ? "Edit Secret" : "Create New Secret"}</DialogTitle>
          <DialogDescription>
            {existingSecret
              ? "Update the details of an existing secret."
              : "Add a new secret to be used by your agents."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Name</FormLabel>
                  <FormControl>
                    <Input placeholder="API_KEY" {...field} />
                  </FormControl>
                  <FormDescription>
                    Uppercase letters, numbers, and underscores only. This will be the environment variable name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="api-key">API Key</SelectItem>
                      <SelectItem value="oauth-token">OAuth Token</SelectItem>
                      <SelectItem value="connection-string">Connection String</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="json-blob">JSON Blob</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The type of secret you're creating.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Secret Value</FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleSecretVisibility}
                      className="h-7 px-2 text-xs"
                    >
                      {showSecretValue ? (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the secret value..."
                      className="font-mono"
                      rows={5}
                      type={showSecretValue ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The actual value of the secret. This will be encrypted in Secret Manager.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoRotation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-Rotation</FormLabel>
                    <FormDescription>Automatically rotate this secret on a schedule.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agents"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Assign to Agents</FormLabel>
                    <FormDescription>Select agents that will have access to this secret.</FormDescription>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {mockAgents.map((agent) => (
                      <FormItem
                        key={agent.id}
                        className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(agent.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), agent.id])
                                : field.onChange(field.value?.filter((value) => value !== agent.id))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{agent.name}</FormLabel>
                      </FormItem>
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
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {existingSecret ? "Update Secret" : "Create Secret"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Loader2 } from "lucide-react"

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
})

type FormValues = z.infer<typeof formSchema>

interface CreateSecretModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateSecret: (data: FormValues) => void
}

export function CreateSecretModal({ open, onOpenChange, onCreateSecret }: CreateSecretModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      value: "",
      autoRotation: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Pass the data to the parent component
      onCreateSecret(data)

      // Reset the form
      form.reset()
    } catch (error) {
      console.error("Error creating secret:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Secret</DialogTitle>
          <DialogDescription>Add a new secret to Secret Manager that can be used by your agents.</DialogDescription>
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
                      <SelectItem value="service-account">Service Account</SelectItem>
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
                  <FormLabel>Secret Value</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the secret value..." className="font-mono" rows={3} {...field} />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Secret
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

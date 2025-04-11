"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for Cloud Functions
const mockCloudFunctions = [
  { value: "data-processor", label: "data-processor" },
  { value: "content-analyzer", label: "content-analyzer" },
  { value: "notification-service", label: "notification-service" },
  { value: "log-analyzer", label: "log-analyzer" },
  { value: "sentiment-analyzer", label: "sentiment-analyzer" },
]

interface ModelBindingSectionProps {
  form: UseFormReturn<any>
}

export function ModelBindingSection({ form }: ModelBindingSectionProps) {
  const { toast } = useToast()
  const [testingEndpoint, setTestingEndpoint] = useState(false)
  const [endpointStatus, setEndpointStatus] = useState<"idle" | "success" | "error">("idle")

  const handleTestEndpoint = async () => {
    const endpoint = form.getValues("vertexEndpoint")

    if (!endpoint) {
      form.setError("vertexEndpoint", {
        type: "manual",
        message: "Please enter an endpoint URL to test.",
      })
      return
    }

    setTestingEndpoint(true)
    setEndpointStatus("idle")

    try {
      // Simulate API call to test endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3

      if (success) {
        setEndpointStatus("success")
        toast({
          title: "Endpoint Validated",
          description: "The Vertex AI endpoint is valid and accessible.",
        })
      } else {
        setEndpointStatus("error")
        toast({
          title: "Endpoint Validation Failed",
          description: "Could not connect to the Vertex AI endpoint. Please check the URL and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setEndpointStatus("error")
      toast({
        title: "Endpoint Validation Failed",
        description: "An error occurred while testing the endpoint.",
        variant: "destructive",
      })
    } finally {
      setTestingEndpoint(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="vertexEndpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertex AI Endpoint URL</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="projects/*/locations/*/publishers/google/models/*"
                      {...field}
                      className="flex-1"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestEndpoint}
                    disabled={testingEndpoint}
                    className="min-w-[120px]"
                  >
                    {testingEndpoint ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : endpointStatus === "success" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Valid
                      </>
                    ) : endpointStatus === "error" ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Invalid
                      </>
                    ) : (
                      "Test Endpoint"
                    )}
                  </Button>
                </div>
                <FormDescription>
                  The full Vertex AI model endpoint path. Example:
                  projects/my-project/locations/us-central1/publishers/google/models/text-bison
                </FormDescription>
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

          <FormField
            control={form.control}
            name="codeSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Source</FormLabel>
                <FormControl>
                  <Input placeholder="gs://bucket/path or https://github.com/user/repo" {...field} />
                </FormControl>
                <FormDescription>
                  Google Cloud Storage path or GitHub URL where the agent's code is stored.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentDetailsSection } from "@/components/agents/agent-builder/agent-details-section"
import { ModelBindingSection } from "@/components/agents/agent-builder/model-binding-section"
import { TriggerConfigSection } from "@/components/agents/agent-builder/trigger-config-section"
import { SecretInjectionSection } from "@/components/agents/agent-builder/secret-injection-section"
import { AgentTestPanel } from "@/components/agents/agent-builder/agent-test-panel"
import { CreateSecretModal } from "@/components/agents/agent-builder/create-secret-modal"
import { DeployButton } from "@/components/agents/agent-builder/deploy-button"

// Form schema
const formSchema = z.object({
  // Agent Details
  name: z
    .string()
    .min(3, { message: "Agent name must be at least 3 characters." })
    .max(50, { message: "Agent name must be less than 50 characters." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Agent name can only contain lowercase letters, numbers, and hyphens.",
    }),
  description: z.string().optional(),
  environment: z.string().min(1, { message: "Environment is required." }),
  region: z.string().min(1, { message: "GCP region is required." }),

  // Model & Function Binding
  vertexEndpoint: z.string().min(1, { message: "Vertex AI model endpoint is required." }),
  cloudFunction: z.string().min(1, { message: "Cloud Function is required." }),
  codeSource: z.string().optional(),

  // Trigger Configuration
  triggerType: z.enum(["manual", "scheduled", "pubsub"], {
    required_error: "Trigger type is required.",
  }),
  cronExpression: z.string().optional(),
  pubsubTopic: z.string().optional(),
  pubsubSubscription: z.string().optional(),

  // Secret Injection
  secrets: z.array(z.string()).optional(),

  // Test Panel
  testPayload: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function AgentBuilderForm() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false)
  const [testResults, setTestResults] = useState<{
    status: "idle" | "loading" | "success" | "error"
    data?: any
    logs?: string[]
  }>({
    status: "idle",
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      environment: "dev",
      region: "",
      vertexEndpoint: "",
      cloudFunction: "",
      codeSource: "",
      triggerType: "manual",
      cronExpression: "0 */6 * * *", // Default: Every 6 hours
      pubsubTopic: "",
      pubsubSubscription: "",
      secrets: [],
      testPayload: JSON.stringify(
        {
          input: "Hello, agent! This is a test message.",
          parameters: {
            temperature: 0.7,
            maxTokens: 1000,
          },
        },
        null,
        2,
      ),
    },
  })

  const triggerType = form.watch("triggerType")

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Form data:", data)

      toast({
        title: "Agent Deployed",
        description: `Agent "${data.name}" has been deployed successfully.`,
      })

      // Redirect to agents list or agent details page
      // router.push("/agents")
    } catch (error) {
      console.error("Error deploying agent:", error)
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying the agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    const data = form.getValues()

    toast({
      title: "Draft Saved",
      description: `Agent "${data.name}" has been saved as a draft.`,
    })
  }

  const handleTestAgent = async () => {
    const testPayload = form.getValues("testPayload")

    try {
      setTestResults({ status: "loading" })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful response
      setTestResults({
        status: "success",
        data: {
          output: "I'm an AI agent running in Google Cloud. I've received your test message and I'm ready to assist!",
          metadata: {
            processingTime: "1.2s",
            tokensUsed: 124,
            model: "text-bison@001",
          },
        },
        logs: [
          "[INFO] 2023-04-11T12:34:56Z - Function invoked with test payload",
          "[INFO] 2023-04-11T12:34:56Z - Initializing Vertex AI client",
          "[INFO] 2023-04-11T12:34:57Z - Sending request to Vertex AI endpoint",
          "[INFO] 2023-04-11T12:34:58Z - Received response from Vertex AI",
          "[INFO] 2023-04-11T12:34:58Z - Processing response",
          "[INFO] 2023-04-11T12:34:58Z - Function execution completed successfully",
        ],
      })

      toast({
        title: "Test Successful",
        description: "The agent test was completed successfully.",
      })
    } catch (error) {
      console.error("Error testing agent:", error)

      setTestResults({
        status: "error",
        logs: [
          "[ERROR] 2023-04-11T12:34:56Z - Function invocation failed",
          "[ERROR] 2023-04-11T12:34:56Z - Could not connect to Vertex AI endpoint",
          "[ERROR] 2023-04-11T12:34:56Z - Check your endpoint URL and credentials",
        ],
      })

      toast({
        title: "Test Failed",
        description: "There was an error testing the agent. Please check the logs.",
        variant: "destructive",
      })
    }
  }

  const handleCreateSecret = (secretData: any) => {
    console.log("Creating new secret:", secretData)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Secret Created",
        description: `Secret "${secretData.name}" has been created successfully.`,
      })

      setIsSecretModalOpen(false)

      // Add the new secret to the form's secrets array
      const currentSecrets = form.getValues("secrets") || []
      form.setValue("secrets", [...currentSecrets, secretData.name])
    }, 1000)
  }

  const handleNavigateToSection = (section: string) => {
    setActiveTab(section)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="details">Agent Details</TabsTrigger>
              <TabsTrigger value="model">Model & Function</TabsTrigger>
              <TabsTrigger value="trigger">Trigger</TabsTrigger>
              <TabsTrigger value="secrets">Secrets</TabsTrigger>
              <TabsTrigger value="test">Test Panel</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <AgentDetailsSection form={form} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("model")}>
                  Next: Model & Function
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="model" className="space-y-6">
              <ModelBindingSection form={form} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Previous
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("trigger")}>
                  Next: Trigger
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="trigger" className="space-y-6">
              <TriggerConfigSection form={form} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("model")}>
                  Previous
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("secrets")}>
                  Next: Secrets
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="secrets" className="space-y-6">
              <SecretInjectionSection form={form} onCreateSecret={() => setIsSecretModalOpen(true)} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("trigger")}>
                  Previous
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveTab("test")}>
                  Next: Test Panel
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              <AgentTestPanel form={form} onTest={handleTestAgent} testResults={testResults} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("secrets")}>
                  Previous
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <DeployButton onNavigateToSection={handleNavigateToSection} />
            </div>
          </div>
        </form>
      </Form>

      <CreateSecretModal
        open={isSecretModalOpen}
        onOpenChange={setIsSecretModalOpen}
        onCreateSecret={handleCreateSecret}
      />
    </>
  )
}

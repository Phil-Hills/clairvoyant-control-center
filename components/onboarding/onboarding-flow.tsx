"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Stepper } from "@/components/onboarding/stepper"
import { WelcomeStep } from "@/components/onboarding/steps/welcome-step"
import { ConnectGcpStep } from "@/components/onboarding/steps/connect-gcp-step"
import { ConfigureInfraStep } from "@/components/onboarding/steps/configure-infra-step"
import { CreateAgentStep } from "@/components/onboarding/steps/create-agent-step"
import { ConfirmationStep } from "@/components/onboarding/steps/confirmation-step"

// Define the form schema
const formSchema = z.object({
  // GCP Connection
  projectId: z
    .string()
    .min(6, { message: "Project ID must be at least 6 characters." })
    .max(30, { message: "Project ID must be less than 30 characters." })
    .regex(/^[a-z][a-z0-9-]+$/, {
      message: "Project ID can only contain lowercase letters, numbers, and hyphens, and must start with a letter.",
    }),
  region: z.string().min(1, { message: "Region is required." }),
  serviceAccountEmail: z.string().email({ message: "Must be a valid service account email." }),

  // Infrastructure
  enableBigQueryLogs: z.boolean().default(true),
  bigQueryDataset: z.string().optional(),
  enableSecretManager: z.boolean().default(true),
  secretPrefix: z.string().optional(),
  autoCreateResources: z.boolean().default(false),

  // First Agent
  agentName: z.string().optional(),
  vertexEndpoint: z.string().optional(),
  triggerType: z.enum(["manual", "schedule", "pubsub"]).default("manual"),
  secretId: z.string().optional(),
  skipAgentSetup: z.boolean().default(false),
})

export type OnboardingFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<OnboardingFormValues> = {
  region: "us-central1",
  enableBigQueryLogs: true,
  bigQueryDataset: "clairvoyant_logs",
  enableSecretManager: true,
  secretPrefix: "clairvoyant-",
  autoCreateResources: false,
  triggerType: "manual",
  skipAgentSetup: false,
}

const steps = [
  { id: "welcome", label: "Welcome" },
  { id: "connect-gcp", label: "Connect GCP" },
  { id: "configure-infra", label: "Configure Infrastructure" },
  { id: "create-agent", label: "Create Agent" },
  { id: "confirmation", label: "Confirmation" },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isConnectionTested, setIsConnectionTested] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  })

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      // Simulate API call to save configuration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Onboarding complete with data:", data)

      toast({
        title: "Setup Complete",
        description: "Your Clairvoyant Control Center is ready to use!",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error) {
      console.error("Error completing setup:", error)
      toast({
        title: "Setup Failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />
      case 1:
        return (
          <ConnectGcpStep
            form={form}
            onNext={nextStep}
            onPrev={prevStep}
            isConnectionTested={isConnectionTested}
            setIsConnectionTested={setIsConnectionTested}
          />
        )
      case 2:
        return <ConfigureInfraStep form={form} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <CreateAgentStep form={form} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <ConfirmationStep form={form} onSubmit={onSubmit} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <Stepper steps={steps} currentStep={currentStep} />

      <Form {...form}>
        <form className="space-y-8">{renderStep()}</form>
      </Form>
    </div>
  )
}

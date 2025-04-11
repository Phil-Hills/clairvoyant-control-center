"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import type { OnboardingFormValues } from "@/components/onboarding/onboarding-flow"

interface ConfirmationStepProps {
  form: UseFormReturn<OnboardingFormValues>
  onSubmit: (data: OnboardingFormValues) => Promise<void>
  onPrev: () => void
}

export function ConfirmationStep({ form, onSubmit, onPrev }: ConfirmationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formValues = form.getValues()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formValues)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmation & Summary</CardTitle>
        <CardDescription>Review your configuration before launching the Clairvoyant Control Center.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Google Cloud Configuration</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project ID:</span>
              <span className="font-medium">{formValues.projectId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region:</span>
              <span className="font-medium">{formValues.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Account:</span>
              <span className="font-medium truncate max-w-[250px]">{formValues.serviceAccountEmail}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Infrastructure Configuration</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">BigQuery Logging:</span>
              <span className="font-medium">{formValues.enableBigQueryLogs ? "Enabled" : "Disabled"}</span>
            </div>
            {formValues.enableBigQueryLogs && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">BigQuery Dataset:</span>
                <span className="font-medium">{formValues.bigQueryDataset}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Secret Manager:</span>
              <span className="font-medium">{formValues.enableSecretManager ? "Enabled" : "Disabled"}</span>
            </div>
            {formValues.enableSecretManager && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Secret Prefix:</span>
                <span className="font-medium">{formValues.secretPrefix}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-create Resources:</span>
              <span className="font-medium">{formValues.autoCreateResources ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-medium">Agent Configuration</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Agent Setup:</span>
              <span className="font-medium">{formValues.skipAgentSetup ? "Skipped" : "Configured"}</span>
            </div>
            {!formValues.skipAgentSetup && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent Name:</span>
                  <span className="font-medium">{formValues.agentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trigger Type:</span>
                  <span className="font-medium capitalize">{formValues.triggerType}</span>
                </div>
                {formValues.secretId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secret:</span>
                    <span className="font-medium">{formValues.secretId}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Launch Control Center
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

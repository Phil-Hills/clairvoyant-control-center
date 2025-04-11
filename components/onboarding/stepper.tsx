import { Check, CircleDashed } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "border-primary bg-background text-primary"
                    : "border-muted-foreground/30 bg-background text-muted-foreground/30",
              )}
            >
              {index < currentStep ? <Check className="h-5 w-5" /> : <CircleDashed className="h-5 w-5" />}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                index <= currentStep ? "text-foreground" : "text-muted-foreground/50",
              )}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute hidden h-[2px] w-[calc(100%-4rem)] translate-y-5 bg-muted-foreground/30 sm:block",
                  index < currentStep && "bg-primary",
                )}
                style={{
                  left: `calc(${(index + 0.5) * (100 / steps.length)}% + 1rem)`,
                  width: `calc(${100 / steps.length}% - 2rem)`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

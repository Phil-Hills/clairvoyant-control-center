"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResetConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetConfigModal({ open, onOpenChange }: ResetConfigModalProps) {
  const { toast } = useToast()
  const [confirmation, setConfirmation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReset = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Configurations Reset",
        description: "All agent configurations have been reset to their default values.",
        variant: "destructive",
      })

      onOpenChange(false)
      setConfirmation("")
    } catch (error) {
      console.error("Error resetting configurations:", error)
      toast({
        title: "Reset Failed",
        description: "There was an error resetting your configurations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Reset All Agent Configurations</DialogTitle>
          </div>
          <DialogDescription>
            This action will reset all agent configurations to their default values. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">Warning: This action cannot be undone.</p>
            <p className="text-sm mt-2">
              All custom configurations for your agents will be lost. You will need to reconfigure them manually.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Type <span className="font-bold">RESET</span> to confirm:
            </p>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="RESET"
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset} disabled={isSubmitting || confirmation !== "RESET"}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Configurations"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

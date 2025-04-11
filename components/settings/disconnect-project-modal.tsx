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

interface DisconnectProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DisconnectProjectModal({ open, onOpenChange }: DisconnectProjectModalProps) {
  const { toast } = useToast()
  const [confirmation, setConfirmation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDisconnect = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Project Disconnected",
        description: "Your GCP project has been disconnected successfully.",
        variant: "destructive",
      })

      onOpenChange(false)
      setConfirmation("")
    } catch (error) {
      console.error("Error disconnecting project:", error)
      toast({
        title: "Disconnection Failed",
        description: "There was an error disconnecting your project. Please try again.",
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
            <DialogTitle>Disconnect GCP Project</DialogTitle>
          </div>
          <DialogDescription>
            This action will disconnect your control center from the Google Cloud project. All agents will stop
            functioning immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">Warning: This action cannot be easily undone.</p>
            <p className="text-sm mt-2">
              You will need to reconfigure all your GCP settings and agent configurations if you want to reconnect.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Type <span className="font-bold">DISCONNECT</span> to confirm:
            </p>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DISCONNECT"
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={isSubmitting || confirmation !== "DISCONNECT"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              "Disconnect Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

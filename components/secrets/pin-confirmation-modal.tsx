"use client"

import type React from "react"

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
import { Loader2, ShieldAlert } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PinConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function PinConfirmationModal({ open, onOpenChange, onConfirm }: PinConfirmationModalProps) {
  const { toast } = useToast()
  const [pin, setPin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // For demo purposes, we'll use a simple PIN: 1234
  const DEMO_PIN = "1234"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (pin === DEMO_PIN) {
        onConfirm()
        setPin("")
        onOpenChange(false)
      } else {
        setError("Invalid PIN. Please try again.")
        toast({
          title: "Authentication Failed",
          description: "The PIN you entered is incorrect.",
          variant: "destructive",
        })
      }
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Security Verification
          </DialogTitle>
          <DialogDescription>
            Enter your security PIN to reveal the secret value. This action will be logged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={4}
                autoComplete="off"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || pin.length < 4}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

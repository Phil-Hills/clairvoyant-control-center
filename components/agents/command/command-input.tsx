"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"

interface CommandInputProps {
  onSubmit: (command: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function CommandInput({ onSubmit, isLoading, disabled = false }: CommandInputProps) {
  const [command, setCommand] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim() && !isLoading && !disabled) {
      onSubmit(command)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          Talk to Your AI Agent
        </CardTitle>
        <CardDescription>Describe what you want to build in Google Cloud using plain English</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="e.g. Deploy a log-watching Cloud Function in us-central1"
            className="min-h-[120px] resize-y"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isLoading || disabled}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Be specific about regions, services, and desired behavior</div>
          <Button type="submit" disabled={!command.trim() || isLoading || disabled}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Interpreting with Gemini...
              </>
            ) : (
              "Interpret with Gemini"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

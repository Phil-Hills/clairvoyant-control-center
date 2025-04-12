"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"

interface CommandInputProps {
  onSubmit: (command: string, developerMode: boolean) => void
  isLoading: boolean
  disabled?: boolean
}

export function CommandInput({ onSubmit, isLoading, disabled = false }: CommandInputProps) {
  const [command, setCommand] = useState("")
  const [developerMode, setDeveloperMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim() && !isLoading && !disabled) {
      onSubmit(command, developerMode)
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
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. Create a Cloud Function that watches Pub/Sub logs and restarts crashing agents"
            className="min-h-[120px] resize-y"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isLoading || disabled}
            rows={4}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="developer-mode"
              checked={developerMode}
              onCheckedChange={setDeveloperMode}
              disabled={isLoading || disabled}
            />
            <Label htmlFor="developer-mode" className="text-sm">
              Use developer mode (show raw tokens + log)
            </Label>
          </div>
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

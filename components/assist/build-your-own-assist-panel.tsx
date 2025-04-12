"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function BuildYourOwnAssistPanel() {
  const [name, setName] = useState("")
  const [prompt, setPrompt] = useState("")
  const [persona, setPersona] = useState("expert")
  const [outputFormat, setOutputFormat] = useState("markdown")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSaveAssist = async () => {
    if (!name.trim() || !prompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name and prompt for your assist tool.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to save the assist tool
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Assist tool saved",
        description: `Your "${name}" assist tool has been saved successfully.`,
      })
    }, 1500)
  }

  const personaTemplates = {
    expert: "I am a technical expert with deep knowledge of Google Cloud Platform services and best practices.",
    coach: "I am a supportive coach who helps users learn new concepts and improve their skills step by step.",
    analyst: "I am a data analyst who helps interpret complex information and provides actionable insights.",
    troubleshooter: "I am a troubleshooter who helps diagnose and resolve technical issues efficiently.",
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Own Assist Tool</CardTitle>
          <CardDescription>Create custom AI assistants for specific use cases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assist-name">Assist Tool Name</Label>
            <Input
              id="assist-name"
              placeholder="E.g., GCP Troubleshooter, Deployment Assistant"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="persona">Agent Persona</Label>
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger>
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expert">Technical Expert</SelectItem>
                <SelectItem value="coach">Supportive Coach</SelectItem>
                <SelectItem value="analyst">Data Analyst</SelectItem>
                <SelectItem value="troubleshooter">Troubleshooter</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {personaTemplates[persona as keyof typeof personaTemplates]}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Assist Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what your assist tool should do and how it should respond..."
              className="min-h-[150px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <RadioGroup value={outputFormat} onValueChange={setOutputFormat} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="markdown" id="markdown" />
                <Label htmlFor="markdown">Markdown</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json">JSON</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slack" id="slack" />
                <Label htmlFor="slack">Slack-style</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveAssist} disabled={isLoading || !name.trim() || !prompt.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Assist Tool
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

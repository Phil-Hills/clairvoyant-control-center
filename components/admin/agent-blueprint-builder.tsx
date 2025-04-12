"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, Upload } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

export function AgentBlueprintBuilder() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [selectedSecrets, setSelectedSecrets] = useState<string[]>([])
  const [blueprint, setBlueprint] = useState({
    name: "",
    purpose: "",
    region: "us-central1",
    triggerType: "manual",
    model: "text-bison@002",
    functionName: "",
    secrets: [] as string[],
  })

  // Mock secrets data
  const availableSecrets = ["API_KEY_OPENAI", "API_KEY_GOOGLE", "DATABASE_CONNECTION", "SLACK_WEBHOOK", "EMAIL_SERVICE"]

  const handleChange = (field: string, value: string) => {
    setBlueprint({ ...blueprint, [field]: value })
  }

  const handleSecretToggle = (secret: string) => {
    if (selectedSecrets.includes(secret)) {
      setSelectedSecrets(selectedSecrets.filter((s) => s !== secret))
      setBlueprint({
        ...blueprint,
        secrets: blueprint.secrets.filter((s) => s !== secret),
      })
    } else {
      setSelectedSecrets([...selectedSecrets, secret])
      setBlueprint({
        ...blueprint,
        secrets: [...blueprint.secrets, secret],
      })
    }
  }

  const generateBlueprint = () => {
    // In a real app, this would validate and format the blueprint properly
    return JSON.stringify(blueprint, null, 2)
  }

  const copyBlueprint = () => {
    const blueprintJson = generateBlueprint()
    navigator.clipboard.writeText(blueprintJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deployBlueprint = () => {
    toast({
      title: "Deployment initiated",
      description: `Agent "${blueprint.name}" is being deployed by the Admin Agent.`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent Name</Label>
          <Input
            id="agent-name"
            placeholder="e.g., log-analyzer-agent"
            value={blueprint.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">GCP Region</Label>
          <Select value={blueprint.region} onValueChange={(value) => handleChange("region", value)}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us-central1">us-central1</SelectItem>
              <SelectItem value="us-east1">us-east1</SelectItem>
              <SelectItem value="us-west1">us-west1</SelectItem>
              <SelectItem value="europe-west1">europe-west1</SelectItem>
              <SelectItem value="asia-east1">asia-east1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Textarea
          id="purpose"
          placeholder="Describe what this agent will do..."
          className="min-h-[80px] resize-none"
          value={blueprint.purpose}
          onChange={(e) => handleChange("purpose", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trigger-type">Trigger Type</Label>
          <Select value={blueprint.triggerType} onValueChange={(value) => handleChange("triggerType", value)}>
            <SelectTrigger id="trigger-type">
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="scheduler">Cloud Scheduler</SelectItem>
              <SelectItem value="pubsub">Pub/Sub</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Vertex AI Model</Label>
          <Select value={blueprint.model} onValueChange={(value) => handleChange("model", value)}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-bison@002">text-bison@002</SelectItem>
              <SelectItem value="chat-bison@002">chat-bison@002</SelectItem>
              <SelectItem value="gemini-pro">gemini-pro</SelectItem>
              <SelectItem value="gemini-pro-vision">gemini-pro-vision</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="function-name">Cloud Function Name</Label>
        <Input
          id="function-name"
          placeholder="e.g., agent-log-analyzer-function"
          value={blueprint.functionName}
          onChange={(e) => handleChange("functionName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Secrets (Select multiple)</Label>
        <div className="flex flex-wrap gap-2">
          {availableSecrets.map((secret) => (
            <Badge
              key={secret}
              variant={selectedSecrets.includes(secret) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSecretToggle(secret)}
            >
              {secret}
              {selectedSecrets.includes(secret) && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Blueprint Preview</Label>
        <Card className="overflow-hidden">
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <CardContent className="p-4">
              <pre className="text-xs">{generateBlueprint()}</pre>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={copyBlueprint} variant="outline" className="gap-1">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy JSON"}
        </Button>
        <Button onClick={deployBlueprint} className="gap-1">
          <Upload className="h-4 w-4" />
          Deploy via Admin Agent
        </Button>
      </div>
    </div>
  )
}

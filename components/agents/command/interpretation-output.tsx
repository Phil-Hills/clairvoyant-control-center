"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Loader2, Sparkles, Check, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AgentBlueprint, GCPService } from "./command-console"

interface InterpretationOutputProps {
  blueprint: AgentBlueprint
  onDeploy: () => void
  onEdit: () => void
  isDeploying: boolean
  isDeployed: boolean
  error: string | null
}

const serviceColors: Record<GCPService, string> = {
  "Cloud Functions": "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  "Pub/Sub": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "Secret Manager": "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  "Cloud Scheduler": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  "Vertex AI": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  "Cloud Storage": "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
}

export function InterpretationOutput({
  blueprint,
  onDeploy,
  onEdit,
  isDeploying,
  isDeployed,
  error,
}: InterpretationOutputProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(blueprint.blueprint, null, 2))
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Blueprint JSON has been copied to your clipboard",
      duration: 2000,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          Gemini's Plan for You
        </CardTitle>
        <CardDescription>Here's what Gemini will create based on your request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Summary</h3>
          <p className="text-sm text-muted-foreground">{blueprint.summary}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Detected GCP Services</h3>
          <div className="flex flex-wrap gap-2">
            {blueprint.services.map((service) => (
              <Badge key={service} variant="outline" className={serviceColors[service]}>
                {service}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Deployment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Estimated Cost:</span> <span>{blueprint.estimatedCost}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Deployment Time:</span> <span>{blueprint.deploymentTime}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Agent Blueprint</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/50">
            <pre className="text-xs font-mono">{JSON.stringify(blueprint.blueprint, null, 2)}</pre>
          </ScrollArea>
        </div>

        {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyJson}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="mr-2 h-4 w-4" />
                Copy JSON
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Input
          </Button>
        </div>
        <Button onClick={onDeploy} disabled={isDeploying || isDeployed}>
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : isDeployed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Deployed
            </>
          ) : (
            "Deploy via Admin Agent"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

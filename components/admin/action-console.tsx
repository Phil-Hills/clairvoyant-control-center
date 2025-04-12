"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ActionConsole() {
  const { toast } = useToast()
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCommand = () => {
    if (!command.trim()) return

    setIsLoading(true)

    // Simulate API call to Admin Agent
    setTimeout(() => {
      // Mock response based on command
      let response = ""

      if (command.includes("restart")) {
        response = `Command: ${command}\n\nReasoning: The agent appears to be in a stalled state based on recent logs. A restart should clear any pending operations and reset the connection pool.\n\nAction: Initiating restart sequence for the specified agent...\n\nStatus: Success\n\nFollow-up: Monitor agent logs for the next 5 minutes to ensure normal operation resumes.`
      } else if (command.includes("deploy")) {
        response = `Command: ${command}\n\nReasoning: Deployment request received. Validating blueprint configuration and resource requirements.\n\nAction: Preparing deployment pipeline...\n- Creating Cloud Function\n- Configuring Pub/Sub topic\n- Setting up IAM permissions\n- Linking Vertex AI model\n\nStatus: Deployment in progress (est. 3-5 minutes)\n\nFollow-up: Check deployment status with command "status deploy-job-12345"`
      } else if (command.includes("status")) {
        response = `Command: ${command}\n\nReasoning: Status check requested. Gathering information from GCP services.\n\nAction: Querying resource status...\n\nStatus: All systems operational\n- 5/5 Cloud Functions active\n- 2/2 Vertex AI endpoints responsive\n- 3/3 Pub/Sub topics healthy\n- 0 error logs in last 15 minutes\n\nFollow-up: No action required at this time.`
      } else {
        response = `Command: ${command}\n\nReasoning: Analyzing request pattern and intent...\n\nAction: Command not recognized as a standard operation. Attempting to interpret as natural language instruction.\n\nStatus: Partial understanding achieved\n\nFollow-up: Please clarify your request or use one of the following command formats:\n- restart [agent-name]\n- deploy [blueprint-name]\n- status [resource-type]`
      }

      setOutput(response)
      setIsLoading(false)
      setCommand("")

      toast({
        title: "Command processed",
        description: "The Admin Agent has processed your command.",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Issue command to Admin Agent (e.g., restart agent-log-watchdog)"
          className="min-h-[80px] resize-none"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <Button onClick={handleSendCommand} disabled={!command.trim() || isLoading} className="ml-auto">
          {isLoading ? "Processing..." : "Send to Admin Agent"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Card className="overflow-hidden">
        <ScrollArea className="h-[300px] w-full">
          <CardContent className="p-4">
            {output ? (
              <pre className="whitespace-pre-wrap text-sm">{output}</pre>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Command output will appear here</p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}

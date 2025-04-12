"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SimulatorPanel() {
  const [feature, setFeature] = useState("summarization")
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<null | {
    response: string
    latency: number
    tokens: {
      input: number
      output: number
      total: number
    }
  }>(null)
  const { toast } = useToast()

  const handleSimulate = async () => {
    if (!input.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to simulate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        summarization: {
          response:
            "This is a simulated summary of the provided text. It captures the key points and main ideas while maintaining the essential context.",
          latency: 1.2,
          tokens: {
            input: 120,
            output: 35,
            total: 155,
          },
        },
        knowledge: {
          response:
            "Based on the query, here's the most relevant information from our knowledge base: Google Cloud Agent Assist uses Vertex AI to provide real-time assistance during customer interactions.",
          latency: 0.8,
          tokens: {
            input: 85,
            output: 42,
            total: 127,
          },
        },
        smartReply: {
          response:
            "I understand your concern about the Cloud Function configuration. Let's check your IAM permissions first to ensure proper access to Pub/Sub.",
          latency: 0.5,
          tokens: {
            input: 65,
            output: 28,
            total: 93,
          },
        },
        buildAssist: {
          response:
            "Custom assist tool created successfully. It will respond to queries about GCP infrastructure with technical expertise and provide step-by-step guidance.",
          latency: 1.5,
          tokens: {
            input: 150,
            output: 30,
            total: 180,
          },
        },
        agentspace: {
          response:
            "Knowledge artifact generated. The system has created a structured FAQ with 5 questions and answers based on the provided content.",
          latency: 2.1,
          tokens: {
            input: 200,
            output: 45,
            total: 245,
          },
        },
      }

      setResult(mockResults[feature as keyof typeof mockResults])
      setIsLoading(false)
    }, 2000)
  }

  const handleReset = () => {
    setInput("")
    setResult(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Simulator Input</CardTitle>
          <CardDescription>Test AI features with sample inputs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={feature} onValueChange={setFeature}>
              <SelectTrigger>
                <SelectValue placeholder="Select feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summarization">Summarization</SelectItem>
                <SelectItem value="knowledge">Knowledge Assist</SelectItem>
                <SelectItem value="smartReply">Smart Reply</SelectItem>
                <SelectItem value="buildAssist">Custom Assist Tool</SelectItem>
                <SelectItem value="agentspace">Agentspace</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Enter sample text, query, or conversation..."
            className="min-h-[250px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSimulate} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Simulation
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>Performance metrics and response</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  Latency: {result.latency.toFixed(2)}s
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  Input Tokens: {result.tokens.input}
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  Output Tokens: {result.tokens.output}
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  Total Tokens: {result.tokens.total}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Response:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <p>{result.response}</p>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>Run a simulation to see results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

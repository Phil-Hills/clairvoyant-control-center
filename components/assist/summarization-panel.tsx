"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SummarizationPanel() {
  const [transcript, setTranscript] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [markForReview, setMarkForReview] = useState(false)
  const { toast } = useToast()

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty transcript",
        description: "Please enter a transcript to summarize.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to Vertex AI
    setTimeout(() => {
      const mockSummary = `This is a summarized version of the conversation that highlights key points and action items.

Key Points:
• The customer reported issues with their cloud deployment
• Agent identified configuration problems in the network settings
• Customer agreed to implement the suggested changes

Action Items:
• Schedule follow-up call next week
• Send documentation on best practices
• Create a ticket for the engineering team to review

The conversation ended positively with the customer expressing satisfaction with the proposed solution.`

      setSummary(mockSummary)
      setIsLoading(false)

      toast({
        title: "Summary generated",
        description: markForReview ? "Summary has been marked for human review." : "Summary generated successfully.",
      })
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Transcript Input</CardTitle>
          <CardDescription>Paste a conversation transcript to generate a summary</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your conversation transcript here..."
            className="min-h-[300px]"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Switch id="review" checked={markForReview} onCheckedChange={setMarkForReview} />
            <Label htmlFor="review">Mark for human review</Label>
          </div>
          <Button onClick={handleSummarize} disabled={isLoading || !transcript.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              "Summarize with Vertex AI"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Generated Summary</CardTitle>
          <CardDescription>AI-generated summary of the conversation</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {summary ? (
              <div className="whitespace-pre-line">{summary}</div>
            ) : (
              <div className="text-muted-foreground italic">Summary will appear here after processing</div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            disabled={!summary}
            onClick={() => {
              navigator.clipboard.writeText(summary)
              toast({
                title: "Copied to clipboard",
                description: "Summary has been copied to clipboard.",
              })
            }}
          >
            Copy
          </Button>
          <Button
            variant="outline"
            disabled={!summary}
            onClick={() => {
              toast({
                title: "Summary exported",
                description: "Summary has been exported to your documents.",
              })
            }}
          >
            Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

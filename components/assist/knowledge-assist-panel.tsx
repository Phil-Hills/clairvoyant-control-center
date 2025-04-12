"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThumbsUp, ThumbsDown, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function KnowledgeAssistPanel() {
  const [query, setQuery] = useState("")
  const [source, setSource] = useState("internal")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<null | {
    title: string
    source: string
    snippet: string
    url: string
  }>(null)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a question to search.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to knowledge base
    setTimeout(() => {
      const mockResults = {
        internal: {
          title: "Agent Configuration Best Practices",
          source: "Internal Knowledge Base",
          snippet:
            "When configuring agents for production use, ensure that you've set appropriate rate limits and implemented proper error handling. This guide covers the essential configuration parameters and recommended settings for different deployment scenarios.",
          url: "#internal-kb-article-123",
        },
        gcp: {
          title: "Vertex AI Agent Assist Documentation",
          source: "Google Cloud Documentation",
          snippet:
            "Agent Assist uses Vertex AI to provide real-time assistance to human agents during customer conversations. It can provide article suggestions, answer recommendations, and conversation summarization to help agents resolve customer issues more efficiently.",
          url: "https://cloud.google.com/agent-assist/docs",
        },
        custom: {
          title: "Custom Agent Templates for Financial Services",
          source: "Custom Dataset",
          snippet:
            "This document outlines specialized agent templates designed specifically for financial services use cases, including compliance requirements, security considerations, and integration patterns with common financial systems.",
          url: "#custom-dataset-doc-456",
        },
      }

      setResult(mockResults[source as keyof typeof mockResults])
      setIsLoading(false)
    }, 1500)
  }

  const handleFeedback = (positive: boolean) => {
    toast({
      title: positive ? "Positive feedback recorded" : "Negative feedback recorded",
      description: "Thank you for your feedback. This helps improve our knowledge base.",
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Assist</CardTitle>
          <CardDescription>Get instant answers from your knowledge sources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="What should I do next?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal KB</SelectItem>
                <SelectItem value="gcp">GCP Docs</SelectItem>
                <SelectItem value="custom">Custom Dataset</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {result && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription>{result.source}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md">
                  <p>{result.snippet}</p>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Was this helpful?</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleFeedback(true)}>
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleFeedback(false)}>
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

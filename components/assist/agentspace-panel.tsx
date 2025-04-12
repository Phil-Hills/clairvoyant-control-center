"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileUp, Loader2, BookOpen, FileText, Brain, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AgentspacePanel() {
  const [content, setContent] = useState("")
  const [artifactType, setArtifactType] = useState("sop")
  const [isLoading, setIsLoading] = useState(false)
  const [syncToMemory, setSyncToMemory] = useState(true)
  const [generatedContent, setGeneratedContent] = useState<null | {
    sop?: string
    faq?: string
    embedding?: string
  }>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulate reading the file
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        // Truncate content if it's too large for the demo
        const content = event.target.result.toString().substring(0, 1000)
        setContent(content + (content.length >= 1000 ? "..." : ""))

        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`,
        })
      }
    }
    reader.readAsText(file)
  }

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter or upload content to generate knowledge artifacts.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call to generate knowledge artifacts
    setTimeout(() => {
      const mockSOP = `# Standard Operating Procedure: Cloud Function Deployment

## Purpose
This SOP outlines the process for deploying Cloud Functions that interact with Pub/Sub in a secure and reliable manner.

## Prerequisites
- GCP Project with appropriate permissions
- gcloud CLI installed and configured
- Service account with required IAM roles

## Procedure
1. **Prepare Function Code**
   - Ensure proper error handling
   - Implement retry logic for transient failures
   - Add structured logging

2. **Configure Pub/Sub Trigger**
   - Create topic if it doesn't exist
   - Set up appropriate IAM permissions
   - Configure dead-letter queue for failed messages

3. **Deploy Function**
   - Use CI/CD pipeline or gcloud command
   - Set appropriate memory and timeout values
   - Enable VPC connector if needed

4. **Verify Deployment**
   - Check logs for successful initialization
   - Send test message to Pub/Sub topic
   - Verify function execution

## Troubleshooting
- Check IAM permissions if function fails to deploy
- Verify network settings if function cannot access resources
- Review logs for detailed error messages`

      const mockFAQ = `# Frequently Asked Questions: Cloud Functions & Pub/Sub

## Q: Why is my Cloud Function not triggering when messages are published?
A: Check that your function's service account has the Pub/Sub Subscriber role (roles/pubsub.subscriber) and that the topic exists in the same project as your function.

## Q: How can I handle message processing failures?
A: Implement a dead-letter topic to capture failed messages. Configure your subscription with a dead-letter policy and set appropriate retry parameters.

## Q: What's the maximum message size for Pub/Sub?
A: The maximum message size is 10MB. For larger payloads, consider storing the data in Cloud Storage and passing the object reference in the message.

## Q: How do I monitor my function's performance?
A: Use Cloud Monitoring to track execution count, execution times, and memory usage. Set up alerts for error rates exceeding normal thresholds.

## Q: Can I deploy the same function to multiple regions?
A: Yes, you can deploy the same function code to multiple regions for redundancy. However, you'll need to create separate function instances with region-specific configurations.`

      const mockEmbedding = `Memory embedding created successfully. This content has been processed and stored in the vector database with the following metadata:

Document ID: doc-${Date.now()}
Embedding Dimensions: 768
Chunks: 5
Index: clair-memory-store
Storage Location: gs://clair-memory-store/embeddings/
Similarity Search: Enabled
Context Window: 4096 tokens`

      setGeneratedContent({
        sop: artifactType === "sop" ? mockSOP : undefined,
        faq: artifactType === "faq" ? mockFAQ : undefined,
        embedding: artifactType === "embedding" ? mockEmbedding : undefined,
      })

      setIsLoading(false)

      toast({
        title: "Knowledge artifact generated",
        description: syncToMemory
          ? "Artifact has been generated and synced to memory store."
          : "Artifact has been generated successfully.",
      })
    }, 3000)
  }

  const handleExport = () => {
    let content = ""
    let filename = ""

    if (generatedContent?.sop) {
      content = generatedContent.sop
      filename = "standard-operating-procedure.md"
    } else if (generatedContent?.faq) {
      content = generatedContent.faq
      filename = "frequently-asked-questions.md"
    } else if (generatedContent?.embedding) {
      content = generatedContent.embedding
      filename = "memory-embedding-metadata.txt"
    }

    if (content) {
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `${filename} has been downloaded.`,
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Create Knowledge Artifact</CardTitle>
          <CardDescription>Transform content into structured knowledge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 border-muted-foreground/25">
            <div className="flex flex-col items-center space-y-2">
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload PDF, transcript, or web content</p>
              <Button variant="outline" asChild>
                <label>
                  Browse Files
                  <input type="file" className="sr-only" accept=".pdf,.txt,.md,.html" onChange={handleFileUpload} />
                </label>
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Or paste content here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <RadioGroup value={artifactType} onValueChange={setArtifactType} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sop" id="sop" />
              <Label htmlFor="sop" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Standard Operating Procedure (SOP)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="faq" id="faq" />
              <Label htmlFor="faq" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Frequently Asked Questions (FAQ)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="embedding" id="embedding" />
              <Label htmlFor="embedding" className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                Long-term Memory Embedding
              </Label>
            </div>
          </RadioGroup>

          <div className="flex items-center space-x-2">
            <Switch id="sync-memory" checked={syncToMemory} onCheckedChange={setSyncToMemory} />
            <Label htmlFor="sync-memory">Sync to clair-memory-store</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading || !content.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Knowledge Artifact"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Generated Artifact</CardTitle>
          <CardDescription>Preview and export your knowledge artifact</CardDescription>
        </CardHeader>
        <CardContent>
          {generatedContent ? (
            <Tabs defaultValue={artifactType} className="w-full">
              {generatedContent.sop && (
                <TabsContent value="sop" className="mt-0">
                  <ScrollArea className="h-[350px] w-full rounded-md border p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{generatedContent.sop}</pre>
                  </ScrollArea>
                </TabsContent>
              )}

              {generatedContent.faq && (
                <TabsContent value="faq" className="mt-0">
                  <ScrollArea className="h-[350px] w-full rounded-md border p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{generatedContent.faq}</pre>
                  </ScrollArea>
                </TabsContent>
              )}

              {generatedContent.embedding && (
                <TabsContent value="embedding" className="mt-0">
                  <ScrollArea className="h-[350px] w-full rounded-md border p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{generatedContent.embedding}</pre>
                  </ScrollArea>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              <p>Generated content will appear here</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleExport} disabled={!generatedContent} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Export Artifact
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

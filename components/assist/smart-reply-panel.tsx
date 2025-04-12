"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export function SmartReplyPanel() {
  const [inputMessage, setInputMessage] = useState("")
  const [tone, setTone] = useState("friendly")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm having trouble connecting my Cloud Function to Pub/Sub. Can you help?",
      sender: "user",
      timestamp: new Date(Date.now() - 300000),
    },
  ])
  const { toast } = useToast()

  const handleGenerateReplies = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to generate replies.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newUserMessage])

    // Simulate API call to generate replies
    setTimeout(() => {
      const mockReplies = {
        friendly: [
          "I'd be happy to help you connect your Cloud Function to Pub/Sub! Could you share what error you're seeing?",
          "Sure thing! Let's troubleshoot your Cloud Function and Pub/Sub connection together. What steps have you tried so far?",
          "I can definitely help with that! First, let's make sure your IAM permissions are set up correctly for both services.",
        ],
        formal: [
          "I would be pleased to assist you with connecting your Cloud Function to Pub/Sub. Please provide the error message you are encountering.",
          "Thank you for your inquiry. To resolve your Cloud Function to Pub/Sub connection issue, I'll need additional information about your configuration.",
          "I'm available to help resolve your connection issue. Let's begin by verifying your service account permissions and trigger configuration.",
        ],
        technical: [
          "To debug the Cloud Function-Pub/Sub connection, check: 1) IAM roles 2) Trigger configuration 3) Function deployment status. What's your current setup?",
          "Let's verify your Pub/Sub trigger configuration. Run `gcloud functions describe YOUR_FUNCTION` and check the eventTrigger field for proper topic binding.",
          "Check your function's service account permissions. It needs roles/pubsub.subscriber at minimum. Also verify your function's runtime matches your code.",
        ],
      }

      setSuggestedReplies(mockReplies[tone as keyof typeof mockReplies])
      setIsLoading(false)
      setInputMessage("")
    }, 1000)
  }

  const handleSendReply = (reply: string) => {
    const newAgentMessage: Message = {
      id: Date.now().toString(),
      content: reply,
      sender: "agent",
      timestamp: new Date(),
    }

    setMessages([...messages, newAgentMessage])
    setSuggestedReplies([])

    toast({
      title: "Reply sent",
      description: "Your response has been sent to the user.",
    })
  }

  const handleCopyReply = (reply: string) => {
    navigator.clipboard.writeText(reply)
    toast({
      title: "Copied to clipboard",
      description: "Response has been copied to clipboard.",
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Reply</CardTitle>
          <CardDescription>Generate contextual responses for customer conversations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user"
                    ? "ml-auto max-w-[80%] bg-primary/10 p-3 rounded-lg"
                    : "mr-auto max-w-[80%] bg-secondary p-3 rounded-lg"
                }`}
              >
                <div className="text-sm font-medium mb-1">{message.sender === "user" ? "Customer" : "Agent"}</div>
                <div>{message.content}</div>
                <div className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
          </ScrollArea>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Textarea
                placeholder="Type customer message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGenerateReplies} disabled={isLoading || !inputMessage.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Replies"
                )}
              </Button>
            </div>
          </div>

          {suggestedReplies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Suggested Replies:</h3>
              {suggestedReplies.map((reply, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm flex-1">{reply}</p>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleCopyReply(reply)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSendReply(reply)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

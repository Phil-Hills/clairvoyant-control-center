"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface JsonViewerProps {
  data: any
  title?: string
}

export function JsonViewer({ data, title }: JsonViewerProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "JSON data has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      <div className="bg-muted rounded-md overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-muted border-b">
          <span className="text-xs text-muted-foreground">JSON</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copy JSON</span>
          </Button>
        </div>
        <pre className="p-4 text-xs overflow-auto max-h-96">{jsonString}</pre>
      </div>
    </div>
  )
}

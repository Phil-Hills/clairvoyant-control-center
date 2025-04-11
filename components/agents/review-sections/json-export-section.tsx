"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Download, ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface JsonExportSectionProps {
  agentConfig: any
}

export function JsonExportSection({ agentConfig }: JsonExportSectionProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Create a clean version of the config for export (remove internal fields)
  const exportConfig = { ...agentConfig }
  delete exportConfig.validations

  const jsonString = JSON.stringify(exportConfig, null, 2)

  const handleExport = () => {
    // Create a blob and download it
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agent-${agentConfig.name.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Configuration Exported",
      description: "Agent configuration has been exported as JSON.",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)

    toast({
      title: "Copied to Clipboard",
      description: "Agent configuration JSON has been copied to clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuration Export</CardTitle>
            <CardDescription>Export or view the raw configuration</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between p-2 h-auto">
              <span className="text-sm">View Raw Configuration</span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="relative mt-2">
              <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-xs">{jsonString}</pre>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

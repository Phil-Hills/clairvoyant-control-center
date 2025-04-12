"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Bot, Save, X, AlertTriangle, Loader2, Activity, Code, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditMemoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent: any
}

export function EditMemoryDialog({ open, onOpenChange, agent }: EditMemoryDialogProps) {
  const { toast } = useToast()
  const [memory, setMemory] = useState(agent.memory)
  const [activeTab, setActiveTab] = useState("context")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasErrors, setHasErrors] = useState<Record<string, Record<string, string>>>({})

  const handleSave = () => {
    setIsSubmitting(true)

    // Validate JSON fields
    const newErrors: Record<string, Record<string, string>> = {}
    let hasValidationErrors = false

    Object.entries(memory).forEach(([section, data]: [string, any]) => {
      newErrors[section] = {}

      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (typeof value === "object") {
          try {
            // If it's already an object, it's valid
            if (typeof value !== "string") {
              // No error
            } else {
              // If it's a string, try to parse it
              JSON.parse(value)
            }
          } catch (error) {
            newErrors[section][key] = "Invalid JSON format"
            hasValidationErrors = true
          }
        }
      })
    })

    setHasErrors(newErrors)

    if (hasValidationErrors) {
      setIsSubmitting(false)
      toast({
        title: "Validation Error",
        description: "Please fix the JSON format errors before saving.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Memory Updated",
        description: `${agent.name}'s memory has been updated successfully.`,
      })
      onOpenChange(false)
    }, 1500)
  }

  const handleChange = (section: string, key: string, value: any) => {
    setMemory({
      ...memory,
      [section]: {
        ...memory[section],
        [key]: value,
      },
    })

    // Clear error when field is edited
    if (hasErrors[section]?.[key]) {
      const newErrors = { ...hasErrors }
      delete newErrors[section][key]
      setHasErrors(newErrors)
    }
  }

  const renderSection = (section: string, data: any) => {
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]: [string, any]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${section}-${key}`} className="text-sm">
                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Label>
              {hasErrors[section]?.[key] && (
                <div className="flex items-center text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {hasErrors[section][key]}
                </div>
              )}
            </div>

            {typeof value === "boolean" ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id={`${section}-${key}`}
                  checked={value}
                  onChange={(e) => handleChange(section, key, e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`${section}-${key}`}>{value ? "True" : "False"}</Label>
              </div>
            ) : typeof value === "object" ? (
              <Textarea
                id={`${section}-${key}`}
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    handleChange(section, key, parsed)
                  } catch (error) {
                    // Allow invalid JSON during editing
                    handleChange(section, key, e.target.value)
                  }
                }}
                className={cn("font-mono text-sm h-24", hasErrors[section]?.[key] && "border-destructive")}
              />
            ) : (
              <Input
                id={`${section}-${key}`}
                value={value}
                onChange={(e) => handleChange(section, key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <DialogTitle>Edit Agent Memory: {agent.name}</DialogTitle>
            <Badge
              variant="outline"
              className={cn(
                agent.status === "active" && "bg-green-500/10 text-green-500 border-green-500/20",
                agent.status === "idle" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                agent.status === "error" && "bg-red-500/10 text-red-500 border-red-500/20",
              )}
            >
              {agent.status}
            </Badge>
          </div>
          <DialogDescription>
            Modify the agent's working memory and context. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="context" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Context
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Variables
            </TabsTrigger>
            <TabsTrigger value="state" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              State
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1 p-4">
            <TabsContent value="context" className="mt-0 h-full">
              {renderSection("context", memory.context)}
            </TabsContent>
            <TabsContent value="variables" className="mt-0 h-full">
              {renderSection("variables", memory.variables)}
            </TabsContent>
            <TabsContent value="state" className="mt-0 h-full">
              {renderSection("state", memory.state)}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

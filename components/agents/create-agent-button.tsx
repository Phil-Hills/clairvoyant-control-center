"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateAgentModal } from "@/components/agents/create-agent-modal"

export function CreateAgentButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Agent
      </Button>
      <CreateAgentModal open={open} onOpenChange={setOpen} />
    </>
  )
}

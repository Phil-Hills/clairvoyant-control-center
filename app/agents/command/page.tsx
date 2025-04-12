import { CommandConsole } from "@/components/agents/command/command-console"

export const metadata = {
  title: "Agent Command Console | Clairvoyant",
  description: "Use natural language to create and deploy cloud agents with Gemini",
}

export default function CommandPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Agent Command Console</h1>
        <p className="text-muted-foreground">
          Describe what you need in plain English, and Gemini will create a cloud agent for you
        </p>
      </div>
      <div className="max-w-3xl mx-auto w-full">
        <CommandConsole />
      </div>
    </div>
  )
}

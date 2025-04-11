"use client"

import { useState } from "react"
import { PlusCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { SecretFormModal } from "@/components/secrets/secret-form-modal"

export function SecretsHeader() {
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Secrets Refreshed",
        description: "Secret data has been updated.",
      })
    }, 1000)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Secrets Manager</h1>
          <p className="text-muted-foreground">Securely manage environment secrets injected into deployed agents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Secret
          </Button>
        </div>
      </div>

      <SecretFormModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  )
}

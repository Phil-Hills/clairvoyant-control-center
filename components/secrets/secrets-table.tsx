"use client"

import { useState, useEffect } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { Clock, Copy, ExternalLink, Eye, EyeOff, KeyRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { SecretFormModal } from "@/components/secrets/secret-form-modal"
import { SecretDetailDrawer } from "@/components/secrets/secret-detail-drawer"
import { PinConfirmationModal } from "@/components/secrets/pin-confirmation-modal"
import { EmptyState } from "@/components/ui/empty-state"
import { useRouter } from "next/navigation"

interface Secret {
  id: string
  name: string
  type: string
  value: string
  autoRotation: boolean
  lastAccessed: Date | null
  usedBy: string[]
  auditLog: {
    timestamp: Date
    action: string
    agent: string
  }[]
}

export function SecretsTable() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [revealedSecrets, setRevealedSecrets] = useState<string[]>([])
  const [secretToReveal, setSecretToReveal] = useState<string | null>(null)

  // Simulate loading state briefly and then show empty state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Function to get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "api-key":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            API Key
          </Badge>
        )
      case "oauth-token":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            OAuth Token
          </Badge>
        )
      case "connection-string":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            Connection String
          </Badge>
        )
      case "password":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            Password
          </Badge>
        )
      case "json-blob":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            JSON Blob
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <KeyRound className="mr-1 h-3 w-3" />
            {type}
          </Badge>
        )
    }
  }

  const handleEditSecret = (secret: Secret) => {
    setSelectedSecret(secret)
    setIsEditModalOpen(true)
  }

  const handleViewSecret = (secret: Secret) => {
    setSelectedSecret(secret)
    setIsDetailDrawerOpen(true)
  }

  const handleDeleteSecret = (secretId: string) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSecrets(secrets.filter((secret) => secret.id !== secretId))
      setLoading(false)
      toast({
        title: "Secret Deleted",
        description: "The secret has been deleted successfully.",
        variant: "destructive",
      })
    }, 1000)
  }

  const handleRevealSecret = (secretId: string) => {
    setSecretToReveal(secretId)
    setIsPinModalOpen(true)
  }

  const handlePinConfirm = () => {
    if (secretToReveal) {
      setRevealedSecrets((prev) => [...prev, secretToReveal])
      setIsPinModalOpen(false)
      setSecretToReveal(null)
      toast({
        title: "Secret Revealed",
        description: "The secret value is now visible.",
      })
    }
  }

  const handleHideSecret = (secretId: string) => {
    setRevealedSecrets((prev) => prev.filter((id) => id !== secretId))
  }

  const handleCopySecret = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied to Clipboard",
      description: "Secret value has been copied to clipboard.",
    })
  }

  const formatSecretValue = (secret: Secret) => {
    const isRevealed = revealedSecrets.includes(secret.id)

    if (!isRevealed) {
      if (secret.type === "json-blob") {
        return "{ ... }"
      }
      return "••••••••••••••••••••••"
    }

    if (secret.type === "json-blob") {
      try {
        return JSON.parse(secret.value)
      } catch {
        return secret.value
      }
    }

    return secret.value
  }

  const handleCreateSecret = () => {
    // Open create secret modal
    setSelectedSecret(null)
    setIsEditModalOpen(true)
  }

  // Mobile card view for secrets
  const renderMobileSecretCard = (secret: Secret) => {
    const isRevealed = revealedSecrets.includes(secret.id)

    return (
      <div key={secret.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium font-mono">{secret.name}</div>
            {getTypeBadge(secret.type)}
          </div>

          <div className="flex items-center gap-2 mb-3">
            {secret.autoRotation ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <Clock className="mr-1 h-3 w-3" />
                Auto-Rotation
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Manual Rotation
              </Badge>
            )}
          </div>

          <div className="text-sm mb-2">
            <span className="text-muted-foreground">Last accessed: </span>
            <span>{secret.lastAccessed ? formatDistanceToNow(secret.lastAccessed, { addSuffix: true }) : "Never"}</span>
          </div>

          <div className="text-xs text-muted-foreground mb-1">Used by:</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {secret.usedBy.map((agent) => (
              <Badge key={agent} variant="secondary" className="text-xs">
                {agent}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              {isRevealed ? (
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleHideSecret(secret.id)}>
                  <EyeOff className="h-4 w-4" />
                  <span className="sr-only">Hide Secret</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleRevealSecret(secret.id)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Reveal Secret</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleCopySecret(secret.value)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy Secret</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleViewSecret(secret)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditSecret(secret)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Secret
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => handleDeleteSecret(secret.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Secret
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <TooltipProvider>
        {/* Desktop view - Loading */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Secret Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Auto-Rotation</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view - Loading */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    )
  }

  if (secrets.length === 0) {
    return (
      <EmptyState
        icon={KeyRound}
        title="No secrets found"
        description="You haven't added any secrets yet. Add a secret to securely store API keys, tokens, and other sensitive data."
        action={{
          label: "Add Secret",
          onClick: handleCreateSecret,
        }}
      />
    )
  }

  return (
    <TooltipProvider>
      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Secret Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Auto-Rotation</TableHead>
              <TableHead>Last Accessed</TableHead>
              <TableHead>Used By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {secrets.map((secret) => {
              const isRevealed = revealedSecrets.includes(secret.id)

              return (
                <TableRow key={secret.id}>
                  <TableCell className="font-medium font-mono">{secret.name}</TableCell>
                  <TableCell>{getTypeBadge(secret.type)}</TableCell>
                  <TableCell>
                    {secret.autoRotation ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {secret.lastAccessed ? (
                      <Tooltip>
                        <TooltipTrigger className="text-sm">
                          {formatDistanceToNow(secret.lastAccessed, { addSuffix: true })}
                        </TooltipTrigger>
                        <TooltipContent>{format(secret.lastAccessed, "PPpp")}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {secret.usedBy.map((agent) => (
                        <Badge key={agent} variant="secondary" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isRevealed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleHideSecret(secret.id)}
                            >
                              <EyeOff className="h-4 w-4" />
                              <span className="sr-only">Hide Secret</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hide Secret</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRevealSecret(secret.id)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Reveal Secret</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reveal Secret</TooltipContent>
                        </Tooltip>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopySecret(secret.value)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy to Clipboard</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to Clipboard</TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewSecret(secret)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSecret(secret)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Secret
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteSecret(secret.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Secret
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">{secrets.map(renderMobileSecretCard)}</div>

      {/* Modals and Drawers */}
      {selectedSecret && (
        <>
          <SecretFormModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            existingSecret={selectedSecret}
            onSuccess={() => {
              setSelectedSecret(null)
              // In a real app, you would update the secrets list here
            }}
          />

          <SecretDetailDrawer
            open={isDetailDrawerOpen}
            onOpenChange={setIsDetailDrawerOpen}
            secret={selectedSecret}
            isRevealed={revealedSecrets.includes(selectedSecret.id)}
            onReveal={() => handleRevealSecret(selectedSecret.id)}
            onHide={() => handleHideSecret(selectedSecret.id)}
            onCopy={() => handleCopySecret(selectedSecret.value)}
            onDelete={() => {
              handleDeleteSecret(selectedSecret.id)
              setIsDetailDrawerOpen(false)
              setSelectedSecret(null)
            }}
            onEdit={() => {
              setIsDetailDrawerOpen(false)
              setIsEditModalOpen(true)
            }}
          />
        </>
      )}

      <PinConfirmationModal open={isPinModalOpen} onOpenChange={setIsPinModalOpen} onConfirm={handlePinConfirm} />
    </TooltipProvider>
  )
}

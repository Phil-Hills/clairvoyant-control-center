"use client"

import { useState } from "react"
import { KeyRound, ExternalLink, AlertCircle, Check, X } from "lucide-react"
import { ResourceCard } from "@/components/gcp-resources/resource-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceToNow } from "date-fns"

// Mock data for Secret Manager
const mockSecrets = [
  {
    id: "secret-1",
    name: "API_KEY",
    autoRotation: true,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "api-key",
    status: "ok",
    projects: ["agent-1", "agent-3"],
  },
  {
    id: "secret-2",
    name: "DATABASE_URL",
    autoRotation: false,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: "connection-string",
    status: "ok",
    projects: ["agent-1", "agent-2", "agent-4"],
  },
  {
    id: "secret-3",
    name: "AUTH_TOKEN",
    autoRotation: true,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "oauth-token",
    status: "ok",
    projects: ["agent-2"],
  },
  {
    id: "secret-4",
    name: "OPENAI_API_KEY",
    autoRotation: false,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    type: "api-key",
    status: "ok",
    projects: ["agent-2", "agent-5"],
  },
  {
    id: "secret-5",
    name: "GOOGLE_APPLICATION_CREDENTIALS",
    autoRotation: false,
    lastAccessed: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    type: "service-account",
    status: "ok",
    projects: ["agent-1", "agent-2", "agent-3", "agent-4", "agent-5"],
  },
  {
    id: "secret-6",
    name: "SMTP_PASSWORD",
    autoRotation: false,
    lastAccessed: null,
    type: "password",
    status: "missing",
    projects: ["agent-3"],
  },
]

export function SecretManagerSection() {
  const [loading, setLoading] = useState(false)

  // Function to get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "api-key":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            API Key
          </Badge>
        )
      case "oauth-token":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            OAuth Token
          </Badge>
        )
      case "connection-string":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Connection String
          </Badge>
        )
      case "password":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Password
          </Badge>
        )
      case "service-account":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            Service Account
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            {type}
          </Badge>
        )
    }
  }

  // Mobile card view for secrets
  const renderMobileSecretCard = (secret: (typeof mockSecrets)[0]) => {
    return (
      <div key={secret.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{secret.name}</div>
            {getTypeBadge(secret.type)}
          </div>

          <div className="flex items-center gap-2 mb-3">
            {secret.status === "missing" ? (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <AlertCircle className="h-3 w-3 mr-1" />
                Missing
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <Check className="h-3 w-3 mr-1" />
                Available
              </Badge>
            )}
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Auto-rotation:</span>
              <span className="flex items-center">
                {secret.autoRotation ? (
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground mr-1" />
                )}
                {secret.autoRotation ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last accessed:</span>
              <span>
                {secret.lastAccessed ? formatDistanceToNow(secret.lastAccessed, { addSuffix: true }) : "Never"}
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-2">Used by:</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {secret.projects.map((project) => (
              <Badge key={project} variant="secondary" className="text-xs">
                {project}
              </Badge>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View in GCP Console</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <ResourceCard
        title="Secret Manager"
        description="Secret access and rotation status"
        icon={<KeyRound className="h-5 w-5" />}
      >
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Secret Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Auto-Rotation</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
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
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : mockSecrets.map((secret) => (
                    <TableRow key={secret.id}>
                      <TableCell className="font-medium">{secret.name}</TableCell>
                      <TableCell>{getTypeBadge(secret.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {secret.autoRotation ? (
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground mr-1" />
                          )}
                          {secret.autoRotation ? "Enabled" : "Disabled"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {secret.lastAccessed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm cursor-default">
                                {formatDistanceToNow(secret.lastAccessed, { addSuffix: true })}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{format(secret.lastAccessed, "PPpp")}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {secret.projects.map((project) => (
                            <Badge key={project} variant="secondary" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {secret.status === "missing" ? (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Missing
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View in GCP Console</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View in GCP Console</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {loading
            ? // Loading skeleton for mobile
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            : mockSecrets.map(renderMobileSecretCard)}
        </div>
      </ResourceCard>
    </TooltipProvider>
  )
}

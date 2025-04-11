"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, KeyRound, Clock } from "lucide-react"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for secrets
const mockSecrets = [
  { id: "secret-1", name: "API_KEY", type: "api-key", autoRotation: true },
  { id: "secret-2", name: "DATABASE_URL", type: "connection-string", autoRotation: false },
  { id: "secret-3", name: "AUTH_TOKEN", type: "oauth-token", autoRotation: true },
  { id: "secret-4", name: "OPENAI_API_KEY", type: "api-key", autoRotation: false },
  { id: "secret-5", name: "GOOGLE_APPLICATION_CREDENTIALS", type: "service-account", autoRotation: false },
]

interface SecretInjectionSectionProps {
  form: UseFormReturn<any>
  onCreateSecret: () => void
}

export function SecretInjectionSection({ form, onCreateSecret }: SecretInjectionSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <FormLabel className="text-base">Secrets</FormLabel>
          <Button type="button" variant="outline" size="sm" onClick={onCreateSecret}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Secret
          </Button>
        </div>

        <FormDescription className="mb-4">
          Select secrets to make available to this agent. Secrets will be injected as environment variables.
        </FormDescription>

        <FormField
          control={form.control}
          name="secrets"
          render={({ field }) => (
            <FormItem>
              <div className="grid gap-4 sm:grid-cols-2">
                {mockSecrets.map((secret) => (
                  <FormItem
                    key={secret.id}
                    className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-4"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(secret.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value || []), secret.id])
                            : field.onChange(field.value?.filter((value: string) => value !== secret.id))
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <div className="flex items-center gap-2">
                        <FormLabel className="font-medium cursor-pointer">{secret.name}</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <UIBadge variant="outline" className="text-xs">
                                {secret.type}
                              </UIBadge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Secret Type: {secret.type}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <KeyRound className="mr-1 h-3 w-3" />
                        <span className="mr-2">Secret Manager</span>
                        {secret.autoRotation ? (
                          <span className="flex items-center text-green-500">
                            <Clock className="mr-1 h-3 w-3" />
                            Auto-rotation enabled
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Manual rotation
                          </span>
                        )}
                      </div>
                    </div>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

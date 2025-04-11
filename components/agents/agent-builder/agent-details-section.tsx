"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for GCP regions
const gcpRegions = [
  { value: "us-central1", label: "Iowa (us-central1)" },
  { value: "us-east1", label: "South Carolina (us-east1)" },
  { value: "us-east4", label: "Northern Virginia (us-east4)" },
  { value: "us-west1", label: "Oregon (us-west1)" },
  { value: "us-west2", label: "Los Angeles (us-west2)" },
  { value: "us-west3", label: "Salt Lake City (us-west3)" },
  { value: "us-west4", label: "Las Vegas (us-west4)" },
  { value: "europe-west1", label: "Belgium (europe-west1)" },
  { value: "europe-west2", label: "London (europe-west2)" },
  { value: "europe-west3", label: "Frankfurt (europe-west3)" },
  { value: "europe-west4", label: "Netherlands (europe-west4)" },
  { value: "asia-east1", label: "Taiwan (asia-east1)" },
  { value: "asia-east2", label: "Hong Kong (asia-east2)" },
  { value: "asia-northeast1", label: "Tokyo (asia-northeast1)" },
  { value: "asia-northeast2", label: "Osaka (asia-northeast2)" },
  { value: "asia-northeast3", label: "Seoul (asia-northeast3)" },
  { value: "asia-south1", label: "Mumbai (asia-south1)" },
  { value: "asia-southeast1", label: "Singapore (asia-southeast1)" },
  { value: "australia-southeast1", label: "Sydney (australia-southeast1)" },
]

interface AgentDetailsSectionProps {
  form: UseFormReturn<any>
}

export function AgentDetailsSection({ form }: AgentDetailsSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder="my-agent-name" {...field} />
                </FormControl>
                <FormDescription>Lowercase letters, numbers, and hyphens only.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dev">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The environment where this agent will run.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this agent does..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>A brief description of the agent's purpose and functionality.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>GCP Region</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gcpRegions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Region where the agent will be deployed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Play, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentTestPanelProps {
  form: UseFormReturn<any>
  onTest: () => void
  testResults: {
    status: "idle" | "loading" | "success" | "error"
    data?: any
    logs?: string[]
  }
}

export function AgentTestPanel({ form, onTest, testResults }: AgentTestPanelProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="testPayload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Payload</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                      placeholder="{}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>JSON payload to send to the agent for testing.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <Button type="button" onClick={onTest} disabled={testResults.status === "loading"} className="w-full">
                {testResults.status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Test Results</h3>
              {testResults.status === "success" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Success
                </Badge>
              )}
              {testResults.status === "error" && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <XCircle className="mr-1 h-3 w-3" />
                  Error
                </Badge>
              )}
            </div>

            {testResults.status === "idle" ? (
              <div className="flex h-[300px] items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">Run a test to see results</p>
              </div>
            ) : testResults.status === "loading" ? (
              <div className="flex h-[300px] items-center justify-center border rounded-md bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="output" className="mt-2">
                  <div className="border rounded-md bg-muted/20 p-4">
                    {testResults.data ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Response:</h4>
                          <div className="bg-background p-3 rounded-md text-sm">{testResults.data.output}</div>
                        </div>

                        {testResults.data.metadata && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Metadata:</h4>
                            <div className="bg-background p-3 rounded-md text-sm font-mono">
                              {Object.entries(testResults.data.metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}:</span>
                                  <span>{value as string}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No output data available</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="logs" className="mt-2">
                  <ScrollArea className="h-[300px] border rounded-md bg-background p-4">
                    {testResults.logs && testResults.logs.length > 0 ? (
                      <div className="font-mono text-xs space-y-1">
                        {testResults.logs.map((log, index) => (
                          <div
                            key={index}
                            className={`${
                              log.includes("[ERROR]")
                                ? "text-red-500"
                                : log.includes("[WARNING]")
                                  ? "text-yellow-500"
                                  : "text-foreground"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No logs available</p>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

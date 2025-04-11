"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-primary"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
        </div>
        <CardTitle className="text-3xl">Welcome to Clairvoyant Control Center</CardTitle>
        <CardDescription className="text-lg">
          Let's get you connected to Google Cloud and ready to launch your first agent.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="relative h-64 w-full max-w-md">
          <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed p-8">
            <div className="text-center text-muted-foreground">
              <p>Clairvoyant helps you build, deploy, and manage AI agents in Google Cloud.</p>
              <p className="mt-4">
                You'll need a Google Cloud project and service account with the necessary permissions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={onNext}>
          Start Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

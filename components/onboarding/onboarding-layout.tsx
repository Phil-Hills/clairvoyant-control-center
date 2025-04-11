import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>
        <div className="container relative flex min-h-screen flex-col items-center justify-center py-10">
          <div className="mx-auto w-full max-w-[800px]">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  )
}

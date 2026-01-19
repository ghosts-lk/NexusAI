"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        We apologize for the inconvenience. An unexpected error occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

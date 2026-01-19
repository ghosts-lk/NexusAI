import { Button } from "@/components/ui/button"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl text-muted-foreground mb-6">Page not found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline" className="gap-2 bg-transparent">
          <Link href="javascript:history.back()">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Link>
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

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "unknown",
      auth: "unknown",
    },
  }

  try {
    // Check database connection
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("profiles").select("count").limit(1)
    checks.services.database = dbError ? "unhealthy" : "healthy"

    // Check auth service
    const { error: authError } = await supabase.auth.getSession()
    checks.services.auth = authError ? "unhealthy" : "healthy"

    // Overall status
    const allHealthy = Object.values(checks.services).every((s) => s === "healthy")
    checks.status = allHealthy ? "healthy" : "degraded"

    return NextResponse.json(checks, {
      status: checks.status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[v0] Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 503 }
    )
  }
}

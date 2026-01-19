// Simple in-memory rate limiter (free, no external dependencies)
// For production at scale, consider Upstash Redis (has generous free tier)

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs
    }
  }
  
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    }
  }
  
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now
  }
}

// Helper to get IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return "unknown"
}

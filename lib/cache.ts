// Simple in-memory cache with TTL (zero-cost, no external dependencies)
// For production at scale, migrate to Vercel KV or Upstash (generous free tiers)

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>()
  private maxSize = 1000 // Limit memory usage

  constructor() {
    // Clean up expired entries every 5 minutes
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000)
    }
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // Enforce max size
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey) this.store.delete(oldestKey)
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined

    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt < now) {
        this.store.delete(key)
      }
    }
  }
}

export const cache = new SimpleCache()

// Helper for caching async operations
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const data = await fetcher()
  cache.set(key, data, ttlSeconds)
  return data
}

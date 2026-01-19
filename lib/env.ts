// Environment variable validation and type-safe access
// Ensures all required vars are set before app starts

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const optionalEnvVars = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const

type RequiredEnvVar = (typeof requiredEnvVars)[number]
type OptionalEnvVar = (typeof optionalEnvVars)[number]

function getRequiredEnv(key: RequiredEnvVar): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnv(key: OptionalEnvVar): string | undefined {
  return process.env[key]
}

// Type-safe environment configuration
export const env = {
  // Supabase (required - free tier)
  supabase: {
    url: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },

  // Stripe (optional - only needed for payments)
  stripe: {
    secretKey: getOptionalEnv('STRIPE_SECRET_KEY'),
    publishableKey: getOptionalEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    isConfigured: Boolean(getOptionalEnv('STRIPE_SECRET_KEY')),
  },

  // App config
  app: {
    url: getOptionalEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },
} as const

// Validate on import in development
if (process.env.NODE_ENV === 'development') {
  console.log('[v0] Environment validated successfully')
  console.log('[v0] Stripe configured:', env.stripe.isConfigured)
}

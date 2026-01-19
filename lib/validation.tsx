/**
 * Input validation and sanitization utilities
 * All functions are zero-dependency for minimal bundle size
 */

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Password requirements
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  
  const trimmed = email.trim().toLowerCase()
  
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' }
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' }
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }
  }
  
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, error: 'Password is too long' }
  }
  
  // Check for at least one uppercase, lowercase, and number
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return { 
      valid: false, 
      error: 'Password must contain uppercase, lowercase, and a number' 
    }
  }
  
  return { valid: true }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Sanitize HTML content (basic - use DOMPurify for untrusted content)
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove script tags and event handlers
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
}

/**
 * Validate and sanitize workspace name
 */
export function validateWorkspaceName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Workspace name is required' }
  }
  
  const trimmed = name.trim()
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Workspace name must be at least 2 characters' }
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Workspace name must be less than 50 characters' }
  }
  
  // Only allow alphanumeric, spaces, hyphens, underscores
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
    return { valid: false, error: 'Workspace name contains invalid characters' }
  }
  
  return { valid: true }
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): ValidationResult {
  if (!uuid || typeof uuid !== 'string') {
    return { valid: false, error: 'Invalid ID' }
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid ID format' }
  }
  
  return { valid: true }
}

/**
 * Rate limit check helper (client-side)
 */
export function createRateLimitChecker(maxAttempts: number, windowMs: number) {
  const attempts: number[] = []
  
  return function check(): { allowed: boolean; retryAfter?: number } {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Remove old attempts
    while (attempts.length > 0 && attempts[0] < windowStart) {
      attempts.shift()
    }
    
    if (attempts.length >= maxAttempts) {
      const retryAfter = Math.ceil((attempts[0] + windowMs - now) / 1000)
      return { allowed: false, retryAfter }
    }
    
    attempts.push(now)
    return { allowed: true }
  }
}

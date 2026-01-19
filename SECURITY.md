# Security & Compliance - NexusAI

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

## Security Overview

NexusAI is built with security at every layer. This document outlines our security practices, compliance measures, and hardening guide.

### Security Principles

1. **Defense in Depth** - Multiple layers of security controls
2. **Zero Trust** - Verify every request, don't assume safety
3. **Least Privilege** - Users get minimum permissions needed
4. **Encryption Always** - All data encrypted in transit and at rest
5. **Audit Everything** - Log all access and changes
6. **Secure by Default** - Security features enabled by default

## Authentication & Authorization

### User Authentication

```typescript
// Supabase handles authentication
// - Email/password with secure hashing
// - JWT tokens with 1-hour expiry
// - Refresh token rotation
// - Session management with cookies
```

**Security Features**:
- Passwords hashed with bcrypt (Supabase default)
- JWT tokens signed with RS256
- HTTP-only secure cookies for auth
- CSRF protection on state-changing operations
- Automatic session timeout after 24 hours

### Authorization (Access Control)

All database access uses Row Level Security (RLS):

```sql
-- Example: Users can only see their own documents
CREATE POLICY user_documents
  ON documents
  FOR SELECT
  USING (user_id = auth.uid());
```

**Rules**:
- Documents: Users see only their own
- Tasks: Users see only their own
- Subscriptions: Users see only their own
- Admin tables: Only admin roles can access

### API Authentication

All API routes require authentication:

```typescript
// Example: Protected API route
export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  // Process request
}
```

## Data Protection

### Encryption

| Layer | Method | Responsibility |
|-------|--------|-----------------|
| **In Transit** | HTTPS (TLS 1.3) | Vercel + Supabase |
| **At Rest** | AES-256 | Supabase (automatic) |
| **API Keys** | Environment variables | Vercel Secrets |
| **Passwords** | bcrypt (10 rounds) | Supabase |

### PII Protection

Sensitive data handling:

```typescript
// Never log passwords
console.log(user) // ✓ Safe - password not included

// Never send sensitive data to client
const { password, ...safeUser } = user // ✓ Filter on server

// Always validate on server
const validated = schema.parse(input) // ✓ Server-side validation
```

### Database Access

```sql
-- All connections require:
-- 1. Valid JWT token
-- 2. RLS policies to be satisfied
-- 3. Rate limiting checks
-- 4. Audit logging
```

## API Security

### Rate Limiting

Protects against abuse and DDoS:

```typescript
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const { success } = await rateLimit(userId, 'api', 100) // 100 req/hour
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
}
```

**Limits**:
- Auth endpoints: 10 attempts/hour
- Chat API: 20 requests/hour (free tier)
- Document endpoints: 100 requests/hour
- Task endpoints: 100 requests/hour

### Input Validation

All inputs validated with Zod:

```typescript
import { z } from 'zod'

const createDocumentSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().max(50000),
})

const validated = createDocumentSchema.parse(input)
```

**Validation Rules**:
- Emails: RFC 5322 format
- Passwords: Min 8 chars, uppercase, lowercase, number
- Text fields: Max length enforced, no HTML
- Numeric fields: Type checked and range validated

### Output Sanitization

```typescript
// Prevent XSS by sanitizing output
import DOMPurify from 'isomorphic-dompurify'

const safe = DOMPurify.sanitize(userContent)
```

**Always**:
- Encode HTML special characters
- Strip HTML/JavaScript from user content
- Use React's built-in XSS protection

## CORS & CSRF

### CORS Policy

```typescript
// Only allow requests from your domain
const allowedOrigins = ['https://yourdomain.com']
// Supabase handles CORS automatically
```

### CSRF Protection

```typescript
// Supabase uses CSRF tokens in cookies
// All state-changing operations require:
// 1. Valid session cookie
// 2. Matching origin header
// 3. Correct HTTP method (POST/PUT/DELETE)
```

## Infrastructure Security

### Vercel Security

- DDoS protection
- Global edge network with rate limiting
- Automatic SSL/TLS certificates
- IP filtering (optional)
- Web Application Firewall (Enterprise)

### Supabase Security

- PostgreSQL 15+ with security updates
- Automatic backups (daily on free tier)
- Network isolation with connection pooling
- Built-in SQL injection protection
- Audit logging for all access

## Secrets Management

### Environment Variables

**Never commit secrets:**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

**Use Vercel Secrets:**
1. Never store locally
2. Add via `vercel env add` or dashboard
3. Automatically injected at build time
4. Rotated quarterly

**Secrets to Protect**:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public (safe)
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only (never public)
- `STRIPE_SECRET_KEY` - Server-only (never public)
- `STRIPE_WEBHOOK_SECRET` - Server-only (never public)

## Audit Logging

### What We Log

```typescript
// Authentication events
- User sign up
- User login
- Password change
- Email change
- Session created/destroyed

// Data modifications
- Document created/updated/deleted
- Task created/updated/deleted
- Subscription changed

// Security events
- Failed login attempts
- Unauthorized access attempts
- Rate limit violations
- API errors
```

### Log Access

Access logs in:
- Supabase dashboard → Logs
- Vercel dashboard → Logs
- Browser console (dev only)

### Log Retention

- Supabase: 90 days (free tier)
- Vercel: 24 hours (free tier)
- Compliance: Archive logs for audit trail

## Security Headers

All responses include security headers:

```typescript
// Content Security Policy - prevent XSS
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.vercel.app"

// HSTS - enforce HTTPS
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'

// X-Content-Type-Options - prevent MIME sniffing
'X-Content-Type-Options': 'nosniff'

// X-Frame-Options - prevent clickjacking
'X-Frame-Options': 'DENY'

// X-XSS-Protection - legacy XSS protection
'X-XSS-Protection': '1; mode=block'
```

## Compliance

### GDPR

**Rights**:
- ✅ Right to access your data
- ✅ Right to delete your data
- ✅ Right to data portability
- ✅ Right to opt-out of cookies

**Implementation**:
1. Cookie consent banner (shown on first visit)
2. Privacy policy at `/legal/privacy`
3. Data deletion endpoint (planned)
4. Data export feature (planned)

### CCPA (California)

Similar to GDPR:
- Opt-out of data collection
- Access to personal information
- Deletion of personal data
- Non-discrimination for exercising rights

### ISO 27001 (Information Security)

While not formally certified, we follow ISO 27001 principles:
- Access control
- Encryption
- Incident response
- Security training
- Regular audits

## Incident Response

### Security Issue Process

**If you discover a vulnerability**:
1. **Don't publicly disclose** - Contact security@ghostprotocol.com
2. **Provide details** - Steps to reproduce, impact, affected systems
3. **Wait 90 days** - Allow time to patch before public disclosure
4. **Receive credit** - We acknowledge responsible disclosures

### Incident Response Plan

```
1. Identify → Alert → Assess severity
2. Contain → Isolate affected systems
3. Eradicate → Remove threat
4. Recover → Restore to normal
5. Review → Post-incident analysis
6. Notify → Affected users (72 hours max)
```

## Penetration Testing

We recommend regular security audits:

**Recommended tools**:
- OWASP ZAP - Automated vulnerability scanning
- Burp Suite Community - Manual testing
- npm audit - Dependency vulnerabilities
- Snyk - Continuous vulnerability monitoring

**To audit yourself**:
```bash
# Check dependencies for known vulnerabilities
npm audit

# Check for insecure patterns
grep -r "password" app/
grep -r "TODO" lib/
grep -r "FIXME" components/
```

## Security Hardening Checklist

### Before Launch

- [ ] All environment variables set in Vercel
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Database RLS policies verified
- [ ] No hardcoded secrets in code
- [ ] Dependencies up to date (`npm audit`)
- [ ] Error boundaries configured

### After Launch

- [ ] Monitor Vercel error rates (daily)
- [ ] Review Supabase logs (weekly)
- [ ] Check for failed auth attempts (weekly)
- [ ] Update dependencies (monthly)
- [ ] Security audit (quarterly)
- [ ] Penetration test (semi-annually)
- [ ] Review and rotate API keys (quarterly)

## Vulnerability Disclosure

Found a security issue? Report it responsibly:

**Email**: security@ghostprotocol.com
**PGP Key**: Available at ghostprotocol.com/security
**Response Time**: 24-72 hours

We take security seriously and reward responsible disclosure.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Supabase Security](https://supabase.com/security)
- [Next.js Security](https://nextjs.org/docs/going-to-production)
- [Vercel Security](https://vercel.com/security)

---

**Questions? Contact: security@ghostprotocol.com**

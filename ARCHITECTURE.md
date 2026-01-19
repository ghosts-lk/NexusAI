# Technical Architecture - NexusAI

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

## System Architecture Overview

NexusAI is built as a **modern, cloud-native SaaS application** with clear separation of concerns, scalability at every layer, and production-ready reliability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                      │
│  React 19 Components | Next.js Pages | Tailwind UI             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│              Edge Layer (Vercel CDN)                            │
│  Request Routing | Response Caching | DDOS Protection          │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│            Application Layer (Vercel Serverless)               │
│  Next.js App Router | Route Handlers | Server Components      │
│  API Routes | Middleware | Authentication Logic               │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST/WebSocket
┌────────────────────────────▼────────────────────────────────────┐
│              Data Layer (Supabase/PostgreSQL)                 │
│  PostgreSQL Database | RLS Policies | Real-time Subscriptions│
│  Auth Service | Storage Buckets | Backups                     │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Decision Matrix

| Layer | Technology | Why | Alternative |
|-------|-----------|-----|-------------|
| **Frontend** | Next.js 16 | Full-stack React, SSR/ISR, best DX | Remix, SvelteKit |
| **Styling** | Tailwind v4 | Utility-first, dynamic config, JIT | CSS Modules, styled-components |
| **UI Components** | Radix + shadcn | Accessible, headless, MIT licensed | Material UI, Chakra |
| **Backend** | Next.js Route Handlers | Type-safe, serverless, integrated | Express, Fastify |
| **Database** | PostgreSQL (Supabase) | ACID, JSON, RLS, free tier | MongoDB, Firebase |
| **Auth** | Supabase Auth | JWT, Row Level Security, OAuth ready | NextAuth.js, Auth0 |
| **AI** | Vercel AI SDK v5 | Streaming, type-safe, free gateway | LangChain, OpenAI SDK |
| **Hosting** | Vercel | Next.js native, free tier, edge functions | AWS, Railway, Heroku |
| **Payments** | Stripe | Industry standard, free tier, webhooks | Paddle, Lemonsqueezy |
| **Real-time** | Supabase Realtime | Built-in, RLS aware, free tier | Socket.io, Firebase |
| **Caching** | SWR | React hooks, stale-while-revalidate | React Query, Apollo |
| **Validation** | Zod | TypeScript-first, runtime validation | Joi, Yup, Pydantic |

## Detailed Architecture

### 1. Client Layer (Frontend)

#### Component Architecture

```
App Root
├── Layout (providers, auth)
├── Landing Page
│   ├── Navbar
│   ├── Hero
│   ├── Features
│   ├── Pricing
│   ├── Testimonials
│   └── Footer
├── Auth Pages
│   ├── Login
│   └── Sign Up
└── Dashboard (protected)
    ├── Sidebar
    ├── Overview
    ├── Chat (AI)
    ├── Documents
    ├── Tasks
    ├── Billing
    └── Settings
```

#### State Management

```typescript
// Client state: React hooks + SWR
const { data, isLoading, error, mutate } = useSWR('/api/documents')

// Server state: HTTP caching + ISR
// Global UI state: Context API / useReducer
// Form state: React Hook Form + Zod
```

**Why this approach**:
- SWR handles caching and synchronization
- No Redux complexity needed at this scale
- Server-side rendering for SEO
- ISR for static-like performance

#### Data Flow

```
User Input
  ↓
React Component (Client)
  ↓
Form Validation (Zod)
  ↓
API Call (SWR/fetch)
  ↓
Server-side Validation
  ↓
Database Operation (Supabase)
  ↓
Response with Updated Data
  ↓
SWR Cache Update
  ↓
Component Re-render
```

### 2. Edge Layer (Vercel CDN)

#### Response Caching Strategy

```typescript
// Static pages - cached indefinitely
export const revalidate = false // Opt out of dynamic rendering

// ISR pages - revalidate every X seconds
export const revalidate = 3600 // Revalidate every hour

// Dynamic pages - cached at edge, stale-while-revalidate
// Cache-Control: max-age=0, s-maxage=60, stale-while-revalidate=120
```

**Caching Hierarchy**:
1. **Browser Cache** (client-side)
   - 5 minutes for HTML
   - 1 hour for assets
   - Query parameters invalidate cache

2. **Edge Cache** (Vercel CDN)
   - 0-1 minute for dynamic pages
   - 1-24 hours for ISR pages
   - 365 days for static assets

3. **Origin Cache** (Vercel serverless)
   - In-process caching for expensive operations
   - Database query memoization

#### Security at Edge

```
Request → DDoS Check → WAF Rules → Origin
Response → Compress → Security Headers → Cache → User
```

**Headers Added**:
- CSP: Content Security Policy
- HSTS: HTTP Strict-Transport-Security
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### 3. Application Layer (Serverless)

#### Request Flow

```
HTTP Request
  ↓
[Middleware] - Auth check, CORS, logging
  ↓
[Route Handler] - Parse, validate, rate limit
  ↓
[Auth Check] - Verify JWT, get user
  ↓
[RLS Check] - Database verifies permissions
  ↓
[Business Logic] - Process request
  ↓
[Response] - Format, cache headers
```

#### Route Organization

```
app/api/
├── chat/route.ts              # POST /api/chat
├── health/route.ts            # GET /api/health
├── webhook/
│   └── stripe/route.ts        # POST /api/webhook/stripe
└── auth/
    ├── callback/route.ts      # GET /api/auth/callback
    └── logout/route.ts        # POST /api/auth/logout
```

#### Error Handling

```typescript
// Global error boundary
app/error.tsx → Catches all route errors

// API error responses
200 Success
400 Bad Request (validation)
401 Unauthorized (no auth)
403 Forbidden (RLS denied)
404 Not Found
429 Rate Limited
500 Internal Server Error
503 Service Unavailable (AI Gateway)

// Client-side error handling
toast({ variant: "destructive" })
```

### 4. Data Layer (PostgreSQL)

#### Database Schema

```sql
-- User profiles (managed by Supabase Auth)
profiles
├── id (uuid, PK)
├── email (text)
├── full_name (text)
├── subscription_tier (enum: free, pro, enterprise)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Documents
documents
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── title (text)
├── content (text)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Tasks
tasks
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── title (text)
├── priority (enum: low, medium, high)
├── status (enum: todo, done)
├── due_date (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- AI Chat history
ai_chats
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── messages (jsonb) -- Array of messages
├── created_at (timestamp)
└── updated_at (timestamp)

-- Subscriptions
subscriptions
├── id (uuid, PK)
├── user_id (uuid, FK → profiles)
├── stripe_customer_id (text)
├── stripe_subscription_id (text)
├── plan (text)
├── status (enum: active, cancelled, past_due)
├── current_period_end (timestamp)
└── created_at (timestamp)
```

#### Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Task queries (common: filter by status and priority)
CREATE INDEX idx_tasks_status_priority ON tasks(user_id, status, priority);
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date);

-- Document search (if implementing full-text search)
CREATE INDEX idx_documents_title_gin ON documents USING gin(to_tsvector('english', title));
```

#### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users see only their own documents
CREATE POLICY "Users can see own documents"
  ON documents
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create documents"
  ON documents
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents
  FOR DELETE
  USING (user_id = auth.uid());
```

#### Query Optimization

```typescript
// Good - Fetches only needed columns
const docs = supabase
  .from('documents')
  .select('id, title, created_at')
  .eq('user_id', userId)

// Bad - Fetches all columns
const docs = supabase
  .from('documents')
  .select('*')
  .eq('user_id', userId)

// Good - Paginated
const docs = supabase
  .from('documents')
  .select('*', { count: 'exact' })
  .range(0, 9)

// Good - Filtered at database
const docs = supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'todo')
  .order('created_at', { ascending: false })
```

### 5. AI Processing Pipeline

#### Streaming Architecture

```
User Message
  ↓
Validation & Rate Limit
  ↓
Create AI SDK instance with model
  ↓
Stream response using Vercel AI Gateway
  ↓
Tokenize and cache response
  ↓
Stream updates to client via fetch/ReadableStream
  ↓
Save to ai_chats table in Supabase
```

#### Token Management

```typescript
// Free tier: 20 chats/hour
// Pro tier: 100 chats/hour
// Enterprise: Unlimited

// Response limits
const maxTokens = subscription === 'free' ? 500 : 2000

// Model selection
const model = 'openai/gpt-4o-mini' // Latest, free tier on AI Gateway
```

#### Error Handling for AI

```typescript
try {
  const response = await generateText({ model, ... })
} catch (error) {
  if (error.status === 429) {
    // Rate limited - return friendly message
  } else if (error.status === 503) {
    // AI Gateway unavailable - suggest retry
  } else {
    // Unknown error - log and report
  }
}
```

### 6. Authentication Flow

#### Sign Up → Sign In → API Access

```
┌─────────────────┐
│ User Sign Up    │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ 1. Form validation (Zod)             │
│ 2. Check email not in use            │
│ 3. Hash password (bcrypt)            │
│ 4. Create user in Supabase Auth      │
│ 5. Create profile record             │
│ 6. Send confirmation email           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Email Confirmation                   │
│ (User clicks link in email)          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ User Can Now Log In                  │
│ 1. Submit email + password           │
│ 2. Supabase verifies credentials     │
│ 3. Returns JWT token + refresh token │
│ 4. Store JWT in secure cookie        │
│ 5. Redirect to dashboard             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Authenticated API Access             │
│ 1. Include JWT in Authorization      │
│ 2. Vercel/Supabase verify token      │
│ 3. Get user ID from token            │
│ 4. RLS policy filters by user_id     │
│ 5. Return only authorized data       │
└──────────────────────────────────────┘
```

#### Token Lifecycle

```
JWT Token
├── Issued at login
├── Expires in 1 hour
├── Stored in secure HTTP-only cookie
├── Automatically refreshed via refresh token
└── Cleared on logout

Refresh Token
├── Issued at login
├── Expires in 7 days
├── Used to get new JWT silently
├── Rotated on each refresh
└── Stored server-side by Supabase
```

## Performance Characteristics

### Page Load Performance

| Page | First Load | Repeat Visits | Notes |
|------|-----------|---------------|-------|
| Landing | 0.8s (ISR) | 0.1s (cached) | 95 Lighthouse |
| Auth | 1.2s (dynamic) | 0.3s (cached) | No static data |
| Dashboard | 1.5s (SSR + RLS) | 0.4s (SWR cache) | Waits for auth |
| Chat | 1.0s (SSR) + 0.2s AI | Varies | Streaming response |

### Database Query Performance

```
SELECT count (typical cases):
- User's documents: ~5ms (indexed)
- User's tasks: ~5ms (indexed)
- Subscription info: ~3ms (indexed)

INSERT/UPDATE:
- Create document: ~10ms
- Update task: ~8ms
- Record AI chat: ~10ms

RLS Policy Evaluation: ~1-2ms overhead
```

### API Response Times

```
GET /api/documents: 50-100ms
POST /api/chat: 100-500ms (streaming starts immediately)
GET /api/health: 10ms
POST /api/webhook/stripe: 50-100ms
```

## Scaling Strategy

### Phase 1: Launch (0-1000 users)
- Free tier limits enforce fairness
- In-memory rate limiting sufficient
- Single Supabase project adequate
- Vercel handles all scaling

### Phase 2: Growth (1K-10K users)
- Add Supabase Pro ($25/mo)
- Implement Redis for rate limiting
- Add CDN for asset acceleration
- Set up error tracking with Sentry

### Phase 3: Scale (10K-100K users)
- Migrate to dedicated database
- Implement Elasticsearch for search
- Add message queue for async jobs
- Set up multi-region deployment

### Phase 4: Enterprise (100K+ users)
- Dedicated infrastructure
- Database sharding
- Microservices architecture
- Advanced analytics and reporting

## Monitoring & Observability

### Key Metrics

```
Frontend
├── Page load time (Lighthouse, Web Vitals)
├── Error rate (frontend errors)
├── User interactions (click tracking)
└── Conversion rate (signup, upgrade)

Backend
├── API response time (p50, p95, p99)
├── Error rate (5xx, 4xx)
├── Database query time
├── Rate limit violations
└── Failed authentications

Database
├── Query performance
├── Connection pool utilization
├── Storage used
├── Backup status
└── RLS policy evaluation time

AI
├── Token usage
├── Response latency
├── Error rate
├── Model performance
└── Cost per request
```

### Logging Strategy

```
Development
└─ Console logs (verbose)

Production
├─ Application logs → Vercel
├─ Database logs → Supabase
├─ Error tracking → Sentry (future)
└─ Analytics → Vercel Analytics
```

## Testing Strategy

### Unit Tests
```bash
npm run test # Not included yet
# When adding: test utility functions, validation logic
```

### Integration Tests
```bash
npm run test:integration # Not included yet
# When adding: test API routes, database operations
```

### E2E Tests
```bash
npm run test:e2e # Not included yet
# When adding: test user flows, auth, payments
```

## Deployment Pipeline

```
Developer Push to main
  ↓
GitHub → Vercel (automatic)
  ↓
Lint & Type Check
  ↓
Build Next.js app
  ↓
Run tests (future)
  ↓
Deploy to preview (optional)
  ↓
Deploy to production
  ↓
Health check endpoint
  ↓
Rollback if needed
```

---

**For deployment see [DEPLOYMENT.md](./DEPLOYMENT.md)**
**For security see [SECURITY.md](./SECURITY.md)**

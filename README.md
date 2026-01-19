# NexusAI - Production-Ready SaaS Platform

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

A comprehensive, zero-budget SaaS platform built with Next.js 16, featuring AI-powered productivity tools, secure authentication, and scalable architecture.

## Overview

NexusAI is an enterprise-grade productivity SaaS platform designed for teams to collaborate, manage tasks, create documents, and leverage AI-powered intelligent features. Built entirely on free, open-source technologies and services, it's ready for production deployment with zero infrastructure costs.

### Key Features

- **AI-Powered Chat Assistant** - Intelligent productivity helper powered by GPT-4o-mini
- **Document Management** - Create, organize, and share documents seamlessly
- **Task Management** - Track tasks with priorities, due dates, and status updates
- **Secure Authentication** - Email/password auth with JWT tokens via Supabase
- **Role-Based Access** - Support for free, pro, and enterprise tiers
- **Real-Time Sync** - SWR-powered data fetching with automatic cache invalidation
- **Performance Optimized** - ISR, SSR, and caching for sub-second response times
- **Mobile Responsive** - Fully responsive design using Tailwind CSS v4
- **GDPR Compliant** - Privacy controls, cookie consent, and data protection

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router, ISR, and Turbopack
- **React 19.2** - Latest with canary features
- **Tailwind CSS v4** - Utility-first CSS with dynamic configuration
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide Icons** - Beautiful, MIT-licensed icon library
- **SWR** - Data fetching with caching and real-time sync

### Backend & Database
- **Supabase** - PostgreSQL with Auth, RLS, and real-time capabilities
- **Node.js** - Server-side runtime on Vercel
- **TypeScript** - Type-safe application development

### AI & ML
- **Vercel AI SDK v5** - Unified AI framework with streaming support
- **OpenAI GPT-4o-mini** - Via Vercel AI Gateway (free tier available)
- **Structured Output** - Type-safe AI responses with validation

### Security & Authentication
- **Supabase Auth** - Enterprise-grade authentication
- **Row Level Security (RLS)** - Database-level access control
- **bcrypt** - Password hashing (if using custom auth)
- **CORS & CSP** - Security headers and protection
- **Input Validation** - Zod for type-safe validation
- **Rate Limiting** - In-memory rate limiter for API protection

### Payments & Billing
- **Stripe** - Payment processing (free tier, only charge when earning)
- **Webhook Handling** - Secure payment event processing

### Deployment & Infrastructure
- **Vercel** - Serverless hosting (100GB bandwidth free, analytics included)
- **GitHub** - Version control and CI/CD integration
- **PostgreSQL** - Supabase free tier (500MB storage, 50K monthly users)

### Monitoring & Analytics
- **Vercel Analytics** - Performance metrics and user insights
- **Vercel Speed Insights** - Core Web Vitals monitoring
- **Error Tracking** - Built-in error boundary and logging
- **Health Checks** - `/api/health` endpoint for monitoring

## Project Structure

```
nexusai/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles and design tokens
│   ├── page.tsx                 # Landing page
│   ├── sitemap.ts               # SEO sitemap
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   ├── api/                     # API routes
│   │   ├── chat/route.ts        # AI chat endpoint
│   │   ├── health/route.ts      # Health check
│   │   └── webhook/stripe/route.ts  # Payment webhooks
│   ├── auth/                    # Authentication pages
│   │   ├── login/page.tsx       # Login form
│   │   └── sign-up/page.tsx     # Registration form
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── layout.tsx           # Dashboard shell
│   │   ├── page.tsx             # Overview
│   │   ├── chat/page.tsx        # AI chat interface
│   │   ├── documents/page.tsx   # Document management
│   │   ├── tasks/page.tsx       # Task management
│   │   ├── billing/page.tsx     # Subscription management
│   │   └── settings/page.tsx    # User settings
│   ├── legal/                   # Legal pages
│   │   ├── privacy/page.tsx     # Privacy policy
│   │   ├── terms/page.tsx       # Terms of service
│   │   └── security/page.tsx    # Security statement
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── landing/                 # Landing page components
│   │   ├── navbar.tsx           # Navigation bar
│   │   ├── hero.tsx             # Hero section
│   │   ├── features.tsx         # Features showcase
│   │   ├── pricing.tsx          # Pricing tiers
│   │   ├── testimonials.tsx     # Social proof
│   │   └── footer.tsx           # Footer
│   ├── dashboard/               # Dashboard components
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   └── usage-tracker.tsx    # Tier usage display
│   ├── error-boundary.tsx       # Error handling
│   └── cookie-consent.tsx       # GDPR cookie banner
│
├── lib/                          # Utilities & helpers
│   ├── supabase/                # Database layer
│   │   ├── client.ts            # Client-side Supabase
│   │   ├── server.ts            # Server-side Supabase
│   │   └── proxy.ts             # Cookie handling
│   ├── stripe.ts                # Stripe configuration
│   ├── env.ts                   # Environment validation
│   ├── types.ts                 # TypeScript types
│   ├── validation.ts            # Input validation schemas
│   ├── cache.ts                 # Caching utilities
│   ├── rate-limit.ts            # Rate limiting
│   ├── logger.ts                # Structured logging
│   └── metrics.ts               # Performance metrics
│
├── hooks/                        # React hooks
│   ├── use-toast.ts             # Toast notifications
│   └── use-mobile.ts            # Mobile detection
│
├── public/                       # Static assets
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots
│
├── scripts/                      # Database migrations
│   ├── 001-create-tables.sql    # Initial schema
│   └── seed-data.sql            # Sample data
│
├── ATTRIBUTIONS.md              # Open-source licenses
├── LICENSE                      # MIT License
├── README.md                    # This file
├── DEPLOYMENT.md                # Deployment guide
├── SECURITY.md                  # Security practices
├── ARCHITECTURE.md              # Technical architecture
└── .env.example                 # Environment template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- Stripe account (optional, for payments)
- GitHub account (for deployment)

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/ghostprotocol/nexusai.git
   cd nexusai
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase keys
   ```

3. **Set Up Database**
   - Create a new Supabase project
   - Copy the project URL and anon key to `.env.local`
   - Run migrations: `npm run db:migrate`

4. **Start Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Free Tier Deployment (Vercel + Supabase)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo at https://vercel.com
   - Set environment variables from `.env.example`
   - Deploy with one click

3. **Configure Supabase**
   - Enable email auth in Supabase dashboard
   - Set up RLS policies for security
   - Configure custom domain (optional)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Security

### Built-in Security Features

- **Authentication**: JWT tokens, secure session cookies, CSRF protection
- **Database Security**: Row Level Security (RLS) policies, parameterized queries
- **API Security**: Rate limiting, request validation, error sanitization
- **Data Protection**: Encryption at rest (Supabase), HTTPS in transit, GDPR compliance
- **Secrets Management**: Environment variables only, no hardcoded secrets

See [SECURITY.md](./SECURITY.md) for comprehensive security practices and hardening guide.

## API Documentation

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2026-01-20T...",
  "uptime": 3600
}
```

## Architecture

The application follows a layered architecture:

1. **Presentation Layer** - Next.js pages and React components
2. **API Layer** - Route handlers with validation and rate limiting
3. **Business Logic Layer** - Service functions and hooks
4. **Data Access Layer** - Supabase client with type safety
5. **Infrastructure Layer** - Environment config, logging, metrics

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical design.

## Performance Optimization

- **Next.js ISR** - Incremental Static Regeneration for landing pages
- **Code Splitting** - Automatic route-based splitting
- **Image Optimization** - Next.js Image component
- **Compression** - Built-in gzip and brotli
- **Caching** - SWR with stale-while-revalidate
- **Database Indexes** - Optimized PostgreSQL queries
- **CDN** - Vercel global CDN for edge delivery

## Scalability Roadmap

Once funding becomes available:

1. **Database** - Aurora PostgreSQL or dedicated Postgres for higher limits
2. **Cache Layer** - Redis or Upstash for distributed caching
3. **Message Queue** - Bull or RabbitMQ for async jobs
4. **Search** - Meilisearch or Elasticsearch
5. **File Storage** - S3 or Vercel Blob for unlimited storage
6. **Analytics** - PostHog or Mixpanel for detailed insights
7. **Monitoring** - Sentry for error tracking and performance
8. **CDN** - Cloudflare or AWS CloudFront for lower latency

## Contributing

This project is open source under the MIT License. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support & Community

- **Documentation**: See `/DEPLOYMENT.md`, `/SECURITY.md`, `/ARCHITECTURE.md`
- **Issues**: Report bugs on GitHub Issues
- **Email**: support@ghostprotocol.com

## License & Attribution

This project is licensed under the MIT License. See [LICENSE](./LICENSE) and [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for details.

**Copyright (c) 2026 Ghost Protocol (Pvt) Ltd**

All dependencies are properly licensed (MIT, Apache 2.0, ISC). See ATTRIBUTIONS.md for the complete list.

## Roadmap

- [ ] Multi-language support
- [ ] Advanced AI models and fine-tuning
- [ ] Team collaboration features
- [ ] Mobile apps (iOS/Android)
- [ ] API for third-party integrations
- [ ] Advanced analytics and reporting
- [ ] Custom integrations with Zapier/Make
- [ ] White-label deployment option

---

**Built with ❤️ using open-source technology**

Zero-budget deployment • Production-ready • Fully documented • MIT Licensed

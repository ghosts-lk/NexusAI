# Deployment Guide - NexusAI

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

## Quick Start (5 Minutes to Production)

### Step 1: Prepare Your Repository

```bash
git clone https://github.com/yourusername/nexusai.git
cd nexusai
npm install
```

### Step 2: Create Free Accounts

1. **Supabase** - https://supabase.com (Sign up with GitHub)
2. **Vercel** - https://vercel.com (Sign up with GitHub)
3. **Stripe** - https://stripe.com (Optional, for payments)

### Step 3: Configure Supabase

1. Create a new Supabase project
2. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
5. Click Deploy

**That's it! Your SaaS is now live.**

## Detailed Deployment Steps

### Supabase Setup

#### 1. Create Project
- Go to https://supabase.com
- Click "New Project"
- Choose your region (pick closest to your users)
- Wait for provisioning (2-3 minutes)

#### 2. Database Schema
Copy your connection string and anon key to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Run migrations locally:
```bash
npm run db:migrate
```

#### 3. Enable Authentication
In Supabase dashboard:
1. Go to **Auth → Providers**
2. Ensure "Email" is enabled
3. Go to **Auth → URL Configuration**
4. Add your Vercel domain to "Redirect URLs"

#### 4. Set Up Row Level Security (RLS)
All tables have RLS enabled by default. Verify in **Database → Tables**:
- Click each table → **RLS** tab
- Ensure RLS is ON
- Check that policies match your security model

### Vercel Deployment

#### 1. Connect GitHub Repository
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js

#### 2. Configure Environment Variables
In Vercel project settings, add:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 3. Deploy
Click "Deploy" and wait 2-3 minutes for your site to go live.

### Custom Domain (Optional)

1. In Vercel settings → **Domains**
2. Add your custom domain
3. Update DNS records (follow Vercel's instructions)
4. SSL certificate auto-provisions in 24 hours

## Stripe Configuration (Optional)

### Enable Payments

1. **Create Stripe Account** - https://stripe.com
2. **Get API Keys**:
   - Go to **Developers → API Keys**
   - Copy Secret Key → `STRIPE_SECRET_KEY`
   - Copy Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

3. **Set Up Webhooks**:
   - Go to **Developers → Webhooks**
   - Add endpoint: `https://yourdomain.com/api/webhook/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`

4. **Add to Vercel**:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Go Live with Stripe

When ready to charge real customers:
1. Complete Stripe identity verification
2. In Stripe dashboard, switch to Live keys
3. Update environment variables
4. Update pricing plans in `/components/landing/pricing.tsx`

**Note**: Stripe charges a percentage (2.9% + 30¢ per transaction) but only when you earn money.

## Monitoring & Health Checks

### Check Your Deployment

1. **Vercel Logs** - View real-time logs in Vercel dashboard
2. **Health Endpoint** - Visit `https://yourdomain.com/api/health`
3. **Analytics** - Vercel provides free analytics and Core Web Vitals
4. **Error Tracking** - Check `/app/error.tsx` for error boundaries

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel |
| "Authentication redirect failed" | Add your domain to Supabase → Auth → URL Configuration |
| "CORS errors" | Ensure Supabase origin is whitelisted (default is all) |
| "Webhook not firing" | Verify Stripe webhook endpoint URL is correct |
| "AI chat returns 503" | Vercel AI Gateway may be rate limited; check AI SDK documentation |

## Performance Optimization

### Pre-Deployment Checklist

- [ ] Run `npm run build` locally - must complete without errors
- [ ] Test login/signup flow
- [ ] Test AI chat functionality
- [ ] Verify database migrations ran successfully
- [ ] Check all environment variables are set

### Production Best Practices

1. **Enable Caching**
   - Vercel caches ISR pages automatically
   - Supabase caches frequently accessed rows
   - SWR caches API responses client-side

2. **Monitor Performance**
   - Use Vercel Analytics (free)
   - Check Core Web Vitals: `https://yourdomain.com/api/health`
   - Review Vercel deployment logs

3. **Gradual Rollout**
   - Start with 1% traffic (Vercel gradual rollouts)
   - Monitor error rates
   - Scale to 100% once stable

## Scaling to Paid Tier

As your user base grows and you want to move to paid infrastructure:

### Database Scaling
Replace Supabase Free with:
- **Supabase Pro** ($25/mo) - 8GB database
- **AWS RDS Aurora** - Autoscaling PostgreSQL
- **Neon** - Serverless PostgreSQL with auto-scaling

### Caching Layer
Add Redis for distributed cache:
- **Upstash Redis** - Serverless Redis ($0.2 per 100k commands)
- **AWS ElastiCache** - Managed Redis
- **Vercel KV** - Integrated with Vercel

### CDN & Images
Upgrade to premium CDN:
- **Cloudflare** - $20/mo for edge caching
- **AWS CloudFront** - Pay-as-you-go
- **Vercel Bandwidth** - $1 per GB over 100GB free limit

### Analytics & Monitoring
Add observability tools:
- **Sentry** ($29/mo) - Error tracking and performance monitoring
- **PostHog** ($25/mo) - Product analytics
- **New Relic** ($99/mo) - Full-stack monitoring

## Rollback Procedure

If you need to revert to a previous version:

1. **Vercel Automatic Rollback**:
   - Go to Vercel dashboard → Deployments
   - Find previous deployment
   - Click → Promote to Production

2. **Manual Rollback**:
   ```bash
   git revert <commit-hash>
   git push origin main
   # Vercel auto-deploys
   ```

## Security Hardening for Production

1. **Update Supabase Auth**:
   - Set JWT expiry to 1 hour
   - Enable 2FA for admin users
   - Review user access logs

2. **Enable CORS on Database**:
   - Only allow your domain

3. **Rate Limiting**:
   - Set strict rate limits on auth endpoints
   - Use Supabase postgres_cron for automatic cleanup

4. **Secrets Management**:
   - Use Vercel Secrets instead of .env files
   - Rotate API keys quarterly

See [SECURITY.md](./SECURITY.md) for comprehensive hardening guide.

## Maintenance & Updates

### Weekly
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor database performance in Supabase

### Monthly
- [ ] Update npm dependencies: `npm update`
- [ ] Review analytics trends
- [ ] Check for security vulnerabilities: `npm audit`

### Quarterly
- [ ] Update Node.js version if new LTS available
- [ ] Review and rotate API keys
- [ ] Backup Supabase data

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth, analytics | $0 |
| Supabase | 500MB database, 50K monthly users | $0 |
| Stripe | No fixed costs | 2.9% + 30¢ per transaction |
| **Total** | | **$0** |

Once you scale:
- Supabase Pro: $25/mo
- Vercel bandwidth overages: $1/GB
- Stripe fees: variable
- Total estimate for 10K users: $50-100/mo

---

**Questions? See [README.md](./README.md) for overview or [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details.**

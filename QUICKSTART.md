# Quick Start Guide - NexusAI

**Licensed under MIT License by Ghost Protocol (Pvt) Ltd**

Get NexusAI running locally in 5 minutes, then deploy to production for free.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm or yarn
- A GitHub account
- A Supabase account (free at https://supabase.com)

## Local Setup (5 Minutes)

### 1. Clone & Install

```bash
git clone https://github.com/ghostprotocol/nexusai.git
cd nexusai
npm install
```

### 2. Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait 2-3 minutes for it to initialize
4. Go to Settings → API
5. Copy your **Project URL** and **Anon Public Key**

### 3. Configure Environment

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and paste your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Set Up Database

```bash
# Run migrations to create tables
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## First Test Run

1. **Visit Landing Page** - http://localhost:3000
   - See hero, features, pricing

2. **Sign Up** - Click "Get Started"
   - Create account with email/password
   - Confirm email (check console for link in development)

3. **Try Dashboard** - After login
   - View overview stats
   - Try AI chat (uses free tier via Vercel)
   - Create a document
   - Create a task

4. **Check Console** - Open browser DevTools
   - No errors should appear
   - See debug logs from auth flow

## Deploy to Production (5 More Minutes)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial NexusAI deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click "Deploy"
5. Wait 2-3 minutes ✨

### 3. Configure Email Confirmation

In Supabase dashboard:
1. Go to Auth → Providers
2. Ensure "Email" is enabled
3. Go to Auth → Email Templates
4. Update confirmation email (optional)

### 4. Update Redirect URLs

In Supabase Auth settings:
1. Add your Vercel domain to "Redirect URLs"
2. Format: `https://your-app.vercel.app/**`

**Your SaaS is now live!** Share your domain with users.

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution**: Check environment variables in Vercel
1. Go to Vercel project settings
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and key are set
3. Redeploy

### Issue: "Redirect URI mismatch"

**Solution**: Update Supabase redirect URLs
1. In Supabase dashboard → Auth → URL Configuration
2. Add `https://yourdomain.vercel.app/**`
3. Wait 5 minutes for changes to propagate

### Issue: "AI chat returns error"

**Solution**: Check Vercel AI Gateway status
- Vercel AI Gateway may have rate limits
- Each user gets 20 free requests/hour
- Try again after a minute

### Issue: "Sign up email not received"

**Development**: Check console output
- Supabase logs the link in development mode
- Look for email confirmation link in browser console

**Production**: Check email settings
- Verify email address is correct
- Check spam folder
- Verify Supabase SMTP is configured

## Next Steps

### 1. Customize Your SaaS

- Update branding in `/components/landing/hero.tsx`
- Change colors in `/app/globals.css`
- Modify pricing in `/components/landing/pricing.tsx`
- Update company info in `/components/landing/footer.tsx`

### 2. Enable Payments (Optional)

1. Create Stripe account at https://stripe.com
2. Get API keys from Stripe dashboard
3. Add to Vercel environment:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Set up webhooks in Stripe dashboard
5. Payments now enabled! 💳

### 3. Monitor Your App

**Vercel Dashboard**:
- View deployment logs
- Check error rates
- Monitor performance
- See analytics

**Supabase Dashboard**:
- Monitor database usage
- Check authentication logs
- View real-time metrics
- Manage user access

### 4. Add Your Domain

In Vercel project settings:
1. Go to Domains
2. Add your custom domain
3. Update DNS records (Vercel shows instructions)
4. SSL auto-provisioned in 24 hours

## File Structure Reference

```
nexusai/
├── app/                   # Pages and routes
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   ├── api/              # API endpoints
│   ├── auth/             # Auth pages
│   └── dashboard/        # Protected routes
├── components/           # React components
│   ├── landing/          # Landing sections
│   └── dashboard/        # Dashboard sections
├── lib/                  # Utilities
│   ├── supabase/         # Database helpers
│   └── validation.ts     # Input validation
├── public/               # Static files
└── scripts/              # Database migrations
```

## Documentation

- **[README.md](./README.md)** - Project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[SECURITY.md](./SECURITY.md)** - Security practices
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[ATTRIBUTIONS.md](./ATTRIBUTIONS.md)** - Open source licenses

## Development Commands

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code (if configured)
npm run format

# Database migrations
npm run db:migrate
```

## Cost Breakdown

| Service | Monthly Cost | Limit |
|---------|-------------|-------|
| Vercel | $0 | 100GB bandwidth |
| Supabase | $0 | 500MB database |
| Stripe | $0 (until you earn) | Unlimited |
| **Total** | **$0** | **For ~50K users** |

Upgrade as you grow - no costs until you're profitable!

## Scaling Tips

### When You Hit Free Tier Limits

1. **Database Full?** → Supabase Pro ($25/mo)
2. **Bandwidth Exceeded?** → Pay $1/GB overage
3. **Need More Features?** → Upgrade Stripe plan

### Performance Optimization

1. Enable caching: Done automatically ✓
2. Optimize images: Use Next.js Image component
3. Monitor Core Web Vitals: Check Vercel Analytics
4. Database indexes: Already configured ✓

## Getting Help

- **Docs**: See [README.md](./README.md), [DEPLOYMENT.md](./DEPLOYMENT.md), [SECURITY.md](./SECURITY.md)
- **Issues**: Open on GitHub
- **Email**: support@ghostprotocol.com
- **Community**: Join discussions on GitHub

## What's Included

✅ Landing page with pricing  
✅ User authentication (email/password)  
✅ AI-powered chat assistant  
✅ Document management  
✅ Task management  
✅ Billing & subscription management  
✅ User settings & profile  
✅ Fully responsive design  
✅ Dark/light mode ready  
✅ Production-ready security  
✅ Database with RLS policies  
✅ Error tracking & monitoring  
✅ GDPR compliance  
✅ Open source (MIT licensed)  

## Troubleshooting Checklist

- [ ] Node.js 18+ installed? (`node --version`)
- [ ] Dependencies installed? (`npm install`)
- [ ] Environment variables set? (`.env.local` exists)
- [ ] Database migrated? (`npm run db:migrate`)
- [ ] Dev server running? (`npm run dev`)
- [ ] Can access localhost:3000?
- [ ] Supabase email confirmed?
- [ ] Can see dashboard after login?

## Production Checklist

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive pre-launch checklist.

**Key items**:
- [ ] Environment variables in Vercel
- [ ] Supabase redirect URLs updated
- [ ] HTTPS enforced
- [ ] Error monitoring enabled
- [ ] Analytics configured
- [ ] Backup strategy set

---

**Ready to go live?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production guide.

**Questions?** Check the full [README.md](./README.md) or email support@ghostprotocol.com

# Trendlo — Dropshipping Store

Production-ready dropshipping store built with Next.js 16.1.6, Supabase,
Razorpay, CJ Dropshipping, and Resend.

## Setup Guide

### Step 1 — Supabase

1. Go to supabase.com → New Project → choose Singapore region
2. Dashboard → SQL Editor → paste supabase/schema.sql → Run
3. Also run the two helper functions:
   - increment_discount_uses
   - increment_sold_count
4. Settings → API → copy URL, anon key, service_role key → paste in .env.local
5. Auth → Settings → disable email confirmations

### Step 2 — Razorpay

1. razorpay.com → Sign up → complete KYC with PAN + bank (24–48 hrs)
2. Settings → API Keys → Generate → copy Key ID + Secret → .env.local
3. Enable: UPI, cards, netbanking, wallets
4. Start with Test Mode — switch to Live only after full testing

### Step 3 — CJ Dropshipping

1. cjdropshipping.com → Register free account
2. Developer Center → Create application
3. Copy API email + password → .env.local as CJ_EMAIL and CJ_PASSWORD

### Step 4 — Resend

1. resend.com → Sign up → Add Domain → trendlo.me
2. Add DNS records shown (TXT + MX)
3. API Keys → Create key → RESEND_API_KEY in .env.local
4. Set RESEND_FROM_EMAIL=orders@trendlo.me

### Step 5 — Deploy to Vercel

1. Push to GitHub:
   git init && git add . && git commit -m "Initial commit" && git push
2. vercel.com → Import project → connect repo
3. Add all env vars from .env.local to Vercel dashboard
4. Generate CRON_SECRET: openssl rand -hex 16
5. Deploy → visit trendlo.me

### Step 6 — Connect trendlo.me domain

1. Vercel → project → Settings → Domains → add trendlo.me
2. Add DNS records in your .me domain registrar
3. Wait 10–30 minutes → HTTPS auto-configured

### Step 7 — Import your first product

1. Go to trendlo.me/admin → sign in
2. Products → search CJ (try: gadget, wireless, home)
3. Find your hero product → Import
4. Edit price if needed (default is 3x markup)
5. Toggle active → visit trendlo.me homepage

### Step 8 — Create influencer discount code

1. Admin → Products → Discount Codes → Create New
2. Code: FRIEND10, Type: percent, Value: 10, Ref: influencer_friend
3. Send your friend:
   trendlo.me/products/[slug]?utm_source=instagram&utm_campaign=launch&ref=FRIEND10

### Step 9 — Test full purchase flow

1. Add product to cart → checkout
2. Use Razorpay test card: 4111 1111 1111 1111
3. Verify: order in /admin, confirmation email received,
   CJ order placed, UTM source saved in order

### Step 10 — Go live checklist

- [ ] Switch Razorpay to LIVE mode
- [ ] Add real Trendlo logo to /public/logo.png
- [ ] Add real OG image to /public/og-image.jpg
- [ ] Add hero product image to /public/hero-product.png
- [ ] Write real product descriptions after importing
- [ ] Test on real Android + iPhone device
- [ ] Post first Instagram Reel with UTM link
- [ ] Check admin dashboard next morning for UTM attribution

## Environment Variables

See .env.local.example for all required variables.

## Tech Stack

- Next.js 16.1.6 (App Router, Turbopack)
- React 19.2
- Supabase (PostgreSQL)
- Razorpay (payments)
- CJ Dropshipping (supplier)
- Resend (email)
- Tailwind CSS v4 + shadcn/ui
- Vercel (hosting)
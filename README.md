# LOVE AI

Stack : Next.js + TypeScript + Tailwind + Prisma + PostgreSQL + Anthropic + Stripe-ready.

## Setup

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env` and fill values.
3. Create the PostgreSQL database and run:
   npx prisma db push
4. Start dev server:
   npm run dev

## Features included

- Landing page conversion-focused
- Authentification via NextAuth + Prisma
- Générateur d’IA avec Anthropic on-server only
- Système de crédits avec ledger server-side
- Limites journalières
- Récompenses publicitaires validées côté serveur
- Plan pricing and premium routes
- Referral tracking with cookies and attribution
- Admin settings endpoint

## Important notes

- Never trust frontend-only validation.
- All API keys must be in environment variables.
- Generation cost is deducted only after successful AI call.

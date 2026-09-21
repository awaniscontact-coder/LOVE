import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const PRODUCTS = {
  credits_100: { name: '100 crédits', amount: 199, credits: 100, type: 'credit_pack' },
  credits_500: { name: '500 crédits', amount: 699, credits: 500, type: 'credit_pack' },
  credits_1500: { name: '1 500 crédits', amount: 1499, credits: 1500, type: 'credit_pack' },
  premium: { name: 'Premium', amount: 499, credits: 500, type: 'subscription' },
  premium_plus: { name: 'Premium+', amount: 999, credits: 1500, type: 'subscription' },
} as const;

const bodySchema = z.object({ productKey: z.enum(['credits_100', 'credits_500', 'credits_1500', 'premium', 'premium_plus']) });

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'Paiement non configuré.' }, { status: 503 });
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });

  try {
    const { productKey } = bodySchema.parse(await req.json());
    const product = PRODUCTS[productKey];
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
    const payment = await prisma.payment.create({
      data: { userId: session.user.id, provider: 'stripe', type: product.type, amount: product.amount, currency: 'eur', productKey, creditsAwarded: product.credits },
    });
    const checkout = await stripe.checkout.sessions.create({
      mode: product.type === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price_data: { currency: 'eur', unit_amount: product.amount, product_data: { name: product.name }, ...(product.type === 'subscription' ? { recurring: { interval: 'month' as const } } : {}) }, quantity: 1 }],
      client_reference_id: payment.id,
      metadata: { paymentId: payment.id, userId: session.user.id, productKey },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { externalId: checkout.id } });
    return NextResponse.json({ url: checkout.url });
  } catch {
    return NextResponse.json({ error: 'Impossible de créer le paiement.' }, { status: 400 });
  }
}

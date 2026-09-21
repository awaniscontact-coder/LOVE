import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Webhook non configuré.' }, { status: 503 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await req.text(), signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 }); }

  try {
    await prisma.$transaction(async (tx) => {
      try { await tx.stripeEvent.create({ data: { id: event.id, type: event.type } }); }
      catch { return; }
      if (event.type !== 'checkout.session.completed') return;
      const checkout = event.data.object as Stripe.Checkout.Session;
      const paymentId = checkout.metadata?.paymentId || checkout.client_reference_id;
      if (!paymentId || checkout.payment_status !== 'paid') return;
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment || payment.status === 'paid') return;
      await tx.payment.update({ where: { id: payment.id }, data: { status: 'paid', externalId: checkout.id } });
      if (payment.type === 'credit_pack') {
        await tx.user.update({ where: { id: payment.userId }, data: { creditBalance: { increment: payment.creditsAwarded }, creditsPurchased: { increment: payment.creditsAwarded } } });
        await tx.creditTransaction.create({ data: { userId: payment.userId, type: 'purchase', amount: payment.creditsAwarded, description: `Achat ${payment.productKey}`, referenceId: payment.id } });
      } else {
        await tx.user.update({ where: { id: payment.userId }, data: { isPremium: true, premiumTier: payment.productKey, premiumSince: new Date(), creditBalance: { increment: payment.creditsAwarded }, creditsGranted: { increment: payment.creditsAwarded } } });
        await tx.creditTransaction.create({ data: { userId: payment.userId, type: 'purchase', amount: payment.creditsAwarded, description: `Abonnement ${payment.productKey}`, referenceId: payment.id } });
      }
    });
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: 'Traitement webhook impossible.' }, { status: 500 }); }
}

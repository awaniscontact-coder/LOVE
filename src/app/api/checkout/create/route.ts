import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  const body = await req.json();
  const { itemName = 'crédit' } = body;

  return NextResponse.json({
    success: true,
    message: `Votre achat de ${itemName} a été enregistré. La validation de paiement doit être faite côté serveur via Stripe/PayPal ou un webhook.`,
  });
}

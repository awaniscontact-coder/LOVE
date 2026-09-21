import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  provider: z.string().min(2),
  verificationId: z.string().min(6),
  rewardAmount: z.number().int().min(1).max(50).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const existing = await prisma.rewardedAd.findUnique({
      where: { verificationId: parsed.verificationId },
    });

    if (existing) {
      return NextResponse.json({ error: 'Récompense déjà validée.' }, { status: 409 });
    }

    const amount = parsed.rewardAmount ?? 5;

    const rewarded = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: session.user.id } });
      if (!user) throw new Error('Utilisateur introuvable');

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          creditBalance: user.creditBalance + amount,
          creditsEarned: { increment: amount },
          creditsGranted: { increment: amount },
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          type: 'rewarded_ad',
          amount,
          description: `Récompense publicitaire via ${parsed.provider}`,
          referenceId: parsed.verificationId,
        },
      });

      return tx.rewardedAd.create({
        data: {
          userId: session.user.id,
          provider: parsed.provider,
          verificationId: parsed.verificationId,
          rewardAmount: amount,
        },
      });
    });

    return NextResponse.json({ success: true, rewarded });
  } catch (error) {
    return NextResponse.json({ error: 'Récompense invalide ou déjà utilisée.' }, { status: 400 });
  }
}

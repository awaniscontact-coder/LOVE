import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.REWARDED_AD_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Récompenses non configurées.' }, { status: 503 });
  const raw = await req.text();
  const provided = req.headers.get('x-reward-signature') || '';
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (provided.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return NextResponse.json({ error: 'Signature invalide.' }, { status: 401 });
  try {
    const body = JSON.parse(raw) as { userId?: string; provider?: string; verificationId?: string; rewardAmount?: number };
    if (!body.userId || !body.provider || !body.verificationId || !Number.isInteger(body.rewardAmount) || body.rewardAmount! < 1 || body.rewardAmount! > 5) return NextResponse.json({ error: 'Payload invalide.' }, { status: 400 });
    const result = await prisma.$transaction(async (tx) => {
      const already = await tx.rewardedAd.findUnique({ where: { verificationId: body.verificationId } });
      if (already) return { duplicate: true };
      const since = new Date(); since.setHours(0, 0, 0, 0);
      const count = await tx.rewardedAd.count({ where: { userId: body.userId, createdAt: { gte: since } } });
      if (count >= 3) throw new Error('daily_limit');
      await tx.rewardedAd.create({ data: { userId: body.userId, provider: body.provider, verificationId: body.verificationId, rewardAmount: body.rewardAmount! } });
      await tx.user.update({ where: { id: body.userId }, data: { creditBalance: { increment: body.rewardAmount! }, creditsEarned: { increment: body.rewardAmount! }, creditsGranted: { increment: body.rewardAmount! } } });
      await tx.creditTransaction.create({ data: { userId: body.userId, type: 'rewarded_ad', amount: body.rewardAmount!, description: `Récompense ${body.provider}`, referenceId: body.verificationId } });
      return { duplicate: false };
    });
    return NextResponse.json({ rewarded: !result.duplicate });
  } catch { return NextResponse.json({ error: 'Récompense refusée.' }, { status: 400 }); }
}

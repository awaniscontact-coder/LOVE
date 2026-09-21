import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateAiReply } from '@/lib/anthropic';
import { getGenerationCost } from '@/lib/pricing';

const generationSchema = z.object({
  message: z.string().min(10).max(3000),
  style: z.string().min(1),
  length: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = generationSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        creditBalance: true,
        role: true,
        dailyGenerationCount: true,
        dailyLimitReset: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    const now = new Date();
    const refreshDailyLimit = !user.dailyLimitReset || user.dailyLimitReset < now;
    const dailyCount = refreshDailyLimit ? 0 : user.dailyGenerationCount;

    if (user.role === 'user' && refreshDailyLimit === false && dailyCount >= 5) {
      return NextResponse.json({ error: 'Limite quotidienne atteinte.' }, { status: 429 });
    }

    const cost = getGenerationCost(parsed.message);
    const freeMaxLength = 1000;
    if (user.role === 'user' && parsed.message.length > freeMaxLength) {
      return NextResponse.json({ error: 'Votre message dépasse la limite gratuite.' }, { status: 400 });
    }

    if (user.creditBalance < cost) {
      return NextResponse.json({ error: 'Crédits insuffisants.' }, { status: 402 });
    }

    const responses = await generateAiReply({
      message: parsed.message,
      style: parsed.style,
      length: parsed.length,
    });

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          creditBalance: user.creditBalance - cost,
          creditsUsed: { increment: cost },
          dailyGenerationCount: refreshDailyLimit ? 1 : { increment: 1 },
          dailyLimitReset: refreshDailyLimit ? new Date(Date.now() + 86400000) : user.dailyLimitReset,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          type: 'ai_generation',
          amount: -cost,
          description: `Génération IA (${parsed.style})`,
          referenceId: `gen-${Date.now()}`,
        },
      });

      await tx.generation.create({
        data: {
          userId: user.id,
          prompt: parsed.message,
          style: parsed.style,
          length: parsed.length,
          response: responses.join('\n'),
          costCredits: cost,
        },
      });

      return { updatedUser, responses };
    });

    return NextResponse.json({
      success: true,
      cost,
      remainingCredits: result.updatedUser.creditBalance,
      responses: result.responses,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Génération impossible pour le moment.' }, { status: 400 });
  }
}

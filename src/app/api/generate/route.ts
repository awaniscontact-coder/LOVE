import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({ message: z.string().trim().min(10).max(3000), style: z.enum(['Naturel','Romantique','Flirt','Drôle','Séduisant','Amical','Professionnel','Court','Direct']), length: z.enum(['Court','Standard','Long']) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  try {
    const parsed = schema.parse(await req.json());
    const now = new Date();
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, creditBalance: true, role: true, isPremium: true, dailyGenerationCount: true, dailyLimitReset: true } });
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    const reset = !user.dailyLimitReset || user.dailyLimitReset <= now;
    const count = reset ? 0 : user.dailyGenerationCount;
    if (user.role !== 'admin' && !user.isPremium && count >= 5) return NextResponse.json({ error: 'Limite quotidienne atteinte.' }, { status: 429 });
    if (!user.isPremium && user.role !== 'admin' && parsed.message.length > 1000) return NextResponse.json({ error: 'Votre message dépasse la limite gratuite.' }, { status: 400 });
    const cost = parsed.message.length <= 300 ? 1 : parsed.message.length <= 600 ? 2 : parsed.message.length <= 1000 ? 3 : parsed.message.length <= 2000 ? 5 : 8;
    if (user.creditBalance < cost) return NextResponse.json({ error: 'Crédits insuffisants.' }, { status: 402 });
    const { generateAiReply } = await import('@/lib/anthropic');
    const responses = await generateAiReply(parsed);
    const generationId = crypto.randomUUID();
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({ where: { id: user.id, creditBalance: { gte: cost } }, data: { creditBalance: { decrement: cost }, creditsUsed: { increment: cost }, dailyGenerationCount: reset ? 1 : { increment: 1 }, dailyLimitReset: reset ? new Date(Date.now() + 86400000) : user.dailyLimitReset } });
      if (updated.count !== 1) throw new Error('balance_changed');
      await tx.creditTransaction.create({ data: { userId: user.id, type: 'ai_generation', amount: -cost, description: `Génération IA (${parsed.style})`, referenceId: generationId } });
      await tx.generation.create({ data: { userId: user.id, prompt: parsed.message, style: parsed.style, length: parsed.length, response: responses.join('\n'), costCredits: cost } });
      return tx.user.findUniqueOrThrow({ where: { id: user.id }, select: { creditBalance: true } });
    });
    return NextResponse.json({ success: true, cost, remainingCredits: result.creditBalance, responses });
  } catch { return NextResponse.json({ error: 'Génération impossible pour le moment.' }, { status: 400 }); }
}

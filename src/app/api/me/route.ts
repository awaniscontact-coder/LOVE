import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, email: true, name: true, role: true, creditBalance: true, creditsEarned: true, creditsUsed: true, creditsPurchased: true, creditsGranted: true, isPremium: true, premiumTier: true, dailyGenerationCount: true, dailyLimitReset: true, referralCode: true, influencer: { select: { username: true, name: true } } } });
  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  return NextResponse.json({ user });
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
export async function GET() { const session = await getServerSession(authOptions); if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Admin requis.' }, { status: 403 }); const [users, generations, payments, rewardedAds] = await Promise.all([prisma.user.count(), prisma.generation.count(), prisma.payment.count({ where: { status: 'paid' } }), prisma.rewardedAd.count()]); return NextResponse.json({ users, generations, payments, rewardedAds }); }

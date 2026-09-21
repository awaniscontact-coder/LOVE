import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({ name: z.string().trim().min(2).max(80), username: z.string().trim().regex(/^[a-zA-Z0-9_-]{2,32}$/), commissionRate: z.number().min(0).max(1).default(0.1) });
async function admin() { const session = await getServerSession(authOptions); return session?.user?.role === 'admin'; }
export async function GET() { if (!(await admin())) return NextResponse.json({ error: 'Admin requis.' }, { status: 403 }); const influencers = await prisma.influencer.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { users: true, referrals: true } } } }); return NextResponse.json({ influencers }); }
export async function POST(req: NextRequest) { if (!(await admin())) return NextResponse.json({ error: 'Admin requis.' }, { status: 403 }); const parsed = schema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ error: 'Données invalides.' }, { status: 400 }); try { const influencer = await prisma.influencer.create({ data: { ...parsed.data, username: parsed.data.username.toLowerCase(), referralCode: parsed.data.username.toUpperCase() } }); return NextResponse.json({ influencer }, { status: 201 }); } catch { return NextResponse.json({ error: 'Username déjà utilisé.' }, { status: 409 }); } }

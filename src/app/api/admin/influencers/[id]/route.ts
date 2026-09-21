import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
const schema = z.object({ id: z.string().cuid(), active: z.boolean() });
export async function PATCH(req: NextRequest) { const session = await getServerSession(authOptions); if (session?.user?.role !== 'admin') return NextResponse.json({ error: 'Admin requis.' }, { status: 403 }); const parsed = schema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ error: 'Données invalides.' }, { status: 400 }); const influencer = await prisma.influencer.update({ where: { id: parsed.data.id }, data: { active: parsed.data.active } }); return NextResponse.json({ influencer }); }

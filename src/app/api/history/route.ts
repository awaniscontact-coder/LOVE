import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const generations = await prisma.generation.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  return NextResponse.json({ generations });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const input = z.object({ id: z.string().cuid() }).safeParse(await req.json());
  if (!input.success) return NextResponse.json({ error: 'Identifiant invalide.' }, { status: 400 });
  const deleted = await prisma.generation.deleteMany({ where: { id: input.data.id, userId: session.user.id } });
  return deleted.count ? NextResponse.json({ success: true }) : NextResponse.json({ error: 'Conversation introuvable.' }, { status: 404 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin requis' }, { status: 403 });
  }

  const settings = await prisma.settings.findMany();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin requis' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = settingsSchema.parse(body);

  const value = await prisma.settings.upsert({
    where: { key: parsed.key },
    update: { value: parsed.value, type: parsed.type || 'string', description: parsed.description },
    create: { key: parsed.key, value: parsed.value, type: parsed.type || 'string', description: parsed.description },
  });

  return NextResponse.json({ success: true, value });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { generateAiReply } from '@/lib/ai-provider';

const schema = z.object({
  message: z.string().trim().min(10).max(3000),
  style: z.enum(['Naturel', 'Romantique', 'Flirt', 'Drôle', 'Séduisant', 'Amical', 'Professionnel', 'Court', 'Direct']),
  length: z.enum(['Court', 'Standard', 'Long']),
});

/** Internal AI API. It is server-authenticated and never exposes provider secrets. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  try {
    const input = schema.parse(await req.json());
    return NextResponse.json({ responses: await generateAiReply(input) });
  } catch {
    return NextResponse.json({ error: 'Requête IA invalide.' }, { status: 400 });
  }
}

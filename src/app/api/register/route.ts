import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateReferralCode } from '@/lib/referrals';

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80).optional(),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json({ error: 'Vous êtes déjà connecté.' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = registerBodySchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Cette adresse e-mail est déjà utilisée.' }, { status: 409 });
    }

    const signupBonus = 10;
    const passwordHash = await bcrypt.hash(parsed.password, 12);

    let influencerId: string | null = null;
    if (parsed.referralCode) {
      const influencer = await prisma.influencer.findUnique({ where: { referralCode: parsed.referralCode.toUpperCase() } });
      if (influencer) {
        influencerId = influencer.id;
      }
    }

    const user = await prisma.user.create({
      data: {
        email: parsed.email.toLowerCase(),
        name: parsed.name || 'User',
        passwordHash,
        referralCode: generateReferralCode(),
        creditBalance: signupBonus,
        creditsEarned: signupBonus,
        creditsGranted: signupBonus,
        influencerId,
      },
    });

    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        type: 'signup_bonus',
        amount: signupBonus,
        description: 'Bonus de bienvenue à l’inscription',
        referenceId: user.id,
      },
    });

    if (influencerId) {
      await prisma.referral.create({
        data: {
          userId: user.id,
          influencerId,
          sourceCode: parsed.referralCode?.toUpperCase(),
          isActive: true,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Données invalides ou serveur indisponible.' }, { status: 400 });
  }
}

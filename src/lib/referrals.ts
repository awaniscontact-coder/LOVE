import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export function withReferralCookie(request: NextRequest) {
  const url = new URL(request.url);
  const ref = url.searchParams.get('ref');

  if (!ref) return NextResponse.next();

  const response = NextResponse.next();
  response.cookies.set('referral_source', ref, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export function generateReferralCode() {
  return randomUUID().slice(0, 8).toUpperCase();
}

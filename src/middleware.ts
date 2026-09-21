import { NextRequest, NextResponse } from 'next/server';
import { withReferralCookie } from '@/lib/referrals';

export function middleware(request: NextRequest) {
  return withReferralCookie(request);
}

export const config = {
  matcher: ['/', '/register', '/login', '/generator', '/pricing'],
};

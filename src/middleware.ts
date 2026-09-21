import { NextResponse, type NextRequest } from 'next/server';
import { withReferralCookie } from '@/lib/referrals';
export function middleware(request: NextRequest) { const response = withReferralCookie(request); response.headers.set('X-Content-Type-Options', 'nosniff'); response.headers.set('X-Frame-Options', 'DENY'); response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); return response; }
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };

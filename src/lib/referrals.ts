import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
export function withReferralCookie(request: NextRequest) { const ref = request.nextUrl.searchParams.get('ref'); const response = NextResponse.next(); if (ref && /^[a-zA-Z0-9_-]{2,64}$/.test(ref) && !request.cookies.get('referral_source')) response.cookies.set('referral_source', ref, { path: '/', httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 30 }); return response; }
export function generateReferralCode() { return randomUUID().slice(0, 8).toUpperCase(); }

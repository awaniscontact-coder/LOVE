import { NextRequest, NextResponse } from 'next/server';

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function parseRequestBody(req: NextRequest) {
  return req.json();
}

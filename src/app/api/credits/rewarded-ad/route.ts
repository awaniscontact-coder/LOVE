import { NextRequest, NextResponse } from 'next/server';
export async function POST(_req: NextRequest) { return NextResponse.json({ error: 'La récompense doit être confirmée par le webhook du fournisseur publicitaire.' }, { status: 410 }); }

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Programming Brains API',
    version: '1.0.0'
  });
}
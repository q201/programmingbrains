
import { NextRequest, NextResponse } from 'next/server';
import { AuthenticatedUser, withAuth } from '@/lib/auth';

async function handler(req: NextRequest, user: AuthenticatedUser) {
  try {
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler, []);


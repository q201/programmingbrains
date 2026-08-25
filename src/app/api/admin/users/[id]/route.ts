
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth, AuthenticatedUser } from '@/lib/auth';

async function handler(
  req: NextRequest,
  user: AuthenticatedUser,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (req.method === 'PUT') {
    try {
      const { role } = await req.json();
      const user = await db.user.update({
        where: { id },
        data: { role },
      });
      return NextResponse.json(user);
    } catch (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.user.delete({ where: { id } });
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export const PUT = withAuth(handler, ['admin']);
export const DELETE = withAuth(handler, ['admin']);


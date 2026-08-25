import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth, AuthenticatedUser } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

async function putHandler(req: NextRequest, user: AuthenticatedUser, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    const updated = await db.newsSource.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating news source:', error);
    return NextResponse.json({ error: 'Failed to update news source' }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest, user: AuthenticatedUser, context: RouteContext) {
  try {
    const { id } = await context.params;
    await db.newsSource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news source:', error);
    return NextResponse.json({ error: 'Failed to delete news source' }, { status: 500 });
  }
}

export const PUT = withAuth(putHandler, ['admin']);
export const DELETE = withAuth(deleteHandler, ['admin']);

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';

// Define the route context type that Next.js expects for App Router params
type RouteContext = { params: Promise<{ id: string }> };

async function getHandler(req: NextRequest, user: { id: string }, context: RouteContext) {
  try {
    const { id } = await context.params;
    const newsItem = await db.news.findUnique({
      where: { id },
    });
    if (!newsItem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(newsItem);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

async function putHandler(req: NextRequest, user: { id: string }, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await req.json();
    
    // Remove relations/id fields from being updated directly if they are in data
    delete data.id;
    delete data.authorId;
    delete data.createdAt;
    delete data.updatedAt;

    const updated = await db.news.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

async function deleteHandler(req: NextRequest, user: { id: string }, context: RouteContext) {
  try {
    const { id } = await context.params;
    await db.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['admin']);
export const PUT = withAuth(putHandler, ['admin']);
export const DELETE = withAuth(deleteHandler, ['admin']);

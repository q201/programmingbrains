import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function getHandler() {
  try {
    const sources = await db.newsSource.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching news sources:', error);
    return NextResponse.json({ error: 'Failed to fetch news sources' }, { status: 500 });
  }
}

async function postHandler(req: NextRequest) {
  try {
    const { name, category, url, type, enabled, description } = await req.json();

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const source = await db.newsSource.create({
      data: {
        name,
        category: category || 'Technology',
        url,
        type: type || 'rss',
        enabled: enabled ?? true,
        description,
      },
    });

    return NextResponse.json(source);
  } catch (error) {
    console.error('Error creating news source:', error);
    return NextResponse.json({ error: 'Failed to create news source' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['admin']);
export const POST = withAuth(postHandler, ['admin']);

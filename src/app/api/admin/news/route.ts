import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function postHandler(req: NextRequest, user: { id: string }) {
  try {
    const {
      title,
      content,
      slug,
      excerpt,
      sourceUrl,
      coverImage,
      imageAlt,
      tags,
      seoTitle,
      seoDesc,
      published,
      featured
    } = await req.json();

    if (!title || !content || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const news = await db.news.create({
      data: {
        title,
        content,
        slug,
        excerpt,
        sourceUrl,
        coverImage,
        imageAlt,
        tags: tags || [],
        seoTitle,
        seoDesc,
        published: published ?? false,
        featured: featured ?? false,
        authorId: user.id,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

async function getHandler() {
  try {
    const newsList = await db.news.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(newsList);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ['admin']);
export const GET = withAuth(getHandler, ['admin']);

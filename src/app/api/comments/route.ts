import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { blogId, authorName, content } = await req.json();

    if (!blogId || !authorName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: blogId, authorName, and content are required' },
        { status: 400 }
      );
    }

    const cleanName = authorName.trim();
    const guestEmail = `guest_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}@commenter.local`;

    // Find or create guest user
    let user = await db.user.findFirst({
      where: {
        OR: [
          { email: guestEmail },
          { name: cleanName }
        ]
      }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: cleanName,
          email: guestEmail,
          password: 'guest_commenter_nopassword',
          role: 'USER'
        }
      });
    }

    const newComment = await db.comment.create({
      data: {
        content: content.trim(),
        blogId,
        authorId: user.id,
        approved: true
      },
      include: {
        author: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating comment:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to post comment', details },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Query parameters
        const category = searchParams.get('category');
        const tag = searchParams.get('tag');
        const featured = searchParams.get('featured');
        const authorId = searchParams.get('authorId');
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search');

        // Build where clause
        const where: Prisma.BlogWhereInput = { published: true };

        if (category) {
            where.categories = {
                some: {
                    name: {
                        equals: category,
                        mode: 'insensitive'
                    }
                }
            };
        }

        if (tag) {
            where.tags = {
                has: tag
            };
        }

        if (featured === 'true') {
            where.featured = true;
        }

        if (authorId) {
            where.authorId = authorId;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Fetch blogs with pagination
        const [blogs, total] = await Promise.all([
            db.blog.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            bio: true
                        }
                    },
                    categories: true
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: (page - 1) * limit
            }),
            db.blog.count({ where })
        ]);

        return NextResponse.json({
            blogs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

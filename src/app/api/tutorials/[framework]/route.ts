import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toFrameworkSlug, toTutorialTrack } from "@/lib/tutorial-transform";

interface RouteParams {
  params: Promise<{ framework: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { framework } = await params;

    // 1. Try to fetch from TutorialTrack table
    const dbTrack = await db.tutorialTrack.findFirst({
      where: { slug: framework, published: true },
      include: {
        topics: {
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    if (dbTrack) {
      return NextResponse.json({
        track: {
          slug: dbTrack.slug,
          title: dbTrack.title,
          description: dbTrack.description || "",
          level: dbTrack.level || "All Levels",
          totalDuration: dbTrack.totalDuration || `${dbTrack.topics.length} topics`,
          topics: dbTrack.topics.map((topic) => ({
            id: topic.id,
            title: topic.title,
            duration: topic.duration || "15 min",
            summary: topic.summary || "",
            content: topic.content
          }))
        }
      });
    }

    // 2. Fallback to category mapping
    const categories = await db.category.findMany({
      include: {
        blogs: {
          where: { published: true },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            content: true,
            readTime: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const category = categories.find((item) => toFrameworkSlug(item.name) === framework);

    if (!category || category.blogs.length === 0) {
      return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
    }

    return NextResponse.json({ track: toTutorialTrack(category) });
  } catch (error) {
    console.error("Error fetching tutorial:", error);
    return NextResponse.json({ error: "Failed to fetch tutorial" }, { status: 500 });
  }
}

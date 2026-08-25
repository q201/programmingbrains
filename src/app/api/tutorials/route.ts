import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toTutorialTrack } from "@/lib/tutorial-transform";

export async function GET() {
  try {
    const dbTracks = await db.tutorialTrack.findMany({
      where: { published: true },
      include: {
        topics: {
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: { sortOrder: "asc" }
    });

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
      orderBy: { name: "asc" },
    });

    const categoryTracks = categories
      .filter((category) => category.blogs.length > 0)
      .map((category) => toTutorialTrack(category));

    // Combine them, prioritizing direct db tracks to avoid duplicate slugs
    const combinedTracksMap = new Map();

    dbTracks.forEach((t) => {
      combinedTracksMap.set(t.slug, {
        slug: t.slug,
        title: t.title,
        description: t.description || "",
        level: t.level || "All Levels",
        totalDuration: t.totalDuration || `${t.topics.length} topics`,
        topics: t.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          duration: topic.duration || "15 min",
          summary: topic.summary || "",
          content: topic.content
        }))
      });
    });

    categoryTracks.forEach((t) => {
      if (!combinedTracksMap.has(t.slug)) {
        combinedTracksMap.set(t.slug, t);
      }
    });

    return NextResponse.json({ tracks: Array.from(combinedTracksMap.values()) });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return NextResponse.json({ error: "Failed to fetch tutorials" }, { status: 500 });
  }
}

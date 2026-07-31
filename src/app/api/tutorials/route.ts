import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toTutorialTrack } from "@/lib/tutorial-transform";

export async function GET() {
  try {
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

    const tracks = categories
      .filter((category) => category.blogs.length > 0)
      .map((category) => toTutorialTrack(category));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return NextResponse.json({ error: "Failed to fetch tutorials" }, { status: 500 });
  }
}

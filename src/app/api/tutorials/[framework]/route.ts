import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toFrameworkSlug, toTutorialTrack } from "@/lib/tutorial-transform";

interface RouteParams {
  params: Promise<{ framework: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { framework } = await params;

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

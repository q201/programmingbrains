import type { Category, Blog } from "@prisma/client";
import type { TutorialTrack } from "@/types/tutorial";

type CategoryWithBlogs = Category & {
  blogs: Pick<Blog, "id" | "slug" | "title" | "excerpt" | "content" | "readTime">[];
};

export function toFrameworkSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

export function toTutorialTrack(category: CategoryWithBlogs): TutorialTrack {
  const slug = toFrameworkSlug(category.name);
  const topics = category.blogs.map((blog, index) => ({
    id: blog.id,
    title: blog.title,
    duration: blog.readTime || "10 min read",
    summary: blog.excerpt || `Topic ${index + 1} from the ${category.name} tutorial series.`,
    content: blog.content || "<p>Content coming soon.</p>",
  }));

  return {
    slug,
    title: `${category.name} Tutorial`,
    description: `Learn ${category.name} with practical topics powered by your published blog content.`,
    level: "All Levels",
    totalDuration: `${topics.length} topics`,
    topics,
  };
}

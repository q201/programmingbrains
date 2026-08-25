import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Latest Tutorials & Publications | Programming Brains',
  description: 'Stay updated with the newest tutorials, system architecture articles, and engineering guides.',
};

export default async function LatestPage() {
  const latestBlogs = await db.blog.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
          avatar: true
        }
      },
      categories: true
    },
    orderBy: { createdAt: 'desc' },
    take: 12
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 bg-grid-pattern">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            🔥 Latest Releases
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            Fresh Engineering Guides
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            The newest publications, tutorials, and system architecture breakdowns.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestBlogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-slate-200/80">
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.imageAlt || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                      <span className="text-white text-5xl">⚡</span>
                    </div>
                  )}
                  {post.categories.length > 0 && (
                    <span className="absolute top-4 left-4 bg-slate-950/80 text-white backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-md">
                      {post.categories[0].name}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <span>By {post.author.name}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
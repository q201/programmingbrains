import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Tech News | Programming Brains",
  description: "Stay updated with the latest in tech, development, and AI.",
};

export default async function NewsPage() {
  const newsItems = await db.news.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true, avatar: true } },
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-12 border-b border-slate-200 pb-8">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Stay Updated</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">Daily Tech News</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl">The latest updates, framework releases, AI breakthroughs, and insights from the world of software engineering.</p>
        </div>

        {newsItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No news items yet</h3>
            <p className="text-slate-500">Check back later for the latest tech news!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group block">
                <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1.5 overflow-hidden h-full flex flex-col border border-slate-200">
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
                        <span className="text-white text-5xl">📰</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-60" />
                    {item.categories.length > 0 && (
                      <span className="absolute top-4 left-4 bg-blue-600/90 text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                        {item.categories[0].name}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read Story <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

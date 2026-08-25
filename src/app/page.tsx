import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

export default async function Home() {
  // Fetch featured blogs from database
  const featuredBlogs = await db.blog.findMany({
    where: {
      published: true,
      featured: true
    },
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
    take: 3
  });

  // Fetch latest blogs
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
    take: 6
  });

  // Fetch latest news
  const latestNews = await db.news.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true, avatar: true } },
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Programming Brains",
    url: baseUrl,
    description: "Empowering developers with knowledge and skills for the future. Learn React, TypeScript, Next.js and more with our comprehensive tutorials and blog posts.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-28 md:py-36 bg-grid-pattern">
        {/* Ambient Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-8 text-xs sm:text-sm font-medium text-blue-400 shadow-xl">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              <span>The Premier Platform for Developers & Engineers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-none">
              Master the Craft of <br className="hidden sm:inline" />
              <span className="gradient-text">Modern Software Engineering</span>
            </h1>

            <p className="text-lg sm:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
              In-depth tutorials, system architecture deep-dives, and AI integration guides curated for passionate developers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Link
                href="/blog"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Explore Articles</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/tutorial"
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5"
              >
                Interactive Tutorials
              </Link>
            </div>

            {/* Tech Tags Bar */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-slate-400 font-medium">
              <span className="text-slate-500 uppercase tracking-wider text-xs font-semibold mr-2">Featured Topics:</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">#Next.js 15</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">#TypeScript</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-pink-300">#AI Integration</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300">#Architecture</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">#Prisma</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {featuredBlogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Handpicked Content</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                  Featured Articles
                </h2>
              </div>
              <p className="text-slate-500 text-base max-w-md mt-2 sm:mt-0">
                Top stories and comprehensive architecture guides curated by our editors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogs.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1.5 h-full flex flex-col border border-slate-200/80">
                    {/* Cover Image Container */}
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.imageAlt || post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
                          <span className="text-white text-5xl">⚡</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                      {/* Category Badge on Image */}
                      {post.categories.length > 0 && (
                        <span className="absolute top-4 left-4 bg-blue-600/90 text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                          {post.categories[0].name}
                        </span>
                      )}

                      {post.readTime && (
                        <span className="absolute bottom-4 right-4 bg-slate-950/80 text-slate-300 backdrop-blur-md text-xs font-medium px-2.5 py-1 rounded-md">
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Author & Date Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          {post.author.avatar ? (
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name || 'Author'}
                              width={36}
                              height={36}
                              className="rounded-full ring-2 ring-blue-500/20 object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                              {post.author.name?.charAt(0) || 'A'}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {post.author.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <span className="text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read <span>&rarr;</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Tech News Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
            <div>
              <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Stay Updated</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Daily Tech News
              </h2>
            </div>
            <Link href="/news" className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors mt-4 sm:mt-0 flex items-center gap-1">
              View All News <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group block">
                <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-slate-200">
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                        <span className="text-white text-4xl">📰</span>
                      </div>
                    )}
                    {item.categories.length > 0 && (
                      <span className="absolute top-4 left-4 bg-blue-600/90 text-white backdrop-blur-md text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                        {item.categories[0].name}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-slate-100/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-purple-600 font-bold uppercase tracking-wider text-xs">Fresh Perspectives</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1 mb-4">
              Latest Publications
            </h2>
            <p className="text-slate-600 text-base">
              Stay ahead with code walkthroughs, framework updates, and actionable techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBlogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-slate-200/70">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <span className="text-white text-4xl">📚</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {post.categories.length > 0 && (
                        <span className="inline-block bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-3">
                          {post.categories[0].name}
                        </span>
                      )}

                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500">
                        By {post.author.name}
                      </span>
                      <span className="text-xs text-slate-400">
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

          {/* View All Button */}
          <div className="text-center mt-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>Explore All Articles</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Newsletter / CTA Box */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            📩 Developer Newsletter
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Stay Ahead of the Tech Curve
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get carefully curated engineering insights, Next.js tutorials, and backend architecture breakdowns delivered weekly.
          </p>

          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}


import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";

export async function generateStaticParams() {
  try {
    const blogs = await db.blog.findMany({
      where: { published: true },
      select: { slug: true }
    });

    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.warn('Unable to fetch blog static params during build:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: { slug }
  });

  if (!blog) return { title: 'Blog Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

  return {
    title: blog.seoTitle || `${blog.title} | Programming Brains`,
    description: blog.seoDesc || blog.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDesc || blog.excerpt || '',
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      publishedTime: blog.createdAt.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDesc || blog.excerpt || '',
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: {
      slug,
      published: true
    },
    include: {
      author: {
        select: {
          name: true,
          avatar: true,
          bio: true,
          website: true
        }
      },
      categories: true,
      comments: {
        where: { approved: true },
        include: {
          author: {
            select: {
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!blog) notFound();

  // Increment view count in background (non-blocking)
  db.blog.update({
    where: { id: blog.id },
    data: { viewCount: { increment: 1 } }
  }).catch((err) => console.error("Failed to increment views:", err));

  // Get related blogs
  const relatedBlogs = await db.blog.findMany({
    where: {
      published: true,
      id: { not: blog.id },
      OR: [
        { categories: { some: { id: { in: blog.categories.map(c => c.id) } } } },
        { tags: { hasSome: blog.tags } }
      ]
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
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.seoTitle || blog.title,
    description: blog.seoDesc || blog.excerpt || '',
    image: blog.coverImage ? [blog.coverImage] : [],
    datePublished: blog.createdAt.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: [{
      "@type": "Person",
      name: blog.author.name,
      url: blog.author.website || undefined
    }],
    publisher: {
      "@type": "Organization",
      name: "Programming Brains",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Content */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Article Header Card */}
        <div className="mb-10 bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          {/* Subtle top decoration gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

          {/* Categories */}
          {blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Header Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
            {/* Content Column */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.2] tracking-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed font-normal">
                  {blog.excerpt}
                </p>
              )}
            </div>

            {/* Featured Cover Image */}
            {blog.coverImage && (
              <div className="md:col-span-1">
                <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg border border-slate-200 sticky top-8">
                  <Image
                    src={blog.coverImage}
                    alt={blog.imageAlt || blog.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-6 text-slate-600 text-sm">
            {/* Author */}
            <div className="flex items-center gap-3">
              {blog.author.avatar ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name || 'Author'}
                  width={44}
                  height={44}
                  className="rounded-full ring-2 ring-blue-500/20 object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {blog.author.name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-base">{blog.author.name}</p>
                <p className="text-xs text-slate-400">Author & Tech Writer</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm">
              {/* Date */}
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-slate-700">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Read Time */}
              {blog.readTime && (
                <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-slate-700">{blog.readTime}</span>
                </div>
              )}

              {/* Views */}
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium text-slate-700">{blog.viewCount + 1} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-14 mb-10 border border-slate-200/80">
          <div
            className="max-w-none text-slate-700
            [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h1]:mt-10 [&_h1]:mb-6
            [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:text-slate-900
            [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-blue-700 [&_h3]:mt-8 [&_h3]:mb-4
            [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-slate-800 [&_h4]:mt-6 [&_h4]:mb-3
            [&_p]:text-slate-700 [&_p]:leading-8 [&_p]:my-5 [&_p]:text-base [&_p]:md:text-lg
            [&_a]:text-blue-600 [&_a]:font-semibold [&_a]:no-underline hover:[&_a]:text-blue-800 hover:[&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors
            [&_strong]:text-slate-950 [&_strong]:font-semibold
            [&_em]:italic [&_em]:text-slate-700
            [&_ul]:my-6 [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:list-disc
            [&_ol]:my-6 [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:list-decimal
            [&_li]:text-slate-700 [&_li]:leading-8 [&_li::marker]:text-blue-600
            [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:bg-blue-50/60 [&_blockquote]:p-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:text-slate-800 [&_blockquote]:font-medium
            [&_code]:font-mono [&_code]:bg-slate-100 [&_code]:text-rose-600 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm
            [&_pre]:my-8 [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:shadow-md
            [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
            [&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-200 [&_img]:shadow-md
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-8
            [&_th]:bg-slate-100 [&_th]:text-left [&_th]:font-bold [&_th]:text-slate-900 [&_th]:px-4 [&_th]:py-3
            [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700 [&_td]:px-4 [&_td]:py-3
            [&_hr]:my-10 [&_hr]:border-slate-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags Section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-blue-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Author Bio Box */}
        {blog.author && (
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-3xl p-8 md:p-10 mb-10 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
              {blog.author.avatar ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name || 'Author'}
                  width={80}
                  height={80}
                  className="rounded-2xl ring-4 ring-white/10 object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl ring-4 ring-white/10 shrink-0">
                  {blog.author.name?.charAt(0) || 'A'}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">Written by {blog.author.name}</h3>
                  <span className="bg-blue-500/30 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-400/30">Verified Author</span>
                </div>
                {blog.author.bio ? (
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{blog.author.bio}</p>
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Software engineer and technical writer passionate about modern web technologies, AI, and scalable system design.
                  </p>
                )}
                {blog.author.website && (
                  <a
                    href={blog.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white font-medium text-xs bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <span>Visit Official Website</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comment Section Component */}
        <CommentSection blogId={blog.id} comments={blog.comments || []} />

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900">You Might Also Like</h3>
              <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                View All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-slate-200/80">
                    <div className="relative h-44 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.imageAlt || post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-4xl">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {post.categories.length > 0 && (
                          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 border border-blue-100">
                            {post.categories[0].name}
                          </span>
                        )}
                        <h4 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        {post.author.avatar && (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name || 'Author'}
                            width={20}
                            height={20}
                            className="rounded-full shrink-0"
                          />
                        )}
                        <span className="truncate font-medium">{post.author.name}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
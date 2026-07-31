import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  const blogs = await db.blog.findMany({
    where: { published: true },
    select: { slug: true }
  });

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await db.blog.findUnique({
    where: { slug }
  });

  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.seoTitle || `${blog.title} | Programming Brains`,
    description: blog.seoDesc || blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || '',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Article Content */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Article Header */}
        <div className="mb-12 bg-white rounded-xl p-8 md:p-12 border border-gray-100">
          {/* Categories */}
          {blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Header with Featured Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
            {/* Content Column */}
            <div className="md:col-span-2">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}
            </div>

            {/* Featured Image */}
            {blog.coverImage && (
              <div className="md:col-span-1">
                <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg border border-gray-200 sticky top-8">
                  <Image
                    src={blog.coverImage}
                    alt={blog.imageAlt || blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 border-t border-b border-gray-200 py-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              {blog.author.avatar && (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name || 'Author'}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{blog.author.name}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Read Time */}
            {blog.readTime && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">{blog.readTime}</span>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">{blog.viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div
            className="max-w-none text-slate-700
            [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h1]:mt-8 [&_h1]:mb-6
            [&_h2]:text-3xl [&_h2]:md:text-[2rem] [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:bg-gradient-to-r [&_h2]:from-blue-900 [&_h2]:to-indigo-700 [&_h2]:bg-clip-text [&_h2]:text-transparent
            [&_h3]:text-2xl [&_h3]:md:text-[1.65rem] [&_h3]:font-semibold [&_h3]:text-blue-700 [&_h3]:mt-10 [&_h3]:mb-4
            [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-slate-800 [&_h4]:mt-8 [&_h4]:mb-3
            [&_p]:text-slate-700 [&_p]:leading-8 [&_p]:my-5
            [&_a]:text-blue-700 [&_a]:font-semibold [&_a]:no-underline hover:[&_a]:text-blue-800 hover:[&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors
            [&_strong]:text-gray-950 [&_strong]:font-semibold
            [&_em]:italic [&_em]:text-slate-700
            [&_ul]:my-7 [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:list-disc
            [&_ol]:my-7 [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:list-decimal
            [&_li]:text-slate-700 [&_li]:leading-8 [&_li::marker]:text-blue-600
            [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-600 [&_blockquote]:bg-blue-50/60 [&_blockquote]:py-2 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:text-slate-700
            [&_code]:font-mono [&_code]:bg-slate-100 [&_code]:text-rose-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-[0.9em]
            [&_pre]:my-8 [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:text-slate-100 [&_pre]:shadow-md
            [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:p-0
            [&_img]:my-8 [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-200 [&_img]:shadow-lg
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-8
            [&_th]:bg-slate-100 [&_th]:text-left [&_th]:font-semibold [&_th]:text-slate-900 [&_th]:px-4 [&_th]:py-3
            [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700 [&_td]:px-4 [&_td]:py-3
            [&_hr]:my-10 [&_hr]:border-slate-300"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Author Bio */}
        {blog.author.bio && (
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 mb-8 border border-gray-100 border-l-4 border-l-blue-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Author</h3>
            <div className="flex items-start gap-4">
              {blog.author.avatar && (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name || 'Author'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {blog.author.name}
                </h4>
                <p className="text-gray-700 mb-3">{blog.author.bio}</p>
                {blog.author.website && (
                  <a
                    href={blog.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <div className="border-b-2 border-blue-600 pb-4 mb-8">
              <h3 className="text-3xl font-bold text-gray-900">Related Articles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-gray-100">
                    <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.imageAlt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-5xl">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {post.categories.length > 0 && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-2 w-fit">
                          {post.categories[0].name}
                        </span>
                      )}
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                        {post.author.avatar && (
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name || 'Author'}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span>{post.author.name}</span>
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
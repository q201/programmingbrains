import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import Footer from "@/components/Footer";

export const metadata = {
    title: 'Blog & Articles | Programming Brains',
    description: 'Explore tutorials, articles, and insights on web development, AI, and software architecture',
};

export default async function BlogPage() {
    // Fetch all published blogs
    const blogs = await db.blog.findMany({
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
        orderBy: { createdAt: 'desc' }
    });

    // Get all categories with blog count
    const categories = await db.category.findMany({
        include: {
            _count: {
                select: {
                    blogs: {
                        where: { published: true }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <section className="relative overflow-hidden bg-slate-950 text-white py-20 bg-grid-pattern">
                <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
                        📚 Technical Library
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
                        Blog & Engineering Guides
                    </h1>
                    <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Deep dive into web frameworks, system design, database optimization, and AI integrations.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sticky top-24 space-y-8">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                                    Categories
                                </h2>
                                <ul className="space-y-1.5">
                                    <li>
                                        <Link
                                            href="/blog"
                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold text-sm transition-colors"
                                        >
                                            <span>All Posts</span>
                                            <span className="bg-blue-200/60 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-md">
                                                {blogs.length}
                                            </span>
                                        </Link>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-100/80 text-slate-700 font-medium text-sm transition-colors"
                                            >
                                                <span>{category.name}</span>
                                                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-md">
                                                    {category._count.blogs}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Popular Tags */}
                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Popular Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'TypeScript', 'Next.js', 'AI', 'Web3', 'Architecture'].map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog?tag=${tag}`}
                                            className="bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition-colors border border-slate-200/60"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
                            <h2 className="text-xl font-bold text-slate-900">
                                Published Articles ({blogs.length})
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">Sorted by latest</span>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                                <div className="text-5xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No publications yet</h3>
                                <p className="text-slate-500">Stay tuned, new technical guides are on the way!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {blogs.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="block group"
                                    >
                                        <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200/80 transform group-hover:-translate-y-1">
                                            <div className="md:flex">
                                                {/* Image */}
                                                <div className="md:w-2/5 relative h-56 md:h-auto bg-slate-900">
                                                    {post.coverImage ? (
                                                        <Image
                                                            src={post.coverImage}
                                                            alt={post.imageAlt || post.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                            sizes="(max-width: 768px) 100vw, 40vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
                                                            <span className="text-white text-5xl">📄</span>
                                                        </div>
                                                    )}
                                                    {post.categories.length > 0 && (
                                                        <span className="absolute top-4 left-4 bg-slate-950/80 text-white backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-md">
                                                            {post.categories[0].name}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="md:w-3/5 p-7 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                                                            <span>
                                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            {post.readTime && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{post.readTime}</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                                                            {post.title}
                                                        </h3>

                                                        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            {post.author.avatar ? (
                                                                <Image
                                                                    src={post.author.avatar}
                                                                    alt={post.author.name || 'Author'}
                                                                    width={32}
                                                                    height={32}
                                                                    className="rounded-full ring-2 ring-slate-100"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                                                    {post.author.name?.charAt(0) || 'A'}
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-semibold text-slate-800">
                                                                {post.author.name}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>{post.viewCount} views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
}


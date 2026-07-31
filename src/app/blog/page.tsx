import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import Footer from "@/components/Footer";

export const metadata = {
    title: 'Blog | Programming Brains',
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">Blog & Tutorials</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Dive deep into web development, AI, and software architecture with our comprehensive guides
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/blog"
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 font-medium"
                                    >
                                        <span>All Posts</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                            {blogs.length}
                                        </span>
                                    </Link>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                                        >
                                            <span>{category.name}</span>
                                            <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                {category._count.blogs}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Popular Tags */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'TypeScript', 'Next.js', 'AI', 'Web3', 'Performance'].map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/blog?tag=${tag}`}
                                            className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
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
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                All Posts ({blogs.length})
                            </h2>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-600">Check back soon for new content!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {blogs.map((post) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="block group"
                                    >
                                        <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                            <div className="md:flex">
                                                {/* Image */}
                                                <div className="md:w-1/3 relative h-48 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600">
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
                                                            <span className="text-white text-6xl">📄</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="md:w-2/3 p-6">
                                                    {/* Category & Date */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {post.categories.length > 0 && (
                                                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                                {post.categories[0].name}
                                                            </span>
                                                        )}
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                        {post.title}
                                                    </h3>

                                                    {/* Excerpt */}
                                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {post.author.avatar && (
                                                                <Image
                                                                    src={post.author.avatar}
                                                                    alt={post.author.name || 'Author'}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-full"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {post.author.name}
                                                                </p>
                                                                {post.readTime && (
                                                                    <p className="text-xs text-gray-500">
                                                                        {post.readTime}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span className="text-sm">{post.viewCount}</span>
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

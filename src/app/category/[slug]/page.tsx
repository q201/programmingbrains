import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
    try {
        const categories = await db.category.findMany();

        return categories.map((category) => ({
            slug: category.name.toLowerCase().replace(/\s+/g, '-'),
        }));
    } catch (error) {
        console.warn('Unable to fetch category static params during build:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categoryName = slug.replace(/-/g, ' ');

    return {
        title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} | Programming Brains`,
        description: `Browse all ${categoryName} tutorials and articles`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // Convert slug back to category name
    const categoryName = slug.replace(/-/g, ' ');

    // Find category (case-insensitive)
    const category = await db.category.findFirst({
        where: {
            name: {
                equals: categoryName,
                mode: 'insensitive'
            }
        },
        include: {
            blogs: {
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
            }
        }
    });

    if (!category) notFound();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
                        <p className="text-xl text-blue-100">
                            {category.blogs.length} {category.blogs.length === 1 ? 'article' : 'articles'} in this category
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {category.blogs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📂</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No posts in this category yet</h3>
                        <p className="text-gray-600 mb-6">Check back soon for new content!</p>
                        <Link
                            href="/blog"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Browse All Posts
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {category.blogs.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group"
                            >
                                <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.imageAlt || post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-white text-6xl">📝</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                            {post.excerpt}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                {post.author.avatar && (
                                                    <Image
                                                        src={post.author.avatar}
                                                        alt={post.author.name || 'Author'}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {post.author.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {post.readTime && (
                                                <span className="text-sm text-gray-500">
                                                    {post.readTime}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Back to Blog */}
                <div className="mt-12 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Posts
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}

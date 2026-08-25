import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const newsItem = await db.news.findFirst({
    where: {
      OR: [{ slug }, { slug: decodedSlug }]
    }
  });
  if (!newsItem) return { title: 'News Not Found' };
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';
  
  return {
    title: newsItem.seoTitle || `${newsItem.title} | Programming Brains News`,
    description: newsItem.seoDesc || newsItem.excerpt,
    alternates: { canonical: `${baseUrl}/news/${newsItem.slug}` },
    openGraph: {
      title: newsItem.seoTitle || newsItem.title,
      description: newsItem.seoDesc || newsItem.excerpt || '',
      url: `${baseUrl}/news/${newsItem.slug}`,
      type: "article",
      publishedTime: newsItem.createdAt.toISOString(),
      modifiedTime: newsItem.updatedAt.toISOString(),
      images: newsItem.coverImage ? [{ url: newsItem.coverImage }] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const newsItem = await db.news.findFirst({
    where: {
      published: true,
      OR: [{ slug }, { slug: decodedSlug }]
    },
    include: {
      author: { select: { name: true, avatar: true, bio: true } },
      categories: true,
    }
  });

  if (!newsItem) notFound();

  // Increment view count
  db.news.update({ where: { id: newsItem.id }, data: { viewCount: { increment: 1 } } }).catch(console.error);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: newsItem.seoTitle || newsItem.title,
    image: newsItem.coverImage ? [newsItem.coverImage] : [],
    datePublished: newsItem.createdAt.toISOString(),
    dateModified: newsItem.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: newsItem.author.name }]
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <div className="mb-10 text-center">
          {newsItem.categories.length > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              {newsItem.categories.map(c => (
                <span key={c.id} className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{c.name}</span>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
            {newsItem.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-500 text-sm">
            <span className="font-medium text-slate-800">By {newsItem.author.name}</span>
            <span>•</span>
            <span>{new Date(newsItem.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {newsItem.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl mb-12 border border-slate-200">
            <Image src={newsItem.coverImage} alt={newsItem.imageAlt || newsItem.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-slate-200 mb-10 text-slate-800 text-lg leading-relaxed
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
          [&_p]:mb-6
          [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: newsItem.content }}
        />

        {newsItem.sourceUrl && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center mb-10">
            <p className="text-slate-700 mb-3">Read the full original story at the source:</p>
            <a href={newsItem.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
              Visit Original Source
            </a>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}

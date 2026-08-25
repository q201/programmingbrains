import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { db } from '@/lib/db';
import { withAuth, AuthenticatedUser } from '@/lib/auth';

const parser = new Parser({
  customFields: {
    item: [
      'content:encoded',
      'content',
      'description',
      'media:content',
      'enclosure',
    ],
  },
});

function decodeEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function cleanTitle(rawTitle: string): string {
  let title = decodeEntities(rawTitle || '').trim();
  // Strip trailing " - Publisher Name" commonly found in Google News titles
  if (title.includes(' - ')) {
    const parts = title.split(' - ');
    if (parts.length > 1 && parts[parts.length - 1].trim().split(/\s+/).length <= 4) {
      parts.pop();
      title = parts.join(' - ').trim();
    }
  }
  return title;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function stripTags(html: string): string {
  if (!html) return '';
  return decodeEntities(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function extractCoverImage(item: Record<string, unknown>, rawHtml: string): string | null {
  const enclosure = item.enclosure as { url?: string } | undefined;
  const mediaContent = item['media:content'] as { $?: { url?: string } } | undefined;

  if (enclosure?.url) return enclosure.url;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  if (rawHtml) {
    const imgMatch = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1] && !imgMatch[1].includes('favicon') && !imgMatch[1].includes('pixel')) {
      return imgMatch[1];
    }
  }
  return null;
}

function formatNewsContent(rawContent: string, title: string, excerpt: string): string {
  if (!rawContent) {
    return `<p class="mb-6 leading-relaxed">${excerpt || title}</p>`;
  }

  let content = rawContent.trim();

  // If content contains encoded HTML like &lt;p&gt;, decode it
  if (content.includes('&lt;') && content.includes('&gt;')) {
    content = decodeEntities(content);
  }

  // Strip Google News inline font tags
  content = content.replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '');

  // If plain text without HTML block tags, format into paragraphs
  if (!content.includes('<p>') && !content.includes('<div>') && !content.includes('<article>')) {
    const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
    if (paragraphs.length > 0) {
      return paragraphs.map(p => `<p class="mb-6 leading-relaxed">${p.trim()}</p>`).join('');
    }
    return `<p class="mb-6 leading-relaxed">${content}</p>`;
  }

  return content;
}

async function postHandler(req: NextRequest, user: AuthenticatedUser) {
  try {
    const { sourceId } = await req.json().catch(() => ({ sourceId: undefined }));

    // Find sources to fetch
    const sources = sourceId
      ? await db.newsSource.findMany({ where: { id: sourceId } })
      : await db.newsSource.findMany({ where: { enabled: true } });

    if (sources.length === 0) {
      return NextResponse.json({ error: 'No active news sources found' }, { status: 404 });
    }

    let totalImported = 0;
    const adminUser = await db.user.findFirst({
      where: { OR: [{ role: 'ADMIN' }, { role: 'admin' }] },
    });

    const authorId = adminUser?.id || user.id;

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);

        // Find or create Category in DB matching source.category
        let categoryRecord = null;
        if (source.category) {
          categoryRecord = await db.category.findFirst({
            where: { name: { equals: source.category, mode: 'insensitive' } },
          });

          if (!categoryRecord) {
            categoryRecord = await db.category.create({
              data: {
                name: source.category,
              },
            }).catch(() => null);
          }
        }

        for (const item of feed.items || []) {
          if (!item.title) continue;

          const formattedTitle = cleanTitle(item.title);
          const baseSlug = slugify(formattedTitle);
          if (!baseSlug) continue;

          const sourceUrl = item.link || undefined;

          // Check if article with this slug or sourceUrl already exists
          const existing = await db.news.findFirst({
            where: {
              OR: [
                { slug: baseSlug },
                ...(sourceUrl ? [{ sourceUrl }] : []),
              ],
            },
          });

          if (!existing) {
            const itemRecord = item as unknown as Record<string, unknown>;
            const rawContent = (itemRecord['content:encoded'] || itemRecord.content || itemRecord.description || itemRecord.snippet || item.title) as string;
            const cleanExcerptText = stripTags(item.contentSnippet || (itemRecord.description as string) || item.title);
            const coverImage = extractCoverImage(itemRecord, rawContent);
            const formattedContent = formatNewsContent(rawContent, formattedTitle, cleanExcerptText);

            await db.news.create({
              data: {
                title: formattedTitle,
                slug: baseSlug,
                excerpt: cleanExcerptText.length > 250 ? cleanExcerptText.slice(0, 247) + '...' : cleanExcerptText,
                content: formattedContent,
                coverImage: coverImage,
                sourceUrl: sourceUrl,
                published: true,
                authorId: authorId,
                categories: categoryRecord ? { connect: [{ id: categoryRecord.id }] } : undefined,
              },
            });

            totalImported++;
          }
        }

        // Update lastFetchedAt timestamp
        await db.newsSource.update({
          where: { id: source.id },
          data: { lastFetchedAt: new Date() },
        });

      } catch (err) {
        console.error(`Failed to fetch RSS feed from ${source.name} (${source.url}):`, err);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: totalImported,
      message: `Successfully imported ${totalImported} new formatted news stories!`,
    });
  } catch (error) {
    console.error('Error running RSS import:', error);
    return NextResponse.json({ error: 'Failed to run RSS news import' }, { status: 500 });
  }
}

export const POST = withAuth(postHandler, ['admin']);

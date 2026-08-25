import { PrismaClient } from '@prisma/client';
import { FREE_TECH_NEWS_FEEDS } from '../src/lib/rssFeeds';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding news sources into database...');
  
  for (const feed of FREE_TECH_NEWS_FEEDS) {
    await prisma.newsSource.upsert({
      where: { id: feed.id },
      update: {
        name: feed.name,
        category: feed.category,
        url: feed.url,
        type: feed.type,
        description: feed.description,
      },
      create: {
        id: feed.id,
        name: feed.name,
        category: feed.category,
        url: feed.url,
        type: feed.type,
        enabled: true,
        description: feed.description,
      },
    });
  }

  console.log('News sources seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

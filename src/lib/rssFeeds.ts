export interface NewsFeedSource {
  id: string;
  name: string;
  category: string;
  url: string;
  type: 'rss' | 'json';
  description: string;
}

export const FREE_TECH_NEWS_FEEDS: NewsFeedSource[] = [
  // --- Google News Custom RSS Feeds ---
  {
    id: 'google-tech-general',
    name: 'Google News - General Tech',
    category: 'Technology',
    url: 'https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    description: 'Top global technology headlines compiled by Google News'
  },
  {
    id: 'google-software-engineering',
    name: 'Google News - Software Engineering',
    category: 'Software Engineering',
    url: 'https://news.google.com/rss/search?q=software+engineering+programming&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    description: 'Latest programming languages, software engineering, and developer news'
  },
  {
    id: 'google-ai',
    name: 'Google News - Artificial Intelligence',
    category: 'AI',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+LLM+OpenAI+Anthropic&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    description: 'AI breakthroughs, LLMs, machine learning, and neural network news'
  },
  {
    id: 'google-web-dev',
    name: 'Google News - Web Development',
    category: 'Web Development',
    url: 'https://news.google.com/rss/search?q=React+Next.js+TypeScript+JavaScript+Tailwind&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    description: 'Frontend and backend web development updates'
  },
  {
    id: 'google-cloud-devops',
    name: 'Google News - Cloud & DevOps',
    category: 'DevOps',
    url: 'https://news.google.com/rss/search?q=Kubernetes+Docker+AWS+Cloud+DevOps&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    description: 'Cloud computing, infrastructure, Docker, and Kubernetes news'
  },

  // --- Major Tech Media RSS Feeds ---
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    category: 'Technology',
    url: 'https://techcrunch.com/feed/',
    type: 'rss',
    description: 'Startup news, tech innovations, and product launches'
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    category: 'Technology',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    type: 'rss',
    description: 'In-depth technical analysis, IT news, and science'
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    category: 'Technology',
    url: 'https://www.theverge.com/rss/index.xml',
    type: 'rss',
    description: 'Technology, gadgets, and science news'
  },

  // --- Developer Community RSS Feeds ---
  {
    id: 'hacker-news-frontpage',
    name: 'Hacker News (HNRSS)',
    category: 'Developer News',
    url: 'https://hnrss.org/frontpage',
    type: 'rss',
    description: 'Trending software links, tools, and discussions from Hacker News'
  },
  {
    id: 'dev-to-news',
    name: 'Dev.to Tech News',
    category: 'Web Development',
    url: 'https://dev.to/feed/tag/news',
    type: 'rss',
    description: 'Community articles and software release news on Dev.to'
  },
  {
    id: 'lobsters',
    name: 'Lobste.rs Tech Feeds',
    category: 'Software Architecture',
    url: 'https://lobste.rs/rss',
    type: 'rss',
    description: 'Computing-focused link aggregation and architecture discussions'
  }
];

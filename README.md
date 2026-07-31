# Programming Brains - Tutorial & Technical Blog Platform

A modern, WordPress-like CMS built with Next.js 15, Prisma, and PostgreSQL. Features a clean service layer architecture, database-driven content, and beautiful responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file with:
   DATABASE_URL="postgresql://user:password@localhost:5432/pbrains"
   JWT_SECRET="your-secret-key"
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Seed the database** (optional)
   ```bash
   npx tsx prisma/migrate-static-blogs.ts
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   Frontend: http://localhost:5000
   Admin Panel: http://localhost:5000/admin/login
   ```

## 🔐 Default Admin Credentials

```
Email: admin@programmingbrains.com
Password: admin123
⚠️ Please change after first login!
```

## 📁 Project Structure

```
programmingbrains/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── migrate-static-blogs.ts # Data migration script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── blog/              # Blog pages
│   │   ├── admin/             # Admin dashboard
│   │   └── category/          # Category pages
│   ├── components/            # React components
│   ├── services/              # Service layer (NEW!)
│   │   ├── BlogService.ts
│   │   ├── CategoryService.ts
│   │   └── UserService.ts
│   └── lib/                   # Utilities
│       ├── db.ts              # Prisma client
│       └── auth.ts            # Authentication
└── public/                    # Static assets
```

## ✨ Features

### Content Management
- ✅ Create, edit, and delete blog posts
- ✅ Rich HTML content support
- ✅ Category and tag management
- ✅ Featured posts
- ✅ Draft/Publish status
- ✅ SEO optimization fields

### Frontend
- ✅ Modern, responsive design
- ✅ Homepage with featured posts
- ✅ Blog listing with sidebar
- ✅ Individual blog post pages
- ✅ Category filtering
- ✅ View count tracking
- ✅ Related posts
- ✅ Author profiles

### Developer Features
- ✅ Service layer architecture
- ✅ Type-safe with TypeScript
- ✅ RESTful API routes
- ✅ Easy to extend
- ✅ API-ready design

## 🌐 API Endpoints

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blogs` | GET | List all published blogs |
| `/api/blogs/[slug]` | GET | Get single blog by slug |
| `/api/categories` | GET | List all categories |

**Query Parameters**:
- `?page=1&limit=10` - Pagination
- `?category=React` - Filter by category
- `?tag=TypeScript` - Filter by tag
- `?search=query` - Search blogs
- `?featured=true` - Get featured blogs

### Admin API (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/blogs` | GET | List all blogs |
| `/api/admin/blogs` | POST | Create new blog |
| `/api/admin/blogs/[id]` | GET/PUT/DELETE | Manage blog |

## 🎨 Service Layer Usage

The service layer provides a clean abstraction for data access:

```typescript
import { BlogService } from '@/services/BlogService';

// Get featured blogs
const featured = await BlogService.getFeaturedBlogs(3);

// Get all blogs with pagination
const result = await BlogService.getAllBlogs(
  { category: 'React' },
  { page: 1, limit: 10 }
);

// Search blogs
const results = await BlogService.searchBlogs('next.js');

// Get single blog
const blog = await BlogService.getBlogBySlug('my-post');
```

## 🔧 Development

### Database Commands

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Build for Production

```bash
npm run build
npm run start
```

## 📚 Tech Stack

- **Framework**: Next.js 15.5.3
- **Language**: TypeScript 5
- **Database**: PostgreSQL
- **ORM**: Prisma 6.16.2
- **Styling**: Tailwind CSS 4
- **Authentication**: JWT + bcryptjs
- **Runtime**: Node.js 18+

## 🎯 Future Enhancements

- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload to cloud storage
- [ ] Search UI with autocomplete
- [ ] Comments system with moderation
- [ ] Analytics dashboard
- [ ] Multi-author support
- [ ] Blog revisions
- [ ] Scheduled publishing
- [ ] Social media sharing

## 📖 Documentation

For detailed documentation, see:
- [Architecture Analysis](./brain/architecture_analysis.md)
- [Implementation Plan](./brain/implementation_plan.md)
- [Walkthrough](./brain/walkthrough.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database management with [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Coding! 🚀**

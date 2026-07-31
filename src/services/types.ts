// Shared TypeScript types for the application

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    author: {
        id: string;
        name: string | null;
        avatar: string | null;
        bio: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
    categories: Category[];
    tags: string[];
    coverImage: string | null;
    imageAlt: string | null;
    readTime: string | null;
    published: boolean;
    featured: boolean;
    viewCount: number;
    seoTitle: string | null;
    seoDesc: string | null;
}

export interface Category {
    id: string;
    name: string;
    _count?: {
        blogs: number;
    };
}

export interface Author {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    bio: string | null;
    website: string | null;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface BlogFilters {
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    authorId?: string;
}

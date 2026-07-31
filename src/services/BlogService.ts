/**
 * BlogService - WordPress-like service layer for blog operations
 * 
 * This service provides a clean abstraction for blog data access.
 * It can easily be switched from database to external API in the future.
 */

import type { BlogPost, BlogFilters, PaginationParams, PaginationResult } from './types';

export class BlogService {
    private static baseUrl = '/api/blogs';

    /**
     * Get all published blogs with optional filtering and pagination
     * Similar to WordPress get_posts()
     */
    static async getAllBlogs(
        filters?: BlogFilters,
        pagination?: PaginationParams
    ): Promise<PaginationResult<BlogPost>> {
        const params = new URLSearchParams();

        if (pagination?.limit) params.set('limit', pagination.limit.toString());
        if (pagination?.page) params.set('page', pagination.page.toString());
        if (filters?.category) params.set('category', filters.category);
        if (filters?.tag) params.set('tag', filters.tag);
        if (filters?.search) params.set('search', filters.search);
        if (filters?.featured !== undefined) params.set('featured', filters.featured.toString());
        if (filters?.authorId) params.set('authorId', filters.authorId);

        const response = await fetch(`${this.baseUrl}?${params}`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        return {
            data: data.blogs,
            pagination: data.pagination
        };
    }

    /**
     * Get featured blogs for homepage
     * Similar to WordPress sticky posts
     */
    static async getFeaturedBlogs(limit: number = 3): Promise<BlogPost[]> {
        const result = await this.getAllBlogs(
            { featured: true },
            { limit, page: 1 }
        );
        return result.data;
    }

    /**
     * Get single blog by slug
     * Similar to WordPress get_post()
     */
    static async getBlogBySlug(slug: string): Promise<BlogPost | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${slug}`, {
                next: { revalidate: 60 }
            });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch blog');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching blog:', error);
            return null;
        }
    }

    /**
     * Search blogs by query
     * Similar to WordPress search
     */
    static async searchBlogs(query: string, limit: number = 10): Promise<BlogPost[]> {
        if (!query.trim()) return [];

        const result = await this.getAllBlogs(
            { search: query },
            { limit, page: 1 }
        );
        return result.data;
    }

    /**
     * Get blogs by category
     * Similar to WordPress get_posts with category filter
     */
    static async getBlogsByCategory(
        category: string,
        pagination?: PaginationParams
    ): Promise<PaginationResult<BlogPost>> {
        return this.getAllBlogs({ category }, pagination);
    }

    /**
     * Get blogs by tag
     */
    static async getBlogsByTag(
        tag: string,
        pagination?: PaginationParams
    ): Promise<PaginationResult<BlogPost>> {
        return this.getAllBlogs({ tag }, pagination);
    }

    /**
     * Get blogs by author
     */
    static async getBlogsByAuthor(
        authorId: string,
        pagination?: PaginationParams
    ): Promise<PaginationResult<BlogPost>> {
        return this.getAllBlogs({ authorId }, pagination);
    }

    /**
     * Get latest blogs
     */
    static async getLatestBlogs(limit: number = 10): Promise<BlogPost[]> {
        const result = await this.getAllBlogs({}, { limit, page: 1 });
        return result.data;
    }

    /**
     * Get related blogs based on tags and category
     */
    static async getRelatedBlogs(
        currentBlogId: string,
        tags: string[],
        limit: number = 3
    ): Promise<BlogPost[]> {
        // This would need a custom API endpoint for optimal performance
        // For now, we'll fetch by first tag
        if (tags.length === 0) {
            return this.getLatestBlogs(limit);
        }

        const result = await this.getAllBlogs(
            { tag: tags[0] },
            { limit: limit + 1, page: 1 }
        );

        // Filter out current blog
        return result.data.filter(blog => blog.id !== currentBlogId).slice(0, limit);
    }
}

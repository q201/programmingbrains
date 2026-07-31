/**
 * CategoryService - Service layer for category operations
 */

import type { Category } from './types';

export class CategoryService {
    private static baseUrl = '/api/categories';

    /**
     * Get all categories with blog count
     */
    static async getAllCategories(): Promise<Category[]> {
        try {
            const response = await fetch(this.baseUrl, {
                next: { revalidate: 300 } // Cache for 5 minutes
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    /**
     * Get category by name
     */
    static async getCategoryByName(name: string): Promise<Category | null> {
        const categories = await this.getAllCategories();
        return categories.find(cat =>
            cat.name.toLowerCase() === name.toLowerCase()
        ) || null;
    }

    /**
     * Get popular categories (with most blogs)
     */
    static async getPopularCategories(limit: number = 5): Promise<Category[]> {
        const categories = await this.getAllCategories();
        return categories
            .sort((a, b) => (b._count?.blogs || 0) - (a._count?.blogs || 0))
            .slice(0, limit);
    }
}

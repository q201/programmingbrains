/**
 * UserService - Service layer for user operations
 */

import type { Author } from './types';

export class UserService {
    private static baseUrl = '/api/users';

    /**
     * Get user/author by ID
     */
    static async getUserById(id: string): Promise<Author | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                next: { revalidate: 300 }
            });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    /**
     * Get all authors (users who have written blogs)
     */
    static async getAllAuthors(): Promise<Author[]> {
        try {
            const response = await fetch(`${this.baseUrl}?role=author`, {
                next: { revalidate: 300 }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch authors');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching authors:', error);
            return [];
        }
    }
}

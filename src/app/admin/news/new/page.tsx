'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewNewsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    sourceUrl: '',
    coverImage: '',
    published: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      if (name === 'title' && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const generateSlug = () => {
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const cleanSlug = (formData.slug || formData.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const finalData = { ...formData, slug: cleanSlug };

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      
      if (res.ok) {
        router.push('/admin/news');
      } else {
        alert('Failed to create news item');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Daily News</h1>
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700 font-medium">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" />
          <button type="button" onClick={generateSlug} className="text-sm text-blue-600 mt-1">Generate Slug</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
          <textarea required name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full font-mono text-sm border border-gray-300 rounded-lg p-2.5" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Source URL (Optional)</label>
          <input type="url" name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-2.5" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" />
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            {isSubmitting ? 'Saving...' : 'Save News'}
          </button>
        </div>
      </form>
    </div>
  );
}

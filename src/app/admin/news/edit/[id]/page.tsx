'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { use } from 'react';

export default function EditNewsForm(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    sourceUrl: '',
    coverImage: '',
    published: false
  });

  useEffect(() => {
    fetchNewsItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchNewsItem = async () => {
    try {
      const res = await fetch(`/api/admin/news/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          sourceUrl: data.sourceUrl || '',
          coverImage: data.coverImage || '',
          published: data.published || false
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/admin/news/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        router.push('/admin/news');
      } else {
        alert('Failed to update news item');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit News</h1>
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700 font-medium">Cancel</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" />
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
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">Published</label>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            {isSubmitting ? 'Saving...' : 'Update News'}
          </button>
        </div>
      </form>
    </div>
  );
}

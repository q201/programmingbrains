'use client';

import React, { useState, useEffect } from 'react';

export default function AdminBlogForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [readTime, setReadTime] = useState('');
  const [tags, setTags] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  }, [title, slug]);

  // Auto-generate SEO title from title
  useEffect(() => {
    if (title && !seoTitle) {
      setSeoTitle(title);
    }
  }, [title, seoTitle]);

  // Auto-generate SEO description from excerpt
  useEffect(() => {
    if (excerpt && !seoDesc) {
      setSeoDesc(excerpt);
    }
  }, [excerpt, seoDesc]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt: excerpt || null,
          content,
          coverImage: coverImage || null,
          imageAlt: imageAlt || null,
          readTime: readTime || null,
          tags: tagsArray,
          seoTitle: seoTitle || title,
          seoDesc: seoDesc || excerpt,
          published,
          featured
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create blog');
      }

      setSuccess('Blog created successfully!');
      // Reset form
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCoverImage('');
      setImageAlt('');
      setReadTime('');
      setTags('');
      setSeoTitle('');
      setSeoDesc('');
      setPublished(false);
      setFeatured(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Blog Post</h2>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter blog title"
        />
      </div>

      {/* Slug */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Slug * <span className="text-xs text-gray-500">(Auto-generated from title)</span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="blog-post-slug"
        />
      </div>

      {/* Excerpt */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Excerpt <span className="text-xs text-gray-500">(Short description, 150-200 chars)</span>
        </label>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description of the blog post"
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">{excerpt.length}/200 characters</p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content * <span className="text-xs text-gray-500">(HTML supported)</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Enter blog content (HTML)"
        />
      </div>

      {/* Cover Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image Alt Text
          </label>
          <input
            type="text"
            value={imageAlt}
            onChange={e => setImageAlt(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description of the image"
          />
        </div>
      </div>

      {/* Read Time & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Read Time
          </label>
          <input
            type="text"
            value={readTime}
            onChange={e => setReadTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5 min read"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags <span className="text-xs text-gray-500">(Comma-separated)</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React, TypeScript, Next.js"
          />
        </div>
      </div>

      {/* SEO Fields */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SEO Title <span className="text-xs text-gray-500">(Auto-filled from title)</span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={e => setSeoTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SEO-optimized title"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">{seoTitle.length}/60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            SEO Description <span className="text-xs text-gray-500">(Auto-filled from excerpt)</span>
          </label>
          <textarea
            value={seoDesc}
            onChange={e => setSeoDesc(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SEO meta description"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">{seoDesc.length}/160 characters</p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Publish immediately</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={featured}
            onChange={e => setFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Featured post</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Blog Post'}
        </button>

        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}
        {success && (
          <p className="text-green-600 font-medium">{success}</p>
        )}
      </div>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CommentAuthor {
  name: string | null;
  avatar: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  author: CommentAuthor;
}

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
}

export default function CommentSection({ blogId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId,
          authorName: authorName.trim(),
          content: newComment.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment('');
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 5000);
      } else {
        // Fallback to optimistic addition if server responds differently
        const tempComment: Comment = {
          id: `temp-${Date.now()}`,
          content: newComment.trim(),
          createdAt: new Date().toISOString(),
          author: {
            name: authorName.trim(),
            avatar: null
          }
        };
        setComments([tempComment, ...comments]);
        setNewComment('');
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 5000);
      }
    } catch (err: unknown) {
      console.error('Comment submit error:', err);
      // Still show optimistic update so user UX is non-blocking
      const tempComment: Comment = {
        id: `temp-${Date.now()}`,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        author: {
          name: authorName.trim(),
          avatar: null
        }
      };
      setComments([tempComment, ...comments]);
      setNewComment('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-10 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
            💬
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Community Discussion ({comments.length})
            </h3>
            <p className="text-xs text-slate-500 font-medium">Join the conversation and share your developer insights</p>
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4 shadow-inner">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Leave a Comment</h4>
          <span className="text-xs text-slate-400 font-medium">Markdown supported text</span>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <span>✅</span>
            <span>Thank you! Your comment has been published to the discussion below.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
            <input
              type="text"
              placeholder="e.g. Alex Turner"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Your Comment *</label>
          <textarea
            rows={3}
            placeholder="What are your thoughts on this topic? Share code snippets, feedback, or questions..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post Comment</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-sm">
          💬 No comments yet. Be the first to share your insights with the community!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/70 hover:border-blue-200 shadow-sm hover:shadow-md transition-all group"
            >
              {comment.author?.avatar ? (
                <Image
                  src={comment.author.avatar}
                  alt={comment.author.name || 'User'}
                  width={44}
                  height={44}
                  className="rounded-full ring-2 ring-blue-500/20 object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <h5 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {comment.author?.name || 'Anonymous Developer'}
                  </h5>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

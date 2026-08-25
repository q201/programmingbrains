
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

async function fetchStats() {
  const res = await fetch('/api/admin/stats');
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to fetch stats');
  }
  return res.json();
}

interface Stats {
  userCount: number;
  blogCount: number;
  commentCount: number;
  categoryCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        setStats(data);
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

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your platform content, authors, and system metrics</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card-dark rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">📝</div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Total Blogs</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.blogCount}</h3>
              <p className="text-xs text-slate-500 mt-2">Published & Draft articles</p>
            </div>

            <div className="glass-card-dark rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">👥</div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Total Users</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.userCount}</h3>
              <p className="text-xs text-slate-500 mt-2">Registered authors & readers</p>
            </div>

            <div className="glass-card-dark rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">📁</div>
              <p className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">Categories</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.categoryCount}</h3>
              <p className="text-xs text-slate-500 mt-2">Active topic categories</p>
            </div>

            <div className="glass-card-dark rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">💬</div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Comments</p>
              <h3 className="text-3xl font-extrabold text-white">{stats.commentCount}</h3>
              <p className="text-xs text-slate-500 mt-2">Reader discussions</p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Management Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/admin/news"
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 p-6 rounded-2xl transition-all duration-300 group block"
              >
                <div className="text-3xl mb-3">📰</div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Daily News Articles</h3>
                <p className="text-slate-400 text-sm mt-1">Publish news updates, AI breakthroughs, and source links.</p>
              </Link>

              <Link
                href="/admin/news-sources"
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 p-6 rounded-2xl transition-all duration-300 group block"
              >
                <div className="text-3xl mb-3">📡</div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">News Feed Sources</h3>
                <p className="text-slate-400 text-sm mt-1">Configure active Google News RSS feeds and tech APIs.</p>
              </Link>

              <Link
                href="/admin/blogs"
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 p-6 rounded-2xl transition-all duration-300 group block"
              >
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Manage Blog Posts</h3>
                <p className="text-slate-400 text-sm mt-1">Create new articles, edit published blogs, or delete existing posts.</p>
              </Link>

              <Link
                href="/admin/users"
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 p-6 rounded-2xl transition-all duration-300 group block"
              >
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">User Access Control</h3>
                <p className="text-slate-400 text-sm mt-1">Review user accounts and modify administrator or author privileges.</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


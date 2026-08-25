'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface NewsSourceItem {
  id: string;
  name: string;
  category: string;
  url: string;
  type: string;
  enabled: boolean;
  description?: string;
  lastFetchedAt?: string;
  createdAt: string;
}

export default function AdminNewsSourcesPage() {
  const [sources, setSources] = useState<NewsSourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingId, setFetchingId] = useState<string | 'all' | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSource, setNewSource] = useState({
    name: '',
    category: 'Technology',
    url: '',
    type: 'rss',
    description: '',
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/admin/news-sources');
      if (res.ok) {
        const data = await res.json();
        setSources(data);
      }
    } catch (error) {
      console.error('Failed to fetch news sources', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setSources(prev =>
        prev.map(s => (s.id === id ? { ...s, enabled: !currentStatus } : s))
      );

      const res = await fetch(`/api/admin/news-sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (!res.ok) {
        setSources(prev =>
          prev.map(s => (s.id === id ? { ...s, enabled: currentStatus } : s))
        );
      }
    } catch (error) {
      console.error('Failed to toggle source', error);
    }
  };

  const handleFetchImport = async (sourceId?: string) => {
    setFetchingId(sourceId || 'all');
    setNotification(null);

    try {
      const res = await fetch('/api/admin/news-sources/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({
          message: data.message || `Successfully imported news items!`,
          type: 'success',
        });
        fetchSources(); // Refresh list to get updated lastFetchedAt
      } else {
        setNotification({
          message: data.error || 'Failed to fetch news items.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to fetch news', error);
      setNotification({
        message: 'An error occurred while fetching news.',
        type: 'error',
      });
    } finally {
      setFetchingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news source?')) return;
    try {
      await fetch(`/api/admin/news-sources/${id}`, { method: 'DELETE' });
      setSources(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete news source', error);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;

    try {
      const res = await fetch('/api/admin/news-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource),
      });

      if (res.ok) {
        const created = await res.json();
        setSources(prev => [created, ...prev]);
        setShowAddModal(false);
        setNewSource({ name: '', category: 'Technology', url: '', type: 'rss', description: '' });
      }
    } catch (error) {
      console.error('Failed to add news source', error);
    }
  };

  const activeCount = sources.filter(s => s.enabled).length;
  const disabledCount = sources.length - activeCount;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">News Feed & API Sources</h1>
            <p className="text-slate-400 text-sm mt-1">Configure, enable, or trigger manual news imports from Google News & RSS APIs</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleFetchImport()}
              disabled={fetchingId !== null}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <span>{fetchingId === 'all' ? '⏳ Syncing Feeds...' : '⚡ Fetch & Import All Active'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>+ Add News Source</span>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card-dark rounded-2xl p-6 border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Total Sources</p>
            <h3 className="text-3xl font-extrabold text-white">{sources.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Configured news feeds</p>
          </div>

          <div className="glass-card-dark rounded-2xl p-6 border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Active Sources</p>
            <h3 className="text-3xl font-extrabold text-emerald-400">{activeCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Currently enabled</p>
          </div>

          <div className="glass-card-dark rounded-2xl p-6 border border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Disabled Sources</p>
            <h3 className="text-3xl font-extrabold text-slate-400">{disabledCount}</h3>
            <p className="text-xs text-slate-500 mt-1">Paused / turned off</p>
          </div>
        </div>

        {/* News Sources Table / List */}
        {isLoading ? (
          <div className="text-slate-400 text-center py-12">Loading news sources...</div>
        ) : (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">All Configured Feeds</h2>
              <span className="text-xs text-slate-400">Database-backed & managed</span>
            </div>

            <div className="divide-y divide-slate-800/60 overflow-x-auto">
              {sources.map((item) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-base">{item.name}</h3>
                      <span className="bg-slate-800 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                        {item.category}
                      </span>
                      <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {item.type}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-slate-400">{item.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <p className="text-xs text-slate-500 font-mono truncate max-w-md">{item.url}</p>
                      {item.lastFetchedAt && (
                        <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                          Last Synced: {new Date(item.lastFetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    {/* Fetch & Import Now Button */}
                    <button
                      onClick={() => handleFetchImport(item.id)}
                      disabled={fetchingId !== null}
                      className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-xl border border-slate-700 text-xs transition-all flex items-center gap-1.5"
                      title="Fetch latest articles from this feed right now"
                    >
                      <span>{fetchingId === item.id ? '⏳ Fetching...' : '⚡ Fetch & Import Now'}</span>
                    </button>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${item.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {item.enabled ? 'Active' : 'Disabled'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggle(item.id, item.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400 p-2 text-sm font-medium transition-colors"
                      title="Delete Source"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for adding custom source */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Custom News Feed / API</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAddSource} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Source Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Google News - AI"
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <select
                    value={newSource.category}
                    onChange={(e) => setNewSource({ ...newSource, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="Web Development">Web Development</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Developer News">Developer News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">RSS or API URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://news.google.com/rss/search?q=..."
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of this feed..."
                    value={newSource.description}
                    onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
                  >
                    Save Source
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

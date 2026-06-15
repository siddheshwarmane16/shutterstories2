'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { api } from '@/utils/api';

export default function BlogIndexPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.getBlogs();
        setBlogs(res);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      b.tags.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative min-h-screen py-32 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96B] font-semibold">Editorial Journal</span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight uppercase mt-2 mb-6 text-[var(--foreground)]">
            The Journal
          </h1>
          <p className="text-[var(--secondary-text)] text-xs tracking-wide leading-relaxed font-light">
            Behind the lens stories, visual guides, lighting tricks, and destination planning advice for standard events.
          </p>
        </div>

        {/* Filter Row */}
        <div className="flex justify-end mb-12">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--secondary-text)]/65">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--beige)] border border-[var(--border-color)] hover:border-[#C8A96B]/50 focus:border-[#C8A96B] rounded-sm py-2.5 pl-10 pr-4 text-xs tracking-wide text-[var(--foreground)] placeholder-[var(--secondary-text)]/45 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Main Grid list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--border-color)] rounded-sm bg-[var(--beige)]/20">
            <p className="text-[var(--secondary-text)]/60 text-xs uppercase tracking-[0.15em]">No journal entries match search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredBlogs.map((post) => (
              <div key={post.id} className="group overflow-hidden border border-[var(--border-color)] rounded-sm flex flex-col h-full bg-[var(--beige)]/30 hover:border-[#C8A96B]/30 hover:shadow-sm transition-all duration-300">
                
                {/* Featured Image */}
                <div className="aspect-[16/10] overflow-hidden bg-[var(--beige)]/50">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>

                {/* Text Context */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[var(--secondary-text)]/70 text-[9px] uppercase tracking-[0.15em] mb-3">
                      <span className="text-[#C8A96B] font-semibold">{post.category}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                    
                    <h3 className="font-editorial text-xl font-bold text-[var(--foreground)] mt-1 mb-4 line-clamp-2 group-hover:text-[#C8A96B] transition-colors">
                      {post.title}
                    </h3>
                    
                    <div
                      className="text-[var(--secondary-text)] text-xs leading-relaxed line-clamp-3 mb-6"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>

                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--foreground)]/85 hover:text-[#C8A96B] transition-colors"
                  >
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

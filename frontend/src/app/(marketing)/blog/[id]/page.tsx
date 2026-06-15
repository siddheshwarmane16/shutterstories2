'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { api } from '@/utils/api';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.getBlog(id);
        setPost(res);
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-8 w-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6D6D6D]">Fetching journal details...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-xl px-6 py-40 text-center">
        <h2 className="font-editorial text-3xl font-bold uppercase mb-4 text-[#1A1A1A]">Article Not Found</h2>
        <p className="text-[#6D6D6D] text-xs mb-8">This journal entry could not be retrieved from our archives.</p>
        <Link
          href="/blog"
          className="text-xs uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F7F2EA] font-bold py-3.5 px-6 rounded-sm hover:bg-[#C8A96B] hover:text-[#1A1A1A] transition-all"
        >
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6D6D6D] hover:text-[#C8A96B] mb-12 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Journal
      </Link>

      {/* Header Info */}
      <header className="mb-12">
        <div className="flex items-center gap-4 text-[#6D6D6D]/75 text-[10px] uppercase tracking-[0.15em] mb-4">
          <span className="text-[#C8A96B] font-semibold">{post.category}</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> 5 Min Read</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-[#1A1A1A] mb-6">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-y border-[#E5D8C5] py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#EFE7DB] border border-[#C8A96B]/20 rounded-full flex items-center justify-center text-[10px] uppercase font-bold text-[#C8A96B]">
              SS
            </div>
            <span className="text-xs text-[#1A1A1A]/85 font-medium">By {post.author?.name || 'Devan Singh'}</span>
          </div>

          <button className="text-[#6D6D6D] hover:text-[#C8A96B] transition-colors flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </header>

      {/* Hero Featured Image */}
      <div className="aspect-[21/9] w-full overflow-hidden border border-[#E5D8C5] rounded-sm mb-12 bg-[#EFE7DB]/40">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover grayscale opacity-85 hover:grayscale-0 transition-all duration-1000"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose max-w-none text-[#1A1A1A]/90 text-xs sm:text-sm leading-relaxed space-y-6 prose-headings:text-[#1A1A1A] prose-strong:text-[#1A1A1A] prose-a:text-[#C8A96B]">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Tags details */}
      {post.tags && (
        <div className="border-t border-[#E5D8C5] pt-10 mt-12 flex flex-wrap gap-2">
          {post.tags.split(',').map((tag: string, idx: number) => (
            <span
              key={idx}
              className="text-[9px] uppercase tracking-[0.15em] bg-[#EFE7DB]/60 border border-[#E5D8C5] py-1.5 px-3.5 rounded-sm text-[#6D6D6D] hover:border-[#C8A96B]/35 hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}

    </article>
  );
}

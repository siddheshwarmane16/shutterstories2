'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Sparkles, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/utils/api';

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getTestimonials();
        setReviews(res);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96B] font-semibold">Client Love</span>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight uppercase mt-2 mb-6 text-[#1A1A1A]">
          The Reviews
        </h1>
        <p className="text-[#6D6D6D] text-xs tracking-wide leading-relaxed font-light">
          Heartfelt reviews from our couples. We are humbled to be trusted with some of the most sacred days of their families.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#E5D8C5] rounded-sm bg-[#EFE7DB]/20">
          <p className="text-[#6D6D6D]/60 text-xs uppercase tracking-[0.15em]">No testimonial entries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-[#EFE7DB]/45 backdrop-blur-md border border-[#E5D8C5] p-8 sm:p-10 rounded-sm flex flex-col justify-between hover:border-[#C8A96B]/30 hover:shadow-md transition-all duration-500">
              
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-[#C8A96B] mb-6">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#C8A96B] text-[#C8A96B]" />
                  ))}
                </div>

                <p className="text-[#1A1A1A]/85 text-xs italic leading-relaxed mb-8">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 border-t border-[#E5D8C5] pt-6 mt-6">
                <img
                  src={rev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={rev.clientName}
                  className="h-10 w-10 rounded-full object-cover border border-[#C8A96B]/35"
                />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#1A1A1A]">{rev.clientName}</h4>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#C8A96B] block mt-0.5">
                    {rev.clientRole}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CTA section */}
      <div className="bg-[#EFE7DB]/60 border border-[#C8A96B]/25 p-12 text-center rounded-sm max-w-4xl mx-auto flex flex-col items-center shadow-sm">
        <Sparkles className="h-8 w-8 text-[#C8A96B] mb-6 animate-pulse" />
        <h2 className="font-editorial text-3xl font-bold uppercase mb-4 text-[#1A1A1A]">Be Our Next Story</h2>
        <p className="text-[#6D6D6D] text-xs tracking-wide max-w-md mb-8 leading-relaxed">
          Let’s write your cinematic wedding story together. Reach out to coordinate dates.
        </p>
        <Link
          href="/book"
          className="text-xs uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F7F2EA] font-bold py-4 px-8 rounded-sm hover:bg-[#C8A96B] hover:text-[#1A1A1A] transition-all flex items-center gap-2 group border border-transparent hover:border-[#C8A96B]"
        >
          Book Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Play, Film, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';
import { api } from '@/utils/api';

export default function FilmsPage() {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await api.getPortfolio();
        const videoItems = res.filter((item: any) => item.mediaType === 'VIDEO');
        setFilms(videoItems);
      } catch (err) {
        console.error('Failed to fetch video stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, []);

  const fallbackFilms = [
    {
      id: 'f1',
      title: 'The Royal Legacy Taj Udaipur',
      description: 'A 10-minute cinematic masterpiece documenting the sacred union of Meera and Dev in Udaipur. Shot on anamorphic lenses with custom acoustic sound design.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4',
      duration: '10 Min Film',
      location: 'Udaipur, India',
      category: 'Royal Wedding'
    },
    {
      id: 'f2',
      title: 'Whispers in Milan',
      description: 'Sophia & Liam’s destination pre-wedding documentary capturing fashion romance under Italian shadows.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4',
      duration: '4 Min Story',
      location: 'Milan, Italy',
      category: 'Pre-Wedding'
    },
    {
      id: 'f3',
      title: 'A Coastal Symphony in Goa',
      description: 'High-contrast sunset beach wedding celebration, highlighting laughter, grand structures and local traditions.',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40081-large.mp4',
      duration: '8 Min Film',
      location: 'Goa, India',
      category: 'Destination Wedding'
    }
  ];

  const displayFilms = films.length > 0 ? films : fallbackFilms;

  return (
    <div className="relative min-h-screen py-24 bg-[#F7F2EA] text-[#1F1F1F]">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-5"
          src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-piano-player-in-a-suit-40078-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2EA] via-[#F7F2EA]/95 to-[#F7F2EA] pointer-events-none" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-28">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">CINEMATOGRAPHY ARCHIVE</span>
          <h1 className="font-editorial text-4xl sm:text-7xl font-bold tracking-tight uppercase mt-3 mb-8 text-[#1F1F1F]">
            The Films
          </h1>
          <p className="text-[#5C4435] text-xs sm:text-sm tracking-widest leading-relaxed font-light">
            Experience our story-driven wedding documentaries and trailers. Shot on cinema-grade gear and color-graded by editorial visual directors.
          </p>
        </div>

        {/* Main Showcase Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="h-10 w-10 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-28">
            {displayFilms.map((film, idx) => (
              <div
                key={film.id || idx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center border-b border-[#5C4435]/10 pb-24 last:border-b-0 last:pb-0"
              >
                {/* Visual Card with Autoplay on Hover */}
                <div
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.pause();
                  }}
                  onClick={() => setActiveVideoUrl(film.mediaUrl)}
                  className="lg:col-span-7 aspect-video relative group cursor-pointer overflow-hidden border border-[#5C4435]/15 rounded-sm bg-neutral-900 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10 duration-500" />
                  
                  {/* Autoplay Trailer Video */}
                  <video
                    src={film.mediaUrl}
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.02] transition-all duration-700 pointer-events-none"
                    poster={
                      idx === 0
                        ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
                        : idx === 1
                        ? 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800'
                        : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'
                    }
                  />

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="h-16 w-16 bg-[#F7F2EA]/90 border border-[#C8A96B]/30 rounded-full flex items-center justify-center text-[#C8A96B] group-hover:bg-[#C8A96B] group-hover:text-[#F7F2EA] transition-all group-hover:scale-110 shadow-2xl">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Soundwave Indicator */}
                  <div className="absolute bottom-4 right-4 z-20 bg-[#F7F2EA]/90 backdrop-blur-md px-3.5 py-2 border border-[#C8A96B]/25 rounded-sm flex items-center gap-2">
                    <div className="flex items-end gap-0.5 h-6">
                      <span className="soundwave-bar" style={{ animationDelay: '0.1s' }} />
                      <span className="soundwave-bar" style={{ animationDelay: '0.3s' }} />
                      <span className="soundwave-bar" style={{ animationDelay: '0.5s' }} />
                      <span className="soundwave-bar" style={{ animationDelay: '0.2s' }} />
                      <span className="soundwave-bar" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#1F1F1F]">Preview Sound Active</span>
                  </div>
                </div>

                {/* Film Narrative Copy */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex flex-wrap items-center gap-4 text-[#5C4435]/65 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    <span className="flex items-center gap-1.5 bg-[#EFE7DB]/60 border border-[#5C4435]/15 px-2.5 py-1 rounded-sm">
                      <Clock className="h-3.5 w-3.5 text-[#C8A96B]" /> {film.duration || 'Teaser Film'}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#EFE7DB]/60 border border-[#5C4435]/15 px-2.5 py-1 rounded-sm">
                      <MapPin className="h-3.5 w-3.5 text-[#C8A96B]" /> {film.location || 'Destination'}
                    </span>
                    <span className="text-[#C8A96B] border border-[#C8A96B]/25 px-2.5 py-1 rounded-sm">
                      {film.category || 'Luxury Stories'}
                    </span>
                  </div>
                  
                  <h3
                    onClick={() => setActiveVideoUrl(film.mediaUrl)}
                    className="font-editorial text-2xl sm:text-4xl font-bold uppercase text-[#1F1F1F] hover:text-[#C8A96B] transition-colors cursor-pointer leading-tight"
                  >
                    {film.title}
                  </h3>
                  
                  <p className="text-[#5C4435] text-xs sm:text-sm leading-relaxed font-light tracking-wide">
                    {film.description}
                  </p>

                  <button
                    onClick={() => setActiveVideoUrl(film.mediaUrl)}
                    className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#C8A96B] hover:text-[#1F1F1F] transition-all mt-4 font-semibold group self-start"
                  >
                    Watch Cinematic Film
                    <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Immersive Video Overlay Modal */}
        {activeVideoUrl && (
          <div
            className="fixed inset-0 bg-black/99 z-[9999] flex items-center justify-center p-6"
            onClick={() => setActiveVideoUrl(null)}
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-6 right-6 h-12 w-12 bg-[#F7F2EA] text-[#1F1F1F] rounded-full flex items-center justify-center hover:bg-[#C8A96B] hover:text-[#F7F2EA] transition-all font-bold text-xl shadow-2xl"
              title="Close Player"
            >
              &times;
            </button>
            
            <div className="w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-[#C8A96B]/25" onClick={(e) => e.stopPropagation()}>
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

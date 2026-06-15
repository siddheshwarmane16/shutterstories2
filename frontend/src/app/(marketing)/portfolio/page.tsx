'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Maximize2, ZoomIn, ZoomOut, X, Play, Image as ImageIcon } from 'lucide-react';
import { api } from '@/utils/api';

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Lightbox State
  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Fetch categories and initial portfolio items
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await api.getCategories();
        setCategories(catRes);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch portfolio items based on search and category
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await api.getPortfolio(selectedCategory || undefined, searchQuery || undefined);
        setItems(res);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 300); // Debounce input searches

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery]);

  // Download Handler
  const handleDownload = async (item: any) => {
    try {
      const response = await fetch(item.mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${item.mediaType === 'VIDEO' ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback direct link download
      window.open(item.mediaUrl, '_blank');
    }
  };

  // Lightbox Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!lightboxRef.current) return;
    if (!document.fullscreenElement) {
      lightboxRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="relative min-h-screen py-24 overflow-hidden bg-[#F7F2EA] text-[#1F1F1F]">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-5"
          src="https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-of-a-bride-and-groom-40114-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2EA] via-[#F7F2EA]/95 to-[#F7F2EA] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">VISUAL ARCHIVE</span>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight uppercase mt-2 mb-6">
          The Portfolio
        </h1>
        <p className="text-[#5C4435] text-xs tracking-wide leading-relaxed font-light">
          A curated selection of editorial photographs and cinematic highlights captured at destination celebrations worldwide.
        </p>
      </div>

      {/* Filter Options Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-[#5C4435]/10 pb-8">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('')}
            className={`text-[9px] uppercase tracking-[0.25em] py-2.5 px-5 rounded-sm border shrink-0 transition-all ${
              selectedCategory === ''
                ? 'bg-[#C8A96B] border-[#C8A96B] text-[#F7F2EA] font-semibold'
                : 'border-[#5C4435]/15 text-[#5C4435]/70 hover:border-[#C8A96B]'
            }`}
          >
            All Stories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`text-[9px] uppercase tracking-[0.25em] py-2.5 px-5 rounded-sm border shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#C8A96B] border-[#C8A96B] text-[#F7F2EA] font-semibold'
                  : 'border-[#5C4435]/15 text-[#5C4435]/70 hover:border-[#C8A96B]'
              }`}
            >
              {cat.name} ({cat._count?.items || 0})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C4435]/40">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search weddings, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#EFE7DB]/60 border border-[#5C4435]/15 hover:border-[#C8A96B] focus:border-[#C8A96B] rounded-sm py-2.5 pl-10 pr-4 text-xs tracking-wide text-[#1F1F1F] placeholder-[#5C4435]/40 focus:outline-none transition-colors"
          />
        </div>

      </div>

      {/* Masonry Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="h-8 w-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#5C4435]/50">Compiling gallery...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-40 border border-dashed border-[#5C4435]/15 rounded-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5C4435]/40">No portfolio records found</span>
        </div>
      ) : (
        /* CSS columns masonry layout - Editorial Spacing */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setZoomScale(1);
              }}
              className="break-inside-avoid group cursor-pointer relative overflow-hidden border border-[#5C4435]/10 rounded-sm bg-[#EFE7DB]/30 shadow-sm"
            >
              {item.mediaType === 'VIDEO' ? (
                <div className="relative aspect-[9/16] bg-neutral-900">
                  <video
                    src={item.mediaUrl}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    preload="metadata"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="h-12 w-12 bg-black/60 border border-white/20 rounded-full flex items-center justify-center text-[#C8A96B] group-hover:bg-[#C8A96B] group-hover:text-[#1F1F1F] transition-colors">
                      <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover grayscale group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              )}

              {/* Hover Caption Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/90 via-[#1F1F1F]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[#C8A96B] text-[9px] uppercase tracking-[0.25em] font-semibold mb-1">
                  {item.category?.name}
                </span>
                <h3 className="font-editorial text-lg font-bold text-[#F7F2EA] mb-1">{item.title}</h3>
                <p className="text-[#F7F2EA]/80 text-[10px] leading-relaxed line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Immersive Overlay */}
      {activeItem && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 bg-[#F7F2EA]/98 z-[9999] flex flex-col justify-between"
          onClick={() => {
            setActiveItem(null);
            setIsFullscreen(false);
          }}
        >
          {/* Top Panel Actions */}
          <div
            className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#F7F2EA] to-transparent z-10 border-b border-[#5C4435]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              <span className="text-[#C8A96B] text-[9px] uppercase tracking-[0.25em] font-semibold">
                {activeItem.category?.name}
              </span>
              <h2 className="font-editorial text-lg text-[#1F1F1F] font-bold">{activeItem.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.25))}
                className="h-10 w-10 border border-[#5C4435]/20 rounded-full flex items-center justify-center text-[#1F1F1F]/80 hover:bg-[#EFE7DB] hover:text-[#1F1F1F] transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setZoomScale((z) => Math.min(3, z + 0.25))}
                className="h-10 w-10 border border-[#5C4435]/20 rounded-full flex items-center justify-center text-[#1F1F1F]/80 hover:bg-[#EFE7DB] hover:text-[#1F1F1F] transition-all"
                title="Zoom In"
              >
                <ZoomIn className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="h-10 w-10 border border-[#5C4435]/20 rounded-full flex items-center justify-center text-[#1F1F1F]/80 hover:bg-[#EFE7DB] hover:text-[#1F1F1F] transition-all"
                title="Fullscreen Toggle"
              >
                <Maximize2 className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => handleDownload(activeItem)}
                className="h-10 w-10 border border-[#5C4435]/20 rounded-full flex items-center justify-center text-[#1F1F1F]/80 hover:bg-[#EFE7DB] hover:text-[#1F1F1F] transition-all"
                title="Download High Res"
              >
                <Download className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => {
                  setActiveItem(null);
                  setIsFullscreen(false);
                }}
                className="h-10 w-10 bg-[#1F1F1F] text-[#F7F2EA] rounded-full flex items-center justify-center hover:bg-[#C8A96B] hover:text-[#1F1F1F] transition-all"
                title="Close Gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Media Centerpiece */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div
              className="transition-transform duration-300 max-w-full max-h-full flex items-center justify-center"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={(e) => e.stopPropagation()}
            >
              {activeItem.mediaType === 'VIDEO' ? (
                <video
                  src={activeItem.mediaUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={activeItem.mediaUrl}
                  alt={activeItem.title}
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                />
              )}
            </div>
          </div>

          {/* Bottom Panel Info */}
          <div
            className="text-center px-6 py-6 bg-gradient-to-t from-[#F7F2EA] to-transparent z-10 border-t border-[#5C4435]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#5C4435] text-xs max-w-xl mx-auto leading-relaxed">
              {activeItem.description}
            </p>
          </div>

          </div>
      )}

      </div>
    </div>
  );
}

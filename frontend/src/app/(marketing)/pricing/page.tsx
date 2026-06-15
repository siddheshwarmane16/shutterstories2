'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, Calculator } from 'lucide-react';
import { api } from '@/utils/api';

export default function PricingPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Quote Calculator state
  const [days, setDays] = useState(1);
  const [photographers, setPhotographers] = useState(2);
  const [filmmakers, setFilmmakers] = useState(2);
  const [drone, setDrone] = useState(false);
  const [album, setAlbum] = useState(false);
  const [highlightFilm, setHighlightFilm] = useState(true);
  const [documentaryFilm, setDocumentaryFilm] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.getPackages();
        setPackages(res);
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Calculate Custom Quote
  const calculateTotal = () => {
    let base = 80000; // base rate per day
    let photographerRate = 25000; // per photographer per day
    let filmmakerRate = 30000; // per videographer per day

    let total = base * days;
    total += photographers * photographerRate * days;
    total += filmmakers * filmmakerRate * days;

    if (drone) total += 40000 * days; // drone cost
    if (album) total += 35000; // hardcover layflat book
    if (highlightFilm) total += 50000; // cinematic vertical/horizontal highlight
    if (documentaryFilm) total += 100000; // full document film

    return total;
  };

  return (
    <div className="relative min-h-screen py-32 overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-5"
          src="https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40081-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/95 to-[var(--background)] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">PRICING STRUCTURE</span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight uppercase mt-2 mb-6 text-[var(--foreground)]">
            The Packages
          </h1>
          <p className="text-[var(--secondary-text)] text-xs tracking-wide leading-relaxed font-light">
            Bespoke investment tiers crafted for fine-art visual coverage. Every commission receives full in-house pre-production and editing attention.
          </p>
        </div>

        {/* Dynamic Packages Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
            {packages.filter(p => p.price > 0).map((pkg) => {
              const featuresList = pkg.features ? pkg.features.split(';') : [];
              const isGold = pkg.name.toLowerCase() === 'gold';
              
              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between p-8 sm:p-10 rounded-sm shadow-md transition-all ${
                    isGold
                      ? 'bg-[var(--beige)] border-2 border-[#C8A96B] shadow-lg shadow-[#C8A96B]/5'
                      : 'bg-[var(--beige)]/40 border border-[var(--border-color)]'
                  }`}
                >
                  {isGold && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8A96B] text-black font-bold text-[9px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-sm">
                      Recommended Tier
                    </span>
                  )}

                  <div>
                    <h3 className="font-editorial text-2xl font-bold uppercase tracking-wide mb-2 text-[var(--foreground)]">{pkg.name}</h3>
                    <p className="text-[var(--secondary-text)] text-[11px] leading-relaxed mb-6 font-light">{pkg.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-baseline text-[var(--foreground)] gap-1 mb-8">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-[var(--secondary-text)]/60 text-[10px] uppercase tracking-wider font-light">INR Net</span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4 border-t border-[var(--border-color)] pt-8 mb-10 text-xs text-[var(--secondary-text)]/80">
                      {featuresList.map((feat: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-[#C8A96B] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/book"
                    className={`text-center text-xs uppercase tracking-[0.2em] py-4 rounded-sm font-bold transition-all ${
                      isGold
                        ? 'bg-[#C8A96B] text-black hover:bg-black hover:text-white'
                        : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[#C8A96B] hover:text-black'
                    }`}
                  >
                    Reserve Package
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Interactive Custom Price Calculator */}
        <div className="border-t border-[var(--border-color)] pt-20">
          <div className="max-w-5xl mx-auto bg-[var(--beige)]/30 border border-[var(--border-color)] p-8 sm:p-12 rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Controls */}
            <div>
              <div className="flex items-center gap-2 text-[#C8A96B] mb-4">
                <Calculator className="h-5 w-5" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold">Custom Calculator</span>
              </div>
              <h2 className="font-editorial text-3xl font-bold uppercase tracking-tight text-[var(--foreground)] mb-6">
                Quote Builder
              </h2>
              <p className="text-[var(--secondary-text)] text-xs mb-8 leading-relaxed font-light">
                Tailor-build your crew size, drone coverage, and print deliverables to generate an instant estimate.
              </p>

              <div className="space-y-6">
                
                {/* Event Days */}
                <div>
                  <div className="flex justify-between text-xs uppercase tracking-[0.1em] text-[var(--secondary-text)]/70 mb-2">
                    <span>Schedules (Event Days)</span>
                    <span className="text-[var(--foreground)] font-semibold">{days} Day(s)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full h-1 bg-[#5C4435]/10 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
                  />
                </div>

                {/* Crew Count */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-xs uppercase tracking-[0.1em] text-[var(--secondary-text)]/70 mb-2">
                      <span>Photographers</span>
                      <span className="text-[var(--foreground)] font-semibold">{photographers}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={photographers}
                      onChange={(e) => setPhotographers(Number(e.target.value))}
                      className="w-full h-1 bg-[#5C4435]/10 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs uppercase tracking-[0.1em] text-[var(--secondary-text)]/70 mb-2">
                      <span>Videographers</span>
                      <span className="text-[var(--foreground)] font-semibold">{filmmakers}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      value={filmmakers}
                      onChange={(e) => setFilmmakers(Number(e.target.value))}
                      className="w-full h-1 bg-[#5C4435]/10 rounded-lg appearance-none cursor-pointer accent-[#C8A96B]"
                    />
                  </div>
                </div>

                {/* Addons Checkbox List */}
                <div className="pt-4 space-y-4">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-text)]/50 mb-2 font-bold">Premium Add-ons</span>
                  <label className="flex items-center gap-3 text-xs text-[var(--secondary-text)]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={drone}
                      onChange={(e) => setDrone(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border-color)] text-[#C8A96B] focus:ring-[#C8A96B] accent-[#C8A96B]"
                    />
                    <span>4k Cinematic Aerial Drone Coverage (+₹40,000 / day)</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-[var(--secondary-text)]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={album}
                      onChange={(e) => setAlbum(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border-color)] text-[#C8A96B] focus:ring-[#C8A96B] accent-[#C8A96B]"
                    />
                    <span>Hardcover Layflat Editorial Storybook Album (+₹35,000)</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-[var(--secondary-text)]/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={documentaryFilm}
                      onChange={(e) => setDocumentaryFilm(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border-color)] text-[#C8A96B] focus:ring-[#C8A96B] accent-[#C8A96B]"
                    />
                    <span>Full Documentary Film Video Cut (+₹1,00,000)</span>
                  </label>
                </div>

              </div>
            </div>

            {/* Pricing Aggregator display */}
            <div className="bg-[var(--beige)] p-8 rounded-sm text-center flex flex-col items-center justify-center border border-[#C8A96B]/30 aspect-square shadow-sm">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96B] mb-2 font-bold flex items-center gap-1.5 justify-center">
                <Sparkles className="h-4 w-4" /> Estimated Investment
              </span>
              <div className="text-[var(--foreground)] mb-2 flex items-baseline justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight">₹{calculateTotal().toLocaleString()}</span>
                <span className="text-[var(--secondary-text)]/60 text-[10px] uppercase tracking-wider font-light">INR</span>
              </div>
              <p className="text-[var(--secondary-text)]/70 text-[10px] leading-relaxed max-w-[200px] mb-8 font-light mx-auto">
                Includes full color grading, high-res editing, private gallery server hosting.
              </p>

              <Link
                href="/book"
                className="text-xs uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] font-semibold py-3.5 px-8 rounded-sm hover:bg-[#C8A96B] hover:text-black transition-all flex items-center gap-2 group w-full justify-center"
              >
                Reserve Custom Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

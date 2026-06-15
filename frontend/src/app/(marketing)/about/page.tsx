'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, ShieldCheck, ArrowRight, Camera, Users } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Destination Weddings', val: '120+' },
    { label: 'Global Cities Visited', val: '15+' },
    { label: 'Editorial Awards', val: '8' },
    { label: 'Client Satisfaction', val: '100%' },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors duration-500">
      
      {/* 1. Fullscreen Parallax Behind-The-Scenes Background Header */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[var(--beige)]/30 pt-16">
        {/* Parallax Background Frame */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600"
            alt="Behind the scenes wedding filmmaking"
            className="w-full h-full object-cover opacity-15 scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 via-[var(--background)]/40 to-[var(--background)] z-10 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold mb-4">BEHIND THE LENS</span>
          <h1 className="font-editorial text-4xl sm:text-7xl font-bold tracking-tight text-[var(--foreground)] uppercase leading-none mb-6">
            The Studio Story
          </h1>
          <p className="text-[var(--secondary-text)] text-xs sm:text-sm tracking-[0.18em] max-w-2xl leading-relaxed font-light">
            An ultra-luxury editorial photography studio creating visual legacies for discerning couples globally.
          </p>
        </div>
      </section>

      {/* 2. Split Brand Narrative & Team Shot Section */}
      <section className="py-24 relative z-10 border-t border-[var(--border-color)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Brand Story */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A96B] font-bold">OUR PHILOSOPHY</span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold uppercase tracking-tight leading-tight text-[var(--foreground)]">
                Every Frame Tells A Story.
              </h2>
              <div className="w-16 h-[1px] bg-[#C8A96B] my-2" />
              <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed tracking-wide font-light">
                Established in 2018, Shutter Stories was born from a simple obsession: to transform wedding memories into timeless editorial cinema. We do not view weddings as simple events; we view them as canvas panels where family lineages, emotional thresholds, and stunning environments blend.
              </p>
              <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed tracking-wide font-light">
                Our visual language draws inspiration from high-fashion magazine covers (Vogue, Harper's Bazaar), geometric minimalist outlines, and Netflix's rich anamorphic filmmaking tones.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="flex gap-4 items-start bg-[var(--beige)]/40 border border-[var(--border-color)] p-5 rounded-sm">
                  <Camera className="h-5 w-5 text-[#C8A96B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--foreground)] mb-1">Fine Art Framing</h4>
                    <p className="text-[var(--secondary-text)] text-[11px] leading-relaxed">Observational captures focusing on light, gestures, and environment.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-[var(--beige)]/40 border border-[var(--border-color)] p-5 rounded-sm">
                  <Users className="h-5 w-5 text-[#C8A96B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--foreground)] mb-1">Elite Directors</h4>
                    <p className="text-[var(--secondary-text)] text-[11px] leading-relaxed">Collaborative scripting and styling assistance before production.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Cinematic Team Shot */}
            <div className="lg:col-span-5 relative aspect-[3/4] overflow-hidden border border-[var(--border-color)] rounded-sm shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800"
                alt="Photography team equipment setup"
                className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-102 group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96B] font-semibold">Active Crew Setup</span>
                <h4 className="font-editorial text-lg text-[#F7F2EA] uppercase font-bold mt-1">Global Cinematic Crew</h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Stats Summary Row */}
      <section className="py-20 bg-[var(--beige)] border-y border-[var(--border-color)] relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="block text-4xl sm:text-5xl font-bold text-[#C8A96B] font-editorial mb-2">{s.val}</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--secondary-text)] font-light">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Chief Bio */}
      <section className="py-32 relative z-10 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Artist Image */}
            <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden border border-[var(--border-color)] rounded-sm lg:order-2 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800"
                alt="Devan Singh - Chief Photographer"
                className="w-full h-full object-cover grayscale opacity-95 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
              <div className="absolute bottom-8 left-8 z-20">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">Founder & Director</span>
                <h4 className="font-editorial text-2xl font-bold text-[#F7F2EA] mt-1 uppercase">Devan Singh</h4>
              </div>
            </div>

            {/* Artist Copy */}
            <div className="lg:col-span-7 flex flex-col gap-6 lg:order-1">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A96B] font-bold">THE ARTIST</span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[var(--foreground)]">
                Devan Singh
              </h2>
              <div className="w-16 h-[1px] bg-[#C8A96B] my-2" />
              <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed tracking-wide font-light">
                With over a decade of visual framing experience, Devan has documented intimate weddings for artists, business directors, and global couples across Italy, France, Bali, and the heritage palaces of Rajasthan.
              </p>
              <p className="text-[var(--foreground)] opacity-90 text-xs sm:text-sm leading-relaxed tracking-wide font-light italic border-l-2 border-[#C8A96B] pl-6 my-2">
                "We aren't there to direct you to smile at the lens. Our presence is light, respectful, and observational. We seek the quiet sigh, the tear caught on the eyelash, the burst of laughter when the formal ceremony concludes. That is the poetry of a wedding."
              </p>
              
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2.5 bg-[var(--beige)]/60 border border-[var(--border-color)] px-4 py-2 rounded-sm">
                  <Award className="h-4.5 w-4.5 text-[#C8A96B]" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--foreground)]/80 font-bold">WPA Awardee</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[var(--beige)]/60 border border-[var(--border-color)] px-4 py-2 rounded-sm">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#C8A96B]" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--foreground)]/80 font-bold">Secure Delivery</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Editorial Call-to-action */}
      <section className="py-24 relative z-10 border-t border-[var(--border-color)] bg-[var(--beige)]/30">
        <div className="glass-panel p-12 md:p-16 text-center rounded-sm max-w-4xl mx-auto flex flex-col items-center shadow-2xl relative overflow-hidden bg-[var(--background)]/90">
          <Sparkles className="h-10 w-10 text-[#C8A96B] mb-6 animate-pulse z-10" />
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold uppercase mb-4 text-[var(--foreground)] z-10">Are You Ready to Begin?</h2>
          <p className="text-[var(--secondary-text)] text-xs sm:text-sm tracking-wide max-w-md mb-8 leading-relaxed font-light z-10">
            Bookings are highly limited to keep post-production quality premium. Get in touch to schedule your pre-production session.
          </p>
          <Link
            href="/book"
            className="text-xs uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] font-semibold py-4.5 px-10 rounded-sm hover:bg-[#C8A96B] hover:text-black transition-all flex items-center gap-2.5 group z-10 shadow-md"
          >
            Book Consultation <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

    </div>
  );
}

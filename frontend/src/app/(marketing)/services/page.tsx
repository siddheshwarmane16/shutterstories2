'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Film, Sparkles, Heart, Video, Briefcase, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const serviceItems = [
    {
      icon: Heart,
      title: 'Luxury Wedding Stories',
      desc: 'Our flagship cinematic capture. We cover grand destination weddings with multiple editorial photographers, feature-length documentary filmmaking, color grading, and drone cinematography.',
      bullets: ['Multiple angles coverage', '4k resolution delivery', 'Layflat custom albums', 'Global crew deployment'],
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
    },
    {
      icon: Film,
      title: 'Pre-Wedding Films',
      desc: 'Bespoke romantic narratives shot at luxury destinations across Cappadocia, Udaipur, Paris, or Lake Como. We work together on script writing, wardrobe styling, and lighting design.',
      bullets: ['Destination assistance', 'Directing & scripting', 'Trailer & teaser cuts', 'Drone aerials included'],
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'
    },
    {
      icon: Sparkles,
      title: 'High-Fashion Engagements',
      desc: 'Documenting proposal surprise sessions and intimate engagement celebrations with an editorial fashion style. Crisp captures highlighting details, expressions, and pure joy.',
      bullets: ['Candid emotional frames', 'Fast preview releases', 'Bespoke portrait edits', 'Private online delivery'],
      bgType: 'image',
      bgUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800'
    },
    {
      icon: Video,
      title: 'Cinematic Reels & Socials',
      desc: 'High-impact short-form videos optimized for vertical screens and platforms. Engineered with professional micro-sound design, quick cinematic pacing, and custom color schemes.',
      bullets: ['Vertical orientation (9:16)', 'Instagram reels delivery', 'Trending audio matching', 'Fast turnaround (48 hours)'],
      bgType: 'video',
      bgUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4'
    },
    {
      icon: Briefcase,
      title: 'Corporate Narrative & Brand Films',
      desc: 'Commercial storytelling for high-end fashion brands, resort launches, and corporate documentaries. Highlighting core branding values with sleek visuals and interviews.',
      bullets: ['Interview audio capture', 'Brand narrative layout', 'Sleek executive edits', 'Commercial licensing rights'],
      bgType: 'video',
      bgUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-piano-player-in-a-suit-40078-large.mp4'
    }
  ];

  return (
    <div className="relative min-h-screen py-32 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/95 to-[var(--background)] pointer-events-none" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-28">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">OUR OFFERINGS</span>
          <h1 className="font-editorial text-4xl sm:text-7xl font-bold tracking-tight uppercase mt-3 mb-8 text-[var(--foreground)]">
            The Mediums
          </h1>
          <p className="text-[var(--secondary-text)] text-xs sm:text-sm tracking-widest leading-relaxed font-light">
            We combine classic photojournalistic methods with high-fashion portraiture and documentary cinema to record families, weddings, and commercial narratives.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-28">
          {serviceItems.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="relative group p-8 sm:p-12 rounded-sm overflow-hidden border border-[var(--border-color)] flex flex-col justify-between hover:border-[#C8A96B] transition-all duration-500 min-h-[420px] bg-[var(--beige)]/30 shadow-md"
              >
                {/* Media Background */}
                <div className="absolute inset-0 z-0">
                  {svc.bgType === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-10 group-hover:scale-[1.02] group-hover:opacity-25 transition-all duration-1000"
                      src={svc.bgUrl}
                    />
                  ) : (
                    <img
                      className="w-full h-full object-cover opacity-15 group-hover:scale-[1.02] group-hover:opacity-30 transition-all duration-1000 grayscale group-hover:grayscale-0"
                      src={svc.bgUrl}
                      alt={svc.title}
                    />
                  )}
                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/95 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Card Contents */}
                <div className="relative z-20">
                  <div className="h-12 w-12 bg-[var(--background)]/90 border border-[#C8A96B]/30 rounded-sm flex items-center justify-center text-[#C8A96B] mb-8 shadow-sm">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold uppercase text-[var(--foreground)] mb-4 tracking-wide group-hover:text-[#C8A96B] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed mb-8 font-light tracking-wide max-w-md">
                    {svc.desc}
                  </p>
                  
                  <ul className="grid grid-cols-2 gap-4 mb-8 text-[11px] text-[var(--secondary-text)]/70 border-t border-[var(--border-color)] pt-8">
                    {svc.bullets.map((b, bidx) => (
                      <li key={bidx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#C8A96B] rounded-full shrink-0" />
                        <span className="tracking-wider">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/book"
                  className="relative z-20 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-[#C8A96B] hover:text-[var(--foreground)] transition-all mt-4 group font-semibold self-start"
                >
                  Inquire For Details
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}

          {/* Custom Bespoke Panel */}
          <div className="relative p-8 sm:p-12 rounded-sm overflow-hidden border border-[#C8A96B]/30 flex flex-col justify-between min-h-[420px] bg-[var(--beige)]/45 shadow-md">
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-10 grayscale"
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800"
                alt="Bespoke visual production camera"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/95 to-transparent z-10 pointer-events-none" />
            </div>

            <div className="relative z-20">
              <span className="bg-[#C8A96B] text-black text-[9px] uppercase tracking-[0.25em] px-3.5 py-1.5 font-bold rounded-sm shadow-sm">
                Bespoke commissions
              </span>
              <h3 className="font-editorial text-2xl font-bold uppercase mt-8 mb-4 text-[var(--foreground)] tracking-wide">
                Tailored Visual Legacies
              </h3>
              <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed mb-8 font-light tracking-wide">
                Do you have a unique international destination wedding or custom multi-day family history project? Our lead director Devan is available for bespoke commissions globally. We construct completely customized schedules, crew allocations, and album styles.
              </p>
            </div>
            <Link
              href="/contact"
              className="relative z-20 text-center text-xs uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] font-semibold py-4.5 rounded-sm hover:bg-[#C8A96B] hover:text-black transition-all shadow-md"
            >
              Initiate Consultation
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

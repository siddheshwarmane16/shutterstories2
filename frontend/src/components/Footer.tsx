'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Instagram, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] text-white/60 border-t border-white/5 pt-20 pb-10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4 lg:col-span-1.5">
            <Link href="/" className="flex items-start gap-2">
              <Camera className="h-5 w-5 text-[#D4A44B] mt-1" />
              <div className="flex flex-col leading-tight">
                <span className="font-editorial text-base tracking-[0.2em] uppercase font-bold text-white">
                  Shutter Stories
                </span>
                <span className="text-[7px] uppercase tracking-[0.25em] text-[#D4A44B]/60 font-light mt-0.5">
                  Every Frame Tells A Story
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs mt-4 font-light">
              Bespoke luxury wedding photography and cinematic filmmaking capturing raw emotional legacies worldwide.
            </p>
            <div className="flex items-center gap-4 mt-6 text-white/40">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A44B] transition-colors" aria-label="Instagram">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A44B] transition-colors" aria-label="YouTube">
                <Youtube className="h-4.5 w-4.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A44B] transition-colors" aria-label="Facebook">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              {/* Custom Pinterest Icon */}
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A44B] transition-colors" aria-label="Pinterest">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.66 2.56-.99 3.99-.28 1.18.59 2.15 1.76 2.15 2.11 0 3.73-2.23 3.73-5.44 0-2.84-2.04-4.83-4.96-4.83-3.37 0-5.36 2.53-5.36 5.15 0 1.02.39 2.11.88 2.71.1.12.11.23.08.35-.09.37-.29 1.18-.33 1.34-.05.22-.18.27-.41.16-1.53-.71-2.48-2.94-2.48-4.73 0-3.85 2.8-7.39 8.07-7.39 4.23 0 7.53 3.02 7.53 7.05 0 4.21-2.65 7.6-6.33 7.6-1.24 0-2.4-.64-2.8-1.4l-.76 2.9c-.28 1.05-1.02 2.37-1.52 3.19C8.94 23.82 10.42 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                </svg>
              </a>
              {/* WhatsApp Icon */}
              <a href="https://wa.me/919049678380" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4A44B] transition-colors" aria-label="WhatsApp">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.18 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.023-5.117-2.884-6.98-1.862-1.862-4.343-2.885-6.984-2.887-5.44 0-9.864 4.42-9.867 9.864-.001 1.73.457 3.42 1.32 4.922L1.87 22.08l4.777-1.253zM17.47 14.79c-.3-.15-1.77-.874-2.045-.974-.276-.101-.476-.15-.676.15-.2.3-.775.974-.95 1.174-.175.2-.35.226-.65.076-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.779-1.67-2.079-.175-.3-.019-.462.13-.611.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.925-2.228-.243-.585-.49-.506-.676-.516-.174-.008-.375-.01-.576-.01-.2 0-.526.075-.801.376-.275.3-1.05 1.026-1.05 2.502 0 1.477 1.075 2.903 1.225 3.103.15.2 2.115 3.23 5.124 4.53.715.31 1.273.494 1.708.633.718.228 1.37.196 1.885.12.575-.087 1.77-.724 2.02-.1385.25-.662.25-1.226.175-1.3-.075-.074-.275-.224-.575-.374z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-xs text-white/40 font-light">
              <li><Link href="/about" className="hover:text-[#D4A44B] transition-colors">Our Philosophy</Link></li>
              <li><Link href="/services" className="hover:text-[#D4A44B] transition-colors">Services & Mediums</Link></li>
              <li><Link href="/portfolio" className="hover:text-[#D4A44B] transition-colors">Visual Archive</Link></li>
              <li><Link href="/films" className="hover:text-[#D4A44B] transition-colors">Cinematic Films</Link></li>
              <li><Link href="/pricing" className="hover:text-[#D4A44B] transition-colors">Investment Tiers</Link></li>
              <li><Link href="/testimonials" className="hover:text-[#D4A44B] transition-colors">Client Reviews</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4A44B] transition-colors">Journal & Guides</Link></li>
              <li><Link href="/book" className="hover:text-[#D4A44B] transition-colors">Book Now</Link></li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white mb-6">Services</h3>
            <ul className="flex flex-col gap-3 text-xs text-white/40 font-light">
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Wedding Stories</li>
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Pre-Wedding Shoots</li>
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Cinematic Films</li>
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Destination Weddings</li>
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Corporate Events</li>
              <li className="hover:text-[#D4A44B] transition-colors cursor-pointer">Luxury Photo Albums</li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white mb-6">Contact Information</h3>
            <ul className="flex flex-col gap-4 text-xs text-white/40 font-light">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#D4A44B] shrink-0" />
                <a href="tel:+919049678380" className="hover:text-[#D4A44B] transition-colors">+91 90496 78380</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#D4A44B] shrink-0" />
                <a href="mailto:hello@shutterstories.com" className="hover:text-[#D4A44B] transition-colors">hello@shutterstories.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#D4A44B] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Luxury Studio Suite 4B,<br />
                  Colaba Causeway, Mumbai,<br />
                  MH - 400005, India
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-white/40 text-xs font-light mb-4 leading-relaxed">
              Subscribe to get premium wedding inspiration, editorial visual guides, and behind-the-scenes logs.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Shutter Stories Journal!'); }} className="flex border border-white/10 rounded-sm overflow-hidden bg-neutral-900/40 focus-within:border-[#D4A44B]/40 transition-colors">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-transparent flex-1 px-4 py-2.5 text-white text-xs placeholder-white/20 outline-none w-full"
              />
              <button type="submit" className="px-4 bg-[#D4A44B] hover:bg-[#c4943b] text-black transition-colors cursor-pointer" aria-label="Subscribe">
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.15em] text-center sm:text-left font-light">
            &copy; {currentYear} Shutter Stories. All rights reserved. Crafted for visual perfection.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-white/20">
            <Link href="/privacy" className="hover:text-[#D4A44B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#D4A44B] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

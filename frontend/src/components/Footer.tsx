'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Instagram, Youtube, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#EFE7DB] border-t border-[#5C4435]/15 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-[#C8A96B]" />
              <span className="font-editorial text-lg tracking-[0.2em] uppercase font-bold text-[#1F1F1F]">
                Shutter Stories
              </span>
            </Link>
            <p className="text-[#5C4435]/70 text-xs leading-relaxed max-w-xs mt-2">
              Every Frame Tells A Story. We craft bespoke luxury wedding documentaries and editorial visual legacies for couples globally.
            </p>
            <div className="flex items-center gap-4 mt-4 text-[#5C4435]/70">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8A96B] transition-colors">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8A96B] transition-colors">
                <Youtube className="h-4.5 w-4.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#C8A96B] transition-colors">
                <Facebook className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#1F1F1F] mb-6">Explore</h3>
            <ul className="flex flex-col gap-3.5 text-xs text-[#5C4435]/70">
              <li><Link href="/portfolio" className="hover:text-[#C8A96B] transition-colors">Our Portfolio</Link></li>
              <li><Link href="/films" className="hover:text-[#C8A96B] transition-colors">Cinematic Films</Link></li>
              <li><Link href="/services" className="hover:text-[#C8A96B] transition-colors">Photography Services</Link></li>
              <li><Link href="/pricing" className="hover:text-[#C8A96B] transition-colors">Packages & Pricing</Link></li>
              <li><Link href="/testimonials" className="hover:text-[#C8A96B] transition-colors">Client Reviews</Link></li>
            </ul>
          </div>

          {/* About/Resources Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#1F1F1F] mb-6">Stories</h3>
            <ul className="flex flex-col gap-3.5 text-xs text-[#5C4435]/70">
              <li><Link href="/about" className="hover:text-[#C8A96B] transition-colors">Our Philosophy</Link></li>
              <li><Link href="/blog" className="hover:text-[#C8A96B] transition-colors">Editorial Blog</Link></li>
              <li><Link href="/book" className="hover:text-[#C8A96B] transition-colors">Book A Consultation</Link></li>
              <li><Link href="/portal/login" className="hover:text-[#C8A96B] transition-colors">Client Portal Login</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#1F1F1F] mb-6">The Studio</h3>
            <ul className="flex flex-col gap-4 text-xs text-[#5C4435]/70">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#C8A96B] shrink-0" />
                <a href="tel:+919049678380" className="hover:text-[#C8A96B] transition-colors">+91 90496 78380</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#C8A96B] shrink-0" />
                <a href="mailto:hello@shutterstories.com" className="hover:text-[#C8A96B] transition-colors">hello@shutterstories.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <span>
                  Luxury Studio Suite 4B, Colaba Causeway,<br />
                  Mumbai, MH - 400005, India
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="border-t border-[#5C4435]/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#5C4435]/50 text-[10px] uppercase tracking-[0.15em] text-center sm:text-left">
            &copy; {currentYear} Shutter Stories. All rights reserved. Crafted for visual perfection.
          </p>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.15em] text-[#5C4435]/50">
            <Link href="/privacy" className="hover:text-[#C8A96B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C8A96B] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

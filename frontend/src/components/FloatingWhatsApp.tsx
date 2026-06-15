'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/919049678380?text=Hello%20Shutter%20Stories%2C%0AI%20would%20like%20to%20know%20more%20about%20your%20photography%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9990] flex h-14 w-14 items-center justify-center rounded-full bg-black text-[#D4AF37] border border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-110 hover:bg-[#D4AF37] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black group"
      aria-label="Contact on WhatsApp"
    >
      {/* Glow Ring */}
      <span className="absolute inset-0 rounded-full border border-[#D4AF37] opacity-0 group-hover:animate-ping group-hover:opacity-70 pointer-events-none" />
      <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" />
    </a>
  );
}

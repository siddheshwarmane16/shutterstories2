'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate sending message to photographer API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] py-32 overflow-hidden transition-colors duration-500">
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-[0.08]"
          src="https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/85 via-[var(--background)]/95 to-[var(--background)] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A96B] font-semibold">Get In Touch</span>
        <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight uppercase mt-2 mb-6 text-[var(--foreground)]">
          The Contact
        </h1>
        <p className="text-[var(--secondary-text)] text-xs tracking-wide leading-relaxed font-light">
          Whether you are planning a destination ceremony in Rajasthan or an intimate session in Europe, we’d love to co-create your visual history.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
        
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div>
            <h2 className="font-editorial text-2xl uppercase tracking-wider mb-4 text-[var(--foreground)]">The Studio Coordinates</h2>
            <p className="text-[var(--secondary-text)] text-xs leading-relaxed font-light mb-6">
              Our principal team operates from Colaba, Mumbai, but is fully mobile and travels globally for commissions.
            </p>
          </div>

          <ul className="space-y-6 text-xs text-[var(--foreground)]/85">
            <li className="flex items-center gap-4">
              <div className="h-10 w-10 border border-[var(--border-color)] rounded-full flex items-center justify-center text-[#C8A96B] shrink-0 bg-[var(--beige)]/30">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--secondary-text)]/60 text-[9px] uppercase tracking-wider font-semibold">Direct Calls</span>
                <a href="tel:+919049678380" className="hover:text-[#C8A96B] transition-colors font-medium text-[var(--foreground)]">+91 90496 78380</a>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <div className="h-10 w-10 border border-[var(--border-color)] rounded-full flex items-center justify-center text-[#C8A96B] shrink-0 bg-[var(--beige)]/30">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--secondary-text)]/60 text-[9px] uppercase tracking-wider font-semibold">Inquiries Email</span>
                <a href="mailto:hello@shutterstories.com" className="hover:text-[#C8A96B] transition-colors font-medium text-[var(--foreground)]">hello@shutterstories.com</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="h-10 w-10 border border-[var(--border-color)] rounded-full flex items-center justify-center text-[#C8A96B] shrink-0 mt-0.5 bg-[var(--beige)]/30">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[var(--secondary-text)]/60 text-[9px] uppercase tracking-wider font-semibold">Physical Location</span>
                <span className="leading-relaxed font-light text-[var(--foreground)]">
                  Luxury Studio Suite 4B, Colaba Causeway,<br />
                  Mumbai, MH - 400005, India
                </span>
              </div>
            </li>
          </ul>

          {/* Location Mock Map Box */}
          <div className="aspect-[4/3] w-full border border-[var(--border-color)] bg-[var(--beige)]/60 rounded-sm overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600"
              alt="Mumbai Studio location map mockup"
              className="w-full h-full object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-[var(--background)]/20">
              <MapPin className="h-8 w-8 text-[#C8A96B] animate-bounce" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--foreground)]">Shutter Stories Studio</span>
              <span className="text-[9px] text-[var(--secondary-text)] uppercase tracking-widest">Mumbai, Colaba</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-[var(--beige)]/40 backdrop-blur-md border border-[var(--border-color)] p-8 sm:p-12 rounded-sm relative shadow-sm">
          
          {submitted ? (
            <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
              <CheckCircle className="h-12 w-12 text-[#C8A96B] animate-pulse" />
              <h3 className="font-editorial text-2xl uppercase font-bold mt-2 text-[var(--foreground)]">Message Sent</h3>
              <p className="text-[var(--secondary-text)] text-xs leading-relaxed max-w-sm">
                Thank you! We have received your consultation query. A visual producer will contact you via email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-wider text-[#C8A96B] hover:text-[var(--foreground)] transition-colors mt-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-editorial text-2xl uppercase tracking-wider mb-6 text-[var(--foreground)]">Write Us A Message</h2>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-text)] mb-2 font-semibold">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isabella Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--background)]/85 border border-[var(--border-color)] focus:border-[#C8A96B] text-[var(--foreground)] p-4 rounded-sm text-sm focus:outline-none placeholder-[var(--secondary-text)]/45 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-text)] mb-2 font-semibold">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    placeholder="isabella@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--background)]/85 border border-[var(--border-color)] focus:border-[#C8A96B] text-[var(--foreground)] p-4 rounded-sm text-sm focus:outline-none placeholder-[var(--secondary-text)]/45 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-text)] mb-2 font-semibold">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 90496 78380"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[var(--background)]/85 border border-[var(--border-color)] focus:border-[#C8A96B] text-[var(--foreground)] p-4 rounded-sm text-sm focus:outline-none placeholder-[var(--secondary-text)]/45 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[var(--secondary-text)] mb-2 font-semibold">Inquiry Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail your celebration scale, schedules, specific ideas..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[var(--background)]/85 border border-[var(--border-color)] focus:border-[#C8A96B] text-[var(--foreground)] p-4 rounded-sm text-sm focus:outline-none placeholder-[var(--secondary-text)]/45 transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] hover:bg-[#C8A96B] hover:text-black font-bold py-4 px-8 rounded-sm transition-all flex items-center gap-2 group cursor-pointer border border-[var(--foreground)] hover:border-[#C8A96B]"
                >
                  {submitting ? 'Transmitting...' : 'Send Message'}{' '}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
    </div>
  );
}

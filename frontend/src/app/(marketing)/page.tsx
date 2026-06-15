'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  ArrowRight, 
  Play, 
  Star, 
  Sparkles, 
  Instagram, 
  Send, 
  Check, 
  Award, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Calendar,
  Layers,
  Heart,
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';
import { api } from '@/utils/api';
import ThreeBackground from '@/components/ThreeBackground';
import confetti from 'canvas-confetti';

export default function Home() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  
  // Video Reel Trailer State
  const [isPlayingReel, setIsPlayingReel] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [packageType, setPackageType] = useState('Luxury Wedding Stories');
  const [message, setMessage] = useState('');
  
  // Form Status
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Scroll to booking form
  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const portRes = await api.getPortfolio();
        setPortfolio(portRes);

        const testRes = await api.getTestimonials();
        setTestimonials(testRes);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      }
    };
    loadData();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !message.trim() || !venue.trim()) {
      setBookingError('Please fill in all booking credentials.');
      return;
    }

    setBookingSubmitting(true);
    setBookingError('');

    try {
      await api.createBooking({
        eventType: packageType,
        date,
        location: venue,
        requirements: `Package: ${packageType}. Message: ${message}`,
        contactName: name,
        contactEmail: `${name.toLowerCase().replace(/\s+/g, '')}@shutterstories.com`, // Auto-generated email fallback
        contactPhone: phone,
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#C8A96B', '#EFE7DB', '#5C4435'],
      });

      setBookingSuccess(true);
      setName('');
      setPhone('');
      setDate('');
      setVenue('');
      setMessage('');
    } catch (err: any) {
      setBookingError(err.message || 'Failed to submit inquiry.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Fallback items if database is clean
  const fallbackPortfolio = [
    { id: 'p1', title: 'The Udaipur Palace Nuptials', category: 'Wedding', mediaUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', mediaType: 'IMAGE', description: 'Editorial fine-art capture under a canopy of roses at Taj Lake Palace.' },
    { id: 'p2', title: 'Romantic Shadows in Milan', category: 'Pre-Wedding', mediaUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', mediaType: 'IMAGE', description: 'Pre-wedding documentary session in front of the Milan Cathedral.' },
    { id: 'p3', title: 'Sacred Vows Cinematic Loop', category: 'Films', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4', mediaType: 'VIDEO', description: 'Slow-motion video highlighting the emotional wedding vows.' },
    { id: 'p4', title: 'Seine River Proposal', category: 'Destination', mediaUrl: 'https://images.unsplash.com/photo-1519225495810-7517c24a2ed3?w=800', mediaType: 'IMAGE', description: 'Surprise proposal documentary session shot in Paris, France.' }
  ];

  const currentPortfolio = portfolio.length > 0 ? portfolio : fallbackPortfolio;
  
  const fallbackTestimonials = [
    { clientName: 'Aishwarya & Rohan', clientRole: 'Udaipur Palace Wedding', reviewText: 'Shutter Stories did not just take photos; they created cinematic history for our family. Every frame looks like a high-fashion Vogue editorial.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4' },
    { clientName: 'Meera & Dev', clientRole: 'Lake Como Story', reviewText: 'We cried watching our pre-wedding cinematic film! They managed to capture the poetry in our relationship. Truly outstanding team.', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4' }
  ];

  const currentTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  // Instagram Wall photos
  const instaPhotos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500'
  ];

  return (
    <div className="relative min-h-screen bg-[#F7F2EA] text-[#1F1F1F] overflow-hidden">
      
      {/* Three.js Particles adapted to soft gold motes */}
      <ThreeBackground />

      {/* SECTION 1: Luxury Hero */}
      <section className="relative h-[100vh] grid grid-cols-1 lg:grid-cols-12 items-center overflow-hidden border-b border-[#5C4435]/10 bg-[#EFE7DB]/30">
        
        {/* Fullscreen Video Underlay with Soft Ivory overlay */}
        <div className="absolute inset-0 z-0 bg-[#F7F2EA]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-35"
            src="https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F2EA] via-[#F7F2EA]/70 to-[#F7F2EA]/10 z-10 pointer-events-none" />
        </div>

        {/* Left Column: Editorial Heading */}
        <div className="relative z-20 lg:col-span-7 px-8 sm:px-16 flex flex-col justify-center gap-8 h-full">
          <div className="max-w-2xl mt-16 lg:mt-0">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold block mb-4">
              EDITORIAL WEDDING & CINEMATIC FILMS
            </span>
            
            <h1 className="font-editorial text-4xl sm:text-7xl lg:text-[100px] xl:text-[120px] font-bold tracking-tight text-[#1A1A1A] leading-[1.0] uppercase">
              CAPTURING MOMENTS.<br />
              <span className="text-[#C8A96B] font-editorial italic font-normal tracking-wide lowercase block mt-1">
                creating legacies.
              </span>
            </h1>
            
            <p className="text-[#6D6D6D] text-xs sm:text-sm tracking-[0.2em] uppercase mt-6 max-w-xl font-light leading-relaxed">
              Luxury wedding photography and cinematic films for destination celebrations.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              href="/portfolio"
              className="text-[10px] uppercase tracking-[0.25em] bg-[#1A1A1A] text-[#F7F2EA] font-semibold py-4.5 px-10 rounded-sm hover:bg-[#C8A96B] hover:text-[#1A1A1A] transition-all shadow-md"
            >
              View Portfolio
            </Link>
            <button
              onClick={scrollToBooking}
              className="text-[10px] uppercase tracking-[0.25em] bg-transparent text-[#1A1A1A] border border-[#E5D8C5] hover:border-[#C8A96B] hover:text-[#C8A96B] font-semibold py-4.5 px-10 rounded-sm transition-all"
            >
              Book Consultation
            </button>
          </div>
        </div>

        {/* Right Column: Large Wedding Photograph & Video Reel Preview */}
        <div className="relative z-20 lg:col-span-5 h-full hidden lg:flex items-center justify-center pr-12">
          <div className="relative w-full aspect-[4/5] max-w-md overflow-hidden rounded-sm border border-[#E5D8C5] shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
              alt="Luxury Wedding Portrait"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103 animate-reveal"
            />
            <div className="absolute inset-0 bg-[#EFE7DB]/10 group-hover:bg-transparent transition-all duration-700" />
            
            {/* Reel Video Loop Popup Trigger */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlayingReel(true)}
                className="h-16 w-16 bg-[#F7F2EA]/90 border border-[#C8A96B]/50 rounded-full flex items-center justify-center text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#F7F2EA] transition-all shadow-2xl scale-95 group-hover:scale-105 cursor-pointer"
                title="Play Reel Trailer"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </button>
            </div>

            {/* Float Badge - Watch Reel CTA */}
            <div className="absolute bottom-6 left-6 bg-[#F7F2EA]/90 backdrop-blur-md px-4 py-2 border border-[#E5D8C5] rounded-sm">
              <span className="text-[8px] uppercase tracking-[0.3em] font-semibold text-[#C8A96B] block">
                WATCH REEL
              </span>
              <span className="text-[10px] font-editorial italic text-[#1A1A1A] block font-bold mt-0.5">
                Cinematic Wedding Reel &bull; 02:45
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 2: Category Showcase */}
      <section className="py-32 relative overflow-hidden bg-[#EFE7DB]/30 border-b border-[#E5D8C5]">
        <div className="text-center mb-20 px-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">THE GALLERIES</span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#1A1A1A] mt-3">
            Category Showcase
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96B] mx-auto mt-4" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Wedding Stories', tag: 'Luxury Nuptials', href: '/portfolio', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800' },
            { num: '02', title: 'Pre-Wedding Shoots', tag: 'Love Stories', href: '/portfolio', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800' },
            { num: '03', title: 'Cinematic Films', tag: 'Anamorphic Documentaries', href: '/films', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800' },
            { num: '04', title: 'Destination Weddings', tag: 'Worldwide Coverage', href: '/portfolio', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800' },
            { num: '05', title: 'Corporate Events', tag: 'Brand Narratives', href: '/portfolio', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800' },
            { num: '06', title: 'Luxury Albums', tag: 'Italian Leather Books', href: '/services', img: 'https://images.unsplash.com/photo-1519225495810-7517c24a2ed3?w=800' }
          ].map((cat, idx) => {
            return (
              <Link
                key={idx}
                href={cat.href}
                className="relative h-[420px] rounded-sm group overflow-hidden border border-[#E5D8C5] flex flex-col justify-between p-8 shadow-sm transition-all duration-700 cursor-pointer"
              >
                {/* Gold border line animation on hover */}
                <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-[#C8A96B] group-hover:w-full transition-all duration-700 z-20" />
                <div className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-[#C8A96B] group-hover:w-full transition-all duration-700 z-20" />
                <div className="absolute top-0 right-0 w-[1.5px] h-0 bg-[#C8A96B] group-hover:h-full transition-all duration-700 z-20" />
                <div className="absolute bottom-0 left-0 w-[1.5px] h-0 bg-[#C8A96B] group-hover:h-full transition-all duration-700 z-20" />

                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/20 to-transparent z-10" />
                </div>

                {/* Top: Luxury Numbering */}
                <div className="relative z-20 flex justify-between items-start">
                  <span className="font-editorial text-4xl italic text-[#C8A96B] opacity-75 group-hover:opacity-100 transition-opacity">
                    {cat.num}
                  </span>
                </div>

                {/* Bottom: Card Content */}
                <div className="relative z-20 flex flex-col gap-1.5">
                  <span className="text-[8px] uppercase tracking-[0.3em] text-[#C8A96B] font-bold">
                    {cat.tag}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#F7F2EA] uppercase tracking-wide">
                    {cat.title}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-[#C8A96B] group-hover:text-[#F7F2EA] transition-colors mt-2">
                    Explore Card <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: About Story */}
      <section className="py-32 relative overflow-hidden bg-[#F7F2EA] border-b border-[#E5D8C5]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">OUR HERITAGE</span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#1A1A1A] leading-tight">
                EVERY FRAME TELLS A STORY
              </h2>
              <div className="w-16 h-[1px] bg-[#C8A96B] my-2" />
              
              <p className="text-[#6D6D6D] text-xs sm:text-sm leading-relaxed tracking-wider font-light">
                Inspired by the editorial symmetry of high-end magazines and Vogue photography, we document families, love, and architecture. We do not work on simple portfolios; we build emotional heirlooms that last generations.
              </p>
              <p className="text-[#6D6D6D] text-xs sm:text-sm leading-relaxed tracking-wider font-light">
                From remote cliffs in southern Italy to majestic palace halls in Udaipur, our global team captures candid raw feelings and grand configurations with cinema-grade instruments.
              </p>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#E5D8C5] text-center">
                <div>
                  <Award className="h-5 w-5 text-[#C8A96B] mx-auto mb-2" />
                  <span className="block text-xl font-editorial font-bold text-[#1A1A1A]">12+ Awards</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#6D6D6D] block mt-0.5">National Fine-Art</span>
                </div>
                <div>
                  <Clock className="h-5 w-5 text-[#C8A96B] mx-auto mb-2" />
                  <span className="block text-xl font-editorial font-bold text-[#1A1A1A]">8 Years</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#6D6D6D] block mt-0.5">Studio Experience</span>
                </div>
                <div>
                  <Users className="h-5 w-5 text-[#C8A96B] mx-auto mb-2" />
                  <span className="block text-xl font-editorial font-bold text-[#1A1A1A]">500+ Clients</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#6D6D6D] block mt-0.5">Delighted Couples</span>
                </div>
                <div>
                  <Globe className="h-5 w-5 text-[#C8A96B] mx-auto mb-2" />
                  <span className="block text-xl font-editorial font-bold text-[#1A1A1A]">Worldwide</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#6D6D6D] block mt-0.5">Destinations Covered</span>
                </div>
              </div>
            </div>

            {/* Right BTS Photo inside a Luxury Editorial Frame container */}
            <div className="border border-[#E5D8C5] p-3 bg-[#EFE7DB]/40 rounded-sm shadow-xl transition-all duration-700 hover:shadow-2xl">
              <div className="relative group aspect-[4/5] overflow-hidden rounded-sm shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800"
                  alt="Behind The Scenes Filmmaking"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-102 group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F7F2EA] via-transparent to-transparent z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Featured Films */}
      <section className="py-32 relative overflow-hidden bg-[#EFE7DB]/30 border-b border-[#E5D8C5]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold block mb-2">CINEMATOGRAPHY</span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#1A1A1A]">
                Featured Films
              </h2>
            </div>
            <Link
              href="/films"
              className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-[#C8A96B] hover:text-[#1A1A1A] font-bold transition-all border-b border-[#C8A96B] pb-1.5"
            >
              View All Films
            </Link>
          </div>

          {/* Horizontal Film gallery */}
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-none snap-x snap-mandatory">
            {[
              { title: 'The Royal Legacy Taj Udaipur', desc: 'Meera & Dev’s grand palatial celebration.', url: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4', loc: 'Udaipur, India', dur: '12 Min Film', poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
              { title: 'Italian Shadows at Como', desc: 'Sophia & Liam’s fashion editorial pre-wedding.', url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4', loc: 'Lake Como, Italy', dur: '8 Min Film', poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600' },
              { title: 'Beachside Symphonies Goa', desc: 'Pooja & Kabir’s sunset sand ceremony.', url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40081-large.mp4', loc: 'Goa, India', dur: '10 Min Film', poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600' }
            ].map((film, idx) => (
              <div
                key={idx}
                onClick={() => setActiveVideoUrl(film.url)}
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
                className="w-[320px] sm:w-[480px] shrink-0 snap-start group cursor-pointer relative aspect-video overflow-hidden rounded-sm border border-[#E5D8C5] bg-neutral-950 shadow-lg hover:border-[#C8A96B] hover:shadow-[0_0_25px_rgba(200,169,107,0.35)] transition-all duration-500"
              >
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-[#1A1A1A]/40 group-hover:bg-[#1A1A1A]/10 transition-all z-10 duration-500" />
                
                {/* Poster Cover Image */}
                <img
                  src={film.poster}
                  alt={film.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 pointer-events-none group-hover:opacity-0"
                />

                {/* Auto Preview Video on Hover */}
                <video
                  src={film.url}
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-103 transition-all duration-700 pointer-events-none"
                />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="h-12 w-12 bg-[#F7F2EA]/95 border border-[#C8A96B]/30 rounded-full flex items-center justify-center text-[#C8A96B] group-hover:bg-[#C8A96B] group-hover:text-[#F7F2EA] transition-all scale-95 group-hover:scale-105 shadow-xl">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </span>
                </div>

                {/* Details Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end bg-[#F7F2EA]/90 backdrop-blur-md p-3.5 border border-[#E5D8C5] rounded-sm">
                  <div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#C8A96B] font-bold block">{film.dur} &bull; {film.loc}</span>
                    <span className="text-[10px] font-bold text-[#1A1A1A] block mt-0.5 line-clamp-1">{film.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Statistics Counter Row */}
      <section className="py-20 relative overflow-hidden bg-[#EFE7DB] border-b border-[#E5D8C5] flex items-center justify-center">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center items-start">
            {[
              { val: '1000+', label: 'Happy Clients', icon: Users },
              { val: '500+', label: 'Weddings Covered', icon: Camera },
              { val: '150+', label: 'Cinematic Films', icon: Film },
              { val: '50+', label: 'Destination Weddings', icon: Globe },
              { val: 'Award', label: 'Winning Team', icon: Award }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 bg-[#F7F2EA]/80 border border-[#C8A96B]/20 rounded-full flex items-center justify-center text-[#C8A96B] mb-1 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-editorial text-[#C8A96B] leading-none">{stat.val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#6D6D6D] font-light max-w-[120px]">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: Testimonials */}
      <section className="py-32 relative overflow-hidden border-b border-[#E5D8C5] bg-[#F7F2EA]">
        <div className="text-center mb-20 px-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold">KIND WORDS</span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#1A1A1A] mt-3">
            Client Stories
          </h2>
          <div className="w-12 h-[1px] bg-[#C8A96B] mx-auto mt-4" />
        </div>

        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {currentTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 sm:p-10 rounded-sm border border-[#E5D8C5] flex flex-col justify-between hover:border-[#C8A96B] transition-all duration-500 shadow-lg relative bg-[#F7F2EA]/90 backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-1 text-[#C8A96B]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#C8A96B] stroke-none" />
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#6D6D6D] bg-[#EFE7DB] px-2.5 py-1 rounded-sm font-semibold border border-[#E5D8C5]">
                    Google Review
                  </span>
                </div>
                <p className="font-editorial text-base italic leading-relaxed text-[#1A1A1A]/95 mb-8">
                  "{t.reviewText}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#E5D8C5] pt-6 mt-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={t.clientName}
                    className="h-10 w-10 rounded-full object-cover border border-[#C8A96B]/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">{t.clientName}</h4>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#C8A96B] mt-0.5">{t.clientRole}</p>
                  </div>
                </div>

                {t.videoUrl && (
                  <button
                    onClick={() => setActiveVideoUrl(t.videoUrl)}
                    className="h-9 w-9 bg-[#C8A96B]/15 border border-[#C8A96B]/30 text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#F7F2EA] rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title="Play Video Review"
                  >
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Instagram Gallery */}
      <section className="py-32 relative overflow-hidden border-b border-[#E5D8C5] bg-[#EFE7DB]/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold block mb-2">VOGUE DIARIES</span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#1A1A1A]">
              Instagram Gallery
            </h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6D6D6D] mt-2 block">
              @shutterstories &bull; LIVE EDITORIAL FEED
            </span>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F7F2EA] font-semibold py-3 px-8 rounded-sm hover:bg-[#C8A96B] hover:text-[#1A1A1A] transition-all self-start"
          >
            Follow Us
          </a>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-2 md:grid-cols-6 gap-4">
          {instaPhotos.map((url, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="relative aspect-square group overflow-hidden rounded-sm border border-[#E5D8C5] shadow-sm block"
            >
              <img
                src={url}
                alt={`Instagram Post ${idx + 1}`}
                className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-transparent transition-colors pointer-events-none" />
              <div className="absolute inset-0 border border-transparent group-hover:border-[#C8A96B]/40 pointer-events-none transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="h-6 w-6 text-[#1A1A1A] bg-[#F7F2EA]/90 p-1.5 rounded-full border border-[#C8A96B]/30" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 8: Booking Experience */}
      <section id="booking-section" className="relative py-40 overflow-hidden flex items-center justify-center bg-stone-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600"
            alt="Luxury Wedding Venue"
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A]/40 to-[#1A1A1A] pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-2xl px-6">
          <div className="glass-panel p-8 sm:p-12 border border-[#C8A96B]/30 rounded-sm shadow-2xl relative bg-[#F7F2EA]/95 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A96B] font-bold text-center block mb-3">RESERVATIONS</span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold uppercase text-[#1A1A1A] tracking-tight text-center mb-8">
              Book Consultation
            </h2>

            {bookingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-sm mb-6">
                {bookingError}
              </div>
            )}

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 bg-[#C8A96B]/10 border border-[#C8A96B] text-[#C8A96B] rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-editorial text-xl font-bold text-[#1A1A1A] mb-2">Reservation Submitted</h4>
                <p className="text-[#6D6D6D] text-xs leading-relaxed max-w-sm mx-auto">
                  Our director will review your event parameters and contact you on WhatsApp shortly. Access details are provisioned in your portal!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6 text-[#1A1A1A]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sophia & Liam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#EFE7DB]/60 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90496 78380"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#EFE7DB]/60 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#EFE7DB]/60 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">Event Venue</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Udaipur, Como"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full bg-[#EFE7DB]/60 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">Package Select</label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value)}
                      className="w-full bg-[#EFE7DB] border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none transition-colors"
                    >
                      <option value="Luxury Wedding Stories">Wedding Stories</option>
                      <option value="Pre-Wedding Cinematic Films">Pre-Wedding Shoots</option>
                      <option value="Cinematic Films">Cinematic Films</option>
                      <option value="Destination Weddings">Destination Weddings</option>
                      <option value="Corporate Events">Corporate Events</option>
                      <option value="Luxury Albums">Luxury Albums</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.25em] text-[#6D6D6D] mb-2 font-bold">Requirements Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your wedding details, guest count, style preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#EFE7DB]/60 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-xs focus:outline-none placeholder-[#6D6D6D]/45 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full text-xs uppercase tracking-[0.25em] bg-[#C8A96B] text-[#F7F2EA] font-semibold py-4 rounded-sm shadow-md hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {bookingSubmitting ? 'Submitting...' : 'Book Now'} <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Cinematic Video Player Modal */}
      {activeVideoUrl && (
        <div
          className="fixed inset-0 bg-black/99 z-[9999] flex items-center justify-center p-6"
          onClick={() => setActiveVideoUrl(null)}
        >
          <button
            onClick={() => setActiveVideoUrl(null)}
            className="absolute top-6 right-6 h-12 w-12 bg-[#F7F2EA] text-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#C8A96B] font-bold text-xl shadow-2xl cursor-pointer"
            title="Close Player"
          >
            &times;
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-[#C8A96B]/20" onClick={(e) => e.stopPropagation()}>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Reel Trailer Modal */}
      {isPlayingReel && (
        <div
          className="fixed inset-0 bg-black/99 z-[9999] flex items-center justify-center p-6"
          onClick={() => setIsPlayingReel(false)}
        >
          <button
            onClick={() => setIsPlayingReel(false)}
            className="absolute top-6 right-6 h-12 w-12 bg-[#F7F2EA] text-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#C8A96B] font-bold text-xl shadow-2xl cursor-pointer"
            title="Close Player"
          >
            &times;
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-[#C8A96B]/20" onClick={(e) => e.stopPropagation()}>
            <video
              src="https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

    </div>
  );
}

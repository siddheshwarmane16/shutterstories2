'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Camera, Play, Volume2, VolumeX, Instagram, Youtube, Facebook,
  ArrowRight, Star, Check, Award, Clock, MapPin, Users, Globe,
  Send, ChevronLeft, ChevronRight, Sparkles, Film, Image as ImageIcon, Heart, ZoomIn, X, Info
} from 'lucide-react';
import { api } from '@/utils/api';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const GOLD = '#D4A44B';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  
  // Booking Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [eventType, setEventType] = useState('Luxury Wedding Stories');
  const [venue, setVenue] = useState('');
  const [packageType, setPackageType] = useState('Premium Wedding Package');
  const [message, setMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  
  // Stats counter state
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Dynamic CMS State
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [packages, setPackages] = useState<any[]>([]);
  const [films, setFilms] = useState<any[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  // Lightbox gallery
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  // Mouse parallax state for Hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Scroll progress bar
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch dynamic database CMS contents
  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const portRes = await api.getPortfolio();
        setPortfolioItems(portRes);
        
        // Filter videos for the Netflix-style cinema gallery
        const videoFilms = portRes.filter((item: any) => item.mediaType === 'VIDEO');
        setFilms(videoFilms);

        const catRes = await api.getCategories();
        setCategories(catRes);

        const packRes = await api.getPackages();
        setPackages(packRes);
      } catch (err) {
        console.error('Failed to pre-fetch homepage CMS details:', err);
      } finally {
        setLoadingPortfolio(false);
      }
    };
    fetchCMSData();
  }, []);

  // Scroll progress tracker
  useEffect(() => {
    const handleScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % 3);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Animated count-up observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const targets = [1000, 500, 150, 50];
          targets.forEach((target, i) => {
            let start = 0;
            const step = target / 60;
            const timer = setInterval(() => {
              start += step;
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.min(Math.floor(start), target);
                return next;
              });
              if (start >= target) clearInterval(timer);
            }, 18);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse movement parallax hook
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) * 0.015;
      const y = (clientY - window.innerHeight / 2) * 0.015;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync mute state to video
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !venue || !message) {
      setBookingError('Please fill in all fields.');
      return;
    }
    setBookingSubmitting(true);
    setBookingError('');
    try {
      // Find package ID matching select input if exists, or default to Gold
      const matchedPkg = packages.find((p) => p.name === 'Gold' || p.name === 'Premium') || packages[0];
      const packageId = matchedPkg?.id || '';

      await api.createBooking({
        eventType,
        date,
        location: venue,
        packageId,
        requirements: `Selected Package: ${packageType}. ${message}`,
        contactName: name,
        contactEmail: `${name.toLowerCase().replace(/\s+/g, '')}@guest.com`,
        contactPhone: phone,
      });

      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 }, colors: ['#D4A44B', '#ffffff', '#c4943b'] });
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message || 'Submission failed. Try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = `Hello Shutter Stories! I have submitted a booking inquiry.\n\n*Name*: ${name}\n*Phone*: ${phone}\n*Date*: ${date}\n*Event*: ${eventType}\n*Venue*: ${venue}\n*Package*: ${packageType}\n*Message*: ${message}`;
    return `https://wa.me/919049678380?text=${encodeURIComponent(text)}`;
  };

  const staticServices = [
    { num: '01', title: 'Wedding Stories', tag: 'Luxury Nuptials', href: '/services', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700' },
    { num: '02', title: 'Pre-Wedding Shoots', tag: 'Love Stories', href: '/services', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700' },
    { num: '03', title: 'Cinematic Films', tag: 'Anamorphic Capture', href: '/films', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=700' },
    { num: '04', title: 'Destination Weddings', tag: 'Worldwide commissions', href: '/portfolio', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=700' },
    { num: '05', title: 'Corporate Events', tag: 'Luxury Narratives', href: '/services', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700' },
    { num: '06', title: 'Luxury Albums', tag: 'Italian Leather Bound', href: '/services', img: 'https://images.unsplash.com/photo-1519225495810-7517c24a2ed3?w=700' },
  ];

  const fallbackFilms = [
    { title: 'The Royal Affair', loc: 'Udaipur, India', dur: '10 Min Film', url: 'https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4', poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
    { title: 'Whispers in Milan', loc: 'Milan, Italy', dur: '4 Min Story', url: 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-in-a-forest-41615-large.mp4', poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600' },
    { title: 'A Coastal Symphony', loc: 'Goa, India', dur: '8 Min Film', url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-40081-large.mp4', poster: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600' },
    { title: 'Grand Opening Piano Theme', loc: 'Mumbai, India', dur: '3 Min Commercial', url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-piano-player-in-a-suit-40078-large.mp4', poster: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600' }
  ];

  const homepageFilms = films.length > 0 ? films.map((item: any) => ({
    title: item.title,
    loc: item.description || 'Destination Commission',
    dur: 'Cinematic Reel',
    url: item.mediaUrl,
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'
  })) : fallbackFilms;

  const filteredPortfolio = portfolioItems
    .filter((item: any) => item.mediaType === 'IMAGE') // only show image photos on main grid
    .filter((item: any) => {
      if (!activeCategory) return true;
      return item.category?.slug === activeCategory;
    })
    .slice(0, 6); // show top 6 on homepage

  const homepageTestimonials = [
    { name: 'Aishwarya & Rohan', role: 'Udaipur Palace Wedding', text: 'Shutter Stories did not just take photos — they created cinematic history for our family. Every frame looks like a Vogue editorial. The team was completely unobtrusive.', rating: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { name: 'Meera & Dev', role: 'Lake Como Destination', text: 'We cried watching our cinematic film. They captured the absolute poetry in our relationship. A genuinely world-class filmmaking experience.', rating: 5, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { name: 'Sophia & Liam', role: 'Taj Fateh Prakash Palace', text: 'From booking to downloading high-res sneak peeks on the client portal, everything was seamless and premium. The photos are timeless treasures.', rating: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  ];

  const homepagePackages = [
    { name: 'Essential Plan', price: 150000, desc: 'Luxury photography coverage for intimate ceremonies and editorial visual stories.', highlights: ['1 Lead Photographer', '8 Hours Coverage', '150 Retouched Photos', 'Online Gallery Access'], popular: false },
    { name: 'Premium Package', price: 350000, desc: 'The perfect cinematic and editorial balance for standard grand celebrations.', highlights: ['2 Senior Photographers', '2 Cinematic Filmmakers', '4k Aerial Drone Shots', 'Layflat Storybook Album'], popular: true },
    { name: 'Luxury Commission', price: 600000, desc: 'The ultimate editorial visual legacy package. No limits, absolute luxury storytelling.', highlights: ['3 Editorial Photographers', '3 Filmmakers', 'Multi-day coverage', 'Custom Leather Bound Album'], popular: false },
    { name: 'Destination Bespoke', price: 0, desc: 'Bespoke worldwide visual commissions tailored completely to your coordinates.', highlights: ['Bespoke Crew Sizes', 'Travel logistics handled', 'Custom Color Gradings', 'Pre-wedding story sessions'], popular: false },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors duration-500">
      
      {/* Scroll Progress Indicator Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-[#D4A44B] origin-left z-[9999]"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* ============================================
          HERO SECTION - Fullscreen Cinematic Video
          ============================================ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        {/* Background Video */}
        <video
          ref={heroVideoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          src="https://assets.mixkit.co/videos/preview/mixkit-newlyweds-slow-dancing-in-a-hallway-with-glowing-lights-40089-large.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-black/35 z-0" />

        {/* Center Content with mouse parallax */}
        <motion.div
          style={{ x: mousePos.x, y: mousePos.y }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#D4A44B] font-semibold">
            Editorial Wedding & Cinematic Films
          </span>

          {/* Camera Icon logo details */}
          <div className="w-10 h-10 rounded-full border border-[#D4A44B]/40 flex items-center justify-center">
            <Camera className="w-4 h-4 text-[#D4A44B]" />
          </div>

          <h1 className="font-editorial font-bold tracking-tight leading-none uppercase">
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
              CAPTURING MOMENTS.
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#D4A44B] italic font-light lowercase mt-2">
              creating legacies.
            </span>
          </h1>

          <p className="text-white/60 text-sm font-light tracking-wider max-w-md">
            Luxury wedding photography and cinematic films for destination celebrations worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/portfolio"
              className="text-[10px] uppercase tracking-[0.3em] bg-[#D4A44B] text-black font-bold py-3.5 px-8 hover:bg-[#c4943b] transition-all"
            >
              View Portfolio
            </Link>
            <button
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[10px] uppercase tracking-[0.3em] border border-white/40 text-white py-3.5 px-8 hover:border-[#D4A44B] hover:text-[#D4A44B] transition-all font-light"
            >
              Book Consultation
            </button>
          </div>
        </motion.div>

        {/* Mute Toggle (bottom left) */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-8 left-8 z-20 flex items-center gap-2 text-white/60 hover:text-white text-[9px] uppercase tracking-[0.2em] transition-colors focus:outline-none cursor-pointer"
        >
          {isMuted
            ? <VolumeX className="h-4 w-4 text-[#D4A44B]" />
            : <Volume2 className="h-4 w-4 text-[#D4A44B]" />}
          {isMuted ? 'Unmute Preview' : 'Mute Sound'}
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none">
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-light">Scroll To Explore</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-[#D4A44B] rounded-full animate-bounce" />
          </div>
        </div>

        {/* Floating Social Icons (right edge) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4 select-none">
          <div className="w-px h-16 bg-white/20" />
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#D4A44B] transition-colors">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#D4A44B] transition-colors">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#D4A44B] transition-colors">
            <Facebook className="h-4 w-4" />
          </a>
          <div className="w-px h-16 bg-white/20" />
          <span className="text-[7px] uppercase tracking-[0.35em] text-white/30 font-light" style={{ writingMode: 'vertical-rl' }}>Follow Us</span>
        </div>
      </section>

      {/* ============================================
          SERVICES SHOWCASE SECTION
          ============================================ */}
      <section className="bg-[var(--beige)] border-y border-[var(--border-color)] py-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {staticServices.map((svc, idx) => (
            <Link
              key={idx}
              href={svc.href}
              className="relative group flex flex-col overflow-hidden border-r border-[var(--border-color)] last:border-r-0 bg-[var(--beige)]"
            >
              {/* Top metadata */}
              <div className="px-5 pt-6 pb-4 text-[var(--foreground)] flex flex-col gap-1 min-h-[100px] border-b border-[var(--border-color)] z-10 bg-[var(--beige)]">
                <span className="text-[#D4A44B] font-editorial text-2xl italic font-light">{svc.num}</span>
                <h3 className="font-bold text-[11px] uppercase tracking-wider leading-tight text-[var(--foreground)]">{svc.title}</h3>
                <span className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.2em] text-[#D4A44B] font-semibold mt-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-2.5 w-2.5" />
                </span>
              </div>

              {/* Image */}
              <div className="relative h-52 sm:h-64 overflow-hidden">
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================
          ABOUT SECTION
          ============================================ */}
      <section className="py-24 relative z-10 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Story Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-6"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold">Our Philosophy</span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-[var(--foreground)] leading-tight">
              Every Frame<br />Tells A Story
            </h2>
            <p className="text-[var(--secondary-text)] text-xs sm:text-sm leading-relaxed font-light max-w-md">
              We are a team of global wedding photographers, filmmakers & visual directors. We believe in capturing the raw sigh, the tear caught on an eyelash, and translating authentic celebrations into high-fashion editorial legacies.
            </p>
            <ul className="grid grid-cols-2 gap-3.5 mt-2">
              {[
                { text: 'Award Winning Team', icon: Award },
                { text: '5+ Years of Experience', icon: Clock },
                { text: '1000+ Happy Clients', icon: Users },
                { text: 'Available Worldwide', icon: Globe }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-[var(--foreground)] font-light">
                  <Check className="h-4 w-4 text-[#D4A44B] shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] bg-[#D4A44B] text-black font-bold py-3.5 px-8 hover:bg-[#c4943b] transition-all self-start mt-4"
            >
              Know Our Story
            </Link>
          </motion.div>

          {/* Right: Large cinematic image with parallax scale */}
          <div className="relative h-[440px] lg:h-[560px] overflow-hidden rounded-sm border border-[var(--border-color)] shadow-2xl group">
            <img
              src="/images/about_bts.png"
              alt="Behind The Scenes Visual Director"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A44B] font-semibold">Active Crew Setup</span>
              <h4 className="font-editorial text-lg text-white uppercase font-bold mt-1">Taj Aravali Palace, Udaipur</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATISTICS SECTION
          ============================================ */}
      <section ref={statsRef} className="bg-[var(--beige)] border-y border-[var(--border-color)] py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {[
            { val: '1000+', countIndex: 0, label: 'Happy Clients', icon: Users },
            { val: '500+', countIndex: 1, label: 'Weddings Covered', icon: Camera },
            { val: '150+', countIndex: 2, label: 'Cinematic Films', icon: Film },
            { val: '50+', countIndex: 3, label: 'Destination Weddings', icon: Globe },
            { val: 'Award', countIndex: -1, label: 'Winning Team', icon: Award },
          ].map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 justify-center lg:justify-start">
                <div className="h-10 w-10 border border-[#D4A44B]/20 rounded-full flex items-center justify-center bg-[var(--background)] shadow-sm">
                  <Icon className="h-4.5 w-4.5 text-[#D4A44B] stroke-[1.5]" />
                </div>
                <div>
                  <span className="block text-2xl font-editorial font-bold text-[var(--foreground)]">
                    {st.countIndex !== -1 ? `${counts[st.countIndex]}+` : st.val}
                  </span>
                  <span className="block text-[8px] uppercase tracking-[0.25em] text-[var(--secondary-text)] mt-0.5 font-light">{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================
          CINEMATIC FILMS SECTION - Netflix-Style
          ============================================ */}
      <section className="bg-black py-24 overflow-hidden border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
            
            {/* Left Description Panel */}
            <div className="flex flex-col gap-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold">Cinematic Films</span>
              <h2 className="font-editorial text-4xl lg:text-5xl font-bold uppercase text-white leading-tight">
                Watch Our Latest Films
              </h2>
              <p className="text-white/40 text-xs font-light leading-relaxed">
                Experience high-fashion cinematic trailers shot on anamorphic camera configurations. Hover over cards for soundless previews.
              </p>
              <Link
                href="/films"
                className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] border border-white/30 text-white py-3 px-6 hover:border-[#D4A44B] hover:text-[#D4A44B] transition-all self-start font-light mt-2"
              >
                View All Films <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Right Panel: Netflix horizontal scroll slider */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory pt-2">
              {homepageFilms.map((film, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveVideo(film.url)}
                  onMouseEnter={(e) => {
                    const v = e.currentTarget.querySelector('video');
                    if (v) v.play().catch(() => {});
                  }}
                  onMouseLeave={(e) => {
                    const v = e.currentTarget.querySelector('video');
                    if (v) { v.pause(); v.currentTime = 0; }
                  }}
                  className="w-[240px] sm:w-[280px] shrink-0 snap-start group cursor-pointer relative"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-white/10 bg-neutral-900 shadow-2xl">
                    <img src={film.poster} alt={film.title} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-700" />
                    <video src={film.url} loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-300 z-10" />
                    
                    {/* Floating Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <span className="h-12 w-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white group-hover:bg-[#D4A44B] group-hover:border-[#D4A44B] transition-all group-hover:scale-110">
                        <Play className="h-4.5 w-4.5 fill-current ml-0.5" />
                      </span>
                    </div>

                    {/* Badge duration */}
                    <span className="absolute top-4 right-4 z-20 text-[8px] uppercase tracking-wider bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10 text-white font-semibold">
                      {film.dur}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                      <span className="text-[#D4A44B] font-semibold">{film.loc}</span>
                    </div>
                    <span className="text-sm font-semibold text-white truncate">{film.title}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          PORTFOLIO SHOWCASE MASONRY
          ============================================ */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border-color)] pb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold block mb-2">Visual Archive</span>
              <h2 className="font-editorial text-4xl lg:text-5xl font-bold uppercase text-[var(--foreground)]">Editorial Stories</h2>
            </div>
            
            {/* Categories filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setActiveCategory('')}
                className={`text-[9px] uppercase tracking-widest px-4 py-2 border rounded-sm transition-all cursor-pointer ${
                  activeCategory === ''
                    ? 'bg-[#D4A44B] border-[#D4A44B] text-black font-bold'
                    : 'border-[var(--border-color)] text-[var(--foreground)] opacity-70 hover:opacity-100'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`text-[9px] uppercase tracking-widest px-4 py-2 border rounded-sm transition-all cursor-pointer ${
                    activeCategory === cat.slug
                      ? 'bg-[#D4A44B] border-[#D4A44B] text-black font-bold'
                      : 'border-[var(--border-color)] text-[var(--foreground)] opacity-70 hover:opacity-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Image Gallery list */}
          {loadingPortfolio ? (
            <div className="flex justify-center py-20">
              <div className="h-7 w-7 border-2 border-[#D4A44B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[var(--border-color)] rounded-sm">
              <span className="text-xs uppercase tracking-wider text-[var(--secondary-text)]">No photography records found</span>
            </div>
          ) : (
            <motion.div
              layout
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filteredPortfolio.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="break-inside-avoid relative overflow-hidden rounded-sm border border-[var(--border-color)] group cursor-pointer shadow-sm bg-[var(--card-bg)]"
                >
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.01] transition-all duration-700"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                    <span className="text-[#D4A44B] text-[8px] uppercase tracking-[0.25em] font-semibold mb-1">{item.category?.name}</span>
                    <h4 className="font-editorial text-base text-white font-bold">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] bg-[var(--beige)] text-[var(--foreground)] border border-[var(--border-color)] hover:border-[#D4A44B] font-bold py-3.5 px-8 transition-all"
            >
              View Full Gallery Archive <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <section className="bg-black py-24 border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold">Kind Words</span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold uppercase text-white mt-3 mb-14">Client Stories</h2>

          <div className="relative min-h-[200px] flex items-center justify-center">
            {homepageTestimonials.map((t, idx) => (
              <div
                key={idx}
                className={`transition-all duration-700 w-full ${idx === testimonialIdx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 absolute inset-0 translate-y-4 scale-95 pointer-events-none'}`}
              >
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#D4A44B] text-[#D4A44B]" />
                  ))}
                </div>
                <p className="font-editorial text-lg sm:text-2xl italic text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-center gap-3.5">
                  <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover border border-[#D4A44B]/30" />
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-semibold text-white">{t.name}</span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-[#D4A44B] mt-1">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2.5 mt-10">
            {homepageTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`transition-all rounded-full h-1.5 focus:outline-none cursor-pointer ${i === testimonialIdx ? 'w-6 bg-[#D4A44B]' : 'w-1.5 bg-white/20'}`}
                aria-label={`Testimonial slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          PRICING SECTION
          ============================================ */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold block mb-2">Pricing Structure</span>
            <h2 className="font-editorial text-4xl lg:text-5xl font-bold uppercase text-[var(--foreground)]">Investment Tiers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homepagePackages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-sm flex flex-col justify-between transition-all duration-300 group ${
                  pkg.popular
                    ? 'bg-[var(--beige)] border border-[#D4A44B] shadow-lg hover:-translate-y-2'
                    : 'bg-[var(--beige)]/30 border border-[var(--border-color)] hover:border-[#D4A44B] hover:-translate-y-1'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A44B] text-black font-semibold text-[8px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-sm shadow-sm select-none">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-editorial text-xl font-bold uppercase tracking-wider mb-2 text-[var(--foreground)]">{pkg.name}</h3>
                  <p className="text-[var(--secondary-text)] text-[11px] leading-relaxed mb-6 font-light">{pkg.desc}</p>
                  
                  {/* Price display */}
                  <div className="text-[var(--foreground)] mb-6 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold font-editorial">
                      {pkg.price > 0 ? `₹${pkg.price.toLocaleString()}` : 'Custom'}
                    </span>
                    <span className="text-[var(--secondary-text)] text-[9px] uppercase tracking-wider font-light">
                      {pkg.price > 0 ? 'INR net' : 'quote'}
                    </span>
                  </div>

                  {/* Highlights list */}
                  <ul className="space-y-3 border-t border-[var(--border-color)] pt-6 mb-8 text-[11px] text-[var(--secondary-text)]">
                    {pkg.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#D4A44B] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/book"
                  className={`text-center text-[9px] uppercase tracking-[0.2em] py-3.5 rounded-sm font-bold transition-all ${
                    pkg.popular
                      ? 'bg-[#D4A44B] text-black hover:bg-black hover:text-white'
                      : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[#D4A44B] hover:text-black'
                  }`}
                >
                  Book Commission
                </Link>

              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-xs text-[var(--secondary-text)] flex items-center justify-center gap-2">
            <Info className="h-4.5 w-4.5 text-[#D4A44B]" />
            <span>Need crew customizing? Build a tailored commission pricing inside our <Link href="/pricing" className="text-[#D4A44B] underline font-medium">Interactive Calculator</Link>.</span>
          </div>

        </div>
      </section>

      {/* ============================================
          BOOKING SECTION
          ============================================ */}
      <section id="booking-section" className="relative py-24 overflow-hidden bg-[#0a0a0a] border-t border-white/5">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/booking_bg.png"
            alt="Palace Ground Shoot"
            className="w-full h-full object-cover opacity-15 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Content */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4A44B] font-semibold">Let's Create Your Story</span>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-white leading-tight">
                Book Your Date
              </h2>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed max-w-sm mt-2 font-light">
                Our global commission coordinates fill up quickly. File your inquiry below, and our lead producer will connect with you via email or WhatsApp within 12 hours.
              </p>
              
              {/* Feature summary indicators */}
              <div className="space-y-3 mt-6 border-t border-white/5 pt-6 text-white/60 text-xs font-light">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#D4A44B] rounded-full" />
                  <span>Secure Client Portal Provisioned Instantly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#D4A44B] rounded-full" />
                  <span>Flexible Pre-production Rescheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#D4A44B] rounded-full" />
                  <span>Encrypted Gallery High-Res Deliveries</span>
                </div>
              </div>
            </div>

            {/* Right: Glassmorphism Form container */}
            <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-sm">
              {bookingSuccess ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="h-14 w-14 border-2 border-[#D4A44B] rounded-full flex items-center justify-center text-[#D4A44B] mb-6 animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-white mb-3 uppercase">Reservation Registered</h3>
                  <p className="text-white/50 text-xs leading-relaxed max-w-sm mb-8">
                    Your details are recorded. To speed up synchronization and coordinate directly with Devan Singh, click below to chat on WhatsApp.
                  </p>
                  
                  <div className="flex flex-col gap-3 w-full">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#D4A44B] hover:bg-[#c4943b] text-black font-bold text-[10px] uppercase tracking-[0.25em] py-4 rounded-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      Chat on WhatsApp <Send className="h-4 w-4" />
                    </a>
                    
                    <button
                      onClick={() => {
                        setBookingSuccess(false);
                        setName('');
                        setPhone('');
                        setDate('');
                        setVenue('');
                        setMessage('');
                      }}
                      className="text-[9px] uppercase tracking-widest text-white/50 hover:text-white mt-2 font-semibold"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  {bookingError && (
                    <div className="text-red-400 text-xs p-3 border border-red-500/30 bg-red-500/10 rounded-sm">
                      {bookingError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Your Name</label>
                      <input
                        type="text" required value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sophia & Liam"
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white text-xs py-3 px-3.5 outline-none placeholder-white/10 transition-colors w-full rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">WhatsApp Phone</label>
                      <input
                        type="tel" required value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 90496 78380"
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white text-xs py-3 px-3.5 outline-none placeholder-white/10 transition-colors w-full rounded-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Ceremony Date</label>
                      <input
                        type="date" required value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white text-xs py-3 px-3.5 outline-none transition-colors w-full rounded-sm [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Event Narrative</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white/70 text-xs py-3 px-3 w-full rounded-sm outline-none cursor-pointer"
                      >
                        <option>Luxury Wedding Stories</option>
                        <option>Pre-Wedding Cinematic Films</option>
                        <option>High-Fashion Engagements</option>
                        <option>Cinematic Reels & Socials</option>
                        <option>Corporate Narrative</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Destination Venue</label>
                      <input
                        type="text" required value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Udaipur Palace, India"
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white text-xs py-3 px-3.5 outline-none placeholder-white/10 transition-colors w-full rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Investment Tier</label>
                      <select
                        value={packageType}
                        onChange={(e) => setPackageType(e.target.value)}
                        className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white/70 text-xs py-3 px-3 w-full rounded-sm outline-none cursor-pointer"
                      >
                        <option>Premium Wedding Package</option>
                        <option>Essential Plan</option>
                        <option>Luxury Commission</option>
                        <option>Destination Bespoke</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-white/40 mb-1 font-semibold">Message & Details</label>
                    <textarea
                      rows={3} required value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail your requirements or styling questions..."
                      className="bg-neutral-950 border border-white/10 focus:border-[#D4A44B] text-white text-xs py-3 px-3.5 outline-none placeholder-white/10 transition-colors w-full resize-none rounded-sm"
                    />
                  </div>

                  <button
                    type="submit" disabled={bookingSubmitting}
                    className="w-full bg-[#D4A44B] text-black font-bold text-[10px] uppercase tracking-[0.25em] py-4 hover:bg-[#c4943b] transition-all flex items-center justify-center gap-2 rounded-sm cursor-pointer mt-2"
                  >
                    {bookingSubmitting ? 'Registering In DB...' : 'Reserve Consultation'} <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================
          DYNAMIC PORTFOLIO LIGHTBOX
          ============================================ */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6"
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 h-10 w-10 bg-white/10 hover:bg-[#D4A44B] rounded-full flex items-center justify-center text-white text-xl transition-colors cursor-pointer focus:outline-none"
            >
              ×
            </button>
            <div
              className="w-full max-w-4xl max-h-[85vh] bg-black rounded-sm overflow-hidden shadow-2xl border border-[#D4A44B]/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxItem.mediaUrl} alt={lightboxItem.title} className="w-full h-full max-h-[85vh] object-contain mx-auto" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-left">
                <span className="text-[#D4A44B] text-[8px] uppercase tracking-[0.2em] font-semibold">{lightboxItem.category?.name}</span>
                <h4 className="font-editorial text-lg text-white font-bold mt-1">{lightboxItem.title}</h4>
                <p className="text-white/60 text-xs mt-1 font-light">{lightboxItem.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================
          CINEMATIC VIDEO OVERLAY MODAL
          ============================================ */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 h-10 w-10 bg-white/10 hover:bg-[#D4A44B] rounded-full flex items-center justify-center text-white text-xl transition-colors cursor-pointer focus:outline-none"
            >
              ×
            </button>
            <div
              className="w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={activeVideo} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

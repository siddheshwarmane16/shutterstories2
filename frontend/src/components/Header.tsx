'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, User, Sun, Moon } from 'lucide-react';
import { getAuthUser, getAuthToken, api } from '../utils/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    api.logHit(pathname).catch(() => {});
    
    // Auth Check
    const token = getAuthToken();
    const authUser = getAuthUser();
    if (token && authUser) setUser(authUser);
    
    // Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Films', href: '/films' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const getPortalLink = () => {
    if (!user) return '/portal/login';
    return user.role === 'ADMIN' ? '/admin/dashboard' : '/portal/dashboard';
  };

  const isHome = pathname === '/';

  const getHeaderBg = () => {
    if (scrolled) {
      return theme === 'dark' 
        ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-3' 
        : 'bg-[#F7F2EA]/90 backdrop-blur-md border-b border-[#E5D8C5] py-3';
    }
    return 'bg-transparent py-5';
  };

  const getTextColor = (isActive: boolean) => {
    if (isActive) return 'text-[#D4A44B] font-semibold';
    if (scrolled) {
      return theme === 'dark' ? 'text-white/80 hover:text-[#D4A44B]' : 'text-[#1A1A1A]/80 hover:text-[#D4A44B]';
    }
    if (isHome) return 'text-white/80 hover:text-[#D4A44B]';
    return theme === 'dark' ? 'text-white/80 hover:text-[#D4A44B]' : 'text-[#1A1A1A]/80 hover:text-[#D4A44B]';
  };

  const getLogoColor = () => {
    if (scrolled) {
      return theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]';
    }
    if (isHome) return 'text-white';
    return theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]';
  };

  const getButtonBorderColor = () => {
    if (scrolled) {
      return theme === 'dark' ? 'border-white/20 text-white/80 hover:border-[#D4A44B] hover:text-[#D4A44B]' : 'border-[#1A1A1A]/20 text-[#1A1A1A]/80 hover:border-[#D4A44B] hover:text-[#D4A44B]';
    }
    if (isHome) return 'border-white/20 text-white/80 hover:border-[#D4A44B] hover:text-[#D4A44B]';
    return theme === 'dark' ? 'border-white/20 text-white/80 hover:border-[#D4A44B] hover:text-[#D4A44B]' : 'border-[#1A1A1A]/20 text-[#1A1A1A]/80 hover:border-[#D4A44B] hover:text-[#D4A44B]';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderBg()}`}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-start gap-2 group">
            <Camera className="h-5 w-5 text-[#D4A44B] mt-1 transition-transform group-hover:scale-110" />
            <div className="flex flex-col leading-tight">
              <span className={`font-editorial text-lg font-bold tracking-[0.25em] uppercase transition-colors group-hover:text-[#D4A44B] ${getLogoColor()}`}>
                Shutter<br />Stories
              </span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-[#D4A44B]/70 font-light mt-0.5">
                Every Frame Tells A Story
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[10px] uppercase tracking-[0.22em] transition-colors hover-underline-gold font-light ${getTextColor(isActive)}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer mr-1 ${getButtonBorderColor()}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            <Link
              href={getPortalLink()}
              className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] border py-2 px-5 rounded-sm transition-all font-light ${getButtonBorderColor()}`}
            >
              <User className="h-3.5 w-3.5" />
              {user ? 'Dashboard' : 'Portal'}
            </Link>
            
            <Link
              href="/book"
              className="text-[10px] uppercase tracking-[0.22em] bg-[#D4A44B] text-black font-bold py-2.5 px-6 rounded-sm hover:bg-[#c4943b] transition-all shadow-lg"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="xl:hidden flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all cursor-pointer ${getButtonBorderColor()}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors ${getLogoColor()}`}
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-[64px] z-40 bg-[var(--background)] border-t border-[var(--border-color)] transition-transform duration-500 xl:hidden overflow-y-auto max-h-[calc(100vh-64px)] pb-12 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 px-8 py-10 h-full justify-between">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm uppercase tracking-[0.2em] transition-colors py-2 font-light ${
                    isActive
                      ? 'text-[#D4A44B] border-l-2 border-[#D4A44B] pl-3'
                      : 'text-[var(--foreground)] opacity-70 hover:opacity-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 mb-6">
            <Link
              href={getPortalLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--foreground)] py-3 border border-[var(--border-color)] rounded-sm hover:border-[#D4A44B] hover:text-[#D4A44B] transition-all"
            >
              <User className="h-4 w-4" />
              {user ? 'My Dashboard' : 'Client Portal'}
            </Link>
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="text-xs text-center uppercase tracking-[0.2em] bg-[#D4A44B] text-black font-bold py-3.5 rounded-sm hover:bg-[#c4943b] transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

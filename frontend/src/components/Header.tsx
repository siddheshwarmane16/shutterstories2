'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, User } from 'lucide-react';
import { getAuthUser, getAuthToken, api } from '../utils/api';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Detect scrolling for sticky header style change
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Log hit to analytics
    api.logHit(pathname).catch(() => {});
    
    // Check if user session exists
    const token = getAuthToken();
    const authUser = getAuthUser();
    if (token && authUser) {
      setUser(authUser);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#F7F2EA]/95 backdrop-blur-md border-b border-[#E5D8C5] py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2 group">
            <Camera className="h-6 w-6 text-[#C8A96B] transition-transform group-hover:scale-110" />
            <span className="font-editorial text-xl tracking-[0.2em] uppercase font-bold text-[#1A1A1A] group-hover:text-[#C8A96B] transition-colors">
              Shutter Stories
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-[#C8A96B] hover-underline-gold ${
                    isActive ? 'text-[#C8A96B] font-semibold' : 'text-[#6D6D6D]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Call-To-Action buttons */}
          <div className="hidden xl:flex items-center gap-4">
            <Link
              href={getPortalLink()}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/85 hover:text-[#C8A96B] transition-colors py-2 px-4 border border-[#E5D8C5] hover:border-[#C8A96B] rounded-sm transition-all"
            >
              <User className="h-3.5 w-3.5" />
              {user ? 'Dashboard' : 'Portal'}
            </Link>
            <Link
              href="/book"
              className="text-[10px] uppercase tracking-[0.2em] bg-[#C8A96B] text-[#F7F2EA] font-semibold py-2.5 px-6 rounded-sm shadow-sm hover:bg-[#1A1A1A] transition-all"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden text-[#1A1A1A] hover:text-[#C8A96B] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay Drawer */}
      <div
        className={`fixed inset-0 top-[64px] z-40 bg-[#F7F2EA] border-t border-[#E5D8C5] transition-transform duration-500 xl:hidden overflow-y-auto max-h-[calc(100vh-64px)] pb-12 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 px-8 py-12 h-full justify-between">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs uppercase tracking-[0.2em] hover:text-[#C8A96B] transition-colors py-2 ${
                    isActive ? 'text-[#C8A96B] border-l-2 border-[#C8A96B] pl-3' : 'text-[#6D6D6D]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 mb-20">
            <Link
              href={getPortalLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#1A1A1A] py-3 border border-[#E5D8C5] rounded-sm hover:border-[#C8A96B]"
            >
              <User className="h-4 w-4" />
              {user ? 'My Dashboard' : 'Client Portal'}
            </Link>
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="text-xs text-center uppercase tracking-[0.2em] bg-[#C8A96B] text-[#F7F2EA] font-semibold py-3.5 rounded-sm hover:bg-[#1A1A1A]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

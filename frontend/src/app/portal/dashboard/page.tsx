'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, LogOut, CheckCircle, Download, Clock, CreditCard, MessageSquare, Send, Check, AlertCircle, Sun, Moon } from 'lucide-react';
import { api, getAuthToken, getAuthUser, removeAuthToken } from '@/utils/api';

export default function ClientDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Dashboard states
  const [project, setProject] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Chat input
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAuthToken();
    const authUser = getAuthUser();

    if (!token || !authUser || authUser.role !== 'CLIENT') {
      removeAuthToken();
      router.push('/portal/login');
      return;
    }

    setUser(authUser);
    loadDashboardData();

    // Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Poll chat messages every 5 seconds for simulation
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const projRes = await api.getClientProject();
      setProject(projRes);

      const invRes = await api.getClientInvoices();
      setInvoices(invRes);

      await fetchMessages();
    } catch (err) {
      console.error('Failed to load portal details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const chatRes = await api.getChatMessages();
      setMessages(chatRes);
    } catch (err) {
      console.error('Failed to retrieve chat messages:', err);
    }
  };

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/portal/login');
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setPaymentProcessing(invoiceId);
    try {
      await api.payInvoice(invoiceId);
      // Re-fetch invoices to display PAID status
      const invRes = await api.getClientInvoices();
      setInvoices(invRes);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setPaymentProcessing(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const msg = await api.sendMessage(newMessage);
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to transmit message:', err);
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'SHOOTING': return 'Filming & Shooting';
      case 'EDITING': return 'Post-Production Sort';
      case 'COLOR_GRADING': return 'Cinematic Color Grading';
      case 'DELIVERED': return 'Delivered & Completed';
      default: return phase;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center gap-4 text-[var(--foreground)] transition-colors duration-500">
        <div className="h-8 w-8 border-2 border-[#D4A44B] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)]/50">Accessing secure vault...</span>
      </div>
    );
  }

  // Parse deliverables urls list
  const deliverablesList = project?.deliverables ? project.deliverables.split(';').filter((url: string) => url.trim()) : [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between transition-colors duration-500">
      
      {/* Top Header */}
      <header className="border-b border-[var(--border-color)] bg-[var(--navbar-bg)] backdrop-blur-md sticky top-0 z-40 py-4 px-6 sm:px-10 flex items-center justify-between transition-colors duration-500">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-start gap-2 group">
            <Camera className="h-5 w-5 text-[#D4A44B] mt-1 transition-transform group-hover:scale-110" />
            <div className="flex flex-col leading-tight">
              <span className="font-editorial text-sm font-bold tracking-[0.25em] uppercase text-[var(--foreground)] transition-colors group-hover:text-[#D4A44B]">
                Shutter<br />Stories
              </span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-[#D4A44B]/70 font-light mt-0.5">
                Every Frame Tells A Story
              </span>
            </div>
          </Link>
          <span className="text-[9px] bg-[var(--gold-glow)] border border-[#D4A44B]/35 text-[#D4A44B] px-2 py-0.5 rounded-sm uppercase tracking-wider font-semibold">
            Client Portal
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-xs text-[var(--foreground)]/70 hidden sm:inline">Welcome, <strong>{user.name}</strong></span>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-[var(--border-color)] text-[var(--foreground)]/70 hover:border-[#D4A44B] hover:text-[#D4A44B] transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-[0.15em] text-[var(--foreground)]/60 hover:text-[var(--foreground)] flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main dashboard grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Tracker & Deliverables) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Project Tracker Progress */}
          {project ? (
            <div className="glass-panel p-8 rounded-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A44B] font-semibold">Project Pipeline</span>
                  <h2 className="font-editorial text-2xl font-bold uppercase mt-1">Wedding Film & Photos</h2>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-[#D4A44B]">{project.percentage}%</span>
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--foreground)]/40">Progress</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--background)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)] mb-6">
                <div
                  className="h-full bg-gradient-to-r from-[#F7F2EA] via-[#D4A44B] to-[#b88c3a] transition-all duration-1000"
                  style={{ width: `${project.percentage}%` }}
                />
              </div>

              {/* Steps timeline indicator */}
              <div className="grid grid-cols-4 gap-2 text-center text-[9px] uppercase tracking-wider mb-8 text-[var(--foreground)]/40">
                <div className={project.percentage >= 15 ? 'text-[#D4A44B] font-semibold' : ''}>Shooting</div>
                <div className={project.percentage >= 50 ? 'text-[#D4A44B] font-semibold' : ''}>Editing</div>
                <div className={project.percentage >= 75 ? 'text-[#D4A44B] font-semibold' : ''}>Coloring</div>
                <div className={project.percentage >= 100 ? 'text-[#D4A44B] font-semibold' : ''}>Delivered</div>
              </div>

              {/* Producer Comments */}
              <div className="border-t border-[var(--border-color)] pt-6 flex items-start gap-4">
                <Clock className="h-5 w-5 text-[#D4A44B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--foreground)] mb-2">
                    Visual Producer Logs: {getPhaseLabel(project.phase)}
                  </h4>
                  <p className="text-[var(--foreground)]/70 text-xs leading-relaxed font-light italic">
                    "{project.comments}"
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-sm text-center py-12">
              <AlertCircle className="h-8 w-8 text-[var(--foreground)]/30 mx-auto mb-4" />
              <p className="text-[var(--foreground)]/50 text-xs">No active production tracker. Contact studio support.</p>
            </div>
          )}

          {/* 2. Deliverable high-res Gallery */}
          <div className="glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-2xl font-bold uppercase mb-6 flex items-center justify-between">
              <span>High-Res Deliverables</span>
              {deliverablesList.length > 0 && (
                <span className="text-[10px] text-[var(--foreground)]/50 font-normal uppercase tracking-wider">
                  {deliverablesList.length} Files Available
                </span>
              )}
            </h2>

            {deliverablesList.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--border-color)] rounded-sm">
                <p className="text-[var(--foreground)]/40 text-xs">Images are currently in post-production edits.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {deliverablesList.map((url: string, idx: number) => (
                  <div key={idx} className="group relative border border-[var(--border-color)] overflow-hidden rounded-sm bg-[var(--background)] aspect-video">
                    <img
                      src={url}
                      alt={`Deliverable ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <a
                        href={url}
                        download={`shutter-deliverable-${idx + 1}.jpg`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 w-10 bg-white text-black hover:bg-[#D4A44B] hover:text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Download className="h-4.5 w-4.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Invoices & Direct Chat) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 3. Invoices Card */}
          <div className="glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-xl font-bold uppercase mb-6 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#D4A44B]" /> Invoices
            </h2>

            {invoices.length === 0 ? (
              <p className="text-[var(--foreground)]/40 text-xs">No active invoices linked.</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="border border-[var(--border-color)] p-5 rounded-sm flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs uppercase tracking-wider font-bold">{inv.booking?.eventType || 'Photography Service'}</h4>
                        <span className="text-[10px] text-[var(--foreground)]/50 mt-1 block">Due: {inv.dueDate}</span>
                      </div>
                      <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm shrink-0 ${
                        inv.status === 'PAID'
                          ? 'bg-green-100 dark:bg-green-900/30 border border-green-500/30 text-green-700 dark:text-green-300'
                          : 'bg-[var(--gold-glow)] border border-[#D4A44B]/40 text-[#D4A44B]'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-4 mt-2">
                      <span className="text-sm font-bold text-[#D4A44B]">₹{inv.amount.toLocaleString()}</span>
                      
                      {inv.status === 'UNPAID' && (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          disabled={paymentProcessing === inv.id}
                          className="text-[10px] font-bold uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] hover:bg-[#D4A44B] hover:text-white py-2 px-4 rounded-sm disabled:opacity-50 transition-all cursor-pointer font-semibold"
                        >
                          {paymentProcessing === inv.id ? 'Processing...' : 'Simulate Pay'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Direct Photographer Chat Room */}
          <div className="glass-panel p-6 rounded-sm flex flex-col h-[480px]">
            <h2 className="font-editorial text-xl font-bold uppercase mb-4 flex items-center gap-2 border-b border-[var(--border-color)] pb-4 shrink-0">
              <MessageSquare className="h-5 w-5 text-[#D4A44B]" /> Chat Studio
            </h2>

            {/* Message window */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none py-2">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-[var(--foreground)]/40 text-[10px] leading-relaxed italic">
                    Initiate discussion with Devan. Send your queries regarding timelines or schedule bookings below.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-sm p-3.5 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[var(--beige)] dark:bg-neutral-900 text-[var(--foreground)] border border-[var(--border-color)]'
                            : 'bg-[#D4A44B]/5 text-[var(--foreground)] border border-[#D4A44B]/25'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className="block text-[8px] text-[var(--foreground)]/45 mt-1 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Send Input Form */}
            <form onSubmit={handleSendMessage} className="border-t border-[var(--border-color)] pt-4 mt-2 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type message to photographer..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] py-2.5 px-3 rounded-sm text-xs focus:outline-none placeholder-[var(--foreground)]/30"
              />
              <button
                type="submit"
                className="h-9 w-9 bg-[var(--foreground)] text-[var(--background)] hover:bg-[#D4A44B] hover:text-white rounded-sm flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-[var(--border-color)] py-6 text-center text-[10px] text-[var(--foreground)]/30 uppercase tracking-[0.15em] mt-12 bg-neutral-950/5">
        &copy; {new Date().getFullYear()} Shutter Stories. All rights reserved. Secure Portal connection.
      </footer>

    </div>
  );
}

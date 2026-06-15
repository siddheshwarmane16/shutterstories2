'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, LogOut, LayoutDashboard, Calendar, Clipboard, Image as ImageIcon, Settings, MessageSquare, Plus, Trash2, ArrowUpRight, Check, Send, Sparkles, BookOpen, Sun, Moon } from 'lucide-react';
import { api, getAuthToken, getAuthUser, removeAuthToken } from '@/utils/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'projects' | 'uploads' | 'packages' | 'chat'>('analytics');
  
  // Dynamic Data Lists
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  
  // Forms & Modals states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCatId, setUploadCatId] = useState('');
  const [uploadType, setUploadType] = useState('IMAGE');
  const [uploadFileBase64, setUploadFileBase64] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Package edit state
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgEditPrice, setPkgEditPrice] = useState(0);
  const [pkgEditDesc, setPkgEditDesc] = useState('');

  // Project tracker edit state
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projPhase, setProjPhase] = useState('SHOOTING');
  const [projPercent, setProjPercent] = useState(10);
  const [projComments, setProjComments] = useState('');
  const [projDeliverables, setProjDeliverables] = useState('');

  // Chat state
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [adminReplyMsg, setAdminReplyMsg] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAuthToken();
    const authUser = getAuthUser();

    if (!token || !authUser || authUser.role !== 'ADMIN') {
      removeAuthToken();
      router.push('/admin/login');
      return;
    }

    setUser(authUser);
    loadAllAdminData();

    // Theme Check
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
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

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const stats = await api.getAnalytics();
      setAnalytics(stats);

      const bRes = await api.getBookings();
      setBookings(bRes);

      const pRes = await api.getAdminProjects();
      setProjects(pRes);

      const portRes = await api.getPortfolio();
      setPortfolio(portRes);

      const catRes = await api.getCategories();
      setCategories(catRes);

      const packRes = await api.getPackages();
      setPackages(packRes);

    } catch (err) {
      console.error('Failed to load administrative vault data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin/login');
  };

  // Booking approval hook
  const handleApproveBooking = async (id: string) => {
    try {
      await api.updateBooking(id, 'APPROVED');
      // Re-fetch all data to synchronize
      await loadAllAdminData();
    } catch (err) {
      console.error('Failed to approve booking:', err);
    }
  };

  // File Upload base64 mapper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Portfolio Create Submission
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadCatId || !uploadFileBase64) return;

    setUploadingFile(true);
    try {
      // 1. Upload base64 asset locally
      const uploadRes = await api.uploadFile(uploadFileName || 'upload.jpg', uploadFileBase64);
      
      // 2. Save Portfolio entry
      await api.createPortfolioItem({
        title: uploadTitle,
        description: uploadDesc,
        mediaUrl: uploadRes.url,
        mediaType: uploadType,
        categoryId: uploadCatId,
        featured: true,
      });

      // Reset
      setUploadTitle('');
      setUploadDesc('');
      setUploadFileBase64('');
      setUploadFileName('');
      
      // Re-fetch
      const portRes = await api.getPortfolio();
      setPortfolio(portRes);
    } catch (err) {
      console.error('Failed to publish media uploads:', err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await api.deletePortfolioItem(id);
      setPortfolio((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete media upload:', err);
    }
  };

  // Package edits saving
  const handleSavePackage = async (id: string) => {
    try {
      await api.updatePackage(id, { price: pkgEditPrice, description: pkgEditDesc });
      setEditingPkgId(null);
      const packRes = await api.getPackages();
      setPackages(packRes);
    } catch (err) {
      console.error('Failed to save pricing package:', err);
    }
  };

  // Project tracker edits saving
  const handleSaveProject = async (id: string) => {
    try {
      await api.updateAdminProject(id, {
        phase: projPhase,
        percentage: projPercent,
        comments: projComments,
        deliverables: projDeliverables,
      });
      setEditingProjId(null);
      const pRes = await api.getAdminProjects();
      setProjects(pRes);
    } catch (err) {
      console.error('Failed to save project deliverables:', err);
    }
  };

  // Select client chat
  const handleSelectClient = async (clientUser: any) => {
    setSelectedClient(clientUser);
    try {
      const chatLogs = await api.getChatMessages(clientUser.id);
      setMessages(chatLogs);
    } catch (err) {
      console.error('Failed to sync chat messages:', err);
    }
  };

  // Poll chats if open
  useEffect(() => {
    if (!selectedClient) return;
    const interval = setInterval(async () => {
      const chatLogs = await api.getChatMessages(selectedClient.id);
      setMessages(chatLogs);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedClient]);

  // Scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyMsg.trim() || !selectedClient) return;

    try {
      const msg = await api.sendMessage(adminReplyMsg, selectedClient.id);
      setMessages((prev) => [...prev, msg]);
      setAdminReplyMsg('');
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center gap-4 text-[var(--foreground)] transition-colors duration-500">
        <div className="h-8 w-8 border-2 border-[#D4A44B] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)]/50">Unlocking control vault...</span>
      </div>
    );
  }

  const summary = analytics?.summary || { totalVisitors: 0, totalLeads: 0, totalBookings: 0, totalRevenue: 0 };
  const monthlyTrends = analytics?.monthlyTrends || [];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between transition-colors duration-500">
      
      {/* Top Header Panel */}
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
          <span className="text-[9px] bg-red-950/20 border border-red-500/35 text-red-500 px-2 py-0.5 rounded-sm uppercase tracking-wider font-semibold">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="text-xs text-[var(--foreground)]/70 hidden sm:inline">Console: <strong>{user.name}</strong></span>
          
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

      {/* Main dashboard tab bar */}
      <div className="border-b border-[var(--border-color)] bg-[var(--navbar-bg)] px-6 sm:px-10 py-3 flex gap-4 overflow-x-auto scrollbar-none shrink-0 transition-colors duration-500">
        {[
          { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
          { id: 'bookings', label: 'Bookings Inquiries', icon: Calendar },
          { id: 'projects', label: 'Client Projects', icon: Clipboard },
          { id: 'uploads', label: 'Media Uploads', icon: ImageIcon },
          { id: 'packages', label: 'Pricing Packs', icon: Settings },
          { id: 'chat', label: 'Chat Center', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 text-[10px] uppercase tracking-widest px-4 py-2 rounded-sm border shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D4A44B]/10 border-[#D4A44B] text-[#D4A44B]'
                  : 'border-[var(--border-color)] hover:border-[#D4A44B]/30 text-[var(--foreground)]/50 hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main viewport panels */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-10 py-10">
        
        {/* TAB 1: ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Aggregate counters cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Page Views', val: summary.totalVisitors.toLocaleString(), desc: 'Scaling hits counter' },
                { label: 'Total Inquiries', val: summary.totalLeads.toLocaleString(), desc: 'Lead form inquiries' },
                { label: 'Total Bookings', val: summary.totalBookings.toLocaleString(), desc: 'Submitted clients requests' },
                { label: 'Accumulated Revenue', val: `₹${summary.totalRevenue.toLocaleString()}`, desc: 'Confirmed booking sums' },
              ].map((card, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-sm flex flex-col justify-between aspect-[1.8]">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40">{card.label}</span>
                  <div className="my-2">
                    <span className="text-3xl font-bold font-editorial text-[var(--foreground)]">{card.val}</span>
                  </div>
                  <span className="text-[8px] text-[#D4A44B] uppercase tracking-wider">{card.desc}</span>
                </div>
              ))}
            </div>

            {/* Performance line chart SVG display */}
            <div className="glass-panel p-8 rounded-sm">
              <h3 className="font-editorial text-xl font-bold uppercase mb-6 flex items-center gap-2">
                Monthly Performance Trends
              </h3>
              
              {/* Premium custom SVG line chart */}
              <div className="relative aspect-[3/1] w-full border border-[var(--border-color)] bg-[var(--input-bg)] p-6 rounded-sm transition-colors duration-500">
                <svg className="w-full h-full" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A44B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#D4A44B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="550" y2="20" stroke="var(--border-color)" strokeOpacity="0.3" />
                  <line x1="50" y1="70" x2="550" y2="70" stroke="var(--border-color)" strokeOpacity="0.3" />
                  <line x1="50" y1="120" x2="550" y2="120" stroke="var(--border-color)" strokeOpacity="0.3" />
                  <line x1="50" y1="170" x2="550" y2="170" stroke="var(--border-color)" strokeOpacity="0.5" />
                  
                  {/* Chart Line Path */}
                  <path
                    d="M 50,160 Q 150,140 250,110 T 450,60 T 550,40"
                    fill="none"
                    stroke="#D4A44B"
                    strokeWidth="3"
                  />
                  {/* Area fill */}
                  <path
                    d="M 50,160 Q 150,140 250,110 T 450,60 T 550,40 L 550,170 L 50,170 Z"
                    fill="url(#chartGrad)"
                  />

                  {/* Nodes dots */}
                  <circle cx="50" cy="160" r="4" fill="#D4A44B" />
                  <circle cx="150" cy="148" r="4" fill="#D4A44B" />
                  <circle cx="250" cy="110" r="4" fill="#D4A44B" />
                  <circle cx="350" cy="85" r="4" fill="#D4A44B" />
                  <circle cx="450" cy="60" r="4" fill="#D4A44B" />
                  <circle cx="550" cy="40" r="4" fill="#D4A44B" />

                  {/* X Axis Coordinates */}
                  {monthlyTrends.map((t: any, i: number) => (
                    <text
                      key={i}
                      x={50 + i * 100}
                      y="190"
                      fill="var(--secondary-text)"
                      fontSize="9"
                      textAnchor="middle"
                      className="uppercase tracking-widest font-light"
                    >
                      {t.month}
                    </text>
                  ))}
                </svg>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#D4A44B]">
                  <Sparkles className="h-3 w-3" /> Booking Revenues Growth
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BOOKINGS INQUIRIES */}
        {activeTab === 'bookings' && (
          <div className="glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-2xl font-bold uppercase mb-6">Submitted Bookings</h2>
            
            {bookings.length === 0 ? (
              <p className="text-[var(--foreground)]/40 text-xs py-10">No booking requests submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--foreground)]/55 uppercase tracking-wider text-[9px]">
                      <th className="py-4">Event Type</th>
                      <th className="py-4">Date / Destination</th>
                      <th className="py-4">Contact</th>
                      <th className="py-4">Status</th>
                      <th className="py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-[var(--border-color)]/30">
                        <td className="py-4 font-semibold text-[var(--foreground)]">
                          {b.eventType}
                          <span className="block text-[10px] text-[var(--foreground)]/50 font-normal mt-0.5">Package ID: {b.package.name}</span>
                        </td>
                        <td className="py-4 text-[var(--foreground)]/80">
                          <div>{b.date}</div>
                          <span className="text-[10px] text-[var(--foreground)]/40 block mt-0.5">{b.location}</span>
                        </td>
                        <td className="py-4 text-[var(--foreground)]/80">
                          <div>{b.contactName}</div>
                          <span className="text-[10px] text-[var(--foreground)]/40 block mt-0.5">{b.contactEmail}</span>
                        </td>
                        <td className="py-4">
                          <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm ${
                            b.status === 'APPROVED'
                              ? 'bg-green-100 dark:bg-green-900/35 border border-green-500/30 text-green-700 dark:text-green-300'
                              : 'bg-[var(--gold-glow)] border border-[#D4A44B]/40 text-[#D4A44B]'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4">
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveBooking(b.id)}
                              className="text-[9px] uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] py-2 px-4 rounded-sm hover:bg-[#D4A44B] hover:text-white transition-all font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT PROJECTS */}
        {activeTab === 'projects' && (
          <div className="glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-2xl font-bold uppercase mb-6">Client Pipelines</h2>
            
            {projects.length === 0 ? (
              <p className="text-[var(--foreground)]/40 text-xs py-10">No active client projects trackers created. Approve bookings to provision.</p>
            ) : (
              <div className="space-y-6">
                {projects.map((proj) => {
                  const isEditing = editingProjId === proj.id;
                  return (
                    <div key={proj.id} className="border border-[var(--border-color)] p-6 rounded-sm flex flex-col gap-6">
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-[var(--foreground)]">{proj.client.name}</h4>
                          <span className="text-[10px] text-[var(--foreground)]/50 block mt-0.5">{proj.client.email}</span>
                        </div>
                        <span className="text-xs text-[#D4A44B] font-semibold">{proj.phase} ({proj.percentage}%)</span>
                      </div>

                      {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
                          {/* Phase inputs */}
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2 font-bold">Editing Phase</label>
                            <select
                              value={projPhase}
                              onChange={(e) => setProjPhase(e.target.value)}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                            >
                              <option value="SHOOTING">SHOOTING</option>
                              <option value="EDITING">EDITING</option>
                              <option value="COLOR_GRADING">COLOR GRADING</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2 font-bold">Percentage Progress ({projPercent}%)</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={projPercent}
                              onChange={(e) => setProjPercent(Number(e.target.value))}
                              className="w-full h-1 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[#D4A44B]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2 font-bold">Producer Logs / Comments</label>
                            <input
                              type="text"
                              value={projComments}
                              onChange={(e) => setProjComments(e.target.value)}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/40 mb-2 font-bold">Deliverable links (Semicolon separated URLs)</label>
                            <textarea
                              rows={3}
                              value={projDeliverables}
                              onChange={(e) => setProjDeliverables(e.target.value)}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none resize-none"
                            />
                          </div>

                          <div className="sm:col-span-2 flex justify-end gap-2">
                            <button
                              onClick={() => setEditingProjId(null)}
                              className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/60 hover:text-[var(--foreground)] py-2.5 px-5 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveProject(proj.id)}
                              className="text-[10px] uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] font-bold py-2.5 px-6 rounded-sm hover:bg-[#D4A44B] hover:text-white transition-all cursor-pointer"
                            >
                              Save Tracker
                            </button>
                          </div>

                        </div>
                      ) : (
                        <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]">
                          <p className="text-[var(--foreground)]/60 text-xs truncate max-w-lg italic font-light">
                            "{proj.comments || 'Pre-production planning initiated.'}"
                          </p>
                          <button
                            onClick={() => {
                              setEditingProjId(proj.id);
                              setProjPhase(proj.phase);
                              setProjPercent(proj.percentage);
                              setProjComments(proj.comments || '');
                              setProjDeliverables(proj.deliverables || '');
                            }}
                            className="text-[9px] uppercase tracking-widest bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#D4A44B] text-[var(--foreground)] py-2 px-4 rounded-sm transition-all cursor-pointer"
                          >
                            Update
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MEDIA UPLOADS */}
        {activeTab === 'uploads' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Create form */}
            <div className="lg:col-span-4 glass-panel p-8 rounded-sm">
              <h3 className="font-editorial text-lg font-bold uppercase mb-6">Publish Media</h3>
              <form onSubmit={handleCreatePortfolio} className="space-y-5">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-2 font-bold">Media Title</label>
                  <input
                    type="text"
                    required
                    placeholder="The Udaipur Palace vows"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-2 font-bold">Description</label>
                  <input
                    type="text"
                    placeholder="Short narrative summary..."
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-2 font-bold">Category</label>
                  <select
                    required
                    value={uploadCatId}
                    onChange={(e) => setUploadCatId(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-2 font-bold">Media Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--foreground)] p-3.5 rounded-sm text-xs focus:outline-none"
                  >
                    <option value="IMAGE">IMAGE (JPEG/PNG)</option>
                    <option value="VIDEO">VIDEO (MP4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-2 font-bold">Select File Asset</label>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-[var(--foreground)]/50 file:mr-4 file:py-2.5 file:px-4 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-semibold file:bg-[var(--card-bg)] file:text-[var(--foreground)] hover:file:bg-[#D4A44B] hover:file:text-white cursor-pointer"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={uploadingFile}
                    className="w-full text-xs uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] hover:bg-[#D4A44B] hover:text-white font-bold py-4 rounded-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {uploadingFile ? 'Uploading Asset...' : 'Upload and Publish'} <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>

              </form>
            </div>

            {/* List and manage uploads */}
            <div className="lg:col-span-8 glass-panel p-8 rounded-sm">
              <h3 className="font-editorial text-xl font-bold uppercase mb-6">Visual Assets Registry</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="group relative border border-[var(--border-color)] bg-[var(--background)] rounded-sm overflow-hidden aspect-video">
                    {item.mediaType === 'VIDEO' ? (
                      <video src={item.mediaUrl} className="w-full h-full object-cover opacity-60" preload="metadata" />
                    ) : (
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover opacity-70" />
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-4 transition-opacity z-10">
                      <span className="text-[#D4A44B] text-[8px] uppercase tracking-wider font-semibold">{item.category?.name}</span>
                      <h4 className="text-[10px] font-bold text-white truncate">{item.title}</h4>
                      <button
                        onClick={() => handleDeletePortfolio(item.id)}
                        className="text-red-400 hover:text-red-500 self-end p-1.5 focus:outline-none cursor-pointer"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: PRICING PACKAGES */}
        {activeTab === 'packages' && (
          <div className="glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-2xl font-bold uppercase mb-6 text-white">Packages Configuration</h2>
            <div className="space-y-6">
              {packages.map((pkg) => {
                const isEditing = editingPkgId === pkg.id;
                return (
                  <div key={pkg.id} className="border border-[var(--border-color)] p-6 rounded-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">{pkg.name}</h3>
                      {isEditing ? (
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-1">Price (INR)</label>
                            <input
                              type="number"
                              value={pkgEditPrice}
                              onChange={(e) => setPkgEditPrice(Number(e.target.value))}
                              className="bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] py-2 px-3 rounded-sm text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-[var(--foreground)]/50 mb-1">Description</label>
                            <input
                              type="text"
                              value={pkgEditDesc}
                              onChange={(e) => setPkgEditDesc(e.target.value)}
                              className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] py-2 px-3 rounded-sm text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-[var(--foreground)]/65 text-xs mt-1 leading-relaxed font-light">{pkg.description}</p>
                          <span className="text-xs font-bold text-[#D4A44B] mt-3 block">
                            {pkg.price > 0 ? `₹${pkg.price.toLocaleString()}` : 'Custom Pricing'}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setEditingPkgId(null)}
                            className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/60 hover:text-[var(--foreground)] py-2 px-4 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSavePackage(pkg.id)}
                            className="text-[10px] uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] font-bold py-2 px-5 rounded-sm hover:bg-[#D4A44B] hover:text-white cursor-pointer"
                          >
                            Save Price
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPkgId(pkg.id);
                            setPkgEditPrice(pkg.price);
                            setPkgEditDesc(pkg.description);
                          }}
                          className="text-[9px] uppercase tracking-widest bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[#D4A44B] text-[var(--foreground)] py-2.5 px-5 rounded-sm transition-colors cursor-pointer"
                        >
                          Modify Package
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: CHAT CENTER */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] items-stretch">
            
            {/* Clients index list */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-sm flex flex-col overflow-y-auto">
              <h3 className="font-editorial text-lg font-bold uppercase mb-4 border-b border-[var(--border-color)] pb-4">Clients list</h3>
              <div className="space-y-2">
                {projects.map((proj) => {
                  const clientUser = proj.client;
                  const isSelected = selectedClient?.id === clientUser.id;
                  return (
                    <button
                      key={clientUser.id}
                      onClick={() => handleSelectClient(clientUser)}
                      className={`w-full text-left p-4 rounded-sm border transition-all flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4A44B]/10 border-[#D4A44B] text-[var(--foreground)]'
                          : 'border-[var(--border-color)] hover:border-[var(--border-color)]/80 text-[var(--foreground)]/70 hover:text-[var(--foreground)]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{clientUser.name}</span>
                        <span className="text-[10px] text-[var(--foreground)]/45">{clientUser.email}</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#D4A44B]" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected chat panel */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-sm flex flex-col justify-between">
              {selectedClient ? (
                <>
                  <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-4 mb-4">
                    <div className="h-9 w-9 bg-[var(--background)] border border-[#D4A44B]/20 rounded-full flex items-center justify-center text-[10px] uppercase font-bold text-[#D4A44B]">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--foreground)] uppercase">{selectedClient.name}</h4>
                      <span className="text-[10px] text-[var(--foreground)]/50 block font-light">{selectedClient.email}</span>
                    </div>
                  </div>

                  {/* Messages window */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-none py-2">
                    {messages.map((msg) => {
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
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSendAdminReply} className="border-t border-[var(--border-color)] pt-4 mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder={`Reply to ${selectedClient.name}...`}
                      value={adminReplyMsg}
                      onChange={(e) => setAdminReplyMsg(e.target.value)}
                      className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[#D4A44B] text-[var(--foreground)] py-3 px-4 rounded-sm text-xs focus:outline-none placeholder-[var(--foreground)]/30"
                    />
                    <button
                      type="submit"
                      className="h-10 w-10 bg-[var(--foreground)] text-[var(--background)] hover:bg-[#D4A44B] hover:text-white rounded-sm flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="my-auto text-center py-20 flex flex-col items-center justify-center gap-3">
                  <MessageSquare className="h-10 w-10 text-[var(--foreground)]/20 animate-pulse" />
                  <p className="text-[var(--foreground)]/40 text-xs font-light">Select a client folder from the index panel to initiate messages.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-[var(--border-color)] py-6 text-center text-[10px] text-[var(--foreground)]/30 uppercase tracking-[0.15em] mt-12 bg-neutral-950/5">
        &copy; {new Date().getFullYear()} Shutter Stories. Admin Dashboard console.
      </footer>

    </div>
  );
}

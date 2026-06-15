'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Lock, Mail, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { api, setAuthToken, setAuthUser, getAuthToken, getAuthUser } from '@/utils/api';

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If user is already logged in, bypass login
    const token = getAuthToken();
    const user = getAuthUser();
    if (token && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/portal/dashboard');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter email and password credentials');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setAuthUser(res.user);

      if (res.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/portal/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email credentials or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-between py-12 px-6">
      
      {/* Top logo */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group text-white">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Back to marketing</span>
        </Link>
        
        <Link href="/" className="flex items-center gap-2 text-white">
          <Camera className="h-5 w-5 text-[#D4AF37]" />
          <span className="font-editorial text-sm tracking-[0.2em] uppercase font-bold">
            Shutter Stories
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="mx-auto w-full max-w-md my-auto">
        <div className="glass-panel p-8 sm:p-10 rounded-sm">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">Secure access</span>
            <h1 className="font-editorial text-3xl font-bold uppercase mt-2 text-white">Client Portal</h1>
            <p className="text-white/40 text-[11px] mt-2 leading-relaxed">
              Log in to track wedding editing, download high-res stories, view invoice bills, and chat.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-xs p-4 rounded-sm flex items-start gap-2.5 mb-6">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2 font-semibold">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/45">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 focus:border-[#D4AF37] text-white py-3 pl-10 pr-4 rounded-sm text-xs focus:outline-none placeholder-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2 font-semibold">Access Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/45">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 focus:border-[#D4AF37] text-white py-3 pl-10 pr-4 rounded-sm text-xs focus:outline-none placeholder-white/30 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-[#D4AF37] font-bold py-4 rounded-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Enter Portal'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>

          {/* Seed hint for tester/user review */}
          <div className="mt-8 border-t border-white/5 pt-6 text-[10px] text-white/40 leading-relaxed text-center">
            <p><strong>Demo Access credentials:</strong></p>
            <p className="mt-1">Client: client@shutterstories.com / client123</p>
            <p>Admin: admin@shutterstories.com / admin123</p>
          </div>

        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-white/30 uppercase tracking-[0.15em]">
        &copy; {new Date().getFullYear()} Shutter Stories. Luxury Portal.
      </div>

    </div>
  );
}

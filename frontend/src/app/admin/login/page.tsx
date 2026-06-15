'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Lock, Mail, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { api, setAuthToken, setAuthUser, getAuthToken, getAuthUser } from '@/utils/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
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
      setErrorMsg('Please specify credentials');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login({ email, password });
      if (res.user.role !== 'ADMIN') {
        throw new Error('Access denied: Administrative privileges required');
      }

      setAuthToken(res.token);
      setAuthUser(res.user);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-between py-12 px-6">
      
      {/* Top Navigation links */}
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

      {/* Admin Credentials Panel */}
      <div className="mx-auto w-full max-w-md my-auto">
        <div className="glass-panel-gold p-8 sm:p-10 rounded-sm border border-[#D4AF37]/30">
          <div className="text-center mb-8">
            <ShieldCheck className="h-10 w-10 text-[#D4AF37] mx-auto mb-3" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">Studio management</span>
            <h1 className="font-editorial text-3xl font-bold uppercase mt-2 text-white">Admin Portal</h1>
            <p className="text-white/45 text-[11px] mt-2 leading-relaxed">
              Verify administrative keys to modify services, packages, galleries, test summaries, and track client files.
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
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2 font-semibold">System Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/45">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="admin@shutterstories.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 focus:border-[#D4AF37] text-white py-3 pl-10 pr-4 rounded-sm text-xs focus:outline-none placeholder-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2 font-semibold">System Key Pass</label>
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
                {loading ? 'Decrypting...' : 'Verify Access'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-[10px] text-white/40 leading-relaxed text-center">
            <p><strong>Admin credentials:</strong></p>
            <p className="mt-1">admin@shutterstories.com / admin123</p>
          </div>

        </div>
      </div>

      <div className="text-center text-[10px] text-white/30 uppercase tracking-[0.15em]">
        &copy; {new Date().getFullYear()} Shutter Stories. Admin Vault.
      </div>

    </div>
  );
}

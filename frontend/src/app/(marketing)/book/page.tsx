'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, ArrowLeft, Camera, Check, Sparkles, MapPin, Package, FileText, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '@/utils/api';

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Form Fields
  const [eventType, setEventType] = useState('Luxury Wedding Stories');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [requirements, setRequirements] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Packages dynamically
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.getPackages();
        setPackages(res);
        // Default to first package if available
        if (res.length > 0) {
          setSelectedPackageId(res[0].id);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const handleNext = () => {
    // Step validation checks
    if (step === 2 && !date) {
      setErrorMsg('Please select a valid ceremony date');
      return;
    }
    if (step === 3 && !location.trim()) {
      setErrorMsg('Please specify the destination location');
      return;
    }
    setErrorMsg('');
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg('Please fill in all contact details');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.createBooking({
        eventType,
        date,
        location,
        packageId: selectedPackageId,
        requirements,
        contactName,
        contactEmail,
        contactPhone,
      });

      // Confetti Blast!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#C8A96B', '#5C4435'],
      });

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Event Type', icon: Camera },
    { num: 2, title: 'Date', icon: Calendar },
    { num: 3, title: 'Location', icon: MapPin },
    { num: 4, title: 'Package', icon: Package },
    { num: 5, title: 'Requirements', icon: FileText },
    { num: 6, title: 'Contact Details', icon: User },
  ];

  if (success) {
    return (
      <div className="relative min-h-[90vh] flex items-center justify-center py-24 px-6 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2EA]/85 via-[#F7F2EA]/90 to-[#F7F2EA] backdrop-blur-[4px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-[#C8A96B]/10 border border-[#C8A96B] text-[#C8A96B] rounded-full flex items-center justify-center mb-8 animate-bounce">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold uppercase mb-6 text-[#1A1A1A]">Reservation Logged</h1>
          <p className="text-[#6D6D6D] text-xs sm:text-sm tracking-wide leading-relaxed mb-6 font-light">
            Your luxury consult request has been registered in our database! Our lead producer will reach out on WhatsApp/Email within 12 hours.
          </p>

          <div className="bg-[#EFE7DB]/60 border border-[#C8A96B]/25 p-8 rounded-sm text-left w-full mb-10 max-w-lg shadow-sm">
            <h3 className="font-editorial text-lg text-[#C8A96B] font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5" /> Client Portal Autoprovisioned
            </h3>
            <p className="text-[#6D6D6D] text-xs leading-relaxed mb-4 font-light">
              We've set up your secure Client Portal. You can track visual progress, sign invoices, and download sneak-peeks here:
            </p>
            <ul className="text-xs text-[#1A1A1A]/85 space-y-2 border-l border-[#C8A96B]/30 pl-4 font-light">
              <li><strong>Login URL:</strong> <Link href="/portal/login" className="text-[#C8A96B] underline hover:text-[#1A1A1A]">shutterstories.com/portal/login</Link></li>
              <li><strong>Email:</strong> {contactEmail}</li>
              <li><strong>Temp Password:</strong> shutter123</li>
            </ul>
            <p className="text-[#6D6D6D]/60 text-[10px] mt-4 italic">
              * Please log in and change your password immediately.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F7F2EA] font-bold py-4 px-8 rounded-sm hover:bg-[#C8A96B] hover:text-[#1A1A1A] transition-all shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] py-24 px-6 overflow-hidden flex items-center justify-center">
      
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2EA]/85 via-[#F7F2EA]/90 to-[#F7F2EA] backdrop-blur-[4px] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-16 overflow-x-auto pb-4 scrollbar-none">
          {stepsList.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#C8A96B]/10 border-[#C8A96B] text-[#C8A96B] scale-110'
                        : isDone
                        ? 'bg-[#C8A96B] border-[#C8A96B] text-[#F7F2EA]'
                        : 'border-[#E5D8C5] text-[#6D6D6D]/45'
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-[0.15em] ${
                      isActive ? 'text-[#C8A96B] font-semibold' : 'text-[#6D6D6D]/50'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`h-[1px] flex-1 min-w-[30px] transition-all ${
                      isDone ? 'bg-[#C8A96B]' : 'bg-[#E5D8C5]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Booking Form Card */}
        <div className="bg-[#EFE7DB]/45 backdrop-blur-md p-8 sm:p-12 rounded-sm relative border border-[#E5D8C5] shadow-sm">
          <span className="text-[#C8A96B] text-[10px] uppercase tracking-[0.3em] font-semibold">
            Step {step} of 6
          </span>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-sm my-6">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            
            {/* STEP 1: EVENT TYPE */}
            {step === 1 && (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-6 uppercase">Select Event Narrative</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Luxury Wedding Stories',
                    'Pre-Wedding Cinematic Films',
                    'High-Fashion Engagements',
                    'Cinematic Reels & Socials',
                    'Corporate Narrative & Commercials',
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`text-left p-5 border rounded-sm transition-all flex justify-between items-center ${
                        eventType === type
                          ? 'border-[#C8A96B] bg-[#C8A96B]/5 text-[#1A1A1A]'
                          : 'border-[#E5D8C5] text-[#6D6D6D] hover:border-[#C8A96B]/50 bg-[#F7F2EA]/30'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider font-semibold">{type}</span>
                      {eventType === type && <Check className="h-4 w-4 text-[#C8A96B]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: DATE */}
            {step === 2 && (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-6 uppercase">Ceremony Date</h2>
                <p className="text-[#6D6D6D] text-xs mb-4">Please specify when the filming or photoshoot events begin.</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none transition-colors"
                  required
                />
              </div>
            )}

            {/* STEP 3: LOCATION */}
            {step === 3 && (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-6 uppercase">Destination Venue</h2>
                <p className="text-[#6D6D6D] text-xs mb-4">Where will this story unfold? (e.g. Udaipur, Lake Como, London, Mumbai)</p>
                <input
                  type="text"
                  placeholder="Venue, City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                  required
                />
              </div>
            )}

            {/* STEP 4: PACKAGES */}
            {step === 4 && (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-4 uppercase">Select Pricing Package</h2>
                <p className="text-[#6D6D6D] text-xs mb-6">Packages can be edited or customized anytime during pre-production.</p>
                {loadingPackages ? (
                  <div className="text-center py-10">
                    <div className="h-6 w-6 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`text-left p-5 border rounded-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          selectedPackageId === pkg.id
                            ? 'border-[#C8A96B] bg-[#C8A96B]/5 text-[#1A1A1A]'
                            : 'border-[#E5D8C5] text-[#6D6D6D] hover:border-[#C8A96B]/50 bg-[#F7F2EA]/30'
                        }`}
                      >
                        <div>
                          <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A1A1A]">{pkg.name}</h4>
                          <p className="text-[11px] text-[#6D6D6D] mt-1 line-clamp-1">{pkg.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#C8A96B] sm:text-right shrink-0">
                          {pkg.price > 0 ? `₹${pkg.price.toLocaleString()}` : 'Custom Price'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: REQUIREMENTS */}
            {step === 5 && (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-6 uppercase">Custom Specifications</h2>
                <p className="text-[#6D6D6D] text-xs mb-4">Details on schedules, styles, aerial drone desires, or specific expectations.</p>
                <textarea
                  rows={5}
                  placeholder="Detail your requirements..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none placeholder-[#6D6D6D]/45 transition-colors resize-none"
                />
              </div>
            )}

            {/* STEP 6: CONTACT DETAILS */}
            {step === 6 && (
              <div className="space-y-6">
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#1A1A1A] mb-6 uppercase">Contact Coordinates</h2>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6D6D6D] mb-2 font-semibold">Your Name / Couple Names</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia & Liam"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6D6D6D] mb-2 font-semibold">Email Coordinates</label>
                    <input
                      type="email"
                      required
                      placeholder="sophia@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6D6D6D] mb-2 font-semibold">WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90496 78380"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-[#F7F2EA]/85 border border-[#E5D8C5] focus:border-[#C8A96B] text-[#1A1A1A] p-4 rounded-sm text-sm focus:outline-none placeholder-[#6D6D6D]/45 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Button Nav Controls */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#E5D8C5]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#6D6D6D] hover:text-[#1A1A1A] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#1A1A1A] hover:text-[#C8A96B] transition-colors bg-[#EFE7DB] hover:bg-[#EFE7DB]/60 py-3.5 px-6 rounded-sm border border-[#E5D8C5] hover:border-[#C8A96B]"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-xs uppercase tracking-[0.2em] bg-[#C8A96B] text-[#F7F2EA] hover:bg-[#1A1A1A] hover:text-[#F7F2EA] font-bold py-4 px-8 rounded-sm transition-all flex items-center gap-2 border border-[#C8A96B] hover:border-[#1A1A1A] shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Complete Booking'} <Sparkles className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}

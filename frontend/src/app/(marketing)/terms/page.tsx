'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-[#6D6D6D] text-xs sm:text-sm leading-relaxed space-y-6">
      <h1 className="font-editorial text-3xl font-bold uppercase tracking-tight text-[#1A1A1A] mb-8">Terms of Service</h1>
      <p className="text-[#6D6D6D]/60 text-[10px] uppercase tracking-wider mb-6">Last Updated: June 15, 2026</p>
      
      <p>
        These Terms govern the booking agreements, consultations, and media deliveries provided by Shutter Stories Studio.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">1. Booking Reservations</h2>
      <p>
        Consultation bookings submitted online constitute requests, not firm agreements. Booking slots are confirmed only upon mutual signing of the pre-production contract and receipt of the primary retainer fee.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">2. Creative Deliverables</h2>
      <p>
        Shutter Stories maintains editorial artistic control over visual sorting, post-production color grading styles, and cinematic musical scoring. Custom requests should be documented inside the "custom requirements" field during booking.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">3. Invoicing and Payments</h2>
      <p>
        Invoices autoprovisioned inside the client portal represent primary retainer billing. Payments must be processed by the indicated due dates to ensure crew allocation.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">4. Intellectual Property</h2>
      <p>
        Delivered wedding photographs and films are licensed for personal sharing and printing by the couples and their immediate families. Commercial reuse, brand advertisements, or reselling of visual files requires prior written studio licensing.
      </p>
    </div>
  );
}

'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-[#6D6D6D] text-xs sm:text-sm leading-relaxed space-y-6">
      <h1 className="font-editorial text-3xl font-bold uppercase tracking-tight text-[#1A1A1A] mb-8">Privacy Policy</h1>
      <p className="text-[#6D6D6D]/60 text-[10px] uppercase tracking-wider mb-6">Last Updated: June 15, 2026</p>
      
      <p>
        At Shutter Stories, we prioritize the confidentiality and privacy of our client commissions. This document outlines our guidelines regarding photo storage, client portal assets, and inquiry coordinates.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">1. Media Delivery and Client Portals</h2>
      <p>
        High-resolution photography and cinematic video files delivered through client portals are hosted on secure, password-protected servers. These links are accessible exclusively by the registered client email. We do not sell or index your personal image portfolios.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">2. Marketing and Social Showcases</h2>
      <p>
        We respect our clients' privacy regarding public portfolios. Highlights are showcased on our public website or social feeds only after receiving explicit verbal or written approval during booking pre-production.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">3. Contact Coordinates</h2>
      <p>
        Your phone numbers, emails, and booking requirements submitted through the consult scheduler are utilized solely to establish pre-production communications. We do not share coordinate details with third-party advertisers.
      </p>

      <h2 className="font-editorial text-lg font-semibold uppercase text-[#1A1A1A] mt-8 mb-4">4. Media Retention</h2>
      <p>
        Delivered digital photos are preserved on secondary backups for a standard duration of 24 months post-ceremony. We recommend downloading and securing your digital catalogs promptly after delivery.
      </p>
    </div>
  );
}

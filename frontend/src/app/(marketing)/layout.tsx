import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import LenisProvider from '@/components/LenisProvider';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MouseGlow from '@/components/MouseGlow';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <div className="relative flex min-h-screen flex-col bg-[#F7F2EA] text-[#1A1A1A] selection:bg-[#C8A96B] selection:text-[#F7F2EA]">
        <CustomCursor />
        <MouseGlow />
        <Header />
        <main className="flex-1 pt-[76px] xl:pt-[84px]">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </LenisProvider>
  );
}

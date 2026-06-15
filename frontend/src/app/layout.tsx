import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Shutter Stories | Luxury Wedding Photography & Cinematic Filmmaking",
    template: "%s | Shutter Stories"
  },
  description: "Every frame tells a story. Editorial, high-fashion, emotional wedding stories and cinematic films captured globally from Udaipur to Lake Como.",
  keywords: ["wedding photography", "luxury wedding filmmaker", "cinematic wedding video", "destination wedding photography", "fine art photography"],
  authors: [{ name: "Shutter Stories" }],
  openGraph: {
    title: "Shutter Stories | Luxury Wedding Photography",
    description: "Every frame tells a story. Editorial wedding stories and cinematic films captured globally.",
    type: "website",
    locale: "en_US",
    url: "https://shutterstories.com",
    siteName: "Shutter Stories",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shutter Stories | Luxury Wedding Photography",
    description: "Every frame tells a story. Editorial wedding stories and cinematic films captured globally.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F7F2EA] text-[#1A1A1A] selection:bg-[#C8A96B] selection:text-[#F7F2EA]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "GetMyBus — Kerala's Transit Digitisation & Ad Network",
  description: "GetMyBus digitises Kerala's private bus fleet — live GPS tracking for commuters, ₹3,500/month passive income for bus owners, and route-targeted advertising for brands.",
  keywords: "GetMyBus, bus tracking Kerala, transit ads Kerala, bus owner income, onboard screen advertising, Kerala private bus, cashless bus tickets, Kollam TVM corridor",
  authors: [{ name: "GetMyBus Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white no-scrollbar`}>
        {children}
      </body>
    </html>
  );
}

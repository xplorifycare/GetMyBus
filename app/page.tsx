"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar, { Lang } from "@/components/Navbar";
import { StatsBar, FeatureCards } from "@/components/FeatureCards";
import Testimonials, { FAQSection } from "@/components/Testimonials";
import DownloadCTA from "@/components/DownloadCTA";
import Footer from "@/components/Footer";
import CityMarquee from "@/components/CityMarquee";
import ScrollToTop from "@/components/ScrollToTop";
import HowItWorks from "@/components/HowItWorks";
import AlertDemo from "@/components/AlertDemo";
import KeralaMap from "@/components/KeralaMap";
import SplitSection from "@/components/SplitSection";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import PartnerSection from "@/components/PartnerSection";
import ValueBanner from "@/components/CrisisBanner";
import OwnersSection from "@/components/OwnersSection";
import AdvertisersSection from "@/components/AdvertisersSection";
import BlogSection from "@/components/BlogSection";

// Dynamically imported with ssr:false so GSAP ScrollTrigger (needs window) never
// executes during Next.js server-side rendering.
const CinematicHero = dynamic(
  () =>
    import("@/components/ui/cinematic-landing-hero").then(
      (m) => m.CinematicHero
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center bg-[#070708]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#0A84FF] border-t-transparent animate-spin" />
          <span className="text-white/30 text-sm tracking-widest uppercase">Loading&hellip;</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [partnerRole, setPartnerRole] = useState<string>("operator");

  // Helper: scroll to partner section, optionally with a role query hint
  const scrollToPartner = (role?: string) => {
    if (role) setPartnerRole(role);
    const el = document.getElementById("partner");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${theme === "light" ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"}`}>

      {/* 1. Navbar — audience-split nav links + EN|ML toggle + theme toggle */}
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {/* 2. Modern Cinematic Scroll-Triggered Hero Section */}
      <CinematicHero
        brandName="GetMyBus"
        tagline1="Kerala's private buses,"
        tagline2="live and earning."
        cardHeading="Real-Time Telemetry & Payments"
        cardDescription={<><span className="text-white font-semibold">GetMyBus</span> deploys onboard smart screens, cashless ETM billing, and live GPS tracking — giving Kerala commuters live bus tracking and private bus owners ₹3,500/month in passive income.</>}
        metricValue={2}
        metricLabel="Pilot Buses Live"
        ctaHeading="Get the GetMyBus App"
        ctaDescription="Track local bus routes live, view active telemetry, and pay seamlessly using UPI or transit card."
        theme={theme}
      />

      {/* 3. Below the Fold — unified themed design system */}
      <div className="relative z-30 themed-bg">

        {/* VALUE BANNER — Platform summary banner shown immediately below hero */}
        <ValueBanner theme={theme} />

        {/* SECTION A — Dark Stats Bar with rolling numbers + dividers */}
        <StatsBar theme={theme} />

        {/* MARQUEE — infinite Kerala city ticker */}
        <CityMarquee />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            COMMUTER SECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div id="commuters">
          {/* SECTION B — Bento Grid Features */}
          <FeatureCards theme={theme} />

          {/* SECTION D — Split Before/After panel */}
          <SplitSection lang={lang} theme={theme} />

          {/* SECTION D.5 — YouTube product walkthrough video */}
          <YoutubeEmbed theme={theme} />

          {/* SECTION E — Smart Alert Demo (interactive notification preview) */}
          <AlertDemo theme={theme} />

          {/* SECTION F — Animated Kerala SVG Route Map */}
          <KeralaMap theme={theme} />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HOW IT WORKS — 3-Tab (Commuters / Owners / Advertisers)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <HowItWorks theme={theme} />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            BUS OWNERS SECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <OwnersSection
          theme={theme}
          onRegisterClick={() => scrollToPartner("operator")}
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ADVERTISERS SECTION
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <AdvertisersSection
          theme={theme}
          onBookClick={() => scrollToPartner("advertiser")}
        />



        {/* SECTION G — Dark Glassmorphism Testimonials with stars */}
        <Testimonials theme={theme} />

        {/* SECTION H — FAQ with animated left accent bar */}
        <FAQSection theme={theme} />

        {/* BLOG — Technical and operational blog posts */}
        <BlogSection theme={theme} />

        {/* SECTION H.2 — Partner & Inquire Contact Form */}
        <PartnerSection theme={theme} defaultRole={partnerRole} />

        {/* SECTION I — Download CTA: phone mockup + animated QR + App Store rating */}
        <DownloadCTA theme={theme} />

        {/* SECTION J — Footer with social icons + Kerala watermark */}
        <Footer theme={theme} />

      </div>

      {/* Floating scroll-to-top button */}
      <ScrollToTop />
    </main>
  );
}

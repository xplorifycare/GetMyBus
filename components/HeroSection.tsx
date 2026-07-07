"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";

// Cycle through mock commuter alerts on the screen
const mockAlerts = [
  { title: "Kozhikode Town Fast", type: "Route Live", info: "Next Stop: Mananchira", duration: "GPS Locked" },
  { title: "UPI Ticket Payment", type: "Tap & Pay", info: "Scan QR code at boarding", duration: "Instant Receipt" },
  { title: "Vytila Hub Shuttle", type: "Live Schedule", info: "Next Stop: Kakkanad Junction", duration: "4 min ETA" },
];

export default function HeroSection({ theme }: { theme: "dark" | "light" }) {
  const [commutersOnline, setCommutersOnline] = useState(4820);
  const [alertIndex, setAlertIndex] = useState(0);

  // Commuters count ticking up for interactive live effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCommutersOnline((prev) => {
        if (prev >= 5100) return 4820;
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % mockAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center themed-bg pt-24 pb-16 px-6 md:px-12 overflow-hidden border-b themed-divider">
      {/* 1. Cyberpunk Grid Gridline Background */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none select-none mix-blend-overlay"
        style={{
          backgroundImage: theme === "light"
            ? `
              linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 80%)"
        }}
      />

      {/* 2. Abstract Radial Lights & Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0A84FF]/[0.08] rounded-full blur-[120px] pointer-events-none animate-mesh-blob-1" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-[#34D399]/[0.04] rounded-full blur-[110px] pointer-events-none animate-mesh-blob-2" />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* LEFT COLUMN: Highly Stylised Text & CTA */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-6">
          
          {/* Pulsing Launch Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#0A84FF]/10 border border-[#0A84FF]/25 rounded-full px-3 py-1.5 w-fit"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0A84FF]" />
            </span>
            <span className="text-[10px] text-[#0A84FF] font-medium tracking-[0.1em] uppercase">
              Digitising Kerala&apos;s Private Transit
            </span>
          </motion.div>

          {/* Heading with smooth gradient */}
          <h1 className="text-[clamp(36px,5.5vw,68px)] font-normal tracking-[-0.03em] leading-[1.05] themed-text">
            {["Kerala&apos;s", "Private", "Bus"].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.22em] pb-1">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                  dangerouslySetInnerHTML={{ __html: word }}
                />
              </span>
            ))}
            <br className="hidden sm:inline" />
            <span className="inline-block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`inline-block ${theme === "light" 
                  ? "bg-gradient-to-r from-[#121316] via-black/80 to-[#0A84FF] bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-white via-white/90 to-[#0A84FF] bg-clip-text text-transparent"
                }`}
              >
                Fleet, Digitised.
              </motion.span>
            </span>
          </h1>

          {/* Short value statement */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(15px,1.8vw,20px)] themed-text-muted font-normal leading-relaxed max-w-[540px]"
          >
            We deploy onboard smart TV screens, cashless ETM billing, and live GPS trackers to provide <span className="themed-text font-medium">real-time schedules, active route maps</span>, and seamless cardless ticket payments for commuters.
          </motion.p>

          {/* Value badging row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-b themed-divider py-6 max-w-xl"
          >
            <div className="flex flex-col space-y-1">
              <span className="text-[11px] themed-text-sub font-normal tracking-wider uppercase">First Route</span>
              <span className="text-[clamp(14px,1.8vw,16px)] text-[#34D399] font-medium whitespace-nowrap">Kollam–TVM</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[11px] themed-text-sub font-normal tracking-wider uppercase">Kerala Transit</span>
              <span className="text-[clamp(14px,1.8vw,16px)] themed-text font-medium whitespace-nowrap">2M+ riders daily</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[11px] themed-text-sub font-normal tracking-wider uppercase">GPS Updates</span>
              <span className="text-[clamp(14px,1.8vw,16px)] text-[#0A84FF] font-medium whitespace-nowrap">Every 4s live</span>
            </div>
          </motion.div>

          {/* CTA Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
          >
            <a
              href="#partner"
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound(0.01)}
              className="inline-flex items-center justify-center bg-[#0A84FF] text-white px-7 h-12 font-medium text-[14px] rounded-[10px] shadow-[0_4px_20px_rgba(10,132,255,0.25)] hover:shadow-[0_4px_25px_rgba(10,132,255,0.4)] hover:bg-[#0070e3] hover:scale-[1.02] transition-all duration-200 select-none active:scale-[0.98] w-full sm:w-auto"
            >
              Partner with Us
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#features"
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound(0.01)}
              className={`inline-flex items-center justify-center border rounded-[10px] px-6 h-12 font-medium text-[14px] transition-all duration-200 select-none w-full sm:w-auto ${
                theme === "light"
                  ? "bg-black/[0.03] border-black/10 text-black/75 hover:bg-black/[0.06] hover:text-black hover:border-black/20"
                  : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              Explore Platform
            </a>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Stylish Abstract Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          {/* Decorative neon backlights */}
          <div className="absolute inset-0 bg-[#0A84FF]/[0.02] rounded-[30px] filter blur-xl" />
          
          {/* Main Device Container */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            className="w-full relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm md:max-w-md themed-card border rounded-[24px] p-5 shadow-2xl backdrop-blur-md">
            
            {/* Screen loop panel simulating the onboard TV */}
            <div className="bg-[#0b0c10] border border-white/[0.05] rounded-[16px] p-4 flex flex-col space-y-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] animate-pulse-slow">
              {/* Header inside lockscreen */}
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-[#34D399]">Live Transit Network</span>
                </div>
                <span className="text-[10px] opacity-40 font-medium">Telemetry v4.8</span>
              </div>

              {/* Simulation mockup map outline */}
              <div className={`h-40 rounded-[14px] relative overflow-hidden mb-4 border ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-black/30 border-white/[0.04]"
              }`}>
                {/* SVG Route Visualiser */}
                <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 120">
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <g opacity="0.1">
                    <line x1="0" y1="30" x2="200" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="50" y1="0" x2="50" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="100" y1="0" x2="100" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="150" y1="0" x2="150" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                  </g>

                  {/* Route Paths */}
                  <path d="M 20,90 Q 70,20 120,80 T 180,30" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Active Bus Dot */}
                  <motion.circle
                    r="5"
                    fill="#0A84FF"
                    stroke="#FFF"
                    strokeWidth="1.5"
                    animate={{
                      cx: [20, 48, 80, 115, 138, 162, 180],
                      cy: [90, 60, 38, 76, 68, 48, 30]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Stops */}
                  <circle cx="20" cy="90" r="3" fill="#34D399" />
                  <circle cx="120" cy="80" r="3" fill="#34D399" />
                  <circle cx="180" cy="30" r="3" fill="#34D399" />
                </svg>

                {/* Floating GPS lock indicator */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center space-x-1">
                  <div className="w-1 h-1 rounded-full bg-[#0A84FF] animate-ping" />
                  <span className="text-[7px] text-white/80 font-mono tracking-widest font-semibold uppercase">GPS LOCK</span>
                </div>
              </div>

              {/* Core Telemetry widgets inside the lock screen mockup */}
              <div className={`rounded-[14px] p-3.5 space-y-3.5 border ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-black/30 border-white/[0.04]"
              }`}>
                {/* Active Route Header */}
                <div className="flex items-center space-x-2 text-[10px] text-white/50 border-b border-white/[0.03] pb-2">
                  <svg className="w-3 h-3 text-[#0A84FF] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                  </svg>
                  <span className="tracking-wide">Ernakulam Transit Corridor</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-[9px] opacity-40 uppercase tracking-widest">Next Arrival</p>
                    <p className="text-[14px] font-semibold">{mockAlerts[alertIndex].title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] opacity-40 uppercase tracking-widest">ETA</p>
                    <p className="text-[14px] font-semibold text-[#0A84FF]">{mockAlerts[alertIndex].duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
            {/* Overlapping Floating Live Commuters Card */}
            <motion.div 
              initial={{ x: 20, y: 10, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={`absolute bottom-6 -right-3 sm:bottom-10 sm:-right-4 rounded-[14px] p-3.5 shadow-2xl flex items-center space-x-3.5 border ${
                theme === "light"
                  ? "bg-white border-black/10 text-black"
                  : "bg-gradient-to-r from-[#0d121c] to-[#090b10] border-white/[0.08] text-white"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#34D399]/10 border border-[#34D399]/25 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-[9px] uppercase font-medium tracking-wider ${
                  theme === "light" ? "text-black/40" : "text-white/30"
                }`}>Active Commuters Online</span>
                <span className={`text-[15px] font-medium tracking-tight ${
                  theme === "light" ? "text-black" : "text-white"
                }`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {commutersOnline.toLocaleString()} live
                </span>
              </div>
            </motion.div>
 
            {/* Cashless ETM simulator pill */}
            <motion.div 
              initial={{ x: -20, y: -10, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className={`absolute top-6 -left-3 sm:top-10 sm:-left-6 rounded-[12px] p-2 px-3 shadow-2xl flex items-center space-x-2 border ${
                theme === "light"
                  ? "bg-[#FFFbeb] border-[#F59E0B]/30 text-[#D97706]"
                  : "bg-gradient-to-r from-[#1c120c] to-[#120b08] border-[#F59E0B]/20 text-[#F59E0B]"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
              <span className="text-[10px] font-medium">UPI QR Ticket Paid</span>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

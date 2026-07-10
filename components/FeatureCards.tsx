"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants, useMotionValue, useMotionTemplate } from "framer-motion";
import { playHoverSound } from "@/components/SoundEffects";

// ── Rolling counter ────────────────────────────────────────────────────────
function RollingNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const cleanVal = parseFloat(value.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const duration = 1500;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress);
      setCurrent(eased * cleanVal);
      if (progress < 1) requestAnimationFrame(animate);
      else setCurrent(cleanVal);
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, cleanVal]);

  const formatNumber = (num: number) => {
    if (value.includes(".")) return num.toFixed(1);
    return Math.floor(num).toLocaleString();
  };

  return <span ref={ref}>{formatNumber(current)}{suffix}</span>;
}

const S_CARDS = `
  .bento-card {
    position: relative;
    background: linear-gradient(145deg, rgba(10, 14, 30, 0.45) 0%, rgba(5, 7, 16, 0.65) 100%);
    border: 1px solid rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  
  .bento-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.01) 40%, rgba(255, 255, 255, 0.01) 60%, rgba(255, 255, 255, 0.04) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.85;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  .bento-card:hover::before {
    opacity: 1;
    background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.02) 30%, var(--card-glow, rgba(10, 132, 255, 0.35)) 75%, rgba(255, 255, 255, 0.06) 100%);
  }

  .light-theme .bento-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(242, 245, 252, 0.92) 100%) !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
  }
  .light-theme .bento-card::before {
    background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.01) 50%, rgba(0, 0, 0, 0.03) 100%);
    opacity: 0.65;
  }
  .light-theme .bento-card:hover::before {
    opacity: 0.95;
    background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.02) 40%, var(--card-glow, rgba(10, 132, 255, 0.2)) 80%);
  }
`;

// ── 3D Tilt Card with cursor-tracking spotlight ─────────────────────────────────────────
function TiltCard({ children, className, style, onMouseEnter }: { children: React.ReactNode; className: string; style?: React.CSSProperties; onMouseEnter?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for tracking cursor position inside the card container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();

    // Map mouse coordinates relative to the card border
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    if (isMobile) return;
    const mouseXCenter = e.clientX - rect.left - rect.width / 2;
    const mouseYCenter = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(mouseYCenter / (rect.height / 2)) * 6,
      y: (mouseXCenter / (rect.width / 2)) * 6,
    });
  };

  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(10, 132, 255, 0.12), transparent 80%)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      onMouseEnter={onMouseEnter}
      style={{
        transform: isMobile ? "none" : `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: isMobile ? "flat" : "preserve-3d",
        ...style,
      }}
      className={`${className} relative overflow-hidden transition-all duration-200 ease-out`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlightBg }}
      />
      {children}
    </div>
  );
}

// ── SECTION A: Dark Stats Bar ──────────────────────────────────────────────
export function StatsBar({ theme = "dark" }: { theme?: "dark" | "light" }) {
  // Honest pre-launch numbers. Update as milestones are hit.
  const stats = [
    { number: "2", suffix: " buses", label: "Pilot planned · Kollam–TVM corridor" },
    { number: "1", suffix: " corridor", label: "First route · Coming Q3 2026" },
    { number: "4", suffix: "s refresh", label: "Live GPS update interval" },
    { number: "100", suffix: "%", label: "Cashless · UPI & card ready" },
  ];

  return (
    <section className="w-full themed-bg py-20 px-6 md:px-12 border-b themed-divider relative">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0"
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`flex flex-col items-center justify-center text-center py-8 group transition-all duration-300 
              ${theme === "light" ? "border-slate-200" : "border-white/[0.04]"}
              ${idx % 2 === 0 ? "border-r" : ""}
              ${idx < 2 ? "border-b" : ""}
              md:border-b-0
              md:border-r
              md:last:border-r-0
            `}
          >
            <span className="text-[clamp(28px,3.5vw,48px)] text-[#0A84FF] leading-none mb-3 font-normal tracking-tight select-none group-hover:scale-105 group-hover:themed-text transition-all duration-300" style={{ fontVariantNumeric: "tabular-nums" }}>
              <RollingNumber value={stat.number} suffix={stat.suffix} />
            </span>
            <span className="text-[12px] themed-text-sub font-normal leading-normal tracking-wide uppercase transition-colors group-hover:text-[#0A84FF]">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// Mock screen display rotation in Bento smart screen card outside component to prevent react-hook dependency warnings
const mockDisplays = ["Next Stop: Vytila", "UPI QR Ticket Paid", "KL-14-Y-2850 On-Time"];

// ── SECTION B: Bento Grid Feature Section ─────────────────────────────────
export function FeatureCards({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [etmHovered, setEtmHovered] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)", rotateX: 12, transformPerspective: 1200 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      rotateX: 0, 
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % mockDisplays.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className={`relative w-full themed-bg py-24 px-6 md:px-12 overflow-hidden border-t themed-divider ${
      theme === "light" ? "light-theme" : "dark-theme"
    }`}>
      <style dangerouslySetInnerHTML={{ __html: S_CARDS }} />
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0A84FF]/[0.02] rounded-full blur-[120px] pointer-events-none animate-mesh-blob-3" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#34D399]/[0.02] rounded-full blur-[100px] pointer-events-none animate-mesh-blob-4" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="mb-16 text-center"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
            Platform Capabilities
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight leading-[1.1]">
            Live GPS Bus Tracking for Kerala Commuters
          </h2>
        </motion.div>

        {/* ── BENTO GRID ─────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto"
        >
          {/* CARD 1: GPS Live Map (Spans 2 cols) */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <TiltCard 
              style={{ "--card-glow": "rgba(10, 132, 255, 0.45)" } as React.CSSProperties}
              className="group relative bento-card rounded-[24px] p-8 h-full min-h-[300px] flex flex-col md:flex-row justify-between gap-6 overflow-hidden transition-all duration-300"
            >
              {/* Ambient background corner glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#0A84FF]/10 to-transparent blur-[50px] opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-300 z-0" />
              
              {/* Text side */}
              <div className="flex flex-col justify-between flex-1 relative z-10">
                <div style={{ transform: "translateZ(30px)" }}
                  className="mb-6 w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#0A84FF]/15 border border-[#0A84FF]/20">
                  <svg className="w-6 h-6 text-[#0A84FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                  </svg>
                </div>

                <div style={{ transform: "translateZ(15px)" }}>
                  <h3 className="text-[22px] font-normal themed-text mb-3 tracking-tight leading-tight">
                    Accurate <span className="text-[#0A84FF]">Live Tracking</span>
                  </h3>
                  <p className="text-[14px] themed-text-muted leading-relaxed font-normal">
                    Real-time GPS telemetry updates every 4 seconds. View live bus movements on the map, get high-precision ETA predictions, and configure departure alert notifications.
                  </p>
                </div>

                <div style={{ transform: "translateZ(10px)" }} className="mt-6 flex items-center gap-2">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A84FF]" />
                  </span>
                  <span className="text-[11px] text-[#0A84FF] font-medium tracking-wide">Accurate GPS · Live ETA Prediction</span>
                </div>
              </div>

              {/* Graphic side: Live Animated SVG Map of Route */}
              <div className={`flex-1 min-h-[160px] relative border themed-divider rounded-[16px] overflow-hidden flex items-center justify-center ${
                theme === "light" ? "bg-black/[0.02]" : "bg-black/40"
              }`}>
                {/* Abstract Route Line Map */}
                <svg className="w-full h-full p-6 text-white/10" viewBox="0 0 200 120" fill="none">
                  {/* Grid lines background */}
                  <path d="M 0,20 L 200,20 M 0,40 L 200,40 M 0,60 L 200,60 M 0,80 L 200,80 M 0,100 L 200,100" stroke={theme === "light" ? "black" : "white"} strokeWidth="0.5" strokeOpacity={theme === "light" ? 0.05 : 0.1} />
                  <path d="M 40,0 L 40,120 M 80,0 L 80,120 M 120,0 L 120,120 M 160,0 L 160,120" stroke={theme === "light" ? "black" : "white"} strokeWidth="0.5" strokeOpacity={theme === "light" ? 0.05 : 0.1} />
                  
                  {/* Path */}
                  <path 
                    id="route-path" 
                    d="M 20,90 Q 60,10 100,60 T 180,30" 
                    stroke={theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  <motion.path 
                    d="M 20,90 Q 60,10 100,60 T 180,30" 
                    stroke="#0A84FF" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Pulsing Bus Dot following path */}
                  <circle r="4" fill="#0A84FF" className="shadow-[0_0_15px_#0A84FF]">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 20,90 Q 60,10 100,60 T 180,30" />
                  </circle>
                  <circle r="8" fill="none" stroke="#0A84FF" strokeWidth="1" opacity="0.6">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 20,90 Q 60,10 100,60 T 180,30" />
                    <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>

                {/* Floating GPS badge */}
                <div className={`absolute bottom-3 left-3 border rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider flex items-center gap-1 shadow-md ${
                  theme === "light"
                    ? "bg-white border-black/10 text-black/60"
                    : "bg-black/70 border-white/10 text-white/60"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] animate-pulse" />
                  KL-07-CD-4512
                </div>
              </div>

            </TiltCard>
          </motion.div>

          {/* CARD 2: Onboard Screens (Single col) */}
          <motion.div variants={fadeUp}>
            <TiltCard 
              style={{ "--card-glow": "rgba(52, 211, 153, 0.4)" } as React.CSSProperties}
              className="group relative bento-card rounded-[24px] p-7 h-full min-h-[300px] flex flex-col justify-between overflow-hidden transition-all duration-300"
            >
              {/* Ambient background corner glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#34D399]/10 to-transparent blur-[50px] opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-300 z-0" />
              
              <div style={{ transform: "translateZ(30px)" }}
                className="mb-4 w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#34D399]/10 border border-[#34D399]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>

              {/* Graphic Simulator inside card */}
              <div className="w-full aspect-[16/10] border themed-divider bg-[#0A0B0E] rounded-[12px] p-3 flex flex-col justify-between relative shadow-inner overflow-hidden my-2">
                <div className="flex justify-between items-center text-[8px] text-white/50 border-b themed-divider pb-1.5">
                  <span className="font-semibold text-[#34D399] flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    LIVE SCREEN
                  </span>
                  <span>Next: Vytila Hub (3m)</span>
                </div>
                
                {/* Active Screen announcement rotation */}
                <div className="flex flex-col items-center justify-center flex-1 py-1">
                  <span className="text-[12px] font-medium text-white tracking-tight leading-none mb-1">{mockDisplays[activeAdIndex]}</span>
                  <span className="text-[7px] text-white/35 uppercase tracking-wider">Smart Cabin Display System</span>
                </div>

                {/* Progress bar loop */}
                <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div 
                    key={activeAdIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-[#34D399]"
                  />
                </div>
              </div>

              <div style={{ transform: "translateZ(15px)" }} className="pt-2">
                <h3 className="text-[18px] font-normal themed-text mb-2 tracking-tight">
                  In-Bus TV & Alerts
                </h3>
                <p className="text-[13px] themed-text-muted leading-relaxed font-normal">
                  Onboard smart TV screens rendering the next stop, connection options, and real-time transit status alerts.
                </p>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD 3: Conductor ETM (Single col with hover receipt) */}
          <motion.div variants={fadeUp}>
            <TiltCard 
              onMouseEnter={() => {
                setEtmHovered(true);
                playHoverSound(0.01);
              }}
              style={{ "--card-glow": "rgba(245, 158, 11, 0.4)" } as React.CSSProperties}
              className="group relative bento-card rounded-[24px] p-7 h-full min-h-[300px] flex flex-col justify-between overflow-hidden transition-all duration-300"
            >
              {/* Ambient background corner glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#F59E0B]/10 to-transparent blur-[50px] opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-300 z-0" />
              <div style={{ transform: "translateZ(30px)" }}
                className="mb-4 w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#F59E0B]/10 border border-[#F59E0B]/20 transition-all duration-300">
                <svg className="w-6 h-6 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                  <line x1="9" y1="12" x2="15" y2="12" />
                  <line x1="9" y1="16" x2="13" y2="16" />
                </svg>
              </div>

              {/* Interactive ETM Receipt Mockup */}
              <div 
                onMouseLeave={() => setEtmHovered(false)}
                className={`w-full h-[95px] relative border themed-divider rounded-[12px] flex items-start justify-center overflow-hidden my-2 px-4 pt-3 ${
                  theme === "light" ? "bg-black/[0.02]" : "bg-black/50"
                }`}
              >
                {/* Ticket Receipt scrolling down */}
                <motion.div 
                  animate={{ y: etmHovered ? 0 : -35 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className="w-full bg-[#f8f9fa] text-[#1c1d21] rounded-[4px] p-3 shadow-lg flex flex-col space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[7px] font-bold border-b border-black/[0.1] pb-1 uppercase tracking-wider">
                    <span>GETMYBUS TICKETS</span>
                    <span className="text-[#34D399]">PAID UPI</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-medium leading-none">
                    <span>Fare Receipt</span>
                    <span className="font-bold">₹28.00</span>
                  </div>
                  <div className="flex justify-between text-[7px] text-black/50">
                    <span>KL-14-Y-2850</span>
                    <span>14:02 PM</span>
                  </div>
                </motion.div>

                {/* Cover gradient overlay */}
                <div className={`absolute inset-x-0 bottom-0 h-4 pointer-events-none ${
                  theme === "light"
                    ? "bg-gradient-to-t from-black/[0.02] to-transparent"
                    : "bg-gradient-to-t from-black/80 to-transparent"
                }`} />
              </div>

              <div style={{ transform: "translateZ(15px)" }} className="pt-2">
                <h3 className="text-[18px] font-normal themed-text mb-2 tracking-tight">
                  UPI & Cashless Payments
                </h3>
                <p className="text-[13px] themed-text-muted leading-relaxed font-normal">
                  Pay instantly via UPI QR codes on the conductor&apos;s handheld ETM, with future support for tap-and-go transit NFC smart cards.
                </p>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD 4: Operator SaaS Dashboard (Spans 2 cols with bar chart) */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <TiltCard 
              style={{ "--card-glow": "rgba(167, 139, 250, 0.4)" } as React.CSSProperties}
              className="group relative bento-card rounded-[24px] p-8 h-full min-h-[300px] flex flex-col md:flex-row justify-between gap-6 overflow-hidden transition-all duration-300"
            >
              {/* Ambient background corner glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#A78BFA]/10 to-transparent blur-[50px] opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity duration-300 z-0" />
              
              {/* Text side */}
              <div className="flex flex-col justify-between flex-1 relative z-10">
                <div style={{ transform: "translateZ(30px)" }}
                  className="mb-6 w-12 h-12 flex items-center justify-center rounded-[14px] bg-[#A78BFA]/10 border border-[#A78BFA]/20 transition-all duration-300">
                  <svg className="w-6 h-6 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                  </svg>
                </div>

                <div style={{ transform: "translateZ(15px)" }}>
                  <h3 className="text-[22px] font-normal themed-text mb-3 tracking-tight leading-tight">
                    Ticket Booking & Seat Estimation
                  </h3>
                  <p className="text-[14px] themed-text-muted leading-relaxed font-normal">
                    Book tickets directly inside the mobile app. View estimated seat availability indicators calculated dynamically from tickets sold.
                  </p>
                </div>

                <div style={{ transform: "translateZ(10px)" }} className="mt-6 flex items-end gap-1">
                  {[3, 5, 7, 9, 11].map((h, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-sm transition-all duration-300 ${
                        i < 4 ? "bg-[#A78BFA]/40" : "bg-[#A78BFA]/20"
                      } group-hover:bg-[#A78BFA]`}
                      style={{ height: `${h * 2}px`, transitionDelay: `${i * 40}ms` }}
                    />
                  ))}
                  <span className="ml-2 text-[11px] text-[#A78BFA] font-medium">Dynamically calculated seating</span>
                </div>
              </div>

              {/* Graphic side: Interactive SaaS Stats Chart */}
              <div className={`flex-1 min-h-[160px] relative border themed-divider rounded-[16px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 ${
                theme === "light" ? "bg-black/[0.02]" : "bg-black/40"
              }`}>
                <div className="flex justify-between items-center text-[10px] themed-text-muted border-b themed-divider pb-2">
                  <span className="font-semibold uppercase tracking-wide themed-text">Estimated Occupancy</span>
                  <span className="text-[#A78BFA] font-bold text-[11px]">Seat Indicator</span>
                </div>
                
                {/* SVG Graph bars */}
                <div className="flex items-end justify-around h-[80px] pt-4 px-2">
                  {[
                    { label: "Morning Peak", val: "85%", color: "#0A84FF" },
                    { label: "Afternoon", val: "45%", color: "#34D399" },
                    { label: "Evening Peak", val: "75%", color: "#A78BFA" }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1.5 w-1/4">
                      {/* Bar columns with height animations */}
                      <div className={`w-full rounded-t-[4px] h-[55px] flex items-end overflow-hidden ${
                        theme === "light" ? "bg-black/[0.02]" : "bg-white/[0.03]"
                      }`}>
                        <motion.div 
                          initial={{ height: "0%" }}
                          animate={{ height: bar.val }}
                          transition={{ duration: 1.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          className="w-full rounded-t-[4px]"
                          style={{ backgroundColor: bar.color }}
                        />
                      </div>
                      <span className="text-[8px] themed-text-sub uppercase font-medium">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </TiltCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

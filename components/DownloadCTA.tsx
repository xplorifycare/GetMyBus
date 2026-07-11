"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import HeroWave from "@/components/ui/dynamic-wave-canvas-background";

// ── Animated phone mockup with live bus + ETA ────────────────────────────
function PhoneMockup({ theme }: { theme: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <div className={`relative w-[210px] h-[380px] rounded-[38px] border-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] overflow-hidden flex-shrink-0 select-none transition-all duration-300 ${
      isLight 
        ? "bg-white border-black/85 shadow-[0_24px_50px_rgba(0,0,0,0.08)]"
        : "bg-[#18181b] border-white/20 shadow-[0_24px_50px_rgba(0,0,0,0.6)]"
    }`}>
      {/* Top notch (Dynamic Island style) */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30 flex items-center justify-end px-2" aria-hidden>
        <span className="relative flex h-1 w-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-400" />
        </span>
      </div>

      {/* Screen container */}
      <div className={`absolute inset-[1px] rounded-[34px] overflow-hidden transition-colors duration-300 ${isLight ? "bg-slate-100" : "bg-[#070913]"}`}>
        {/* Map Background SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-65" viewBox="0 0 210 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grid lines */}
          <path d="M0 40h210M0 80h210M0 120h210M0 160h210M0 200h210M0 240h210M0 280h210M0 320h210" stroke={isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.015)"} strokeWidth="1" />
          <path d="M30 0v380M60 0v380M90 0v380M120 0v380M150 0v380M180 0v380" stroke={isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.015)"} strokeWidth="1" />

          {/* Waterbody / Ashtamudi Lake */}
          <path d="M-20 280 C 40 290, 30 330, 60 350 L 60 395 L -20 395 Z" fill={isLight ? "#e0f2fe" : "#0d2247"} opacity={isLight ? "0.6" : "0.35"} />
          <text x="10" y="375" fill={isLight ? "rgba(14,165,233,0.3)" : "rgba(10,132,255,0.18)"} fontSize="6" fontWeight="bold">ASHTAMUDI LAKE</text>

          {/* Forestry Zone */}
          <rect x="140" y="80" width="80" height="70" rx="10" fill={isLight ? "#dcfce7" : "#062215"} opacity={isLight ? "0.5" : "0.25"} />
          <text x="148" y="115" fill={isLight ? "rgba(34,197,94,0.3)" : "rgba(52,211,153,0.1)"} fontSize="5" fontWeight="bold">WILD FOREST</text>

          {/* City secondary streets */}
          <path d="M0 100 H 210" stroke={isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"} strokeWidth="1.5" />
          <path d="M0 260 H 210" stroke={isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"} strokeWidth="1.5" />
          <path d="M60 0 V 380" stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"} strokeWidth="1.5" />

          {/* NH 66 Main highway roadbed */}
          <path d="M 40 380 C 110 290, 70 200, 150 100 C 180 60, 160 30, 160 0" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="6" strokeLinecap="round" />
          <path d="M 40 380 C 110 290, 70 200, 150 100 C 180 60, 160 30, 160 0" stroke={isLight ? "#e2e8f0" : "#131b2e"} strokeWidth="4" strokeLinecap="round" />

          {/* Active GPS Route line (dashed) */}
          <path d="M 40 380 C 110 290, 70 200, 150 100" stroke="#0A84FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" className="c-route" />

          {/* Stop landmarks */}
          <g transform="translate(40, 380)">
            <circle cx="0" cy="0" r="3" fill="#0A84FF" stroke={isLight ? "#fff" : "#070913"} strokeWidth="1" />
            <text x="6" y="2" fill={isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)"} fontSize="6" fontWeight="bold">KOLLAM HUB</text>
          </g>
          <g transform="translate(150, 100)">
            <circle cx="0" cy="0" r="3" fill="#0A84FF" stroke={isLight ? "#fff" : "#070913"} strokeWidth="1" />
            <text x="6" y="2" fill={isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)"} fontSize="6" fontWeight="bold">VYTILA STOP</text>
          </g>

          {/* Live Approaching Bus running smoothly along NH 66 curves */}
          <circle r="4.5" fill="#34D399" stroke="#ffffff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
            <animateMotion dur="5s" repeatCount="indefinite" path="M 40 380 C 110 290, 70 200, 150 100" />
          </circle>
        </svg>

        {/* User Location Pulse pin (Vytila Stop) */}
        <div className="absolute top-[100px] left-[150px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-40" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A84FF] border-2 border-white shadow-lg" />
          </span>
        </div>

        {/* Frosted ETA dynamic Card */}
        <div className={`absolute bottom-4 left-3 right-3 backdrop-blur-md border rounded-[18px] p-3 z-20 transition-all duration-300 ${
          isLight
            ? "bg-white/90 border-black/[0.08] shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
            : "bg-[#090b11]/90 border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-[9px] font-bold tracking-wide uppercase ${isLight ? "text-slate-900/40" : "text-white/40"}`}>
              Bus 45C · Kollam Exp
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1.5">
            {/* Animated ETA Countdown */}
            <div className="relative h-6 w-28 overflow-hidden">
              <span className={`animate-eta-1 absolute inset-0 flex items-center text-[15px] font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Arriving in <span className="text-[#34D399] ml-1">4m</span>
              </span>
              <span className={`animate-eta-2 absolute inset-0 flex items-center text-[15px] font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                Arriving in <span className="text-[#34D399] ml-1">3m</span>
              </span>
              <span className="animate-eta-3 absolute inset-0 flex items-center text-[15px] font-bold tracking-tight text-[#34D399]">
                Arrived · Now
              </span>
            </div>
            <span className={`text-[8px] font-semibold ${isLight ? "text-slate-900/45" : "text-white/45"}`}>
              1.2 km away
            </span>
          </div>

          {/* Progress bar */}
          <div className={`h-[3px] rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
            <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#34D399] rounded-full" style={{ width: "70%", boxShadow: "0 0 6px rgba(10,132,255,0.4)" }} />
          </div>

          <div className={`mt-2 flex items-center justify-between text-[8px] font-bold uppercase tracking-wider ${isLight ? "text-slate-900/35" : "text-white/30"}`}>
            <span>Kollam</span>
            <span>Vytila</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── QR with animated scan line ───────────────────────────────────────────
function AnimatedQR({ theme }: { theme: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Outer bracket wrapper */}
      <div className="relative p-2">
        {/* Corner Accents - Glowing Blue Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0A84FF] rounded-tl-[6px]" style={{ filter: "drop-shadow(0 0 4px rgba(10,132,255,0.5))" }} />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0A84FF] rounded-tr-[6px]" style={{ filter: "drop-shadow(0 0 4px rgba(10,132,255,0.5))" }} />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0A84FF] rounded-bl-[6px]" style={{ filter: "drop-shadow(0 0 4px rgba(10,132,255,0.5))" }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0A84FF] rounded-br-[6px]" style={{ filter: "drop-shadow(0 0 4px rgba(10,132,255,0.5))" }} />

        {/* QR Code Glass Card */}
        <div className={`relative p-3.5 rounded-[18px] w-[140px] h-[140px] shadow-2xl transition-all duration-300 hover:scale-[1.04] flex items-center justify-center ${
          isLight
            ? "bg-white border border-black/10 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            : "bg-[#090b11] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
        }`}>
          {/* Neon laser scan line */}
          <div
            className="absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#0A84FF] to-transparent animate-scan-line z-20"
            style={{ boxShadow: "0 0 10px rgba(10,132,255,1), 0 0 20px rgba(10,132,255,0.6)" }}
          />

          {/* High Fidelity Vector QR Code */}
          <Image
            src="/gmb_qr.png"
            alt="Scan to Join GetMyBus"
            width={140}
            height={140}
            className="w-full h-full object-contain rounded-lg relative z-10"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={`text-[12px] font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
          Scan to Join
        </span>
        <span className={`text-[10px] ${isLight ? "text-slate-900/50" : "text-white/40"} font-medium`}>
          Instant iOS &amp; Android Access
        </span>
      </div>
    </div>
  );
}

export default function DownloadCTA({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const lineOpacity = theme === "light" ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.012)";

  return (
    <section id="download" className="relative w-full themed-bg py-32 px-6 md:px-12 select-none overflow-hidden border-t themed-divider">

      {/* Dynamic Wave Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
        <HeroWave theme={theme} opacity={0.65} />
      </div>

      {/* 3D perspective grid background */}
      <div
        style={{
          transform: "perspective(600px) rotateX(60deg) translateY(-25%) translateZ(0)",
          transformOrigin: "top center",
          backgroundImage: `linear-gradient(${lineOpacity} 1px,transparent 1px),linear-gradient(90deg,${lineOpacity} 1px,transparent 1px)`,
        }}
        className="absolute inset-0 w-full h-[150%] bg-[size:45px_45px] pointer-events-none z-0"
      />

      {/* Blue ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0A84FF]/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left: Text + buttons */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-4">
                Early Access · Register Now
              </p>

              <h2 className="text-[clamp(36px,5vw,64px)] tracking-[-0.02em] font-normal leading-[1.05] themed-text mb-6 max-w-lg">
                Your commute,{" "}
                <br />
                <span className="text-shimmer">on your terms.</span>
              </h2>

              <p className="text-[17px] font-normal themed-text-muted leading-relaxed mb-10 max-w-md">
                GetMyBus is launching on the Kollam–Thiruvananthapuram corridor. Sign up now and be among the first riders and operators on the platform.
              </p>

              {/* Waitlist CTA */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <a
                  href="#partner"
                  className={`group flex items-center justify-center gap-2.5 px-8 h-[50px] font-medium text-[14px] rounded-[12px] transition-all duration-200 active:scale-[0.96] hover:scale-[1.01] select-none shadow-[0_4px_20px_rgba(10,132,255,0.25)] ${
                    theme === "light"
                      ? "bg-[#0A84FF] text-white hover:bg-[#0070e3]"
                      : "bg-[#0A84FF] text-white hover:bg-[#0070e3]"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.92z" />
                  </svg>
                  App Coming Soon — Join the Waitlist
                </a>
              </div>

              {/* Honest pre-launch note */}
              <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span className={`text-[12px] font-medium ${theme === "light" ? "text-slate-500" : "text-white/40"}`}>
                  In development · iOS &amp; Android · Launching with first pilot corridor
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, filter: "blur(10px)", rotateY: -12, transformPerspective: 1200 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
            className="flex flex-col sm:flex-row items-center gap-8 flex-shrink-0 w-full lg:w-auto justify-center scale-90 sm:scale-100 origin-center sm:origin-right"
          >
            <PhoneMockup theme={theme} />
            <div className="hidden sm:block">
              <AnimatedQR theme={theme} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

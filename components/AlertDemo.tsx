"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playAlertChime, playHoverSound } from "@/components/SoundEffects";

// Floating notification card component
function NotificationPreview({ visible, theme }: { visible: boolean; theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-4 left-4 right-4 z-10 backdrop-blur-xl border rounded-[16px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ${
            isLight
              ? "bg-white/95 border-black/[0.08] text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : "bg-[#1C1C1E]/95 border-white/10 text-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Notification header */}
          <div className="flex items-center gap-2.5 mb-2">
            {/* App icon */}
            <div className="w-8 h-8 rounded-[8px] bg-[#0A84FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
                <path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
                <path d="M4 17h-2v-11a1 1 0 0 1 1-1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-[12px] font-medium ${isLight ? "text-black/80" : "text-white/80"}`}>GetMyBus</span>
                <span className={`text-[11px] ${isLight ? "text-black/35" : "text-white/30"}`}>now</span>
              </div>
            </div>
          </div>
          {/* Notification body */}
          <p className={`text-[14px] leading-snug font-normal ${isLight ? "text-black" : "text-white"}`}>
            🚌 Bus 45C · <span className="text-[#34D399] font-medium">3 min away</span>
          </p>
          <p className={`text-[12px] mt-1 font-normal ${isLight ? "text-black/55" : "text-white/50"}`}>
            Walk now 🚶 — you&apos;ll reach the stop just in time.
          </p>
          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => playClickSound()}
              className={`flex-1 h-8 rounded-[8px] text-[12px] font-medium transition-colors ${
                isLight
                  ? "bg-black/[0.06] text-black/70 hover:bg-black/[0.1]"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              Dismiss
            </button>
            <button 
              onClick={() => playClickSound()}
              className="flex-1 h-8 rounded-[8px] bg-[#0A84FF] text-white text-[12px] font-medium hover:bg-[#0070e3] transition-colors"
            >
              Track
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AlertDemo({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLight = theme === "light";

  const handlePreview = () => {
    if (loading || triggered) return;
    playClickSound();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTriggered(true);
      // Play iOS style synthesizer notification chime!
      playAlertChime();
      setTimeout(() => setTriggered(false), 5000);
    }, 900);
  };

  return (
    <section className="relative w-full themed-bg py-24 px-6 md:px-12 overflow-hidden border-t themed-divider">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#34D399]/[0.025] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Left: Text */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          >
            <p className="text-[11px] font-medium text-[#34D399] tracking-[0.15em] uppercase mb-3">
              Smart alerts
            </p>
            <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight leading-[1.1] mb-5">
              Your personal
              <br />
              <span className="text-shimmer">commute assistant.</span>
            </h2>
            <p className="text-[15px] themed-text-muted leading-relaxed mb-8 max-w-md">
              GetMyBus watches your bus and nudges you at exactly the right moment. Not too early. Never late.
            </p>

            <ul className="space-y-3 text-[13px] themed-text-muted">
              {["Walk-time calculated using live pedestrian routing", "Alerts adapt to your walking speed automatically", "Lightweight background sync — minimal battery, maximum precision"].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right: Notification demo card */}
        <motion.div
          initial={{ opacity: 0, x: 50, filter: "blur(10px)", rotateY: -10 }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)", rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="flex-shrink-0 w-full max-w-[320px]"
        >
          {/* Mock phone screen */}
          <div className={`relative border rounded-[24px] p-0 overflow-hidden transition-all duration-300 ${
            isLight
              ? "bg-[#e2e8f0] border-black/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
              : "bg-[#111114] border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.4)]"
          }`} style={{ minHeight: 280 }}>
            {/* Notification preview */}
            <NotificationPreview visible={triggered} theme={theme} />

            {/* Lock screen background */}
            <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: 280 }}>
              {/* Time display */}
              <div className="text-center mb-8">
                <div className={`text-[48px] font-normal leading-none tracking-[-0.02em] transition-colors duration-300 ${
                  isLight ? "text-black/85" : "text-white/90"
                }`}>8:42</div>
                <div className={`text-[13px] mt-1 transition-colors duration-300 ${
                  isLight ? "text-black/45" : "text-white/35"
                }`}>Saturday, 31 May</div>
              </div>

              {/* Status bar icons */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-16 h-[3px] rounded-full transition-colors duration-300 ${isLight ? "bg-black/10" : "bg-white/10"}`} />
                <div className={`w-8 h-[3px] rounded-full transition-colors duration-300 ${isLight ? "bg-black/5" : "bg-white/5"}`} />
                <div className={`w-12 h-[3px] rounded-full transition-colors duration-300 ${isLight ? "bg-black/10" : "bg-white/10"}`} />
              </div>

              {/* Preview button */}
              <button
                id="preview-alert-btn"
                onClick={handlePreview}
                onMouseEnter={() => playHoverSound(0.01)}
                className="mt-4 flex items-center gap-2 bg-[#0A84FF]/15 border border-[#0A84FF]/25 rounded-full px-5 py-2.5 text-[13px] text-[#0A84FF] font-medium hover:bg-[#0A84FF]/20 transition-all duration-200 active:scale-[0.96]"
              >
                {loading ? (
                  <span className="w-3 h-3 rounded-full border border-[#0A84FF] border-t-transparent animate-spin" />
                ) : (
                  <span>🔔</span>
                )}
                {loading ? "Sending alert…" : triggered ? "Alert sent!" : "Preview Alert"}
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] themed-text-sub mt-4">
            Tap to see a simulated alert notification
          </p>
        </motion.div>
      </div>
    </section>
  );
}

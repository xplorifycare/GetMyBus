"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function YoutubeEmbed({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [clicked, setClicked] = useState(false);
  const isLight = theme === "light";

  // YouTube video ID from https://youtu.be/9a0Q9qH97h8
  const VIDEO_ID = "9a0Q9qH97h8";
  const thumbUrl = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

  return (
    <section
      ref={ref}
      className={`relative w-full py-24 px-6 md:px-12 overflow-hidden border-t themed-divider ${
        isLight ? "bg-white" : "bg-[#040611]"
      }`}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[160px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #0A84FF 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
            See it in action
          </p>
          <h2 className={`text-[clamp(24px,3.5vw,44px)] font-normal tracking-tight leading-[1.1] ${isLight ? "text-slate-900" : "text-white/90"}`}>
            GetMyBus — how it works
          </h2>
          <p className={`text-[15px] mt-3 font-normal max-w-xl mx-auto leading-relaxed ${isLight ? "text-slate-500" : "text-white/45"}`}>
            A quick walkthrough of live GPS tracking, cashless ticketing, and onboard ad screens — all running on one device.
          </p>
        </motion.div>

        {/* Video Embed */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={`relative rounded-[20px] overflow-hidden border shadow-2xl ${
            isLight
              ? "border-slate-200 shadow-black/10"
              : "border-white/[0.07] shadow-black/60"
          }`}
          style={{ aspectRatio: "16/9" }}
        >
          {/* Thumbnail + Play button overlay — avoids iframe loading until click */}
          {!clicked ? (
            <button
              onClick={() => setClicked(true)}
              className="absolute inset-0 w-full h-full group flex items-center justify-center cursor-pointer"
              aria-label="Play video"
            >
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl}
                alt="GetMyBus platform walkthrough video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Play button */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/95 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                  <svg
                    className="w-8 h-8 text-[#0A84FF] ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* YouTube badge */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.27 12.27 0 00-11.66 0A4.83 4.83 0 01.39 6.69 48.09 48.09 0 000 12a48.09 48.09 0 00.39 5.31 4.83 4.83 0 003.77 2.75 12.27 12.27 0 0011.66 0 4.83 4.83 0 003.77-2.75A48.09 48.09 0 0024 12a48.09 48.09 0 00-.41-5.31zM9.75 15.02V8.98L15.5 12z" />
                </svg>
                <span className="text-[11px] text-white font-medium">Watch on YouTube</span>
              </div>
            </button>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&color=white&controls=0&disablekb=1&fs=0&iv_load_policy=3`}
                title="GetMyBus platform walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
              {/* Mask top title bar & controls YouTube injects */}
              <div className="absolute top-0 left-0 right-0 h-[72px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
              {/* Mask bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
            </div>
          )}
        </motion.div>

        {/* Bottom context line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className={`text-center text-[12px] mt-5 font-normal ${isLight ? "text-slate-400" : "text-white/25"}`}
        >
          Prototype demo · Hardware finalization in progress · Full pilot Q3 2026
        </motion.p>
      </div>
    </section>
  );
}

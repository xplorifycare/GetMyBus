"use client";

import { motion } from "framer-motion";

export default function ValueBanner({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full py-4 px-6 md:px-12 border-b overflow-hidden ${
        isLight ? "bg-blue-50 border-blue-200/60" : "bg-[#020d1a] border-[#0A84FF]/15"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className={`absolute left-0 top-0 w-[400px] h-full blur-[80px] opacity-20 ${
          isLight ? "bg-blue-200" : "bg-[#0A84FF]"
        }`} />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 z-10">
        {/* Icon */}
        <div className={`flex-shrink-0 flex items-center gap-2 ${
          isLight ? "text-[#0A84FF]" : "text-[#60a5fa]"
        }`}>
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          <span className={`text-[11px] font-medium tracking-[0.12em] uppercase ${
            isLight ? "text-[#0A84FF]" : "text-[#60a5fa]"
          }`}>Kerala&apos;s buses, finally connected — and finally earning.</span>
        </div>

        {/* Divider */}
        <div className={`hidden sm:block w-[1px] h-5 flex-shrink-0 ${
          isLight ? "bg-blue-300" : "bg-[#0A84FF]/30"
        }`} />

        {/* Text */}
        <p className={`text-[13px] leading-relaxed ${
          isLight ? "text-blue-900" : "text-white/70"
        }`}>
          <span className={`font-medium ${isLight ? "text-blue-900" : "text-white/90"}`}>
            Live tracking for commuters.
          </span>{" "}
          Ad income for bus owners.{" "}
          <span className={`font-medium ${isLight ? "text-blue-900" : "text-white/90"}`}>
            Route-targeted reach for brands.
          </span>
        </p>

        {/* CTA */}
        <a
          href="#owners"
          className={`flex-shrink-0 text-[11px] font-medium px-4 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
            isLight
              ? "border-blue-300 text-blue-700 hover:bg-blue-100"
              : "border-[#0A84FF]/30 text-[#60a5fa] hover:bg-[#0A84FF]/10"
          }`}
        >
          See how it works →
        </a>
      </div>
    </motion.section>
  );
}

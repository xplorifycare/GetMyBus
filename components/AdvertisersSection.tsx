"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AdvertisersSection({
  theme = "dark",
  onBookClick,
}: {
  theme?: "dark" | "light";
  onBookClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLight = theme === "light";

  // Honest pilot + projection data — no fabricated fleet numbers
  const corridors = [
    {
      name: "Kollam – Trivandrum",
      status: "Pilot launching",
      detail: "Target: 20 buses · Est. 6,000 impressions/day",
      color: "#0A84FF",
      badge: "Q3 2026",
    },
    {
      name: "Ernakulam – Thrissur",
      status: "Phase 2 planned",
      detail: "Operator outreach underway · Target: 30 buses",
      color: "#34D399",
      badge: "Q4 2026",
    },
    {
      name: "Kozhikode – Kannur",
      status: "Scoping in progress",
      detail: "Route survey complete · Pending operator agreements",
      color: "#F59E0B",
      badge: "2027",
    },
    {
      name: "Palakkad – Coimbatore",
      status: "On roadmap",
      detail: "Cross-border corridor — requires MV Dept. clearance",
      color: "#A78BFA",
      badge: "2027",
    },
  ];

  const features = [
    {
      icon: (isLight: boolean) => (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLight ? "bg-[#0A84FF]/10 border border-[#0A84FF]/15" : "bg-[#0A84FF]/10 border border-[#0A84FF]/20"}`}>
          <svg className="w-5 h-5 text-[#0A84FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </div>
      ),
      title: "Bus & Route Targeted Ad Pump",
      desc: "Target your campaigns precisely. Choose to stream ads by specific bus routes, districts, or individual buses on active corridors.",
    },
    {
      icon: (isLight: boolean) => (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLight ? "bg-[#34D399]/10 border border-[#34D399]/15" : "bg-[#34D399]/10 border border-[#34D399]/20"}`}>
          <svg className="w-5 h-5 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
      ),
      title: "Quality Captive Impressions",
      desc: "Reach a highly engaged, captive passenger audience on high-definition onboard displays with average ride times of 30+ minutes.",
    },
    {
      icon: (isLight: boolean) => (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLight ? "bg-[#A78BFA]/10 border border-[#A78BFA]/15" : "bg-[#A78BFA]/10 border border-[#A78BFA]/20"}`}>
          <svg className="w-5 h-5 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
      ),
      title: "Monitoring & Analytics Portal",
      desc: "Track exact ad plays and impressions by route, specific time of day, and location on your live advertiser dashboard.",
    },
    {
      icon: (isLight: boolean) => (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLight ? "bg-[#F59E0B]/10 border border-[#F59E0B]/15" : "bg-[#F59E0B]/10 border border-[#F59E0B]/20"}`}>
          <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
      ),
      title: "Performance Pricing",
      desc: "Pay per verified play, starting at ₹35 per 1,000 plays. Upload your creative assets and launch your campaign within 24 hours.",
    },
  ];

  return (
    <section
      id="advertisers"
      ref={ref}
      className={`relative w-full py-28 px-6 md:px-12 overflow-hidden border-t themed-divider ${
        isLight ? "bg-white" : "bg-[#060810]"
      }`}
    >
      {/* Background ambient */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(ellipse, #0A84FF 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-4">
            For Brands & Advertisers
          </p>
          <h2 className="text-[clamp(30px,4.5vw,56px)] font-normal themed-text tracking-tight leading-[1.08] mb-5">
            Route-Targeted In-Bus Advertising
            <br />
            <span className="text-shimmer">for Kerala Brands</span>
          </h2>
          <p className="text-[16px] themed-text-muted leading-relaxed">
            Kerala&apos;s private bus network carries over{" "}
            <span className={`font-medium ${isLight ? "text-[#0A84FF]" : "text-[#60a5fa]"}`}>
              2 million daily commuters
            </span>
            {" "}— GetMyBus is connecting them, one corridor at a time. We’re starting with the{" "}
            <span className={`font-medium ${isLight ? "text-slate-700" : "text-white/80"}`}>Kollam–Thiruvananthapuram highway</span>{" "}
            and expanding systematically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Features */}
          <div className="lg:col-span-5 space-y-6">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + idx * 0.12 }}
                className={`flex items-start gap-5 rounded-[20px] border p-6 transition-all duration-300 hover:scale-[1.01] ${
                  isLight
                    ? "bg-white border-slate-200 hover:border-[#0A84FF]/30 hover:shadow-[0_4px_20px_rgba(10,132,255,0.06)]"
                    : "bg-white/[0.025] border-white/[0.06] hover:border-[#0A84FF]/20 hover:bg-white/[0.04]"
                }`}
              >
                {f.icon(isLight)}
                <div>
                  <h3 className={`text-[14px] font-medium mb-1.5 tracking-tight ${isLight ? "text-slate-900" : "text-white/90"}`}>
                    {f.title}
                  </h3>
                  <p className="text-[13px] themed-text-muted leading-relaxed font-normal">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Corridor table + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Corridor reach table */}
            <div
              className={`rounded-3xl border p-6 relative overflow-hidden ${
                isLight
                  ? "bg-white border-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.05)]"
                  : "bg-[#0A0F1E] border-white/[0.07]"
              }`}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(10,132,255,0.05), transparent 60%)" }} />
              <div className={`text-[11px] font-medium tracking-[0.12em] uppercase mb-2 ${isLight ? "text-slate-400" : "text-white/30"}`}>
                Expansion Roadmap
              </div>
              <div className={`text-[11px] mb-5 ${isLight ? "text-slate-400" : "text-white/25"}`}>
                Pilot projections — not yet live at scale. Updated as we onboard operators.
              </div>

              <div className="space-y-3">
                {corridors.map((corridor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isLight ? "bg-slate-50 border border-slate-100" : "bg-white/[0.03] border border-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: corridor.color }} />
                      <div>
                        <div className={`text-[13px] font-medium ${isLight ? "text-slate-800" : "text-white/85"}`}>{corridor.name}</div>
                        <div className={`text-[11px] ${isLight ? "text-slate-400" : "text-white/30"}`}>{corridor.detail}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-[10px] font-medium px-2 py-1 rounded-full"
                        style={{ background: `${corridor.color}18`, color: corridor.color, border: `1px solid ${corridor.color}30` }}
                      >
                        {corridor.badge}
                      </div>
                      <div className={`text-[10px] mt-1 ${isLight ? "text-slate-400" : "text-white/30"}`}>{corridor.status}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Projection summary row */}
              <div className={`mt-4 pt-4 border-t flex items-center justify-between flex-wrap gap-2 ${isLight ? "border-slate-100" : "border-white/[0.05]"}`}>
                <span className={`text-[12px] font-normal ${isLight ? "text-slate-500" : "text-white/35"}`}>Projected at full Kollam–TVM scale</span>
                <span className={`text-[13px] font-medium ${isLight ? "text-[#0A84FF]" : "text-[#60a5fa]"}`}>6,000+ impressions/day</span>
              </div>
            </div>

            {/* Pricing card */}
            <div
              className={`rounded-3xl border p-6 flex items-center justify-between gap-6 flex-wrap ${
                isLight
                  ? "bg-slate-50 border-slate-200"
                  : "bg-white/[0.025] border-white/[0.06]"
              }`}
            >
              <div>
                <div className={`text-[11px] uppercase tracking-widest font-medium mb-2 ${isLight ? "text-slate-400" : "text-white/30"}`}>Starting Rate</div>
                <div className={`text-[36px] font-normal tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>₹35</div>
                <div className={`text-[12px] ${isLight ? "text-slate-500" : "text-white/40"}`}>per 1,000 plays · Video ₹80 CPM</div>
              </div>
              <button
                onClick={onBookClick}
                className="h-12 px-8 rounded-2xl bg-[#0A84FF] text-white font-medium text-[14px] tracking-tight hover:bg-[#0070e3] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(10,132,255,0.3)] flex-shrink-0"
              >
                Reserve Early Access →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

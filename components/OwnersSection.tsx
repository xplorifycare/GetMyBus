"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function OwnersSection({
  theme = "dark",
  onRegisterClick,
}: {
  theme?: "dark" | "light";
  onRegisterClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLight = theme === "light";

  const benefits = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: "Extra Passive Income",
      desc: "Earn ₹2,500–₹3,500 every month passively from brands advertising on your in-bus smart screens — guaranteed monthly payout.",
      color: "#34D399",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      ),
      title: "Live Collection Monitoring",
      desc: "Track fare collection in real time. Monitor every single ticket issued by ETM devices, along with live GPS route telemetry from your phone.",
      color: "#0A84FF",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      ),
      title: "Stats & Demand Portal",
      desc: "Access an analytics dashboard showing passenger demand stats by route, time of day, and location to optimize your dispatch schedule.",
      color: "#F59E0B",
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Zero Cost Installation",
      desc: "ETM devices, GPS trackers, and TV smart screens are fully equipped at no upfront cost. Hardware costs are recovered from ad earnings.",
      color: "#A78BFA",
    },
  ];

  return (
    <section
      id="owners"
      ref={ref}
      className={`relative w-full py-28 px-6 md:px-12 overflow-hidden border-t themed-divider ${
        isLight ? "bg-slate-50" : "bg-[#03050d]"
      }`}
    >
      {/* Background ambient */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, #34D399 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-[11px] font-medium text-[#34D399] tracking-[0.15em] uppercase mb-4">
            For Private Bus Operators
          </p>
          <h2 className="text-[clamp(30px,4.5vw,56px)] font-normal themed-text tracking-tight leading-[1.08] mb-5">
            Your bus earns money
            <br />
            <span className="text-shimmer">while it runs.</span>
          </h2>
          <p className="text-[16px] themed-text-muted leading-relaxed">
            No subsidy. No grant. No government waiting list. Install GetMyBus once and earn{" "}
            <span className={`font-medium ${isLight ? "text-[#059669]" : "text-[#34D399]"}`}>
              ₹2,500–₹3,500 every month
            </span>{" "}
            passively from brands advertising on your in-bus screen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + idx * 0.12 }}
                className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] cursor-default ${
                  isLight
                    ? "bg-white border-slate-200 hover:border-[#34D399]/40 hover:shadow-[0_8px_32px_rgba(52,211,153,0.08)]"
                    : "bg-white/[0.03] border-white/[0.07] hover:border-[#34D399]/25 hover:bg-white/[0.05]"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-[18px] font-bold"
                  style={{
                    background: `${b.color}18`,
                    border: `1px solid ${b.color}30`,
                    color: b.color,
                  }}
                >
                  {b.icon}
                </div>
                <h3 className={`text-[15px] font-medium mb-2 tracking-tight ${isLight ? "text-slate-900" : "text-white/90"}`}>
                  {b.title}
                </h3>
                <p className="text-[13px] themed-text-muted leading-relaxed font-normal">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue Proof Card */}
          <motion.div
            initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
            animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className={`rounded-3xl border p-8 relative overflow-hidden ${
              isLight
                ? "bg-white border-slate-200 shadow-[0_12px_48px_rgba(0,0,0,0.06)]"
                : "bg-[#0A0F1E] border-white/[0.07]"
            }`}
          >
            {/* Glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.07), transparent 70%)" }} />

            <div className="relative z-10">
              <div className={`text-[11px] font-medium tracking-[0.12em] uppercase mb-6 ${isLight ? "text-slate-400" : "text-white/30"}`}>
                Monthly Revenue Breakdown · Per Bus
              </div>

              {/* Earnings breakdown */}
              <div className="space-y-4 mb-8">
                {[
                  { label: "Gross Ad Revenue (per bus)", value: "₹6,000–₹7,000", color: "#0A84FF", pct: 100 },
                  { label: "Your Share (50%)", value: "₹3,000–₹3,500", color: "#34D399", pct: 50 },
                  { label: "Data + hardware upkeep (est.)", value: "−₹500/mo", color: "#F59E0B", pct: 7 },
                  { label: "Your Net Take-Home", value: "₹2,500–₹3,000", color: "#A78BFA", pct: 45 },
                ].map((row, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[12px] font-normal ${isLight ? "text-slate-600" : "text-white/55"}`}>{row.label}</span>
                      <span className="text-[13px] font-medium" style={{ color: row.color }}>{row.value}</span>
                    </div>
                    <div className={`h-[3px] rounded-full w-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-white/[0.05]"}`}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: row.color }}
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: `${row.pct}%` } : {}}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={`rounded-2xl p-5 mb-6 ${isLight ? "bg-emerald-50 border border-emerald-200/60" : "bg-[#34D399]/[0.06] border border-[#34D399]/15"}`}>
                <div className={`text-[11px] uppercase tracking-widest font-medium mb-1 ${isLight ? "text-emerald-600" : "text-[#34D399]/70"}`}>Screen pays for itself in</div>
                <div className={`text-[28px] font-normal tracking-tight ${isLight ? "text-emerald-800" : "text-[#34D399]"}`}>
                  ~8 months
                </div>
                <div className={`text-[12px] mt-1 ${isLight ? "text-emerald-700/70" : "text-white/40"}`}>Entirely from ad revenue — not your savings. After that, 100% passive income, indefinitely.</div>
              </div>

              {/* CTA */}
              <button
                onClick={onRegisterClick}
                className="w-full h-12 rounded-2xl bg-[#34D399] text-white font-medium text-[14px] tracking-tight hover:bg-[#2EBD87] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_rgba(52,211,153,0.25)]"
              >
                Register My Bus →
              </button>
              <p className={`text-[11px] text-center mt-3 font-normal ${isLight ? "text-slate-400" : "text-white/25"}`}>
                No lock-in · Exit anytime with 30-day notice
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

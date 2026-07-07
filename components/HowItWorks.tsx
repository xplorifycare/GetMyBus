"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type Audience = "commuters" | "owners" | "advertisers";

const tabs: { id: Audience; label: string; color: string }[] = [
  { id: "commuters", label: "For Commuters", color: "#0A84FF" },
  { id: "owners",    label: "For Bus Owners", color: "#34D399" },
  { id: "advertisers", label: "For Advertisers", color: "#F59E0B" },
];

const flows: Record<Audience, { number: string; title: string; body: string; icon: React.ReactNode; color: string }[]> = {
  commuters: [
    {
      number: "01", color: "#0A84FF",
      title: "Open the GetMyBus App",
      body: "Launch GetMyBus on your phone. See every private bus on your route moving live on the map — updated every 4 seconds.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1"/>
        </svg>
      ),
    },
    {
      number: "02", color: "#34D399",
      title: "Track & Get Notified",
      body: "Set your stop. GetMyBus nudges you at exactly the right moment — not too early, never late — calculated using live pedestrian routing.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      number: "03", color: "#F59E0B",
      title: "Board & Pay Cashless",
      body: "Scan the conductor's ETM QR code or the onboard screen to pay by UPI. Get a digital receipt instantly.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="3"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="7" y1="15" x2="7.01" y2="15"/>
        </svg>
      ),
    },
  ],
  owners: [
    {
      number: "01", color: "#34D399",
      title: "Register Your Bus",
      body: "Fill the short form — name, route, phone. A GetMyBus representative contacts you within 24 hours to schedule installation.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      ),
    },
    {
      number: "02", color: "#0A84FF",
      title: "We Equip Your Bus — Free",
      body: "Our team installs GPS, Android ETM device, and a smart cabin display screen. Zero upfront cost. Hardware is paid back from your ad earnings.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="12" rx="2"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/>
        </svg>
      ),
    },
    {
      number: "03", color: "#A78BFA",
      title: "Earn Every Month",
      body: "From day one, brands pay to advertise on your screen. You receive ₹2,500–₹3,500 directly to your account every month. No effort required.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
  ],
  advertisers: [
    {
      number: "01", color: "#F59E0B",
      title: "Choose Your Corridors",
      body: "Select the Kerala highway routes that match your target audience — by district, city pair, or the full state network.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
      ),
    },
    {
      number: "02", color: "#0A84FF",
      title: "Upload Creative & Set Budget",
      body: "Upload your video or static image ad. Set a CPM budget or daily spend cap. Our system queues campaigns intelligently across the fleet.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
      ),
    },
    {
      number: "03", color: "#34D399",
      title: "Go Live in 24 Hours",
      body: "Your ad appears on in-bus screens across selected routes. Real-time play analytics and impression reports delivered to your dashboard.",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
  ],
};

export default function HowItWorks({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [activeTab, setActiveTab] = useState<Audience>("commuters");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLight = theme === "light";
  const steps = flows[activeTab];
  const activeColor = tabs.find(t => t.id === activeTab)?.color ?? "#0A84FF";

  return (
    <section ref={ref} className="relative w-full themed-bg py-20 px-6 md:px-12 overflow-hidden border-t themed-divider">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{ background: `radial-gradient(ellipse, ${activeColor} 0%, transparent 70%)`, transition: "background 0.5s ease" }} />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
            Simple by design
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight">
            How it works
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-12 px-4"
        >
          <div className={`flex items-center rounded-xl sm:rounded-2xl border p-0.5 sm:p-1 gap-0.5 sm:gap-1 ${isLight ? "bg-slate-100 border-slate-200" : "bg-white/[0.04] border-white/[0.08]"}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-[10px] sm:rounded-xl text-[11px] sm:text-[12px] font-medium tracking-normal sm:tracking-wide transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-white"
                    : isLight ? "text-slate-500 hover:text-slate-700" : "text-white/40 hover:text-white/70"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-[10px] sm:rounded-xl"
                    style={{ background: tab.color }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col md:flex-row items-stretch md:items-start gap-0 w-full"
          >
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex-1 flex flex-col md:flex-row items-center md:items-start">
                {/* Step card */}
                <div className="flex-1 w-full flex flex-col items-center text-center px-4 sm:px-6 py-6 md:py-8">
                  {/* Number circle */}
                  <div className="relative mb-5">
                    <motion.div
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 3, delay: 0.5 + idx * 0.3, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: step.color, filter: "blur(4px)" }}
                    />
                    <div
                      className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: `${step.color}40`, background: `${step.color}12`, color: step.color }}
                    >
                      {step.icon}
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-white"
                      style={{ background: step.color }}
                    >
                      {idx + 1}
                    </div>
                  </div>
                  <h3 className="text-[16px] sm:text-[17px] font-normal themed-text mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-[12px] sm:text-[13px] themed-text-muted leading-relaxed font-normal max-w-[280px] sm:max-w-[220px]">{step.body}</p>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center justify-center self-stretch pt-6">
                      <div className="relative w-16 h-[1px] themed-divider border-t overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: 0.8 + idx * 0.2, ease: "easeInOut" }}
                          style={{ background: `linear-gradient(to right, ${step.color}, rgba(10,132,255,0.2))` }}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.6 + idx * 0.2 }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0"
                          style={{ borderLeft: `5px solid ${step.color}80`, borderTop: "3px solid transparent", borderBottom: "3px solid transparent" }}
                        />
                      </div>
                    </div>
                    <div className="flex md:hidden items-center justify-center w-full my-2">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 32, opacity: 0.35 }}
                        transition={{ duration: 0.6, delay: 0.6 + idx * 0.18 }}
                        className="w-[1px]"
                        style={{ background: `linear-gradient(to bottom, ${step.color}, ${steps[idx + 1]?.color ?? step.color})` }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

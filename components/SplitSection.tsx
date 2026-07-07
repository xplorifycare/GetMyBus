"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const translations = {
  EN: {
    left_label: "The old way",
    left_lines: ["Blind waiting at bus stops", "No live tracking available", "No card/UPI payment options", "Arguments over coin changes"],
    right_label: "With GetMyBus",
    right_lines: ["Live GPS tracking & ETAs", "UPI QR & Card ticketing", "Digital receipts on phone", "Unified passenger updates"],
  },
  ML: {
    left_label: "പഴയ രീതി",
    left_lines: ["ബസ് വരുന്നത് അറിയാതെ കാത്തുനിൽപ്പ്", "തത്സമയ വിവരങ്ങൾ ലഭ്യമല്ല", "കാർഡും യുപിഐയും ഇല്ല", "ചില്ലറ പൈസ തർക്കങ്ങൾ"],
    right_label: "GetMyBus-നോടൊപ്പം",
    right_lines: ["തത്സമയ ജിപിഎസ് വിവരങ്ങൾ", "യുപിഐ ക്യുആർ & ഡിജിറ്റൽ ടിക്കറ്റ്", "ഫോണിൽ ഡിജിറ്റൽ റെസീപ്റ്റ്", "കൃത്യമായ സമയ വിവരങ്ങൾ"],
  },
};

export default function SplitSection({ lang = "EN", theme = "dark" }: { lang?: "EN" | "ML"; theme?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const t = translations[lang];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-t themed-divider"
      style={{ minHeight: "60vh" }}
    >
      <div className="flex flex-col md:flex-row w-full h-full">

        {/* LEFT — Dark "Before" panel */}
        <motion.div
          initial={{ x: -50, opacity: 0, filter: "blur(10px)", rotateY: 10 }}
          animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)", rotateY: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            transformOrigin: "right center", 
            transformStyle: "preserve-3d",
            borderRight: theme === "light" ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.04)" 
          }}
          className={`relative flex-1 flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 py-12 md:py-24 ${
            theme === "light" ? "bg-[#e5e7eb]" : "bg-[#060608]"
          }`}
        >
          {/* Left ambient */}
          <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />

          <p className={`text-[10px] font-medium tracking-[0.15em] uppercase mb-4 ${
            theme === "light" ? "text-black/35" : "text-white/20"
          }`}>
            {t.left_label}
          </p>
          <ul className="space-y-4">
            {t.left_lines.map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Cross icon */}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  theme === "light" ? "bg-black/[0.05]" : "bg-white/[0.06]"
                }`}>
                  <svg className={`w-2.5 h-2.5 ${theme === "light" ? "text-black/35" : "text-white/25"}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className={`text-[15px] font-normal line-through ${
                  theme === "light" ? "text-black/40 decoration-black/25" : "text-white/30 decoration-white/15"
                }`}>
                  {line}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CENTER DIVIDER — animated pill */}
        <div className="hidden md:flex flex-col items-center justify-center relative z-10 px-0" style={{ minWidth: 56 }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
            className="w-10 h-10 rounded-full bg-[#0A84FF] flex items-center justify-center shadow-[0_0_30px_rgba(10,132,255,0.3)] border-2 border-[#0A84FF]/30"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* RIGHT — Warm "After" panel */}
        <motion.div
          initial={{ x: 50, opacity: 0, filter: "blur(10px)", rotateY: -10 }}
          animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)", rotateY: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            transformOrigin: "left center", 
            transformStyle: "preserve-3d",
            background: theme === "light" ? "#ffffff" : "linear-gradient(135deg, #0A0A0B 0%, #0d1117 50%, #081020 100%)" 
          }}
          className="relative flex-1 flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 py-12 md:py-24"
        >
          {/* Blue ambient on right */}
          <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-[#0A84FF]/[0.05] rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />

          <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#0A84FF] mb-4">
            {t.right_label}
          </p>
          <ul className="space-y-4">
            {t.right_lines.map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Check icon */}
                <span className="w-5 h-5 rounded-full bg-[#0A84FF]/15 border border-[#0A84FF]/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-[#0A84FF]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className={`text-[15px] font-normal ${
                  theme === "light" ? "text-black/85" : "text-white/80"
                }`}>
                  {line}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

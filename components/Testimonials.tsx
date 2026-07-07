"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function Testimonials({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const testimonials = [
    {
      initials: "SG",
      name: "Suresh G.",
      location: "Conductor, Ernakulam",
      stars: 5,
      text: "The digital ETM ticket printers and UPI QR codes have made ticketing fast and eliminated disputes over cash change.",
    },
    {
      initials: "NM",
      name: "Nithin M.",
      location: "Daily Commuter, Kozhikode",
      stars: 5,
      text: "I track local bus timings live while at work, so I can step out exactly when the bus approaches. It saves me 20 minutes daily.",
    },
    {
      initials: "PK",
      name: "Priya K.",
      location: "Commuter, Thrissur",
      stars: 5,
      text: "I love tracking my bus live on the GetMyBus app. I only walk to the stop when it is 3 minutes away.",
    },
    {
      initials: "SV",
      name: "Sneha V.",
      location: "College Student, Kochi",
      stars: 5,
      text: "As a daily student traveler, tap-and-pay cashless ticketing is a lifesaver. I scan the UPI QR code and my ticket prints instantly.",
    },
    {
      initials: "GP",
      name: "Gopan P.",
      location: "Commuter, Alappuzha",
      stars: 5,
      text: "The onboard smart screens displaying next-stop ETAs and transit alerts are incredibly helpful, especially for senior citizens.",
    },
    {
      initials: "AS",
      name: "Arjun S.",
      location: "Commuter, Palakkad",
      stars: 5,
      text: "UPI QR ticketing is incredibly convenient. I just scan and pay. I don't have to carry exact change anymore.",
    },
  ];

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
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

  const Stars = ({ count }: { count: number }) => (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="relative w-full themed-bg py-24 px-6 md:px-12 select-none border-t themed-divider overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#0A84FF]/[0.03] rounded-full blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[#A78BFA]/[0.02] rounded-full blur-[110px] pointer-events-none animate-float-delayed" />

      <div className="relative max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
            Ecosystem Feedback
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight">
            What our partners say
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="group"
            >
              {/* Glassmorphism Testimonial card */}
              <div
                className={`h-full border rounded-[20px] p-7 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                  theme === "light"
                    ? "bg-white/[0.6] hover:bg-white/[0.85] border-black/[0.06] hover:border-[#0A84FF]/25 shadow-md"
                    : "bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.06] hover:border-[#0A84FF]/20 shadow-[0_8px_30px_rgb(0,0,0,0.25)]"
                }`}
              >
                {/* Accent border highlight */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-[#0A84FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Stars count={test.stars} />
                <p className={`text-[13px] leading-relaxed mb-6 font-normal ${
                  theme === "light" ? "text-black/80" : "text-white/75"
                }`}>
                  &ldquo;{test.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#0A84FF] font-bold text-xs flex items-center justify-center select-none uppercase">
                    {test.initials}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold themed-text leading-none mb-0.5">{test.name}</span>
                    <span className="text-[10px] themed-text-sub font-normal">{test.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── FAQ Section with animated left accent bar ──────────────────────────────
export function FAQSection({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is GetMyBus and how does it help daily commuters?",
      answer: "GetMyBus is a public transit digitisation platform in Kerala. We equip private passenger buses with live GPS tracking systems, cabin smart screens, and digital ETM ticketing machines to make daily travel predictable, comfortable, and modern.",
    },
    {
      question: "How can I track my bus in real-time?",
      answer: "You can download the GetMyBus app to view live bus locations, check town schedules, and see accurate arrival ETAs updated every 4 seconds via high-accuracy GPS trackers.",
    },
    {
      question: "How do I pay cashless using UPI?",
      answer: "When boarding, you can scan the dynamic UPI QR code generated on the conductor's handheld ETM machine. Pay using any UPI app (like GPay, PhonePe, or Paytm) to receive an instant printed ticket receipt.",
    },
    {
      question: "What information is displayed on the onboard smart screens?",
      answer: "The smart TV screens inside the cabin display next-stop announcements, estimated arrival times, regional weather alerts, public safety warnings, and general infotainment so you never miss your stop.",
    },
  ];

  return (
    <section className="relative w-full themed-bg py-24 px-6 md:px-12 select-none border-t themed-divider text-left overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-[#0A84FF]/[0.02] rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      <div className="relative max-w-3xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="mb-16 text-center"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
            Got questions?
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight">
            Frequently Asked
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="space-y-0"
        >
          {faqs.map((faq, idx) => (
            <div key={idx} className="relative">
              {/* Animated left accent bar */}
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    key="bar"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#0A84FF] rounded-full faq-accent-bar"
                  />
                )}
              </AnimatePresence>

              <div className={`border-b themed-divider py-5 pl-5 transition-all duration-200 ${openIdx === idx ? (theme === "light" ? "bg-black/[0.02]" : "bg-white/[0.02]") + " rounded-r-[8px]" : ""}`}>
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-[15px] font-medium themed-text leading-normal select-none pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openIdx === idx ? 45 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="themed-text-sub text-[22px] font-normal leading-none select-none flex-shrink-0 w-6 h-6 flex items-center justify-center"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-[13px] themed-text-muted leading-relaxed pt-4 select-text pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

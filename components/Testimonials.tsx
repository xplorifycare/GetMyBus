"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <section className={`relative w-full py-20 px-6 md:px-12 select-none border-t themed-divider overflow-hidden text-center ${
      isLight ? "bg-white" : "bg-[#060810]"
    }`}>
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0A84FF]/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10">
        <span className="text-[10px] font-semibold text-[#0A84FF] tracking-[0.2em] uppercase mb-3 block">
          Pilot Launching Q3 2026
        </span>
        <h2 className="text-[clamp(24px,3.5vw,36px)] font-normal themed-text tracking-tight mb-4 leading-tight">
          Be among our first riders
        </h2>
        <p className="text-[14px] themed-text-muted max-w-md mx-auto font-light leading-relaxed">
          We are launching our initial transit telemetry pilot cohort on the Kollam–Thiruvananthapuram corridor. Track routes in real time and pay cashless.
        </p>
      </div>
    </section>
  );
}

// ── FAQ Section with animated left accent bar ──────────────────────────────
export function FAQSection({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      question: "How much can a Kerala private bus owner earn from GetMyBus?",
      answer: "A private bus owner on a Kerala highway corridor with 300 daily passengers can earn ₹2,500 to ₹3,500 per month from in-bus advertising revenue through GetMyBus. This is passive income — no operational changes required. The hardware is installed at no upfront cost and paid back from ad earnings over approximately 8 months.",
    },
    {
      question: "What is GetMyBus and how does it help Kerala bus commuters?",
      answer: "GetMyBus is a Kerala transit app that tracks private buses live on a map, updated every 4 seconds. Commuters see exactly when their bus will arrive, get smart walk-time alerts, and pay by UPI directly from the conductor's ETM device. GetMyBus is launching on the Kollam–Thiruvananthapuram corridor in Q3 2026.",
    },
    {
      question: "How does live bus tracking work in the GetMyBus app?",
      answer: "GetMyBus uses an Android ETM device installed on each bus. The ETM transmits GPS coordinates to the GetMyBus backend every 4 seconds over 4G. Commuters see live bus positions on the app map, receive smart alerts when their bus is approaching, and can view next stop and estimated arrival time in real time.",
    },
    {
      question: "Is GetMyBus available in Kerala?",
      answer: "GetMyBus is launching its pilot on the Kollam–Thiruvananthapuram corridor in Q3 2026, starting with 20 private buses. Commuters can join the waitlist at getmybus.in to be notified when their route goes live. Bus operators on the Kollam–TVM corridor can register now to join the founding pilot cohort.",
    },
    {
      question: "How can private bus owners join GetMyBus?",
      answer: "Private bus owners can register at getmybus.in. GetMyBus installs an ETM, GPS tracker, and in-bus TV screen at no upfront cost. Hardware is recovered from the owner's share of advertising revenue over approximately 8 months. Owners earn 50% of ad revenue generated on their bus, paid monthly on the 5th of each month.",
    },
    {
      question: "How to advertise on buses in Kerala?",
      answer: "Brands can display route-targeted, geofenced video commercials on GetMyBus onboard displays to connect with passengers along busy commuter routes like the Kollam–Trivandrum corridor. You can set up campaigns, target by specific routes or times of day, and track impressions starting at CPM rates of ₹35 per 1,000 plays.",
    },
    {
      question: "What is the Priyadarshini scheme impact on private buses?",
      answer: "The proposed government schemes highlight the critical need for fleet modernisation. GetMyBus offers private operators an immediate, self-funded digitisation path with ETM ticketing and ad screens, improving passenger satisfaction and generating passive revenue without relying on government subsidies.",
    },
    {
      question: "What is an ETM machine in Kerala buses?",
      answer: "An ETM (Electronic Ticket Machine) is a handheld smart device used by bus conductors. GetMyBus deploys Android-based ETMs that handle cashless transactions (like dynamic UPI QR code generation) and print instant ticket receipts. They also function as the bus's telemetry gateway, broadcasting live GPS location every 4 seconds.",
    }
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
                <motion.div
                  initial="collapsed"
                  animate={openIdx === idx ? "open" : "collapsed"}
                  variants={{
                    open: { height: "auto", opacity: 1 },
                    collapsed: { height: 0, opacity: 0 }
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[13px] themed-text-muted leading-relaxed pt-4 select-text pr-8">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

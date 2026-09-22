"use client";

import { useState } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPlansSection from "@/components/LandingPlansSection";
import PartnerSection from "@/components/PartnerSection";
import { BusOwnerPlanCard } from "@/components/BusOwnerPlansFlow";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";
import { motion, AnimatePresence } from "framer-motion";

export default function PlansPage() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedPlanMessage, setSelectedPlanMessage] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isLight = theme === "light";

  const handleSelectPlan = (plan: BusOwnerPlanCard) => {
    playClickSound();
    const message = `Hi GetMyBus team, I would like to onboard my private bus with ${plan.title} (${plan.code}) under the One-Time Capex model. Please share route onboarding details and hardware procurement steps!`;
    setSelectedPlanMessage(message);

    // Smooth scroll down to the onboarding form
    const el = document.getElementById("onboard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const operatorFaqs = [
    {
      q: "How does the One-Time Capex equipment ownership model work?",
      q_ml: "ഒറ്റത്തവണ ഉപകരണ വാങ്ങൽ (One-Time Capex) എങ്ങനെയാണ് പ്രവർത്തിക്കുന്നത്?",
      a: "You purchase and retain 100% ownership of the transit hardware (display screens, GPS telematics, and POS ticketing terminals). There are zero rental lock-ins or equipment fees, and you receive the full ₹2,500/month guaranteed advertising rent from Month 1.",
      a_ml: "എല്ലാ ഹാർഡ്‌വെയർ ഉപകരണങ്ങളുടെയും പൂർണ്ണ ഉടമസ്ഥാവകാശം ബസ് ഉടമയ്ക്കായിരിക്കും. യാതൊരു വാടക ബാധ്യതകളും ഇല്ലാതെ ആദ്യ മാസം മുതൽ തന്നെ പൂർണ്ണ പരസ്യ വാടക തുക കൈപ്പറ്റാം.",
    },
    {
      q: "What if our bus already has a normal roof TV or Android Smart TV?",
      q_ml: "ബസിൽ നിലവിൽ നോർമൽ ടിവിയോ ആൻഡ്രോയിഡ് സ്മാർട്ട് ടിവിയോ ഉണ്ടെങ്കിലോ?",
      a: "We reuse your existing screen! If you have a Smart TV (Plan Alpha), we plug in only the GPS Puck and 4G Dongle (15-min setup). If you have a Normal In-Bus TV (Plan Beta), we tape our 4G Quad-Core TV Box behind the display to feed HDMI video. Reusing your TV saves up to ₹9,350 in capex.",
      a_ml: "നിലവിലുള്ള ടിവി തന്നെ ഉപയോഗിക്കാം! സ്മാർട്ട് ടിവി ഉണ്ടെങ്കിൽ പ്ലാൻ ആൽഫ വഴി 15 മിനിറ്റിൽ ഇൻസ്റ്റാൾ ചെയ്യാം. നോർമൽ ടിവി ആണെങ്കിൽ ഞങ്ങളുടെ 4G ആൻഡ്രോയിഡ് ബോക്സ് ഘടിപ്പിച്ചാൽ മതി. ₹9,350 വരെ ലാഭിക്കാം.",
    },
    {
      q: "Can our conductor keep their existing route ticketing machine?",
      q_ml: "കണ്ടക്ടർക്ക് നിലവിലുള്ള ടിക്കറ്റ് മെഷീൻ തന്നെ ഉപയോഗിക്കാമോ?",
      a: "Yes! With Plan Smart-Sync or Plan AIS-140, your conductor continues issuing tickets exactly as they do today. Our system connects via cloud API to your route data and AIS-140 GPS, so there is zero operational friction for your crew.",
      a_ml: "തീർച്ചയായും! പ്ലാൻ സ്മാർട്ട്-സിങ്ക് അല്ലെങ്കിൽ പ്ലാൻ AIS-140 വഴി നിലവിലുള്ള ഇ.ടി.എം മെഷീൻ തന്നെ ഉപയോഗിക്കാം. ജീവനക്കാരുടെ ജോലിരീതിയിൽ ഒരു മാറ്റവും വരുത്തേണ്ടതില്ല.",
    },
    {
      q: "When and how is the monthly ad rent paid to the owner?",
      q_ml: "പ്രതിമാസ പരസ്യ വാടക എപ്പോൾ, എങ്ങനെയാണ് ലഭിക്കുന്നത്?",
      a: "Guaranteed monthly rent is transferred directly to your verified bank account via NEFT/IMPS by the 5th of every month. You receive an automated WhatsApp settlement statement detailing route uptime and revenue.",
      a_ml: "ഓരോ മാസവും 5-ാം തീയതിക്ക് മുൻപായി ഉടമയുടെ ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് പണം ട്രാൻസ്ഫർ ചെയ്യും. കൃത്യമായ കണക്കുകൾ വാട്സ്ആപ്പിൽ ലഭിക്കുകയും ചെയ്യും.",
    },
    {
      q: "Who handles internet data and maintenance?",
      q_ml: "ഇന്റർനെറ്റ് ഡാറ്റയും മെയിന്റനൻസും ആരാണ് നോക്കുന്നത്?",
      a: "GetMyBus manages remote SIM telemetry, over-the-air firmware updates, and ad playlist scheduling. Our certified field technician handles hardware replacement under the 1-year equipment warranty.",
      a_ml: "4G സിം ഡാറ്റ, സോഫ്റ്റ്‌വെയർ അപ്ഡേറ്റുകൾ, പരസ്യങ്ങൾ ഷെഡ്യൂൾ ചെയ്യൽ എന്നിവ GetMyBus നേരിട്ട് കൈകാര്യം ചെയ്യുന്നു. 1 വർഷത്തെ വാറന്റിയും സർവീസും ലഭ്യമാണ്.",
    },
  ];

  return (
    <main
      className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 overflow-x-hidden w-full max-w-full ${
        isLight ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"
      } ${lang === "ML" ? "malayalam-font" : ""}`}
    >
      {/* Background noise and gradient accents */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div
        className="absolute top-[8%] left-[15%] w-[65vw] h-[65vw] rounded-full overflow-hidden pointer-events-none z-0"
        aria-hidden
      >
        <div
          className="w-full h-full opacity-10 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #0A84FF 0%, #10B981 40%, transparent 70%)",
          }}
        />
      </div>

      {/* 1. Global Navbar */}
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {/* 2. Hero Header for Plans Page */}
      <div className="relative z-10 max-w-5xl mx-auto pt-28 sm:pt-36 pb-8 sm:pb-14 px-5 sm:px-6">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 sm:mb-8 border backdrop-blur-md"
            style={{
              borderColor: isLight ? "rgba(10, 132, 255, 0.25)" : "rgba(10, 132, 255, 0.35)",
              background: isLight ? "rgba(10, 132, 255, 0.08)" : "rgba(10, 132, 255, 0.12)",
              color: isLight ? "#0066cc" : "#60a5fa",
            }}
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
            {lang === "ML" ? "കേരള ഫ്ലീറ്റ് ഡിജിറ്റലൈസേഷൻ" : "Kerala Fleet Modernization"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.2] mb-5 sm:mb-6 ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {lang === "ML" ? (
              <>
                ബസ് സർവീസുകൾ ഡിജിറ്റലാവുന്നു,
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] via-teal-400 to-emerald-400 font-black">
                  ഉടമകൾക്ക് ₹2,500/മാസം വാടകയും!
                </span>
              </>
            ) : (
              <>
                Equip Your Bus Fleet.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] via-teal-400 to-emerald-400 font-black">
                  Earn ₹2,500/Month Passive Rent.
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className={`text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto mb-8 sm:mb-10 ${
              isLight ? "text-slate-600" : "text-white/60"
            }`}
          >
            {lang === "ML"
              ? "യാത്രക്കാർക്കായി സ്മാർട്ട് ടിവി റൂട്ട് സ്ക്രീനുകൾ, കണ്ടക്ടർമാർക്ക് ഡിജിറ്റൽ യു.പി.ഐ ടിക്കറ്റിംഗ്, തത്സമയ ജി.പി.എസ് ട്രാക്കിംഗ്. മാസാന്ത പരസ്യ വാടകയിൽ നിന്ന് തിരിച്ചടക്കാവുന്ന ₹0 മുൻകൂർ ചെലവുള്ള പ്ലാനുകൾ തിരഞ്ഞെടുക്കൂ."
              : "Upgrade your Kerala private bus with 1080p passenger entertainment displays, theft-proof UPI ETM ticketing, and live GPS telemetry. Choose a zero-out-of-pocket plan auto-deducted from guaranteed monthly ad rent."}
          </motion.p>

          {/* Quick Value Metrics: Styled like the gold-standard reference pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-xl mx-auto"
          >
            <div className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 border backdrop-blur-md ${
              isLight
                ? "border-blue-200 bg-blue-50/80 text-blue-700"
                : "border-[#0A84FF]/25 bg-[#0A84FF]/10 text-[#60a5fa]"
            }`}>
              <span className="text-xs font-bold">₹2,500/mo</span>
              <span className={`text-[11px] ${isLight ? "text-blue-900/60" : "text-white/50"}`}>Guaranteed Rent</span>
            </div>

            <div className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 border backdrop-blur-md ${
              isLight
                ? "border-emerald-200 bg-emerald-50/80 text-emerald-700"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
            }`}>
              <span className="text-xs font-bold">100%</span>
              <span className={`text-[11px] ${isLight ? "text-emerald-900/60" : "text-white/50"}`}>Asset Ownership</span>
            </div>

            <div className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 border backdrop-blur-md ${
              isLight
                ? "border-slate-200 bg-white/80 text-slate-700"
                : "border-white/[0.08] bg-white/[0.04] text-white/80"
            }`}>
              <span className="text-xs font-bold">15 Mins</span>
              <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-white/50"}`}>Depot Setup</span>
            </div>

            <div className={`px-3.5 py-1.5 rounded-full flex items-center gap-2 border backdrop-blur-md ${
              isLight
                ? "border-slate-200 bg-white/80 text-slate-700"
                : "border-white/[0.08] bg-white/[0.04] text-white/80"
            }`}>
              <span className="text-xs font-bold">Zero</span>
              <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-white/50"}`}>Lock-In Contract</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. Curated Plans Grid (Admin-controlled, hide redundant sub-header) */}
      <div className="relative z-10">
        <LandingPlansSection theme={theme} onSelectPlan={handleSelectPlan} hideHeader={true} />
      </div>

      {/* 4. Fleet Benefits Section */}
      <div className="relative z-10 max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 tracking-[0.2em] uppercase mb-2 block">
            Why Kerala Bus Owners Partner with GetMyBus
          </span>
          <h2
            className={`text-xl sm:text-3xl font-bold tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Engineered Specifically for Private Bus Fleet Realities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              ),
              title: "Guaranteed Rent by 5th",
              desc: "Never worry about advertiser sales cycles. We pay you fixed monthly rent directly into your bank account on the 5th of every month.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A84FF]">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M9 6h6" />
                  <path d="M9 10h6" />
                </svg>
              ),
              title: "Eliminate Conductor Pilferage",
              desc: "Digital printed receipts with live trip ticket audit ensure 100% of collected passenger cash reaches your account.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              ),
              title: "Live Smartphone Fleet App",
              desc: "Open your owner app to view current speed, live passenger counts, diesel consumption, and route punctuality in real-time.",
            },
          ].map((benefit, i) => (
            <div
              key={i}
              className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                isLight
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-white/[0.03] border-white/[0.06] hover:border-white/15"
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 sm:mb-4 border border-white/10">
                {benefit.icon}
              </div>
              <h3 className={`text-sm sm:text-base font-bold mb-1.5 sm:mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                {benefit.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Operator FAQ Accordion */}
      <div className="relative z-10 max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 px-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#0A84FF] tracking-[0.2em] uppercase mb-2 block">
            Frequently Asked Questions
          </span>
          <h2
            className={`text-xl sm:text-3xl font-bold tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Everything Fleet Owners Need to Know
          </h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {operatorFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const question = lang === "ML" ? faq.q_ml : faq.q;
            const answer = lang === "ML" ? faq.a_ml : faq.a;

            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? isLight
                      ? "bg-white border-blue-200 shadow-sm"
                      : "bg-white/[0.05] border-[#0A84FF]/40 shadow-lg"
                    : isLight
                      ? "bg-white/60 border-slate-200 hover:bg-white"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                }`}
              >
                <button
                  onClick={() => {
                    playClickSound();
                    setOpenFaq(isOpen ? null : index);
                  }}
                  onMouseEnter={() => playHoverSound(0.005)}
                  className="w-full py-3.5 sm:py-4 px-3.5 sm:px-5 text-left flex items-center justify-between gap-3 sm:gap-4 font-semibold text-xs sm:text-base"
                >
                  <span className={isLight ? "text-slate-900" : "text-white"}>{question}</span>
                  <span
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? "rotate-180 bg-[#0A84FF] text-white"
                        : isLight
                          ? "bg-slate-100 text-slate-500"
                          : "bg-white/10 text-white/60"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-3.5 pb-4 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-sm leading-relaxed border-t border-black/[0.04] dark:border-white/[0.04]"
                    >
                      <p className={isLight ? "text-slate-600" : "text-white/70"}>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Onboarding Form Section */}
      <div id="onboard" className="relative z-10 pt-6 sm:pt-10 px-3 sm:px-6">
        <PartnerSection
          theme={theme}
          defaultRole="operator"
          defaultMessage={selectedPlanMessage}
        />
      </div>

      {/* 7. Footer & ScrollToTop */}
      <Footer theme={theme} />
      <ScrollToTop />
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";
import HeroWave from "@/components/ui/dynamic-wave-canvas-background";

export default function PartnerSection({ 
  theme = "dark",
  defaultRole = "operator",
}: { 
  theme?: "dark" | "light";
  defaultRole?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    role: defaultRole,
    message: "",
  });

  useEffect(() => {
    if (defaultRole) {
      setFormState((prev) => ({ ...prev, role: defaultRole }));
    }
  }, [defaultRole]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    { value: "commuter", label: "Commuter / Daily Passenger" },
    { value: "operator", label: "Private Bus Operator" },
    { value: "advertiser", label: "Brand / Business Advertiser" },
    { value: "agency", label: "Marketing / Ad Agency" },
  ];

  const selectedRoleLabel = roles.find(r => r.value === formState.role)?.label ?? "";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        playSuccessChime();
      } else {
        alert(data.error || "Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      alert("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="partner" 
      ref={ref}
      className="relative w-full themed-bg py-24 px-6 md:px-12 overflow-hidden border-t themed-divider"
    >
      {/* Dynamic Wave Canvas Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
        <HeroWave theme={theme} opacity={0.65} />
      </div>

      {/* Background orbs */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#0A84FF]/[0.025] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 animate-mesh-blob-3" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#34D399]/[0.02] rounded-full blur-[80px] pointer-events-none animate-mesh-blob-4" />

      <div className="relative max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left column: Descriptive */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="lg:col-span-6 flex flex-col text-left space-y-6"
        >
          <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase">
            Work with GetMyBus
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight leading-[1.1]">
            Let&apos;s build a smarter Kerala transit, together.
          </h2>
          <p className="text-[15px] themed-text-muted leading-relaxed font-normal max-w-lg">
            We are digitising Kerala&apos;s private transit system to improve daily commutes. Get in touch to partner with us, report route issues, or ask questions.
          </p>

          <ul className="space-y-4 pt-4 max-w-lg">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-2.5 h-2.5 text-[#0A84FF]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="text-[14px] themed-text font-medium">For Commuters & Passengers</span>
                <span className="text-[12px] themed-text-sub font-normal">Report bus delays, request smart ETM digital routes, or share transit feedback.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#34D399]/10 border border-[#34D399]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-2.5 h-2.5 text-[#34D399]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="text-[14px] themed-text font-medium">For Private Bus Fleet Operators</span>
                <span className="text-[12px] themed-text-sub font-normal">Equip your fleet with live GPS telemetry trackers and conductor ETM billing machines.</span>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Right column: Form Card */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 60, filter: "blur(10px)", rotateX: 12 }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            className="w-full max-w-lg themed-card border rounded-[24px] p-6 sm:p-8 shadow-2xl backdrop-blur-md relative"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#34D399]/15 border border-[#34D399]/25 flex items-center justify-center text-[#34D399] mb-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] themed-text font-normal tracking-tight">Inquiry Submitted!</h3>
                  <p className="text-[13px] themed-text-sub leading-relaxed max-w-xs font-normal">
                    Thank you for reaching out. A GetMyBus transit specialist will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="flex flex-col space-y-4 text-left">
                  <h3 className="text-[18px] themed-text font-normal mb-1 tracking-tight">Inquire or Partner</h3>
                  
                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="name" className="text-[11px] themed-text-sub uppercase font-medium tracking-wider">Your Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      onFocus={() => playHoverSound(0.01)}
                      className={`h-10 border themed-divider rounded-[8px] px-3.5 text-[13px] themed-text focus:outline-none focus:border-[#0A84FF] transition-all ${
                        theme === "light" ? "bg-black/[0.03] focus:bg-black/[0.05] border-black/[0.08]" : "bg-white/[0.04] focus:bg-white/[0.06] border-white/[0.08]"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="email" className="text-[11px] themed-text-sub uppercase font-medium tracking-wider">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        onFocus={() => playHoverSound(0.01)}
                        className={`h-10 border themed-divider rounded-[8px] px-3.5 text-[13px] themed-text focus:outline-none focus:border-[#0A84FF] transition-all ${
                          theme === "light" ? "bg-black/[0.03] focus:bg-black/[0.05] border-black/[0.08]" : "bg-white/[0.04] focus:bg-white/[0.06] border-white/[0.08]"
                        }`}
                        placeholder="name@company.com"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="phone" className="text-[11px] themed-text-sub uppercase font-medium tracking-wider">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        onFocus={() => playHoverSound(0.01)}
                        className={`h-10 border themed-divider rounded-[8px] px-3.5 text-[13px] themed-text focus:outline-none focus:border-[#0A84FF] transition-all ${
                          theme === "light" ? "bg-black/[0.03] focus:bg-black/[0.05] border-black/[0.08]" : "bg-white/[0.04] focus:bg-white/[0.06] border-white/[0.08]"
                        }`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  {/* Custom Role Dropdown Select */}
                  <div className="flex flex-col space-y-1 relative" ref={dropdownRef}>
                    <label className="text-[11px] themed-text-sub uppercase font-medium tracking-wider">You are a...</label>
                    
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setDropdownOpen(!dropdownOpen);
                      }}
                      onMouseEnter={() => playHoverSound(0.01)}
                      className={`h-10 border themed-divider rounded-[8px] px-3.5 text-[13px] themed-text flex items-center justify-between cursor-pointer transition-all text-left ${
                        theme === "light" 
                          ? "bg-black/[0.03] hover:bg-black/[0.05] focus:border-[#0A84FF] border-black/[0.08]" 
                          : "bg-white/[0.04] hover:bg-white/[0.06] focus:border-[#0A84FF] border-white/[0.08]"
                      }`}
                    >
                      <span>{selectedRoleLabel}</span>
                      <svg 
                        className={`w-4 h-4 text-white/45 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-[#0A84FF]" : ""}`} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Custom Dropdown Options Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute left-0 right-0 z-50 rounded-[12px] border p-1 shadow-2xl backdrop-blur-xl ${
                            theme === "light"
                              ? "bg-white/95 border-black/[0.06] shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                              : "bg-[#0f111a]/95 border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                          }`}
                          style={{ top: "100%", marginTop: "6px" }}
                        >
                          {roles.map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() => {
                                playClickSound();
                                setFormState({ ...formState, role: r.value });
                                setDropdownOpen(false);
                              }}
                              onMouseEnter={() => playHoverSound(0.005)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-[8px] text-[13px] transition-colors flex items-center justify-between ${
                                formState.role === r.value
                                  ? theme === "light"
                                    ? "bg-[#0A84FF]/10 text-[#0A84FF] font-medium"
                                    : "bg-[#0A84FF]/15 text-[#0A84FF] font-medium"
                                  : theme === "light"
                                    ? "text-slate-700 hover:bg-black/[0.03] hover:text-slate-900"
                                    : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                              }`}
                            >
                              <span>{r.label}</span>
                              {formState.role === r.value && (
                                <svg className="w-4 h-4 text-[#0A84FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="message" className="text-[11px] themed-text-sub uppercase font-medium tracking-wider">Message</label>
                    <textarea
                      id="message"
                      rows={3}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      onFocus={() => playHoverSound(0.01)}
                      className={`border themed-divider rounded-[8px] p-3 text-[13px] themed-text focus:outline-none focus:border-[#0A84FF] transition-all resize-none ${
                        theme === "light" ? "bg-black/[0.03] focus:bg-black/[0.05] border-black/[0.08]" : "bg-white/[0.04] focus:bg-white/[0.06] border-white/[0.08]"
                      }`}
                      placeholder={{
                        commuter: "I travel on the Kollam–TVM route and want to track buses live...",
                        operator: "I own X buses on the Y route and want to understand the ad income model...",
                        advertiser: "We want to advertise to commuters on the Kollam–TVM corridor...",
                        agency: "We manage campaigns for a brand targeting Kerala highway routes...",
                      }[formState.role] ?? "Tell us about your fleet or marketing goals..."}
                    />
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className="h-11 bg-[#0A84FF] hover:bg-[#0070e3] disabled:bg-white/10 text-white font-medium text-[13px] rounded-[8px] flex items-center justify-center shadow-lg transition-all duration-200 active:scale-[0.98] select-none mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Submit Partnership Request"
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

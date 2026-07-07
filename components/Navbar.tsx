"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";

export type Lang = "EN" | "ML";

export default function Navbar({ 
  lang, 
  setLang, 
  theme, 
  setTheme 
}: { 
  lang: Lang; 
  setLang: (l: Lang) => void; 
  theme: "dark" | "light"; 
  setTheme: (t: "dark" | "light") => void; 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const btnRef = useRef<HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  // Sync sound settings from localstorage on client-side mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("getmybus_sound_enabled");
      setSoundOn(stored === "true");
    }
  }, []);

  const toggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    localStorage.setItem("getmybus_sound_enabled", String(nextVal));
    if (nextVal) {
      // Small delay to allow localStorage state to be read
      setTimeout(() => playSuccessChime(), 50);
    } else {
      playClickSound();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Track Bus", href: "#commuters" },
    { label: "Bus Owners", href: "#owners" },
    { label: "Advertise", href: "#advertisers" },
    { label: "Contact", href: "#partner" },
  ];

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          isScrolled
            ? theme === "light"
              ? "bg-[#f4f5f7]/85 backdrop-blur-xl text-black border-b border-black/[0.06]"
              : "bg-[#070708]/85 backdrop-blur-xl text-white border-b border-white/[0.06]"
            : theme === "light"
              ? "bg-transparent text-black border-b border-black/[0.04]"
              : "bg-transparent text-white border-b border-white/[0.03]"
        }`}
      >
        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-[#0A84FF] z-50 pointer-events-none transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* Left Logo */}
        <button
          className="flex items-center select-none cursor-pointer focus:outline-none"
          onClick={() => {
            playClickSound();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="GetMyBus — back to top"
        >
          <Image
            src={theme === "dark" ? "/logo_white.png" : "/logo.png"}
            alt="GetMyBus"
            width={140}
            height={40}
            priority
            className="object-contain h-[36px] w-auto transition-all duration-300"
          />
        </button>

        {/* Center Nav Links — Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound(0.01)}
              className={`text-[13px] font-normal transition-colors duration-200 hover:text-[#0A84FF] ${
                theme === "light" ? "text-black/70 hover:text-[#0A84FF]" : "text-white/70 hover:text-[#0A84FF]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Lang Toggle + Sound Toggle + Theme Toggle + Download CTA + Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 ${
              isScrolled || theme === "light"
                ? "border-black/10 bg-black/5 text-black/55 hover:text-black hover:bg-black/10" 
                : "border-white/10 bg-white/5 text-white/55 hover:text-white hover:bg-white/10"
            }`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
          >
            {/* Sun Icon (Visible in Dark theme) */}
            <svg 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${theme === "dark" ? "block" : "hidden"}`} 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            
            {/* Moon Icon (Visible in Light theme) */}
            <svg 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${theme === "light" ? "block" : "hidden"}`} 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Sound Synth Toggle */}
          <button
            onClick={toggleSound}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 ${
              !mounted 
                ? "border-white/10 bg-white/5 text-white/55" 
                : soundOn 
                  ? "border-[#0A84FF]/30 bg-[#0A84FF]/10 text-[#0A84FF]"
                  : isScrolled || theme === "light"
                    ? "border-black/10 bg-black/5 text-black/55 hover:text-black hover:bg-black/10" 
                    : "border-white/10 bg-white/5 text-white/55 hover:text-white hover:bg-white/10"
            }`}
            title={!mounted ? "Interactive sounds loading" : soundOn ? "Mute interactive sounds" : "Enable immersive interactive sounds"}
          >
            <svg 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {/* Speaker base (always visible) */}
              <path d="M11 5L6 9.5H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2l5 4.5V5z" />
              
              {/* Sound waves (visible only when mounted & soundOn) */}
              <path 
                className={`transition-opacity duration-200 ${mounted && soundOn ? "opacity-100" : "opacity-0"}`}
                d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" 
              />

              {/* Mute X (visible only when sound is disabled or not mounted) */}
              <path 
                className={`transition-opacity duration-200 ${!mounted || !soundOn ? "opacity-100" : "opacity-0"}`}
                d="M23 9l-6 6M17 9l6 6" 
              />
            </svg>
          </button>

          {/* EN | ML Language Toggle — ML disabled until built */}
          <div className={`hidden md:flex items-center rounded-full border p-0.5 relative transition-all duration-300 ${isScrolled || theme === "light" ? "border-black/10 bg-black/5" : "border-white/10 bg-white/5"}`}>
            {/* EN: always active */}
            <button
              onClick={() => { setLang("EN"); playClickSound(); }}
              onMouseEnter={() => playHoverSound(0.01)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-300 relative z-10 ${
                lang === "EN" ? "text-white" : isScrolled || theme === "light" ? "text-black/55 hover:text-black/80" : "text-white/60 hover:text-white/80"
              }`}
            >
              {lang === "EN" && (
                <div
                  className="absolute inset-0 bg-[#0A84FF] rounded-full z-[-1] shadow-[0_2px_8px_rgba(10,132,255,0.3)]"
                />
              )}
              EN
            </button>
            {/* ML: disabled — coming soon */}
            <span
              title="Malayalam version coming soon"
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-not-allowed select-none ${
                isScrolled || theme === "light" ? "text-black/20" : "text-white/20"
              }`}
            >
              ML
            </span>
          </div>


          <a
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => playClickSound()}
            onMouseEnter={() => playHoverSound(0.01)}
            style={{ transform: `translate3d(${coords.x}px, ${coords.y}px, 0)` }}
            href="#partner"
            className="hidden md:inline-flex items-center justify-center bg-[#0A84FF] text-white px-4 h-9 font-medium text-[13px] rounded-[8px] transition-all duration-200 ease-out active:scale-[0.96] hover:bg-[#0070e3] hover:shadow-[0_4px_12px_rgba(10,132,255,0.25)] active:shadow-none select-none"
          >
            Join Waitlist
          </a>

          {/* Hamburger — Mobile */}
          <button
            id="hamburger-btn"
            onClick={() => {
              setMenuOpen(!menuOpen);
              playClickSound();
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex flex-col items-center justify-center gap-[4px] sm:gap-[5px] rounded-[8px] transition-colors duration-200 ${
              isScrolled ? "hover:bg-black/5" : "hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              className={`block w-[18px] sm:w-[20px] h-[1.5px] transition-colors ${isScrolled ? "bg-black" : "bg-white"}`}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className={`block w-[18px] sm:w-[20px] h-[1.5px] transition-colors ${isScrolled ? "bg-black" : "bg-white"}`}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              className={`block w-[18px] sm:w-[20px] h-[1.5px] transition-colors ${isScrolled ? "bg-black" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed top-[56px] left-0 right-0 z-40 backdrop-blur-2xl border-b px-6 py-6 flex flex-col gap-2 md:hidden transition-all duration-300 ${
              theme === "light"
                ? "bg-white/95 border-black/[0.06] text-black"
                : "bg-black/90 border-white/[0.08] text-white"
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  playClickSound();
                  setMenuOpen(false);
                }}
                onMouseEnter={() => playHoverSound(0.01)}
                className={`text-[15px] py-3.5 border-b transition-colors duration-200 font-medium tracking-wide ${
                  theme === "light"
                    ? "text-black/75 border-black/[0.05] hover:text-[#0A84FF]"
                    : "text-white/70 border-white/[0.06] hover:text-[#0A84FF]"
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Language Toggle — Allows mobile view users to translate pages */}
            <div className={`flex items-center justify-between py-3.5 border-b ${
              theme === "light" ? "border-black/[0.05]" : "border-white/[0.06]"
            }`}>
              <span className={`text-[13px] font-normal ${theme === "light" ? "text-black/55" : "text-white/40"}`}>
                Language / ഭാഷ
              </span>
              <div className={`flex items-center rounded-full border p-0.5 relative ${
                theme === "light" ? "border-black/10 bg-black/5" : "border-white/10 bg-white/5"
              }`}>
                {(["EN", "ML"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      playClickSound();
                      setMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors duration-300 relative z-10 ${
                      lang === l
                        ? "text-white"
                        : theme === "light"
                          ? "text-black/55 hover:text-black/80"
                          : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {lang === l && (
                      <motion.div
                        layoutId="activeLangMobile"
                        className="absolute inset-0 bg-[#0A84FF] rounded-full z-[-1] shadow-[0_2px_8px_rgba(10,132,255,0.3)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#download"
              onClick={() => {
                playClickSound();
                setMenuOpen(false);
              }}
              onMouseEnter={() => playHoverSound(0.01)}
              className="mt-4 flex items-center justify-center bg-[#0A84FF] text-white h-11 font-medium text-[14px] rounded-[10px] transition-all duration-200 active:scale-[0.97] hover:bg-[#0070e3]"
            >
              Download App
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

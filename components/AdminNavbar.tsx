"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";

export type AdminTab = "leads" | "calculator" | "ad_engine" | "owner_plans" | "landing_plans" | "hardware" | "playbook";

interface AdminNavbarProps {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  isAuthenticated: boolean;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  leadsCount: number;
  onLogout: () => void;
}

export default function AdminNavbar({
  theme,
  setTheme,
  isAuthenticated,
  activeTab,
  setActiveTab,
  leadsCount,
  onLogout,
}: AdminNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync sound settings from localStorage on client-side mount
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

  const navTabs: { id: AdminTab; label: string }[] = [
    { id: "leads", label: `Leads Inbox (${leadsCount})` },
    { id: "landing_plans", label: "🌐 Landing Plans" },
    { id: "owner_plans", label: "Owner Plans Flow" },
    { id: "calculator", label: "Financial Simulator" },
    { id: "ad_engine", label: "Ad Revenue Engine" },
    { id: "hardware", label: "Hardware Planner" },
    { id: "playbook", label: "Day 1 Playbook" },
  ];

  const isLight = theme === "light";

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        isScrolled
          ? isLight
            ? "bg-[#f4f5f7]/85 backdrop-blur-xl text-black border-b border-black/[0.06]"
            : "bg-[#070708]/85 backdrop-blur-xl text-white border-b border-white/[0.06]"
          : isLight
            ? "bg-transparent text-black border-b border-black/[0.04]"
            : "bg-transparent text-white border-b border-white/[0.03]"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-[#0A84FF] z-50 pointer-events-none transition-all duration-100"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Left: Brand Logo */}
      <Link
        href="/"
        onClick={() => playClickSound()}
        className="flex items-center select-none cursor-pointer focus:outline-none"
        aria-label="GetMyBus — back to homepage"
      >
        <Image
          src={theme === "dark" ? "/logo_white.png" : "/logo.png"}
          alt="GetMyBus - Kerala's Private Bus Live GPS Tracking & Ad Network Logo"
          width={140}
          height={40}
          priority
          className="object-contain h-[36px] w-auto transition-all duration-300"
        />
      </Link>

      {/* Center Nav Links — Desktop Minimalist Typography */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center gap-8">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id);
                }}
                onMouseEnter={() => playHoverSound(0.01)}
                className={`relative text-[13px] transition-colors duration-200 select-none ${
                  isActive
                    ? "text-[#0A84FF] font-medium"
                    : isLight
                      ? "text-black/80 font-normal hover:text-[#0A84FF]"
                      : "text-white/80 font-normal hover:text-[#0A84FF]"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeAdminTabUnderline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#0A84FF] rounded-full shadow-[0_0_8px_rgba(10,132,255,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Right: Theme Toggle + Sound Toggle + View Site + CTA Button + Hamburger */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          onMouseEnter={() => playHoverSound(0.01)}
          className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all duration-200 ${
            isScrolled || isLight
              ? "border-black/10 bg-black/5 text-black/75 hover:text-black hover:bg-black/10"
              : "border-white/10 bg-white/5 text-white/75 hover:text-white hover:bg-white/10"
          }`}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
        >
          {/* Sun Icon (Visible in Dark theme) */}
          <svg
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-200 ${theme === "dark" ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
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
              ? "border-white/10 bg-white/5 text-white/75"
              : soundOn
                ? "border-[#0A84FF]/30 bg-[#0A84FF]/10 text-[#0A84FF]"
                : isScrolled || isLight
                  ? "border-black/10 bg-black/5 text-black/75 hover:text-black hover:bg-black/10"
                  : "border-white/10 bg-white/5 text-white/75 hover:text-white hover:bg-white/10"
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
            <path d="M11 5L6 9.5H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2l5 4.5V5z" />
            <path
              className={`transition-opacity duration-200 ${mounted && soundOn ? "opacity-100" : "opacity-0"}`}
              d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
            />
            <path
              className={`transition-opacity duration-200 ${!mounted || !soundOn ? "opacity-100" : "opacity-0"}`}
              d="M23 9l-6 6M17 9l6 6"
            />
          </svg>
        </button>

        {/* View Site link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playClickSound()}
          onMouseEnter={() => playHoverSound(0.01)}
          className={`hidden md:inline-block text-[13px] font-normal transition-colors duration-200 hover:text-[#0A84FF] ${
            isLight ? "text-black/80" : "text-white/80"
          }`}
        >
          View Site
        </Link>

        {/* Action Button: Logout if authenticated, or Back to Site if logged out */}
        {isAuthenticated ? (
          <button
            onClick={() => {
              playClickSound();
              onLogout();
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className="hidden md:inline-flex items-center justify-center bg-[#0A84FF] text-white px-4 h-9 font-medium text-[13px] rounded-[8px] transition-all duration-200 ease-out active:scale-[0.96] hover:bg-[#0070e3] hover:shadow-[0_4px_12px_rgba(10,132,255,0.25)] active:shadow-none select-none"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/"
            onClick={() => playClickSound()}
            onMouseEnter={() => playHoverSound(0.01)}
            className="hidden md:inline-flex items-center justify-center bg-[#0A84FF] text-white px-4 h-9 font-medium text-[13px] rounded-[8px] transition-all duration-200 ease-out active:scale-[0.96] hover:bg-[#0070e3] hover:shadow-[0_4px_12px_rgba(10,132,255,0.25)] active:shadow-none select-none"
          >
            Back to Site
          </Link>
        )}

        {/* Hamburger — Mobile */}
        <button
          id="hamburger-btn"
          onClick={() => {
            setMenuOpen(!menuOpen);
            playClickSound();
          }}
          onMouseEnter={() => playHoverSound(0.01)}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex flex-col items-center justify-center gap-[4px] sm:gap-[5px] rounded-[8px] transition-colors duration-200 md:hidden ${
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
              isLight
                ? "bg-white/95 border-black/[0.06] text-black"
                : "bg-black/90 border-white/[0.08] text-white"
            }`}
          >
            {isAuthenticated ? (
              <>
                {navTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playClickSound();
                      setActiveTab(tab.id);
                      setMenuOpen(false);
                    }}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className={`text-[15px] py-3.5 border-b transition-colors duration-200 font-medium tracking-wide text-left ${
                      activeTab === tab.id
                        ? "text-[#0A84FF]"
                        : isLight
                          ? "text-black/75 border-black/[0.05] hover:text-[#0A84FF]"
                          : "text-white/70 border-white/[0.06] hover:text-[#0A84FF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playClickSound();
                    setMenuOpen(false);
                  }}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className={`text-[15px] py-3.5 border-b transition-colors duration-200 font-medium tracking-wide ${
                    isLight
                      ? "text-black/75 border-black/[0.05] hover:text-[#0A84FF]"
                      : "text-white/70 border-white/[0.06] hover:text-[#0A84FF]"
                  }`}
                >
                  View Public Website
                </Link>

                <button
                  onClick={() => {
                    playClickSound();
                    setMenuOpen(false);
                    onLogout();
                  }}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className="mt-4 flex items-center justify-center bg-[#0A84FF] text-white h-11 font-medium text-[14px] rounded-[10px] transition-all duration-200 active:scale-[0.97] hover:bg-[#0070e3]"
                >
                  Logout Account
                </button>
              </>
            ) : (
              <Link
                href="/"
                onClick={() => {
                  playClickSound();
                  setMenuOpen(false);
                }}
                onMouseEnter={() => playHoverSound(0.01)}
                className="mt-4 flex items-center justify-center bg-[#0A84FF] text-white h-11 font-medium text-[14px] rounded-[10px] transition-all duration-200 active:scale-[0.97] hover:bg-[#0070e3]"
              >
                Back to Website
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

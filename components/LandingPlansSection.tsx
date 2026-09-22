"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";
import {
  BUS_OWNER_PLANS,
  BusOwnerPlanCard,
  getPlanPricing,
  PaymentTerm,
} from "@/components/BusOwnerPlansFlow";

// ─── MINIMALIST VECTOR SVG ICONS (STRICTLY NO EMOJIS) ─────────────────────────

function IconTv(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function IconSmartTv(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M9 8h6" />
      <path d="M12 8v5" />
    </svg>
  );
}

function IconPos(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 6h6" />
      <path d="M9 10h6" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function IconWrench(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconLayers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconShield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ─── HARDWARE EQUIPMENT DEFINITIONS ──────────────────────────────────────────

export type BusHardware = "normal_tv" | "smart_tv" | "android_etm";

export interface BusHardwareItem {
  id: BusHardware;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  description: string;
}

export const BUS_HARDWARE_ITEMS: BusHardwareItem[] = [
  {
    id: "normal_tv",
    label: "Normal TV",
    icon: IconTv,
    description: "Existing non-smart in-bus TV screen (HDMI/AV)",
  },
  {
    id: "smart_tv",
    label: "Smart TV",
    icon: IconSmartTv,
    description: "Android Smart TV with built-in motherboard",
  },
  {
    id: "android_etm",
    label: "Android ETM",
    icon: IconPos,
    description: "Conductor electronic ticket machine or smartphone",
  },
];

export function planMatchesEquipment(
  plan: BusOwnerPlanCard,
  selected: BusHardware[]
): boolean {
  const hasNormal = selected.includes("normal_tv");
  const hasSmart = selected.includes("smart_tv");
  const hasEtm = selected.includes("android_etm");

  // CASE 1: Nothing selected -> Bus currently has NO TV and uses traditional paper tickets
  if (selected.length === 0) {
    if (plan.ticketing === "existing_etm") return false;
    return plan.tv === "none" || plan.tv === "no_tv_etm";
  }

  // CASE 2: BOTH Smart TV AND Android ETM are selected
  if (hasSmart && hasEtm) {
    return (
      plan.tv === "smart" &&
      (plan.ticketing === "existing_etm" || plan.ticketing === "sunmi_pos" || plan.ticketing === "phone_bt")
    );
  }

  // CASE 3: BOTH Normal TV AND Android ETM are selected
  if (hasNormal && hasEtm) {
    return (
      plan.tv === "normal" &&
      (plan.ticketing === "existing_etm" || plan.ticketing === "sunmi_pos" || plan.ticketing === "phone_bt")
    );
  }

  // CASE 4: ONLY Smart TV is selected (bus has Smart TV, paper tickets)
  if (hasSmart && !hasEtm) {
    if (plan.ticketing === "existing_etm") return false;
    return plan.tv === "smart";
  }

  // CASE 5: ONLY Normal TV is selected (bus has Normal TV, paper tickets)
  if (hasNormal && !hasEtm) {
    if (plan.ticketing === "existing_etm") return false;
    return plan.tv === "normal";
  }

  // CASE 6: ONLY Android ETM is selected (no TV selected)
  if (hasEtm && !hasNormal && !hasSmart) {
    return (
      plan.ticketing === "existing_etm" ||
      plan.category === "etm_only" ||
      plan.id === "plan_smart_sync" ||
      plan.id === "plan_ais140"
    );
  }

  return true;
}

interface LandingPlansSectionProps {
  theme?: "dark" | "light";
  onSelectPlan?: (plan: BusOwnerPlanCard) => void;
  initialEquipment?: BusHardware[];
  hideHeader?: boolean;
}

export const CATEGORY_TABS = [
  { id: "combo", label: "Screen Ads + Ticketing", shortLabel: "Ads + ETM" },
  { id: "ads_only", label: "Screen Ads Only", shortLabel: "Ads Only" },
  { id: "etm_only", label: "Digital Ticketing Only", shortLabel: "ETM Only" },
];

const DEFAULT_FEATURED_PLAN = "plan_delta";

export default function LandingPlansSection({
  theme = "dark",
  onSelectPlan,
  initialEquipment = [],
  hideHeader = false,
}: LandingPlansSectionProps) {
  const isLight = theme === "light";

  // Multi-select Equipment: [] by default (means Bare bus with no TV & paper tickets)
  const [selectedEquipment, setSelectedEquipment] = useState<BusHardware[]>(initialEquipment);

  // Category tab: Default is "combo" (Screen Ads + Ticketing)
  const [activeCategory, setActiveCategory] = useState<string>("combo");

  const [featuredPlanId, setFeaturedPlanId] = useState<string>(DEFAULT_FEATURED_PLAN);

  // Capex mode: 100% equipment ownership
  const pricingMode: PaymentTerm = "full";

  // Fetch admin configured featured plan if available
  useEffect(() => {
    let isMounted = true;
    async function loadLandingPlans() {
      try {
        const res = await fetch("/api/admin/landing-plans", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.config?.featuredPlanId) {
            if (isMounted) {
              setFeaturedPlanId(data.config.featuredPlanId);
            }
          }
        }
      } catch {
        // ignore
      }
    }

    loadLandingPlans();
    return () => {
      isMounted = false;
    };
  }, []);

  // Displayed plans after multi-select equipment filtering + category filtering
  const displayedPlans = useMemo(() => {
    return BUS_OWNER_PLANS.filter((p) => {
      if (!planMatchesEquipment(p, selectedEquipment)) return false;
      if (p.category !== activeCategory) return false;
      return true;
    });
  }, [selectedEquipment, activeCategory]);

  // Toggle multi-select equipment
  const toggleEquipment = (id: BusHardware) => {
    playClickSound();
    setSelectedEquipment((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      }
      // If selecting normal_tv, deselect smart_tv
      if (id === "normal_tv") {
        return [...prev.filter((item) => item !== "smart_tv"), id];
      }
      // If selecting smart_tv, deselect normal_tv
      if (id === "smart_tv") {
        return [...prev.filter((item) => item !== "normal_tv"), id];
      }
      return [...prev, id];
    });
  };

  // Dynamic context message explaining the active selection
  const equipmentContext = useMemo(() => {
    const hasNormal = selectedEquipment.includes("normal_tv");
    const hasSmart = selectedEquipment.includes("smart_tv");
    const hasEtm = selectedEquipment.includes("android_etm");

    if (selectedEquipment.length === 0) {
      return {
        text: "No existing hardware selected. Showing turnkey packages for bare buses (no TV, manual paper tickets).",
        savings: null,
      };
    }

    if (hasSmart && hasEtm) {
      return {
        text: "Bus has Smart TV + existing route ETM. 100% hardware reuse with zero screen or ticketing capex.",
        savings: "Saves up to ₹17,000 capex",
      };
    }

    if (hasNormal && hasEtm) {
      return {
        text: "Bus has Normal TV + existing route ETM. Reuses roof display and pre-owned ticketing machine.",
        savings: "Saves up to ₹16,250 capex",
      };
    }

    if (hasSmart) {
      return {
        text: "Bus has existing Android Smart TV. GetMyBus APK runs directly on TV board (zero external TV box).",
        savings: "Saves ₹9,350 capex",
      };
    }

    if (hasNormal) {
      return {
        text: "Bus has existing Normal In-Bus TV. Reuses roof screen via our 4G HDMI media player.",
        savings: "Saves up to ₹7,500 capex",
      };
    }

    if (hasEtm) {
      return {
        text: "Bus has existing Android ETM / Route POS. Software integration with zero new ticketing capex.",
        savings: "Zero new ticketing capex",
      };
    }

    return { text: "", savings: null };
  }, [selectedEquipment]);

  const handlePlanCTA = (plan: BusOwnerPlanCard) => {
    playClickSound();
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      const el = document.getElementById("onboard") || document.getElementById("partner");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("getmybus_select_plan", {
            detail: { plan, pricingMode: "full" },
          })
        );
      }
    }
  };

  const renderCardVectorIcon = (plan: BusOwnerPlanCard) => {
    if (plan.category === "etm_only") {
      return <IconPos className="w-5 h-5 text-amber-400" />;
    }
    if (plan.category === "combo") {
      return <IconLayers className="w-5 h-5 text-[#0A84FF]" />;
    }
    if (plan.tv === "smart") {
      return <IconSmartTv className="w-5 h-5 text-emerald-400" />;
    }
    if (plan.tv === "normal") {
      return <IconTv className="w-5 h-5 text-blue-400" />;
    }
    return <IconWrench className="w-5 h-5 text-purple-400" />;
  };

  const getBusSetupTag = (plan: BusOwnerPlanCard) => {
    if (plan.tv === "normal") {
      return {
        label: "Normal In-Bus TV",
        colorClass: isLight
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-blue-500/10 text-blue-300 border-blue-500/20",
      };
    }
    if (plan.tv === "smart") {
      return {
        label: "Android Smart TV",
        colorClass: isLight
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      };
    }
    if (plan.tv === "none") {
      return {
        label: "Bare Bus Display Refit",
        colorClass: isLight
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : "bg-purple-500/10 text-purple-300 border-purple-500/20",
      };
    }
    return {
      label: "Zero TV (ETM Route)",
      colorClass: isLight
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-rose-500/10 text-rose-300 border-rose-500/20",
    };
  };

  return (
    <section id="plans" className={`relative overflow-hidden ${hideHeader ? "pt-6 pb-20 sm:pt-12 sm:pb-28" : "py-16 sm:py-24"} px-4 sm:px-6 md:px-12`}>
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none rounded-full blur-[140px] opacity-15"
        style={{
          background: isLight
            ? "radial-gradient(circle, #0A84FF 0%, #10B981 100%)"
            : "radial-gradient(circle, #0A84FF 0%, #059669 100%)",
        }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header - Only shown when not embedded in a page with its own Hero */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-2">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 sm:mb-6 border backdrop-blur-md"
              style={{
                borderColor: isLight ? "rgba(10, 132, 255, 0.2)" : "rgba(10, 132, 255, 0.3)",
                background: isLight ? "rgba(10, 132, 255, 0.05)" : "rgba(10, 132, 255, 0.08)",
                color: isLight ? "#0066cc" : "#60a5fa",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Kerala Fleet Modernization Plans
            </div>

            <h2
              className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Equip Your Fleet.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] via-teal-400 to-emerald-400">
                Earn Passive Rent.
              </span>
            </h2>

            <p
              className={`text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto ${
                isLight ? "text-slate-600" : "text-white/60"
              }`}
            >
              Equip your Kerala private bus with certified transit screens, GPS telematics, and digital UPI ticketing.
              Low one-time hardware capex with guaranteed monthly advertising returns.
            </p>
          </div>
        )}

        {/* ─── HARDWARE & CATEGORY FILTER CONTROL ───────────────────────────── */}
        <div className="max-w-xl mx-auto mb-10 sm:mb-14 flex flex-col items-center w-full">
          {/* Row 1: Segmented 3-Column Pill Capsule (Equal widths, short mobile labels) */}
          <div className="w-full max-w-md mx-auto mb-5 sm:mb-6">
            <div
              className={`grid grid-cols-3 p-1.5 rounded-2xl border backdrop-blur-xl gap-1.5 ${
                isLight
                  ? "bg-slate-100/90 border-slate-200 shadow-sm"
                  : "bg-white/[0.04] border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
              }`}
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playClickSound();
                      setActiveCategory(tab.id);
                    }}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className={`relative py-2.5 sm:py-3 px-2 rounded-xl text-center transition-all duration-300 select-none flex items-center justify-center ${
                      isActive
                        ? "text-white font-bold"
                        : isLight
                          ? "text-slate-600 hover:text-slate-900"
                          : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryPillBg"
                        className="absolute inset-0 rounded-xl bg-[#0A84FF] shadow-[0_2px_14px_rgba(10,132,255,0.4)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 hidden sm:inline text-xs sm:text-sm font-semibold truncate">
                      {tab.label}
                    </span>
                    <span className="relative z-10 sm:hidden text-xs font-bold tracking-tight leading-tight">
                      {tab.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Equipment Status Multi-Select Toggle - Sleek Rounded Pill Chips */}
          <div className="w-full max-w-md mx-auto mb-4 sm:mb-5 flex flex-col items-center">
            <div className="flex items-center justify-between w-full px-2 mb-2 text-xs">
              <span className={`font-medium ${isLight ? "text-slate-500" : "text-white/45"}`}>
                Bus already equipped with:
              </span>
              <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                {selectedEquipment.length === 0 ? "Bare Bus Default" : `${selectedEquipment.length} selected`}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full">
              {BUS_HARDWARE_ITEMS.map((item) => {
                const isChecked = selectedEquipment.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleEquipment(item.id)}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className={`py-2 px-3.5 sm:px-4 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 select-none active:scale-95 ${
                      isChecked
                        ? "bg-[#0A84FF] text-white shadow-[0_2px_12px_rgba(10,132,255,0.35)] font-semibold"
                        : isLight
                          ? "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold">
                      {isChecked ? "✓" : "+"}
                    </span>
                    <item.icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Minimal borderless status note (Eliminates box-in-box clutter) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${selectedEquipment.slice().sort().join("-")}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md mx-auto mt-1 px-1 text-center flex items-center justify-center gap-2 text-xs leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className={isLight ? "text-slate-600" : "text-white/60"}>
                {selectedEquipment.length === 0
                  ? "Bare bus turnkey packages (no TV, paper tickets)"
                  : equipmentContext.text}
              </span>
              {equipmentContext.savings && (
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px] shrink-0">
                  {equipmentContext.savings}
                </span>
              )}
              <span className={`font-mono text-[10px] shrink-0 ${isLight ? "text-slate-400" : "text-white/40"}`}>
                · {displayedPlans.length} {displayedPlans.length === 1 ? "plan" : "plans"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── PLANS CARDS GRID (Spacious Bento Aesthetic) ────────────────────── */}
        <div
          className={`grid gap-6 sm:gap-8 items-stretch ${
            displayedPlans.length === 1
              ? "max-w-md mx-auto grid-cols-1"
              : displayedPlans.length === 2
                ? "max-w-3xl mx-auto grid-cols-1 md:grid-cols-2"
                : displayedPlans.length === 3
                  ? "max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {displayedPlans.map((plan, index) => {
              const isFeatured = plan.id === featuredPlanId;
              const pricing = getPlanPricing(plan, pricingMode as PaymentTerm);
              const busTag = getBusSetupTag(plan);

              return (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className={`relative rounded-[24px] sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                    isFeatured
                      ? isLight
                        ? "bg-gradient-to-b from-white to-slate-50 border-2 border-[#0A84FF] shadow-[0_12px_40px_rgba(10,132,255,0.14)]"
                        : "bg-gradient-to-b from-[#0b1329] via-[#091024] to-[#060b18] border-2 border-[#0A84FF]/60 shadow-[0_0_40px_rgba(10,132,255,0.22)]"
                      : isLight
                        ? "bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300"
                        : "bg-gradient-to-b from-white/[0.04] to-white/[0.015] border border-white/[0.07] hover:border-white/[0.16] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  {/* Featured Choice Pill */}
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="px-3.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0A84FF] text-white shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                        Featured Choice
                      </div>
                    </div>
                  )}

                  {/* Card Top Section */}
                  <div>
                    {/* Header: Vector Icon on left, Badge on right */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div
                        className={`w-12 h-12 rounded-[14px] flex items-center justify-center border transition-all ${
                          isFeatured
                            ? isLight
                              ? "bg-blue-50 border-blue-200 text-[#0A84FF]"
                              : "bg-[#0A84FF]/15 border-[#0A84FF]/30 text-[#0A84FF]"
                            : isLight
                              ? "bg-slate-100 border-slate-200"
                              : "bg-white/[0.05] border-white/[0.08]"
                        }`}
                      >
                        {renderCardVectorIcon(plan)}
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-3 py-1 rounded-full border shrink-0 ${
                          plan.badgeColor || "bg-white/5 text-white/70 border-white/10"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    {/* Code + Compatibility Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-[11px] font-mono font-bold tracking-wider uppercase ${
                          isLight ? "text-slate-400" : "text-white/40"
                        }`}
                      >
                        {plan.code}
                      </span>
                      <span className="text-slate-300 dark:text-white/20">•</span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${busTag.colorClass}`}
                      >
                        {busTag.label}
                      </span>
                      {plan.ticketing === "existing_etm" && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                            isLight
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                          }`}
                        >
                          Reuses Route ETM
                        </span>
                      )}
                    </div>

                    {/* Full Plan Title - NEVER TRUNCATED! */}
                    <h3
                      className={`text-xl sm:text-2xl font-bold tracking-tight leading-snug mb-2 ${
                        isLight ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {plan.title}
                    </h3>

                    {/* Tagline */}
                    <p
                      className={`text-xs sm:text-sm mb-5 leading-relaxed font-normal ${
                        isLight ? "text-slate-500" : "text-white/55"
                      }`}
                    >
                      {plan.tagline}
                    </p>

                    {/* Pricing Box - Spacious & High Contrast */}
                    <div
                      className={`p-4 sm:p-5 rounded-2xl mb-6 border transition-colors ${
                        isFeatured
                          ? isLight
                            ? "bg-blue-50/50 border-blue-100"
                            : "bg-[#0A84FF]/10 border-[#0A84FF]/20"
                          : isLight
                            ? "bg-slate-50 border-slate-100"
                            : "bg-white/[0.02] border-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}
                        >
                          {pricing.mainAmount}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            isLight ? "text-slate-500" : "text-white/50"
                          }`}
                        >
                          {pricing.periodLabel}
                        </span>
                      </div>

                      {/* Owner Return Highlight */}
                      <div className="mt-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>
                            {plan.commercialModel === "saas_etm"
                              ? "Conductor Anti-Theft SaaS"
                              : `Owner Income: ${plan.ownerReturns.amountLabel}`}
                          </span>
                        </div>
                        <p
                          className={`text-[11px] sm:text-xs leading-relaxed ${
                            isLight ? "text-slate-500" : "text-white/50"
                          }`}
                        >
                          {pricing.netRentPill}
                        </p>
                      </div>
                    </div>

                    {/* Hardware / Inclusions Checklist */}
                    <div className="space-y-2.5 mb-6">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider block mb-3 ${
                          isLight ? "text-slate-400" : "text-white/40"
                        }`}
                      >
                        Included Hardware
                      </span>
                      {plan.hardwareKit.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm leading-snug">
                          <IconCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span className={isLight ? "text-slate-700" : "text-white/80"}>
                            {item}
                          </span>
                        </div>
                      ))}
                      {plan.hardwareKit.length > 4 && (
                        <div
                          className={`text-xs pl-6 font-medium ${
                            isLight ? "text-slate-400" : "text-white/40"
                          }`}
                        >
                          +{plan.hardwareKit.length - 4} additional items included
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom / CTA */}
                  <div className="pt-4 border-t border-black/[0.05] dark:border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs mb-3.5">
                      <span
                        className={`font-medium flex items-center gap-1.5 ${
                          isLight ? "text-slate-500" : "text-white/50"
                        }`}
                      >
                        <IconClock className="w-3.5 h-3.5" />
                        <span>Installation: {plan.setupTime}</span>
                      </span>
                      {plan.hardwareSavings && plan.hardwareSavings > 0 ? (
                        <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                          Saves ₹{plan.hardwareSavings.toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handlePlanCTA(plan)}
                      onMouseEnter={() => playHoverSound(0.01)}
                      className={`w-full h-12 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] ${
                        isFeatured
                          ? "bg-[#0A84FF] text-white shadow-[0_4px_20px_rgba(10,132,255,0.35)] hover:bg-[#0070e3] font-bold"
                          : isLight
                            ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                            : "bg-white/[0.08] text-white hover:bg-white/[0.14] border border-white/10"
                      }`}
                    >
                      <span>Choose {plan.code}</span>
                      <IconArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer Guarantee Bar below plans (Clean, standard vector icons) */}
        <div
          className={`mt-10 sm:mt-14 p-3.5 sm:p-4 rounded-2xl border text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-3 sm:gap-4 ${
            isLight
              ? "bg-white/80 border-slate-200 text-slate-700 shadow-sm"
              : "bg-white/[0.02] border-white/[0.06] text-white/70"
          }`}
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium">
            <IconShield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Lock-in Contract</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-white/10" />
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium">
            <IconClock className="w-4 h-4 text-[#0A84FF] shrink-0" />
            <span>15 to 45 Min Depot Installation</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-white/10" />
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium">
            <IconCalendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Guaranteed Rent by 5th of Month</span>
          </div>
        </div>
      </div>
    </section>
  );
}

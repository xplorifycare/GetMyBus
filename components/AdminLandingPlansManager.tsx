"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";
import { BUS_OWNER_PLANS, BusOwnerPlanCard } from "@/components/BusOwnerPlansFlow";
import {
  planMatchesEquipment,
  BUS_HARDWARE_ITEMS,
  BusHardware,
} from "@/components/LandingPlansSection";

interface AdminLandingPlansManagerProps {
  theme?: "dark" | "light";
}

const DEFAULT_SELECTED_PLANS = ["plan_alpha", "plan_beta", "plan_delta", "plan_etm_pos"];
const DEFAULT_FEATURED_PLAN = "plan_beta";

export default function AdminLandingPlansManager({
  theme = "dark",
}: AdminLandingPlansManagerProps) {
  const isLight = theme === "light";

  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>(DEFAULT_SELECTED_PLANS);
  const [featuredPlanId, setFeaturedPlanId] = useState<string>(DEFAULT_FEATURED_PLAN);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("combo");
  const [selectedEquipment, setSelectedEquipment] = useState<BusHardware[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Load current configuration from API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/landing-plans");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.config) {
            if (Array.isArray(data.config.selectedPlanIds) && data.config.selectedPlanIds.length > 0) {
              setSelectedPlanIds(data.config.selectedPlanIds);
            }
            if (data.config.featuredPlanId) {
              setFeaturedPlanId(data.config.featuredPlanId);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch published landing plans config:", err);
      }
    }

    fetchConfig();
  }, []);

  // Toggle selection for a plan
  const handleTogglePlan = (planId: string) => {
    playClickSound();
    setHasChanges(true);
    setSelectedPlanIds((prev) => {
      const exists = prev.includes(planId);
      if (exists) {
        if (prev.length <= 1) {
          setStatusMessage({
            text: "You must keep at least 1 plan selected for the landing page.",
            type: "error",
          });
          return prev;
        }
        const updated = prev.filter((id) => id !== planId);
        if (featuredPlanId === planId && updated.length > 0) {
          setFeaturedPlanId(updated[0]);
        }
        return updated;
      } else {
        return [...prev, planId];
      }
    });
  };

  // Set plan as featured
  const handleSetFeatured = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setHasChanges(true);
    if (!selectedPlanIds.includes(planId)) {
      setSelectedPlanIds((prev) => [...prev, planId]);
    }
    setFeaturedPlanId(planId);
  };

  // Toggle equipment filter
  const toggleEquipment = (id: BusHardware) => {
    playClickSound();
    setSelectedEquipment((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((item) => item !== id);
      }
      if (id === "normal_tv") {
        return [...prev.filter((item) => item !== "smart_tv"), id];
      }
      if (id === "smart_tv") {
        return [...prev.filter((item) => item !== "normal_tv"), id];
      }
      return [...prev, id];
    });
  };

  // Quick preset handlers
  const handleSelectKeralaTop4 = () => {
    playClickSound();
    setHasChanges(true);
    setSelectedPlanIds(["plan_alpha", "plan_beta", "plan_delta", "plan_etm_pos"]);
    setFeaturedPlanId("plan_beta");
  };

  const handleSelectNormalTvOnly = () => {
    playClickSound();
    setHasChanges(true);
    const ids = BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["normal_tv"])).map((p) => p.id);
    setSelectedPlanIds(ids);
    setFeaturedPlanId("plan_beta");
  };

  const handleSelectSmartTvOnly = () => {
    playClickSound();
    setHasChanges(true);
    const ids = BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["smart_tv"])).map((p) => p.id);
    setSelectedPlanIds(ids);
    setFeaturedPlanId("plan_alpha");
  };

  const handleSelectEtmOnly = () => {
    playClickSound();
    setHasChanges(true);
    const ids = BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["android_etm"])).map((p) => p.id);
    setSelectedPlanIds(ids);
    setFeaturedPlanId("plan_smart_sync");
  };

  const handleSelectAll = () => {
    playClickSound();
    setHasChanges(true);
    const allIds = BUS_OWNER_PLANS.map((p) => p.id);
    setSelectedPlanIds(allIds);
    if (!featuredPlanId) setFeaturedPlanId(allIds[0]);
  };

  const handleSelectCombosOnly = () => {
    playClickSound();
    setHasChanges(true);
    const combos = BUS_OWNER_PLANS.filter((p) => p.category === "combo").map((p) => p.id);
    setSelectedPlanIds(combos);
    setFeaturedPlanId(combos[0] || "plan_delta");
  };

  const handleSelectAdsOnly = () => {
    playClickSound();
    setHasChanges(true);
    const adsOnly = BUS_OWNER_PLANS.filter((p) => p.category === "ads_only").map((p) => p.id);
    setSelectedPlanIds(adsOnly);
    setFeaturedPlanId("plan_beta");
  };

  // Save changes to API
  const handleSave = async () => {
    playClickSound();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/landing-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPlanIds,
          featuredPlanId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSuccessChime();
        setHasChanges(false);
        setStatusMessage({
          text: `Successfully published ${selectedPlanIds.length} plans to the landing page.`,
          type: "success",
        });

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "getmybus_landing_plans",
            JSON.stringify({
              selectedPlanIds,
              featuredPlanId,
              updatedAt: new Date().toISOString(),
            })
          );
        }
      } else {
        setStatusMessage({
          text: data.error || "Failed to save landing plans configuration.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        text: "Network error while saving to server.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter plans list: when selectedEquipment is empty, show all plans in admin view or filter by category
  const filteredPlans = BUS_OWNER_PLANS.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (selectedEquipment.length > 0 && !planMatchesEquipment(p, selectedEquipment)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="p-6 md:p-8 rounded-3xl admin-card border backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
              Landing Page Plan Curator
            </div>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              Select Landing Page Plans
            </h2>
            <p className={`text-sm mt-1 max-w-2xl ${isLight ? "text-slate-500" : "text-white/50"}`}>
              Select which fleet plans are displayed to bus owners on the public plans catalog. Designate one plan as the highlighted <strong className="text-[#0A84FF]">Featured Choice</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/plans"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => playHoverSound(0.01)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  : "bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              <span>View Plans Page</span>
              <span>↗</span>
            </a>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                hasChanges
                  ? "bg-[#0A84FF] text-white hover:bg-[#0070e3] active:scale-95"
                  : "bg-[#0A84FF]/80 text-white hover:bg-[#0A84FF] active:scale-95"
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Save & Publish Configuration</span>
              )}
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-300 border-rose-500/30"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="opacity-70 hover:opacity-100 text-sm ml-4"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Quick Presets */}
        <div className="mt-6 pt-5 border-t border-black/[0.05] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold ${isLight ? "text-slate-400" : "text-white/40"}`}>
              Quick Presets:
            </span>
            <button
              onClick={handleSelectKeralaTop4}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0A84FF]/10 text-[#0A84FF] hover:bg-[#0A84FF]/20 border border-[#0A84FF]/30 transition-all"
            >
              Recommended Top 4
            </button>
            <button
              onClick={handleSelectNormalTvOnly}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-all"
            >
              Normal TV ({BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["normal_tv"])).length})
            </button>
            <button
              onClick={handleSelectSmartTvOnly}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
            >
              Smart TV ({BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["smart_tv"])).length})
            </button>
            <button
              onClick={handleSelectEtmOnly}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 transition-all"
            >
              Android ETM ({BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, ["android_etm"])).length})
            </button>
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] text-white/70 hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              Select All (15)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs ${isLight ? "text-slate-500" : "text-white/50"}`}>
              Selected: <strong className="text-[#0A84FF]">{selectedPlanIds.length}</strong> of {BUS_OWNER_PLANS.length} plans
            </span>
          </div>
        </div>
      </div>

      {/* Dual Filters: Multi-Select Equipment & Category */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Bus Currently Has:
          </span>
          {BUS_HARDWARE_ITEMS.map((item) => {
            const isChecked = selectedEquipment.includes(item.id);
            const count = BUS_OWNER_PLANS.filter((p) => planMatchesEquipment(p, [item.id])).length;

            return (
              <button
                key={item.id}
                onClick={() => toggleEquipment(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                  isChecked
                    ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm font-semibold"
                    : isLight
                      ? "bg-slate-200/80 text-slate-700 hover:bg-slate-200 border-slate-300"
                      : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] border-white/10"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] transition-all ${
                    isChecked
                      ? "bg-white text-[#0A84FF] border-white font-bold"
                      : "border-slate-400 dark:border-white/30"
                  }`}
                >
                  {isChecked ? "✓" : ""}
                </span>
                <item.icon className="w-3.5 h-3.5 opacity-80" />
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Category:
          </span>
          <div
            className={`flex items-center rounded-2xl border p-1 gap-1 ${
              isLight
                ? "bg-slate-100 border-slate-200"
                : "bg-white/[0.04] border-white/[0.08]"
            }`}
          >
            {[
              { id: "combo", label: "Screen Ads + Ticketing" },
              { id: "ads_only", label: "Screen Ads Only" },
              { id: "etm_only", label: "Digital Ticketing Only" },
            ].map((tab) => {
              const isActive = filterCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setFilterCategory(tab.id);
                  }}
                  className={`relative px-4 py-1.5 rounded-xl text-xs font-medium transition-all select-none ${
                    isActive
                      ? "text-white font-semibold"
                      : isLight
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminCategoryActivePillBg"
                      className="absolute inset-0 rounded-xl bg-[#0A84FF] shadow-[0_2px_12px_rgba(10,132,255,0.4)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Plans Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);
          const isFeatured = featuredPlanId === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => handleTogglePlan(plan.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? isFeatured
                    ? isLight
                      ? "bg-blue-50/70 border-2 border-[#0A84FF] shadow-sm"
                      : "bg-[#0A84FF]/10 border-2 border-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.2)]"
                    : isLight
                      ? "bg-white border-slate-300 shadow-sm"
                      : "bg-white/[0.05] border-white/20"
                  : isLight
                    ? "bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-100 hover:bg-white"
                    : "bg-white/[0.02] border-white/[0.05] opacity-50 hover:opacity-90 hover:bg-white/[0.04]"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#0A84FF] uppercase">
                        {plan.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    </div>
                    <h4 className={`text-base font-bold leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                      {plan.title}
                    </h4>
                  </div>

                  {/* Toggle Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950"
                        : "border border-white/20 bg-transparent text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                </div>

                <p className={`text-xs line-clamp-2 mb-3 ${isLight ? "text-slate-500" : "text-white/60"}`}>
                  {plan.pitch}
                </p>

                {/* Specs */}
                <div className="space-y-1 mb-4 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className={isLight ? "text-slate-500" : "text-white/40"}>Capex:</span>
                    <span className="font-semibold text-[#0A84FF]">
                      {plan.fullAmount === 0 ? "₹0 (Free Trial)" : `₹${plan.fullAmount.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isLight ? "text-slate-500" : "text-white/40"}>Owner Return:</span>
                    <span className="font-semibold text-emerald-400">
                      {plan.ownerReturns.amountLabel}
                    </span>
                  </div>
                  {plan.hardwareSavings && plan.hardwareSavings > 0 ? (
                    <div className="flex items-center justify-between">
                      <span className={isLight ? "text-slate-500" : "text-white/40"}>Hardware Reuse:</span>
                      <span className="font-semibold text-emerald-400">
                        Saves ₹{plan.hardwareSavings.toLocaleString()}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2">
                <span className={`text-[11px] font-medium ${isSelected ? "text-emerald-400" : "opacity-40"}`}>
                  {isSelected ? "Published" : "Hidden"}
                </span>

                {isSelected && (
                  <button
                    onClick={(e) => handleSetFeatured(plan.id, e)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isFeatured
                        ? "bg-[#0A84FF] text-white shadow-sm"
                        : isLight
                          ? "bg-slate-200/70 text-slate-700 hover:bg-slate-200"
                          : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
                    }`}
                  >
                    <span>{isFeatured ? "Featured Choice" : "Set as Featured"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

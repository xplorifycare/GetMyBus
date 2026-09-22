"use client";

import { useState, useMemo } from "react";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";
import { COMBINATIONS } from "@/components/HardwareConfigurator";

interface PathCount {
  combo_1a: number;
  combo_1b: number;
  combo_1c: number;
  combo_1d: number;
  combo_1e: number;
  combo_2a: number;
}

export default function ExecutionPlaybook({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";

  // Active View Tab inside Playbook
  const [activePlaybookSection, setActivePlaybookSection] = useState<"decision" | "roadmap" | "pipeline" | "advertisers" | "objections">("decision");

  // Selected Route Context
  const [selectedRoute, setSelectedRoute] = useState<string>("route_calicut");

  // Decision Tree Simulator State
  const [step1Driver, setStep1Driver] = useState<"interested" | "hesitant" | null>("interested");
  const [step2Screen, setStep2Screen] = useState<"dumb_tv" | "smart_tv" | "no_tv" | null>("dumb_tv");
  const [step3Etm, setStep3Etm] = useState<"paper" | "existing_etm" | "sunmi_upgrade" | null>("paper");

  // Live Fleet Pipeline Counts per path
  const [pipeline, setPipeline] = useState<PathCount>({
    combo_1a: 3, // Most common (Normal TV + No ETM)
    combo_1b: 2, // Smart TV (Direct USB GPS)
    combo_1c: 1, // Smart TV + Reused ETM
    combo_1d: 0,
    combo_1e: 0,
    combo_2a: 1, // Retrofit Screen
  });

  // Active Objection Card Modal / Accordion
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  // Active Dual-Track Week
  const [activeWeek, setActiveWeek] = useState<1 | 2 | 3 | 4>(1);

  // Derived Outcome Combo based on decision tree
  const recommendedComboId = useMemo(() => {
    if (step1Driver === "hesitant") return null;
    if (step2Screen === "no_tv") {
      if (step3Etm === "existing_etm") return "combo_2c";
      return "combo_2a";
    }
    if (step2Screen === "smart_tv") {
      if (step3Etm === "existing_etm") return "combo_1c";
      return "combo_1b";
    }
    // Dumb TV
    if (step3Etm === "paper") return "combo_1a";
    if (step3Etm === "existing_etm") return "combo_1d";
    if (step3Etm === "sunmi_upgrade") return "combo_1e";
    return "combo_1a";
  }, [step1Driver, step2Screen, step3Etm]);

  // Aggregate Pipeline Calculations
  const totalPipelineBuses = useMemo(() => {
    return Object.values(pipeline).reduce((acc, curr) => acc + curr, 0);
  }, [pipeline]);

  const { totalCapexMin, totalCapexMax, monthlyGrossRev, ownerTotalPayout, netMonthlyRunRate, totalAdSlots } = useMemo(() => {
    let minC = 0;
    let maxC = 0;

    (Object.keys(pipeline) as (keyof PathCount)[]).forEach((key) => {
      const count = pipeline[key];
      if (count <= 0) return;
      if (key === "combo_1a") { minC += 4150 * count; maxC += 5150 * count; }
      else if (key === "combo_1b") { minC += 1850 * count; maxC += 2300 * count; }
      else if (key === "combo_1c") { minC += 1850 * count; maxC += 2300 * count; }
      else if (key === "combo_1d") { minC += 4150 * count; maxC += 5150 * count; }
      else if (key === "combo_1e") { minC += 17650 * count; maxC += 20650 * count; }
      else if (key === "combo_2a") { minC += 14150 * count; maxC += 16950 * count; }
    });

    const buses = Math.max(1, totalPipelineBuses);
    // 4 advertisers per cluster route at ~₹3,500/mo avg
    const grossRev = buses * 5333;
    const ownerPayout = buses * 2500; // ₹2,500 guaranteed passive cut
    const opex = (buses * 199) + 1000; // SIM + server
    const netProfit = Math.max(0, grossRev - ownerPayout - opex);
    const slots = buses * 12; // 12 ad slots per bus per hour

    return {
      totalCapexMin: minC,
      totalCapexMax: maxC,
      monthlyGrossRev: grossRev,
      ownerTotalPayout: ownerPayout,
      netMonthlyRunRate: netProfit,
      totalAdSlots: slots
    };
  }, [pipeline, totalPipelineBuses]);

  const updatePipelineCount = (key: keyof PathCount, delta: number) => {
    playClickSound();
    setPipeline((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(50, prev[key] + delta))
    }));
  };

  const handleAddRecommendedToPipeline = () => {
    if (!recommendedComboId || !(recommendedComboId in pipeline)) return;
    playSuccessChime();
    setPipeline((prev) => ({
      ...prev,
      [recommendedComboId as keyof PathCount]: prev[recommendedComboId as keyof PathCount] + 1
    }));
  };

  const currentComboDef = recommendedComboId ? COMBINATIONS[recommendedComboId] : null;

  return (
    <div className={`space-y-8 select-text transition-colors duration-300 ${isLight ? "text-slate-900" : "text-white"}`}>

      {/* =========================================================================
          1. HERO HEADER & ROUTE CORRIDOR CONTEXT
          ========================================================================= */}
      <header className={`p-6 md:p-8 rounded-2xl relative overflow-hidden border backdrop-blur-xl transition-all ${
        isLight
          ? "bg-white/80 border-slate-200/80 shadow-sm"
          : "bg-gradient-to-br from-[#0c0d12] via-[#090a0d] to-[#070708] border-white/[0.07] shadow-2xl"
      }`}>
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#0A84FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-[#0A84FF] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 font-mono">
                Day 1 Operations Playbook
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] font-mono text-[#30D158]">Zero-Friction Launch Blueprint</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight leading-tight">
              Day 1 Field Execution &amp; <span className="font-bold">Dual-Track Engine</span>
            </h1>

            <p className={`text-xs md:text-sm font-light mt-2 max-w-2xl leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
              The exact operational step-by-step decision flow for approaching Kerala private bus operators, auditing in-bus hardware, prescribing lean MVP setups, and synchronizing parallel route advertiser signups.
            </p>

            {/* Quick Metrics Bar */}
            <div className={`flex flex-wrap items-center gap-2 mt-4 pt-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
              <div className="text-xs px-3 py-1 rounded-full bg-[#30D158]/10 border border-[#30D158]/20 text-[#30D158] font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] animate-pulse" />
                <span>Active Fleet: {totalPipelineBuses} Buses</span>
              </div>
              <div className="text-xs px-3 py-1 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[#0A84FF] font-mono font-medium">
                Capex: ₹{totalCapexMin.toLocaleString()} – ₹{totalCapexMax.toLocaleString()}
              </div>
              <div className="text-xs px-3 py-1 rounded-full bg-[#BF5AF2]/10 border border-[#BF5AF2]/20 text-[#BF5AF2] font-mono font-medium">
                Ad Revenue: ~₹{monthlyGrossRev.toLocaleString()}/mo
              </div>
              <div className="text-xs px-3 py-1 rounded-full bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 text-[#FF9F0A] font-mono font-medium">
                Net Profit: ~₹{netMonthlyRunRate.toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* Route Pilot Selector */}
          <div className={`self-start lg:self-center p-4 rounded-2xl border min-w-[260px] shadow-lg ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#121214] border-white/[0.08]"
          }`}>
            <span className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${isLight ? "text-slate-500" : "text-white/50"}`}>
              📍 Active Pilot Corridor
            </span>
            <select
              value={selectedRoute}
              onChange={(e) => { playClickSound(); setSelectedRoute(e.target.value); }}
              className={`w-full text-xs rounded-xl px-3 py-2 border outline-none font-medium ${
                isLight ? "bg-white border-slate-300 text-slate-800" : "bg-[#070709] border-white/[0.1] text-white"
              }`}
            >
              <option value="route_calicut">Kozhikode Moffusil ↔ Medical College (14 km)</option>
              <option value="route_cochin">Ernakulam Kaloor ↔ Kakkanad Infopark (12 km)</option>
              <option value="route_thrissur">Thrissur Sakthan ↔ Guruvayur (28 km)</option>
              <option value="route_kannur">Kannur Old Bus Stand ↔ Thalassery (21 km)</option>
            </select>
            <div className={`text-[10.5px] mt-2 flex items-center justify-between font-mono ${isLight ? "text-slate-500" : "text-white/40"}`}>
              <span>Daily Commuters: ~18,000</span>
              <span className="text-[#30D158]">High Density</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. PLAYBOOK SECTION SUB-TABS SWITCHER
          ========================================================================= */}
      <div className={`flex flex-wrap gap-2 p-1.5 rounded-2xl border ${
        isLight ? "bg-slate-100/80 border-slate-200" : "bg-[#070709] border-white/[0.06]"
      }`}>
        {[
          { id: "decision" as const, icon: "🔀", label: "Interactive Decision Flow", badge: "Live Simulator" },
          { id: "pipeline" as const, icon: "📊", label: "Fleet Pipeline & Counter", badge: `${totalPipelineBuses} Buses` },
          { id: "roadmap" as const, icon: "🗓️", label: "Parallel Dual-Track Roadmap", badge: "Weeks 1–4" },
          { id: "advertisers" as const, icon: "📢", label: "Advertiser Catching Engine", badge: "Sales Script" },
          { id: "objections" as const, icon: "🛡️", label: "Field Objection Buster", badge: "Kerala FAQ" },
        ].map((tab) => {
          const isActive = activePlaybookSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { playClickSound(); setActivePlaybookSection(tab.id); }}
              onMouseEnter={() => playHoverSound(0.01)}
              className={`flex-1 min-w-[180px] p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between select-none ${
                isActive
                  ? "bg-[#0A84FF]/10 border-[#0A84FF] shadow-[0_0_20px_-4px_rgba(10,132,255,0.25)]"
                  : isLight
                    ? "bg-white/80 border-slate-200 hover:border-slate-300"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">{tab.icon}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isActive
                    ? "bg-[#0A84FF] text-white border-[#0A84FF]"
                    : isLight
                      ? "bg-slate-100 text-slate-600 border-slate-200"
                      : "bg-white/[0.05] text-white/50 border-white/[0.08]"
                }`}>
                  {tab.badge}
                </span>
              </div>
              <div className={`text-xs font-semibold ${isActive ? "text-[#0A84FF]" : ""}`}>
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. SECTION A: INTERACTIVE DECISION FLOW ENGINE
          ========================================================================= */}
      {activePlaybookSection === "decision" && (
        <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
          isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
                  Field Operator Decision Engine
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[11px] text-[#30D158] font-mono">Bus Stand Inspection Protocol</span>
              </div>
              <h2 className="text-xl md:text-2xl font-normal tracking-tight">
                Walk Up to Bus Stand — <span className="font-bold">Interactive Branching Simulator</span>
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                Click through real-world field conditions when you approach a Kerala private bus during layover. The engine dynamically evaluates objections, equipment status, and prescribes the optimal zero-friction setup.
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setStep1Driver("interested");
                setStep2Screen("dumb_tv");
                setStep3Etm("paper");
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono self-start md:self-auto transition ${
                isLight ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700" : "bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-white/70"
              }`}
            >
              🔄 Reset Decision Tree
            </button>
          </div>

          {/* Interactive Steps Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* STEP 1: APPROACH & PITCH */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isLight ? "bg-slate-50/70 border-slate-200" : "bg-[#070709] border-white/[0.06]"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-[#0A84FF]">
                    Step 1: Driver / Owner Approach
                  </span>
                  <span className="text-base">🤝</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">Bus Stand Layover Pitch</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Approach owner or driver between trips. Pitch: <strong>₹2,500/mo passive income</strong> + free passenger ad screen.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { playClickSound(); setStep1Driver("interested"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step1Driver === "interested"
                        ? "bg-[#30D158]/15 border-[#30D158] shadow-[0_0_15px_rgba(48,209,88,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#30D158] flex items-center gap-1.5">
                        <span>✓</span> Interested in Passive Revenue
                      </div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Agrees to free hardware trial &amp; screen share
                      </div>
                    </div>
                    {step1Driver === "interested" && <span className="text-xs font-mono text-[#30D158]">SELECTED</span>}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setStep1Driver("hesitant"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step1Driver === "hesitant"
                        ? "bg-[#FF9F0A]/15 border-[#FF9F0A] shadow-[0_0_15px_rgba(255,159,10,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#FF9F0A] flex items-center gap-1.5">
                        <span>⚠️</span> Hesitant / Has Objections
                      </div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Worried about battery, union, or police fine
                      </div>
                    </div>
                    {step1Driver === "hesitant" && <span className="text-xs font-mono text-[#FF9F0A]">SELECTED</span>}
                  </button>
                </div>
              </div>

              {step1Driver === "hesitant" && (
                <div className={`mt-4 p-3 rounded-xl border text-[11px] leading-relaxed ${
                  isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-[#1f170c] border-[#FF9F0A]/30 text-[#FFB340]"
                }`}>
                  <div className="font-semibold text-xs flex items-center gap-1 mb-1">
                    <span>💡</span> Objection Buster Protocol:
                  </div>
                  "Chetta, we don't touch your wiring or battery when bus is off. Power cuts automatically on ignition key off. Here is a 7-day free trial on Bus #1."
                </div>
              )}
            </div>

            {/* STEP 2: SCREEN AUDIT */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isLight ? "bg-slate-50/70 border-slate-200" : "bg-[#070709] border-white/[0.06]"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-[#0A84FF]">
                    Step 2: TV Screen Inspection
                  </span>
                  <span className="text-base">📺</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">In-Bus Passenger Bulkhead</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Step into cabin and check ceiling bulkhead behind driver seat for existing display hardware.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { playClickSound(); setStep2Screen("dumb_tv"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step2Screen === "dumb_tv"
                        ? "bg-[#0A84FF]/15 border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#0A84FF]">✓ Working Normal TV Present</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        24"/32" LED with HDMI/AV + 24V inverter ready
                      </div>
                    </div>
                    {step2Screen === "dumb_tv" && <span className="text-xs font-mono text-[#0A84FF]">SELECTED</span>}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setStep2Screen("smart_tv"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step2Screen === "smart_tv"
                        ? "bg-[#BF5AF2]/15 border-[#BF5AF2] shadow-[0_0_15px_rgba(191,90,242,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#BF5AF2]">✓ Smart Android TV Present</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Android OS built-in (runs APK natively, no box needed)
                      </div>
                    </div>
                    {step2Screen === "smart_tv" && <span className="text-xs font-mono text-[#BF5AF2]">SELECTED</span>}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setStep2Screen("no_tv"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step2Screen === "no_tv"
                        ? "bg-[#FF9F0A]/15 border-[#FF9F0A] shadow-[0_0_15px_rgba(255,159,10,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#FF9F0A]">❌ No Screen on Bus</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Screenless bus: Requires full 32" display retrofit
                      </div>
                    </div>
                    {step2Screen === "no_tv" && <span className="text-xs font-mono text-[#FF9F0A]">SELECTED</span>}
                  </button>
                </div>
              </div>

              <div className={`mt-4 text-[10.5px] font-mono p-2.5 rounded-lg border ${
                isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-white/[0.03] border-white/[0.06] text-white/50"
              }`}>
                ⚡ <strong>Kerala Reality</strong>: ~70% of Kerala private buses already have 24"/32" TVs running song USBs! Reusing saves ₹7,400+ per bus.
              </div>
            </div>

            {/* STEP 3: CONDUCTOR ETM AUDIT */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              isLight ? "bg-slate-50/70 border-slate-200" : "bg-[#070709] border-white/[0.06]"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-[#0A84FF]">
                    Step 3: Conductor &amp; Ticketing Audit
                  </span>
                  <span className="text-base">🎫</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">Crew Friction Evaluation</h3>
                <p className={`text-xs leading-relaxed mb-4 ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Audit how tickets are issued. <em>Crucial rule:</em> Never force new ticket machines on day 1 if crew is resistant.
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { playClickSound(); setStep3Etm("paper"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step3Etm === "paper"
                        ? "bg-[#30D158]/15 border-[#30D158] shadow-[0_0_15px_rgba(48,209,88,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#30D158]">❌ Paper Tickets (Zero Friction)</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Keep traditional paper tickets; don't touch conductor!
                      </div>
                    </div>
                    {step3Etm === "paper" && <span className="text-xs font-mono text-[#30D158]">SELECTED</span>}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setStep3Etm("existing_etm"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step3Etm === "existing_etm"
                        ? "bg-[#0A84FF]/15 border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#0A84FF]">✓ Existing Electronic Ticket Machine</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Reuses conductor's existing machine via cloud API sync
                      </div>
                    </div>
                    {step3Etm === "existing_etm" && <span className="text-xs font-mono text-[#0A84FF]">SELECTED</span>}
                  </button>

                  <button
                    onClick={() => { playClickSound(); setStep3Etm("sunmi_upgrade"); }}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      step3Etm === "sunmi_upgrade"
                        ? "bg-[#BF5AF2]/15 border-[#BF5AF2] shadow-[0_0_15px_rgba(191,90,242,0.2)]"
                        : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#BF5AF2]">🚀 Upgrade to Sunmi V2s Cloud POS</div>
                      <div className={`text-[10.5px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        Operator explicitly requests full digital QR ticketing
                      </div>
                    </div>
                    {step3Etm === "sunmi_upgrade" && <span className="text-xs font-mono text-[#BF5AF2]">SELECTED</span>}
                  </button>
                </div>
              </div>

              <div className={`mt-4 text-[10.5px] font-mono p-2.5 rounded-lg border ${
                isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-white/[0.03] border-white/[0.06] text-white/50"
              }`}>
                🛡️ <strong>Golden Rule</strong>: In Phase 1, start with Paper Tickets or Existing ETM. Prove ad revenue first; conductor resistance drops to 0 after trust is earned!
              </div>
            </div>

          </div>

          {/* DYNAMIC PRESCRIPTION RESULT CARD */}
          {currentComboDef ? (
            <div className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden transition-all ${
              isLight
                ? "bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50 border-emerald-200"
                : "bg-gradient-to-br from-[#0c1410] via-[#090b0f] to-[#070709] border-[#30D158]/30"
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30 font-bold">
                      Prescribed Action Plan
                    </span>
                    <span className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-white/50"}`}>
                      {currentComboDef.speed}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold tracking-tight">
                    {currentComboDef.title}
                  </h3>

                  <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
                    {currentComboDef.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/[0.08] text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#30D158] font-bold">✓ Reused Assets:</span>
                      <span className="font-mono text-[11px] opacity-80">{currentComboDef.reusedSummary}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0A84FF] font-bold">• New Hardware:</span>
                      <span className="font-mono text-[11px] opacity-80">{currentComboDef.installSummary}</span>
                    </div>
                  </div>
                </div>

                {/* Right Capex & Action Button */}
                <div className={`p-4 rounded-xl border flex flex-col items-center gap-3 min-w-[240px] shadow-lg ${
                  isLight ? "bg-white border-slate-200" : "bg-[#14161c] border-white/[0.09]"
                }`}>
                  <div className="text-center">
                    <span className={`text-[10px] font-mono uppercase tracking-wider block ${isLight ? "text-slate-400" : "text-white/40"}`}>
                      Unit Capex / Bus
                    </span>
                    <span className="font-mono text-xl md:text-2xl font-bold text-[#30D158]">
                      {currentComboDef.priceRange}
                    </span>
                  </div>

                  <button
                    onClick={handleAddRecommendedToPipeline}
                    className="w-full py-2 px-4 rounded-xl bg-[#0A84FF] hover:bg-[#0070e3] text-white text-xs font-semibold shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <span>➕ Add to Fleet Pipeline</span>
                  </button>

                  <span className={`text-[10px] text-center font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                    Fast ~15-25m night install at stand
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border text-center ${
              isLight ? "bg-amber-50/60 border-amber-200 text-amber-900" : "bg-[#16120b] border-[#FF9F0A]/20 text-[#FFB340]"
            }`}>
              <span className="text-2xl block mb-2">⚠️</span>
              <h3 className="text-sm font-semibold">Driver / Owner is Hesitant</h3>
              <p className="text-xs mt-1 max-w-md mx-auto">
                Do not attempt hardware installation yet. Switch to the <strong>Field Objection Buster</strong> tab to address their specific union, RTO, or electrical concerns first.
              </p>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          4. SECTION B: FLEET PIPELINE & REAL-TIME COUNTER
          ========================================================================= */}
      {activePlaybookSection === "pipeline" && (
        <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
          isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <div>
              <span className="text-[11px] font-semibold text-[#30D158] tracking-[0.15em] uppercase">
                Fleet Deployment Tracker
              </span>
              <h2 className="text-xl md:text-2xl font-normal tracking-tight mt-0.5">
                Live Fleet Pipeline &amp; <span className="font-bold">Path Tally Matrix</span>
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                Simulate or record your actual fleet deployment across each onboarding path. Track total Capex invested, monthly revenue yield, and ad capacity dynamically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playClickSound();
                  setPipeline({ combo_1a: 0, combo_1b: 0, combo_1c: 0, combo_1d: 0, combo_1e: 0, combo_2a: 0 });
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
                  isLight ? "bg-slate-100 hover:bg-slate-200 border-slate-200" : "bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08]"
                }`}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Aggregate KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              { label: "Active Buses", val: `${totalPipelineBuses} Buses`, sub: "Across 6 paths", color: "#0A84FF" },
              { label: "Total Hardware Capex", val: `₹${totalCapexMin.toLocaleString()}`, sub: `Max ₹${totalCapexMax.toLocaleString()}`, color: "#30D158" },
              { label: "Route Ad Capacity", val: `${totalAdSlots} Slots/hr`, sub: "12 slots per bus", color: "#BF5AF2" },
              { label: "Owner Payout / Mo", val: `₹${ownerTotalPayout.toLocaleString()}`, sub: "₹2,500/bus guaranteed", color: "#FF9F0A" },
              { label: "Net Monthly Run-Rate", val: `₹${netMonthlyRunRate.toLocaleString()}`, sub: "Your net operating cashflow", color: "#30D158" }
            ].map((kpi, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border relative overflow-hidden ${
                  isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#101217] border-white/[0.07]"
                }`}
              >
                <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ backgroundColor: kpi.color }} />
                <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1 ${isLight ? "text-slate-400" : "text-white/40"}`}>
                  {kpi.label}
                </span>
                <span className="font-mono text-lg md:text-xl font-bold block" style={{ color: kpi.color }}>
                  {kpi.val}
                </span>
                <span className={`text-[10.5px] mt-0.5 block truncate ${isLight ? "text-slate-500" : "text-white/40"}`}>
                  {kpi.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Individual Path Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              {
                id: "combo_1a" as keyof PathCount,
                tag: "1A • MOST COMMON",
                tagColor: "bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30",
                title: "Existing Normal TV (No ETM)",
                capex: "₹4,150 – ₹5,150",
                desc: "Working dumb TV + 24V inverter. Paper tickets. Adds Android Box + GPS Puck + 4G Dongle."
              },
              {
                id: "combo_1b" as keyof PathCount,
                tag: "1B • ULTRA LEAN",
                tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
                title: "Smart Android TV (Direct USB GPS)",
                capex: "₹1,850 – ₹2,300",
                desc: "Smart TV runs APK natively. Direct u-blox GPS into TV USB. Zero external compute box."
              },
              {
                id: "combo_1c" as keyof PathCount,
                tag: "1C • ZERO CAPEX",
                tagColor: "bg-[#BF5AF2]/15 text-[#BF5AF2] border-[#BF5AF2]/30",
                title: "Smart TV + Reused Digital ETM",
                capex: "₹1,850 – ₹2,300",
                desc: "Smart TV + existing conductor ticket machine synced via cloud API."
              },
              {
                id: "combo_1d" as keyof PathCount,
                tag: "1D • REUSE ETM",
                tagColor: "bg-white/[0.06] text-white/70 border-white/[0.12]",
                title: "Normal TV + Reused Digital ETM",
                capex: "₹4,150 – ₹5,150",
                desc: "Dumb TV + Android Box + USB GPS + Conductor electronic ticketing machine reused."
              },
              {
                id: "combo_1e" as keyof PathCount,
                tag: "1E • SMART ETM",
                tagColor: "bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/30",
                title: "Normal TV + Add Sunmi V2s POS",
                capex: "₹17,650 – ₹20,650",
                desc: "Existing TV with full digital POS upgrade for conductor (Seiko thermal ticket + QR)."
              },
              {
                id: "combo_2a" as keyof PathCount,
                tag: "2A • RETROFIT BASIC",
                tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
                title: "32\" LED TV Retrofit (No ETM)",
                capex: "₹14,150 – ₹16,950",
                desc: "Bus with no screen. Installs 32\" TV, ceiling mount, 150W Inverter, Box, GPS & 4G."
              }
            ].map((p) => {
              const count = pipeline[p.id];
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                    count > 0
                      ? isLight ? "bg-white border-[#0A84FF]/40 shadow-sm" : "bg-[#0f1117] border-[#0A84FF]/40"
                      : isLight ? "bg-slate-50 border-slate-200" : "bg-[#08080a] border-white/[0.05]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${p.tagColor}`}>
                        {p.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#30D158]">{p.capex}</span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{p.title}</h3>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${isLight ? "text-slate-500" : "text-white/50"}`}>
                      {p.desc}
                    </p>
                  </div>

                  {/* Counter Stepper */}
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
                    <span className={`text-[11px] font-mono ${isLight ? "text-slate-500" : "text-white/40"}`}>
                      Buses Completed:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePipelineCount(p.id, -1)}
                        className={`w-7 h-7 rounded-lg border font-mono font-bold flex items-center justify-center transition active:scale-95 ${
                          isLight ? "bg-white hover:bg-slate-100 border-slate-300" : "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08]"
                        }`}
                      >
                        −
                      </button>
                      <span className={`font-mono text-base font-bold min-w-[20px] text-center ${count > 0 ? "text-[#0A84FF]" : "opacity-40"}`}>
                        {count}
                      </span>
                      <button
                        onClick={() => updatePipelineCount(p.id, 1)}
                        className={`w-7 h-7 rounded-lg border font-mono font-bold flex items-center justify-center transition active:scale-95 ${
                          isLight ? "bg-white hover:bg-slate-100 border-slate-300" : "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08]"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          5. SECTION C: PARALLEL DUAL-TRACK ROADMAP
          ========================================================================= */}
      {activePlaybookSection === "roadmap" && (
        <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
          isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <div>
              <span className="text-[11px] font-semibold text-[#BF5AF2] tracking-[0.15em] uppercase">
                Synchronized Go-To-Market
              </span>
              <h2 className="text-xl md:text-2xl font-normal tracking-tight mt-0.5">
                Parallel Dual-Track <span className="font-bold">Launch Timeline</span>
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                How hardware installation and route advertiser sales execute in lockstep from Day 1. Never deploy hardware without cash; never sell ads without proof of screen.
              </p>
            </div>

            {/* Week Switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-[#121214] border-white/[0.08]"}`}>
              {[1, 2, 3, 4].map((w) => (
                <button
                  key={w}
                  onClick={() => { playClickSound(); setActiveWeek(w as 1 | 2 | 3 | 4); }}
                  className={`px-3 py-1.5 text-xs rounded-lg transition font-mono font-medium ${
                    activeWeek === w
                      ? "bg-[#0A84FF] text-white shadow-sm"
                      : isLight ? "text-slate-600 hover:text-slate-900" : "text-white/60 hover:text-white"
                  }`}
                >
                  Week {w}
                </button>
              ))}
            </div>
          </div>

          {/* Week Detail Timeline Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT TRACK: BUS FIELD OPS */}
            <div className={`p-5 rounded-2xl border ${
              isLight ? "bg-blue-50/40 border-blue-200" : "bg-[#0c1017] border-[#0A84FF]/25"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#0A84FF] uppercase flex items-center gap-1.5">
                  <span>🚌</span> Track A: Bus Fleet Operations
                </span>
                <span className="text-[11px] font-mono opacity-60">Field Engineering</span>
              </div>

              {activeWeek === 1 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 1–7: 3-Bus Anchor Pilot</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Identify 3 buses with existing TVs on Route A (e.g. Kozhikode ↔ Medical College).</li>
                    <li>Conduct 20-min evening layover install (Combo 1A: Tanix Box + GPS Puck + 4G Dongle).</li>
                    <li>Verify live GPS streaming at 4-second intervals on GetMyBus dispatch map.</li>
                    <li>Load initial test video loop containing stop names &amp; passenger welcome screen.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[11px] text-[#0A84FF] font-mono">
                    🎯 Goal: 3 buses live on route with 0 conductor disruption.
                  </div>
                </div>
              )}

              {activeWeek === 2 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 8–14: Screen Proof-of-Play Verification</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Inspect 1080p offline video caching across morning and peak evening shifts.</li>
                    <li>Record 10-second smartphone videos of the passenger screen playing ads during transit.</li>
                    <li>Hand over first weekly fuel discount voucher / advance share to bus drivers.</li>
                    <li>Lock down USB GPS antenna position on front glass next to inspection sticker.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[11px] text-[#0A84FF] font-mono">
                    🎯 Goal: 99.5% uptime telemetry log &amp; verified ad impression counts.
                  </div>
                </div>
              )}

              {activeWeek === 3 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 15–21: Route Densification (Expand to 10 Buses)</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Approach neighboring bus operators on the SAME corridor at the stand.</li>
                    <li>Show first 3 bus owners receiving their ₹2,500/mo passive bank transfer as social proof!</li>
                    <li>Deploy Combos 1A/1B across 7 additional buses during weekend night halts.</li>
                    <li>Establish a dedicated bus stand support WhatsApp group for instant crew help.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[11px] text-[#0A84FF] font-mono">
                    🎯 Goal: 10 buses running the identical corridor every 8 minutes.
                  </div>
                </div>
              )}

              {activeWeek === 4 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 22–30: Network Corridor Hegemony &amp; Digital POS</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Route reaches critical mass: Every passenger on the street sees GetMyBus signage.</li>
                    <li>Offer Sunmi V2s Android POS ticketing to conductors who request digital UPI tickets.</li>
                    <li>Expand deployment to Cross-Town Corridor 02 (Infopark / Suburb line).</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#0A84FF]/10 border border-[#0A84FF]/20 text-[11px] text-[#0A84FF] font-mono">
                    🎯 Goal: 25 buses active, self-funding hardware from monthly ad receivables.
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT TRACK: ADVERTISER SALES */}
            <div className={`p-5 rounded-2xl border ${
              isLight ? "bg-emerald-50/40 border-emerald-200" : "bg-[#0c1410] border-[#30D158]/25"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#30D158] uppercase flex items-center gap-1.5">
                  <span>📢</span> Track B: Route Advertiser Engine
                </span>
                <span className="text-[11px] font-mono opacity-60">Revenue Engine</span>
              </div>

              {activeWeek === 1 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 1–7: Sign Anchor Sponsor Along Corridor</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Walk the bus route: List 10 prominent businesses (Jewellery, Textile, Multi-speciality Hospital).</li>
                    <li>Walk into store: Pitch Managing Director / Marketing Manager with prototype video.</li>
                    <li>Offer "Founding Anchor Sponsor" deal: 15-sec video ad played 96 times/day @ ₹4,000/mo.</li>
                    <li>Collect ₹4,000 advance cheque to immediately fund the first 3 Android TV boxes!</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#30D158]/10 border border-[#30D158]/20 text-[11px] text-[#30D158] font-mono">
                    💰 Cashflow: ₹4,000 collected (Covers 100% of Capex for 2 buses!).
                  </div>
                </div>
              )}

              {activeWeek === 2 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 8–14: Smartphone Video Proof &amp; 3 Spot Sponsors</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Show the Anchor Sponsor their video playing live on the moving bus; request testimonial.</li>
                    <li>Visit 5 mid-tier merchants along route: Entrance Coaching, Supermarket, Dental Clinic.</li>
                    <li>Sell 3 "Route Spot" slots @ ₹2,500/mo each with geofenced arrival announcement.</li>
                    <li>Upload ad videos to GetMyBus CMS with automatic 1080p compression.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#30D158]/10 border border-[#30D158]/20 text-[11px] text-[#30D158] font-mono">
                    💰 Cashflow: Total ₹11,500/mo recurring contract run-rate achieved.
                  </div>
                </div>
              )}

              {activeWeek === 3 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 15–21: 100% Route Dominance Packages</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Pitch regional brands (Kalyan Silks, Malabar Gold, MyG) for full route dominance.</li>
                    <li>"Your ad plays on all 10 buses every 10 minutes on Mavoor Road / MG Road."</li>
                    <li>Package price: ₹12,000/mo for fleet-wide coverage across all 10 buses.</li>
                    <li>Provide monthly impression certificate generated from GPS geofence pings.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#30D158]/10 border border-[#30D158]/20 text-[11px] text-[#30D158] font-mono">
                    💰 Cashflow: ₹28,000+ monthly run-rate. Self-financing hardware expansion!
                  </div>
                </div>
              )}

              {activeWeek === 4 && (
                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="font-semibold text-sm">Days 22–30: Regional Retainers &amp; Commuter App Promo</div>
                  <ul className="space-y-2 list-disc list-inside opacity-80">
                    <li>Promote GetMyBus passenger app on screens: "Track this bus live on WhatsApp/App".</li>
                    <li>Convert route sponsors into 6-month contracts with 10% prepayment discount.</li>
                    <li>Open waitlist for secondary sponsors on Corridor 02.</li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#30D158]/10 border border-[#30D158]/20 text-[11px] text-[#30D158] font-mono">
                    💰 Cashflow: 6-month upfront receivables fund next 25 bus hardware bundles.
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          6. SECTION D: ADVERTISER CATCHING ENGINE
          ========================================================================= */}
      {activePlaybookSection === "advertisers" && (
        <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
          isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <div>
              <span className="text-[11px] font-semibold text-[#FF9F0A] tracking-[0.15em] uppercase">
                Hyperlocal Monetization Guide
              </span>
              <h2 className="text-xl md:text-2xl font-normal tracking-tight mt-0.5">
                Route Advertiser Pitch &amp; <span className="font-bold">Slot Calculator</span>
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                Who buys transit ads in Kerala towns, the exact 3-minute pitch that closes merchants, and dynamic ad slot pricing formulas.
              </p>
            </div>
          </div>

          {/* 3-Minute Pitch Script */}
          <div className={`p-5 rounded-xl border ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#090b0e] border-white/[0.07]"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🎙️</span>
              <h3 className="text-sm font-semibold">The 3-Minute Bus Stand Merchant Pitch (Verbatim)</h3>
            </div>
            <div className={`text-xs leading-relaxed p-4 rounded-xl border space-y-2.5 font-sans ${
              isLight ? "bg-white border-slate-200 text-slate-700" : "bg-[#070708] border-white/[0.06] text-white/80"
            }`}>
              <p>
                <strong>"Namaskaram Sir</strong>, I am from <strong>GetMyBus</strong>. You have probably seen our private buses passing directly in front of your showroom on this road 18 times every day."
              </p>
              <p>
                "Inside each bus, 60+ passengers sit for <strong>35 minutes in traffic</strong> staring at the 32-inch LED screen right above the cabin. Unlike Instagram where people skip in 2 seconds, or billboards that cost ₹40,000/month that people drive past at 50 km/h, <strong>bus passengers have zero ad-blocker</strong>."
              </p>
              <p>
                "We play your 15-second video ad <strong>96 times every single day</strong> exactly as the bus approaches your store's bus stop. For just <strong>₹3,500 a month</strong>—less than ₹120 a day—every single commuter on this route will know your brand."
              </p>
            </div>
          </div>

          {/* Prime Merchant Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "💎",
                title: "Tier 1: Gold, Silks & Lifestyle",
                examples: "Kalyan Jewellers, Malabar Gold, Seematti, Local Bridal Boutiques",
                budget: "₹4,000 – ₹6,000 / mo",
                pitch: "Weddings & festival seasons. Passengers traveling to town for shopping are primed to buy."
              },
              {
                icon: "🏥",
                title: "Tier 2: Healthcare & Education",
                examples: "Aster/Baby Memorial Local Branches, Brilliant/Pala Coaching, Eye Hospitals",
                budget: "₹3,000 – ₹4,500 / mo",
                pitch: "Route specific: Ads announce doctor timings or admissions right before the hospital bus stop."
              },
              {
                icon: "🛒",
                title: "Tier 3: Local Retail & Auto",
                examples: "Regional Supermarkets, Electronic Stores (MyG, Nandilath), Car Service Hubs",
                budget: "₹2,000 – ₹3,000 / mo",
                pitch: "High frequency: Commuters take the same bus daily. Repetition creates instant brand recall."
              }
            ].map((cat, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#111218] border-white/[0.07]"
                }`}
              >
                <div>
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <h4 className="text-xs font-semibold">{cat.title}</h4>
                  <div className="text-[11px] font-mono text-[#30D158] font-bold mt-1">{cat.budget}</div>
                  <p className={`text-[11px] mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
                    {cat.pitch}
                  </p>
                </div>
                <div className={`mt-3 pt-2.5 border-t text-[10px] font-mono ${isLight ? "border-slate-100 text-slate-400" : "border-white/[0.05] text-white/40"}`}>
                  Targets: {cat.examples}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          7. SECTION E: FIELD OBJECTION BUSTER
          ========================================================================= */}
      {activePlaybookSection === "objections" && (
        <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
          isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <div>
              <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
                Kerala Field Reality Check
              </span>
              <h2 className="text-xl md:text-2xl font-normal tracking-tight mt-0.5">
                Field Objection Buster &amp; <span className="font-bold">Legal Defense</span>
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                The 5 hardest pushbacks you will face at Kerala bus stands (drivers, bus associations, RTO, unions) and exact winning responses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: "obj_battery",
                q: "1. 'Will this drain my bus battery when parked at night?'",
                category: "Electrical",
                answer: "NO. The power inverter and Android TV box are wired strictly through the bus's switched accessory (ACC) ignition line or driver console toggle. When the bus engine turns off, the circuit cuts power immediately. Zero standby current is drawn overnight."
              },
              {
                id: "obj_rto",
                q: "2. 'Will Motor Vehicles Department (MVD/RTO) or Police fine me for TV?'",
                category: "Regulatory",
                answer: "NO. Under the Kerala Motor Vehicles Rules and Central Motor Vehicles Act, passenger entertainment screens mounted behind the driver cabin facing rearward are 100% legal. The screen does not obstruct driver visibility, nor does it display flashing emergency beacons."
              },
              {
                id: "obj_conductor",
                q: "3. 'My conductor will not operate any computer machine!'",
                category: "Crew Union",
                answer: "EXACTLY WHY WE START WITH PHASE 1. In Phase 1, we touch ZERO ticketing equipment! Conductor continues issuing regular paper tickets as they have done for 20 years. We only install the passenger TV ad screen. Conductor has zero new workload."
              },
              {
                id: "obj_internet",
                q: "4. 'What happens when bus goes through hill/rural areas with zero 4G?'",
                category: "Technology",
                answer: "ALL VIDEO ADS PLAY LOCALLY. Every ad video is downloaded and cached inside the Android box's 16GB internal solid-state memory. The ad loop continues playing smoothly without internet. When the bus re-enters 4G coverage, GPS location packets auto-sync."
              },
              {
                id: "obj_repair",
                q: "5. 'Kerala roads have severe potholes. Will the TV fall down?'",
                category: "Hardware",
                answer: "We use heavy-duty anti-vibration cold-rolled steel drop brackets bolted directly into the bus roof chassis rib with nylon locknuts, combined with 3M VHB heavy automotive foam tape. Screws never vibrate loose."
              },
              {
                id: "obj_share",
                q: "6. 'How do I know I will actually get my ₹2,500/month owner share?'",
                category: "Financial",
                answer: "We sign a written Kerala Bus Operator Partnership agreement. Owner share is credited via direct UPI/NEFT on the 1st of every month. Furthermore, you receive a free GPS tracking link to monitor your bus anytime on your mobile phone."
              }
            ].map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  playClickSound();
                  setActiveObjection(activeObjection === obj.id ? null : obj.id);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  activeObjection === obj.id
                    ? isLight ? "bg-blue-50/70 border-[#0A84FF] shadow-sm" : "bg-[#0d121c] border-[#0A84FF]"
                    : isLight ? "bg-white border-slate-200 hover:border-slate-300" : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/20 font-semibold">
                    {obj.category}
                  </span>
                  <span className="text-xs font-mono opacity-50">
                    {activeObjection === obj.id ? "▲ Close" : "▼ Expand Script"}
                  </span>
                </div>
                <h4 className="text-xs font-semibold leading-snug">{obj.q}</h4>

                <p className={`text-xs mt-2.5 pt-2.5 border-t leading-relaxed ${
                  activeObjection === obj.id ? "block" : "line-clamp-2"
                } ${isLight ? "border-slate-200 text-slate-700" : "border-white/[0.06] text-white/70"}`}>
                  {obj.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

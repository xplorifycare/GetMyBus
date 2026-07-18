"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell
} from "recharts";

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  green:"#22c55e", red:"#ef4444", blue:"#3b82f6", amber:"#f59e0b",
  purple:"#a855f7", cyan:"#06b6d4", pink:"#ec4899", indigo:"#6366f1",
  slate:"#64748b", orange:"#f97316"
};
const PIE = [C.blue, C.green, C.amber, C.purple, C.cyan];

// ─── FORMATTERS ──────────────────────────────────────────────────────────────
const fmt = (n) => {
  const a = Math.abs(n);
  if (a >= 1e7) return `₹${(n/1e7).toFixed(2)}Cr`;
  if (a >= 1e5) return `₹${(n/1e5).toFixed(2)}L`;
  if (a >= 1e3) return `₹${(n/1e3).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};
const fmtN = (n) => {
  if (n >= 1e7) return `${(n/1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `${(n/1e5).toFixed(1)}L`;
  if (n >= 1e3) return `${(n/1e3).toFixed(1)}K`;
  return String(Math.round(n));
};

// ─── PRESETS ─────────────────────────────────────────────────────────────────
const PRESETS = {
  bootstrap: {
    label:"🌱 Bootstrap", color:C.amber, desc:"Just you, minimal spend, 5 buses",
    v:{ initialBuses:5, seedCapital:300000, busGrowthRate:15, monthsPerPhase:6,
        cityExpansionMonth:36, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:10000, simCostPerBus:299, maintenancePerBus:150, serverCostPerBus:20,
        avgPassengersPerBus:200, digitalTicketPct:5, ticketCommission:2,
        ownerRevShare:55,
        appAdRPMD:2, teamSalary:60000, officeOther:0, marketingBudget:5000,
        baseInfra:5000, horizonMonths:36, advertiserCount:4, adPlaysPerBrandPerDay:30,
        busRunningHours:8, avgAdDuration:15, adTimeShare:20,
        videoAdPct:30, videoAdDuration:15, imageAdDuration:6,
        eventFee:200, eventActivationPct:5,
        videoCpmRate:40, imageCpmRate:20 }
  },
  conservative: {
    label:"🐢 Conservative", color:C.slate, desc:"Steady growth, low risk",
    v:{ initialBuses:10, seedCapital:700000, busGrowthRate:25, monthsPerPhase:6,
        cityExpansionMonth:24, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:7000, simCostPerBus:299, maintenancePerBus:200, serverCostPerBus:40,
        avgPassengersPerBus:250, digitalTicketPct:10, ticketCommission:2,
        ownerRevShare:50,
        appAdRPMD:3, teamSalary:120000, officeOther:15000, marketingBudget:20000,
        baseInfra:10000, horizonMonths:48, advertiserCount:5, adPlaysPerBrandPerDay:40,
        busRunningHours:10, avgAdDuration:15, adTimeShare:25,
        videoAdPct:40, videoAdDuration:20, imageAdDuration:7,
        eventFee:300, eventActivationPct:6,
        videoCpmRate:60, imageCpmRate:20 }
  },
  base: {
    label:"📊 Base Case", color:C.blue, desc:"Realistic 4-year plan",
    v:{ initialBuses:10, seedCapital:1000000, busGrowthRate:40, monthsPerPhase:5,
        cityExpansionMonth:18, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:5000, simCostPerBus:299, maintenancePerBus:200, serverCostPerBus:50,
        avgPassengersPerBus:300, digitalTicketPct:20, ticketCommission:2,
        ownerRevShare:50,
        appAdRPMD:5, teamSalary:150000, officeOther:30000, marketingBudget:50000,
        baseInfra:15000, horizonMonths:48, advertiserCount:8, adPlaysPerBrandPerDay:60,
        busRunningHours:10, avgAdDuration:15, adTimeShare:30,
        videoAdPct:60, videoAdDuration:20, imageAdDuration:7,
        eventFee:500, eventActivationPct:8,
        videoCpmRate:80, imageCpmRate:30 }
  },
  aggressive: {
    label:"🚀 Aggressive", color:C.green, desc:"High growth, VC-backed",
    v:{ initialBuses:20, seedCapital:3000000, busGrowthRate:70, monthsPerPhase:4,
        cityExpansionMonth:12, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:5000, simCostPerBus:299, maintenancePerBus:200, serverCostPerBus:50,
        avgPassengersPerBus:350, digitalTicketPct:35, ticketCommission:3,
        ownerRevShare:45,
        appAdRPMD:8, teamSalary:400000, officeOther:60000, marketingBudget:150000,
        baseInfra:30000, horizonMonths:48, advertiserCount:12, adPlaysPerBrandPerDay:80,
        busRunningHours:12, avgAdDuration:15, adTimeShare:40,
        videoAdPct:70, videoAdDuration:20, imageAdDuration:7,
        eventFee:1000, eventActivationPct:10,
        videoCpmRate:110, imageCpmRate:40 }
  },
  moonshot: {
    label:"🌕 Moonshot", color:C.purple, desc:"₹1B path — pan-India",
    v:{ initialBuses:30, seedCapital:10000000, busGrowthRate:90, monthsPerPhase:3,
        cityExpansionMonth:9, etmCost:18000, tvCost:7000, installationCost:1500,
        ownerDeposit:5000, simCostPerBus:249, maintenancePerBus:150, serverCostPerBus:30,
        avgPassengersPerBus:400, digitalTicketPct:50, ticketCommission:3,
        ownerRevShare:45,
        appAdRPMD:12, teamSalary:1000000, officeOther:200000, marketingBudget:500000,
        baseInfra:80000, horizonMonths:60, advertiserCount:20, adPlaysPerBrandPerDay:80,
        busRunningHours:14, avgAdDuration:15, adTimeShare:50,
        videoAdPct:80, videoAdDuration:20, imageAdDuration:8,
        eventFee:2500, eventActivationPct:15,
        videoCpmRate:150, imageCpmRate:50 }
  },
  zerodebt: {
    label:"💸 Zero Debt", color:C.orange, desc:"Owner deposit covers hardware",
    v:{ initialBuses:8, seedCapital:400000, busGrowthRate:30, monthsPerPhase:6,
        cityExpansionMonth:24, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:30000, simCostPerBus:299, maintenancePerBus:200, serverCostPerBus:40,
        avgPassengersPerBus:280, digitalTicketPct:15, ticketCommission:2,
        ownerRevShare:50,
        appAdRPMD:4, teamSalary:100000, officeOther:10000, marketingBudget:20000,
        baseInfra:10000, horizonMonths:48, advertiserCount:6, adPlaysPerBrandPerDay:60,
        busRunningHours:10, avgAdDuration:15, adTimeShare:30,
        videoAdPct:50, videoAdDuration:20, imageAdDuration:7,
        eventFee:400, eventActivationPct:8,
        videoCpmRate:70, imageCpmRate:25 }
  },
  sprint6: {
    label:"⚡ 6-Month Plan", color:C.indigo, desc:"Fast scaling 6-month growth plan",
    v:{ initialBuses:10, seedCapital:1500000, busGrowthRate:60, monthsPerPhase:2,
        cityExpansionMonth:4, etmCost:20000, tvCost:8000, installationCost:2000,
        ownerDeposit:5000, simCostPerBus:299, maintenancePerBus:200, serverCostPerBus:50,
        avgPassengersPerBus:300, digitalTicketPct:20, ticketCommission:2,
        ownerRevShare:50,
        appAdRPMD:6, teamSalary:250000, officeOther:25000, marketingBudget:75000,
        baseInfra:20000, horizonMonths:6, advertiserCount:8, adPlaysPerBrandPerDay:60,
        busRunningHours:10, avgAdDuration:15, adTimeShare:30,
        videoAdPct:60, videoAdDuration:20, imageAdDuration:7,
        eventFee:500, eventActivationPct:8,
        videoCpmRate:90, imageCpmRate:35 }
  },
};

const DEFAULT = PRESETS.base.v;

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:8, padding:"10px 14px", fontSize:11 }}>
      <div style={{ color:"#94a3b8", marginBottom:5, fontWeight:700 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, marginBottom:2 }}>
          {p.name}: <b>{typeof p.value==="number" && Math.abs(p.value)>999 ? fmt(p.value) : (p.value?.toLocaleString?.()??p.value)}</b>
        </div>
      ))}
    </div>
  );
}

// ─── SLIDER with number input ─────────────────────────────────────────────────
function Slider({ label, min, max, step, value, onChange, color=C.blue, hint, theme="dark" }) {
  const isLight = theme === "light";
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
        <span style={{ fontSize:11, color: isLight ? "#475569" : "#94a3b8", fontWeight:500, lineHeight:1.3 }}>{label}</span>
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => { const v=Number(e.target.value); if(v>=min&&v<=max) onChange(v); }}
          style={{ 
            width:72, 
            background: isLight ? "#ffffff" : "#0f172a", 
            border:`1px solid ${isLight ? "rgba(0,0,0,0.15)" : color + "55"}`, 
            borderRadius:5,
            color, fontSize:11, fontWeight:700, textAlign:"right", padding:"2px 5px", outline:"none" 
          }}
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor:color, cursor:"pointer", height:3 }}
      />
      {hint && <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginTop:1 }}>{hint}</div>}
    </div>
  );
}

// ─── KPI PILL ────────────────────────────────────────────────────────────────
function KPI({ label, value, color=C.blue, glow, theme="dark" }) {
  const isLight = theme === "light";
  return (
    <div style={{ 
      background: isLight ? "rgba(0,0,0,0.025)" : "#1e293b", 
      border:`1px solid ${isLight ? "rgba(0,0,0,0.06)" : color + "33"}`,
      borderRadius:10, padding:"10px 14px", flex:"1 1 110px", minWidth:100,
      boxShadow: glow && !isLight ? `0 0 16px ${color}44` : "none" 
    }}>
      <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:16, fontWeight:800, color }}>{value}</div>
    </div>
  );
}

// ─── CHART CARD ──────────────────────────────────────────────────────────────
function ChartCard({ title, icon, children, height=220, theme="dark" }) {
  const isLight = theme === "light";
  return (
    <div style={{ 
      background: isLight ? "rgba(0,0,0,0.015)" : "#1e293b", 
      border:`1px solid ${isLight ? "rgba(0,0,0,0.06)" : "#334155"}`, 
      borderRadius:12,
      padding:"14px 16px", marginBottom:14 
    }}>
      <div style={{ fontSize:12, fontWeight:700, color: isLight ? "#475569" : "#94a3b8", marginBottom:10 }}>
        {icon} {title}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Calculator({ theme = "dark" }) {
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);
  const [v, setV] = useState(DEFAULT);
  const [activePreset, setActivePreset] = useState("base");
  const [chartTab, setChartTab] = useState("overview");
  const [openSections, setOpenSections] = useState({
    growth: true,
    hardware: false,
    opex: false,
    fixed: false,
    revenue: false,
    advertisers: false
  });

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const newV = { ...DEFAULT };
      let changed = false;
      urlParams.forEach((val, key) => {
        if (key in DEFAULT) {
          newV[key] = Number(val);
          changed = true;
        }
      });
      if (changed) {
        setV(newV);
        setActivePreset("");
      }
    } catch {
      // Ignore URL parsing errors during server-side render
    }
  }, []);

  const set = (key) => (val) => setV(prev => ({ ...prev, [key]: val }));

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (key) => {
    setV(PRESETS[key].v);
    setActivePreset(key);
  };

  // ─── COMPUTE ───────────────────────────────────────────────────────────────
  const { months, breakEvenMonth, cumulativeCapex } = useMemo(() => {
    const months = [];
    let buses = v.initialBuses;
    let cumRev = 0, cumProfit = 0, cash = v.seedCapital;
    let breakEvenMonth = null;

    for (let m = 1; m <= v.horizonMonths; m++) {
      if (m > 1) {
        const gf = 1 + (v.busGrowthRate/100) / v.monthsPerPhase;
        const cm = m >= v.cityExpansionMonth ? 1.4 : 1;
        buses = Math.min(Math.round(buses * gf * cm), 100000);
      }
      const prevBuses = months[m-2]?.buses || 0;
      const newBuses = m === 1 ? v.initialBuses : Math.max(0, buses - prevBuses);
      const capex = newBuses * Math.max(0, v.etmCost + v.tvCost + v.installationCost - v.ownerDeposit);

      // OPEX
      const busOpex = buses * (v.simCostPerBus + v.maintenancePerBus + v.serverCostPerBus);
      const fixedOpex = v.teamSalary + v.officeOther + v.marketingBudget + v.baseInfra;
      const totalOpex = busOpex + fixedOpex + capex;

      // REVENUE
      const ticketRev = buses * v.avgPassengersPerBus * (v.digitalTicketPct/100) * v.ticketCommission * 30;
      const busHours = v.busRunningHours || 10;
      const adShare = v.adTimeShare || 40;
      
      // Calculate weighted average ad duration and blended CPM:
      const videoPct = v.videoAdPct !== undefined ? v.videoAdPct : 60;
      const videoDur = v.videoAdDuration || 20;
      const imageDur = v.imageAdDuration || 7;
      const avgAdDur = (videoPct / 100) * videoDur + ((100 - videoPct) / 100) * imageDur;

      const videoCpm = v.videoCpmRate !== undefined ? v.videoCpmRate : 150;
      const imageCpm = v.imageCpmRate !== undefined ? v.imageCpmRate : 60;
      const blendedCpm = (videoPct / 100) * videoCpm + ((100 - videoPct) / 100) * imageCpm;

      const maxPlaysPerBusPerDay = (busHours * 3600 * (adShare / 100)) / (avgAdDur || 15);
      const demandedPlays = (v.advertiserCount || 8) * (v.adPlaysPerBrandPerDay || 60);
      const adPlays = Math.min(maxPlaysPerBusPerDay, demandedPlays);
      const grossAdRev = (buses * adPlays * 30 * blendedCpm) / 1000;
      const tvAdRev = grossAdRev * (1 - v.ownerRevShare/100);
      const ownerPayout = grossAdRev * (v.ownerRevShare/100);
      const dau = buses * v.avgPassengersPerBus * (v.digitalTicketPct/100) * 0.3;
      const appAdRev = dau * v.appAdRPMD * 30;
      const eventFee = v.eventFee !== undefined ? v.eventFee : 500;
      const eventActivationPct = v.eventActivationPct !== undefined ? v.eventActivationPct : 8;
      const eventRev = buses * eventFee * (eventActivationPct / 100);
      const totalRev = ticketRev + tvAdRev + appAdRev + eventRev;

      const profit = totalRev - totalOpex;
      cumRev += totalRev;
      cumProfit += profit;
      cash = cash + totalRev - totalOpex;

      if (!breakEvenMonth && profit >= 0) breakEvenMonth = m;

      months.push({
        month: `M${m}`, monthNum: m, buses, newBuses,
        ticketRev: Math.round(ticketRev),
        tvAdRev: Math.round(tvAdRev),
        appAdRev: Math.round(appAdRev),
        eventRev: Math.round(eventRev),
        totalRev: Math.round(totalRev),
        capex: Math.round(capex),
        busOpex: Math.round(busOpex),
        fixedOpex: Math.round(fixedOpex),
        totalOpex: Math.round(totalOpex),
        ownerPayout: Math.round(ownerPayout),
        profit: Math.round(profit),
        cumRev: Math.round(cumRev),
        cumProfit: Math.round(cumProfit),
        cash: Math.round(cash),
        arpu: buses > 0 ? Math.round(totalRev / buses) : 0,
        margin: totalRev > 0 ? Math.round((profit/totalRev)*100) : 0,
      });
    }
    return { months, breakEvenMonth, cumulativeCapex: months.reduce((s,m)=>s+m.capex,0) };
  }, [v]);

  const last = months[months.length-1] || {};
  const first = months[0] || {};
  const netCapexPerBus = Math.max(0, v.etmCost + v.tvCost + v.installationCost - v.ownerDeposit);

  const generateAIPrompt = () => {
    const inputsText = Object.entries(v)
      .map(([key, val]) => `  - ${key}: ${val}`)
      .join("\n");

    const promptText = `I am analyzing my startup, GetMyBus (a private transit digitisation & in-bus ad platform in Kerala). Here is my current simulation data:

[INPUT CONFIGURATION]
${inputsText}

[COMPUTED PROJECTION OUTCOMES (at Scale / End of Horizon)]
- Target Fleet Size: ${last.buses || 0} buses
- Monthly Revenue: ₹${Math.round(last.totalRev || 0).toLocaleString("en-IN")}
- Monthly Net Profit: ₹${Math.round(last.profit || 0).toLocaleString("en-IN")}
- Net Profit Margin: ${last.margin || 0}%
- Break-Even Timeline: ${breakEvenMonth ? `Month ${breakEvenMonth}` : "Not reached"}
- Cash Balance: ₹${Math.round(last.cash || 0).toLocaleString("en-IN")}
- ARPU (Rev/Bus/Mo): ₹${Math.round(last.arpu || 0).toLocaleString("en-IN")}
- Total CAPEX Deployed: ₹${Math.round(cumulativeCapex || 0).toLocaleString("en-IN")}
- Net Hardware CAPEX/Bus: ₹${Math.round(netCapexPerBus || 0).toLocaleString("en-IN")}
- Average Owner Payout: ₹${Math.round(last.ownerPayout ? last.ownerPayout / Math.max(1, last.buses) : 0).toLocaleString("en-IN")}/mo/bus

[REQUEST]
Claude, please act as an expert CFO and growth strategist. Please analyze these metrics and unit economics:
1. Identify any bottlenecks (e.g. low passenger digital ticketing, high ETM/TV cost, poor advertiser demand, high rev share).
2. Recommend 3 concrete actions to improve monthly profit margins or accelerate the hardware CAPEX payback period.
3. Suggest adjustments to my preset parameters (e.g. growth rate, CPM, owner rev share) to reach ₹1B ARR faster.

---
RAW CONFIG JSON (Do not remove: required for importing configuration back into the calculator):
\`\`\`json
${JSON.stringify(v, null, 2)}
\`\`\`
`;
    return promptText;
  };

  const downloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(v, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `getmybus_calculator_config_${activePreset || "custom"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (text) => {
    try {
      let cleaned = text.trim();
      if (cleaned.includes("```json")) {
        const parts = cleaned.split("```json");
        const subparts = parts[1].split("```");
        cleaned = subparts[0].trim();
      } else if (cleaned.includes("```")) {
        const parts = cleaned.split("```");
        cleaned = parts[1].trim();
      }

      const parsed = JSON.parse(cleaned);
      const keys = ["initialBuses", "seedCapital", "busGrowthRate", "horizonMonths"];
      const hasKeys = keys.some(k => k in parsed);
      
      if (!hasKeys) {
        setImportError("Invalid configuration: missing essential scaling parameters.");
        return;
      }
      
      const newV = { ...v };
      Object.entries(parsed).forEach(([key, val]) => {
        if (typeof val === "key" || typeof val === "number" || typeof val === "string") {
          newV[key] = Number(val);
        }
      });
      
      setV(newV);
      setActivePreset("");
      setIsImportOpen(false);
      setImportText("");
      setImportError("");
    } catch {
      setImportError("Error parsing JSON. Please ensure it is a valid JSON object.");
    }
  };

  // milestone rows
  const milestoneTargets = [10,50,100,500,1000,5000,10000,50000];

  // interval for X axis
  const xi = v.horizonMonths > 12 ? Math.floor(v.horizonMonths / 8) : 0;

  const chartTabs = ["overview","revenue","costs","profit","milestones"];
  const chartTabLabel = { overview:"📈 Overview", revenue:"💰 Revenue", costs:"💸 Costs", profit:"🏆 Profit", milestones:"🚀 Milestones" };

  // shared chart styles
  const axTick = { fill: isLight ? "#64748b" : "#475569", fontSize:9 };
  const grid = <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "rgba(0,0,0,0.06)" : "#1e293b"} />;

  if (!mounted) {
    return (
      <div style={{ display:"flex", flexDirection:"column", background:"transparent",
        color: isLight ? "#0f172a" : "#e2e8f0", fontFamily:"'Inter','Segoe UI',sans-serif", fontSize:13,
        justifyContent:"center", alignItems:"center", height:300 }}>
        <div style={{ fontSize:16, fontWeight:700, color: isLight ? "#64748b" : "#94a3b8" }}>Loading Scaling Model...</div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", background:"transparent",
      color: isLight ? "#0f172a" : "#e2e8f0", fontFamily:"'Inter','Segoe UI',sans-serif", fontSize:13 }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"14px 0", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "#1e293b"}`,
        display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:900, background:`linear-gradient(90deg,${C.blue},${C.green})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>GetMyBus</div>
          <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginTop:1 }}>Business Scaling Calculator · Live Model</div>
        </div>

        {/* PRESET BUTTONS */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button key={key} onClick={() => applyPreset(key)} style={{
              padding:"5px 11px", borderRadius:20, border:`1px solid ${p.color}55`,
              background: activePreset===key ? p.color : (isLight ? `${p.color}08` : `${p.color}15`),
              color: activePreset===key ? "#fff" : p.color,
              fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
              whiteSpace:"nowrap"
            }} title={p.desc}>{p.label}</button>
          ))}
        </div>

        <div style={{ marginLeft:"auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {activePreset && (
            <span style={{ fontSize:10, color: isLight ? "#64748b" : "#475569", marginRight: 8 }}>
              {PRESETS[activePreset]?.desc}
            </span>
          )}
          <button 
            onClick={() => {
              setCopySuccess(false);
              setIsExportOpen(true);
            }}
            style={{
              padding: "5px 11px", borderRadius: 8,
              border: isLight ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
              background: isLight ? "#ffffff" : "rgba(255,255,255,0.05)",
              color: isLight ? "#475569" : "#e2e8f0",
              fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}
          >
            📤 Export for AI
          </button>
          <button 
            onClick={() => {
              setImportError("");
              setImportText("");
              setIsImportOpen(true);
            }}
            style={{
              padding: "5px 11px", borderRadius: 8,
              border: isLight ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
              background: isLight ? "#ffffff" : "rgba(255,255,255,0.05)",
              color: isLight ? "#475569" : "#e2e8f0",
              fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}
          >
            📥 Load Config
          </button>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ 
        display:"flex", gap:8, padding:"12px 14px", flexWrap:"wrap", 
        borderRadius:16, 
        background: isLight ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)", 
        border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`, 
        marginBottom:20 
      }}>
        <KPI label="Buses at End" value={fmtN(last.buses||0)} color={C.blue} theme={theme} />
        <KPI label="Monthly Revenue" value={fmt(last.totalRev||0)} color={C.green} glow theme={theme} />
        <KPI label="Monthly Profit" value={fmt(last.profit||0)} color={(last.profit||0)>=0?C.green:C.red} glow={(last.profit||0)>0} theme={theme} />
        <KPI label="Break-Even" value={breakEvenMonth?`Month ${breakEvenMonth}`:"—"} color={breakEvenMonth?C.green:C.amber} theme={theme} />
        <KPI label="Cash Balance" value={fmt(last.cash||0)} color={(last.cash||0)>=0?C.cyan:C.red} theme={theme} />
        <KPI label="Cum. Revenue" value={fmt(last.cumRev||0)} color={C.purple} theme={theme} />
        <KPI label="Net CAPEX/Bus" value={fmt(netCapexPerBus)} color={C.amber} theme={theme} />
        <KPI label="Rev/Bus/Month" value={fmt(last.arpu||0)} color={C.indigo} theme={theme} />
        <KPI label="Margin %" value={`${last.margin||0}%`} color={(last.margin||0)>=0?C.green:C.red} theme={theme} />
        <KPI label="Owner Payout/mo" value={fmt(last.ownerPayout||0)} color={C.slate} theme={theme} />
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ display:"flex", flex:1, gap:20, flexWrap:"wrap" }}>

        {/* ── LEFT: INPUTS PANEL ── */}
        <div className="w-full lg:w-[280px]" style={{ flexShrink:0, display:"flex", flexDirection:"column" }}>

          {/* 1. GROWTH SECTION */}
          <div
            onClick={() => toggleSection("growth")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.blue,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.growth ? 12 : 8,
              marginTop: 4,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>📈 Growth</span>
            <span style={{ fontSize: 9 }}>{openSections.growth ? "▲" : "▼"}</span>
          </div>

          {openSections.growth && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Starting Buses" min={1} max={200} step={1}
                value={v.initialBuses} onChange={set("initialBuses")} color={C.blue} theme={theme} />
              <Slider label="Seed Capital (₹)" min={0} max={20000000} step={50000}
                value={v.seedCapital} onChange={set("seedCapital")} fmt={fmt} color={C.blue} theme={theme} />
              <Slider label="Bus Growth Rate % (per phase)" min={1} max={150} step={1}
                value={v.busGrowthRate} onChange={set("busGrowthRate")} fmt={n=>`${n}%`} color={C.blue}
                hint="% fleet increase per phase cycle" theme={theme} />
              <Slider label="Phase Length (months)" min={1} max={12} step={1}
                value={v.monthsPerPhase} onChange={set("monthsPerPhase")} color={C.blue} theme={theme} />
              <Slider label="City Expansion at Month" min={1} max={60} step={1}
                value={v.cityExpansionMonth} onChange={set("cityExpansionMonth")} color={C.cyan}
                hint="1.4× growth multiplier kicks in" theme={theme} />
              <Slider label="Projection (months)" min={6} max={72} step={6}
                value={v.horizonMonths} onChange={set("horizonMonths")} color={C.blue} theme={theme} />
            </div>
          )}

          <div style={{ height:1, background: isLight ? "rgba(0,0,0,0.06)" : "#1e293b", margin: openSections.growth ? "6px 0 12px 0" : "4px 0 8px 0" }} />

          {/* 2. HARDWARE SECTION */}
          <div
            onClick={() => toggleSection("hardware")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.amber,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.hardware ? 12 : 8,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>🔧 Hardware CAPEX</span>
            <span style={{ fontSize: 9 }}>{openSections.hardware ? "▲" : "▼"}</span>
          </div>

          {openSections.hardware && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Android ETM Cost (₹)" min={0} max={60000} step={500}
                value={v.etmCost} onChange={set("etmCost")} fmt={fmt} color={C.amber} theme={theme} />
              <Slider label="TV / Display Cost (₹)" min={0} max={30000} step={500}
                value={v.tvCost} onChange={set("tvCost")} fmt={fmt} color={C.amber} theme={theme} />
              <Slider label="Installation Cost (₹)" min={0} max={10000} step={250}
                value={v.installationCost} onChange={set("installationCost")} fmt={fmt} color={C.amber} theme={theme} />
              <Slider label="Owner Security Deposit (₹)" min={0} max={50000} step={500}
                value={v.ownerDeposit} onChange={set("ownerDeposit")} fmt={fmt} color={C.green}
                hint="Offsets your CAPEX — recovered from owner" theme={theme} />

              <div style={{ 
                background: isLight ? "rgba(0,0,0,0.02)" : "#0f172a", 
                border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "transparent"}`,
                borderRadius:8, padding:"8px 12px", marginBottom:12 
              }}>
                <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569" }}>Your net CAPEX per bus</div>
                <div style={{ fontSize:16, fontWeight:800, color:C.amber }}>{fmt(netCapexPerBus)}</div>
                {netCapexPerBus<=0 && <div style={{ fontSize:9, color:C.green }}>✓ Fully owner-funded!</div>}
              </div>
            </div>
          )}

          <div style={{ height:1, background: isLight ? "rgba(0,0,0,0.06)" : "#1e293b", margin: openSections.hardware ? "6px 0 12px 0" : "4px 0 8px 0" }} />

          {/* 3. MONTHLY OPEX SECTION */}
          <div
            onClick={() => toggleSection("opex")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.red,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.opex ? 12 : 8,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>💸 Monthly Opex / Bus</span>
            <span style={{ fontSize: 9 }}>{openSections.opex ? "▲" : "▼"}</span>
          </div>

          {openSections.opex && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="SIM / Data Plan (₹)" min={0} max={2000} step={50}
                value={v.simCostPerBus} onChange={set("simCostPerBus")} fmt={fmt} color={C.red} theme={theme} />
              <Slider label="Maintenance (₹)" min={0} max={2000} step={50}
                value={v.maintenancePerBus} onChange={set("maintenancePerBus")} fmt={fmt} color={C.red} theme={theme} />
              <Slider label="Marginal Server Cost (₹)" min={0} max={500} step={10}
                value={v.serverCostPerBus} onChange={set("serverCostPerBus")} fmt={fmt} color={C.red} theme={theme} />
            </div>
          )}

          <div style={{ height:1, background: isLight ? "rgba(0,0,0,0.06)" : "#1e293b", margin: openSections.opex ? "6px 0 12px 0" : "4px 0 8px 0" }} />

          {/* 4. FIXED OPEX SECTION */}
          <div
            onClick={() => toggleSection("fixed")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.pink,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.fixed ? 12 : 8,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>🏢 Fixed Monthly Opex</span>
            <span style={{ fontSize: 9 }}>{openSections.fixed ? "▲" : "▼"}</span>
          </div>

          {openSections.fixed && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Team Salaries (₹)" min={0} max={5000000} step={10000}
                value={v.teamSalary} onChange={set("teamSalary")} fmt={fmt} color={C.pink} theme={theme} />
              <Slider label="Office + Misc (₹)" min={0} max={500000} step={5000}
                value={v.officeOther} onChange={set("officeOther")} fmt={fmt} color={C.pink} theme={theme} />
              <Slider label="Marketing Budget (₹)" min={0} max={2000000} step={10000}
                value={v.marketingBudget} onChange={set("marketingBudget")} fmt={fmt} color={C.pink} theme={theme} />
              <Slider label="Base Infrastructure (₹)" min={0} max={500000} step={5000}
                value={v.baseInfra} onChange={set("baseInfra")} fmt={fmt} color={C.pink} theme={theme} />
            </div>
          )}

          <div style={{ height:1, background: isLight ? "rgba(0,0,0,0.06)" : "#1e293b", margin: openSections.fixed ? "6px 0 12px 0" : "4px 0 8px 0" }} />

          {/* 5. REVENUE LEVERS SECTION */}
          <div
            onClick={() => toggleSection("revenue")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.green,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.revenue ? 12 : 8,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>💰 Revenue Levers</span>
            <span style={{ fontSize: 9 }}>{openSections.revenue ? "▲" : "▼"}</span>
          </div>

          {openSections.revenue && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Avg Passengers / Bus / Day" min={0} max={2000} step={25}
                value={v.avgPassengersPerBus} onChange={set("avgPassengersPerBus")} color={C.green} theme={theme} />
              <Slider label="Digital Ticket Adoption %" min={0} max={100} step={1}
                value={v.digitalTicketPct} onChange={set("digitalTicketPct")} fmt={n=>`${n}%`} color={C.green} theme={theme} />
              <Slider label="Ticket Commission (₹ / ticket)" min={0} max={30} step={0.5}
                value={v.ticketCommission} onChange={set("ticketCommission")} fmt={n=>`₹${n}`} color={C.green} theme={theme} />
              <Slider label="App Ad Revenue (₹/DAU/day)" min={0} max={30} step={0.5}
                value={v.appAdRPMD} onChange={set("appAdRPMD")} fmt={n=>`₹${n}`} color={C.green} theme={theme} />
              
              <Slider label="Event Sponsorship (₹ / bus)" min={0} max={5000} step={100}
                value={v.eventFee !== undefined ? v.eventFee : 500} onChange={set("eventFee")} fmt={fmt} color={C.green}
                hint="Sponsorship rate charged per event per bus" theme={theme} />
              
              <Slider label="Event Activation Rate %" min={0} max={100} step={1}
                value={v.eventActivationPct !== undefined ? v.eventActivationPct : 8} onChange={set("eventActivationPct")} fmt={n=>`${n}%`} color={C.green}
                hint="% of buses hosting sponsored events/activations monthly" theme={theme} />
            </div>
          )}

          <div style={{ height:1, background: isLight ? "rgba(0,0,0,0.06)" : "#1e293b", margin: openSections.revenue ? "6px 0 12px 0" : "4px 0 8px 0" }} />

          {/* 6. ADVERTISERS SECTION */}
          <div
            onClick={() => toggleSection("advertisers")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              color: C.purple,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: openSections.advertisers ? 12 : 8,
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.15s ease-in-out"
            }}
          >
            <span>📢 Advertisers</span>
            <span style={{ fontSize: 9 }}>{openSections.advertisers ? "▲" : "▼"}</span>
          </div>

          {openSections.advertisers && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Advertisers Count" min={1} max={50} step={1}
                value={v.advertiserCount || 8} onChange={set("advertiserCount")} color={C.purple} theme={theme} />
              
              <Slider label="Bus Running Hours / Day" min={4} max={18} step={0.5}
                value={v.busRunningHours || 10} onChange={set("busRunningHours")} color={C.purple}
                hint="Daily operational hours of the bus screens" theme={theme} />

              <Slider label="Video Ads Share %" min={0} max={100} step={5}
                value={v.videoAdPct !== undefined ? v.videoAdPct : 60} onChange={set("videoAdPct")} fmt={n=>`${n}%`} color={C.purple}
                hint={`Remaining ${100 - (v.videoAdPct !== undefined ? v.videoAdPct : 60)}% are static image ads`} theme={theme} />

              <Slider label="Video Ad Duration (seconds)" min={10} max={60} step={5}
                value={v.videoAdDuration || 20} onChange={set("videoAdDuration")} color={C.purple} theme={theme} />

              <Slider label="Image Ad Duration (seconds)" min={3} max={15} step={1}
                value={v.imageAdDuration || 7} onChange={set("imageAdDuration")} color={C.purple} theme={theme} />

              <Slider label="Ad Screen Share %" min={5} max={100} step={5}
                value={v.adTimeShare || 40} onChange={set("adTimeShare")} fmt={n=>`${n}%`} color={C.purple}
                hint="Proportion of screen loop allocated for ads vs transit info" theme={theme} />

              {/* Dynamic Capacity Stats Panel */}
              {(() => {
                const vidPct = v.videoAdPct !== undefined ? v.videoAdPct : 60;
                const vidDur = v.videoAdDuration || 20;
                const imgDur = v.imageAdDuration || 7;
                const weightedAvgDur = (vidPct / 100) * vidDur + ((100 - vidPct) / 100) * imgDur;
                
                const maxCap = Math.round(((v.busRunningHours || 10) * 3600 * ((v.adTimeShare || 40) / 100)) / (weightedAvgDur || 15));
                const demanded = (v.advertiserCount || 8) * (v.adPlaysPerBrandPerDay || 60);
                const actualPlays = Math.min(maxCap, demanded);
                const calculatedFill = maxCap > 0 ? (actualPlays / maxCap) * 100 : 0;
                const playsBrand = v.adPlaysPerBrandPerDay || 60;
 
                // Timeline percentages:
                const adShare = v.adTimeShare || 40;
                const wVideo = adShare * (calculatedFill / 100) * (vidPct / 100);
                const wImage = adShare * (calculatedFill / 100) * ((100 - vidPct) / 100);
                const wUnfilled = adShare * ((100 - calculatedFill) / 100);
                const wTransit = 100 - adShare;
 
                const playsPerHour = playsBrand / (v.busRunningHours || 10);
 
                const videoCpm = v.videoCpmRate !== undefined ? v.videoCpmRate : 150;
                const imageCpm = v.imageCpmRate !== undefined ? v.imageCpmRate : 60;
                const blendedCpm = (vidPct / 100) * videoCpm + ((100 - vidPct) / 100) * imageCpm;
 
                const ownerRevShare = v.ownerRevShare !== undefined ? v.ownerRevShare : 50;
                const grossRevBusMonth = (actualPlays * 30 * blendedCpm) / 1000;
                const ownerCutBusMonth = grossRevBusMonth * (ownerRevShare / 100);
                const yourCutBusMonth = grossRevBusMonth - ownerCutBusMonth;
 
                return (
                  <div>
                    {/* Stats Card */}
                    <div style={{ 
                      background: isLight ? "rgba(0,0,0,0.02)" : "#0f172a", 
                      border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "transparent"}`,
                      borderRadius:8, padding:"10px 12px", marginBottom:10 
                    }}>
                      <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginBottom:4, fontWeight:700, textTransform:"uppercase" }}>Network Ad Capacity</div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Avg Ad Duration:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.indigo }}>{weightedAvgDur.toFixed(1)}s</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Max Plays Capacity:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.purple }}>{maxCap} / day</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Demanded Plays:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.amber }}>{demanded} / day</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Calculated Fill Rate:</span>
                        <span style={{ fontSize:10, fontWeight:700, color: calculatedFill >= 100 ? C.red : C.green }}>
                          {calculatedFill.toFixed(1)}% {calculatedFill >= 100 ? "(Capped)" : ""}
                        </span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Plays per Brand:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.cyan }}>{playsBrand} / day</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Brand Play Frequency:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.pink }}>~{playsPerHour.toFixed(1)} times / hour</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Blended CPM Rate:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.purple }}>₹{blendedCpm.toFixed(1)} / 1k</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", borderTop: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid #1e293b", marginTop:6, paddingTop:6, marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Gross Rev / Bus / Month:</span>
                        <span style={{ fontSize:10, fontWeight:700, color: isLight ? "#0f172a" : "#ffffff" }}>₹{Math.round(grossRevBusMonth).toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Bus Owner Cut / Month:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.amber }}>₹{Math.round(ownerCutBusMonth).toLocaleString("en-IN")} ({ownerRevShare}%)</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <span style={{ fontSize:10, color: isLight ? "#475569" : "#94a3b8" }}>Your Net Cut / Bus / Month:</span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.green }}>₹{Math.round(yourCutBusMonth).toLocaleString("en-IN")} ({100 - ownerRevShare}%)</span>
                      </div>
                    </div>
 
                    {/* Timeline loop visualizer */}
                    <div style={{ 
                      background: isLight ? "rgba(0,0,0,0.02)" : "#0f172a", 
                      border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "transparent"}`,
                      borderRadius:8, padding:"10px 12px", marginBottom:12 
                    }}>
                      <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginBottom:6, fontWeight:700, textTransform:"uppercase" }}>Screen Loop Timeline (1 Hour)</div>
                      
                      {/* Timeline bar */}
                      <div style={{ height:18, display:"flex", borderRadius:9, overflow:"hidden", border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "#1e293b"}`, marginBottom:8 }}>
                        {wVideo > 0 && <div style={{ width:`${wVideo}%`, background:C.purple }} title={`Video Ads: ${wVideo.toFixed(1)}%`} />}
                        {wImage > 0 && <div style={{ width:`${wImage}%`, background:C.blue }} title={`Image Ads: ${wImage.toFixed(1)}%`} />}
                        {wUnfilled > 0 && <div style={{ width:`${wUnfilled}%`, background: isLight ? "rgba(0,0,0,0.15)" : "#334155" }} title={`Unfilled Slots: ${wUnfilled.toFixed(1)}%`} />}
                        {wTransit > 0 && <div style={{ width:`${wTransit}%`, background:C.green }} title={`Transit Info: ${wTransit.toFixed(1)}%`} />}
                      </div>
 
                      {/* Legend */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, fontSize:8 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ width:6, height:6, borderRadius:2, background:C.purple }} />
                          <span style={{ color: isLight ? "#475569" : "#94a3b8" }}>Video Ads ({wVideo.toFixed(0)}%)</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ width:6, height:6, borderRadius:2, background:C.blue }} />
                          <span style={{ color: isLight ? "#475569" : "#94a3b8" }}>Image Ads ({wImage.toFixed(0)}%)</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ width:6, height:6, borderRadius:2, background: isLight ? "rgba(0,0,0,0.15)" : "#334155" }} />
                          <span style={{ color: isLight ? "#475569" : "#94a3b8" }}>Unfilled ({wUnfilled.toFixed(0)}%)</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <span style={{ width:6, height:6, borderRadius:2, background:C.green }} />
                          <span style={{ color: isLight ? "#475569" : "#94a3b8" }}>Transit Info ({wTransit.toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
 
              <Slider label="Plays / Brand / Bus / Day" min={10} max={500} step={10}
                value={v.adPlaysPerBrandPerDay || 60} onChange={set("adPlaysPerBrandPerDay")} color={C.purple}
                hint="How many times each advertiser's ad runs daily per bus" theme={theme} />
 
              <Slider label="Video CPM Rate (₹ / 1000 plays)" min={0} max={500} step={5}
                value={v.videoCpmRate !== undefined ? v.videoCpmRate : 150} onChange={set("videoCpmRate")} fmt={n=>`₹${n}`} color={C.purple}
                hint="CPM rate charged for video campaigns" theme={theme} />
 
              <Slider label="Image CPM Rate (₹ / 1000 plays)" min={0} max={300} step={5}
                value={v.imageCpmRate !== undefined ? v.imageCpmRate : 60} onChange={set("imageCpmRate")} fmt={n=>`₹${n}`} color={C.purple}
                hint="CPM rate charged for static image campaigns" theme={theme} />
 
              <Slider label="Owner Revenue Share %" min={0} max={90} step={5}
                value={v.ownerRevShare} onChange={set("ownerRevShare")} fmt={n=>`${n}%`} color={C.amber}
                hint={`You keep ${100-v.ownerRevShare}%`} theme={theme} />
            </div>
          )}
 
          <div style={{ height:30 }} />
        </div>
 
        {/* ── RIGHT: CHARTS PANEL ── */}
        <div style={{ flex:1 }}>
 
          {/* Chart tab bar */}
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {chartTabs.map(t => (
              <button key={t} onClick={() => setChartTab(t)} style={{
                padding:"5px 13px", borderRadius:8, cursor:"pointer",
                fontSize:11, fontWeight:700,
                background: chartTab===t ? C.blue : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"),
                color: chartTab===t ? "#fff" : (isLight ? "#475569" : "#94a3b8"),
                border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.05)",
                transition:"all 0.15s"
              }}>{chartTabLabel[t]}</button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {chartTab==="overview" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Fleet Growth" icon="🚌" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.35}/>
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                    </linearGradient></defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmtN}/>
                    <Tooltip content={<Tip/>}/>
                    <Area type="monotone" dataKey="buses" stroke={C.blue} fill="url(#bg)" name="Buses" strokeWidth={2} dot={false}/>
                    {v.cityExpansionMonth<=v.horizonMonths&&<ReferenceLine x={`M${v.cityExpansionMonth}`} stroke={C.amber} strokeDasharray="4 3" label={{value:"🏙️",fill:C.amber,fontSize:10}}/>}
                    {breakEvenMonth&&<ReferenceLine x={`M${breakEvenMonth}`} stroke={C.green} strokeDasharray="4 3" label={{value:"✅",fill:C.green,fontSize:10}}/>}
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Revenue vs Cost" icon="⚖️" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10}}/>
                    <Line type="monotone" dataKey="totalRev" stroke={C.green} name="Revenue" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="totalOpex" stroke={C.red} name="Cost" strokeWidth={2} dot={false} strokeDasharray="5 3"/>
                    {breakEvenMonth&&<ReferenceLine x={`M${breakEvenMonth}`} stroke={C.green} strokeDasharray="4 3"/>}
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Monthly Profit / Loss" icon="📊" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5}/>
                    <Bar dataKey="profit" name="Profit" radius={[2,2,0,0]}>
                      {months.map((m,i)=><Cell key={i} fill={m.profit>=0?C.green:C.red}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cash Balance" icon="🏦" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.cyan} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.cyan} stopOpacity={0}/>
                    </linearGradient></defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke={C.red} strokeWidth={1.5}/>
                    <Area type="monotone" dataKey="cash" stroke={C.cyan} fill="url(#cg)" name="Cash" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Unit economics strip */}
            <div style={{ 
              background: isLight ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.02)", 
              border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12, padding:"14px 16px", marginTop:14 
            }}>
              <div style={{ fontSize:11, fontWeight:700, color: isLight ? "#475569" : "#94a3b8", marginBottom:10 }}>🧮 Unit Economics</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  {l:"Net CAPEX/Bus", v:fmt(netCapexPerBus), c:C.amber},
                  {l:"Opex/Bus/Month", v:fmt(v.simCostPerBus+v.maintenancePerBus+v.serverCostPerBus), c:C.red},
                  {l:"Rev/Bus M1", v:fmt(first.arpu||0), c:C.green},
                  {l:`Rev/Bus M${v.horizonMonths}`, v:fmt(last.arpu||0), c:C.green},
                  {l:"HW Payback", v:first.arpu>0?`~${Math.ceil(netCapexPerBus/first.arpu)}mo`:"∞", c:C.purple},
                  {l:"Owner ₹/Bus/Mo", v:fmt((last.ownerPayout||0)/Math.max(1,last.buses||1)), c:C.slate},
                  {l:"Break-Even", v:breakEvenMonth?`M${breakEvenMonth}`:"Not reached", c:breakEvenMonth?C.green:C.red},
                  {l:"Total CAPEX Deployed", v:fmt(cumulativeCapex), c:C.amber},
                ].map(({l,v:val,c})=>(
                  <div key={l} style={{ 
                    background: isLight ? "#ffffff" : "#0f172a", 
                    border: isLight ? "1px solid rgba(0,0,0,0.06)" : "none",
                    borderRadius:8, padding:"9px 12px", flex:"1 1 120px", minWidth:110 
                  }}>
                    <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:c }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ── REVENUE ── */}
          {chartTab==="revenue" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Revenue Streams Over Time" icon="💰" height={240} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs>
                      {["r1","r2","r3","r4"].map((id,i)=>(
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={PIE[i]} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={PIE[i]} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10}}/>
                    <Area type="monotone" dataKey="ticketRev" stackId="1" stroke={PIE[0]} fill="url(#r1)" name="Ticket Comm." dot={false}/>
                    <Area type="monotone" dataKey="tvAdRev" stackId="1" stroke={PIE[1]} fill="url(#r2)" name="TV Ads" dot={false}/>
                    <Area type="monotone" dataKey="appAdRev" stackId="1" stroke={PIE[2]} fill="url(#r3)" name="App Ads" dot={false}/>
                    <Area type="monotone" dataKey="eventRev" stackId="1" stroke={PIE[3]} fill="url(#r4)" name="Events" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={`Revenue Mix M${v.horizonMonths}`} icon="🥧" height={240} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      {name:"Ticket",value:last.ticketRev||0},
                      {name:"TV Ads",value:last.tvAdRev||0},
                      {name:"App Ads",value:last.appAdRev||0},
                      {name:"Events",value:last.eventRev||0},
                    ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} style={{fontSize:9}}>
                      {PIE.map((c,i)=><Cell key={i} fill={c}/>)}
                    </Pie>
                    <Tooltip formatter={v=>fmt(v)}/>
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14, marginTop:14 }}>
              <ChartCard title="Your Ad Cut vs Owner Payout" icon="🤝" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10}}/>
                    <Bar dataKey="tvAdRev" fill={C.green} name="Your Cut" radius={[2,2,0,0]}/>
                    <Bar dataKey="ownerPayout" fill={C.slate} name="Owner Payout" radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cumulative Revenue" icon="📈" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs><linearGradient id="crg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.green} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                    </linearGradient></defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <Area type="monotone" dataKey="cumRev" stroke={C.green} fill="url(#crg)" name="Cum. Revenue" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>)}

          {/* ── COSTS ── */}
          {chartTab==="costs" && (<>
            <ChartCard title="Monthly Cost Breakdown" icon="💸" height={240} theme={theme}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={months}>
                  {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                  <YAxis tick={axTick} tickFormatter={fmt}/>
                  <Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:10}}/>
                  <Area type="monotone" dataKey="capex" stackId="1" stroke={C.red} fill={C.red+"33"} name="Hardware CAPEX" dot={false}/>
                  <Area type="monotone" dataKey="busOpex" stackId="1" stroke={C.amber} fill={C.amber+"33"} name="Bus Variable" dot={false}/>
                  <Area type="monotone" dataKey="fixedOpex" stackId="1" stroke={C.pink} fill={C.pink+"33"} name="Team + Fixed" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14, marginTop:14 }}>
              <ChartCard title="Hardware CAPEX Deployment" icon="🔧" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <Bar dataKey="capex" fill={C.red} name="CAPEX" radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cost Structure at Scale" icon="📊" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      {name:"Bus Opex",value:last.busOpex||0},
                      {name:"Team+Fixed",value:last.fixedOpex||0},
                      {name:"CAPEX",value:last.capex||0},
                    ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} style={{fontSize:9}}>
                      <Cell fill={C.amber}/><Cell fill={C.pink}/><Cell fill={C.red}/>
                    </Pie>
                    <Tooltip formatter={v=>fmt(v)}/>
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Cost breakdown table */}
            <div style={{ 
              background: isLight ? "rgba(0,0,0,0.01)" : "#1e293b", 
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "#334155"}`, 
              borderRadius:12, padding:"14px 16px", marginTop:14 
            }}>
              <div style={{ fontSize:11, fontWeight:700, color: isLight ? "#475569" : "#94a3b8", marginBottom:10 }}>Cost Snapshot</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
                {[
                  {title:`Month 1 (${v.initialBuses} buses)`, m:first},
                  {title:`Month ${v.horizonMonths} (${fmtN(last.buses||0)} buses)`, m:last},
                ].map(({title,m})=>(
                  <div key={title}>
                    <div style={{ fontSize:10, color: isLight ? "#64748b" : "#475569", marginBottom:6 }}>{title}</div>
                    {[
                      {l:"Hardware CAPEX",v:m.capex,c:C.red},
                      {l:"Bus Variable Opex",v:m.busOpex,c:C.amber},
                      {l:"Team + Fixed",v:m.fixedOpex,c:C.pink},
                      {l:"Total",v:m.totalOpex,c: isLight ? "#0f172a" : "#e2e8f0"},
                    ].map(({l,v:val,c})=>(
                      <div key={l} style={{ display:"flex", justifyContent:"space-between",
                        padding:"5px 0", borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "#0f172a"}` }}>
                        <span style={{ fontSize:11, color: isLight ? "#64748b" : "#64748b" }}>{l}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:c }}>{fmt(val||0)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ── PROFIT ── */}
          {chartTab==="profit" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Monthly Profit / Loss" icon="📊" height={220} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={2}/>
                    {breakEvenMonth&&<ReferenceLine x={`M${breakEvenMonth}`} stroke={C.green} strokeDasharray="4 3"
                      label={{value:`Break-even`,fill:C.green,fontSize:9,position:"top"}}/>}
                    <Bar dataKey="profit" name="Profit" radius={[2,2,0,0]}>
                      {months.map((m,i)=><Cell key={i} fill={m.profit>=0?C.green:C.red}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Gross Margin %" icon="%" height={220} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={n=>`${n}%`}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke="#475569"/>
                    <Line type="monotone" dataKey="margin" stroke={C.indigo} name="Margin %" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cumulative Profit / Loss" icon="📈" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs><linearGradient id="cpg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.purple} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                    </linearGradient></defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke={C.red} strokeWidth={1.5}/>
                    <Area type="monotone" dataKey="cumProfit" stroke={C.purple} fill="url(#cpg)" name="Cum. Profit" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cash Balance" icon="🏦" height={200} theme={theme}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={months}>
                    <defs><linearGradient id="cbal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.cyan} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.cyan} stopOpacity={0}/>
                    </linearGradient></defs>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke={C.red} strokeWidth={1.5}/>
                    <Area type="monotone" dataKey="cash" stroke={C.cyan} fill="url(#cbal)" name="Cash" strokeWidth={2} dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>)}

          {/* ── MILESTONES ── */}
          {chartTab==="milestones" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10, marginBottom:14 }}>
              {milestoneTargets.map(target => {
                const hit = months.find(m => m.buses >= target);
                return (
                  <div key={target} style={{ 
                    background: isLight ? "rgba(0,0,0,0.015)" : "#1e293b", 
                    border: isLight ? "1px solid rgba(0,0,0,0.06)" : `1px solid ${hit?C.green+"44":"#334155"}`,
                    borderRadius:10, padding:"12px 14px", opacity:hit?1:0.45 
                  }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>
                      {target<=10?"🌱":target<=100?"🚌":target<=500?"🏙️":target<=1000?"🌆":target<=5000?"🌍":"💰"}
                    </div>
                    <div style={{ fontSize:12, fontWeight:800, color: isLight ? "#0f172a" : "#e2e8f0" }}>{fmtN(target)} Buses</div>
                    {hit ? (<>
                      <div style={{ fontSize:10, color:C.green, marginTop:4 }}>Reached {hit.month}</div>
                      <div style={{ fontSize:10, color: isLight ? "#64748b" : "#94a3b8" }}>Rev: {fmt(hit.totalRev)}/mo</div>
                      <div style={{ fontSize:10, color:hit.profit>=0?C.green:C.red }}>
                        Profit: {fmt(hit.profit)}/mo
                      </div>
                      <div style={{ fontSize:10, color: isLight ? "#64748b" : "#64748b" }}>Cash: {fmt(hit.cash)}</div>
                    </>) : (
                      <div style={{ fontSize:10, color: isLight ? "#64748b" : "#475569", marginTop:4 }}>Not in {v.horizonMonths}mo</div>
                    )}
                  </div>
                );
              })}
            </div>

            <ChartCard title="Revenue Per Bus (ARPU) Trend" icon="📊" height={210} theme={theme}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={months}>
                  {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                  <YAxis tick={axTick} tickFormatter={fmt}/>
                  <Tooltip content={<Tip/>}/>
                  <Line type="monotone" dataKey="arpu" stroke={C.indigo} name="Rev/Bus" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Path to ₹1B */}
            <div style={{ 
              background: isLight ? "rgba(0,0,0,0.01)" : "#1e293b", 
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : C.purple + "33"}`, 
              borderRadius:12, padding:"16px" 
            }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.purple, marginBottom:12 }}>🌕 Path to ₹1 Billion ARR</div>
              <div style={{ fontSize:11, color: isLight ? "#475569" : "#64748b", marginBottom:12 }}>
                Annual revenue of ₹100Cr = ₹1B. With current model, you need:
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:10 }}>
                {[
                  {l:"Buses needed (at current ARPU)", v: last.arpu>0?fmtN(Math.ceil(1e9/12/last.arpu)):"∞", c:C.blue},
                  {l:"Monthly Rev needed", v:fmt(1e9/12), c:C.green},
                  {l:"Current monthly rev", v:fmt(last.totalRev||0), c:(last.totalRev||0)>=(1e9/12)?C.green:C.amber},
                  {l:"Gap to ₹1B ARR", v:fmt(Math.max(0,(1e9/12)-(last.totalRev||0))), c:C.red},
                  {l:"Months to ₹1B ARR", v:(() => {const h=months.find(m=>m.totalRev>=1e9/12); return h?h.month:"Beyond horizon";})(), c:C.purple},
                  {l:"End of horizon revenue run-rate", v:fmt((last.totalRev||0)*12)+" /yr", c:C.cyan},
                ].map(({l,v:val,c})=>(
                  <div key={l} style={{ 
                    background: isLight ? "#ffffff" : "#0f172a", 
                    border: isLight ? "1px solid rgba(0,0,0,0.06)" : "none",
                    borderRadius:8, padding:"10px 12px" 
                  }}>
                    <div style={{ fontSize:9, color: isLight ? "#64748b" : "#475569", marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:c }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          <div style={{ height:20 }} />
        </div>
      </div>

      {/* ── EXPORT MODAL ── */}
      {isExportOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 99999, padding: 16
        }}>
          <div style={{
            background: isLight ? "#ffffff" : "#1e293b",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "#334155"}`,
            borderRadius: 16, width: "100%", maxWidth: 640,
            padding: 24, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            color: isLight ? "#0f172a" : "#e2e8f0",
            display: "flex", flexDirection: "column", gap: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.purple }}>📤 Export Scaling Parameters & Outcomes</div>
              <button 
                onClick={() => setIsExportOpen(false)}
                style={{
                  background: "transparent", border: "none", color: isLight ? "#64748b" : "#94a3b8",
                  fontSize: 18, cursor: "pointer", fontWeight: 700
                }}
              >✕</button>
            </div>
            
            <div style={{ fontSize: 11, color: isLight ? "#475569" : "#94a3b8" }}>
              Copy the text below and paste it directly into an AI assistant like **Claude** or **ChatGPT** to get expert CFO scaling recommendations. The block also contains the raw JSON payload so you can easily load any optimization changes back into the calculator later!
            </div>

            <textarea 
              readOnly 
              value={generateAIPrompt()}
              style={{
                width: "100%", height: 260, borderRadius: 8,
                background: isLight ? "rgba(0,0,0,0.02)" : "#0f172a",
                border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "#334155"}`,
                color: isLight ? "#334155" : "#cbd5e1",
                fontFamily: "monospace", fontSize: 11, padding: 12,
                resize: "none"
              }}
              onClick={(e) => e.target.select()}
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generateAIPrompt());
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none",
                  background: copySuccess ? C.green : C.purple, color: "#fff",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
                }}
              >
                {copySuccess ? "✔ Prompt Copied!" : "📋 Copy Prompt for AI"}
              </button>

              <button 
                onClick={downloadConfig}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}`,
                  background: isLight ? "#f1f5f9" : "rgba(255,255,255,0.05)",
                  color: isLight ? "#0f172a" : "#fff",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
                }}
              >
                💾 Download Config JSON
              </button>

              <button 
                onClick={() => setIsExportOpen(false)}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.05)",
                  background: "transparent", color: isLight ? "#64748b" : "#94a3b8",
                  fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT / LOAD MODAL ── */}
      {isImportOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 99999, padding: 16
        }}>
          <div style={{
            background: isLight ? "#ffffff" : "#1e293b",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "#334155"}`,
            borderRadius: 16, width: "100%", maxWidth: 540,
            padding: 24, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            color: isLight ? "#0f172a" : "#e2e8f0",
            display: "flex", flexDirection: "column", gap: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.blue }}>📥 Load Configuration</div>
              <button 
                onClick={() => setIsImportOpen(false)}
                style={{
                  background: "transparent", border: "none", color: isLight ? "#64748b" : "#94a3b8",
                  fontSize: 18, cursor: "pointer", fontWeight: 700
                }}
              >✕</button>
            </div>

            <div style={{ fontSize: 11, color: isLight ? "#475569" : "#94a3b8" }}>
              Paste the configuration text (or the entire Claude output containing the JSON code block) below, or upload a previously exported configuration `.json` file.
            </div>

            {/* File uploader */}
            <div style={{
              border: `2px dashed ${isLight ? "rgba(0,0,0,0.1)" : "#475569"}`,
              borderRadius: 10, padding: "16px 20px", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 8, background: isLight ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.01)",
              position: "relative"
            }}>
              <span style={{ fontSize: 18 }}>📁</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>Drag and drop or click to upload a config file</span>
              <input 
                type="file" 
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    handleImport(event.target.result);
                  };
                  reader.readAsText(file);
                }}
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: "pointer"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: isLight ? "rgba(0,0,0,0.06)" : "#334155" }} />
              <span style={{ fontSize: 9, color: isLight ? "#94a3b8" : "#475569", fontWeight: 700 }}>OR PASTE TEXT</span>
              <div style={{ flex: 1, height: 1, background: isLight ? "rgba(0,0,0,0.06)" : "#334155" }} />
            </div>

            <textarea 
              placeholder='Paste JSON here (e.g. { "initialBuses": 15, ... })'
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setImportError("");
              }}
              style={{
                width: "100%", height: 120, borderRadius: 8,
                background: isLight ? "rgba(0,0,0,0.02)" : "#0f172a",
                border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "#334155"}`,
                color: isLight ? "#334155" : "#cbd5e1",
                fontFamily: "monospace", fontSize: 11, padding: 10,
                resize: "none"
              }}
            />

            {importError && (
              <div style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>
                ⚠️ {importError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button 
                onClick={() => handleImport(importText)}
                disabled={!importText.trim()}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: !importText.trim() ? "#cbd5e1" : C.blue,
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  cursor: !importText.trim() ? "not-allowed" : "pointer"
                }}
              >
                Apply Configuration
              </button>

              <button 
                onClick={() => setIsImportOpen(false)}
                style={{
                  padding: "8px 18px", borderRadius: 8,
                  border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.05)",
                  background: "transparent", color: isLight ? "#64748b" : "#94a3b8",
                  fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

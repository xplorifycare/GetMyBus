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
function Slider({ label, min, max, step, value, onChange, color=C.blue, hint }) {
  return (
    <div style={{ marginBottom:13 }}>
      <div style={{ display:"flex", justifyContext:"space-between", alignItems:"center", marginBottom:3, flexWrap:"nowrap" }}>
        <span style={{ fontSize:11, color:"#94a3b8", fontWeight:500, lineHeight:1.3 }}>{label}</span>
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => { const v=Number(e.target.value); if(v>=min&&v<=max) onChange(v); }}
          style={{ width:72, background:"#0f172a", border:`1px solid ${color}55`, borderRadius:5,
            color, fontSize:11, fontWeight:700, textAlign:"right", padding:"2px 5px", outline:"none", marginLeft:"auto" }}
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor:color, cursor:"pointer", height:3 }}
      />
      {hint && <div style={{ fontSize:9, color:"#475569", marginTop:1 }}>{hint}</div>}
    </div>
  );
}

// ─── KPI PILL ────────────────────────────────────────────────────────────────
function KPI({ label, value, color=C.blue, glow }) {
  return (
    <div style={{ background:"#1e293b", border:`1px solid ${color}33`,
      borderRadius:10, padding:"10px 14px", flex:"1 1 110px", minWidth:100,
      boxShadow: glow ? `0 0 16px ${color}44` : "none" }}>
      <div style={{ fontSize:9, color:"#475569", textTransform:"uppercase", letterSpacing:0.8, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:16, fontWeight:800, color }}>{value}</div>
    </div>
  );
}

// ─── CHART CARD ──────────────────────────────────────────────────────────────
function ChartCard({ title, icon, children, height=220 }) {
  return (
    <div style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:12,
      padding:"14px 16px", marginBottom:14 }}>
      <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", marginBottom:10 }}>
        {icon} {title}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Calculator() {
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

  useEffect(() => {
    setMounted(true);
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

  const milestoneTargets = [10,50,100,500,1000,5000,10000,50000];
  const xi = v.horizonMonths > 12 ? Math.floor(v.horizonMonths / 8) : 0;

  const chartTabs = ["overview","revenue","costs","profit","milestones"];
  const chartTabLabel = { overview:"Overview", revenue:"Revenue Mix", costs:"Costs", profit:"Profitability", milestones:"Milestones" };

  const axTick = { fill:"#64748b", fontSize:9 };
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#33415555" />;

  if (!mounted) {
    return (
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:300 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#94a3b8" }}>Loading Simulator...</div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", background:"transparent", color:"#e2e8f0", fontSize:13 }}>
      {/* ── PRESETS ── */}
      <div style={{ padding:"10px 0 16px 0", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", color:"#64748b", letterSpacing:0.8 }}>Presets:</span>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button key={key} onClick={() => applyPreset(key)} style={{
              padding:"4px 10px", borderRadius:12, border:`1px solid ${p.color}55`,
              background: activePreset===key ? p.color : `${p.color}12`,
              color: activePreset===key ? "#fff" : p.color,
              fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
              whiteSpace:"nowrap"
            }} title={p.desc}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ display:"flex", gap:8, padding:"12px 14px", flexWrap:"wrap", borderRadius:16,
        background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:20 }}>
        <KPI label="Buses at End" value={fmtN(last.buses||0)} color={C.blue} />
        <KPI label="Monthly Revenue" value={fmt(last.totalRev||0)} color={C.green} glow />
        <KPI label="Monthly Profit" value={fmt(last.profit||0)} color={(last.profit||0)>=0?C.green:C.red} glow={(last.profit||0)>0} />
        <KPI label="Break-Even" value={breakEvenMonth?`Month ${breakEvenMonth}`:"—"} color={breakEvenMonth?C.green:C.amber} />
        <KPI label="Cash Balance" value={fmt(last.cash||0)} color={(last.cash||0)>=0?C.cyan:C.red} />
        <KPI label="Rev/Bus/Month" value={fmt(last.arpu||0)} color={C.indigo} />
        <KPI label="Margin %" value={`${last.margin||0}%`} color={(last.margin||0)>=0?C.green:C.red} />
        <KPI label="Owner Payout/mo" value={fmt(last.ownerPayout||0)} color={C.slate} />
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
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 10px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>📈 Growth</span>
            <span style={{ fontSize: 9 }}>{openSections.growth ? "▲" : "▼"}</span>
          </div>

          {openSections.growth && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Starting Buses" min={1} max={200} step={1}
                value={v.initialBuses} onChange={set("initialBuses")} color={C.blue} />
              <Slider label="Seed Capital (₹)" min={0} max={20000000} step={50000}
                value={v.seedCapital} onChange={set("seedCapital")} color={C.blue} />
              <Slider label="Bus Growth Rate %" min={1} max={150} step={1}
                value={v.busGrowthRate} onChange={set("busGrowthRate")} color={C.blue}
                hint="% fleet increase per phase cycle" />
              <Slider label="Phase Length (months)" min={1} max={12} step={1}
                value={v.monthsPerPhase} onChange={set("monthsPerPhase")} color={C.blue} />
              <Slider label="City Expansion Month" min={1} max={60} step={1}
                value={v.cityExpansionMonth} onChange={set("cityExpansionMonth")} color={C.cyan} />
              <Slider label="Projection (months)" min={6} max={72} step={6}
                value={v.horizonMonths} onChange={set("horizonMonths")} color={C.blue} />
            </div>
          )}

          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"6px 0 12px 0" }} />

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
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>🔧 Hardware CAPEX</span>
            <span style={{ fontSize: 9 }}>{openSections.hardware ? "▲" : "▼"}</span>
          </div>

          {openSections.hardware && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Android ETM Cost (₹)" min={0} max={60000} step={500}
                value={v.etmCost} onChange={set("etmCost")} color={C.amber} />
              <Slider label="TV / Display Cost (₹)" min={0} max={30000} step={500}
                value={v.tvCost} onChange={set("tvCost")} color={C.amber} />
              <Slider label="Installation Cost (₹)" min={0} max={10000} step={250}
                value={v.installationCost} onChange={set("installationCost")} color={C.amber} />
              <Slider label="Owner Deposit (₹)" min={0} max={50000} step={500}
                value={v.ownerDeposit} onChange={set("ownerDeposit")} color={C.green}
                hint="Recovered from owner deposit" />
            </div>
          )}

          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"6px 0 12px 0" }} />

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
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>💸 Opex / Bus</span>
            <span style={{ fontSize: 9 }}>{openSections.opex ? "▲" : "▼"}</span>
          </div>

          {openSections.opex && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="SIM / Data (₹)" min={0} max={2000} step={50}
                value={v.simCostPerBus} onChange={set("simCostPerBus")} color={C.red} />
              <Slider label="Maintenance (₹)" min={0} max={2000} step={50}
                value={v.maintenancePerBus} onChange={set("maintenancePerBus")} color={C.red} />
              <Slider label="Server Cost (₹)" min={0} max={500} step={10}
                value={v.serverCostPerBus} onChange={set("serverCostPerBus")} color={C.red} />
            </div>
          )}

          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"6px 0 12px 0" }} />

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
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>🏢 Fixed Monthly Opex</span>
            <span style={{ fontSize: 9 }}>{openSections.fixed ? "▲" : "▼"}</span>
          </div>

          {openSections.fixed && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Team Salaries (₹)" min={0} max={5000000} step={10000}
                value={v.teamSalary} onChange={set("teamSalary")} color={C.pink} />
              <Slider label="Office + Misc (₹)" min={0} max={500000} step={5000}
                value={v.officeOther} onChange={set("officeOther")} color={C.pink} />
              <Slider label="Marketing Budget (₹)" min={0} max={2000000} step={10000}
                value={v.marketingBudget} onChange={set("marketingBudget")} color={C.pink} />
              <Slider label="Base Infra (₹)" min={0} max={500000} step={5000}
                value={v.baseInfra} onChange={set("baseInfra")} color={C.pink} />
            </div>
          )}

          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"6px 0 12px 0" }} />

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
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>💰 Revenue Levers</span>
            <span style={{ fontSize: 9 }}>{openSections.revenue ? "▲" : "▼"}</span>
          </div>

          {openSections.revenue && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Passengers / Bus / Day" min={0} max={2000} step={25}
                value={v.avgPassengersPerBus} onChange={set("avgPassengersPerBus")} color={C.green} />
              <Slider label="Digital Ticket Adoption %" min={0} max={100} step={1}
                value={v.digitalTicketPct} onChange={set("digitalTicketPct")} color={C.green} />
              <Slider label="Commission / ticket (₹)" min={0} max={30} step={0.5}
                value={v.ticketCommission} onChange={set("ticketCommission")} color={C.green} />
              <Slider label="App Ad Rev (₹/DAU/day)" min={0} max={30} step={0.5}
                value={v.appAdRPMD} onChange={set("appAdRPMD")} color={C.green} />
              <Slider label="Event Sponsorship (₹)" min={0} max={5000} step={100}
                value={v.eventFee !== undefined ? v.eventFee : 500} onChange={set("eventFee")} color={C.green} />
              <Slider label="Event Activation Rate %" min={0} max={100} step={1}
                value={v.eventActivationPct !== undefined ? v.eventActivationPct : 8} onChange={set("eventActivationPct")} color={C.green} />
            </div>
          )}

          <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"6px 0 12px 0" }} />

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
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>📢 Advertisers</span>
            <span style={{ fontSize: 9 }}>{openSections.advertisers ? "▲" : "▼"}</span>
          </div>

          {openSections.advertisers && (
            <div style={{ padding: "0 4px 12px 4px" }}>
              <Slider label="Advertisers Count" min={1} max={50} step={1}
                value={v.advertiserCount || 8} onChange={set("advertiserCount")} color={C.purple} />
              <Slider label="Running Hours / Day" min={4} max={18} step={0.5}
                value={v.busRunningHours || 10} onChange={set("busRunningHours")} color={C.purple} />
              <Slider label="Video Ads Share %" min={0} max={100} step={5}
                value={v.videoAdPct !== undefined ? v.videoAdPct : 60} onChange={set("videoAdPct")} color={C.purple} />
              <Slider label="Video Ad Duration (s)" min={10} max={60} step={5}
                value={v.videoAdDuration || 20} onChange={set("videoAdDuration")} color={C.purple} />
              <Slider label="Image Ad Duration (s)" min={3} max={15} step={1}
                value={v.imageAdDuration || 7} onChange={set("imageAdDuration")} color={C.purple} />
              <Slider label="Ad Screen Share %" min={5} max={100} step={5}
                value={v.adTimeShare || 40} onChange={set("adTimeShare")} color={C.purple} />
              <Slider label="Plays / Brand / Bus" min={10} max={500} step={10}
                value={v.adPlaysPerBrandPerDay || 60} onChange={set("adPlaysPerBrandPerDay")} color={C.purple} />
              <Slider label="Video CPM (₹/1k)" min={0} max={500} step={5}
                value={v.videoCpmRate !== undefined ? v.videoCpmRate : 150} onChange={set("videoCpmRate")} color={C.purple} />
              <Slider label="Image CPM (₹/1k)" min={0} max={300} step={5}
                value={v.imageCpmRate !== undefined ? v.imageCpmRate : 60} onChange={set("imageCpmRate")} color={C.purple} />
              <Slider label="Owner Rev Share %" min={0} max={90} step={5}
                value={v.ownerRevShare} onChange={set("ownerRevShare")} color={C.amber} />
            </div>
          )}
        </div>

        {/* ── RIGHT: CHARTS PANEL ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          {/* Chart tab bar */}
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {chartTabs.map(t => (
              <button key={t} onClick={() => setChartTab(t)} style={{
                padding:"5px 13px", borderRadius:8, border:"none", cursor:"pointer",
                fontSize:11, fontWeight:700,
                background: chartTab===t ? C.blue : "rgba(255,255,255,0.04)",
                color: chartTab===t ? "#fff" : "#64748b",
                transition:"all 0.15s"
              }}>{chartTabLabel[t]}</button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {chartTab==="overview" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Fleet Growth" icon="🚌" height={200}>
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

              <ChartCard title="Revenue vs Cost" icon="⚖️" height={200}>
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

              <ChartCard title="Monthly Profit / Loss" icon="📊" height={200}>
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

              <ChartCard title="Cash Balance" icon="🏦" height={200}>
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
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12,
              padding:"14px 16px", marginTop:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:10 }}>🧮 Unit Economics</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  {l:"Net CAPEX/Bus", v:fmt(netCapexPerBus), c:C.amber},
                  {l:"Opex/Bus/Month", v:fmt(v.simCostPerBus+v.maintenancePerBus+v.serverCostPerBus), c:C.red},
                  {l:"Rev/Bus M1", v:fmt(first.arpu||0), c:C.green},
                  {l:`Rev/Bus M${v.horizonMonths}`, v:fmt(last.arpu||0), c:C.green},
                  {l:"HW Payback", v:first.arpu>0?`~${Math.ceil(netCapexPerBus/first.arpu)}mo`:"∞", c:C.purple},
                  {l:"Owner ₹/Bus/Mo", v:fmt((last.ownerPayout||0)/Math.max(1,last.buses||1)), c:C.slate},
                  {l:"Break-Even", v:breakEvenMonth?`M${breakEvenMonth}`:"Not reached", c:breakEvenMonth?C.green:C.red},
                  {l:"Total CAPEX", v:fmt(cumulativeCapex), c:C.amber},
                ].map(({l,v:val,c})=>(
                  <div key={l} style={{ background:"#0f172a", borderRadius:8, padding:"9px 12px", flex:"1 1 120px", minWidth:110 }}>
                    <div style={{ fontSize:9, color:"#475569", marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:c }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </>)}

          {/* ── REVENUE ── */}
          {chartTab==="revenue" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Revenue Streams Over Time" icon="💰" height={240}>
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

              <ChartCard title={`Revenue Mix M${v.horizonMonths}`} icon="🥧" height={240}>
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

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14, marginTop:10 }}>
              <ChartCard title="Your Ad Cut vs Owner Payout" icon="🤝" height={200}>
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

              <ChartCard title="Cumulative Revenue" icon="📈" height={200}>
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
            <ChartCard title="Monthly Cost Breakdown" icon="💸" height={240}>
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

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14, marginTop:10 }}>
              <ChartCard title="Hardware CAPEX Deployment" icon="🔧" height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <Bar dataKey="capex" fill={C.red} name="CAPEX" radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cost Structure at Scale" icon="📊" height={200}>
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
          </>)}

          {/* ── PROFIT ── */}
          {chartTab==="profit" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              <ChartCard title="Monthly Profit / Loss" icon="📊" height={220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={months}>
                    {grid}<XAxis dataKey="month" tick={axTick} interval={xi}/>
                    <YAxis tick={axTick} tickFormatter={fmt}/>
                    <Tooltip content={<Tip/>}/>
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={2}/>
                    {breakEvenMonth&&<ReferenceLine x={`M${breakEvenMonth}`} stroke={C.green} strokeDasharray="4 3"/>}
                    <Bar dataKey="profit" name="Profit" radius={[2,2,0,0]}>
                      {months.map((m,i)=><Cell key={i} fill={m.profit>=0?C.green:C.red}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Gross Margin %" icon="%" height={220}>
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
            </div>
          </>)}

          {/* ── MILESTONES ── */}
          {chartTab==="milestones" && (<>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))", gap:10, marginBottom:14 }}>
              {milestoneTargets.map(target => {
                const hit = months.find(m => m.buses >= target);
                return (
                  <div key={target} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${hit?C.green+"44":"rgba(255,255,255,0.05)"}`,
                    borderRadius:10, padding:"12px 14px", opacity:hit?1:0.45 }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>
                      {target<50?"🌱":target<500?"🚌":"🏙️"}
                    </div>
                    <div style={{ fontSize:12, fontWeight:800 }}>{fmtN(target)} Buses</div>
                    {hit ? (
                      <div style={{ fontSize:10, color:C.green, marginTop:4 }}>Reached {hit.month}</div>
                    ) : (
                      <div style={{ fontSize:10, color:"#475569", marginTop:4 }}>Not reached</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

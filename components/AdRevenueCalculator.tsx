"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";

interface AdRevenueCalculatorProps {
  theme?: "dark" | "light";
}

// ─── UTILITY FORMATTERS ────────────────────────────────────────────────────────
const formatINR = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const formatNumber = (n: number) => {
  if (n >= 1e7) return `${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.round(n).toLocaleString("en-IN");
};

// ─── AD FORMATS & SPECIFICATIONS ───────────────────────────────────────────────
export type AdFormatType = "video" | "image" | "lband" | "chime";

export interface AdFormatOption {
  id: AdFormatType;
  name: string;
  badge: string;
  priceMultiplier: number;
  description: string;
  icon: string;
  screenShareDesc: string;
}

export const AD_FORMAT_OPTIONS: AdFormatOption[] = [
  {
    id: "video",
    name: "Full HD Video Commercial",
    badge: "Highest Impact",
    priceMultiplier: 1.0,
    description: "1080p 60fps video with clear audio & subtitles. 100% full screen takeover.",
    icon: "🎬",
    screenShareDesc: "100% Screen Takeover",
  },
  {
    id: "image",
    name: "Static Digital HD Poster",
    badge: "Budget Friendly",
    priceMultiplier: 0.65, // 35% discount
    description: "High-resolution graphic slide with subtle Ken Burns zoom. Zero video production needed.",
    icon: "🖼️",
    screenShareDesc: "100% Screen (Still)",
  },
  {
    id: "lband",
    name: "L-Band / Split Companion Banner",
    badge: "Continuous Presence",
    priceMultiplier: 0.50, // 50% discount
    description: "25% persistent side/bottom border shown alongside live GPS route map.",
    icon: "📐",
    screenShareDesc: "25% Screen Border",
  },
  {
    id: "chime",
    name: "Next-Stop Audio Chime Sponsor",
    badge: "Geo-Fenced Audio",
    priceMultiplier: 0.45,
    description: "4s audio chime + lower third stop announcement triggered by GPS right at junction arrival.",
    icon: "🔔",
    screenShareDesc: "Audio Chime + Stop Banner",
  },
];

// ─── DURATION OPTIONS ──────────────────────────────────────────────────────────
export interface DurationOption {
  seconds: number;
  label: string;
  priceMultiplier: number;
  description: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { seconds: 6, label: "6s Bumper / Poster", priceMultiplier: 0.65, description: "Quick visual recall & price tickers" },
  { seconds: 10, label: "10s Standard Spot", priceMultiplier: 1.00, description: "Standard DOOH spot, optimal frequency" },
  { seconds: 15, label: "15s Commercial Cut", priceMultiplier: 1.40, description: "Full TV commercial cut with audio dialogue" },
  { seconds: 20, label: "20s Showcase", priceMultiplier: 1.80, description: "Real estate walkthrough & hospital specialities" },
  { seconds: 30, label: "30s Cinematic Reel", priceMultiplier: 2.50, description: "Film trailers, luxury bridal & storytelling" },
];

// ─── PRIORITY & DAYPARTING TIERS ───────────────────────────────────────────────
export type PriorityTierType = "platinum" | "gold" | "silver" | "diamond";

export interface PriorityTierOption {
  id: PriorityTierType;
  name: string;
  schedule: string;
  surchargeLabel: string;
  multiplier: number;
  icon: string;
  description: string;
  audienceDensity: string;
}

export const PRIORITY_TIERS: PriorityTierOption[] = [
  {
    id: "platinum",
    name: "Platinum (Peak Commute Monopolization)",
    schedule: "7:30 AM – 10:30 AM & 4:00 PM – 7:30 PM",
    surchargeLabel: "+35% Peak Surge",
    multiplier: 1.35,
    icon: "⚡",
    description: "Guaranteed play every single 6-minute loop during morning & evening peak rush hours.",
    audienceDensity: "100%–120% Bus Capacity (Packed)",
  },
  {
    id: "gold",
    name: "Gold (All-Day Standard Run)",
    schedule: "6:30 AM – 8:30 PM (All 14 Operating Hours)",
    surchargeLabel: "Standard Base Rate",
    multiplier: 1.00,
    icon: "☀️",
    description: "Uniform round-robin playout across all morning, afternoon, and evening departures.",
    audienceDensity: "Balanced Transit Average (~650/day)",
  },
  {
    id: "silver",
    name: "Silver (Off-Peak Budget Saver)",
    schedule: "10:30 AM – 4:00 PM & 7:30 PM – 9:00 PM",
    surchargeLabel: "-30% Off-Peak Discount",
    multiplier: 0.70,
    icon: "🌙",
    description: "Budget-friendly rotation during midday shopping hours and quiet evening return runs.",
    audienceDensity: "Seated Travelers (~300/day)",
  },
  {
    id: "diamond",
    name: "Diamond (Geo-Fenced Corridor Takeover)",
    schedule: "GPS Proximity Trigger (Within 2km of Location)",
    surchargeLabel: "+75% Geo-Exclusive Surge",
    multiplier: 1.75,
    icon: "📍",
    description: "100% video slot monopoly whenever the bus approaches within 2 km of your business.",
    audienceDensity: "Hyper-Targeted Local Footfall",
  },
];

// ─── ADVERTISER PRESETS ────────────────────────────────────────────────────────
interface SectorPreset {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  recommendedBuses: number;
  recommendedFormat: AdFormatType;
  recommendedDuration: number;
  recommendedPriority: PriorityTierType;
  targetDailyPlays: number;
  pitchHeadline: string;
  keyBenefits: string[];
  suggestedPackage: "starter" | "growth" | "network";
}

const SECTOR_PRESETS: SectorPreset[] = [
  {
    id: "jeweller",
    name: "Gold & Diamond Jeweller",
    tagline: "Bridal Season Recall & Town High-Street Domination",
    icon: "💎",
    recommendedBuses: 12,
    recommendedFormat: "video",
    recommendedDuration: 15,
    recommendedPriority: "platinum",
    targetDailyPlays: 720,
    pitchHeadline: "Be the First & Last Brand Wedding Shoppers See",
    keyBenefits: [
      "15s Cinematic Video on 24-inch FHD IPS display capturing festive shoppers",
      "Platinum Peak Rush monopolization during bridal shopping hours (4 PM - 7:30 PM)",
      "Daily Kerala 22K Gold Rate ticker sponsorship included complimentary",
    ],
    suggestedPackage: "growth",
  },
  {
    id: "hospital",
    name: "Hospital & Diagnostics",
    tagline: "Trust, Specialist Schedules & Emergency Awareness",
    icon: "🏥",
    recommendedBuses: 15,
    recommendedFormat: "chime",
    recommendedDuration: 10,
    recommendedPriority: "diamond",
    targetDailyPlays: 1050,
    pitchHeadline: "Establish Highest Health Authority on Regional Arteries",
    keyBenefits: [
      "GPS-triggered next-stop audio chime: 'Arriving at Medical College, sponsored by...'",
      "Static slide ticker displaying visiting cardiologist & oncology clinic hours",
      "Diamond Corridor takeover when bus enters hospital 2km radius",
    ],
    suggestedPackage: "growth",
  },
  {
    id: "education",
    name: "College / Entrance Coaching",
    tagline: "Student & Parent Morning/Evening Commute Monopolization",
    icon: "🎓",
    recommendedBuses: 8,
    recommendedFormat: "video",
    recommendedDuration: 10,
    recommendedPriority: "platinum",
    targetDailyPlays: 640,
    pitchHeadline: "Own the 7:30 AM & 4:30 PM Peak Student Rush Hours",
    keyBenefits: [
      "Targeted broadcast during 7:30-9:00 AM school/college transit journeys",
      "QR code voucher on screen for free NEET/JEE test series demo registration",
      "100% captive audience in bus aisles with zero phone distraction",
    ],
    suggestedPackage: "starter",
  },
  {
    id: "retail",
    name: "Supermarket & Hypermarket",
    tagline: "Weekend Offer Blitz & Direct Footfall Acceleration",
    icon: "🛒",
    recommendedBuses: 20,
    recommendedFormat: "image",
    recommendedDuration: 6,
    recommendedPriority: "gold",
    targetDailyPlays: 1600,
    pitchHeadline: "Drive Everyday Household Footfall with Weekly Deal Displays",
    keyBenefits: [
      "Cost-effective 6s Static Poster slides updated weekly with supermarket deal fliers",
      "All-day uniform exposure across residential feeder routes",
      "82% cheaper than local newspaper pamphlet inserts with zero waste",
    ],
    suggestedPackage: "network",
  },
  {
    id: "realestate",
    name: "Real Estate & Builders",
    tagline: "NRI Corridor & Premium Commuter High-Impact Showcase",
    icon: "🏢",
    recommendedBuses: 10,
    recommendedFormat: "video",
    recommendedDuration: 20,
    recommendedPriority: "platinum",
    targetDailyPlays: 500,
    pitchHeadline: "Cinematic HD Walkthroughs for Captive Salaried Commuters",
    keyBenefits: [
      "20-second cinematic video reel showcased on 24-inch FHD IPS display",
      "L-Band persistent companion logo during live GPS route announcements",
      "Target high-income suburban transit corridors connecting IT hubs & municipal centers",
    ],
    suggestedPackage: "growth",
  },
];

// ─── READY-MADE AD PACKAGES ────────────────────────────────────────────────────
interface AdPackage {
  id: "starter" | "growth" | "network";
  title: string;
  buses: number;
  pricePerMonth: number;
  slotDuration: number;
  loopsPerHour: number;
  estMonthlyPlays: number;
  estMonthlyViews: number;
  idealFor: string;
  badge?: string;
}

const AD_PACKAGES: AdPackage[] = [
  {
    id: "starter",
    title: "Corridor Starter",
    buses: 3,
    pricePerMonth: 6500,
    slotDuration: 10,
    loopsPerHour: 6,
    estMonthlyPlays: 7560,
    estMonthlyViews: 54000,
    idealFor: "Local clinics, cafes, boutique stores & specialty salons",
    badge: "Budget Friendly",
  },
  {
    id: "growth",
    title: "Route Dominance",
    buses: 10,
    pricePerMonth: 18500,
    slotDuration: 10,
    loopsPerHour: 6,
    estMonthlyPlays: 25200,
    estMonthlyViews: 195000,
    idealFor: "Jewellers, coaching academies, car dealerships & hospitals",
    badge: "Most Popular",
  },
  {
    id: "network",
    title: "Town Network Leader",
    buses: 25,
    pricePerMonth: 42000,
    slotDuration: 10,
    loopsPerHour: 6,
    estMonthlyPlays: 63000,
    estMonthlyViews: 520000,
    idealFor: "FMCG brands, supermarket chains, banking & enterprise builders",
    badge: "Maximum Reach",
  },
];

export default function AdRevenueCalculator({ theme = "dark" }: AdRevenueCalculatorProps) {
  const isLight = theme === "light";

  // Top Level Mode: "operator" vs "advertiser" vs "loop" vs "benchmark"
  const [activeMode, setActiveMode] = useState<"operator" | "advertiser" | "loop" | "benchmark">("operator");

  // ─── OPERATOR MODEL STATE ────────────────────────────────────────────────────
  const [fleetSize, setFleetSize] = useState<number>(10);
  const [operatingHours, setOperatingHours] = useState<number>(14); // hrs per day
  const [commercialAdSharePct, setCommercialAdSharePct] = useState<number>(25); // 25% of screen time
  const [fillRatePct, setFillRatePct] = useState<number>(70); // 70% filled
  const [slotMonthlyPrice, setSlotMonthlyPrice] = useState<number>(850); // ₹850 / month / bus (base 10s video)
  const [payoutModel, setPayoutModel] = useState<"fixed" | "revshare">("fixed");
  const [fixedOwnerPayout, setFixedOwnerPayout] = useState<number>(2500); // ₹2500 / bus / mo
  const [revSharePct, setRevSharePct] = useState<number>(25); // 25% to bus owner
  const [agencyCommissionPct, setAgencyCommissionPct] = useState<number>(10); // 10% commission
  const [simCloudOpexPerBus, setSimCloudOpexPerBus] = useState<number>(650); // ₹650 / bus / mo

  // ─── OPERATOR INVENTORY MIX STATE (REAL-WORLD BLENDED DOOH) ──────────────────
  const [videoMixPct, setVideoMixPct] = useState<number>(60); // 60% Full Video
  const [imageMixPct, setImageMixPct] = useState<number>(25); // 25% Static Posters
  const [lbandMixPct, setLbandMixPct] = useState<number>(15); // 15% L-Band Banners
  const [sponsoredStopsPerBus, setSponsoredStopsPerBus] = useState<number>(3); // 3 stops sponsored per bus route
  const audioChimePricePerStop = 1500; // ₹1,500/stop/month flat
  const [peakSurgeAdoptionPct, setPeakSurgeAdoptionPct] = useState<number>(35); // 35% clients buy Peak Surge (+35%)

  // Helper to rebalance the 3 visual formats so their sum is ALWAYS strictly 100%
  const handleVisualMixChange = (type: "video" | "image" | "lband", newVal: number) => {
    const val = Math.max(0, Math.min(100, newVal));
    if (type === "video") {
      const remaining = 100 - val;
      const currentOther = (imageMixPct + lbandMixPct) || 1;
      const newImage = Math.round((imageMixPct / currentOther) * remaining);
      const newLband = remaining - newImage;
      setVideoMixPct(val);
      setImageMixPct(newImage);
      setLbandMixPct(newLband);
    } else if (type === "image") {
      const remaining = 100 - val;
      const currentOther = (videoMixPct + lbandMixPct) || 1;
      const newVideo = Math.round((videoMixPct / currentOther) * remaining);
      const newLband = remaining - newVideo;
      setImageMixPct(val);
      setVideoMixPct(newVideo);
      setLbandMixPct(newLband);
    } else {
      const remaining = 100 - val;
      const currentOther = (videoMixPct + imageMixPct) || 1;
      const newVideo = Math.round((videoMixPct / currentOther) * remaining);
      const newImage = remaining - newVideo;
      setLbandMixPct(val);
      setVideoMixPct(newVideo);
      setImageMixPct(newImage);
    }
  };

  const setPresetMix = (v: number, i: number, l: number) => {
    playClickSound();
    setVideoMixPct(v);
    setImageMixPct(i);
    setLbandMixPct(l);
  };

  // ─── ADVERTISER PITCH STATE ──────────────────────────────────────────────────
  const [selectedPresetId, setSelectedPresetId] = useState<string>("jeweller");
  const [selectedFormat, setSelectedFormat] = useState<AdFormatType>("video");
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [selectedPriority, setSelectedPriority] = useState<PriorityTierType>("platinum");
  const [selectedPackageId, setSelectedPackageId] = useState<"starter" | "growth" | "network" | "custom">("growth");
  const [customBuses, setCustomBuses] = useState<number>(12);
  const [campaignMonths, setCampaignMonths] = useState<number>(3);
  const [clientName, setClientName] = useState<string>("Jos Alukkas Jewellers");
  const [passengersPerBusDaily, setPassengersPerBusDaily] = useState<number>(650);

  // ─── OPERATOR CALCULATIONS WITH MULTI-FORMAT BLEND ───────────────────────────
  const operatorMetrics = useMemo(() => {
    // 1 hour = 3600 seconds
    const adSecondsPerHour = (3600 * commercialAdSharePct) / 100;
    // Base reference: 10s slot
    const baseSlotsPerHour = Math.floor(adSecondsPerHour / 10);
    const uniqueSlotsPerLoop = Math.max(1, Math.floor(baseSlotsPerHour / 6));
    const totalPossibleSlots = uniqueSlotsPerLoop;
    const soldSlots = Math.round((totalPossibleSlots * fillRatePct) / 100);

    // Visual format blend (normalized to strictly 100%):
    const totalVisual = (videoMixPct + imageMixPct + lbandMixPct) || 1;
    const vShare = videoMixPct / totalVisual;
    const iShare = imageMixPct / totalVisual;
    const lShare = lbandMixPct / totalVisual;
    const blendedVisualMultiplier = (vShare * 1.0) + (iShare * 0.65) + (lShare * 0.50);

    // Dayparting priority multiplier (Peak surge adoption):
    const peakAdoption = peakSurgeAdoptionPct / 100;
    const blendedPriorityMultiplier = (1 - peakAdoption) * 1.0 + (peakAdoption * 1.35);

    // Blended visual slot price
    const blendedSlotPrice = slotMonthlyPrice * blendedVisualMultiplier * blendedPriorityMultiplier;

    // Visual screen collections
    const visualGrossRevenue = soldSlots * fleetSize * blendedSlotPrice;

    // Audio chime stop sponsorship add-on (Geo-fenced junction triggers)
    const audioChimeRevenue = fleetSize * sponsoredStopsPerBus * audioChimePricePerStop;

    // Total Gross Collections
    const grossAdRevenue = visualGrossRevenue + audioChimeRevenue;

    // Standard baseline (if all were pure 10s video, 0 peak surge, 0 audio chimes)
    const baselineGross = soldSlots * fleetSize * slotMonthlyPrice;
    // Incremental upside from peak surge & audio sponsorships
    const surgeUpsellBonus = Math.max(0, grossAdRevenue - baselineGross);

    // Bus Owner Payout
    const busOwnerPayout =
      payoutModel === "fixed"
        ? fleetSize * fixedOwnerPayout
        : (grossAdRevenue * revSharePct) / 100;

    // Agency Commission
    const agencyCommission = (grossAdRevenue * agencyCommissionPct) / 100;

    // SIM + Cloud + Screen Hardware Maintenance Opex
    const techOpex = fleetSize * simCloudOpexPerBus;

    // Total Operating Expenses
    const totalOpex = busOwnerPayout + agencyCommission + techOpex;

    // Net EBITDA (Cash in Bank for GetMyBus)
    const netProfit = grossAdRevenue - totalOpex;
    const netMarginPct = grossAdRevenue > 0 ? (netProfit / grossAdRevenue) * 100 : 0;
    const annualNetProfit = netProfit * 12;

    // Yield metrics
    const revenuePerBus = fleetSize > 0 ? grossAdRevenue / fleetSize : 0;
    const netProfitPerBus = fleetSize > 0 ? netProfit / fleetSize : 0;

    // Daily ad impressions
    const dailyPlaysPerBus = baseSlotsPerHour * operatingHours;
    const totalDailyFleetPlays = dailyPlaysPerBus * fleetSize;
    const estDailyFleetViewers = fleetSize * passengersPerBusDaily;
    const effectiveCPM =
      estDailyFleetViewers > 0
        ? (grossAdRevenue / 30 / estDailyFleetViewers) * 1000
        : 0;

    return {
      adSecondsPerHour,
      baseSlotsPerHour,
      uniqueSlotsPerLoop,
      totalPossibleSlots,
      soldSlots,
      blendedSlotPrice,
      grossAdRevenue,
      baselineGross,
      surgeUpsellBonus,
      busOwnerPayout,
      agencyCommission,
      techOpex,
      totalOpex,
      netProfit,
      netMarginPct,
      annualNetProfit,
      revenuePerBus,
      netProfitPerBus,
      dailyPlaysPerBus,
      totalDailyFleetPlays,
      estDailyFleetViewers,
      effectiveCPM,
    };
  }, [
    fleetSize,
    operatingHours,
    commercialAdSharePct,
    fillRatePct,
    slotMonthlyPrice,
    videoMixPct,
    imageMixPct,
    lbandMixPct,
    sponsoredStopsPerBus,
    peakSurgeAdoptionPct,
    payoutModel,
    fixedOwnerPayout,
    revSharePct,
    agencyCommissionPct,
    simCloudOpexPerBus,
    passengersPerBusDaily,
  ]);

  // Distribution chart data for Operator mode
  const distributionChartData = useMemo(() => {
    const p = Math.max(0, operatorMetrics.netProfit);
    const bo = operatorMetrics.busOwnerPayout;
    const ag = operatorMetrics.agencyCommission;
    const te = operatorMetrics.techOpex;

    return [
      { name: "Net Operating Profit", value: p, color: "#10B981" },
      { name: "Bus Owner Payout", value: bo, color: "#3B82F6" },
      { name: "Sales Agency Commission", value: ag, color: "#F59E0B" },
      { name: "4G SIM & Tech Opex", value: te, color: "#8B5CF6" },
    ];
  }, [operatorMetrics]);

  // Sensitivity curve (3 to 100 buses)
  const scalingSensitivityData = useMemo(() => {
    const points = [3, 5, 10, 15, 20, 30, 40, 50, 75, 100];
    return points.map((count) => {
      const visualGross = operatorMetrics.soldSlots * count * operatorMetrics.blendedSlotPrice;
      const audioGross = count * sponsoredStopsPerBus * audioChimePricePerStop;
      const gross = visualGross + audioGross;
      const bo =
        payoutModel === "fixed"
          ? count * fixedOwnerPayout
          : (gross * revSharePct) / 100;
      const ag = (gross * agencyCommissionPct) / 100;
      const te = count * simCloudOpexPerBus;
      const net = gross - (bo + ag + te);
      return {
        buses: `${count} Buses`,
        busCount: count,
        gross: Math.round(gross),
        net: Math.round(net),
        ownerCut: Math.round(bo),
      };
    });
  }, [
    operatorMetrics.soldSlots,
    operatorMetrics.blendedSlotPrice,
    sponsoredStopsPerBus,
    audioChimePricePerStop,
    payoutModel,
    fixedOwnerPayout,
    revSharePct,
    agencyCommissionPct,
    simCloudOpexPerBus,
  ]);

  // ─── ADVERTISER PITCH CALCULATIONS WITH FORMAT, DURATION & PRIORITY ──────────
  const selectedPreset = useMemo(() => {
    return SECTOR_PRESETS.find((s) => s.id === selectedPresetId) || SECTOR_PRESETS[0];
  }, [selectedPresetId]);

  const activeFormatObj = useMemo(() => {
    return AD_FORMAT_OPTIONS.find((f) => f.id === selectedFormat) || AD_FORMAT_OPTIONS[0];
  }, [selectedFormat]);

  const activeDurationObj = useMemo(() => {
    return DURATION_OPTIONS.find((d) => d.seconds === selectedDuration) || DURATION_OPTIONS[1];
  }, [selectedDuration]);

  const activePriorityObj = useMemo(() => {
    return PRIORITY_TIERS.find((p) => p.id === selectedPriority) || PRIORITY_TIERS[0];
  }, [selectedPriority]);

  const activePitchPackage = useMemo(() => {
    if (selectedPackageId === "custom") {
      const monthlyRate = customBuses * 1900;
      const plays = customBuses * 6 * 14 * 30;
      const views = customBuses * passengersPerBusDaily * 30;
      return {
        id: "custom" as const,
        title: "Custom Route Tailored Campaign",
        buses: customBuses,
        pricePerMonth: monthlyRate,
        slotDuration: selectedDuration,
        loopsPerHour: 6,
        estMonthlyPlays: plays,
        estMonthlyViews: views,
        idealFor: `Custom configured plan for ${clientName}`,
      };
    }
    const pkg = AD_PACKAGES.find((p) => p.id === selectedPackageId) || AD_PACKAGES[1];
    return {
      ...pkg,
      slotDuration: selectedDuration,
    };
  }, [selectedPackageId, customBuses, selectedDuration, clientName, passengersPerBusDaily]);

  const campaignTotals = useMemo(() => {
    const baseMonthly = activePitchPackage.pricePerMonth;

    // Apply Format Multiplier, Duration Multiplier, and Priority Multiplier:
    const formatMult = activeFormatObj.priceMultiplier;
    const durationMult = activeDurationObj.priceMultiplier;
    const priorityMult = activePriorityObj.multiplier;

    // Combined Rate Multiplier
    const combinedMultiplier = formatMult * durationMult * priorityMult;
    const adjustedMonthly = baseMonthly * combinedMultiplier;

    // Commitment Term Discount
    let discountPct = 0;
    if (campaignMonths >= 12) discountPct = 20;
    else if (campaignMonths >= 6) discountPct = 15;
    else if (campaignMonths >= 3) discountPct = 10;

    const discountedMonthly = adjustedMonthly * (1 - discountPct / 100);
    const totalCampaignCost = discountedMonthly * campaignMonths;
    const totalImpressions = activePitchPackage.estMonthlyViews * campaignMonths;
    const totalAdPlays = activePitchPackage.estMonthlyPlays * campaignMonths;
    const captiveCPM = totalImpressions > 0 ? (totalCampaignCost / totalImpressions) * 1000 : 0;
    const costPerSecond = totalAdPlays > 0 ? totalCampaignCost / (totalAdPlays * selectedDuration) : 0;

    return {
      formatMult,
      durationMult,
      priorityMult,
      combinedMultiplier,
      adjustedMonthly,
      discountPct,
      discountedMonthly,
      totalCampaignCost,
      totalImpressions,
      totalAdPlays,
      captiveCPM,
      costPerSecond,
    };
  }, [activePitchPackage, activeFormatObj, activeDurationObj, activePriorityObj, campaignMonths, selectedDuration]);

  const handlePrintProposal = () => {
    playSuccessChime();
    window.print();
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* ─── HEADER BAR ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DOOH Yield & Proposal Engine
            </span>
            <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Multi-Format • Duration • Dayparting
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ad Revenue & Commercial Profit Engine
          </h1>
          <p className="mt-1 text-sm md:text-base text-gray-400 max-w-3xl">
            Simulate operational margins, configure bus owner revenue sharing, audit multi-format screen loop capacities, and generate dynamic conversion-ready rate card proposals.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md self-start lg:self-auto">
          <button
            onClick={() => {
              playClickSound();
              setActiveMode("operator");
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeMode === "operator"
                ? "bg-[#0A84FF] text-white shadow-lg shadow-blue-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>💼</span>
            <span>Operator Profit Yield</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("advertiser");
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeMode === "advertiser"
                ? "bg-[#0A84FF] text-white shadow-lg shadow-blue-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>📢</span>
            <span>Advertiser Pitch & ROI</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("loop");
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeMode === "loop"
                ? "bg-[#0A84FF] text-white shadow-lg shadow-blue-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>⏱️</span>
            <span>60-Min Loop Visualizer</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode("benchmark");
            }}
            onMouseEnter={() => playHoverSound(0.01)}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
              activeMode === "benchmark"
                ? "bg-[#0A84FF] text-white shadow-lg shadow-blue-500/25"
                : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>📊</span>
            <span>Media Benchmarks</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 1: OPERATOR ENGINE (PROFIT & YIELD)
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeMode === "operator" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key KPI Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Gross Revenue */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isLight ? "bg-white/80 border-black/[0.08] shadow-sm" : "bg-white/[0.03] border-white/[0.08]"
            }`}>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Monthly Gross Billing</span>
                <span className="text-blue-400 font-mono">₹{formatNumber(operatorMetrics.grossAdRevenue)}</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                {formatINR(operatorMetrics.grossAdRevenue)}
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                <span>{operatorMetrics.soldSlots} slots sold @ {fillRatePct}% fill</span>
                <span className="text-emerald-400">+{operatorMetrics.soldSlots * fleetSize} bus-slots</span>
              </div>
            </div>

            {/* KPI 2: Net EBITDA */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isLight ? "bg-emerald-50/50 border-emerald-500/20 shadow-sm" : "bg-emerald-500/[0.06] border-emerald-500/20"
            }`}>
              <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
                <span className="font-semibold">Your Net Monthly EBITDA</span>
                <span className="font-mono">{operatorMetrics.netMarginPct.toFixed(1)}% margin</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400">
                {formatINR(operatorMetrics.netProfit)}
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                <span>Annualized:</span>
                <span className="font-semibold text-emerald-300">{formatINR(operatorMetrics.annualNetProfit)}/yr</span>
              </div>
            </div>

            {/* KPI 3: Bus Owner Payout */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isLight ? "bg-white/80 border-black/[0.08] shadow-sm" : "bg-white/[0.03] border-white/[0.08]"
            }`}>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Bus Owner Distribution</span>
                <span className="text-blue-400 font-mono">
                  {payoutModel === "fixed" ? `Fixed ₹${fixedOwnerPayout}/bus` : `${revSharePct}% RevShare`}
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-blue-400">
                {formatINR(operatorMetrics.busOwnerPayout)}
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                <span>Per Bus / Month:</span>
                <span className="text-gray-300 font-medium">
                  ₹{Math.round(fleetSize > 0 ? operatorMetrics.busOwnerPayout / fleetSize : 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* KPI 4: Monthly Impressions */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isLight ? "bg-white/80 border-black/[0.08] shadow-sm" : "bg-white/[0.03] border-white/[0.08]"
            }`}>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Total Monthly Plays</span>
                <span className="text-purple-400 font-mono">Captive Audience</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold tracking-tight text-purple-400">
                {formatNumber(operatorMetrics.totalDailyFleetPlays * 30)}
              </div>
              <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                <span>Daily Fleet Reach:</span>
                <span className="text-gray-300 font-medium">~{formatNumber(operatorMetrics.estDailyFleetViewers)} eyes/day</span>
              </div>
            </div>
          </div>

          {/* Operator Controls & Dynamic Visualizer Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Sliders & Controls (7 Cols) */}
            <div className={`xl:col-span-7 p-6 rounded-2xl border ${
              isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
            } space-y-6`}>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Fleet & Commercial Scale Controls</h3>
                  <p className="text-xs text-gray-400">Adjust fleet scale, baseline pricing, and operating constraints in real time.</p>
                </div>
                {/* Fleet Quick Buttons */}
                <div className="flex items-center gap-1.5">
                  {[5, 10, 20, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        playClickSound();
                        setFleetSize(count);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                        fleetSize === count
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white"
                      }`}
                    >
                      {count} Buses
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Fleet Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300 font-medium">Active Screen Fleet Size</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">{fleetSize} Buses</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="w-full accent-[#0A84FF] h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>1 Bus (Pilot)</span>
                  <span>25 Buses (Town Cluster)</span>
                  <span>50 Buses (District)</span>
                  <span>100 Buses (State Network)</span>
                </div>
              </div>

              {/* Slider 2: Slot Base Rate per Bus */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-300 font-medium">Base Slot Rate (per Bus / Month)</span>
                    <span className="text-[11px] text-gray-500 ml-2">Reference for 10s Video</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-sm">₹{slotMonthlyPrice.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={3000}
                  step={50}
                  value={slotMonthlyPrice}
                  onChange={(e) => setSlotMonthlyPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>₹300 (Suburban / Low)</span>
                  <span>₹850 (Standard Market)</span>
                  <span>₹1,500 (Prime Arterial)</span>
                  <span>₹3,000 (Metro Exclusive)</span>
                </div>
              </div>

              {/* Slider 3: Ad Inventory Fill Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-300 font-medium">Ad Inventory Fill Rate</span>
                    <span className="text-[11px] text-gray-500 ml-2">Inventory sold to advertisers</span>
                  </div>
                  <span className="text-amber-400 font-mono font-bold text-sm">{fillRatePct}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={fillRatePct}
                  onChange={(e) => setFillRatePct(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>20% (Launch)</span>
                  <span>50% (Month 2)</span>
                  <span>70% (Healthy Stable)</span>
                  <span>100% (Sold Out)</span>
                </div>
              </div>

              {/* ─── REAL-WORLD BLENDED INVENTORY MIX BUILDER (STRICTLY 100%) ──────────────────── */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                        Visual Screen Ad Mix
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Strictly 100% Total Share
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Visual screen time is divided across formats — adjusting any slider auto-balances to 100%
                    </p>
                  </div>

                  {/* 1-Click Preset Chips */}
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      onClick={() => setPresetMix(60, 25, 15)}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                        videoMixPct === 60 && imageMixPct === 25 && lbandMixPct === 15
                          ? "bg-purple-600 text-white font-semibold"
                          : "bg-white/[0.05] text-gray-400 hover:text-white"
                      }`}
                    >
                      🌟 Balanced (60/25/15)
                    </button>
                    <button
                      onClick={() => setPresetMix(85, 10, 5)}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                        videoMixPct === 85 && imageMixPct === 10 && lbandMixPct === 5
                          ? "bg-purple-600 text-white font-semibold"
                          : "bg-white/[0.05] text-gray-400 hover:text-white"
                      }`}
                    >
                      🎬 Video Heavy (85/10/5)
                    </button>
                    <button
                      onClick={() => setPresetMix(30, 50, 20)}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                        videoMixPct === 30 && imageMixPct === 50 && lbandMixPct === 20
                          ? "bg-purple-600 text-white font-semibold"
                          : "bg-white/[0.05] text-gray-400 hover:text-white"
                      }`}
                    >
                      🛒 Retail (30/50/20)
                    </button>
                    <button
                      onClick={() => setPresetMix(100, 0, 0)}
                      className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                        videoMixPct === 100 && imageMixPct === 0 && lbandMixPct === 0
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-white/[0.05] text-gray-400 hover:text-white"
                      }`}
                    >
                      👑 100% Video
                    </button>
                  </div>
                </div>

                {/* 100% Visual Proportion Segmented Bar */}
                <div className="space-y-1.5">
                  <div className="w-full h-3.5 rounded-full overflow-hidden flex border border-white/10 shadow-inner bg-black/40">
                    <div
                      style={{ width: `${videoMixPct}%` }}
                      className="h-full bg-blue-500 hover:brightness-110 transition-all duration-200 cursor-pointer"
                      title={`HD Video: ${videoMixPct}%`}
                    />
                    <div
                      style={{ width: `${imageMixPct}%` }}
                      className="h-full bg-amber-500 hover:brightness-110 transition-all duration-200 cursor-pointer"
                      title={`Static Posters: ${imageMixPct}%`}
                    />
                    <div
                      style={{ width: `${lbandMixPct}%` }}
                      className="h-full bg-purple-500 hover:brightness-110 transition-all duration-200 cursor-pointer"
                      title={`L-Band Banners: ${lbandMixPct}%`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-blue-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 🎬 Video: {videoMixPct}%
                    </span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 🖼️ Posters: {imageMixPct}%
                    </span>
                    <span className="text-purple-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> 📐 L-Band: {lbandMixPct}%
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Total: {videoMixPct + imageMixPct + lbandMixPct}%
                    </span>
                  </div>
                </div>

                {/* 3 Interactive Sliders (0% to 100% each, fully normalized) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-300">🎬 HD Video Share</span>
                      <span className="text-blue-400 font-mono font-bold">{videoMixPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={videoMixPct}
                      onChange={(e) => handleVisualMixChange("video", Number(e.target.value))}
                      className="w-full accent-blue-500 h-1.5 bg-white/[0.1] rounded mt-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>0%</span>
                      <span>1.00x Base Rate</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-300">🖼️ Static Posters</span>
                      <span className="text-amber-400 font-mono font-bold">{imageMixPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={imageMixPct}
                      onChange={(e) => handleVisualMixChange("image", Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-white/[0.1] rounded mt-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>0%</span>
                      <span>0.65x (-35%)</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-300">📐 L-Band Banners</span>
                      <span className="text-purple-400 font-mono font-bold">{lbandMixPct}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={lbandMixPct}
                      onChange={(e) => handleVisualMixChange("lband", Number(e.target.value))}
                      className="w-full accent-purple-500 h-1.5 bg-white/[0.1] rounded mt-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                      <span>0%</span>
                      <span>0.50x (-50%)</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Additional Monetization Upsells Grid: Audio Chimes & Peak Rush Surge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.04]">
                  {/* Audio Chime Sponsorships */}
                  <div className="p-3 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/20 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span>🔔</span> Next-Stop Audio Sponsorships
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          Fixed ₹1,500/mo per sponsored junction
                        </span>
                      </div>
                      <span className="text-emerald-300 font-mono font-bold">
                        {sponsoredStopsPerBus} Stops / Bus
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={8}
                      step={1}
                      value={sponsoredStopsPerBus}
                      onChange={(e) => setSponsoredStopsPerBus(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>0 Stops</span>
                      <span className="text-emerald-400 font-medium">
                        +{formatINR(fleetSize * sponsoredStopsPerBus * audioChimePricePerStop)}/mo Incremental
                      </span>
                      <span>8 Stops</span>
                    </div>
                  </div>

                  {/* Dayparting Peak Surge */}
                  <div className="p-3 rounded-lg bg-amber-500/[0.03] border border-amber-500/20 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                          <span>⚡</span> Peak Commute Surge Adoption
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          Clients paying +35% rush hour surge
                        </span>
                      </div>
                      <span className="text-amber-300 font-mono font-bold">
                        {peakSurgeAdoptionPct}% of clients
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={peakSurgeAdoptionPct}
                      onChange={(e) => setPeakSurgeAdoptionPct(Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>0% (Flat)</span>
                      <span className="text-amber-400 font-medium">
                        +{formatINR(operatorMetrics.surgeUpsellBonus)}/mo Upsell Profit
                      </span>
                      <span>100% (All Peak)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bus Owner Payout Configuration Toggle */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Bus Owner Incentive Model
                  </span>
                  <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/10">
                    <button
                      onClick={() => {
                        playClickSound();
                        setPayoutModel("fixed");
                      }}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${
                        payoutModel === "fixed"
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Fixed Monthly Payout
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        setPayoutModel("revshare");
                      }}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${
                        payoutModel === "revshare"
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Revenue Share %
                    </button>
                  </div>
                </div>

                {payoutModel === "fixed" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Fixed Rent per Bus per Month</span>
                      <span className="text-blue-400 font-mono font-bold">₹{fixedOwnerPayout.toLocaleString()} / bus</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={5000}
                      step={250}
                      value={fixedOwnerPayout}
                      onChange={(e) => setFixedOwnerPayout(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>₹1,000</span>
                      <span>₹2,500 (Recommended Pitch)</span>
                      <span>₹5,000</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Owner Revenue Share %</span>
                      <span className="text-blue-400 font-mono font-bold">{revSharePct}% of Gross Billing</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={40}
                      step={5}
                      value={revSharePct}
                      onChange={(e) => setRevSharePct(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>15%</span>
                      <span>25% (Standard)</span>
                      <span>40%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Commission & Maintenance Opex Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Sales Agent Commission</span>
                    <span className="text-amber-400 font-mono font-semibold">{agencyCommissionPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={2}
                    value={agencyCommissionPct}
                    onChange={(e) => setAgencyCommissionPct(Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">4G SIM + Tech Cloud / Bus</span>
                    <span className="text-purple-400 font-mono font-semibold">₹{simCloudOpexPerBus} / mo</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={1500}
                    step={50}
                    value={simCloudOpexPerBus}
                    onChange={(e) => setSimCloudOpexPerBus(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-white/[0.1] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Financial Waterfall & Charts (5 Cols) */}
            <div className="xl:col-span-5 space-y-6">
              {/* Waterfall Donut Chart */}
              <div className={`p-6 rounded-2xl border ${
                isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
              } space-y-4`}>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">Monthly Revenue Breakdown</h3>
                    <p className="text-xs text-gray-400">Distribution of gross ad collections</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {operatorMetrics.netMarginPct.toFixed(0)}% Net Margin
                  </span>
                </div>

                <div className="h-56 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {distributionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
                        contentStyle={{
                          backgroundColor: "#111217",
                          borderColor: "rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Donut Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Net EBITDA</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatINR(operatorMetrics.netProfit)}
                    </span>
                  </div>
                </div>

                {/* Legend Table */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  {distributionChartData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-white">
                        ₹{Math.round(item.value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operational Yield Snapshot Card */}
              <div className={`p-5 rounded-2xl border ${
                isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
              } space-y-3`}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Per-Bus Economics & Capacity
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-gray-400 text-[11px]">Gross Yield / Bus</div>
                    <div className="text-base font-bold text-blue-400 mt-0.5">
                      ₹{Math.round(operatorMetrics.revenuePerBus).toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-gray-400 text-[11px]">Net Profit / Bus</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      ₹{Math.round(operatorMetrics.netProfitPerBus).toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-gray-400 text-[11px]">Daily Ad Plays / Bus</div>
                    <div className="text-base font-bold text-purple-400 mt-0.5">
                      {operatorMetrics.dailyPlaysPerBus} plays/day
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-gray-400 text-[11px]">Loop Brand Capacity</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {operatorMetrics.uniqueSlotsPerLoop} brands/loop
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scaling Growth Sensitivity Curve (3 to 100 Buses) */}
          <div className={`p-6 rounded-2xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Fleet Scaling Sensitivity Curve</h3>
                <p className="text-xs text-gray-400">
                  Projected Monthly Net Profit expansion vs Bus Owner Payout as fleet expands from 3 to 100 buses
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-500 rounded" /> Net EBITDA
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-3 h-0.5 bg-blue-500 rounded" /> Gross Collections
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-3 h-0.5 bg-purple-500 rounded" /> Bus Owner Share
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scalingSensitivityData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="buses" stroke="#6b7280" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={11}
                    tickFormatter={(val) => formatNumber(val)}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString()}`,
                      name === "net" ? "Net EBITDA" : name === "gross" ? "Gross Billing" : "Owner Payout",
                    ]}
                    contentStyle={{
                      backgroundColor: "#111217",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gross"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#3B82F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10B981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ownerCut"
                    stroke="#8B5CF6"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 2: ADVERTISER PITCH & PROPOSAL GENERATOR
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeMode === "advertiser" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Sector Presets Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                1. Select Advertiser Industry Preset
              </span>
              <span className="text-xs text-blue-400">Instant Pre-fill</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SECTOR_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedPresetId(preset.id);
                      setSelectedFormat(preset.recommendedFormat);
                      setSelectedDuration(preset.recommendedDuration);
                      setSelectedPriority(preset.recommendedPriority);
                      setSelectedPackageId(preset.suggestedPackage);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10"
                        : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{preset.icon}</div>
                    <div className={`text-sm font-semibold truncate ${isSelected ? "text-blue-400" : "text-white"}`}>
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                      {preset.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Spotlight & Pitch Angle */}
          <div className={`p-6 rounded-2xl border ${
            isLight ? "bg-blue-50/60 border-blue-500/20" : "bg-blue-500/[0.05] border-blue-500/20"
          } flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{selectedPreset.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Targeted Sector Strategy
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedPreset.pitchHeadline}</h3>
              <div className="mt-2.5 flex flex-wrap gap-2 text-xs text-gray-300">
                {selectedPreset.keyBenefits.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                    <span className="text-emerald-400">✓</span> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Name Input for Proposal Customization */}
            <div className="min-w-[240px] space-y-1.5 self-start md:self-center">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
                Client Brand Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Malabar Gold, Aster Medcity"
                className="w-full px-3 py-2 text-sm rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* ─── 2. CREATIVE FORMAT, DURATION & PRIORITY CONTROLS ──────────────── */}
          <div className={`p-6 rounded-2xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-6`}>
            <div className="border-b border-white/[0.06] pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0A84FF]">
                2. Configure Ad Creative Specs, Duration & Broadcast Schedule
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                Tailor production format, loop consumption duration, and daypart priority to match client budget
              </p>
            </div>

            {/* A. Creative Format Chips */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium">Creative Format & Visual Real Estate:</span>
                <span className="text-emerald-400 font-mono">
                  {activeFormatObj.priceMultiplier === 1.0 ? "Base Rate (1.0x)" : `${activeFormatObj.priceMultiplier}x Multiplier`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {AD_FORMAT_OPTIONS.map((fmt) => {
                  const isFmtActive = selectedFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedFormat(fmt.id);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isFmtActive
                          ? "bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/15 ring-1 ring-blue-500"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xl">{fmt.icon}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isFmtActive ? "bg-blue-500 text-white" : "bg-white/[0.06] text-gray-400"
                        }`}>
                          {fmt.badge}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{fmt.name}</div>
                      <div className="text-[11px] text-gray-400 mt-1 line-clamp-2">{fmt.description}</div>
                      <div className="mt-2 text-[10px] font-mono text-blue-400">
                        {fmt.screenShareDesc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Slot Duration Chips */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium">Commercial Spot Duration:</span>
                <span className="text-purple-400 font-mono font-semibold">
                  {activeDurationObj.seconds} Seconds ({activeDurationObj.priceMultiplier}x Duration Factor)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {DURATION_OPTIONS.map((dur) => {
                  const isDurActive = selectedDuration === dur.seconds;
                  return (
                    <button
                      key={dur.seconds}
                      onClick={() => {
                        playClickSound();
                        setSelectedDuration(dur.seconds);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isDurActive
                          ? "bg-purple-600/15 border-purple-500 ring-1 ring-purple-500 shadow"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{dur.label}</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          dur.priceMultiplier > 1 ? "text-amber-400" : dur.priceMultiplier < 1 ? "text-emerald-400" : "text-gray-400"
                        }`}>
                          {dur.priceMultiplier}x
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{dur.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* C. Priority & Dayparting Tiers */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 font-medium">Playout Priority & Dayparting Schedule:</span>
                <span className="text-amber-400 font-mono font-semibold">
                  {activePriorityObj.surchargeLabel} ({activePriorityObj.multiplier}x)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PRIORITY_TIERS.map((tier) => {
                  const isTierActive = selectedPriority === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedPriority(tier.id);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isTierActive
                          ? "bg-amber-600/15 border-amber-500 ring-1 ring-amber-500 shadow"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{tier.icon}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isTierActive ? "bg-amber-500 text-black font-bold" : "bg-white/[0.06] text-gray-400"
                        }`}>
                          {tier.surchargeLabel}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{tier.name}</div>
                      <div className="text-[11px] text-gray-300 mt-1 font-mono">{tier.schedule}</div>
                      <div className="text-[10px] text-gray-400 mt-1.5">{tier.description}</div>
                      <div className="mt-2 text-[10px] text-emerald-400 font-medium">
                        Density: {tier.audienceDensity}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── 3. AD PACKAGES GRID ────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                3. Choose Campaign Fleet Scale & Commitment Length
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Duration:</span>
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      playClickSound();
                      setCampaignMonths(m);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      campaignMonths === m
                        ? "bg-blue-600 text-white"
                        : "bg-white/[0.04] text-gray-400 hover:text-white"
                    }`}
                  >
                    {m} {m === 1 ? "Month" : "Months"}
                    {m === 3 ? " (-10%)" : m === 6 ? " (-15%)" : m === 12 ? " (-20%)" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AD_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                // Dynamic adjusted rate for this package based on format, duration & priority
                const combinedFactor = campaignTotals.combinedMultiplier;
                const dynamicMonthly = pkg.pricePerMonth * combinedFactor * (1 - campaignTotals.discountPct / 100);

                return (
                  <div
                    key={pkg.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedPackageId(pkg.id);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer relative transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/15 ring-1 ring-blue-500"
                        : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500 text-white shadow">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                        {pkg.buses} Buses Network
                      </div>
                      <h4 className="text-lg font-bold text-white">{pkg.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{pkg.idealFor}</p>

                      <div className="my-4 pt-3 border-t border-white/[0.06]">
                        <div className="text-2xl font-bold text-white">
                          ₹{Math.round(dynamicMonthly).toLocaleString()}
                          <span className="text-xs font-normal text-gray-400"> / mo</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                          <span>Base: ₹{pkg.pricePerMonth.toLocaleString()}</span>
                          <span className="text-emerald-400 font-mono font-medium">
                            × {combinedFactor.toFixed(2)} spec factor
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-gray-300">
                        <div className="flex justify-between py-1 border-b border-white/[0.04]">
                          <span className="text-gray-400">Monthly Plays:</span>
                          <span className="font-mono font-medium text-white">{formatNumber(pkg.estMonthlyPlays)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/[0.04]">
                          <span className="text-gray-400">Captive Viewers:</span>
                          <span className="font-mono font-medium text-purple-400">~{formatNumber(pkg.estMonthlyViews)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-400">Spot Duration:</span>
                          <span className="font-mono font-medium text-emerald-400">{selectedDuration}s ({activeFormatObj.name.split(" ")[0]})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`mt-5 w-full py-2 text-xs font-semibold rounded-xl transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-white/[0.05] text-gray-300 hover:bg-white/[0.1]"
                      }`}
                    >
                      {isSelected ? "Selected Plan ✓" : "Select Plan"}
                    </button>
                  </div>
                );
              })}

              {/* Custom Plan Option */}
              <div
                onClick={() => {
                  playClickSound();
                  setSelectedPackageId("custom");
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  selectedPackageId === "custom"
                    ? "bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-500/15 ring-1 ring-purple-500"
                    : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">
                    Custom Route Tailored
                  </div>
                  <h4 className="text-lg font-bold text-white">Custom Fleet Scale</h4>
                  <p className="text-xs text-gray-400 mt-1">Specify custom bus count for specific municipal routes.</p>

                  <div className="my-4 pt-3 border-t border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Selected Buses:</span>
                      <span className="font-bold text-purple-400 font-mono">{customBuses} Buses</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={customBuses}
                      onChange={(e) => {
                        setSelectedPackageId("custom");
                        setCustomBuses(Number(e.target.value));
                      }}
                      className="w-full accent-purple-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                    />
                    <div className="text-2xl font-bold text-white pt-1">
                      ₹{Math.round(customBuses * 1900 * campaignTotals.combinedMultiplier * (1 - campaignTotals.discountPct / 100)).toLocaleString()}
                      <span className="text-xs font-normal text-gray-400"> / mo</span>
                    </div>
                  </div>
                </div>

                <button
                  className={`mt-5 w-full py-2 text-xs font-semibold rounded-xl transition-all ${
                    selectedPackageId === "custom"
                      ? "bg-purple-600 text-white"
                      : "bg-white/[0.05] text-gray-300 hover:bg-white/[0.1]"
                  }`}
                >
                  {selectedPackageId === "custom" ? "Custom Configured ✓" : "Configure Custom"}
                </button>
              </div>
            </div>
          </div>

          {/* ─── CLIENT PROPOSAL GENERATOR & PRINT READY CARD ───────────────────── */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Client Quotation & Campaign Rate Card</h3>
                <p className="text-xs text-gray-400">Ready to present directly in client meetings or save as PDF</p>
              </div>
              <button
                onClick={handlePrintProposal}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-start sm:self-auto"
              >
                <span>🖨️</span>
                <span>Print / Save Pitch Proposal as PDF</span>
              </button>
            </div>

            {/* Printable Pitch Proposal Container */}
            <div
              id="printable-rate-card"
              className={`p-8 rounded-3xl border ${
                isLight ? "bg-white text-black border-black/10 shadow-lg" : "bg-[#0b0c10] text-white border-white/10"
              } space-y-6 print:m-0 print:p-6 print:border-none print:shadow-none`}
            >
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08] print:border-black/20">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#0A84FF]">
                    GetMyBus Smart Transit Ad Network
                  </div>
                  <h2 className="text-2xl font-bold mt-1">
                    Digital Out-of-Home Campaign Proposal
                  </h2>
                  <p className="text-xs text-gray-400 print:text-gray-600">
                    Prepared for: <span className="font-semibold text-white print:text-black">{clientName || "Valued Advertiser"}</span> ({selectedPreset.name})
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-gray-400 print:text-gray-600">Proposal Date</div>
                  <div className="text-sm font-semibold font-mono">
                    {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Validity: 30 Days</div>
                </div>
              </div>

              {/* Proposal Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-200">
                  <div className="text-xs text-gray-400 print:text-gray-600">Active Bus Network</div>
                  <div className="text-2xl font-bold text-[#0A84FF] mt-1">{activePitchPackage.buses} Buses</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">High-frequency routes</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-200">
                  <div className="text-xs text-gray-400 print:text-gray-600">Monthly Guaranteed Plays</div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">
                    {formatNumber(activePitchPackage.estMonthlyPlays)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    ~{Math.round(activePitchPackage.estMonthlyPlays / 30)} plays every single day
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-200">
                  <div className="text-xs text-gray-400 print:text-gray-600">Captive Passenger Views</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {formatNumber(activePitchPackage.estMonthlyViews)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">35 min avg dwell time</div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-200">
                  <div className="text-xs text-gray-400 print:text-gray-600">Effective Captive CPM</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    ₹{campaignTotals.captiveCPM.toFixed(1)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Per 1,000 captive views</div>
                </div>
              </div>

              {/* Creative Spec & Schedule Summary Box */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-gray-400 text-[11px]">Creative Format</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                    <span>{activeFormatObj.icon}</span>
                    <span>{activeFormatObj.name}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{activeFormatObj.screenShareDesc}</div>
                </div>

                <div>
                  <div className="text-gray-400 text-[11px]">Spot Duration</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                    <span>⏱️</span>
                    <span>{selectedDuration} Seconds ({activeDurationObj.label})</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{activeDurationObj.description}</div>
                </div>

                <div>
                  <div className="text-gray-400 text-[11px]">Playout Priority & Broadcast Hours</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                    <span>{activePriorityObj.icon}</span>
                    <span>{activePriorityObj.name.split(" ")[0]} ({activePriorityObj.surchargeLabel})</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{activePriorityObj.schedule}</div>
                </div>
              </div>

              {/* Commercial Investment Summary Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 print:border-black/20 text-gray-400 print:text-gray-600 uppercase tracking-wider text-[10px]">
                      <th className="py-3">Campaign Component</th>
                      <th className="py-3">Specifications & Multipliers</th>
                      <th className="py-3 text-right">Adjusted Monthly Rate</th>
                      <th className="py-3 text-right">Campaign Total ({campaignMonths} Mo)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] print:divide-gray-200">
                    <tr>
                      <td className="py-3.5 font-medium">
                        <div>In-Bus Digital Passenger TV Broadcast</div>
                        <div className="text-[11px] text-gray-400 print:text-gray-500">
                          {activePitchPackage.title} ({activePitchPackage.buses} Buses)
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-300 print:text-gray-700">
                        {activeFormatObj.name} ({selectedDuration}s) • {activePriorityObj.name} • 6 plays/hr
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                          Factors: Format({activeFormatObj.priceMultiplier}x) × Duration({activeDurationObj.priceMultiplier}x) × Priority({activePriorityObj.multiplier}x) = {campaignTotals.combinedMultiplier.toFixed(2)}x
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono text-gray-400">
                        ₹{Math.round(campaignTotals.adjustedMonthly).toLocaleString()} / mo
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-white print:text-black">
                        ₹{Math.round(campaignTotals.adjustedMonthly * campaignMonths).toLocaleString()}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3.5 font-medium">
                        <div>Next-Stop Audio Sponsor & Dynamic Ticker</div>
                        <div className="text-[11px] text-gray-400 print:text-gray-500">
                          Geo-triggered audio announcements arriving at key junctions
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-300 print:text-gray-700">
                        Dual Language (Malayalam + English) with brand mention
                      </td>
                      <td className="py-3.5 text-right font-mono text-emerald-400">
                        INCLUDED
                      </td>
                      <td className="py-3.5 text-right font-mono text-emerald-400 font-bold">
                        FREE BONUS
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3.5 font-medium">
                        <div>Digital Proof-of-Play Telemetry & Live Dashboard</div>
                        <div className="text-[11px] text-gray-400 print:text-gray-500">
                          Real-time cloud logs verifying exact GPS timestamp of every ad play
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-300 print:text-gray-700">
                        Monthly audit certificate & client web login
                      </td>
                      <td className="py-3.5 text-right font-mono text-emerald-400">
                        INCLUDED
                      </td>
                      <td className="py-3.5 text-right font-mono text-emerald-400 font-bold">
                        FREE BONUS
                      </td>
                    </tr>

                    {campaignTotals.discountPct > 0 && (
                      <tr className="bg-emerald-500/[0.04] print:bg-emerald-50">
                        <td className="py-3 text-emerald-400 font-medium" colSpan={3}>
                          Term Commitment Incentive ({campaignMonths} Months Contract: {campaignTotals.discountPct}% Discount)
                        </td>
                        <td className="py-3 text-right font-mono text-emerald-400 font-bold">
                          -₹{Math.round((campaignTotals.adjustedMonthly * campaignMonths) - campaignTotals.totalCampaignCost).toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-white/20 print:border-black text-sm">
                      <td colSpan={3} className="py-4 font-bold uppercase tracking-wider text-right pr-6">
                        Net Campaign Investment ({campaignMonths} Months)
                      </td>
                      <td className="py-4 font-bold font-mono text-lg text-right text-emerald-400 print:text-emerald-700">
                        ₹{Math.round(campaignTotals.totalCampaignCost).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Proposal Deliverables & Terms */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-gray-400 print:text-gray-700 space-y-2">
                <div className="font-semibold text-white print:text-black">Campaign Guarantee & Terms:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>• 100% Guaranteed playout with automated offline storage if cellular signal drops.</div>
                  <div>• Complimentary creative sizing & format conversion for MP4 / Motion H.264.</div>
                  <div>• Mid-campaign creative swap allowed twice per month at zero additional fee.</div>
                  <div>• Weekly GPS playback log sent via WhatsApp / Email to advertiser marketing lead.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 3: 60-MINUTE HOURLY SCREEN LOOP VISUALIZER
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeMode === "loop" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-white">60-Minute Screen Reel Architecture</h3>
            <p className="text-sm text-gray-400 max-w-3xl mt-1">
              Multi-format transit DOOH balance: Passengers stay engaged because commercial ads never interrupt vital route telemetry, while advertisers achieve repeat visual impressions.
            </p>
          </div>

          {/* Sliced Visual Timeline Bar */}
          <div className={`p-6 rounded-2xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-6`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-gray-300">
                1 Hour Screen Time Allocation (60 Minutes)
              </span>
              <span className="text-blue-400 font-mono">6 Complete 10-Minute Cycles / Hour</span>
            </div>

            {/* Visual Colored Bar */}
            <div className="w-full h-10 rounded-xl overflow-hidden flex border border-white/10 shadow-inner">
              {/* 68% Passenger Transit Telemetry */}
              <div
                style={{ width: "68%" }}
                className="h-full bg-blue-600/80 hover:bg-blue-600 transition-colors flex items-center justify-center text-[11px] font-bold text-white tracking-wide cursor-pointer"
                title="40.8 Minutes: Live Route Map, Next Stop, Speed & Public Alerts"
              >
                68% Transit & Next Stop GPS (40.8 Mins)
              </div>

              {/* 16% HD Video Ads */}
              <div
                style={{ width: "16%" }}
                className="h-full bg-emerald-500/90 hover:bg-emerald-500 transition-colors flex items-center justify-center text-[10px] font-bold text-white tracking-wide cursor-pointer"
                title="9.6 Minutes: Full HD 1080p Brand Video Commercials"
              >
                16% Video (9.6 M)
              </div>

              {/* 8% Static Posters */}
              <div
                style={{ width: "8%" }}
                className="h-full bg-amber-500/90 hover:bg-amber-500 transition-colors flex items-center justify-center text-[10px] font-bold text-white tracking-wide cursor-pointer"
                title="4.8 Minutes: Static Posters & Grocery Deals"
              >
                8% Static
              </div>

              {/* 5% Next Stop Sponsor Audio Chimes */}
              <div
                style={{ width: "5%" }}
                className="h-full bg-purple-500/90 hover:bg-purple-500 transition-colors flex items-center justify-center text-[10px] font-bold text-white tracking-wide cursor-pointer"
                title="3 Minutes: Audio Chimes ('Arriving at Medical College, sponsored by...')"
              >
                5% Audio
              </div>

              {/* 3% Live Civic News & Gold Rates */}
              <div
                style={{ width: "3%" }}
                className="h-full bg-cyan-500/90 hover:bg-cyan-500 transition-colors flex items-center justify-center text-[10px] font-bold text-white tracking-wide cursor-pointer"
                title="1.8 Minutes: Kerala 22K Gold Rate, Weather & Civic Bulletins"
              >
                3%
              </div>
            </div>

            {/* Loop Segment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-white">Live Transit & Telemetry</span>
                </div>
                <div className="text-lg font-bold text-blue-400">40.8 Minutes / Hour</div>
                <p className="text-[11px] text-gray-300">
                  Upcoming stops, GPS speed, ETA countdown, and route deviation alerts. L-Band companion banners display here concurrently.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-white">Full HD Video Commercials</span>
                </div>
                <div className="text-lg font-bold text-emerald-400">9.6 Minutes / Hour</div>
                <p className="text-[11px] text-gray-300">
                  Rotates 10s, 15s, and 20s high-definition video spots. Unskippable, full audio takeover during route transitions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-white">Static HD Posters & Deals</span>
                </div>
                <div className="text-lg font-bold text-amber-400">4.8 Minutes / Hour</div>
                <p className="text-[11px] text-gray-300">
                  6s digital still posters with slow Ken Burns pan. Ideal for local supermarket discounts and clinic announcements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-white">Stop Audio Chimes & News</span>
                </div>
                <div className="text-lg font-bold text-purple-400">4.8 Minutes / Hour</div>
                <p className="text-[11px] text-gray-300">
                  Geo-fenced stop audio sponsor alerts ('Arriving at Junction') + Kerala 22K gold rate ticker.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 10-Minute Loop Sequence Simulation */}
          <div className={`p-6 rounded-2xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-4`}>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h4 className="text-base font-semibold text-white">Sample 10-Minute Multi-Format Experience Flow</h4>
                <p className="text-xs text-gray-400">Playout sequence illustrating how video, static posters, and audio chime sponsors rotate</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Seamless Playout Scheduler</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { time: "0:00 - 1:20", type: "Transit Telemetry", title: "Live Map & Next Stop ETA", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                { time: "1:20 - 1:35", type: "Video Commercial (15s)", title: "Jos Alukkas Bridal Reel", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { time: "1:35 - 3:00", type: "Transit + L-Band", title: "Speed & Real Estate Banner", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                { time: "3:00 - 3:06", type: "Static Poster (6s)", title: "Lulu Supermarket Deal", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                { time: "3:06 - 3:10", type: "Audio Chime (4s)", title: "Stop Sponsor: Medical College", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                { time: "3:10 - 4:40", type: "Transit Telemetry", title: "Upcoming Junction ETA", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                { time: "4:40 - 4:50", type: "Video Commercial (10s)", title: "Brilliant Entrance Demo", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { time: "4:50 - 6:00", type: "Transit + Gold Ticker", title: "Kerala 22K Gold Rate Ticker", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
                { time: "6:00 - 6:06", type: "Static Poster (6s)", title: "Aster Clinic Eye Checkup", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                { time: "6:06 - 7:30", type: "Transit Telemetry", title: "Connecting Routes Guide", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                { time: "7:30 - 7:50", type: "Video Showcase (20s)", title: "Skyline Villa Cinematic", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { time: "7:50 - 10:00", type: "Transit Telemetry", title: "Terminal Arrival Countdown", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              ].map((slot, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${slot.bg} flex flex-col justify-between`}>
                  <div>
                    <div className="text-[10px] font-mono opacity-80">{slot.time}</div>
                    <div className="text-xs font-bold mt-1 text-white">{slot.title}</div>
                  </div>
                  <div className="text-[10px] uppercase font-semibold tracking-wider mt-2 opacity-90">
                    {slot.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 4: ADVERTISING MEDIA BENCHMARK MATRIX
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeMode === "benchmark" && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h3 className="text-xl font-bold text-white">Media Channel Comparative Matrix</h3>
            <p className="text-sm text-gray-400 max-w-3xl mt-1">
              Arm your ad sales pitch with indisputable economics. Show local business owners why smart in-bus digital transit screens deliver 4x higher brand recall than roadside hoardings or skipped Instagram reels.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b0c10] border-b border-white/10 text-gray-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6 font-semibold">Advertising Medium</th>
                  <th className="py-4 px-6 font-semibold">Effective CPM (Cost / 1K Views)</th>
                  <th className="py-4 px-6 font-semibold">Average Dwell / Attention</th>
                  <th className="py-4 px-6 font-semibold">Distraction / Skip Risk</th>
                  <th className="py-4 px-6 font-semibold">Proof of Playout</th>
                  <th className="py-4 px-6 font-semibold text-right">Cost for 150K Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] bg-[#0d0e12]">
                {/* GetMyBus Hero Row */}
                <tr className="bg-blue-600/[0.08] hover:bg-blue-600/[0.12] transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <span>GetMyBus Smart In-Bus TV</span>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-blue-500 text-white">
                        Champion
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-400 text-sm">
                    ₹12 - ₹18
                  </td>
                  <td className="py-4 px-6 font-medium text-white">
                    35 - 45 Minutes (Captive Seated)
                  </td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold">
                    0% (Unskippable Screen)
                  </td>
                  <td className="py-4 px-6 text-white font-mono">
                    GPS Cloud Playout Telemetry
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-emerald-400 text-sm">
                    ₹2,250
                  </td>
                </tr>

                {/* Highway Hoardings */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    Highway / Junction Static Hoarding
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-300">
                    ₹85 - ₹140
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    1.2 Seconds (Driver glance)
                  </td>
                  <td className="py-4 px-6 text-red-400">
                    High (Driver looking at traffic)
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    None (Estimate only)
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">
                    ₹16,500 - ₹35,000
                  </td>
                </tr>

                {/* Meta / Instagram Sponsored Reel */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    Meta / Instagram Sponsored Reel
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-300">
                    ₹160 - ₹280
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    0.8 Seconds (Instant thumb scroll)
                  </td>
                  <td className="py-4 px-6 text-red-400">
                    Extreme (88% muted, skipped)
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    Algorithmic impressions
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">
                    ₹28,000 - ₹42,000
                  </td>
                </tr>

                {/* Local Cable TV Ad */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    Local Town Cable TV Channel Scroll
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-300">
                    ₹65 - ₹95
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    5 - 10 Seconds (During break)
                  </td>
                  <td className="py-4 px-6 text-amber-400">
                    Channel surfing on breaks
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    Self-declaration log
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">
                    ₹12,000 - ₹18,000
                  </td>
                </tr>

                {/* Newspaper Inserts */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-gray-200">
                    Daily Newspaper Pamphlet Inserts
                  </td>
                  <td className="py-4 px-6 font-mono text-gray-300">
                    ₹90 - ₹120
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    2 Seconds before trash
                  </td>
                  <td className="py-4 px-6 text-red-400">
                    High (Thrown directly to waste)
                  </td>
                  <td className="py-4 px-6 text-gray-400">
                    Delivery vendor verbal claim
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-300">
                    ₹15,000 - ₹20,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Pitch Summary Bullets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="text-emerald-400 font-bold text-sm">💡 85% Lower Cost per View</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                At an effective CPM of ~₹15, local retail brands reach 1,000 guaranteed captive commuters for less than the cost of a single tea and snack.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="text-blue-400 font-bold text-sm">👁️ Undivided 35-Minute Dwell</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unlike highway billboards passed at 60 km/h or social media posts scrolled in 0.4 seconds, passengers sit facing the screen for over half an hour.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="text-purple-400 font-bold text-sm">📡 Verifiable GPS Telemetry</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every video playout is timestamped with latitude, longitude, and bus ID into our cloud. Give advertisers corporate-grade audit transparency.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

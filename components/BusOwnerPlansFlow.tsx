"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";

interface BusOwnerPlansFlowProps {
  theme?: "dark" | "light";
}

// ─── HARDWARE PROCUREMENT BRANDS & AMAZON SPECIFICATION DATABASE ────────────
export interface HardwareBrandOption {
  id: string;
  brand: string;
  model: string;
  price: number;
  rating: number;
  reviews: number;
  amazonUrl: string;
  isBestChoice: boolean;
  bestReason: string;
  specs: string[];
}

export interface CustomSpecOverride {
  price?: number;
  brand?: string;
  model?: string;
  amazonUrl?: string;
  customNote?: string;
}

export const HARDWARE_BRANDS_DB: Record<
  string,
  {
    title: string;
    subsystemLabel: string;
    options: HardwareBrandOption[];
  }
> = {
  tv_screen: {
    title: '32" Transit TV Display Screen',
    subsystemLabel: "Display Panel",
    options: [
      {
        id: "vw_32",
        brand: "VW (Visio World)",
        model: "VW32A 32\" Frameless HD Ready LED TV",
        price: 6999,
        rating: 4.1,
        reviews: 5820,
        amazonUrl: "https://www.amazon.in/Visio-World-Frameless-VW32A-Black/dp/B08XMWZ51X",
        isBestChoice: true,
        bestReason: "Best Budget Fleet Value • Bright A+ IPS Panel & 1-Year Brand Warranty",
        specs: ["32\" HD Ready (1366x768)", "Wide 178° viewing angle", "Dual HDMI + USB ports", "Auto-power on upon ignition AC feed"],
      },
      {
        id: "foxsky_32",
        brand: "Foxsky",
        model: "32FS-VS 32\" HD Ready Frameless Transit Display",
        price: 7499,
        rating: 4.2,
        reviews: 4120,
        amazonUrl: "https://www.amazon.in/Foxsky-Inches-Ready-Smart-32FS-VS/dp/B09CYP2P2B",
        isBestChoice: false,
        bestReason: "Popular Transit Display • 300 Nits Brightness & Slim Shock Bezel",
        specs: ["300 nits daylight visibility", "Dual HDMI 2.0 inputs", "Vibration-damped steel chassis", "Wall & ceiling drop bracket ready"],
      },
      {
        id: "acer_32",
        brand: "Acer",
        model: "Advanced I-Series 32\" HD Smart Google TV (AR32GR2841HDFL)",
        price: 8999,
        rating: 4.3,
        reviews: 8430,
        amazonUrl: "https://www.amazon.in/dp/B0CX21C8S9",
        isBestChoice: false,
        bestReason: "Tier-1 Brand Quality • Heavy-Duty Power Board for Voltage Surges",
        specs: ["Frameless IPS display", "Micro Dimming & HDR10", "Wide 178° viewing angle", "Surge-resistant power supply"],
      },
      {
        id: "redmi_32",
        brand: "Redmi / Xiaomi",
        model: "32\" F-Series HD Smart Fire TV (L32MA-FVIN)",
        price: 10999,
        rating: 4.2,
        reviews: 12900,
        amazonUrl: "https://www.amazon.in/dp/B0C46FR7R2",
        isBestChoice: false,
        bestReason: "Premium Visibility • Metal Frame & 20W Dolby Audio",
        specs: ["Metal bezel-less enclosure", "20W Dolby Audio sound output", "Vivid Picture Engine", "High daylight contrast"],
      },
      {
        id: "samsung_32",
        brand: "Samsung",
        model: "Wondertainment 32\" HD Ready LED TV (UA32T4380AKXXL)",
        price: 13490,
        rating: 4.4,
        reviews: 19400,
        amazonUrl: "https://www.amazon.in/dp/B086KDN86Y",
        isBestChoice: false,
        bestReason: "Commercial Long-Life Reliability • Tier-1 Nationwide Service Network",
        specs: ["Ultra Clean View panel", "Micro Dimming Pro", "PurColor technology", "High commercial MTBF rating"],
      },
    ],
  },
  compute_smart_tv: {
    title: '32" All-in-One Smart Android TV',
    subsystemLabel: "Smart TV (Screen + Compute)",
    options: [
      {
        id: "foxsky_smart_32",
        brand: "Foxsky",
        model: "32FS-VS 32\" Frameless Android Smart TV (Built-in CPU)",
        price: 7499,
        rating: 4.2,
        reviews: 4120,
        amazonUrl: "https://www.amazon.in/Foxsky-Inches-Ready-Smart-32FS-VS/dp/B09CYP2P2B",
        isBestChoice: true,
        bestReason: "Top Value All-in-One • Built-in Android OS eliminates external TV box",
        specs: ["Quad-Core ARM CPU + 1GB/8GB", "Built-in Wi-Fi & USB host", "Runs GetMyBus player APK directly", "Single vehicle power cord"],
      },
      {
        id: "vw_smart_32",
        brand: "VW (Visio World)",
        model: "VW32S 32\" Smart Frameless Android LED TV",
        price: 7999,
        rating: 4.1,
        reviews: 3200,
        amazonUrl: "https://www.amazon.in/Visio-World-Frameless-VW32A-Black/dp/B08XMWZ51X",
        isBestChoice: false,
        bestReason: "High-Margin Fleet Pick • Fast Boot Times & Low 45W Power Draw",
        specs: ["A+ Grade IPS panel", "Built-in Wi-Fi & USB host", "Low 45W operational power", "Auto-start APK support"],
      },
      {
        id: "acer_smart_32",
        brand: "Acer",
        model: "Advanced I-Series 32\" Google TV Quad-Core",
        price: 8999,
        rating: 4.3,
        reviews: 8430,
        amazonUrl: "https://www.amazon.in/dp/B0CX21C8S9",
        isBestChoice: false,
        bestReason: "Tier-1 Google TV • 1.5GB RAM & Quad-Core Cortex CPU",
        specs: ["1.5GB RAM + 16GB ROM", "Dual-band Wi-Fi 2.4/5GHz", "High-efficiency video codec decode", "Rugged chassis"],
      },
      {
        id: "redmi_smart_32",
        brand: "Redmi / Xiaomi",
        model: "32\" F-Series HD Smart Fire TV",
        price: 10999,
        rating: 4.2,
        reviews: 12900,
        amazonUrl: "https://www.amazon.in/dp/B0C46FR7R2",
        isBestChoice: false,
        bestReason: "Fast Dual-Band Wi-Fi & Premium Build",
        specs: ["Quad-Core Processor", "Dual-Band Wi-Fi (2.4GHz/5GHz)", "Dolby Audio 20W stereo", "Vivid Picture Engine"],
      },
    ],
  },
  compute_tv_box: {
    title: "4G Android TV Box (2GB/16GB)",
    subsystemLabel: "Compute Subsystem",
    options: [
      {
        id: "tanix_w2",
        brand: "Tanix",
        model: "W2 Amlogic S905W2 2GB RAM / 16GB ROM 4K Android 11",
        price: 1850,
        rating: 4.1,
        reviews: 1450,
        amazonUrl: "https://www.amazon.in/dp/B0B551R42V",
        isBestChoice: true,
        bestReason: "Transit Benchmark • Dual USB (GPS + Dongle) & Hardware AV1 Decode",
        specs: ["Amlogic S905W2 Quad-Core 64-bit", "2GB RAM + 16GB eMMC storage", "2x USB 2.0 host ports", "Auto-power on upon electrical supply"],
      },
      {
        id: "x96_mini",
        brand: "X96",
        model: "X96 Mini / X96Q Allwinner H313 2GB/16GB 4K Android Box",
        price: 1749,
        rating: 3.9,
        reviews: 2180,
        amazonUrl: "https://www.amazon.in/X96-Mini-Android-Amlogic-Supported/dp/B07J5BPF4K",
        isBestChoice: false,
        bestReason: "Ultra-Low Cost • Compact 8x8cm footprint taped behind screen",
        specs: ["Allwinner H313 Quad-Core", "2GB RAM + 16GB ROM", "Low 5V/2A power consumption", "HDMI 2.0 4K output"],
      },
      {
        id: "tx3_mini",
        brand: "Tanix",
        model: "TX3 Mini 2GB/16GB Box with LED Clock Front Display",
        price: 1999,
        rating: 4.0,
        reviews: 950,
        amazonUrl: "https://www.amazon.in/dp/B07S8ZGL9G",
        isBestChoice: false,
        bestReason: "Front LED display shows route clock • Aluminum heat sink",
        specs: ["Front LED digital clock", "Optimized thermal dissipation", "Android 11 OS", "Dual USB ports"],
      },
    ],
  },
  compute_orange_pi: {
    title: "Orange Pi Zero 3 Linux SBC",
    subsystemLabel: "Industrial SBC",
    options: [
      {
        id: "opi_zero3_4gb",
        brand: "Orange Pi",
        model: "Orange Pi Zero 3 Allwinner H618 (4GB RAM) + Metal Enclosure",
        price: 2400,
        rating: 4.4,
        reviews: 320,
        amazonUrl: "https://www.amazon.in/dp/B0CCDM8JLR",
        isBestChoice: true,
        bestReason: "Industrial SBC • Metal heatsink casing & read-only OS stability",
        specs: ["Allwinner H618 Quad-Core Cortex-A53", "4GB LPDDR4 RAM", "Micro-HDMI 4K output", "Gigabit Ethernet & Wi-Fi"],
      },
      {
        id: "opi_zero3_2gb",
        brand: "Orange Pi",
        model: "Orange Pi Zero 3 (2GB RAM Version)",
        price: 2199,
        rating: 4.3,
        reviews: 410,
        amazonUrl: "https://www.amazon.in/dp/B0CCDMC6MN",
        isBestChoice: false,
        bestReason: "Budget Linux Pick • Low 5V 2A Power Consumption",
        specs: ["2GB LPDDR4 memory", "Quad-core 1.5GHz", "3x USB host pins", "TF card boot"],
      },
    ],
  },
  gps_puck: {
    title: "u-blox USB GPS Puck",
    subsystemLabel: "GPS Receiver",
    options: [
      {
        id: "vk162_puck",
        brand: "Geekstory / VK-162",
        model: "VK-162 G-Mouse USB GPS Navigation Receiver (u-blox 7)",
        price: 749,
        rating: 4.3,
        reviews: 1850,
        amazonUrl: "https://www.amazon.in/Navigation-External-Receiver-Raspberry-Geekstory/dp/B078Y52FGQ",
        isBestChoice: true,
        bestReason: "Best for Transit TVs • 2m Shielded Cable & Windshield Dash Mount",
        specs: ["u-blox 7 56-channel high-sensitivity engine", "Built-in 25x25mm ceramic antenna", "Magnetic base + 3M adhesive", "Plugs directly into TV USB port"],
      },
      {
        id: "vk172_dongle",
        brand: "VK-172",
        model: "VK-172 G-Mouse USB GPS/GLONASS Dual Receiver Dongle",
        price: 699,
        rating: 4.1,
        reviews: 920,
        amazonUrl: "https://www.amazon.in/dp/B01MTU9KTF",
        isBestChoice: false,
        bestReason: "Ultra-Compact Stick • Zero loose cables behind screen",
        specs: ["Dual GPS + GLONASS reception", "Plug & play USB stick", "1s hot start acquisition", "Compatible with Android & Linux"],
      },
      {
        id: "beitian_bn880",
        brand: "Beitian",
        model: "BN-880 High-Sensitivity Flight Controller GPS Puck",
        price: 1150,
        rating: 4.4,
        reviews: 540,
        amazonUrl: "https://www.amazon.in/dp/B078Y67WBQ",
        isBestChoice: false,
        bestReason: "Sub-meter Precision • Multi-Constellation GLONASS+Beidou",
        specs: ["Dual compass + GPS", "Flash memory for configuration", "High update rate 10Hz", "UART/USB bridge"],
      },
    ],
  },
  gps_sinotrack: {
    title: "SinoTrack ST-901L 4G Hardwired GPS",
    subsystemLabel: "Automotive Tracker",
    options: [
      {
        id: "sinotrack_st901l",
        brand: "SinoTrack",
        model: "ST-901L 4G Waterproof Automotive GPS Tracker (9V-80V DC)",
        price: 1749,
        rating: 4.2,
        reviews: 3410,
        amazonUrl: "https://www.amazon.in/SinoTrack-Vehicles-Real-Time-Waterproof-Motorcycle/dp/B0DZMJV9CV",
        isBestChoice: true,
        bestReason: "24/7 Dedicated Tracking • Wide 9V-80V direct bus battery input & ACC sensor",
        specs: ["4G LTE + 2G GSM quad-band fallback", "Wide 9V-80V input (12V & 24V bus electrical)", "Internal 150mAh backup battery", "ACC wire detects ignition ON/OFF"],
      },
      {
        id: "onelap_micro",
        brand: "Onelap",
        model: "Micro Plus 4G Waterproof Vehicle GPS with Engine Lock",
        price: 1899,
        rating: 4.2,
        reviews: 5120,
        amazonUrl: "https://www.amazon.in/dp/B07YDJJCFM",
        isBestChoice: false,
        bestReason: "Indian Server Cloud Support • Remote Engine Relay & Live Alerts",
        specs: ["Engine cut-off relay included", "Anti-theft vibration alarm", "Waterproof IP65 casing", "Mobile companion app included"],
      },
    ],
  },
  net_dongle: {
    title: "4G LTE USB Wi-Fi Dongle",
    subsystemLabel: "Cellular Modem",
    options: [
      {
        id: "generic_4g_dongle",
        brand: "Generic / Smart4G",
        model: "Universal 4G LTE High-Speed USB Data Card with Wi-Fi Hotspot",
        price: 1250,
        rating: 4.0,
        reviews: 2890,
        amazonUrl: "https://www.amazon.in/Generic-Wireless-Hotspot-Internet-Broadband/dp/B0C39K9SZC",
        isBestChoice: true,
        bestReason: "Best Fleet Choice • Powers In-Cabin Wi-Fi & Passenger Route Sync",
        specs: ["150 Mbps download / 50 Mbps upload", "Works with all Indian SIMs (Jio, Airtel, Vi)", "Built-in Wi-Fi hotspot for up to 10 users", "Powered directly via USB port"],
      },
      {
        id: "dlink_dwm222",
        brand: "D-Link",
        model: "DWM-222 4G LTE USB Adapter / Data Card",
        price: 1299,
        rating: 4.1,
        reviews: 3100,
        amazonUrl: "https://www.amazon.in/dp/B07G316L95",
        isBestChoice: false,
        bestReason: "Tier-1 Networking Brand • Persistent auto-reconnect logic",
        specs: ["D-Link enterprise reliability", "Integrated SIM slot", "MicroSD card slot up to 32GB", "Plug & play APN recognition"],
      },
      {
        id: "zte_4g_wingle",
        brand: "ZTE / Huawei",
        model: "Universal 4G Cat-4 USB Wingle (150 Mbps)",
        price: 999,
        rating: 3.8,
        reviews: 1420,
        amazonUrl: "https://www.amazon.in/dp/B08V5N4MQX",
        isBestChoice: false,
        bestReason: "Budget Option • Multi-Operator SIM Slot",
        specs: ["Cat-4 LTE modem", "USB power powered", "Micro-SIM slot", "Status LED indicator"],
      },
    ],
  },
  net_router: {
    title: "Industrial 4G M2M IoT Router",
    subsystemLabel: "Industrial Gateway",
    options: [
      {
        id: "teltonika_rut241",
        brand: "Teltonika",
        model: "RUT241 Industrial 4G LTE Cellular Gateway & Router",
        price: 3500,
        rating: 4.5,
        reviews: 480,
        amazonUrl: "https://www.amazon.in/dp/B0B527W3S8",
        isBestChoice: true,
        bestReason: "Industrial Grade • Aluminum Enclosure & External High-Gain Antennas",
        specs: ["Rugged aluminum casing", "Dual-SIM cellular failover", "Operating temp -40°C to 75°C", "9V-30V DC direct terminal block"],
      },
      {
        id: "tplink_mr100",
        brand: "TP-Link",
        model: "TL-MR100 300 Mbps Wireless N 4G LTE Router",
        price: 2499,
        rating: 4.3,
        reviews: 14200,
        amazonUrl: "https://www.amazon.in/dp/B085P568BK",
        isBestChoice: false,
        bestReason: "Long-Range In-Bus Wi-Fi • Dual Detachable 4G Antennas",
        specs: ["Fast 300 Mbps Wi-Fi", "Dual external LTE antennas", "Connect up to 32 devices", "Standard SIM plug and play"],
      },
    ],
  },
  ticketing_bt: {
    title: "Phone + Bluetooth Thermal Printer",
    subsystemLabel: "Ticketing Terminal",
    options: [
      {
        id: "everycom_ec58",
        brand: "Everycom",
        model: "EC-58 58mm (2-inch) Portable Wireless Bluetooth Thermal Printer",
        price: 2499,
        rating: 4.1,
        reviews: 2310,
        amazonUrl: "https://www.amazon.in/dp/B07P8WBL5N",
        isBestChoice: true,
        bestReason: "Top Conductor Pick • 90mm/s Print Speed & 5-Day Standby Battery",
        specs: ["58mm paper roll width (standard transit)", "Prints QR tickets in 1 second", "ESC/POS standard bluetooth protocol", "Rechargeable 1500mAh Li-ion battery"],
      },
      {
        id: "bluprints_pos",
        brand: "BluPrints",
        model: "Smart POS 58mm Handheld Bluetooth Thermal Receipt Printer",
        price: 2799,
        rating: 4.2,
        reviews: 1140,
        amazonUrl: "https://www.amazon.in/Thermal-Printer-Bluetooth-Handheld-Rechargeable/dp/B07WCSBDRD",
        isBestChoice: false,
        bestReason: "Rugged Conductor Build • Drop-resistant belt clip casing",
        specs: ["Heavy-duty rubber drop bumper", "High-density thermal head (100km paper life)", "Bluetooth 4.0 BLE + USB", "Made in India transit cert"],
      },
      {
        id: "hoin_58",
        brand: "HOIN",
        model: "HOP-E58 58mm Pocket Bluetooth Thermal Printer",
        price: 2199,
        rating: 4.0,
        reviews: 860,
        amazonUrl: "https://www.amazon.in/dp/B08C4ZNDGB",
        isBestChoice: false,
        bestReason: "Ultra-Compact Pocket Format • Lightweight for conductors",
        specs: ["Ultra-light 260g with battery", "High resolution 203 DPI QR prints", "Micro-USB charging", "Low energy sleep mode"],
      },
    ],
  },
  ticketing_pos: {
    title: "Sunmi V2s Android Smart POS",
    subsystemLabel: "Smart POS Terminal",
    options: [
      {
        id: "sunmi_v2s",
        brand: "Sunmi",
        model: "Sunmi V2s Android 11 Commercial Mobile Smart POS Terminal",
        price: 14500,
        rating: 4.5,
        reviews: 650,
        amazonUrl: "https://www.amazon.in/s?k=sunmi+v2s+pos+terminal",
        isBestChoice: true,
        bestReason: "Transit Benchmark • Built-in Seiko 70mm/s Printer & 2D Barcode Scanner",
        specs: ["Built-in Seiko 58mm thermal printer (70mm/s)", "2D QR barcode scanner with flash LED", "5.45\" HD+ anti-glare capacitive display", "4G LTE, Wi-Fi, GPS & drop-tested rugged shell"],
      },
      {
        id: "imin_d1",
        brand: "iMin",
        model: "D1 Mobile Smart POS Terminal (Android 11, 58mm Printer)",
        price: 12999,
        rating: 4.3,
        reviews: 420,
        amazonUrl: "https://www.amazon.in/s?k=imin+d1+pos+terminal",
        isBestChoice: false,
        bestReason: "Cost-Effective Commercial POS • Dual-SIM 4G & 2600mAh battery",
        specs: ["High-speed 100mm/s thermal printer", "Quad-Core ARM Cortex CPU", "Dual-band Wi-Fi & 4G LTE", "Durable silicon drop bumper dock"],
      },
    ],
  },
};

// ─── STAGE 1: TV FACTOR ────────────────────────────────────────────────────────
export type TVOption = "smart" | "normal" | "none" | "no_tv_etm";

interface TVSpec {
  id: TVOption;
  title: string;
  badge: string;
  badgeColor: string;
  cost: number;
  desc: string;
  icon: string;
  specs: string[];
  brandKey?: string;
}

const TV_OPTIONS: TVSpec[] = [
  {
    id: "smart",
    title: "Existing Smart Android TV",
    badge: "Pre-Installed (₹0 Capex)",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cost: 0,
    desc: "Bus already has a working Smart Android TV (24\" or 32\") with built-in Android OS.",
    icon: "📺",
    specs: ["Built-in Android OS", "Native Wi-Fi & USB port", "Zero external box needed", "₹0 Display Capex"],
  },
  {
    id: "normal",
    title: "Existing Normal In-Bus TV",
    badge: "Pre-Installed (₹0 Capex)",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    cost: 0,
    desc: "Bus has standard 24\" or 32\" non-smart TV used with USB pendrive/DVD. HDMI/AV ready.",
    icon: "🖥️",
    specs: ["Pre-mounted on roof frame", "HDMI 2.0 / AV Input ready", "Powered by vehicle inverter", "Needs Android TV Box"],
  },
  {
    id: "none",
    title: "No TV Installed (Need Screen)",
    badge: "New Screen Required",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cost: 7500,
    desc: "Bare ceiling bulkhead. Requires procuring 32\" transit display panel + drop ceiling VESA mount.",
    icon: "✨",
    specs: ["32\" HD Ready IPS panel", "Ceiling drop VESA bracket", "150W pure sine inverter", "New procurement"],
    brandKey: "tv_screen",
  },
  {
    id: "no_tv_etm",
    title: "No TV / ETM-Only Route",
    badge: "SaaS Service (₹0 Display)",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    cost: 0,
    desc: "Bus owner wants digital ticketing & fleet tracking only. Zero display procurement or interior bus drilling.",
    icon: "🎫",
    specs: ["Zero display capex", "Instant 10-min crew deployment", "GPS telemetry from ETM device", "Commuters get live tracking on app"],
  },
];

// ─── STAGE 2: COMPUTE FACTOR ───────────────────────────────────────────────────
export type ComputeOption = "smart_soc" | "android_box" | "orange_pi" | "new_smart_tv" | "etm_standalone";

interface ComputeSpec {
  id: ComputeOption;
  title: string;
  badge: string;
  cost: number;
  desc: string;
  icon: string;
  specs: string[];
  brandKey?: string;
}

const COMPUTE_OPTIONS: ComputeSpec[] = [
  {
    id: "smart_soc",
    title: "TV Built-in Android Processor",
    badge: "Integrated (₹0)",
    cost: 0,
    desc: "Runs GetMyBus player APK directly as an autostart system app inside existing Smart TV.",
    icon: "⚡",
    specs: ["Zero external hardware", "Auto-boot on bus ignition", "Accepts USB GPS puck directly", "10-minute setup"],
  },
  {
    id: "android_box",
    title: "4G Android TV Box (2GB/16GB)",
    badge: "Recommended",
    cost: 1850,
    desc: "Plug-and-play Tanix W2 / X96 Mini box taped securely behind TV with dual USB ports.",
    icon: "📦",
    specs: ["Quad-Core ARM Cortex-A53", "2GB RAM + 16GB ROM", "2x USB ports (GPS + Dongle)", "1080p hardware decode"],
    brandKey: "compute_tv_box",
  },
  {
    id: "orange_pi",
    title: "Orange Pi Zero 3 Linux SBC",
    badge: "Industrial SBC",
    cost: 2400,
    desc: "Compact Linux Single Board Computer with metal enclosure for ultra-rugged endurance.",
    icon: "🥧",
    specs: ["Allwinner H618 Quad-Core", "Industrial metal heat casing", "Micro-HDMI 4K output", "Read-only OS partition"],
    brandKey: "compute_orange_pi",
  },
  {
    id: "new_smart_tv",
    title: "New 32\" All-in-One Smart TV",
    badge: "Turnkey Unit",
    cost: 8750,
    desc: "Procure brand new 32\" Smart Android TV with built-in compute. Combines screen + compute.",
    icon: "🌟",
    specs: ["32\" Frameless IPS Panel", "Integrated Quad-Core CPU", "Includes ceiling bracket", "Unified single power cord"],
    brandKey: "compute_smart_tv",
  },
  {
    id: "etm_standalone",
    title: "Handheld ETM Smart Processor",
    badge: "Included in POS / Phone (₹0)",
    cost: 0,
    desc: "Ticketing logic, fare tables, dynamic UPI QR generation, and cloud sync run on the POS terminal/phone.",
    icon: "📱",
    specs: ["Runs on POS terminal CPU", "Instant UPI QR generation", "Zero external TV box needed", "Automatic cloud batch sync"],
  },
];

// ─── STAGE 3: GPS FACTOR ───────────────────────────────────────────────────────
export type GPSOption = "usb_puck" | "ais140" | "sinotrack" | "phone_gps" | "etm_gps";

interface GPSSpec {
  id: GPSOption;
  title: string;
  badge: string;
  cost: number;
  desc: string;
  icon: string;
  specs: string[];
  brandKey?: string;
}

const GPS_OPTIONS: GPSSpec[] = [
  {
    id: "usb_puck",
    title: "u-blox USB GPS Puck",
    badge: "Best for Transit TV",
    cost: 750,
    desc: "VK-162 G-Mouse plugs into TV or Android box USB port. Placed on windshield dash with 2m cable.",
    icon: "🛰️",
    specs: ["u-blox 7th Gen engine", "56-channel high sensitivity", "0ms local read for next stop", "Zero 24V wiring required"],
    brandKey: "gps_puck",
  },
  {
    id: "ais140",
    title: "Existing AIS-140 Vehicle GPS",
    badge: "Reused (₹0)",
    cost: 0,
    desc: "Reuses bus's mandatory government AIS-140 GPS tracker via cloud webhook / API sync.",
    icon: "📡",
    specs: ["Government certified tracker", "Direct server-to-server API", "Continuous vehicle power", "₹0 Capex allocation"],
  },
  {
    id: "sinotrack",
    title: "SinoTrack ST-901L 4G Hardwired",
    badge: "24/7 Dedicated",
    cost: 1750,
    desc: "Hardwired 3-wire automotive tracker connected directly to bus 24V battery + ignition ACC line.",
    icon: "🔌",
    specs: ["9V–80V wide DC input", "Internal backup battery", "Ignition ON/OFF telemetry", "Always-on cloud tracking"],
    brandKey: "gps_sinotrack",
  },
  {
    id: "phone_gps",
    title: "Conductor Smartphone GPS",
    badge: "Pilot Only (₹0)",
    cost: 0,
    desc: "Uses conductor or driver phone location sensor while running the crew companion app.",
    icon: "📱",
    specs: ["Uses crew smartphone GPS", "No dedicated hardware", "Battery drain consideration", "Ideal for Day 1 pilot"],
  },
  {
    id: "etm_gps",
    title: "Integrated ETM / Handheld GPS",
    badge: "Integrated (₹0)",
    cost: 0,
    desc: "Smart POS terminal or Conductor Smartphone acquires GPS and streams live coordinates to commuter tracking app.",
    icon: "📍",
    specs: ["Sub-3m accuracy GPS sensor", "Streams live location to commuter app", "Zero wiring in bus cabin", "Included with ticketing device"],
  },
];

// ─── STAGE 4: INTERNET & CONNECTIVITY FACTOR ───────────────────────────────────
export type NetOption = "dongle" | "phone_hotspot" | "m2m_router" | "etm_sim";

interface NetSpec {
  id: NetOption;
  title: string;
  badge: string;
  cost: number;
  monthlySimCost: number;
  desc: string;
  icon: string;
  specs: string[];
  brandKey?: string;
}

const NET_OPTIONS: NetSpec[] = [
  {
    id: "dongle",
    title: "4G LTE USB Wi-Fi Dongle",
    badge: "Standard Fleet Pick",
    cost: 1250,
    monthlySimCost: 299,
    desc: "Universal 4G USB stick plugged into Android Box/TV. Creates in-cabin Wi-Fi and connects screen to cloud.",
    icon: "📶",
    specs: ["Jio/Airtel 4G Cat 4 (150 Mbps)", "Auto-APN & persistent reconnect", "Powered directly via USB", "Wi-Fi hotspot for conductor"],
    brandKey: "net_dongle",
  },
  {
    id: "phone_hotspot",
    title: "Conductor Phone Hotspot",
    badge: "Zero-Capex Pilot",
    cost: 0,
    monthlySimCost: 0,
    desc: "TV Box or Smart TV connects to conductor's personal smartphone Wi-Fi hotspot during route run.",
    icon: "📲",
    specs: ["Zero modem capex", "Uses existing phone data pack", "Zero monthly SIM bill", "Manual tether daily"],
  },
  {
    id: "m2m_router",
    title: "Industrial 4G M2M IoT Router",
    badge: "Enterprise Grade",
    cost: 3500,
    monthlySimCost: 299,
    desc: "Teltonika industrial cellular gateway with external dual antennas mounted on driver pillar.",
    icon: "🖧",
    specs: ["Rugged aluminum casing", "Dual-SIM cellular failover", "External high-gain paddle antennas", "9V–30V DC direct wire"],
    brandKey: "net_router",
  },
  {
    id: "etm_sim",
    title: "ETM Internal 4G SIM",
    badge: "Handheld Cellular",
    cost: 0,
    monthlySimCost: 199,
    desc: "Internal 4G LTE eSIM/Nano-SIM inside POS terminal handles continuous ticket upload & GPS broadcast.",
    icon: "📶",
    specs: ["Direct 4G connection", "Multi-operator roaming SIM", "Powers passenger UPI & live maps", "Ultra-low power usage"],
  },
];

// ─── STAGE 5: TICKETING FACTOR ─────────────────────────────────────────────────
export type TicketingOption = "none" | "phone_bt" | "sunmi_pos" | "existing_etm";

interface TicketingSpec {
  id: TicketingOption;
  title: string;
  badge: string;
  cost: number;
  desc: string;
  icon: string;
  specs: string[];
  brandKey?: string;
}

const TICKETING_OPTIONS: TicketingSpec[] = [
  {
    id: "none",
    title: "Phase 1 Deferred / Traditional Cash",
    badge: "Zero Crew Friction",
    cost: 0,
    desc: "Conductor continues manual paper tickets & cash bag. Zero change for crew, focus 100% on ads & tracking.",
    icon: "🎟️",
    specs: ["Zero conductor resistance", "₹0 upfront ticketing capex", "Fastest 1-day bus onboard", "Upgrade to ETM later in Phase 2"],
  },
  {
    id: "phone_bt",
    title: "Phone + Bluetooth Thermal Printer",
    badge: "Budget Digital Kit",
    cost: 2800,
    desc: "Conductor uses personal/supplied Android smartphone paired with a 58mm belt-mounted Bluetooth thermal printer.",
    icon: "🖨️",
    specs: ["58mm wireless receipt printer", "Prints QR tickets in 1 second", "ESC/POS protocol over BT", "4-5 day battery life"],
    brandKey: "ticketing_bt",
  },
  {
    id: "sunmi_pos",
    title: "Sunmi V2s Android Smart POS",
    badge: "Commercial Grade",
    cost: 14500,
    desc: "Heavy-duty commercial all-in-one terminal: built-in Seiko 58mm printer, 4G, 2D QR barcode scanner, and touch screen.",
    icon: "💳",
    specs: ["Sunmi V2s Android 11 POS", "Built-in high-speed printer (70mm/s)", "2D QR barcode scanner with flash", "Drop-tested transit ruggedness"],
    brandKey: "ticketing_pos",
  },
  {
    id: "existing_etm",
    title: "Existing Electronic Ticket Machine",
    badge: "Reused Terminal (₹0)",
    cost: 0,
    desc: "Bus owner already owns handheld ETMs. Conductor continues using them, synced via backend batch reports.",
    icon: "🔄",
    specs: ["Reuses pre-owned route ETM", "Crew already 100% trained", "Zero hardware investment", "Saved ~₹14,500 capex"],
  },
];

// ─── FLEET HARDWARE 1-CLICK PRESETS ─────────────────────────────────────────
export type CommercialModel = "fixed" | "revshare" | "saas_etm";

export interface FleetPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  icon: string;
  estShare: string;
  setupTime: string;
  tagline: string;
  summary: string;
  tv: TVOption;
  compute: ComputeOption;
  gps: GPSOption;
  net: NetOption;
  ticketing: TicketingOption;
  commercialModel: CommercialModel;
}

export const FLEET_PRESETS: FleetPreset[] = [
  {
    id: "kerala_standard",
    name: "The Kerala Standard",
    badge: "Most Common (~65%)",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: "🚌",
    estShare: "65% of Kerala private buses",
    setupTime: "25 mins",
    tagline: "Standard Normal TV Retrofit",
    summary: "Reuses existing normal TV. Adds 4G Android Box + USB GPS puck + 4G Dongle. Cash ticketing.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "none",
    commercialModel: "fixed",
  },
  {
    id: "smart_fast_launch",
    name: "Smart TV Fast Launch",
    badge: "Fastest Setup (~15%)",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: "⚡",
    estShare: "15% modern bus fleet",
    setupTime: "15 mins",
    tagline: "Zero External Compute Box",
    summary: "Signage APK runs on TV's built-in Android SoC. Just insert USB GPS puck + 4G dongle. Done in 15 mins.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "none",
    commercialModel: "fixed",
  },
  {
    id: "smart_bt_etm",
    name: "Smart TV + Bluetooth ETM",
    badge: "Tech-Forward",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "🖨️",
    estShare: "High-yield city routes",
    setupTime: "20 mins",
    tagline: "Passenger Ads + QR Paper Tickets",
    summary: "Player APK autostarts on Smart TV board. Conductor smartphone pairs with 58mm Bluetooth thermal receipt printer for instant printed tickets and live UPI QR.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
  },
  {
    id: "smart_sunmi_pos",
    name: "Smart TV + Sunmi Smart POS",
    badge: "Flagship Smart Combo",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: "💳",
    estShare: "High-revenue city routes",
    setupTime: "25 mins",
    tagline: "Smart TV Ads + Commercial Sunmi POS",
    summary: "Signage APK runs on TV SoC. Conductor operates commercial Sunmi V2s Smart POS with Seiko 58mm printer and QR scanner.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
  },
  {
    id: "smart_ais140",
    name: "Smart TV + Existing ETM Sync",
    badge: "Zero New Hardware",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    icon: "📡",
    estShare: "Modern private fleet with ETM",
    setupTime: "15 mins",
    tagline: "Smart TV Signage + Route ETM Sync",
    summary: "Player APK autostarts on Smart TV board. Conductor continues using pre-owned ETM terminal, synced via cloud API.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "existing_etm",
    commercialModel: "fixed",
  },
  {
    id: "smart_turnkey_combo",
    name: "Turnkey Smart TV Modernization",
    badge: "All-in-One Smart TV",
    badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    icon: "🌟",
    estShare: "Bare buses wanting smart screens",
    setupTime: "60 mins",
    tagline: "32\" Smart TV + Bluetooth Thermal ETM",
    summary: "Mount brand new 32\" Smart Android TV (built-in processor) + USB GPS puck + conductor Bluetooth thermal printer.",
    tv: "none",
    compute: "new_smart_tv",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
  },
  {
    id: "normal_bt_etm",
    name: "Normal TV + Bluetooth ETM",
    badge: "Popular Combo",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: "🚌",
    estShare: "Classic Kerala private fleet",
    setupTime: "35 mins",
    tagline: "4G TV Box Ads + Bluetooth Thermal ETM",
    summary: "Reuses roof TV with 4G Android Box. Conductor smartphone pairs with 58mm Bluetooth thermal receipt printer.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
  },
  {
    id: "normal_sunmi_pos",
    name: "Normal TV + Sunmi Smart POS",
    badge: "Commercial Normal TV",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: "💳",
    estShare: "Trunk route private fleets",
    setupTime: "40 mins",
    tagline: "4G TV Box Ads + Commercial Sunmi POS",
    summary: "4G Android TV Box behind existing normal screen. Conductor operates commercial Sunmi V2s Smart POS with built-in printer.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
  },
  {
    id: "full_modernization",
    name: "Full Modernization",
    badge: "Turnkey Refit",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    icon: "👑",
    estShare: "Bare / unequipped buses",
    setupTime: "90 mins",
    tagline: "Complete Transit Hardware Kit",
    summary: "Mount brand new 32\" display + Android Box + hardwired SinoTrack 4G GPS + Sunmi V2s Smart POS terminal.",
    tv: "none",
    compute: "android_box",
    gps: "sinotrack",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
  },
  {
    id: "zero_capex_pilot",
    name: "Zero-Capex Day 1 Pilot",
    badge: "100% Free Demo",
    badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    icon: "🌱",
    estShare: "Risk-free operator trial",
    setupTime: "5 mins",
    tagline: "Zero Initial Investment",
    summary: "Instant risk-free trial: Smart TV APK + driver phone GPS + crew Wi-Fi hotspot. Verify revenue in 24 hours.",
    tv: "smart",
    compute: "smart_soc",
    gps: "phone_gps",
    net: "phone_hotspot",
    ticketing: "none",
    commercialModel: "fixed",
  },
  {
    id: "ais140_sync",
    name: "Govt AIS-140 GPS Sync",
    badge: "Zero-Wiring",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    icon: "📡",
    estShare: "Regulated state & town fleets",
    setupTime: "20 mins",
    tagline: "Reuses Mandated AIS-140 GPS",
    summary: "Normal TV + Android Box, pulling live telemetry from bus's existing AIS-140 GPS and keeping current ETM.",
    tv: "normal",
    compute: "android_box",
    gps: "ais140",
    net: "dongle",
    ticketing: "existing_etm",
    commercialModel: "fixed",
  },
  {
    id: "etm_only_saas",
    name: "ETM-Only Transit SaaS",
    badge: "Owner Pays Us (SaaS)",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: "🎫",
    estShare: "Anti-fraud route operators",
    setupTime: "10 mins",
    tagline: "Digital Ticketing (Zero TV, Zero Payout)",
    summary: "Bus owner subscribes to GetMyBus ETM service. Commuters get QR tickets, UPI payments & live bus tracking. Owner pays us monthly SaaS fee.",
    tv: "no_tv_etm",
    compute: "etm_standalone",
    gps: "etm_gps",
    net: "etm_sim",
    ticketing: "phone_bt",
    commercialModel: "saas_etm",
  },
];

// ─── BUS OWNER COMMERCIAL PLAN CARDS (FULL AMOUNT & EMI MODELING) ─────────
export type PaymentTerm = "full" | "emi_3" | "emi_6" | "emi_12" | "ad_rent_deduct";

export type PlanCategory = "all" | "etm_only" | "ads_only" | "combo";

export type PlanSortOption =
  | "cost_asc"
  | "cost_desc"
  | "payout_desc"
  | "setup_asc"
  | "savings_desc"
  | "recommended";

export interface BusOwnerPlanCard {
  id: string;
  presetId: string;
  category: "etm_only" | "ads_only" | "combo";
  code: string;
  title: string;
  badge: string;
  badgeColor: string;
  isPopular?: boolean;
  busSuitability: string;
  fullAmount: number;
  setupTime: string;
  icon: string;
  tagline: string;
  hardwareKit: string[];
  ownerReturns: {
    amountLabel: string;
    subtext: string;
    type: "rent" | "revshare" | "saas" | "trial";
  };
  commuterPerks: string[];
  pitch: string;
  tv: TVOption;
  compute: ComputeOption;
  gps: GPSOption;
  net: NetOption;
  ticketing: TicketingOption;
  commercialModel: CommercialModel;
  hardwareReused?: string;
  hardwareSavings?: number;
}

export const BUS_OWNER_PLANS: BusOwnerPlanCard[] = [
  // ─── CATEGORY 1: ONLY ETM PLANS (ZERO TV SCREEN) ───────────────────────────
  {
    id: "plan_saas",
    presetId: "etm_only_saas",
    category: "etm_only",
    code: "PLAN ETM-LITE",
    title: "Mobile ETM Transit SaaS",
    badge: "Zero TV Needed (SaaS)",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    busSuitability: "Operators wanting anti-theft ticketing & live GPS tracking without roof screen hassle",
    fullAmount: 2800,
    setupTime: "10 mins",
    icon: "🎫",
    tagline: "Conductor Smartphone + 58mm Bluetooth Printer",
    hardwareKit: [
      "Conductor Smartphone Ticketing App",
      "58mm Bluetooth High-Speed Thermal Receipt Printer",
      "Built-in GPS telematics telemetry sync",
      "Owner Real-Time Revenue Dashboard App",
    ],
    ownerReturns: {
      amountLabel: "₹899 / month",
      subtext: "SaaS Subscription Fee (Paid by Owner)",
      type: "saas",
    },
    commuterPerks: [
      "Direct UPI payments on bus via dynamic QR",
      "Live bus tracking on GetMyBus passenger app",
      "Instant printed proof of fare receipt",
    ],
    pitch: "Zero TV screen hassle. 100% elimination of conductor fare theft. Real-time collections visible on your phone anytime.",
    tv: "no_tv_etm",
    compute: "etm_standalone",
    gps: "etm_gps",
    net: "etm_sim",
    ticketing: "phone_bt",
    commercialModel: "saas_etm",
    hardwareReused: "No TV screen needed (Operates via crew phone)",
    hardwareSavings: 9350,
  },
  {
    id: "plan_etm_pos",
    presetId: "etm_only_saas",
    category: "etm_only",
    code: "PLAN ETM-PRO",
    title: "Commercial Smart POS SaaS",
    badge: "Heavy-Duty POS (Zero TV)",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    busSuitability: "High-volume private fleets wanting a rugged all-in-one terminal without in-bus screens",
    fullAmount: 14500,
    setupTime: "15 mins",
    icon: "💳",
    tagline: "Sunmi V2s Android 11 Commercial POS Terminal",
    hardwareKit: [
      "Sunmi V2s Commercial Smart POS Terminal",
      "Built-in Seiko 58mm high-speed thermal printer (70mm/s)",
      "Integrated 2D QR Barcode Scanner with flash",
      "Built-in 4G SIM & GPS Telematics Telemetry",
      "Heavy-duty drop-proof silicone protection dock",
    ],
    ownerReturns: {
      amountLabel: "₹1,199 / month",
      subtext: "SaaS Platform Fee (or ₹399/mo lease)",
      type: "saas",
    },
    commuterPerks: [
      "Instant 1-second printed QR fare receipts",
      "Conductor tap-and-pay UPI QR on terminal screen",
      "Real-time GPS vehicle location on passenger app",
    ],
    pitch: "Commercial transit-grade terminal. Drop-tested ruggedness, rapid ticket printing, and live anti-theft revenue auditing.",
    tv: "no_tv_etm",
    compute: "etm_standalone",
    gps: "etm_gps",
    net: "etm_sim",
    ticketing: "sunmi_pos",
    commercialModel: "saas_etm",
    hardwareReused: "No TV screen needed (Commercial POS terminal)",
    hardwareSavings: 9350,
  },

  // ─── CATEGORY 2: ADS ONLY PLANS (SCREEN DOOH, MANUAL CASH TICKETS) ─────────
  {
    id: "plan_alpha",
    presetId: "smart_fast_launch",
    category: "ads_only",
    code: "PLAN ALPHA",
    title: "Smart TV Quick Launch",
    badge: "Fastest 15-Min Setup",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    busSuitability: "Modern private buses with Android Smart TV already mounted",
    fullAmount: 2000,
    setupTime: "15 mins",
    icon: "⚡",
    tagline: "Zero External Box Onboarding",
    hardwareKit: [
      "Player APK autostarts on Smart TV board",
      "u-blox High Sensitivity USB GPS Puck",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Direct vehicle 12V/24V inverter connection",
      "Conductor continues manual cash tickets",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Fixed Rent (or 25% RevShare)",
      type: "rent",
    },
    commuterPerks: [
      "Clean 1080p full-screen passenger signage",
      "Real-time GPS arrival timings at upcoming stops",
      "Live bus location on commuter mobile map",
    ],
    pitch: "Your bus already has a Smart TV. We simply plug in GPS & Dongle. Fastest setup with the lowest upfront investment.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "none",
    commercialModel: "fixed",
    hardwareReused: "Existing Smart Android TV (Built-in SoC & Screen)",
    hardwareSavings: 9350,
  },
  {
    id: "plan_beta",
    presetId: "kerala_standard",
    category: "ads_only",
    code: "PLAN BETA",
    title: "The Kerala Standard",
    badge: "Most Common (~65% Fleet)",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    isPopular: true,
    busSuitability: "Buses with existing 24\" or 32\" Normal In-Bus TV mounted on roof",
    fullAmount: 3850,
    setupTime: "25 mins",
    icon: "🚌",
    tagline: "Standard Normal TV Retrofit Kit",
    hardwareKit: [
      "4G Android TV Box (2GB/16GB Quad-Core)",
      "u-blox High Sensitivity USB GPS Puck",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Heavy-duty mounting harness & HDMI lead",
      "Conductor continues manual cash tickets",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Fixed Rent (or 25% RevShare)",
      type: "rent",
    },
    commuterPerks: [
      "Passenger live route & next-stop screen display",
      "Next-stop audio chimes over bus speakers",
      "Live bus tracking on GetMyBus passenger app",
    ],
    pitch: "Reuses your existing roof TV. 4G box taped behind TV runs ads automatically. You receive guaranteed passive monthly income.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "none",
    commercialModel: "fixed",
    hardwareReused: "Existing Normal In-Bus TV (HDMI/AV ready)",
    hardwareSavings: 7500,
  },
  {
    id: "plan_screen_refit",
    presetId: "full_modernization",
    category: "ads_only",
    code: "PLAN ADS SCREEN-ONLY",
    title: "Bare Bus 32\" Screen Refit",
    badge: "Ads Only (New Screen)",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    busSuitability: "Bare buses wanting monthly ad rent (₹2,500/mo) while crew continues manual paper cash",
    fullAmount: 11350,
    setupTime: "60 mins",
    icon: "🖥️",
    tagline: "New 32\" Screen + Android TV Box (₹0 ETM Capex)",
    hardwareKit: [
      "New 32\" High-Brightness Transit IPS Display",
      "Drop-ceiling reinforced VESA shock mount",
      "150W pure sine wave vehicle power inverter",
      "4G Android TV Box (2GB/16GB) + u-blox GPS Puck",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Conductor continues manual paper tickets (₹0 ETM friction)",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Monthly Ad Rent",
      type: "rent",
    },
    commuterPerks: [
      "Passenger live route & upcoming stop screen",
      "Next-stop audio chimes over bus speakers",
      "Real-time bus tracking on GetMyBus commuter app",
    ],
    pitch: "Turns your bare ceiling into a revenue-generating digital screen. You earn ₹2,500/mo rent while crew continues normal paper tickets.",
    tv: "none",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "none",
    commercialModel: "fixed",
    hardwareReused: "Procures 32\" display panel (Zero ETM friction)",
    hardwareSavings: 14500,
  },
  {
    id: "pilot_zero",
    presetId: "zero_capex_pilot",
    category: "ads_only",
    code: "PILOT ZERO",
    title: "Zero-Capex Day 1 Pilot",
    badge: "100% Free Trial",
    badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    busSuitability: "Hesitant bus owners who want to test the technology for 24-48 hours",
    fullAmount: 0,
    setupTime: "5 mins",
    icon: "🌱",
    tagline: "Risk-Free Route Demonstration",
    hardwareKit: [
      "Smart TV APK running on existing screen",
      "Crew smartphone GPS location sensor",
      "Crew smartphone Wi-Fi hotspot tether",
      "Zero vehicle wiring or screw drilling",
    ],
    ownerReturns: {
      amountLabel: "₹0 Upfront",
      subtext: "24-48 Hour Route Proof of Concept",
      type: "trial",
    },
    commuterPerks: [
      "Verify next-stop announcements on route",
      "Verify live bus tracking on commuter app",
      "Experience passenger ad engagement",
    ],
    pitch: "Try before you invest a single rupee. Verify live ads and commuter tracking on your bus for 24-48 hours with zero obligation.",
    tv: "smart",
    compute: "smart_soc",
    gps: "phone_gps",
    net: "phone_hotspot",
    ticketing: "none",
    commercialModel: "fixed",
    hardwareReused: "Mounted Smart TV + Crew Smartphone",
    hardwareSavings: 18000,
  },

  // ─── CATEGORY 3: ETM + ADS COMBO PLANS (SCREEN ADS + DIGITAL TICKETING) ────
  {
    id: "plan_delta",
    presetId: "smart_bt_etm",
    category: "combo",
    code: "PLAN DELTA",
    title: "Smart TV + Mobile ETM",
    badge: "Smart TV + Digital ETM",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    busSuitability: "Buses with existing Smart Android TV wanting ads rent + conductor digital mobile ticketing",
    fullAmount: 4800,
    setupTime: "20 mins",
    icon: "🖨️",
    tagline: "Smart TV SoC Ads + Conductor Bluetooth ETM",
    hardwareKit: [
      "Smart TV Player APK running directly on TV SoC",
      "u-blox High Sensitivity USB GPS Puck (plugs into TV USB)",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Conductor Android Smartphone with ETM APK",
      "Portable 58mm Belt-Mounted Bluetooth Thermal Receipt Printer",
      "Anti-pilferage digital fare calculator & QR verification",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Fixed Rent + Zero Fare Leakage",
      type: "rent",
    },
    commuterPerks: [
      "Dynamic QR printed paper receipts with UPI tap & pay",
      "Next-stop audio chimes & passenger route screen",
      "Live commuter tracking via TV and mobile app",
    ],
    pitch: "Zero external TV box needed! The ad player runs directly on your Smart TV, combined with conductor Bluetooth thermal mobile ticketing.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
    hardwareReused: "Existing Smart Android TV (Built-in SoC & Screen)",
    hardwareSavings: 9350,
  },
  {
    id: "plan_delta_pro",
    presetId: "smart_sunmi_pos",
    category: "combo",
    code: "PLAN DELTA-PRO",
    title: "Smart TV + Sunmi Smart POS",
    badge: "Flagship Android POS",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    busSuitability: "Buses with existing Smart Android TV wanting commercial Sunmi V2s Android POS terminal with Seiko printer",
    fullAmount: 16500,
    setupTime: "25 mins",
    icon: "💳",
    tagline: "Smart TV SoC Ads + Sunmi V2s Commercial POS",
    hardwareKit: [
      "Smart TV Player APK running directly on TV SoC",
      "u-blox High Sensitivity USB GPS Puck (plugs into TV USB)",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Sunmi V2s Android 11 Commercial Smart POS Terminal",
      "Built-in Seiko 58mm high-speed thermal receipt printer (70mm/s)",
      "Integrated 2D QR Barcode Scanner with flash & tap-and-pay UPI",
      "Anti-pilferage cloud revenue audit & real-time passenger sync",
    ],
    ownerReturns: {
      amountLabel: "₹3,000 / month",
      subtext: "Premium Guaranteed Monthly Rent + Zero Fare Pilferage",
      type: "rent",
    },
    commuterPerks: [
      "Instant 1-second printed QR fare receipts with UPI tap & pay",
      "Next-stop audio announcements & route map on Smart TV",
      "Live commuter tracking via GetMyBus passenger app",
    ],
    pitch: "The flagship digital combo for buses with existing Smart TVs. Direct APK on TV board (₹0 box) plus heavy-duty Sunmi V2s Smart POS terminal with built-in Seiko printer.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
    hardwareReused: "Existing Smart Android TV (Built-in SoC & Screen)",
    hardwareSavings: 9350,
  },
  {
    id: "plan_smart_sync",
    presetId: "smart_ais140",
    category: "combo",
    code: "PLAN SMART-SYNC",
    title: "Smart TV + Existing ETM Sync",
    badge: "Reuses Smart TV & ETM",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    busSuitability: "Buses with existing Smart Android TV whose conductor already operates an electronic ticketing machine",
    fullAmount: 2000,
    setupTime: "15 mins",
    icon: "📡",
    tagline: "Smart TV Signage + Pre-Owned Route ETM Sync",
    hardwareKit: [
      "Smart TV Player APK running directly on TV SoC",
      "u-blox High Sensitivity USB GPS Puck (plugs into TV USB)",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Keeps conductor's existing route ETM machine (Zero crew friction)",
      "Cloud webhook revenue audit & passenger route sync",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Monthly Ad Rent (₹0 ETM Capex)",
      type: "rent",
    },
    commuterPerks: [
      "1080p passenger route map & upcoming stop announcements",
      "Live vehicle GPS tracking on GetMyBus commuter mobile app",
      "Zero interruption to existing printed fare tickets",
    ],
    pitch: "The zero-friction combo. Your bus already has a Smart TV and conductor already has an ETM machine. We only plug in GPS & 4G to start paying you ₹2,500/mo ad rent immediately.",
    tv: "smart",
    compute: "smart_soc",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "existing_etm",
    commercialModel: "fixed",
    hardwareReused: "Smart Android TV + Conductor Route ETM",
    hardwareSavings: 17000,
  },
  {
    id: "plan_beta_plus",
    presetId: "normal_bt_etm",
    category: "combo",
    code: "PLAN BETA-PLUS",
    title: "Normal TV + Mobile ETM",
    badge: "Normal TV + Digital ETM",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    busSuitability: "Buses with existing Normal In-Bus TV wanting both ad rent and mobile paper ticketing",
    fullAmount: 6650,
    setupTime: "35 mins",
    icon: "🚌",
    tagline: "4G Box for Normal TV + Bluetooth Thermal ETM",
    hardwareKit: [
      "4G Android TV Box (2GB/16GB) behind TV screen",
      "u-blox High Sensitivity USB GPS Puck + 4G Dongle",
      "Conductor Android Smartphone with ETM APK",
      "Portable 58mm Belt-Mounted Bluetooth Thermal Receipt Printer",
      "Anti-pilferage digital fare calculator & QR verification",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Fixed Rent + Zero Fare Leakage",
      type: "rent",
    },
    commuterPerks: [
      "Dynamic QR printed paper receipts with UPI",
      "Passenger live route display & next-stop audio chimes",
      "Live bus tracking on GetMyBus commuter app",
    ],
    pitch: "Retrofits your existing Normal TV with our 4G box for ₹2,500/mo ad rent, plus equips the conductor with thermal mobile ticketing to eliminate fare loss.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
    hardwareReused: "Existing Normal In-Bus TV screen (HDMI/AV)",
    hardwareSavings: 7500,
  },
  {
    id: "plan_beta_pro",
    presetId: "normal_sunmi_pos",
    category: "combo",
    code: "PLAN BETA-PRO",
    title: "Normal TV + Sunmi Smart POS",
    badge: "Commercial Normal TV Combo",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    busSuitability: "Buses with existing Normal TV wanting both ad rent and heavy-duty Sunmi V2s POS terminal",
    fullAmount: 18350,
    setupTime: "40 mins",
    icon: "💳",
    tagline: "4G Box for Normal TV + Sunmi V2s Smart POS",
    hardwareKit: [
      "4G Android TV Box (2GB/16GB) behind TV screen",
      "u-blox High Sensitivity USB GPS Puck + 4G Dongle",
      "Sunmi V2s Android 11 Commercial Smart POS Terminal",
      "Built-in Seiko 58mm high-speed thermal receipt printer (70mm/s)",
      "Integrated 2D QR Barcode Scanner with flash & tap-and-pay UPI",
      "Anti-pilferage cloud revenue audit & real-time passenger sync",
    ],
    ownerReturns: {
      amountLabel: "₹3,000 / month",
      subtext: "Premium Guaranteed Monthly Rent + Zero Fare Pilferage",
      type: "rent",
    },
    commuterPerks: [
      "Instant 1-second printed QR fare receipts with UPI",
      "Passenger live route display & next-stop audio chimes",
      "Live bus tracking on GetMyBus commuter app",
    ],
    pitch: "Retrofits your existing Normal TV with our 4G box for ad rent, plus equips the conductor with the commercial Sunmi V2s Smart POS terminal.",
    tv: "normal",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
    hardwareReused: "Existing Normal In-Bus TV screen (HDMI/AV)",
    hardwareSavings: 7500,
  },
  {
    id: "plan_ais140",
    presetId: "ais140_sync",
    category: "combo",
    code: "PLAN AIS-140",
    title: "Govt AIS-140 GPS Sync",
    badge: "Zero-Wiring GPS Sync",
    badgeColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    busSuitability: "Regulated town & state private buses already equipped with mandatory AIS-140 GPS",
    fullAmount: 3100,
    setupTime: "20 mins",
    icon: "📡",
    tagline: "Reuses Mandatory Govt GPS & Current ETM",
    hardwareKit: [
      "4G Android 12 TV Box (2GB/16GB) behind TV",
      "Cloud API integration with mandatory AIS-140 GPS",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Keeps conductor's existing route ETM machine",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Monthly Ad Rent",
      type: "rent",
    },
    commuterPerks: [
      "Govt-grade real-time vehicle GPS tracking",
      "Next-stop audio chimes over bus speakers",
      "Passenger live route arrivals on GetMyBus app",
    ],
    pitch: "Reuses your bus's mandated government AIS-140 GPS box and pre-owned ticketing machine. Fast and zero-hassle.",
    tv: "normal",
    compute: "android_box",
    gps: "ais140",
    net: "dongle",
    ticketing: "existing_etm",
    commercialModel: "fixed",
    hardwareReused: "Govt AIS-140 GPS + Existing Route ETM + In-Bus TV",
    hardwareSavings: 16250,
  },
  {
    id: "plan_combo_lite",
    presetId: "turnkey_lite",
    category: "combo",
    code: "PLAN COMBO-LITE",
    title: "Turnkey Screen + Mobile ETM",
    badge: "Budget Bare Bus Combo",
    badgeColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    busSuitability: "Bare buses wanting BOTH passenger screen ads AND digital ticketing without spending ₹26k",
    fullAmount: 14150,
    setupTime: "75 mins",
    icon: "✨",
    tagline: "32\" Screen Ads + Bluetooth Thermal ETM",
    hardwareKit: [
      "New 32\" Transit Display + Drop Mount + Inverter",
      "4G Android TV Box + u-blox GPS + 4G Dongle",
      "Conductor Android Smartphone with ETM APK",
      "58mm Belt-Mounted Bluetooth Thermal Receipt Printer",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Ad Rent + Zero Fare Pilferage",
      type: "rent",
    },
    commuterPerks: [
      "Large 32\" passenger entertainment & route display",
      "Dynamic QR printed paper receipts with UPI",
      "Live bus tracking on GetMyBus passenger app",
    ],
    pitch: "The budget complete modernization. You get a brand new 32\" screen for ad rent plus conductor mobile ticketing to eliminate theft.",
    tv: "none",
    compute: "android_box",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
    hardwareReused: "Procures 32\" screen with budget mobile printer",
    hardwareSavings: 11700,
  },
  {
    id: "plan_smart_turnkey",
    presetId: "smart_turnkey_combo",
    category: "combo",
    code: "PLAN SMART-TURNKEY",
    title: "Turnkey 32\" Smart TV + Mobile ETM",
    badge: "All-in-One Smart Screen",
    badgeColor: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    busSuitability: "Bare buses wanting an All-in-One 32\" Smart Android TV (no external TV box) plus digital conductor ticketing",
    fullAmount: 13550,
    setupTime: "60 mins",
    icon: "🌟",
    tagline: "32\" Smart Android TV + Bluetooth Thermal ETM",
    hardwareKit: [
      "New 32\" Smart Android TV (Built-in Quad-Core CPU & Wi-Fi)",
      "Drop-ceiling reinforced VESA shock mount & 150W inverter",
      "u-blox High Sensitivity USB GPS Puck (plugs into TV USB)",
      "4G LTE High-Speed Wi-Fi Dongle",
      "Conductor Android Smartphone with ETM APK",
      "Portable 58mm Belt-Mounted Bluetooth Thermal Receipt Printer",
    ],
    ownerReturns: {
      amountLabel: "₹2,500 / month",
      subtext: "Guaranteed Fixed Rent + Zero Fare Pilferage",
      type: "rent",
    },
    commuterPerks: [
      "Crisp 1080p passenger entertainment & upcoming stop display",
      "Dynamic QR printed paper receipts with UPI tap & pay",
      "Real-time GPS vehicle location on GetMyBus commuter app",
    ],
    pitch: "Clean all-in-one screen installation. A brand new 32\" Smart Android TV eliminates the messy external TV box, paired with mobile thermal ticketing for complete route modernization.",
    tv: "none",
    compute: "new_smart_tv",
    gps: "usb_puck",
    net: "dongle",
    ticketing: "phone_bt",
    commercialModel: "fixed",
    hardwareReused: "Procures 32\" Smart TV (Built-in compute saves external box)",
    hardwareSavings: 11850,
  },
  {
    id: "plan_gamma",
    presetId: "full_modernization",
    category: "combo",
    code: "PLAN GAMMA",
    title: "Turnkey Modernization (Sunmi POS)",
    badge: "Enterprise Bare Bus Combo",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    busSuitability: "Newly built or bare buses wanting commercial-grade screen + Sunmi Smart POS",
    fullAmount: 26850,
    setupTime: "90 mins",
    icon: "👑",
    tagline: "32\" Display + SinoTrack 4G + Sunmi V2s POS",
    hardwareKit: [
      "New 32\" High-Brightness Transit IPS Display",
      "Drop-ceiling reinforced VESA shock mount",
      "150W pure sine wave vehicle power inverter",
      "SinoTrack ST-901L 4G Hardwired Automotive GPS",
      "Sunmi V2s Android 11 All-in-One Smart POS",
    ],
    ownerReturns: {
      amountLabel: "₹3,000 / month",
      subtext: "Premium Guaranteed Monthly Rent",
      type: "rent",
    },
    commuterPerks: [
      "Commercial-grade high-visibility passenger TV",
      "Fast Sunmi POS thermal ticketing & UPI scanner",
      "Always-on 24/7 hardwired battery GPS tracking",
    ],
    pitch: "A comprehensive turnkey digital upgrade. We handle the 32\" screen mount, hardwired wiring, and commercial POS deployment.",
    tv: "none",
    compute: "android_box",
    gps: "sinotrack",
    net: "dongle",
    ticketing: "sunmi_pos",
    commercialModel: "fixed",
    hardwareReused: "None (Turnkey installation for bare buses)",
    hardwareSavings: 0,
  },
];

export const getPresetCapex = (preset: FleetPreset): number => {
  const matched = BUS_OWNER_PLANS.find(
    (p) =>
      p.presetId === preset.id ||
      (p.tv === preset.tv &&
        p.compute === preset.compute &&
        p.gps === preset.gps &&
        p.net === preset.net &&
        p.ticketing === preset.ticketing &&
        p.commercialModel === preset.commercialModel)
  );
  if (matched) return matched.fullAmount;

  const tvCost = preset.compute === "new_smart_tv" ? 0 : (TV_OPTIONS.find((t) => t.id === preset.tv)?.cost || 0);
  const computeCost = COMPUTE_OPTIONS.find((c) => c.id === preset.compute)?.cost || 0;
  const gpsCost = GPS_OPTIONS.find((g) => g.id === preset.gps)?.cost || 0;
  const netCost = NET_OPTIONS.find((n) => n.id === preset.net)?.cost || 0;
  const ticketingCost = TICKETING_OPTIONS.find((t) => t.id === preset.ticketing)?.cost || 0;
  return tvCost + computeCost + gpsCost + netCost + ticketingCost;
};

export const getPlanPricing = (plan: BusOwnerPlanCard, term: PaymentTerm) => {
  if (plan.fullAmount === 0) {
    return {
      mainAmount: "₹0",
      periodLabel: "100% Free",
      detail: "Zero Capex • Free 24-48hr Route Trial",
      netRentPill: "Risk-Free Demo Trial",
    };
  }

  if (term === "full") {
    return {
      mainAmount: `₹${plan.fullAmount.toLocaleString()}`,
      periodLabel: "One-Time Upfront",
      detail: "Full hardware equipment ownership",
      netRentPill:
        plan.commercialModel === "saas_etm"
          ? "₹899/mo SaaS software fee (Zero Owner Payout)"
          : "Earn full ₹2,500/mo guaranteed rent from Day 1",
    };
  }

  if (term === "emi_3") {
    const monthlyEmi = Math.round(plan.fullAmount / 3);
    const netPayout = 2500 - monthlyEmi;
    return {
      mainAmount: `₹${monthlyEmi.toLocaleString()}`,
      periodLabel: "/ mo (3 Months EMI)",
      detail: `3 monthly payments of ₹${monthlyEmi.toLocaleString()} (0% Interest)`,
      netRentPill:
        plan.commercialModel === "saas_etm"
          ? `₹${monthlyEmi.toLocaleString()}/mo hardware EMI + ₹899/mo SaaS`
          : `Deduct from rent ➔ Net owner cash: +₹${netPayout.toLocaleString()}/mo from Month 1`,
    };
  }

  if (term === "emi_6") {
    const monthlyEmi = Math.round(plan.fullAmount / 6);
    const netPayout = 2500 - monthlyEmi;
    return {
      mainAmount: `₹${monthlyEmi.toLocaleString()}`,
      periodLabel: "/ mo (6 Months EMI)",
      detail: `6 monthly payments of ₹${monthlyEmi.toLocaleString()}`,
      netRentPill:
        plan.commercialModel === "saas_etm"
          ? `₹${monthlyEmi.toLocaleString()}/mo hardware EMI + ₹899/mo SaaS`
          : `Deduct from rent ➔ Net owner cash: +₹${netPayout.toLocaleString()}/mo from Month 1`,
    };
  }

  if (term === "emi_12") {
    const monthlyEmi = Math.round(plan.fullAmount / 12);
    const netPayout = 2500 - monthlyEmi;
    return {
      mainAmount: `₹${monthlyEmi.toLocaleString()}`,
      periodLabel: "/ mo (12 Months EMI)",
      detail: `12 micro-installments of ₹${monthlyEmi.toLocaleString()}`,
      netRentPill:
        plan.commercialModel === "saas_etm"
          ? `₹${monthlyEmi.toLocaleString()}/mo hardware EMI + ₹899/mo SaaS`
          : `Deduct from rent ➔ Net owner cash: +₹${netPayout.toLocaleString()}/mo from Month 1`,
    };
  }

  // ad_rent_deduct: Deduct from Monthly Ad Rent (₹0 Out-of-Pocket!)
  const monthlyDeduction = Math.round(plan.fullAmount / 3);
  const netOwnerRent = Math.max(0, 2500 - monthlyDeduction);
  return {
    mainAmount: "₹0 Upfront",
    periodLabel: "(Auto-Deducted from Ad Rent)",
    detail: `₹${monthlyDeduction.toLocaleString()}/mo deducted from ₹2,500 ad rent for 3 months`,
    netRentPill:
      plan.commercialModel === "saas_etm"
        ? "Hardware supplied as Device-as-a-Service rental"
        : `Net owner cash in bank: +₹${netOwnerRent.toLocaleString()}/mo from Month 1!`,
  };
};

// ─── HARDWARE DEVICES SPECIFICATION & SVG BREAKDOWN ──────────────────────────
export interface PlanDeviceSpec {
  id: "screen" | "player" | "gps" | "network" | "ticketing";
  categoryLabel: string;
  name: string;
  spec: string;
  subtext: string;
  status: "included" | "reused" | "not_included";
  statusText: string;
}

export const getPlanDeviceSpecs = (plan: BusOwnerPlanCard): PlanDeviceSpec[] => {
  const devices: PlanDeviceSpec[] = [];

  // 1. TRANSIT DISPLAY SCREEN
  if (plan.compute === "new_smart_tv") {
    devices.push({
      id: "screen",
      categoryLabel: "Transit Screen",
      name: "32\" Smart Android TV",
      spec: "Commercial All-in-One Smart Display",
      subtext: "Includes ceiling drop mount & 150W vehicle inverter",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else if (plan.tv === "none") {
    if (plan.category === "etm_only") {
      devices.push({
        id: "screen",
        categoryLabel: "Transit Screen",
        name: "No Screen Needed",
        spec: "Zero In-Bus TV Hardware",
        subtext: "Conductor handheld operations strictly",
        status: "not_included",
        statusText: "✕ Not Needed",
      });
    } else {
      devices.push({
        id: "screen",
        categoryLabel: "Transit Screen",
        name: "32\" Transit IPS Display",
        spec: "Commercial High-Bright Screen + Shock Mount",
        subtext: "Includes 150W vehicle inverter & ceiling mount",
        status: "included",
        statusText: "✓ Included in Kit",
      });
    }
  } else if (plan.tv === "normal") {
    devices.push({
      id: "screen",
      categoryLabel: "Transit Screen",
      name: "Existing Roof TV (Reused)",
      spec: "Normal In-Bus Screen (HDMI/AV ready)",
      subtext: "Reuses roof screen • Saves ₹7,500 capex",
      status: "reused",
      statusText: "♻️ Reused (Saved ₹7.5k)",
    });
  } else if (plan.tv === "smart") {
    devices.push({
      id: "screen",
      categoryLabel: "Transit Screen",
      name: "Existing Smart Android TV",
      spec: "Mounted Smart Transit Display",
      subtext: "Reuses TV screen • Saves ₹7,500 capex",
      status: "reused",
      statusText: "♻️ Reused (Saved ₹7.5k)",
    });
  } else {
    devices.push({
      id: "screen",
      categoryLabel: "Transit Screen",
      name: "No Screen Needed",
      spec: "Zero Display Hardware",
      subtext: "Dedicated strictly to anti-theft ticketing & GPS",
      status: "not_included",
      statusText: "✕ Not Needed",
    });
  }

  // 2. MEDIA PLAYER / COMPUTE
  if (plan.compute === "new_smart_tv") {
    devices.push({
      id: "player",
      categoryLabel: "Media Player",
      name: "Smart TV Built-in Quad-Core SoC",
      spec: "Integrated Android OS on TV Board",
      subtext: "All-in-one TV motherboard • No external box needed",
      status: "included",
      statusText: "✓ Built into Smart TV",
    });
  } else if (plan.tv === "smart") {
    devices.push({
      id: "player",
      categoryLabel: "Media Player",
      name: "Smart TV Built-in SoC",
      spec: "Signage APK Direct on TV Motherboard",
      subtext: "Zero external box needed • Saves ₹1,850 capex",
      status: "reused",
      statusText: "♻️ Reused TV SoC",
    });
  } else if (plan.compute === "android_box") {
    devices.push({
      id: "player",
      categoryLabel: "Media Player",
      name: "4G Android 12 TV Box",
      spec: "2GB RAM / 16GB ROM Quad-Core",
      subtext: "Heavy-duty anti-vibration mount taped behind TV",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else {
    devices.push({
      id: "player",
      categoryLabel: "Media Player",
      name: "No External Box",
      spec: "Zero Media Player Hardware",
      subtext: "Operates via POS/conductor phone without TV box",
      status: "not_included",
      statusText: "✕ Not Needed",
    });
  }

  // 3. GPS TELEMATICS TRACKER
  if (plan.gps === "phone_gps") {
    devices.push({
      id: "gps",
      categoryLabel: "GPS Telematics",
      name: "Crew Smartphone GPS",
      spec: "Phone Location Sensor Tether",
      subtext: "Reused via hotspot • 24hr risk-free trial",
      status: "reused",
      statusText: "♻️ Reused Phone GPS",
    });
  } else if (plan.gps === "ais140") {
    devices.push({
      id: "gps",
      categoryLabel: "GPS Telematics",
      name: "Govt AIS-140 GPS Unit",
      spec: "Mandatory State Telematics Bridge",
      subtext: "Cloud API telemetry sync • Saved ₹3,500 capex",
      status: "reused",
      statusText: "♻️ Reused Govt GPS",
    });
  } else if (plan.gps === "sinotrack") {
    devices.push({
      id: "gps",
      categoryLabel: "GPS Telematics",
      name: "SinoTrack ST-901L 4G GPS",
      spec: "Hardwired 9V-30V Automotive Unit",
      subtext: "Internal backup battery & live ignition sync",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else if (plan.gps === "etm_gps") {
    devices.push({
      id: "gps",
      categoryLabel: "GPS Telematics",
      name: "Internal ETM Telematics GPS",
      spec: "Handheld Integrated Location Chip",
      subtext: "Broadcasts live bus coordinates while ticketing",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else {
    devices.push({
      id: "gps",
      categoryLabel: "GPS Telematics",
      name: "u-blox USB GPS Puck",
      spec: "High-Sensitivity Transit GPS Sensor",
      subtext: "Cold-lock in 26s • Plugs into USB port",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  }

  // 4. 4G IN-BUS CONNECTIVITY
  if (plan.net === "phone_hotspot") {
    devices.push({
      id: "network",
      categoryLabel: "4G Connectivity",
      name: "Crew Phone Wi-Fi Hotspot",
      spec: "Zero Dedicated Modem Capex",
      subtext: "Conductor tethers hotspot during route run",
      status: "reused",
      statusText: "♻️ Reused Phone Hotspot",
    });
  } else if (plan.net === "etm_sim") {
    devices.push({
      id: "network",
      categoryLabel: "4G Connectivity",
      name: "Internal M2M 4G SIM",
      spec: "Multi-Operator Roaming Cellular SIM",
      subtext: "Direct cellular connectivity inside POS terminal",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else {
    devices.push({
      id: "network",
      categoryLabel: "4G Connectivity",
      name: "4G LTE Wi-Fi USB Dongle",
      spec: "High-Speed 150 Mbps Cellular Modem",
      subtext: "Auto-APN & persistent reconnect via USB",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  }

  // 5. TICKETING SUBSYSTEM
  if (plan.ticketing === "none") {
    devices.push({
      id: "ticketing",
      categoryLabel: "Ticketing & POS",
      name: "Manual Cash Paper Tickets",
      spec: "No Digital Terminal Included",
      subtext: "Conductor continues manual cash bag (₹0 crew friction)",
      status: "not_included",
      statusText: "✕ Not Included (Cash)",
    });
  } else if (plan.ticketing === "existing_etm") {
    devices.push({
      id: "ticketing",
      categoryLabel: "Ticketing & POS",
      name: "Existing Route ETM Machine",
      spec: "Pre-Owned Conductor ETM Terminal",
      subtext: "Reused pre-owned route ETM • Saved ~₹14,500 capex",
      status: "reused",
      statusText: "♻️ Reused Route ETM",
    });
  } else if (plan.ticketing === "phone_bt") {
    devices.push({
      id: "ticketing",
      categoryLabel: "Ticketing & POS",
      name: "Conductor Phone + BT Printer",
      spec: "58mm Wireless Thermal Receipt Printer",
      subtext: "Prints dynamic QR paper tickets + Conductor APK",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  } else if (plan.ticketing === "sunmi_pos") {
    devices.push({
      id: "ticketing",
      categoryLabel: "Ticketing & POS",
      name: "Sunmi V2s Android Smart POS",
      spec: "All-in-One Commercial Transit Terminal",
      subtext: "Built-in Seiko 58mm printer + 2D QR scanner + 4G",
      status: "included",
      statusText: "✓ Included in Kit",
    });
  }

  return devices;
};

export const DeviceSvgIcon: React.FC<{
  type: "screen" | "player" | "gps" | "network" | "ticketing";
  status: "included" | "reused" | "not_included";
  className?: string;
}> = ({ type, status, className = "w-5 h-5" }) => {
  if (type === "screen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="3" width="20" height="13" rx="2" />
        <path d="M7 9.5l3-2.5 4 4.5 4-3.5" strokeWidth="1.4" opacity="0.85" />
        <path d="M8 21h8" />
        <path d="M12 16v5" />
        {status === "not_included" && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (type === "player") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <path d="M7 6V2.5" />
        <path d="M17 6V2.5" />
        <circle cx="7.5" cy="12" r="1.2" fill="currentColor" />
        <circle cx="11.5" cy="12" r="1.2" fill="currentColor" />
        <path d="M15.5 12h2.5" strokeWidth="1.5" />
        {status === "not_included" && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (type === "gps") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.65" />
        <path d="M12 6a6 6 0 0 1 6 6" />
        <path d="M12 22a10 10 0 0 1-10-10" opacity="0.65" />
        <path d="M12 18a6 6 0 0 1-6-6" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        {status === "not_included" && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (type === "network") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="8" y="3" width="8" height="13" rx="2" />
        <rect x="10" y="16" width="4" height="5" rx="1" />
        <path d="M4 7a10 10 0 0 1 0-4" opacity="0.65" />
        <path d="M20 7a10 10 0 0 0 0-4" opacity="0.65" />
        <path d="M5.5 11a6 6 0 0 1 0-3" />
        <path d="M18.5 11a6 6 0 0 0 0-3" />
        <circle cx="12" cy="9.5" r="1.2" fill="currentColor" />
        {status === "not_included" && (
          <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  // ticketing
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M8 4V1h8v3" strokeWidth="1.4" />
      <rect x="8" y="7" width="8" height="6.5" rx="1" strokeWidth="1.2" opacity="0.9" />
      <path d="M10 9h1.5v1.5H10zM12.5 9h1.5v1.5H12.5zM10 11.5h4" strokeWidth="1.2" />
      <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
      {status === "not_included" && (
        <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
};

export default function BusOwnerPlansFlow({ theme = "dark" }: BusOwnerPlansFlowProps) {
  const isLight = theme === "light";

  // ─── USER SELECTIONS IN DECISION TREE ────────────────────────────────────────
  const [selectedTV, setSelectedTV] = useState<TVOption>("normal");
  const [selectedCompute, setSelectedCompute] = useState<ComputeOption>("android_box");
  const [selectedGPS, setSelectedGPS] = useState<GPSOption>("usb_puck");
  const [selectedNet, setSelectedNet] = useState<NetOption>("dongle");
  const [selectedTicketing, setSelectedTicketing] = useState<TicketingOption>("none");

  // ─── HARDWARE PROCUREMENT BRAND OVERRIDES & CUSTOM PRICING STATE ─────────────
  const [selectedBrandOverrides, setSelectedBrandOverrides] = useState<Record<string, string>>({});
  const [customItemOverrides, setCustomItemOverrides] = useState<Record<string, CustomSpecOverride>>({});
  const [activeProcurementModal, setActiveProcurementModal] = useState<string | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<"brands" | "edit">("brands");

  // Custom Edit Form State
  const [customEditPrice, setCustomEditPrice] = useState<string>("");
  const [customEditBrand, setCustomEditBrand] = useState<string>("");
  const [customEditModel, setCustomEditModel] = useState<string>("");
  const [customEditUrl, setCustomEditUrl] = useState<string>("");
  const [customEditNote, setCustomEditNote] = useState<string>("");
  const [customEditSuccess, setCustomEditSuccess] = useState<boolean>(false);

  // Active Preset detection
  const activePresetId = useMemo(() => {
    const matched = FLEET_PRESETS.find(
      (p) =>
        p.tv === selectedTV &&
        p.compute === selectedCompute &&
        p.gps === selectedGPS &&
        p.net === selectedNet &&
        p.ticketing === selectedTicketing
    );
    return matched ? matched.id : "custom";
  }, [selectedTV, selectedCompute, selectedGPS, selectedNet, selectedTicketing]);

  const applyPreset = (preset: FleetPreset) => {
    playClickSound();
    setSelectedTV(preset.tv);
    setSelectedCompute(preset.compute);
    setSelectedGPS(preset.gps);
    setSelectedNet(preset.net);
    setSelectedTicketing(preset.ticketing);
    setPayoutType(preset.commercialModel);
  };

  // Bus Owner Plan Selection & Financing State
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>("ad_rent_deduct");

  const applyPlan = (plan: BusOwnerPlanCard) => {
    playSuccessChime();
    setSelectedTV(plan.tv);
    setSelectedCompute(plan.compute);
    setSelectedGPS(plan.gps);
    setSelectedNet(plan.net);
    setSelectedTicketing(plan.ticketing);
    setPayoutType(plan.commercialModel);
    if (plan.id === "plan_etm_pos") {
      setSaasMonthlyFee(1199);
    } else if (plan.id === "plan_saas") {
      setSaasMonthlyFee(899);
    }
    // Ensure this plan is visible in the cards list
    if (selectedCategory !== "all" && selectedCategory !== plan.category) {
      setSelectedCategory("all");
    }
  };

  // Navigation View Mode ("packages" = Turnkey Packages Catalog, "builder" = Hardware Studio 5 Stages, "agreement" = Printable Handover Agreement, "all" = Full Single Page Flow)
  const [viewMode, setViewMode] = useState<"packages" | "builder" | "agreement" | "all">("packages");
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);

  // Hardware Devices Breakdown Dropdown State (Per-Card & Global)
  const [expandedHardwareCards, setExpandedHardwareCards] = useState<Record<string, boolean>>({});
  const [areAllDevicesExpanded, setAreAllDevicesExpanded] = useState<boolean>(false);

  const toggleHardwareBreakdown = (planId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound();
    setExpandedHardwareCards((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const toggleAllHardwareBreakdowns = () => {
    playClickSound();
    const nextState = !areAllDevicesExpanded;
    setAreAllDevicesExpanded(nextState);
    const updated: Record<string, boolean> = {};
    BUS_OWNER_PLANS.forEach((p) => {
      updated[p.id] = nextState;
    });
    setExpandedHardwareCards(updated);
  };

  const inspectPlanInStudio = (plan: BusOwnerPlanCard) => {
    applyPlan(plan);
    setViewMode("builder");
    setTimeout(() => {
      const el = document.getElementById("hardware-studio-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const viewMatchingPackage = () => {
    playClickSound();
    setViewMode("packages");
    setTimeout(() => {
      const el = document.getElementById("fleet-packages-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Bus Owner Plan Category Filter State (Only ETM | Ads Only | ETM + Ads Combo)
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>("all");

  // Bus Owner Hardware Status Filter State
  const [hardwareScreenFilter, setHardwareScreenFilter] = useState<TVOption | "all">("all");
  const [hardwareTicketingFilter, setHardwareTicketingFilter] = useState<"all" | "tickets" | "etm">("all");
  const [hardwareGoalFilter, setHardwareGoalFilter] = useState<"all" | "rent" | "saas" | "trial">("all");
  const [quickFilterChip, setQuickFilterChip] = useState<string>("all");
  const [planSortOption, setPlanSortOption] = useState<PlanSortOption>("cost_asc");

  const resetHardwareFilters = () => {
    playClickSound();
    setSelectedCategory("all");
    setHardwareScreenFilter("all");
    setHardwareTicketingFilter("all");
    setHardwareGoalFilter("all");
    setQuickFilterChip("all");
    setPlanSortOption("cost_asc");
  };

  const handleQuickFilter = (chipId: string) => {
    playClickSound();
    setQuickFilterChip(chipId);
    if (chipId === "all") {
      setSelectedCategory("all");
      setHardwareScreenFilter("all");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "normal_tv") {
      setSelectedCategory("all");
      setHardwareScreenFilter("normal");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "smart_tv") {
      setSelectedCategory("all");
      setHardwareScreenFilter("smart");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "no_tv") {
      setSelectedCategory("all");
      setHardwareScreenFilter("none");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "etm_only") {
      setSelectedCategory("etm_only");
      setHardwareScreenFilter("all");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "with_etm") {
      setSelectedCategory("all");
      setHardwareScreenFilter("all");
      setHardwareTicketingFilter("etm");
      setHardwareGoalFilter("all");
    } else if (chipId === "ais140") {
      setSelectedCategory("all");
      setHardwareScreenFilter("normal");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("all");
    } else if (chipId === "trial") {
      setSelectedCategory("all");
      setHardwareScreenFilter("all");
      setHardwareTicketingFilter("all");
      setHardwareGoalFilter("trial");
    }
  };

  const filteredPlans = useMemo(() => {
    const list = BUS_OWNER_PLANS.filter((plan) => {
      // 1. Primary Category Filter
      if (selectedCategory !== "all" && plan.category !== selectedCategory) {
        return false;
      }

      if (quickFilterChip === "ais140" && plan.gps !== "ais140") return false;
      if (quickFilterChip === "trial" && plan.id !== "pilot_zero") return false;

      // 2. Screen filter
      if (hardwareScreenFilter === "none") {
        // A bus with No TV can either:
        // - Pick an ETM-only plan (zero screen needed, conductor phone / Sunmi POS)
        // - Procure a new 32" screen refit (plan.tv === "none")
        if (plan.category !== "etm_only" && plan.tv !== "none") return false;
      } else if (hardwareScreenFilter === "no_tv_etm") {
        if (plan.category !== "etm_only") return false;
      } else if (hardwareScreenFilter !== "all" && plan.tv !== hardwareScreenFilter) {
        return false;
      }

      // 3. Ticketing filter (Bus Starting Hardware Status)
      if (hardwareTicketingFilter === "tickets") {
        // Bus currently uses manual paper tickets and wants to upgrade.
        // Valid upgrades: Ads-only screen refits (keeps paper cash), digital ETM kits (phone_bt / sunmi_pos), or combos.
        // Excludes packages that require the bus to ALREADY possess a pre-existing route ETM machine (plan.ticketing === "existing_etm").
        if (plan.ticketing === "existing_etm") return false;
      } else if (hardwareTicketingFilter === "etm") {
        // Bus currently already has an electronic ticket machine on route.
        // Valid plans: Reusing pre-owned ETM (existing_etm), adding TV ads without changing ETM (none), or replacing old ETM with commercial POS (sunmi_pos).
        if (plan.ticketing === "phone_bt") return false;
      }

      // 4. Commercial goal filter
      if (hardwareGoalFilter === "rent" && plan.commercialModel === "saas_etm") {
        return false;
      }
      if (hardwareGoalFilter === "saas" && plan.commercialModel !== "saas_etm") {
        return false;
      }
      if (hardwareGoalFilter === "trial" && plan.ownerReturns.type !== "trial") {
        return false;
      }

      return true;
    });

    // 5. Apply Factor-based Sorting
    return list.sort((a, b) => {
      if (planSortOption === "cost_asc") {
        if (a.fullAmount !== b.fullAmount) {
          return a.fullAmount - b.fullAmount;
        }
        return a.code.localeCompare(b.code);
      }

      if (planSortOption === "cost_desc") {
        if (a.fullAmount !== b.fullAmount) {
          return b.fullAmount - a.fullAmount;
        }
        return a.code.localeCompare(b.code);
      }

      if (planSortOption === "payout_desc") {
        const getRentVal = (p: BusOwnerPlanCard) => {
          if (p.commercialModel === "saas_etm") return -1;
          const m = p.ownerReturns.amountLabel.match(/₹([\d,]+)/);
          return m ? parseInt(m[1].replace(/,/g, "")) : 0;
        };
        const diff = getRentVal(b) - getRentVal(a);
        if (diff !== 0) return diff;
        return a.fullAmount - b.fullAmount;
      }

      if (planSortOption === "setup_asc") {
        const getMinutes = (p: BusOwnerPlanCard) => parseInt(p.setupTime) || 30;
        const diff = getMinutes(a) - getMinutes(b);
        if (diff !== 0) return diff;
        return a.fullAmount - b.fullAmount;
      }

      if (planSortOption === "savings_desc") {
        const diff = (b.hardwareSavings || 0) - (a.hardwareSavings || 0);
        if (diff !== 0) return diff;
        return a.fullAmount - b.fullAmount;
      }

      // "recommended" preserves the default catalog curated sequence
      return BUS_OWNER_PLANS.indexOf(a) - BUS_OWNER_PLANS.indexOf(b);
    });
  }, [selectedCategory, hardwareScreenFilter, hardwareTicketingFilter, hardwareGoalFilter, quickFilterChip, planSortOption]);

  // Fleet Multiplier Slider
  const [fleetCount, setFleetCount] = useState<number>(5);

  // Commercial Model
  const [payoutType, setPayoutType] = useState<CommercialModel>("fixed");
  const [fixedMonthlyRent, setFixedMonthlyRent] = useState<number>(2500); // ₹2500 / bus
  const [revSharePct, setRevSharePct] = useState<number>(25); // 25% of ad collections
  const [estimatedMonthlyAdGross, setEstimatedMonthlyAdGross] = useState<number>(18000); // ₹18,000 / bus

  // ETM SaaS Service Model (Owner Pays Us!)
  const [saasMonthlyFee, setSaasMonthlyFee] = useState<number>(899); // ₹899 / bus / mo paid by owner
  const [saasHardwareFunding, setSaasHardwareFunding] = useState<"owner_buys" | "hardware_lease">("owner_buys");
  const [hardwareLeaseFee] = useState<number>(399); // ₹399 / bus / mo hardware lease

  // Smart Auto-Inference when TV Selection changes
  const handleTVSelect = (tv: TVOption) => {
    playClickSound();
    setSelectedTV(tv);
    if (tv === "smart") {
      setSelectedCompute("smart_soc");
      if (payoutType === "saas_etm") setPayoutType("fixed");
    } else if (tv === "normal") {
      setSelectedCompute("android_box");
      if (payoutType === "saas_etm") setPayoutType("fixed");
    } else if (tv === "no_tv_etm") {
      setSelectedCompute("etm_standalone");
      setSelectedGPS("etm_gps");
      setSelectedNet("etm_sim");
      if (selectedTicketing === "none") {
        setSelectedTicketing("phone_bt");
      }
      setPayoutType("saas_etm");
    } else {
      setSelectedCompute("new_smart_tv");
      if (payoutType === "saas_etm") setPayoutType("fixed");
    }
  };

  // ─── PROCUREMENT HELPERS & REAL-TIME OVERRIDES ──────────────────────────────
  const getComponentProcurement = (
    subsystemKey: string | undefined,
    fallbackCost: number,
    fallbackTitle: string,
    needsProcurement: boolean
  ) => {
    if (!needsProcurement || !subsystemKey || !HARDWARE_BRANDS_DB[subsystemKey]) {
      return {
        needsProcurement: false,
        brandKey: subsystemKey,
        subsystemTitle: fallbackTitle,
        brand: "Pre-Installed / Reused",
        model: fallbackTitle,
        unitPrice: fallbackCost,
        amazonUrl: "",
        isCustom: false,
        isBestChoice: false,
        rating: 5.0,
        reviews: 0,
        bestReason: "Pre-Installed / Integrated (₹0 Capex)",
        specs: [] as string[],
        customNote: "",
        options: [] as HardwareBrandOption[],
      };
    }

    const dbEntry = HARDWARE_BRANDS_DB[subsystemKey];
    const defaultOption = dbEntry.options.find((o) => o.isBestChoice) || dbEntry.options[0];
    const customOverride = customItemOverrides[subsystemKey];
    const selectedBrandId = selectedBrandOverrides[subsystemKey];
    const selectedBrandOption = selectedBrandId
      ? dbEntry.options.find((o) => o.id === selectedBrandId) || defaultOption
      : defaultOption;

    if (customOverride) {
      return {
        needsProcurement: true,
        brandKey: subsystemKey,
        subsystemTitle: dbEntry.title,
        brand: customOverride.brand || selectedBrandOption.brand,
        model: customOverride.model || selectedBrandOption.model,
        unitPrice: customOverride.price !== undefined ? customOverride.price : selectedBrandOption.price,
        amazonUrl: customOverride.amazonUrl !== undefined ? customOverride.amazonUrl : selectedBrandOption.amazonUrl,
        isCustom: true,
        isBestChoice: false,
        rating: selectedBrandOption.rating,
        reviews: selectedBrandOption.reviews,
        bestReason: customOverride.customNote || "Custom Supplier / User Override",
        specs: selectedBrandOption.specs,
        customNote: customOverride.customNote || "",
        options: dbEntry.options,
      };
    }

    return {
      needsProcurement: true,
      brandKey: subsystemKey,
      subsystemTitle: dbEntry.title,
      brand: selectedBrandOption.brand,
      model: selectedBrandOption.model,
      unitPrice: selectedBrandOption.price,
      amazonUrl: selectedBrandOption.amazonUrl,
      isCustom: false,
      isBestChoice: selectedBrandOption.isBestChoice,
      rating: selectedBrandOption.rating,
      reviews: selectedBrandOption.reviews,
      bestReason: selectedBrandOption.bestReason,
      specs: selectedBrandOption.specs,
      customNote: "",
      options: dbEntry.options,
    };
  };

  const openProcurementModal = (subsystemKey: string, initialTab: "brands" | "edit" = "brands") => {
    playClickSound();
    setActiveProcurementModal(subsystemKey);
    setModalActiveTab(initialTab);
    setCustomEditSuccess(false);

    const dbEntry = HARDWARE_BRANDS_DB[subsystemKey];
    if (!dbEntry) return;

    const defaultOption = dbEntry.options.find((o) => o.isBestChoice) || dbEntry.options[0];
    const customOverride = customItemOverrides[subsystemKey];
    const selectedBrandId = selectedBrandOverrides[subsystemKey];
    const selectedBrandOption = selectedBrandId
      ? dbEntry.options.find((o) => o.id === selectedBrandId) || defaultOption
      : defaultOption;

    if (customOverride) {
      setCustomEditPrice(customOverride.price !== undefined ? String(customOverride.price) : String(selectedBrandOption.price));
      setCustomEditBrand(customOverride.brand || selectedBrandOption.brand);
      setCustomEditModel(customOverride.model || selectedBrandOption.model);
      setCustomEditUrl(customOverride.amazonUrl || selectedBrandOption.amazonUrl);
      setCustomEditNote(customOverride.customNote || "");
    } else {
      setCustomEditPrice(String(selectedBrandOption.price));
      setCustomEditBrand(selectedBrandOption.brand);
      setCustomEditModel(selectedBrandOption.model);
      setCustomEditUrl(selectedBrandOption.amazonUrl);
      setCustomEditNote("");
    }
  };

  const handleSelectBrand = (subsystemKey: string, brandId: string) => {
    playSuccessChime();
    setSelectedBrandOverrides((prev) => ({
      ...prev,
      [subsystemKey]: brandId,
    }));
    // Clear custom price override for this key so brand price takes effect
    setCustomItemOverrides((prev) => {
      const copy = { ...prev };
      delete copy[subsystemKey];
      return copy;
    });
  };

  const handleSaveCustomSpec = () => {
    if (!activeProcurementModal) return;
    playSuccessChime();
    const parsedPrice = parseFloat(customEditPrice);
    setCustomItemOverrides((prev) => ({
      ...prev,
      [activeProcurementModal]: {
        price: isNaN(parsedPrice) ? undefined : parsedPrice,
        brand: customEditBrand.trim() || undefined,
        model: customEditModel.trim() || undefined,
        amazonUrl: customEditUrl.trim() || undefined,
        customNote: customEditNote.trim() || undefined,
      },
    }));
    setCustomEditSuccess(true);
    setTimeout(() => {
      setCustomEditSuccess(false);
    }, 2500);
  };

  const handleResetToDefaultBrand = (subsystemKey: string) => {
    playClickSound();
    setSelectedBrandOverrides((prev) => {
      const copy = { ...prev };
      delete copy[subsystemKey];
      return copy;
    });
    setCustomItemOverrides((prev) => {
      const copy = { ...prev };
      delete copy[subsystemKey];
      return copy;
    });
    const dbEntry = HARDWARE_BRANDS_DB[subsystemKey];
    if (dbEntry) {
      const defaultOption = dbEntry.options.find((o) => o.isBestChoice) || dbEntry.options[0];
      setCustomEditPrice(String(defaultOption.price));
      setCustomEditBrand(defaultOption.brand);
      setCustomEditModel(defaultOption.model);
      setCustomEditUrl(defaultOption.amazonUrl);
      setCustomEditNote("");
    }
  };

  // Compute Specs
  const currentTV = useMemo(() => TV_OPTIONS.find((t) => t.id === selectedTV)!, [selectedTV]);
  const currentCompute = useMemo(() => COMPUTE_OPTIONS.find((c) => c.id === selectedCompute)!, [selectedCompute]);
  const currentGPS = useMemo(() => GPS_OPTIONS.find((g) => g.id === selectedGPS)!, [selectedGPS]);
  const currentNet = useMemo(() => NET_OPTIONS.find((n) => n.id === selectedNet)!, [selectedNet]);
  const currentTicketing = useMemo(() => TICKETING_OPTIONS.find((t) => t.id === selectedTicketing)!, [selectedTicketing]);

  // Procurement resolution for all 5 subsystems:
  const isTvProcurementNeeded = selectedTV === "none" && selectedCompute !== "new_smart_tv";
  const tvProcurement = useMemo(
    () =>
      getComponentProcurement(
        "tv_screen",
        isTvProcurementNeeded ? 6999 : 0,
        "TV Screen",
        isTvProcurementNeeded
      ),
    [selectedTV, selectedCompute, selectedBrandOverrides, customItemOverrides]
  );

  const isComputeProcurementNeeded =
    selectedCompute === "android_box" ||
    selectedCompute === "orange_pi" ||
    selectedCompute === "new_smart_tv";
  const computeBrandKey = currentCompute.brandKey;
  const computeProcurement = useMemo(
    () =>
      getComponentProcurement(
        computeBrandKey,
        currentCompute.cost,
        currentCompute.title,
        isComputeProcurementNeeded
      ),
    [computeBrandKey, currentCompute, isComputeProcurementNeeded, selectedBrandOverrides, customItemOverrides]
  );

  const isGpsProcurementNeeded = selectedGPS === "usb_puck" || selectedGPS === "sinotrack";
  const gpsBrandKey = currentGPS.brandKey;
  const gpsProcurement = useMemo(
    () =>
      getComponentProcurement(
        gpsBrandKey,
        currentGPS.cost,
        currentGPS.title,
        isGpsProcurementNeeded
      ),
    [gpsBrandKey, currentGPS, isGpsProcurementNeeded, selectedBrandOverrides, customItemOverrides]
  );

  const isNetProcurementNeeded = selectedNet === "dongle" || selectedNet === "m2m_router";
  const netBrandKey = currentNet.brandKey;
  const netProcurement = useMemo(
    () =>
      getComponentProcurement(
        netBrandKey,
        currentNet.cost,
        currentNet.title,
        isNetProcurementNeeded
      ),
    [netBrandKey, currentNet, isNetProcurementNeeded, selectedBrandOverrides, customItemOverrides]
  );

  const isTicketingProcurementNeeded =
    selectedTicketing === "phone_bt" || selectedTicketing === "sunmi_pos";
  const ticketingBrandKey = currentTicketing.brandKey;
  const ticketingProcurement = useMemo(
    () =>
      getComponentProcurement(
        ticketingBrandKey,
        currentTicketing.cost,
        currentTicketing.title,
        isTicketingProcurementNeeded
      ),
    [ticketingBrandKey, currentTicketing, isTicketingProcurementNeeded, selectedBrandOverrides, customItemOverrides]
  );

  const hasHardwareCustomizations = useMemo(() => {
    return Object.keys(selectedBrandOverrides).length > 0 || Object.keys(customItemOverrides).length > 0;
  }, [selectedBrandOverrides, customItemOverrides]);

  // Total Hardware Capex per Bus
  const hardwareCapex = useMemo(() => {
    // If user has customized any brand or custom price, always sum dynamic effective unit prices:
    if (hasHardwareCustomizations) {
      return (
        tvProcurement.unitPrice +
        computeProcurement.unitPrice +
        gpsProcurement.unitPrice +
        netProcurement.unitPrice +
        ticketingProcurement.unitPrice
      );
    }

    // 1. Direct match with any of the standard catalog plans if exact match exists:
    const matched = BUS_OWNER_PLANS.find(
      (p) =>
        p.tv === selectedTV &&
        p.compute === selectedCompute &&
        p.gps === selectedGPS &&
        p.net === selectedNet &&
        p.ticketing === selectedTicketing &&
        p.commercialModel === payoutType
    );
    if (matched) {
      return matched.fullAmount;
    }

    // 2. Custom configuration calculation:
    const effectiveTvCost = selectedCompute === "new_smart_tv" ? 0 : currentTV.cost;

    return (
      effectiveTvCost +
      currentCompute.cost +
      currentGPS.cost +
      currentNet.cost +
      currentTicketing.cost
    );
  }, [
    hasHardwareCustomizations,
    selectedTV,
    selectedCompute,
    selectedGPS,
    selectedNet,
    selectedTicketing,
    payoutType,
    currentTV,
    currentCompute,
    currentGPS,
    currentNet,
    currentTicketing,
    tvProcurement.unitPrice,
    computeProcurement.unitPrice,
    gpsProcurement.unitPrice,
    netProcurement.unitPrice,
    ticketingProcurement.unitPrice,
  ]);

  // Plan Classification Synthesis
  const synthesizedPlan = useMemo(() => {
    // 1. Direct match with any of the 10 standard plans if exact match exists:
    const matched = BUS_OWNER_PLANS.find(
      (p) =>
        p.tv === selectedTV &&
        p.compute === selectedCompute &&
        p.gps === selectedGPS &&
        p.net === selectedNet &&
        p.ticketing === selectedTicketing &&
        p.commercialModel === payoutType
    );

    if (matched) {
      return {
        id: matched.id,
        code: matched.code,
        title: matched.title,
        badge: matched.badge,
        color: matched.badgeColor,
        setupMinutes: parseInt(matched.setupTime) || 25,
        difficulty: matched.setupTime,
        savings: matched.hardwareSavings || 0,
        pitchNote: matched.pitch,
        category: matched.category,
      };
    }

    if (selectedTV === "no_tv_etm" || selectedCompute === "etm_standalone") {
      const isPOS = selectedTicketing === "sunmi_pos";
      return {
        id: isPOS ? "plan_etm_pos" : "plan_saas",
        code: isPOS ? "PLAN ETM-PRO" : "PLAN ETM-LITE",
        title: isPOS ? "Commercial Smart POS SaaS" : "Mobile ETM Transit SaaS",
        badge: isPOS ? "Heavy-Duty POS Terminal" : "Conductor Phone + Bluetooth ETM",
        color: isPOS ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10",
        setupMinutes: isPOS ? 15 : 10,
        difficulty: isPOS ? "15-min POS handover" : "10-min phone pairing",
        savings: 9350,
        pitchNote: isPOS
          ? "Sunmi V2s Android 11 commercial POS terminal with integrated 58mm thermal receipt printer and dynamic UPI QR."
          : "Zero TV screen needed. Conductor phone + 58mm Bluetooth printer for anti-theft ticketing and live GPS tracking.",
        category: "etm_only" as const,
      };
    }

    if (selectedTV === "none") {
      if (selectedTicketing === "none") {
        return {
          id: "plan_screen_refit",
          code: "PLAN ADS SCREEN-ONLY",
          title: "Bare Bus 32\" Screen Refit",
          badge: "Ads Only (New Screen)",
          color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
          setupMinutes: 60,
          difficulty: "Medium (Mount 32\" display)",
          savings: 14500,
          pitchNote: "Bare ceiling bulkhead. We install a new 32\" transit display + Android Box for ad income while conductor keeps manual paper cash.",
          category: "ads_only" as const,
        };
      } else if (selectedTicketing === "phone_bt") {
        if (selectedCompute === "new_smart_tv") {
          return {
            id: "plan_smart_turnkey",
            code: "PLAN SMART-TURNKEY",
            title: "Turnkey 32\" Smart TV + Mobile ETM",
            badge: "All-in-One Smart Screen",
            color: "text-teal-400 border-teal-500/30 bg-teal-500/10",
            setupMinutes: 60,
            difficulty: "Medium",
            savings: 11850,
            pitchNote: "Installs a brand new 32\" Smart Android TV with built-in compute, plus conductor mobile Bluetooth thermal ticketing.",
            category: "combo" as const,
          };
        }
        return {
          id: "plan_combo_lite",
          code: "PLAN COMBO-LITE",
          title: "Turnkey Screen + Mobile ETM",
          badge: "Budget Bare Bus Combo",
          color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
          setupMinutes: 75,
          difficulty: "Medium",
          savings: 11700,
          pitchNote: "New 32\" screen for ad revenue + mobile Bluetooth thermal printer for zero ticket leakage.",
          category: "combo" as const,
        };
      } else {
        return {
          id: "plan_gamma",
          code: "PLAN GAMMA",
          title: "Turnkey Modernization (Sunmi POS)",
          badge: "Enterprise Bare Bus Combo",
          color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
          setupMinutes: 90,
          difficulty: "Medium (Ceiling mount & 24V line)",
          savings: 0,
          pitchNote: "Bus has no screen. We install a new 32\" high-bright display, heavy-duty drop mount, and Sunmi V2s Smart POS terminal.",
          category: "combo" as const,
        };
      }
    }

    if (selectedGPS === "phone_gps" && selectedNet === "phone_hotspot") {
      return {
        id: "pilot_zero",
        code: "PILOT ZERO",
        title: "Zero-Capex Day 1 Proof of Concept",
        badge: "100% Free Demo",
        color: "text-teal-400 border-teal-500/30 bg-teal-500/10",
        setupMinutes: 5,
        difficulty: "Minimal (5-min phone hotspot & APK)",
        savings: 18000,
        pitchNote: "Perfect Day 1 trial. Zero hardware cost. Conductor's phone provides GPS & Hotspot to show live ads immediately.",
        category: "ads_only" as const,
      };
    }

    if (selectedGPS === "ais140" && selectedTicketing === "existing_etm") {
      return {
        id: "plan_ais140",
        code: "PLAN AIS-140",
        title: "Govt AIS-140 Cloud Telemetry Integration",
        badge: "Zero-Wiring GPS Sync",
        color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
        setupMinutes: 20,
        difficulty: "Low (Cloud API sync)",
        savings: 16250,
        pitchNote: "Reuses bus's mandatory AIS-140 government tracker and pre-owned conductor ticketing machines. Fast and zero-hassle.",
        category: "combo" as const,
      };
    }

    if (selectedTV === "smart" && selectedCompute === "smart_soc" && selectedTicketing === "none") {
      return {
        id: "plan_alpha",
        code: "PLAN ALPHA",
        title: "Smart TV Zero-Capex Quick Launch",
        badge: "Fastest 15-Min Onboard",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        setupMinutes: 15,
        difficulty: "Ultra Low",
        savings: 14200,
        pitchNote: "The bus has a Smart Android TV. We only insert a ₹750 GPS puck + 4G dongle. Done in 15 minutes!",
        category: "ads_only" as const,
      };
    }

    if (selectedTV === "normal" && selectedCompute === "android_box" && selectedTicketing === "none") {
      return {
        id: "plan_beta",
        code: "PLAN BETA",
        title: "The Classic TV Box Retrofit",
        badge: "Standard Kerala Private Bus",
        color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        setupMinutes: 25,
        difficulty: "Low (Tape box + plug HDMI)",
        savings: 12000,
        pitchNote: "65% of Kerala buses fit here. Reuses existing TV screen. Android box taped behind TV handles tracking & ads.",
        category: "ads_only" as const,
      };
    }

    if (selectedTV === "smart" && selectedTicketing === "phone_bt") {
      return {
        id: "plan_delta",
        code: "PLAN DELTA",
        title: "Smart TV + Mobile ETM",
        badge: "Smart TV + Digital ETM",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        setupMinutes: 20,
        difficulty: "Low (Direct APK + BT ETM)",
        savings: 9350,
        pitchNote: "Smart TV SoC runs ad player directly with USB GPS. Conductor smartphone pairs with 58mm Bluetooth thermal printer for paper QR tickets.",
        category: "combo" as const,
      };
    }

    if (selectedTV === "normal" && selectedTicketing === "phone_bt") {
      return {
        id: "plan_beta_plus",
        code: "PLAN BETA-PLUS",
        title: "Normal TV + Mobile ETM",
        badge: "Normal TV + Digital ETM",
        color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
        setupMinutes: 35,
        difficulty: "Low-Medium (TV Box + BT ETM)",
        savings: 7500,
        pitchNote: "4G Android Box retrofits existing Normal TV for ad rent. Conductor uses 58mm Bluetooth thermal printer for tickets.",
        category: "combo" as const,
      };
    }

    if (selectedTV === "smart" && selectedTicketing === "sunmi_pos") {
      return {
        id: "plan_delta_pro",
        code: "PLAN DELTA-PRO",
        title: "Smart TV + Sunmi Smart POS",
        badge: "Smart TV + Android POS",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        setupMinutes: 25,
        difficulty: "Low (Direct APK + POS Handover)",
        savings: 9350,
        pitchNote: "Smart TV SoC runs ad player directly with USB GPS. Conductor operates commercial Sunmi V2s Smart POS with Seiko printer.",
        category: "combo" as const,
      };
    }

    if (selectedTV === "normal" && selectedTicketing === "sunmi_pos") {
      return {
        id: "plan_beta_pro",
        code: "PLAN BETA-PRO",
        title: "Normal TV + Sunmi Smart POS",
        badge: "Normal TV + Android POS",
        color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
        setupMinutes: 40,
        difficulty: "Medium (TV Box + POS Handover)",
        savings: 7500,
        pitchNote: "4G Android Box retrofits existing Normal TV. Conductor operates commercial Sunmi V2s Smart POS terminal.",
        category: "combo" as const,
      };
    }

    if (selectedTV === "smart" && selectedTicketing === "existing_etm") {
      return {
        id: "plan_smart_sync",
        code: "PLAN SMART-SYNC",
        title: "Smart TV + Existing ETM Sync",
        badge: "Zero New Hardware",
        color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
        setupMinutes: 15,
        difficulty: "Ultra Low (Cloud API sync)",
        savings: 17000,
        pitchNote: "Bus has Smart TV and conductor already has an ETM machine. We only plug in GPS & 4G to start paying ad rent.",
        category: "combo" as const,
      };
    }

    if (selectedTicketing !== "none") {
      return {
        id: "plan_delta",
        code: "PLAN DELTA",
        title: "Screen Ads + Digital ETM Combo",
        badge: "Complete Digital Transit Kit",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        setupMinutes: 30,
        difficulty: "Low-Medium",
        savings: 8500,
        pitchNote: "Comprehensive package providing both live passenger digital ads and conductor QR ticketing printouts.",
        category: "combo" as const,
      };
    }

    return {
      id: "custom",
      code: "PLAN CUSTOM",
      title: "Tailored Fleet Configuration",
      badge: "Custom Route Setup",
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      setupMinutes: 30,
      difficulty: "Low",
      savings: 10000,
      pitchNote: "Custom combination tailored to the operator's exact existing electronics inventory.",
      category: "all" as const,
    };
  }, [selectedTV, selectedCompute, selectedGPS, selectedNet, selectedTicketing, payoutType]);

  // Commercial Payouts to Bus Owner / SaaS Revenue Modeling
  const commercialEconomics = useMemo(() => {
    let ownerMonthlyIncome = 0;
    let netEbitdaAfterOwner = 0;
    let ourMonthlySaaSRevenuePerBus = 0;

    const monthlySimCost = currentNet.monthlySimCost;

    if (payoutType === "fixed") {
      ownerMonthlyIncome = fixedMonthlyRent;
      netEbitdaAfterOwner = Math.max(0, estimatedMonthlyAdGross - ownerMonthlyIncome - monthlySimCost);
    } else if (payoutType === "revshare") {
      ownerMonthlyIncome = Math.round((estimatedMonthlyAdGross * revSharePct) / 100);
      netEbitdaAfterOwner = Math.max(0, estimatedMonthlyAdGross - ownerMonthlyIncome - monthlySimCost);
    } else {
      // ETM SaaS Service Mode: Owner pays US! We pay owner ₹0.
      ownerMonthlyIncome = 0;
      ourMonthlySaaSRevenuePerBus =
        saasMonthlyFee + (saasHardwareFunding === "hardware_lease" ? hardwareLeaseFee : 0);
      netEbitdaAfterOwner = ourMonthlySaaSRevenuePerBus - monthlySimCost;
    }

    // Effective hardware capex depending on funding mode
    const effectiveCapexPerBus =
      payoutType === "saas_etm" && saasHardwareFunding === "owner_buys" ? 0 : hardwareCapex;

    // Payback period in months
    const capexPaybackMonths =
      effectiveCapexPerBus === 0
        ? "0 (Immediate)"
        : netEbitdaAfterOwner > 0
        ? (effectiveCapexPerBus / netEbitdaAfterOwner).toFixed(1)
        : "N/A";

    // Fleet Totals
    const totalFleetCapex = effectiveCapexPerBus * fleetCount;
    const totalFleetOwnerPayout = ownerMonthlyIncome * fleetCount;
    const totalFleetGross =
      (payoutType === "saas_etm" ? ourMonthlySaaSRevenuePerBus : estimatedMonthlyAdGross) * fleetCount;
    const totalFleetNetProfit = netEbitdaAfterOwner * fleetCount;

    return {
      ownerMonthlyIncome,
      ourMonthlySaaSRevenuePerBus,
      monthlySimCost,
      netEbitdaAfterOwner,
      effectiveCapexPerBus,
      capexPaybackMonths,
      totalFleetCapex,
      totalFleetOwnerPayout,
      totalFleetGross,
      totalFleetNetProfit,
    };
  }, [
    payoutType,
    fixedMonthlyRent,
    estimatedMonthlyAdGross,
    revSharePct,
    saasMonthlyFee,
    saasHardwareFunding,
    hardwareLeaseFee,
    currentNet,
    hardwareCapex,
    fleetCount,
  ]);

  const handlePrintHandover = () => {
    playSuccessChime();
    window.print();
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* ─── HEADER BAR ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Bus Onboarding & Hardware Kit Flow
            </span>
            <span className={`px-2.5 py-0.5 text-xs rounded-full border font-mono ${synthesizedPlan.color}`}>
              {synthesizedPlan.code}: {synthesizedPlan.badge}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bus Owner Plans & Decision Engine
          </h1>
          <p className="mt-1 text-sm md:text-base text-gray-400 max-w-3xl">
            Interactive decision tree mapping existing vs needed bus hardware across TV (Smart/Normal), Android Box, GPS, Dongle, and ETM. Synthesizes upfront Capex, setup time, and owner payout terms.
          </p>
        </div>

        {/* Action Button: Print Equipment Handover Agreement */}
        <button
          onClick={handlePrintHandover}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-start lg:self-auto"
        >
          <span>📋</span>
          <span>Print Equipment Handover Agreement</span>
        </button>
      </div>

      {/* ─── WORKFLOW VIEW MODE SELECTOR ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-black/40 rounded-xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => {
              playClickSound();
              setViewMode("packages");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === "packages"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>📦</span>
            <span>Turnkey Fleet Packages</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">{BUS_OWNER_PLANS.length}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setViewMode("builder");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === "builder"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-400/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>🛠️</span>
            <span>Hardware Studio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">5 Stages</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setViewMode("agreement");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === "agreement"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/40"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>📋</span>
            <span>Agreement & Handover</span>
          </button>
        </div>

        {/* Full Single Page Flow Toggle */}
        <button
          onClick={() => {
            playClickSound();
            setViewMode(viewMode === "all" ? "packages" : "all");
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer self-end sm:self-auto ${
            viewMode === "all"
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-white/[0.02] text-gray-400 hover:text-white border-white/[0.08]"
          }`}
        >
          <span>📑</span>
          <span>{viewMode === "all" ? "Exit Full Flow View" : "View Full Flow (Single Page)"}</span>
        </button>
      </div>

      {/* ─── TOP KPI SUMMARY CARDS ────────────────────────────────────────────── */}
      {viewMode !== "agreement" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Hardware Capex */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isLight ? "bg-white/80 border-black/[0.08] shadow-sm" : "bg-white/[0.03] border-white/[0.08]"
          }`}>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Hardware Capex / Bus</span>
              <span className="text-blue-400 font-mono font-semibold">
                {hardwareCapex === 0 ? "100% Zero-Capex" : "Plug & Play Kit"}
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              ₹{hardwareCapex.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center justify-between">
              <span>Saved: ₹{synthesizedPlan.savings.toLocaleString()}</span>
              <span className="text-gray-400 font-mono">{synthesizedPlan.setupMinutes} Mins Setup</span>
            </div>
          </div>

          {/* KPI 2: Owner Monthly Income / SaaS Recurring Revenue */}
          <div className={`p-5 rounded-2xl border transition-all ${
            payoutType === "saas_etm"
              ? "bg-rose-500/[0.08] border-rose-500/30"
              : isLight ? "bg-blue-50/50 border-blue-500/20 shadow-sm" : "bg-blue-500/[0.06] border-blue-500/20"
          }`}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-semibold ${payoutType === "saas_etm" ? "text-rose-400" : "text-blue-400"}`}>
                {payoutType === "saas_etm" ? "Owner SaaS Subscription" : "Bus Owner Monthly Payout"}
              </span>
              <span className="font-mono text-gray-400">
                {payoutType === "saas_etm"
                  ? "Paid to Us"
                  : payoutType === "fixed"
                  ? "Fixed Rent"
                  : `${revSharePct}% RevShare`}
              </span>
            </div>
            <div className={`text-2xl lg:text-3xl font-bold tracking-tight ${payoutType === "saas_etm" ? "text-rose-300" : "text-blue-400"}`}>
              {payoutType === "saas_etm" ? (
                <>
                  +₹{commercialEconomics.ourMonthlySaaSRevenuePerBus.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400"> / mo / bus</span>
                </>
              ) : (
                <>
                  ₹{commercialEconomics.ownerMonthlyIncome.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400"> / mo</span>
                </>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
              <span>{payoutType === "saas_etm" ? "Owner Payout: ₹0 (Zero Liability)" : "Guaranteed Passive Income"}</span>
              <span className="text-gray-300 font-mono">
                {payoutType === "saas_etm"
                  ? `+₹${Math.round(commercialEconomics.ourMonthlySaaSRevenuePerBus * 12 / 1000)}k/yr ARR`
                  : `₹${Math.round(commercialEconomics.ownerMonthlyIncome * 12 / 1000)}k/yr`}
              </span>
            </div>
          </div>

          {/* KPI 3: Payback Period */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isLight ? "bg-emerald-50/50 border-emerald-500/20 shadow-sm" : "bg-emerald-500/[0.06] border-emerald-500/20"
          }`}>
            <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
              <span className="font-semibold">Capex Payback Velocity</span>
              <span className="font-mono">DOOH Ad Yield</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400">
              {commercialEconomics.capexPaybackMonths} Months
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
              <span>Net Margin After Owner:</span>
              <span className="text-emerald-300 font-semibold">₹{commercialEconomics.netEbitdaAfterOwner.toLocaleString()}/mo</span>
            </div>
          </div>

          {/* KPI 4: Fleet Multiplier Total */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isLight ? "bg-white/80 border-black/[0.08] shadow-sm" : "bg-white/[0.03] border-white/[0.08]"
          }`}>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Fleet Total ({fleetCount} Buses)</span>
              <span className="text-purple-400 font-mono">Operator Fleet</span>
            </div>
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-purple-400">
              ₹{commercialEconomics.totalFleetCapex.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
              <span>Fleet Net Profit:</span>
              <span className="text-emerald-400 font-bold">₹{commercialEconomics.totalFleetNetProfit.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 2: INTERACTIVE 5-STAGE DECISION FLOW DIAGRAM (HARDWARE STUDIO)
          ══════════════════════════════════════════════════════════════════════════ */}
      {(viewMode === "builder" || viewMode === "all") && (
        <div id="hardware-studio-section" className="space-y-8">
          {/* Bridge to Packages Catalog */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-emerald-900/15 border border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📦</span>
              <div>
                <span className="text-xs text-gray-400">Current Hardware Matches Package: </span>
                <span className="text-xs font-bold text-white font-mono">{synthesizedPlan.code} ({synthesizedPlan.title})</span>
              </div>
            </div>
            <button
              onClick={viewMatchingPackage}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>📦</span>
              <span>View Turnkey Package in Catalog</span>
              <span>➔</span>
            </button>
          </div>

          <div className={`p-6 md:p-8 rounded-3xl border ${
            isLight ? "bg-white/90 border-black/[0.08] shadow-sm" : "bg-[#0b0c10] border-white/[0.08]"
          } space-y-8`}>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>🔀</span>
                <span>Bus Hardware Audit & Decision Pathway</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Click each condition node below to simulate what the bus already possesses vs what kit needs to be installed.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-gray-300 self-start sm:self-auto">
              Path: <span className="text-blue-400 font-bold">{selectedTV.toUpperCase()} TV</span> ➔{" "}
              <span className="text-purple-400 font-bold">{selectedCompute.split("_")[0].toUpperCase()}</span> ➔{" "}
              <span className="text-emerald-400 font-bold">{selectedGPS.toUpperCase()}</span>
            </div>
          </div>

        {/* ─── QUICK FLEET HARDWARE PRESETS (1-CLICK ARCHITECTURES) ───────── */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>1-Click Fleet Architecture Presets</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Kerala Field Tested
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Instant real-world setups based on actual private bus audits. Click any preset to configure all 5 hardware stages instantly.
              </p>
            </div>
            {activePresetId === "custom" ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-medium self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Custom Configuration Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Preset Active: {FLEET_PRESETS.find((p) => p.id === activePresetId)?.name}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {FLEET_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              const capexVal = getPresetCapex(preset);

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between group ${
                    isActive
                      ? "bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-purple-500/10 border-blue-400/80 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10 scale-[1.02]"
                      : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20"
                  }`}
                >
                  {/* Top: Icon & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {preset.icon}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${preset.badgeColor}`}
                      >
                        {preset.badge}
                      </span>
                    </div>

                    <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                      {preset.name}
                    </div>

                    <div className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.tagline}
                    </div>
                  </div>

                  {/* Bottom: Capex + Setup time */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-gray-400 text-[10px] block leading-none">Capex</span>
                      <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                        {capexVal === 0 ? "₹0 (Free)" : `₹${capexVal.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block leading-none">Setup</span>
                      <span className="font-mono text-emerald-400 font-semibold text-[11px] mt-0.5 block">
                        {preset.setupTime}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold shadow-md ring-2 ring-[#0b0c10]">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── STAGE 1: TV SCREEN FACTOR ─────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              TV Screen Status (What does the bus have mounted?)
            </span>
            <span className="text-gray-400 text-[11px]">Core display surface</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {TV_OPTIONS.map((tv) => {
              const isSelected = selectedTV === tv.id;
              return (
                <div
                  key={tv.id}
                  onClick={() => handleTVSelect(tv.id)}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className={`p-4 rounded-2xl border cursor-pointer relative transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{tv.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tv.badgeColor}`}>
                        {tv.badge}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{tv.title}</div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tv.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-gray-400">Capex Addition:</span>
                    <span className="font-mono font-bold text-white">
                      {tv.cost === 0
                        ? "₹0 (Reused)"
                        : selectedCompute === "new_smart_tv" && tv.id === "none"
                        ? "₹0 (In Smart TV)"
                        : `+₹${(tv.id === "none" ? tvProcurement.unitPrice : tv.cost).toLocaleString()}`}
                    </span>
                  </div>

                  {/* Brand & Amazon links when procurement is needed */}
                  {tv.brandKey && tv.id === "none" && selectedCompute !== "new_smart_tv" && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 truncate">
                          {tvProcurement.isCustom
                            ? `✏️ Custom: ${tvProcurement.brand} (₹${tvProcurement.unitPrice.toLocaleString()})`
                            : `⭐ ${tvProcurement.brand} (₹${tvProcurement.unitPrice.toLocaleString()})`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal("tv_screen", "brands");
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                          title="Choose Amazon Brand"
                        >
                          <span>🛒 Brands</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal("tv_screen", "edit");
                          }}
                          className="px-1.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[10px] font-semibold transition-all cursor-pointer"
                          title="Edit Custom Price"
                        >
                          <span>✏️</span>
                        </button>
                        {tvProcurement.amazonUrl && (
                          <a
                            href={tvProcurement.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-1.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition-all flex items-center"
                            title="Open on Amazon India"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STAGE 2: COMPUTE & PROCESSING ENGINE ──────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              Compute Subsystem (How is the signage APK executed?)
            </span>
            <span className="text-gray-400 text-[11px]">Auto-inferred with manual override</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {COMPUTE_OPTIONS.map((c) => {
              const isSelected = selectedCompute === c.id;
              const cProc = c.brandKey
                ? c.id === selectedCompute
                  ? computeProcurement
                  : getComponentProcurement(c.brandKey, c.cost, c.title, true)
                : null;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedCompute(c.id);
                  }}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className={`p-4 rounded-2xl border cursor-pointer relative transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-600/15 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/10">
                        {c.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{c.title}</div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{c.desc}</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-gray-400">Compute Cost:</span>
                    <span className="font-mono font-bold text-purple-300">
                      {c.cost === 0
                        ? "₹0 (Built-in)"
                        : cProc
                        ? `+₹${cProc.unitPrice.toLocaleString()}`
                        : `+₹${c.cost.toLocaleString()}`}
                    </span>
                  </div>

                  {c.brandKey && cProc && (
                    <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-mono text-purple-300 truncate max-w-[110px]">
                        {cProc.isCustom
                          ? `✏️ ₹${cProc.unitPrice.toLocaleString()}`
                          : `⭐ ${cProc.brand.split(" ")[0]} (₹${cProc.unitPrice.toLocaleString()})`}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal(c.brandKey!, "brands");
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[9px] font-semibold transition-all cursor-pointer"
                          title="Choose Amazon Brand"
                        >
                          🛒 Brands
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal(c.brandKey!, "edit");
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold transition-all cursor-pointer"
                          title="Edit Custom Price"
                        >
                          ✏️
                        </button>
                        {cProc.amazonUrl && (
                          <a
                            href={cProc.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-1 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold transition-all"
                            title="Open on Amazon India"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STAGE 3: GPS TELEMETRY & TRACKING ─────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                3
              </span>
              GPS Telemetry Source (How are live coordinates acquired?)
            </span>
            <span className="text-gray-400 text-[11px]">Powers live tracking map & next-stop audio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {GPS_OPTIONS.map((g) => {
              const isSelected = selectedGPS === g.id;
              const gProc = g.brandKey
                ? g.id === selectedGPS
                  ? gpsProcurement
                  : getComponentProcurement(g.brandKey, g.cost, g.title, true)
                : null;

              return (
                <div
                  key={g.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedGPS(g.id);
                  }}
                  onMouseEnter={() => playHoverSound(0.01)}
                  className={`p-4 rounded-2xl border cursor-pointer relative transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/10">
                        {g.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{g.title}</div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{g.desc}</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-gray-400">Receiver Cost:</span>
                    <span className="font-mono font-bold text-emerald-300">
                      {g.cost === 0
                        ? "₹0 (Reused)"
                        : gProc
                        ? `+₹${gProc.unitPrice.toLocaleString()}`
                        : `+₹${g.cost.toLocaleString()}`}
                    </span>
                  </div>

                  {g.brandKey && gProc && (
                    <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-mono text-emerald-300 truncate max-w-[110px]">
                        {gProc.isCustom
                          ? `✏️ ₹${gProc.unitPrice.toLocaleString()}`
                          : `⭐ ${gProc.brand.split(" ")[0]} (₹${gProc.unitPrice.toLocaleString()})`}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal(g.brandKey!, "brands");
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold transition-all cursor-pointer"
                          title="Choose Amazon Brand"
                        >
                          🛒 Brands
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProcurementModal(g.brandKey!, "edit");
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold transition-all cursor-pointer"
                          title="Edit Custom Price"
                        >
                          ✏️
                        </button>
                        {gProc.amazonUrl && (
                          <a
                            href={gProc.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-1 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold transition-all"
                            title="Open on Amazon India"
                          >
                            ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STAGE 4 & 5 GRID: CONNECTIVITY & TICKETING ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Stage 4: Internet & Data Uplink */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                Cellular Internet & Dongle
              </span>
              <span className="text-gray-400 text-[11px]">4G Data link</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {NET_OPTIONS.map((n) => {
                const isSelected = selectedNet === n.id;
                const nProc = n.brandKey
                  ? n.id === selectedNet
                    ? netProcurement
                    : getComponentProcurement(n.brandKey, n.cost, n.title, true)
                  : null;

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedNet(n.id);
                    }}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-cyan-600/15 border-cyan-500 ring-2 ring-cyan-500/40 shadow"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div>
                      <div className="text-xl mb-1.5">{n.icon}</div>
                      <div className="text-xs font-bold text-white">{n.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">{n.desc}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono font-bold text-cyan-300">
                      {n.cost === 0
                        ? "₹0 Capex"
                        : nProc
                        ? `+₹${nProc.unitPrice.toLocaleString()}`
                        : `+₹${n.cost.toLocaleString()}`}
                    </div>

                    {n.brandKey && nProc && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-mono text-cyan-300 truncate max-w-[90px]">
                          {nProc.isCustom
                            ? `✏️ ₹${nProc.unitPrice.toLocaleString()}`
                            : `⭐ ${nProc.brand.split(" ")[0]}`}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProcurementModal(n.brandKey!, "brands");
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[9px] font-semibold transition-all cursor-pointer"
                            title="Choose Amazon Brand"
                          >
                            🛒 Brands
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProcurementModal(n.brandKey!, "edit");
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold transition-all cursor-pointer"
                            title="Edit Custom Price"
                          >
                            ✏️
                          </button>
                          {nProc.amazonUrl && (
                            <a
                              href={nProc.amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-1 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold transition-all"
                              title="Open on Amazon India"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage 5: Ticketing Subsystem */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                  5
                </span>
                Conductor Ticketing (ETM / Printer)
              </span>
              <span className="text-gray-400 text-[11px]">Ticketing hardware</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TICKETING_OPTIONS.map((t) => {
                const isSelected = selectedTicketing === t.id;
                const tProc = t.brandKey
                  ? t.id === selectedTicketing
                    ? ticketingProcurement
                    : getComponentProcurement(t.brandKey, t.cost, t.title, true)
                  : null;

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedTicketing(t.id);
                    }}
                    onMouseEnter={() => playHoverSound(0.01)}
                    className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-amber-600/15 border-amber-500 ring-2 ring-amber-500/40 shadow"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div>
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-xs font-bold text-white truncate">{t.title.split("/")[0]}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{t.desc}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono font-bold text-amber-300">
                      {t.cost === 0
                        ? "₹0 (No Capex)"
                        : tProc
                        ? `+₹${tProc.unitPrice.toLocaleString()}`
                        : `+₹${t.cost.toLocaleString()}`}
                    </div>

                    {t.brandKey && tProc && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-mono text-amber-300 truncate max-w-[90px]">
                          {tProc.isCustom
                            ? `✏️ ₹${tProc.unitPrice.toLocaleString()}`
                            : `⭐ ${tProc.brand.split(" ")[0]}`}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProcurementModal(t.brandKey!, "brands");
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold transition-all cursor-pointer"
                            title="Choose Amazon Brand"
                          >
                            🛒 Brands
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProcurementModal(t.brandKey!, "edit");
                            }}
                            className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold transition-all cursor-pointer"
                            title="Edit Custom Price"
                          >
                            ✏️
                          </button>
                          {tProc.amazonUrl && (
                            <a
                              href={tProc.amazonUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-1 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold transition-all"
                              title="Open on Amazon India"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SYNTHESIZED PLAN & COMMERCIAL BLUEPRINT
          ══════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Bill of Materials & Setup Guide (7 Cols) */}
        <div className={`xl:col-span-7 p-6 rounded-3xl border ${
          isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
        } space-y-6`}>
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#0A84FF]">
                Synthesized Hardware Specification
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">{synthesizedPlan.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{synthesizedPlan.pitchNote}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${synthesizedPlan.color}`}>
                {synthesizedPlan.code}
              </span>
              <div className="text-[11px] text-gray-400 mt-1">Est. {synthesizedPlan.setupMinutes} Mins</div>
            </div>
          </div>

          {/* Itemized Bill of Materials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Subsystem</th>
                  <th className="py-2.5">Component & Verified Brand Specification</th>
                  <th className="py-2.5">Procurement Status</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {/* 1. TV Screen */}
                <tr>
                  <td className="py-3 font-semibold text-gray-300 align-top">1. TV Display</td>
                  <td className="py-3 text-white align-top">
                    <div>
                      <div className="font-medium">
                        {selectedCompute === "new_smart_tv"
                          ? '32" Transit IPS Display (Integrated in Smart TV)'
                          : currentTV.title}
                      </div>
                      {isTvProcurementNeeded && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {tvProcurement.isCustom ? `✏️ ${tvProcurement.brand}` : `⭐ ${tvProcurement.brand} • ${tvProcurement.model.split(" ")[0]}`}
                          </span>
                          {!tvProcurement.isCustom && tvProcurement.rating && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★{tvProcurement.rating.toFixed(1)} ({tvProcurement.reviews})
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openProcurementModal("tv_screen", "brands")}
                              className="px-1.5 py-0.5 rounded bg-blue-500/15 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[9px] font-semibold cursor-pointer"
                            >
                              🔄 Brands
                            </button>
                            <button
                              type="button"
                              onClick={() => openProcurementModal("tv_screen", "edit")}
                              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            {tvProcurement.amazonUrl && (
                              <a
                                href={tvProcurement.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold flex items-center gap-0.5"
                                title="Buy on Amazon India"
                              >
                                <span>🛒 Amazon</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-emerald-400 align-top">
                    {selectedCompute === "new_smart_tv"
                      ? "Included in TV"
                      : currentTV.cost === 0
                      ? "Pre-Installed"
                      : tvProcurement.isCustom
                      ? "Custom Rate"
                      : "New Screen"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white align-top">
                    ₹{(selectedCompute === "new_smart_tv" ? 0 : tvProcurement.unitPrice).toLocaleString()}
                  </td>
                </tr>

                {/* 2. Compute Engine */}
                <tr>
                  <td className="py-3 font-semibold text-gray-300 align-top">2. Compute Box</td>
                  <td className="py-3 text-white align-top">
                    <div>
                      <div className="font-medium">{currentCompute.title}</div>
                      {isComputeProcurementNeeded && currentCompute.brandKey && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {computeProcurement.isCustom
                              ? `✏️ ${computeProcurement.brand}`
                              : `⭐ ${computeProcurement.brand} • ${computeProcurement.model.split(" ")[0]}`}
                          </span>
                          {!computeProcurement.isCustom && computeProcurement.rating && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★{computeProcurement.rating.toFixed(1)} ({computeProcurement.reviews})
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentCompute.brandKey!, "brands")}
                              className="px-1.5 py-0.5 rounded bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[9px] font-semibold cursor-pointer"
                            >
                              🔄 Brands
                            </button>
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentCompute.brandKey!, "edit")}
                              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            {computeProcurement.amazonUrl && (
                              <a
                                href={computeProcurement.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold flex items-center gap-0.5"
                                title="Buy on Amazon India"
                              >
                                <span>🛒 Amazon</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-purple-400 align-top">
                    {currentCompute.id === "new_smart_tv"
                      ? "All-in-One Unit"
                      : currentCompute.cost === 0
                      ? "Integrated"
                      : computeProcurement.isCustom
                      ? "Custom Rate"
                      : "Procure"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white align-top">
                    ₹{(currentCompute.cost === 0 ? 0 : computeProcurement.unitPrice).toLocaleString()}
                  </td>
                </tr>

                {/* 3. GPS Receiver */}
                <tr>
                  <td className="py-3 font-semibold text-gray-300 align-top">3. GPS Receiver</td>
                  <td className="py-3 text-white align-top">
                    <div>
                      <div className="font-medium">{currentGPS.title}</div>
                      {isGpsProcurementNeeded && currentGPS.brandKey && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {gpsProcurement.isCustom
                              ? `✏️ ${gpsProcurement.brand}`
                              : `⭐ ${gpsProcurement.brand} • ${gpsProcurement.model.split(" ")[0]}`}
                          </span>
                          {!gpsProcurement.isCustom && gpsProcurement.rating && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★{gpsProcurement.rating.toFixed(1)} ({gpsProcurement.reviews})
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentGPS.brandKey!, "brands")}
                              className="px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[9px] font-semibold cursor-pointer"
                            >
                              🔄 Brands
                            </button>
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentGPS.brandKey!, "edit")}
                              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            {gpsProcurement.amazonUrl && (
                              <a
                                href={gpsProcurement.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold flex items-center gap-0.5"
                                title="Buy on Amazon India"
                              >
                                <span>🛒 Amazon</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-emerald-400 align-top">
                    {currentGPS.cost === 0
                      ? "Reused (₹0)"
                      : gpsProcurement.isCustom
                      ? "Custom Rate"
                      : "USB Puck"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white align-top">
                    ₹{(currentGPS.cost === 0 ? 0 : gpsProcurement.unitPrice).toLocaleString()}
                  </td>
                </tr>

                {/* 4. 4G Connectivity */}
                <tr>
                  <td className="py-3 font-semibold text-gray-300 align-top">4. 4G Connectivity</td>
                  <td className="py-3 text-white align-top">
                    <div>
                      <div className="font-medium">{currentNet.title}</div>
                      {isNetProcurementNeeded && currentNet.brandKey && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {netProcurement.isCustom
                              ? `✏️ ${netProcurement.brand}`
                              : `⭐ ${netProcurement.brand} • ${netProcurement.model.split(" ")[0]}`}
                          </span>
                          {!netProcurement.isCustom && netProcurement.rating && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★{netProcurement.rating.toFixed(1)} ({netProcurement.reviews})
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentNet.brandKey!, "brands")}
                              className="px-1.5 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[9px] font-semibold cursor-pointer"
                            >
                              🔄 Brands
                            </button>
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentNet.brandKey!, "edit")}
                              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            {netProcurement.amazonUrl && (
                              <a
                                href={netProcurement.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold flex items-center gap-0.5"
                                title="Buy on Amazon India"
                              >
                                <span>🛒 Amazon</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-cyan-400 align-top">
                    {currentNet.id === "etm_sim"
                      ? "Built-in SIM"
                      : currentNet.cost === 0
                      ? "Phone Hotspot"
                      : netProcurement.isCustom
                      ? "Custom Rate"
                      : "4G Dongle"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white align-top">
                    ₹{(currentNet.cost === 0 ? 0 : netProcurement.unitPrice).toLocaleString()}
                  </td>
                </tr>

                {/* 5. Ticketing Subsystem */}
                <tr>
                  <td className="py-3 font-semibold text-gray-300 align-top">5. Ticketing ETM</td>
                  <td className="py-3 text-white align-top">
                    <div>
                      <div className="font-medium">{currentTicketing.title}</div>
                      {isTicketingProcurementNeeded && currentTicketing.brandKey && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {ticketingProcurement.isCustom
                              ? `✏️ ${ticketingProcurement.brand}`
                              : `⭐ ${ticketingProcurement.brand} • ${ticketingProcurement.model.split(" ")[0]}`}
                          </span>
                          {!ticketingProcurement.isCustom && ticketingProcurement.rating && (
                            <span className="text-[10px] text-amber-400 font-mono">
                              ★{ticketingProcurement.rating.toFixed(1)} ({ticketingProcurement.reviews})
                            </span>
                          )}
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentTicketing.brandKey!, "brands")}
                              className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold cursor-pointer"
                            >
                              🔄 Brands
                            </button>
                            <button
                              type="button"
                              onClick={() => openProcurementModal(currentTicketing.brandKey!, "edit")}
                              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[9px] font-semibold cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            {ticketingProcurement.amazonUrl && (
                              <a
                                href={ticketingProcurement.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[9px] font-semibold flex items-center gap-0.5"
                                title="Buy on Amazon India"
                              >
                                <span>🛒 Amazon</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-amber-400 align-top">
                    {currentTicketing.cost === 0
                      ? "Phase 1 Cash"
                      : ticketingProcurement.isCustom
                      ? "Custom Rate"
                      : "Digital POS"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white align-top">
                    ₹{(currentTicketing.cost === 0 ? 0 : ticketingProcurement.unitPrice).toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/20 text-sm">
                  <td colSpan={3} className="py-3.5 font-bold uppercase tracking-wider text-right pr-4">
                    Total Hardware Kit Capex per Bus
                  </td>
                  <td className="py-3.5 font-bold font-mono text-lg text-right text-emerald-400">
                    ₹{hardwareCapex.toLocaleString()}
                  </td>
                </tr>
                {hasHardwareCustomizations && (
                  <tr>
                    <td colSpan={4} className="pt-2">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <span className="text-amber-300 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>Custom brand selections and prices active in this kit calculation.</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setSelectedBrandOverrides({});
                            setCustomItemOverrides({});
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] cursor-pointer"
                        >
                          Reset All to Fleet Defaults
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Installation Complexity Checklist */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 text-xs">
            <div className="font-semibold text-white">Installation & Technical Verification Steps:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Auto-boot APK kiosk configured on power
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> USB GPS puck routed cleanly along A-pillar
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 4G Dongle SIM pre-activated with unlimited M2M pack
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Audio 3.5mm jack routed to bus interior speaker amplifier
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Commercial Payouts & Fleet Multipliers (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Owner Payout Model Configurator */}
          <div className={`p-6 rounded-3xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-5`}>
            <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">Bus Owner Commercial Agreement</h4>
                  <p className="text-xs text-gray-400">Configure operator compensation terms</p>
                </div>
              </div>
              {/* 3-Way Commercial Model Toggle */}
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/40 p-1 border border-white/10 w-full text-center">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setPayoutType("fixed");
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg transition-all font-medium ${
                    payoutType === "fixed"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Fixed Rent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setPayoutType("revshare");
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg transition-all font-medium ${
                    payoutType === "revshare"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  RevShare %
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setPayoutType("saas_etm");
                  }}
                  className={`py-1.5 px-2 text-xs rounded-lg transition-all font-medium flex items-center justify-center gap-1 ${
                    payoutType === "saas_etm"
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow ring-1 ring-rose-400"
                      : "text-rose-400 hover:text-white hover:bg-rose-500/10"
                  }`}
                >
                  <span>🎫</span>
                  <span>ETM SaaS</span>
                </button>
              </div>
            </div>

            {payoutType === "saas_etm" ? (
              <div className="space-y-4">
                {/* Highlight banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-purple-500/10 border border-rose-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <span>💎</span>
                      <span>Zero Owner Rent • Recurring SaaS Income for GetMyBus</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      B2B SaaS
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Operator pays you monthly for fraud-proof digital ticketing, UPI collections, and live owner reports. Conductor&apos;s device streams live GPS to our commuter app for free!
                  </p>
                </div>

                {/* SaaS Subscription Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">Monthly Platform SaaS Fee (Paid by Owner)</span>
                    <span className="text-rose-400 font-mono font-bold text-sm">
                      ₹{saasMonthlyFee.toLocaleString()} / bus / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={499}
                    max={1999}
                    step={50}
                    value={saasMonthlyFee}
                    onChange={(e) => setSaasMonthlyFee(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>₹499/mo (Basic)</span>
                    <span>₹899/mo (Standard Cloud)</span>
                    <span>₹1,999/mo (Enterprise)</span>
                  </div>
                </div>

                {/* Hardware Procurement Toggle */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="text-xs font-semibold text-white">Hardware Supply Model:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSaasHardwareFunding("owner_buys")}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        saasHardwareFunding === "owner_buys"
                          ? "bg-rose-500/20 border-rose-400 text-white ring-1 ring-rose-400"
                          : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-xs">Owner Buys Hardware</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Your Capex = ₹0 (Immediate Profit)</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSaasHardwareFunding("hardware_lease")}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        saasHardwareFunding === "hardware_lease"
                          ? "bg-rose-500/20 border-rose-400 text-white ring-1 ring-rose-400"
                          : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-xs">Hardware Lease (+₹{hardwareLeaseFee}/mo)</div>
                      <div className="text-[10px] text-cyan-400 mt-0.5">Device-as-a-Service Rental</div>
                    </button>
                  </div>
                </div>

                {/* Dual Value Matrix: Commuters vs Owner */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/20 space-y-1">
                    <span className="font-bold text-blue-400 text-xs block">🚌 Commuter Experience</span>
                    <ul className="text-gray-300 space-y-0.5 text-[10px]">
                      <li>• Instant UPI QR scan on bus</li>
                      <li>• Real-time tracking on GetMyBus app</li>
                      <li>• Clean printed QR stage tickets</li>
                    </ul>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-emerald-400 text-xs block">🛡️ Bus Owner Value</span>
                    <ul className="text-gray-300 space-y-0.5 text-[10px]">
                      <li>• 100% anti-fraud ticket punch</li>
                      <li>• Live revenue app on smartphone</li>
                      <li>• 1-second automated waybill</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : payoutType === "fixed" ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Guaranteed Monthly Rent to Owner</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">
                    ₹{fixedMonthlyRent.toLocaleString()} / bus / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={250}
                  value={fixedMonthlyRent}
                  onChange={(e) => setFixedMonthlyRent(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>₹1,000</span>
                  <span>₹2,500 (Market Standard)</span>
                  <span>₹5,000</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">Owner Revenue Share %</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">
                    {revSharePct}% of Gross Ad Billing
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={40}
                  step={5}
                  value={revSharePct}
                  onChange={(e) => setRevSharePct(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>15%</span>
                  <span>25% (Standard)</span>
                  <span>40%</span>
                </div>
              </div>
            )}

            {/* Estimated Gross Ad Revenue Input (shown only in TV DOOH mode) */}
            {payoutType !== "saas_etm" && (
              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Estimated Gross DOOH Ad Collections / Bus</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    ₹{estimatedMonthlyAdGross.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={8000}
                  max={35000}
                  step={1000}
                  value={estimatedMonthlyAdGross}
                  onChange={(e) => setEstimatedMonthlyAdGross(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
                />
              </div>
            )}

            {/* Economics Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-gray-400 text-[11px]">
                  {payoutType === "saas_etm" ? "Owner Payout (Liability)" : "Owner Payout"}
                </div>
                <div className={`text-base font-bold mt-0.5 ${payoutType === "saas_etm" ? "text-emerald-400" : "text-blue-400"}`}>
                  {payoutType === "saas_etm" ? "₹0 (Zero Rent)" : `₹${commercialEconomics.ownerMonthlyIncome.toLocaleString()}/mo`}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-gray-400 text-[11px]">
                  {payoutType === "saas_etm" ? "Your Recurring SaaS Margin" : "Your Net EBITDA"}
                </div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  +₹{commercialEconomics.netEbitdaAfterOwner.toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>

          {/* Fleet Multiplier Scaler */}
          <div className={`p-6 rounded-3xl border ${
            isLight ? "bg-white/90 border-black/[0.08]" : "bg-[#0d0e12] border-white/[0.08]"
          } space-y-4`}>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h4 className="text-base font-bold text-white">Fleet Rollout Multiplier</h4>
                <p className="text-xs text-gray-400">Scale across owner&apos;s entire fleet</p>
              </div>
              <span className="text-sm font-mono font-bold text-purple-400 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20">
                {fleetCount} Buses
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={fleetCount}
                onChange={(e) => setFleetCount(Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-white/[0.1] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>1 Bus (Pilot)</span>
                <span>10 Buses (Route)</span>
                <span>25 Buses (Town)</span>
                <span>50 Buses (District)</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-gray-400">Total Fleet Procurement Capex:</span>
                <span className="font-mono font-bold text-white">₹{commercialEconomics.totalFleetCapex.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-gray-400">Total Monthly Owner Disbursements:</span>
                <span className="font-mono font-bold text-blue-400">₹{commercialEconomics.totalFleetOwnerPayout.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-gray-400">Total Monthly Gross Billing:</span>
                <span className="font-mono font-bold text-emerald-400">₹{commercialEconomics.totalFleetGross.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between py-1 pt-2">
                <span className="text-gray-300 font-semibold">Your Fleet Net Monthly Profit:</span>
                <span className="font-mono font-bold text-base text-emerald-400">
                  ₹{commercialEconomics.totalFleetNetProfit.toLocaleString()} / mo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 1: BUS OWNER PACKAGES & FINANCING (PLAN CARDS & EMIs)
          ══════════════════════════════════════════════════════════════════════════ */}
      {(viewMode === "packages" || viewMode === "all") && (
        <div id="fleet-packages-section" className="space-y-6 pt-2">
          {/* ─── CONSOLIDATED FLEET COMMAND CENTER ─────────────────────────────────── */}
          <div className="rounded-3xl p-1.5 bg-gradient-to-b from-white/10 via-white/5 to-white/[0.02] border border-white/10 shadow-2xl">
            <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#0a0c10]/95 p-5 md:p-7 space-y-6">
              {/* Header: Title & Synced Hardware Spec Pill */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400 font-mono">
                      Fleet Command Center
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300 border border-white/10">
                      Smart Matching Engine
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Turnkey Bus Owner Packages & Financing
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                    Compare complete turnkey kits engineered for Kerala private buses. Filter by bus operating model, match installed hardware, and toggle flexible 0% interest financing terms.
                  </p>
                </div>

                {/* Live Synced Hardware Status Pill with Bridge to Studio */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between sm:justify-start gap-4 self-start lg:self-auto w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-lg flex-shrink-0">
                      {synthesizedPlan.id === "plan_screen_refit" ? "🖥️" : synthesizedPlan.id === "plan_etm_pos" ? "💳" : synthesizedPlan.id === "plan_saas" ? "🎫" : "⚡"}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Currently Configured</div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{synthesizedPlan.title}</span>
                        <span className="text-emerald-400 font-mono">(₹{hardwareCapex.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => inspectPlanInStudio(synthesizedPlan as unknown as BusOwnerPlanCard)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ml-auto sm:ml-0"
                  >
                    <span>🛠️ Studio</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>

              {/* Row 1: Plan Family Segments (All, Only ETM, Ads Only, Combo) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🗂️</span> 1. Select Plan Family
                  </span>
                  <span className="text-[11px] text-gray-400">3 Core Operating Archetypes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: "all" as PlanCategory,
                      title: "All Packages",
                      count: BUS_OWNER_PLANS.length,
                      icon: "🌟",
                      subtext: `View all ${BUS_OWNER_PLANS.length} turnkey packages`,
                      borderActive: "border-blue-500/70 bg-blue-500/10 ring-1 ring-blue-500/30",
                      textColor: "text-blue-400",
                    },
                    {
                      id: "etm_only" as PlanCategory,
                      title: "Only ETM Plans",
                      count: BUS_OWNER_PLANS.filter((p) => p.category === "etm_only").length,
                      icon: "🎫",
                      subtext: "Zero screen needed • Mobile ETM & POS",
                      borderActive: "border-rose-500/70 bg-rose-500/10 ring-1 ring-rose-500/30",
                      textColor: "text-rose-400",
                    },
                    {
                      id: "ads_only" as PlanCategory,
                      title: "Ads Only Plans",
                      count: BUS_OWNER_PLANS.filter((p) => p.category === "ads_only").length,
                      icon: "📺",
                      subtext: "Passenger TV ads • Manual cash tickets",
                      borderActive: "border-cyan-500/70 bg-cyan-500/10 ring-1 ring-cyan-500/30",
                      textColor: "text-cyan-400",
                    },
                    {
                      id: "combo" as PlanCategory,
                      title: "ETM + Ads Combo",
                      count: BUS_OWNER_PLANS.filter((p) => p.category === "combo").length,
                      icon: "⚡",
                      subtext: "Ad rent income + Digital ticketing",
                      borderActive: "border-purple-500/70 bg-purple-500/10 ring-1 ring-purple-500/30",
                      textColor: "text-purple-400",
                    },
                  ].map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const isConfiguredCategory = synthesizedPlan.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedCategory(cat.id);
                        }}
                        className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? `${cat.borderActive} shadow-lg shadow-black/40 scale-[1.01]`
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15 text-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{cat.icon}</span>
                            <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-white" : "text-gray-200"}`}>
                              {cat.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isConfiguredCategory && cat.id !== "all" && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400 text-black leading-tight">
                                Active
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isSelected ? "bg-white/20 text-white" : "bg-white/[0.06] text-gray-400"
                              }`}
                            >
                              {cat.count}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-snug">
                          {cat.subtext}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Custom Bus Hardware Status Profiler (Dropdowns) */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <span>🛠️</span> 2. Custom Bus Hardware Status Profiler
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
                      Custom Hardware Matcher
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Select your current bus hardware to instantly filter matching turnkey packages
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dropdown 1: Current TV Status */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="text-base">📺</span>
                        <span>Current TV Status:</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {hardwareScreenFilter !== "all" && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Active
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-500">
                          {hardwareScreenFilter === "all" ? `${BUS_OWNER_PLANS.length} pkgs` : hardwareScreenFilter === "none" ? "6 pkgs" : hardwareScreenFilter === "normal" ? "4 pkgs" : hardwareScreenFilter === "smart" ? "5 pkgs" : "2 pkgs"}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={hardwareScreenFilter}
                        onChange={(e) => {
                          playClickSound();
                          const val = e.target.value as TVOption | "all";
                          setHardwareScreenFilter(val);
                          setQuickFilterChip("custom");
                          setSelectedCategory("all");
                        }}
                        className="w-full bg-[#12141d] text-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-white/15 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all cursor-pointer appearance-none pr-8"
                      >
                        <option value="all">📋 All TV Statuses (Show All {BUS_OWNER_PLANS.length} Packages)</option>
                        <option value="normal">📺 Currently Have Normal In-Bus TV (4 Packages • Re-use Screen & Save ₹7,500)</option>
                        <option value="smart">⚡ Currently Have Smart Android TV (5 Packages • Zero External Box & Save ₹9,350)</option>
                        <option value="none">🚫 Currently Not Having TV / Bare Bus (6 Packages • Refit 32" Screen or ETM)</option>
                        <option value="no_tv_etm">🎫 No TV Needed / ETM-Only Route (2 Packages • Zero Screen Capex)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                        ▼
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      {hardwareScreenFilter === "all" && "Showing packages across all display configurations."}
                      {hardwareScreenFilter === "normal" && "Reuses your roof TV via HDMI. We only supply the 4G OTT media player."}
                      {hardwareScreenFilter === "smart" && "Direct APK stream on your Smart TV motherboard. Lowest capex setup."}
                      {hardwareScreenFilter === "none" && "Bare bulkhead buses. Includes 32\" transit display refits and ETM kits."}
                      {hardwareScreenFilter === "no_tv_etm" && "Zero screen maintenance. Dedicated to digital fare collection & live GPS."}
                    </div>
                  </div>

                  {/* Dropdown 2: Current Ticketing Status */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="text-base">🎫</span>
                        <span>Current Ticketing Status:</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {hardwareTicketingFilter !== "all" && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-500">
                          {hardwareTicketingFilter === "all" ? `${BUS_OWNER_PLANS.length} pkgs` : hardwareTicketingFilter === "tickets" ? "13 pkgs" : "10 pkgs"}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={hardwareTicketingFilter}
                        onChange={(e) => {
                          playClickSound();
                          const val = e.target.value as "all" | "tickets" | "etm";
                          setHardwareTicketingFilter(val);
                          setQuickFilterChip("custom");
                          setSelectedCategory("all");
                        }}
                        className="w-full bg-[#12141d] text-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-white/15 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none transition-all cursor-pointer appearance-none pr-8"
                      >
                        <option value="all">📋 All Ticketing Statuses (Show All {BUS_OWNER_PLANS.length} Packages)</option>
                        <option value="tickets">🎫 Currently Using Paper Tickets (Show All 13 Upgrade Plans)</option>
                        <option value="etm">💳 Currently Using Existing ETM (Re-use ETM or Modernize)</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                        ▼
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      {hardwareTicketingFilter === "all" && `Showing packages across all bus starting conditions (${BUS_OWNER_PLANS.length} packages).`}
                      {hardwareTicketingFilter === "tickets" && "Bus currently uses manual paper tickets. Shows all compatible upgrade paths: Screen Ads, Digital ETM, and Combos."}
                      {hardwareTicketingFilter === "etm" && "Bus already has an electronic ticket machine. Shows packages that reuse existing ETM or modernize to Android Smart POS."}
                    </div>
                  </div>
                </div>

                {/* Active Custom Match Callout Pill */}
                {(hardwareScreenFilter !== "all" || hardwareTicketingFilter !== "all") && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs">
                      <div className="flex items-center gap-2 text-blue-300 font-medium">
                        <span>🎯</span>
                        <span>
                          Custom Bus Starting Profile:{" "}
                          <strong className="text-white">
                            {hardwareScreenFilter === "normal" && "Normal TV"}
                            {hardwareScreenFilter === "smart" && "Smart TV"}
                            {hardwareScreenFilter === "none" && "Bare Bus (No TV)"}
                            {hardwareScreenFilter === "no_tv_etm" && "ETM-Only Route"}
                            {hardwareScreenFilter === "all" && "Any TV"}
                          </strong>
                          {" + "}
                          <strong className="text-white">
                            {hardwareTicketingFilter === "tickets" && "Currently Using Paper Tickets"}
                            {hardwareTicketingFilter === "etm" && "Currently Using Existing ETM"}
                            {hardwareTicketingFilter === "all" && "Any Ticketing"}
                          </strong>
                          {" "}➔ Showing <strong className="text-emerald-400 font-bold">{filteredPlans.length}</strong> compatible upgrade {filteredPlans.length === 1 ? "package" : "packages"}!
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          playClickSound();
                          setHardwareScreenFilter("all");
                          setHardwareTicketingFilter("all");
                          setSelectedCategory("all");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>↺</span>
                        <span>Reset to All</span>
                      </button>
                    </div>

                    {/* Context Explanation when Bare Bus + Paper Tickets is selected */}
                    {hardwareScreenFilter === "none" && hardwareTicketingFilter === "tickets" && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">🚀</span>
                        <div>
                          <strong>Showing all 6 upgrade paths for your bare bus:</strong> 1 Ads-Only Screen Refit (₹11,350), 2 Digital ETM Upgrades (from ₹2,800), and 3 Complete Turnkey Screen + ETM Combos (including All-in-One 32&quot; Smart TV from ₹13,550). Filter by the tabs above to narrow by category!
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Row 3: Financing & 0% EMI Payment Model */}
              <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <span>💳</span> 3. Financing & Payment Model
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      0% Extra Interest
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">
                    Choose upfront payment or flexible installments deducted from monthly ad revenue
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                  {[
                    { id: "ad_rent_deduct" as PaymentTerm, label: "⚡ ₹0 Upfront", sub: "Deduct Rent", badge: "TOP" },
                    { id: "full" as PaymentTerm, label: "Full Capex", sub: "1-Time", badge: null },
                    { id: "emi_3" as PaymentTerm, label: "3M EMI", sub: "0% Int.", badge: null },
                    { id: "emi_6" as PaymentTerm, label: "6M EMI", sub: "Low Mo.", badge: null },
                    { id: "emi_12" as PaymentTerm, label: "12M EMI", sub: "Micro", badge: null },
                  ].map((term) => {
                    const isSelected = paymentTerm === term.id;
                    return (
                      <button
                        key={term.id}
                        onClick={() => {
                          playClickSound();
                          setPaymentTerm(term.id);
                        }}
                        className={`relative p-2.5 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs font-bold leading-none">{term.label}</span>
                          {term.badge && (
                            <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded-full bg-emerald-400 text-black leading-tight">
                              {term.badge}
                            </span>
                          )}
                        </div>
                        <div className={`text-[9px] leading-tight mt-1 ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                          {term.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Live Results Status Bar, Context Insights & Advanced Filter Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-gray-300 font-medium">
                    Showing <strong className="text-white font-bold">{filteredPlans.length} of {BUS_OWNER_PLANS.length}</strong> packages
                  </span>

                  {/* Dynamic Context Advice Badge */}
                  {hardwareScreenFilter === "none" && selectedCategory === "all" && (
                    <span className="text-cyan-300 font-medium text-[11px] bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20 flex items-center gap-1">
                      <span>💡</span>
                      <span>Bare bus: 6 options (ETM from ₹2,800, Screen/Smart TV from ₹11,350)</span>
                    </span>
                  )}
                  {hardwareScreenFilter === "none" && selectedCategory !== "all" && (
                    <span className="text-amber-300 font-medium text-[11px] bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>6 total Bare Bus options exist across all categories</span>
                    </span>
                  )}
                  {hardwareScreenFilter === "normal" && (
                    <span className="text-emerald-400 font-medium text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <span>♻️</span>
                      <span>Reusing Normal TV saves ₹7,500</span>
                    </span>
                  )}
                  {hardwareScreenFilter === "smart" && (
                    <span className="text-emerald-400 font-medium text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <span>⚡</span>
                      <span>Reusing Smart TV saves ₹9,350</span>
                    </span>
                  )}
                  {hardwareScreenFilter === "no_tv_etm" && (
                    <span className="text-rose-300 font-medium text-[11px] bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20 flex items-center gap-1">
                      <span>🛡️</span>
                      <span>Zero screen maintenance from ₹899/mo</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                  {/* Sort By Factors Dropdown */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 transition-all text-xs shadow-sm">
                    <span className="text-gray-400 font-mono flex items-center gap-1">
                      <span className="text-sm">⇅</span>
                      <span className="font-semibold text-gray-300">Sort:</span>
                    </span>
                    <div className="relative">
                      <select
                        value={planSortOption}
                        onChange={(e) => {
                          playClickSound();
                          setPlanSortOption(e.target.value as PlanSortOption);
                        }}
                        className="bg-transparent text-white font-medium focus:outline-none cursor-pointer appearance-none pr-4 text-xs"
                      >
                        <option value="cost_asc" className="bg-[#12141d] text-white">💰 Lowest Capex (Low ➔ High)</option>
                        <option value="cost_desc" className="bg-[#12141d] text-white">💎 Full Turnkey (High ➔ Low)</option>
                        <option value="payout_desc" className="bg-[#12141d] text-white">📈 Max Monthly Rent (High ➔ Low)</option>
                        <option value="setup_asc" className="bg-[#12141d] text-white">⚡ Fastest Setup (5–15 mins)</option>
                        <option value="savings_desc" className="bg-[#12141d] text-white">♻️ Max Capex Saved (Reused)</option>
                        <option value="recommended" className="bg-[#12141d] text-white">⭐ Curated / Recommended</option>
                      </select>
                      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Expand/Collapse All Hardware Devices */}
                  <button
                    onClick={toggleAllHardwareBreakdowns}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                      areAllDevicesExpanded
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-white/[0.03] text-gray-400 hover:text-white border-white/[0.06]"
                    }`}
                  >
                    <span>📦</span>
                    <span>{areAllDevicesExpanded ? "Collapse All Devices" : "Expand All Devices"}</span>
                    <span>{areAllDevicesExpanded ? "▴" : "▾"}</span>
                  </button>

                  {/* Advanced Filters Drawer Toggle */}
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isAdvancedFilterOpen || hardwareTicketingFilter !== "all" || hardwareGoalFilter !== "all"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-white/[0.03] text-gray-400 hover:text-white border-white/[0.06]"
                    }`}
                  >
                    <span>⚙️</span>
                    <span>Advanced Filters</span>
                    <span>{isAdvancedFilterOpen ? "▴" : "▾"}</span>
                  </button>

                  {/* Reset Filters button if active */}
                  {(selectedCategory !== "all" ||
                    hardwareScreenFilter !== "all" ||
                    hardwareTicketingFilter !== "all" ||
                    hardwareGoalFilter !== "all" ||
                    planSortOption !== "cost_asc") && (
                    <button
                      onClick={resetHardwareFilters}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>↺</span>
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Factor Sort Chips Bar */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 font-bold mr-1 flex items-center gap-1">
                  <span>⇅</span>
                  <span>Sort Factors:</span>
                </span>
                {[
                  { id: "cost_asc" as PlanSortOption, label: "💰 Lowest Upfront Capex" },
                  { id: "cost_desc" as PlanSortOption, label: "💎 Full Turnkey Capex" },
                  { id: "payout_desc" as PlanSortOption, label: "📈 Max Monthly Rent" },
                  { id: "setup_asc" as PlanSortOption, label: "⚡ Fastest Setup" },
                  { id: "savings_desc" as PlanSortOption, label: "♻️ Max Capex Saved" },
                  { id: "recommended" as PlanSortOption, label: "⭐ Curated Default" },
                ].map((chip) => {
                  const isActive = planSortOption === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => {
                        playClickSound();
                        setPlanSortOption(chip.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? "bg-blue-500/20 text-blue-200 border-blue-500/50 shadow-sm shadow-blue-500/20 font-bold ring-1 ring-blue-500/30"
                          : "bg-white/[0.02] text-gray-400 hover:text-white border-white/[0.06] hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Expandable Advanced Filters Drawer */}
              <AnimatePresence>
                {isAdvancedFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-3 border-t border-white/[0.06]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Filter 1: Primary Commercial Goal */}
                      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-300 flex items-center justify-between">
                          <span>Commercial Revenue Goal:</span>
                          {hardwareGoalFilter !== "all" && (
                            <span className="text-[9px] text-emerald-400 font-mono">Active</span>
                          )}
                        </label>
                        <select
                          value={hardwareGoalFilter}
                          onChange={(e) => {
                            playClickSound();
                            setHardwareGoalFilter(e.target.value as "all" | "rent" | "saas" | "trial");
                          }}
                          className="w-full bg-[#12131a] text-white text-xs rounded-xl px-3 py-2 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                        >
                          <option value="all">All Commercial Goals</option>
                          <option value="rent">Guaranteed Monthly Ad Rent (₹2,500/mo)</option>
                          <option value="saas">Stop Fare Theft & Commuter GPS (SaaS)</option>
                          <option value="trial">Free 24-48hr Route Trial (₹0)</option>
                        </select>
                      </div>

                      {/* Filter 2: Quick Profiles */}
                      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-300">
                          Special Hardware Profiles:
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleQuickFilter("ais140")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex-1 transition-all cursor-pointer ${
                              quickFilterChip === "ais140"
                                ? "bg-sky-600 text-white border-sky-400"
                                : "bg-white/[0.04] text-gray-300 border-white/10 hover:bg-white/[0.08]"
                            }`}
                          >
                            Govt AIS-140 GPS
                          </button>
                          <button
                            onClick={() => handleQuickFilter("trial")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex-1 transition-all cursor-pointer ${
                              quickFilterChip === "trial"
                                ? "bg-teal-600 text-white border-teal-400"
                                : "bg-white/[0.04] text-gray-300 border-white/10 hover:bg-white/[0.08]"
                            }`}
                          >
                            Free 24h Pilot
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Payment Term Dynamic Explanation Banner */}
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[11px] text-gray-400 flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">
                  {paymentTerm === "ad_rent_deduct" ? "💡" : paymentTerm === "full" ? "💼" : "📅"}
                </span>
                <div>
                  <strong className="text-white font-semibold">
                    {paymentTerm === "ad_rent_deduct" && "Zero Out-of-Pocket Advantage: "}
                    {paymentTerm === "full" && "One-Time Direct Equipment Capex: "}
                    {paymentTerm === "emi_3" && "3-Month 0% Interest Equal Installments: "}
                    {paymentTerm === "emi_6" && "6-Month Low-Burden Fleet EMI: "}
                    {paymentTerm === "emi_12" && "12-Month Extended Micro-Installments: "}
                  </strong>
                  <span>
                    {paymentTerm === "ad_rent_deduct" &&
                      "₹0 cash upfront. Hardware capex is deducted across 3 equal monthly installments from your ₹2,500/mo guaranteed ad rent. You get net positive cashflow starting Month 1, and 100% full ad rent from Month 4 onwards!"}
                    {paymentTerm === "full" &&
                      "Pay hardware procurement cost once upon installation. 100% asset ownership is yours immediately, and you collect the full monthly rental payout with zero deductions starting Day 1."}
                    {paymentTerm === "emi_3" &&
                      "Spread equipment capex across 3 equal monthly installments at 0% extra interest, preserving your liquid working capital."}
                    {paymentTerm === "emi_6" &&
                      "Cut monthly installment amounts in half over 6 months to maintain high net cashflow right from the start."}
                    {paymentTerm === "emi_12" &&
                      "Minimal monthly outlay spread across a 1-year timeline for maximum financial ease across larger bus fleets."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Cards Grid (Filtered) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.length === 0 ? (
            <div className="col-span-full p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <div className="text-lg font-bold text-white">No Standard Package Matches This Specific Combination</div>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                You can configure this exact custom setup using the 5-stage interactive decision tree above, or reset your filters to view all standard packages.
              </p>
              <button
                onClick={resetHardwareFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>↺</span>
                <span>Reset Filters (Show All {BUS_OWNER_PLANS.length} Packages)</span>
              </button>
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const pricing = getPlanPricing(plan, paymentTerm);
              const isSelected =
                synthesizedPlan.id === plan.id ||
                (selectedTV === plan.tv &&
                  selectedCompute === plan.compute &&
                  selectedGPS === plan.gps &&
                  selectedNet === plan.net &&
                  selectedTicketing === plan.ticketing &&
                  payoutType === plan.commercialModel);

              const isFilterActive =
                selectedCategory !== "all" ||
                quickFilterChip !== "all" ||
                hardwareScreenFilter !== "all" ||
                hardwareTicketingFilter !== "all" ||
                hardwareGoalFilter !== "all";

              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    if (!isSelected) applyPlan(plan);
                  }}
                  className={`relative rounded-[2rem] p-1.5 transition-all duration-300 group cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-emerald-500/5 ring-2 ring-emerald-400/60 shadow-2xl shadow-emerald-500/20 scale-[1.01]"
                      : plan.category === "etm_only"
                      ? "bg-gradient-to-b from-rose-500/25 via-white/[0.04] to-white/[0.02] border border-rose-500/25 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10"
                      : plan.category === "ads_only"
                      ? "bg-gradient-to-b from-cyan-500/25 via-white/[0.04] to-white/[0.02] border border-cyan-500/25 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
                      : "bg-gradient-to-b from-purple-500/25 via-white/[0.04] to-white/[0.02] border border-purple-500/25 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
                  }`}
                >
                  <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c0e14]/95 p-5 sm:p-6 flex flex-col justify-between h-full space-y-6">
                    {/* Top Badge & Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/[0.06] text-gray-300 border border-white/[0.08]">
                            {plan.code}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              plan.category === "etm_only"
                                ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                                : plan.category === "ads_only"
                                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                                : "bg-purple-500/20 border-purple-500/40 text-purple-300"
                            }`}
                          >
                            {plan.category === "etm_only" && "🎫 Only ETM"}
                            {plan.category === "ads_only" && "📺 Ads Only"}
                            {plan.category === "combo" && "⚡ ETM + Ads"}
                          </span>
                          {isFilterActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                              <span>🎯</span> Match
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${plan.badgeColor}`}
                        >
                          {plan.badge}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                            {plan.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{plan.title}</h3>
                            <div className="text-xs text-[#0A84FF] font-medium">{plan.tagline}</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{plan.busSuitability}</p>
                      </div>

                      {/* Hardware Reusability Pill */}
                      {plan.hardwareReused && (
                        <div className="flex items-center justify-between text-[11px] bg-white/[0.03] border border-white/[0.06] rounded-xl px-2.5 py-1.5">
                          <span className="text-gray-400 flex items-center gap-1 text-[10px]">
                            <span>♻️</span> Reuses:
                          </span>
                          <span className="text-gray-200 font-medium text-right text-[10px] truncate max-w-[200px]">
                            {plan.hardwareReused}
                          </span>
                        </div>
                      )}

                      {/* Pricing Box */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <div>
                            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                              {pricing.mainAmount}
                            </div>
                            <div className="text-[11px] font-semibold text-gray-400">
                              {pricing.periodLabel}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-gray-400">Owner Economics</div>
                            <div
                              className={`text-xs font-mono font-bold ${
                                plan.commercialModel === "saas_etm"
                                  ? "text-rose-400"
                                  : plan.ownerReturns.type === "trial"
                                  ? "text-teal-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {plan.ownerReturns.amountLabel}
                            </div>
                            {plan.hardwareSavings && plan.hardwareSavings > 0 && (
                              <div className="text-[9px] font-mono text-emerald-400/90 font-medium mt-0.5">
                                Saves ₹{plan.hardwareSavings.toLocaleString()} capex
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-400 pt-1 border-t border-white/[0.04] leading-tight">
                          {pricing.detail}
                        </div>

                        {/* Net Cashflow Pill */}
                        <div
                          className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                            plan.commercialModel === "saas_etm"
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                              : plan.ownerReturns.type === "trial"
                              ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          }`}
                        >
                          <span>
                            {plan.commercialModel === "saas_etm"
                              ? "🛡️"
                              : plan.ownerReturns.type === "trial"
                              ? "🧪"
                              : "💰"}
                          </span>
                          <span className="leading-tight">{pricing.netRentPill}</span>
                        </div>
                      </div>

                      {/* In-Bus Hardware Checklist & Interactive Devices Dropdown */}
                      {(() => {
                        const planDevices = getPlanDeviceSpecs(plan);
                        const isDevicesOpen = expandedHardwareCards[plan.id] ?? false;
                        const includedCount = planDevices.filter((d) => d.status === "included").length;
                        const reusedCount = planDevices.filter((d) => d.status === "reused").length;
                        const notIncludedCount = planDevices.filter((d) => d.status === "not_included").length;

                        return (
                          <div className="space-y-2 pt-1">
                            {/* Visual Hardware Device Strip (Always Visible Quick Bar) */}
                            <div className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 font-mono uppercase font-bold tracking-wider flex items-center gap-1.5">
                                  <span>⚙️</span> In-Bus Devices:
                                </span>
                                <span className="font-mono text-gray-400 text-[10px]">
                                  <strong className="text-emerald-400 font-bold">{includedCount}</strong> In Kit
                                  {reusedCount > 0 && (
                                    <> • <strong className="text-sky-400 font-bold">{reusedCount}</strong> Reused</>
                                  )}
                                  {notIncludedCount > 0 && (
                                    <> • <strong className="text-gray-500 font-bold">{notIncludedCount}</strong> Excl</>
                                  )}
                                </span>
                              </div>

                              {/* 5 Device Mini Badges with SVG Icons */}
                              <div className="grid grid-cols-5 gap-1.5">
                                {planDevices.map((dev) => {
                                  const isInc = dev.status === "included";
                                  const isReu = dev.status === "reused";
                                  return (
                                    <div
                                      key={dev.id}
                                      title={`${dev.categoryLabel}: ${dev.name} (${dev.statusText})`}
                                      onClick={(e) => toggleHardwareBreakdown(plan.id, e)}
                                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer hover:scale-105 ${
                                        isInc
                                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                          : isReu
                                          ? "bg-sky-500/10 border-sky-500/30 text-sky-300"
                                          : "bg-white/[0.02] border-white/[0.06] text-gray-500 opacity-60"
                                      }`}
                                    >
                                      <div className="relative">
                                        <DeviceSvgIcon type={dev.id} status={dev.status} className="w-4 h-4" />
                                        <span
                                          className={`absolute -top-1 -right-1.5 text-[8px] font-black w-3 h-3 rounded-full flex items-center justify-center leading-none shadow ${
                                            isInc
                                              ? "bg-emerald-400 text-black font-bold"
                                              : isReu
                                              ? "bg-sky-400 text-black font-bold"
                                              : "bg-gray-800 text-gray-400 border border-white/20"
                                          }`}
                                        >
                                          {isInc ? "✓" : isReu ? "♻" : "✕"}
                                        </span>
                                      </div>
                                      <span className="text-[9px] font-mono font-medium leading-none truncate max-w-[48px]">
                                        {dev.id === "screen"
                                          ? "Screen"
                                          : dev.id === "player"
                                          ? "Player"
                                          : dev.id === "gps"
                                          ? "GPS"
                                          : dev.id === "network"
                                          ? "4G"
                                          : "POS"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Dropdown Toggle Trigger Button */}
                              <button
                                type="button"
                                onClick={(e) => toggleHardwareBreakdown(plan.id, e)}
                                className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-semibold text-gray-300 hover:text-white flex items-center justify-between transition-all cursor-pointer group/btn"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>{isDevicesOpen ? "▴" : "▾"}</span>
                                  <span>{isDevicesOpen ? "Hide Devices Breakdown" : "View Devices Included & Excluded"}</span>
                                </span>
                                <span className="text-[10px] font-mono text-blue-400 group-hover/btn:text-blue-300">
                                  {isDevicesOpen ? "Collapse ▴" : "5 Devices ➔"}
                                </span>
                              </button>
                            </div>

                            {/* Expandable Device Matrix Drawer */}
                            <AnimatePresence>
                              {isDevicesOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden space-y-2 pt-2"
                                >
                                  <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center justify-between">
                                    <span>Detailed Device Specifications</span>
                                    <span className="text-emerald-400 font-mono text-[9px]">Included vs Reused vs Excluded</span>
                                  </div>

                                  <div className="space-y-1.5">
                                    {planDevices.map((dev) => {
                                      const isInc = dev.status === "included";
                                      const isReu = dev.status === "reused";
                                      return (
                                        <div
                                          key={dev.id}
                                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                                            isInc
                                              ? "bg-emerald-500/[0.06] border-emerald-500/25"
                                              : isReu
                                              ? "bg-sky-500/[0.06] border-sky-500/25"
                                              : "bg-white/[0.01] border-white/[0.05] opacity-65"
                                          }`}
                                        >
                                          <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                              isInc
                                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                : isReu
                                                ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                                                : "bg-white/5 text-gray-500 border border-white/10"
                                            }`}
                                          >
                                            <DeviceSvgIcon type={dev.id} status={dev.status} className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                              <span className="text-xs font-bold text-white truncate">{dev.name}</span>
                                              <span
                                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full border whitespace-nowrap ${
                                                  isInc
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                    : isReu
                                                    ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                                                    : "bg-white/[0.06] text-gray-400 border-white/10"
                                                }`}
                                              >
                                                {dev.statusText}
                                              </span>
                                            </div>
                                            <div className="text-[10px] text-gray-300 truncate">{dev.spec}</div>
                                            <div className="text-[9px] text-gray-500 truncate">{dev.subtext}</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Commuter & Route Benefits (Inside Dropdown) */}
                                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                      Commuter & Route Benefits
                                    </div>
                                    <ul className="space-y-1 text-[11px] text-gray-300">
                                      {plan.commuterPerks.map((perk, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5">
                                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">●</span>
                                          <span className="leading-tight text-[11px] text-gray-300">{perk}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Card Footer & Action Buttons */}
                    <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="flex items-center gap-1 font-mono">
                          <span>⏱️</span> {plan.setupTime}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500">
                          Full Capex: ₹{plan.fullAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Primary CTA */}
                      {isSelected ? (
                        <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>✓ Selected & Active in Hardware Engine</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => applyPlan(plan)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0A84FF] to-blue-600 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 flex items-center justify-between group/btn cursor-pointer"
                        >
                          <span>Select Plan & Configure Fleet</span>
                          <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs group-hover/btn:translate-x-0.5 transition-transform">
                            ➔
                          </span>
                        </button>
                      )}

                      {/* Secondary Bridge Button to Studio */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inspectPlanInStudio(plan);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/15 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>🛠️</span>
                        <span>Inspect Hardware Specs in Studio</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Fleet Multiplier Quick Bar */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg flex-shrink-0">
              🚌
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Fleet Projections for {fleetCount} Buses</span>
                <span className="text-[10px] font-mono font-normal text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Slider synced
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                All calculations scale automatically with your fleet multiplier. Adjust slider above to see district-scale projections.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-gray-400 text-[10px]">Fleet Hardware Capex</div>
              <div className="text-white font-bold">
                ₹{(hardwareCapex * fleetCount).toLocaleString()}
              </div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-gray-400 text-[10px]">
                {paymentTerm === "ad_rent_deduct" ? "Monthly Rent Deduction (3M)" : "Monthly Installment"}
              </div>
              <div className="text-blue-400 font-bold">
                {paymentTerm === "ad_rent_deduct" || paymentTerm === "emi_3"
                  ? `₹${(Math.round(hardwareCapex / 3) * fleetCount).toLocaleString()} / mo`
                  : paymentTerm === "emi_6"
                  ? `₹${(Math.round(hardwareCapex / 6) * fleetCount).toLocaleString()} / mo`
                  : paymentTerm === "emi_12"
                  ? `₹${(Math.round(hardwareCapex / 12) * fleetCount).toLocaleString()} / mo`
                  : `₹0 (Paid Upfront)`}
              </div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-gray-400 text-[10px]">
                {payoutType === "saas_etm" ? "Total Fleet SaaS Fee" : "Net Owner Payout"}
              </div>
              <div
                className={`font-bold ${
                  payoutType === "saas_etm" ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {payoutType === "saas_etm"
                  ? `₹${(saasMonthlyFee * fleetCount).toLocaleString()} / mo`
                  : paymentTerm === "ad_rent_deduct"
                  ? `+₹${(
                      Math.max(0, commercialEconomics.ownerMonthlyIncome - Math.round(hardwareCapex / 3)) *
                      fleetCount
                    ).toLocaleString()} / mo`
                  : `+₹${(commercialEconomics.ownerMonthlyIncome * fleetCount).toLocaleString()} / mo`}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODE 3: PRINTABLE BUS OWNER EQUIPMENT HANDOVER AGREEMENT
          ══════════════════════════════════════════════════════════════════════════ */}
      {(viewMode === "agreement" || viewMode === "all") && (
        <div
          id="printable-owner-handover"
          className={`p-6 sm:p-8 rounded-3xl border ${
            isLight ? "bg-white text-black border-black/10 shadow-lg" : "bg-[#0b0c10] text-white border-white/10"
          } space-y-6 print:m-0 print:p-6 print:border-none print:shadow-none`}
        >
          {/* Agreement Mode Navigation Bar (Screen Only) */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] print:hidden">
            <button
              onClick={() => {
                playClickSound();
                setViewMode("packages");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>←</span>
              <span>Back to Packages Catalog</span>
            </button>

            <button
              onClick={handlePrintHandover}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print / Export Agreement PDF</span>
            </button>
          </div>

          {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08] print:border-black/20">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#0A84FF]">
              GetMyBus Transit Telematics & Screen Network
            </div>
            <h2 className="text-2xl font-bold mt-1">
              {payoutType === "saas_etm"
                ? "Bus ETM Digital Ticketing & Commuter Telematics Agreement"
                : "Bus Equipment Installation & Revenue Agreement"}
            </h2>
            <p className="text-xs text-gray-400 print:text-gray-600">
              Form ref: <span className="font-mono font-semibold">GMB-{payoutType === "saas_etm" ? "SAAS" : "OWNER"}-{synthesizedPlan.code.replace(" ", "-")}</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs text-gray-400 print:text-gray-600">Agreement Date</div>
            <div className="text-sm font-semibold font-mono">
              {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              {payoutType === "saas_etm"
                ? "Agreement Type: B2B SaaS Subscription & Passenger Telematics"
                : "Agreement Type: Non-Exclusive Route License"}
            </div>
          </div>
        </div>

        {/* Bus & Operator Metadata Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-300">
            <div className="text-gray-400 print:text-gray-600 text-[10px] uppercase font-bold">Bus Registration No.</div>
            <div className="font-mono font-bold text-sm mt-1 text-white print:text-black">KL- ______ - ______</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-300">
            <div className="text-gray-400 print:text-gray-600 text-[10px] uppercase font-bold">Route & Terminal</div>
            <div className="font-semibold text-sm mt-1 text-white print:text-black">__________________</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-300">
            <div className="text-gray-400 print:text-gray-600 text-[10px] uppercase font-bold">Bus Operator / Owner</div>
            <div className="font-semibold text-sm mt-1 text-white print:text-black">__________________</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-300">
            <div className="text-gray-400 print:text-gray-600 text-[10px] uppercase font-bold">
              {payoutType === "saas_etm" ? "Monthly Platform Fee (Paid by Operator)" : "Monthly Owner Compensation"}
            </div>
            <div className={`font-mono font-bold text-sm mt-1 ${payoutType === "saas_etm" ? "text-rose-400 print:text-rose-700" : "text-blue-400 print:text-blue-700"}`}>
              {payoutType === "saas_etm"
                ? `₹${saasMonthlyFee.toLocaleString()} / month`
                : `₹${commercialEconomics.ownerMonthlyIncome.toLocaleString()} / month`}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] print:bg-gray-100 print:border-gray-300 col-span-2 sm:col-span-1">
            <div className="text-gray-400 print:text-gray-600 text-[10px] uppercase font-bold">Hardware Capex & Payment Plan</div>
            <div className="font-mono font-bold text-sm mt-1 text-emerald-400 print:text-emerald-700">
              {paymentTerm === "ad_rent_deduct"
                ? `₹0 Upfront (Deduct ₹${Math.round(hardwareCapex / 3).toLocaleString()}/mo x 3)`
                : paymentTerm === "emi_3"
                ? `3M EMI (₹${Math.round(hardwareCapex / 3).toLocaleString()}/mo)`
                : paymentTerm === "emi_6"
                ? `6M EMI (₹${Math.round(hardwareCapex / 6).toLocaleString()}/mo)`
                : paymentTerm === "emi_12"
                ? `12M EMI (₹${Math.round(hardwareCapex / 12).toLocaleString()}/mo)`
                : `Full Upfront (₹${hardwareCapex.toLocaleString()})`}
            </div>
          </div>
        </div>

        {/* Handover Equipment Inventory Checklist */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-300 print:text-gray-800">
            Installed Equipment & Telematics Checklist
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 print:border-black/20 text-gray-400 print:text-gray-600 uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Make / Model</th>
                  <th className="py-2">Serial Number / IMEI</th>
                  <th className="py-2 text-right">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] print:divide-gray-200">
                <tr>
                  <td className="py-2.5 font-medium">Passenger Screen Display</td>
                  <td className="py-2.5 text-gray-300 print:text-gray-700">
                    {selectedTV === "no_tv_etm"
                      ? "Not Applicable (ETM-Only Route)"
                      : selectedCompute === "new_smart_tv"
                      ? '32" Smart Android TV (Built-in Display Panel)'
                      : currentTV.title}
                  </td>
                  <td className="py-2.5 font-mono text-gray-400">
                    {selectedTV === "no_tv_etm" ? "N/A" : "SN: [ ____________________ ]"}
                  </td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">
                    {selectedTV === "no_tv_etm" ? "N/A" : "Verified Working"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Compute / Playback Unit</td>
                  <td className="py-2.5 text-gray-300 print:text-gray-700">{currentCompute.title}</td>
                  <td className="py-2.5 font-mono text-gray-400">
                    {currentCompute.id === "etm_standalone" ? "POS App: [ ACTIVE ]" : "MAC: [ ____________________ ]"}
                  </td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">Verified Working</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">GPS Tracking Sensor</td>
                  <td className="py-2.5 text-gray-300 print:text-gray-700">{currentGPS.title}</td>
                  <td className="py-2.5 font-mono text-gray-400">IMEI: [ ____________________ ]</td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">Calibrated</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium">Cellular 4G Data Card</td>
                  <td className="py-2.5 text-gray-300 print:text-gray-700">{currentNet.title}</td>
                  <td className="py-2.5 font-mono text-gray-400">SIM: [ ____________________ ]</td>
                  <td className="py-2.5 text-right text-emerald-400 font-semibold">Connected</td>
                </tr>
                {currentTicketing.cost > 0 && (
                  <tr>
                    <td className="py-2.5 font-medium">Digital Ticketing Terminal</td>
                    <td className="py-2.5 text-gray-300 print:text-gray-700">{currentTicketing.title}</td>
                    <td className="py-2.5 font-mono text-gray-400">POS ID: [ ____________________ ]</td>
                    <td className="py-2.5 text-right text-emerald-400 font-semibold">Trained</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Terms & Signatures */}
        <div className="pt-4 border-t border-white/10 print:border-black/20 text-[11px] text-gray-400 print:text-gray-600 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {payoutType === "saas_etm" ? (
                <>1. <strong>Ticketing Platform License</strong>: GetMyBus licenses its Android ticketing app, UPI payment gateway, and operator cloud reporting suite to the operator.</>
              ) : (
                <>1. <strong>Power & Ignition</strong>: The bus operator agrees to maintain vehicle inverter / battery connection during operating hours.</>
              )}
            </div>
            <div>
              {payoutType === "saas_etm" ? (
                <>2. <strong>Commuter Telematics</strong>: The ETM device transmits continuous GPS coordinates to GetMyBus commuter applications to power real-time bus tracking.</>
              ) : (
                <>2. <strong>Equipment Safety</strong>: The installed equipment remains the property of GetMyBus; operator agrees not to detach or tamper.</>
              )}
            </div>
            <div>
              {payoutType === "saas_etm" ? (
                <>3. <strong>Platform Service Fee & Billing</strong>: Operator agrees to pay the monthly SaaS fee of ₹{saasMonthlyFee.toLocaleString()} on or before the 5th of each month. Zero rent payable by GetMyBus.</>
              ) : (
                <>3. <strong>Monthly Disbursement & Payment Terms</strong>: Compensation of ₹{commercialEconomics.ownerMonthlyIncome.toLocaleString()} shall be disbursed by the 5th of each calendar month.{paymentTerm === "ad_rent_deduct" ? ` Operator selected the Zero-Upfront Plan: ₹${Math.round(hardwareCapex / 3).toLocaleString()}/mo is deducted for Months 1–3 (Net +₹${Math.max(0, commercialEconomics.ownerMonthlyIncome - Math.round(hardwareCapex / 3)).toLocaleString()}/mo credited). Month 4 onwards receives 100% full rent.` : paymentTerm !== "full" ? ` Hardware capex settled via monthly EMI schedule.` : ` Hardware capex of ₹${hardwareCapex.toLocaleString()} settled upfront upon handover.`}</>
              )}
            </div>
            <div>
              {payoutType === "saas_etm" ? (
                <>4. <strong>Anti-Fraud & Reconciliation</strong>: All ticket transactions are immutable and accessible in real-time via the GetMyBus Owner mobile app.</>
              ) : (
                <>4. <strong>Support & Maintenance</strong>: GetMyBus field engineers provide free 24-hour turnaround for any screen or software disruption.</>
              )}
            </div>
          </div>

          <div className="pt-8 flex justify-between items-end">
            <div className="space-y-1">
              <div className="w-48 border-b border-white/40 print:border-black h-8" />
              <div className="font-semibold text-white print:text-black">Bus Owner / Operator Signature</div>
              <div className="text-[10px] text-gray-500">Name & Seal</div>
            </div>

            <div className="space-y-1 text-right">
              <div className="w-48 border-b border-white/40 print:border-black h-8 ml-auto" />
              <div className="font-semibold text-white print:text-black">For GetMyBus (Authorized Signatory)</div>
              <div className="text-[10px] text-gray-500">Field Operations Engineer</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          HARDWARE BRANDS & PROCUREMENT SELECTION / CUSTOM PRICE MODAL
          ══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeProcurementModal && HARDWARE_BRANDS_DB[activeProcurementModal] && (() => {
          const dbItem = HARDWARE_BRANDS_DB[activeProcurementModal];
          const activeBrandId = selectedBrandOverrides[activeProcurementModal] || dbItem.options.find((o) => o.isBestChoice)?.id || dbItem.options[0].id;
          const isCustomActive = Boolean(customItemOverrides[activeProcurementModal]);
          const currentCustom = customItemOverrides[activeProcurementModal];

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
              onClick={() => setActiveProcurementModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-3xl my-8 rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
                  isLight ? "bg-white border-black/10 text-gray-900" : "bg-[#0d0f15] border-white/10 text-white"
                }`}
              >
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-transparent">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {dbItem.subsystemLabel} Subsystem
                      </span>
                      {isCustomActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ✏️ Custom Unit Price Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>🛒</span>
                      <span>{dbItem.title}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Compare real market models available on Amazon India, switch between brands, or set custom wholesale pricing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveProcurementModal(null)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all cursor-pointer"
                    title="Close modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Tab Switcher */}
                <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-white/[0.06] bg-black/20">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setModalActiveTab("brands");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      modalActiveTab === "brands"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-gray-400 hover:text-white bg-white/[0.02]"
                    }`}
                  >
                    <span>🛒</span>
                    <span>Amazon India Brands & Models</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
                      {dbItem.options.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setModalActiveTab("edit");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      modalActiveTab === "edit"
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-500/30"
                        : "text-gray-400 hover:text-white bg-white/[0.02]"
                    }`}
                  >
                    <span>✏️</span>
                    <span>Custom Price & Supplier Link</span>
                    {isCustomActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  {modalActiveTab === "brands" ? (
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
                        <span>Available hardware brands for fleet procurement:</span>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <span>✓</span> Verified Amazon India direct stock
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3.5">
                        {dbItem.options.map((opt) => {
                          const isCurrentlyChosen = !isCustomActive && activeBrandId === opt.id;

                          return (
                            <div
                              key={opt.id}
                              className={`p-4 rounded-2xl border transition-all duration-200 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isCurrentlyChosen
                                  ? "bg-gradient-to-r from-blue-500/15 via-blue-500/10 to-transparent border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10"
                                  : opt.isBestChoice
                                  ? "bg-amber-500/[0.03] border-amber-500/30 hover:border-amber-500/60"
                                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20"
                              }`}
                            >
                              <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-sm sm:text-base text-white">
                                    {opt.brand}
                                  </span>
                                  <span className="text-xs text-gray-300 font-medium">
                                    {opt.model}
                                  </span>

                                  {opt.isBestChoice && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                      <span>⭐</span>
                                      <span>Fleet Best Value Pick</span>
                                    </span>
                                  )}

                                  {isCurrentlyChosen && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                      <span>✓</span>
                                      <span>Active In Kit</span>
                                    </span>
                                  )}
                                </div>

                                {/* Amazon rating and reviews */}
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <div className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                                    <span>★</span>
                                    <span>{opt.rating.toFixed(1)}</span>
                                  </div>
                                  <span>•</span>
                                  <span className="text-gray-400">
                                    {opt.reviews.toLocaleString()} Amazon reviews
                                  </span>
                                  <span>•</span>
                                  <span className="text-blue-400 italic text-[11px]">
                                    {opt.bestReason}
                                  </span>
                                </div>

                                {/* Specs pills */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {opt.specs.map((sp, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-300"
                                    >
                                      {sp}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Price and Action Buttons */}
                              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] shrink-0">
                                <div className="text-right">
                                  <span className="text-[10px] text-gray-400 block sm:hidden">Amazon Price</span>
                                  <div className="text-xl font-bold font-mono text-white">
                                    ₹{opt.price.toLocaleString()}
                                  </div>
                                  <span className="text-[10px] text-gray-400 hidden sm:block">incl. taxes</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {/* Direct Amazon Link */}
                                  <a
                                    href={opt.amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                                    title="Open Amazon India product page"
                                  >
                                    <span>🛒</span>
                                    <span>Amazon India</span>
                                    <span>↗</span>
                                  </a>

                                  {/* Select Brand Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleSelectBrand(activeProcurementModal, opt.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isCurrentlyChosen
                                        ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                                    }`}
                                  >
                                    <span>{isCurrentlyChosen ? "✓ Selected" : "Select Brand"}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Tab 2: Custom Price & Supplier Editor */
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                          <span>💡</span>
                          <span>Custom Wholesale or Supplier Price Override</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          Have a local distributor, SP Road electronics vendor, or existing batch discount? Enter your custom unit price, supplier link, and notes here. All portal capex figures and BOM tables will immediately calculate using your custom rate.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Custom Unit Price */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white flex items-center justify-between">
                            <span>Custom Unit Price (₹) *</span>
                            <span className="text-[10px] text-gray-400 font-mono">Capex driver</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm">₹</span>
                            <input
                              type="number"
                              value={customEditPrice}
                              onChange={(e) => setCustomEditPrice(e.target.value)}
                              placeholder="e.g. 6200"
                              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                            />
                          </div>
                        </div>

                        {/* Custom Brand Name */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-white">Brand / Manufacturer Name</label>
                          <input
                            type="text"
                            value={customEditBrand}
                            onChange={(e) => setCustomEditBrand(e.target.value)}
                            placeholder="e.g. Local SP Road Vendor / VW OEM"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>

                        {/* Model / Part Number */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold text-white">Model / Hardware Specification</label>
                          <input
                            type="text"
                            value={customEditModel}
                            onChange={(e) => setCustomEditModel(e.target.value)}
                            placeholder={'e.g. 32" High-Brightness Transit Grade LED Panel with Inverter'}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>

                        {/* Supplier / Amazon URL */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold text-white flex items-center justify-between">
                            <span>Supplier / Amazon Purchase URL</span>
                            {customEditUrl && (
                              <a
                                href={customEditUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <span>Test Link</span>
                                <span>↗</span>
                              </a>
                            )}
                          </label>
                          <input
                            type="url"
                            value={customEditUrl}
                            onChange={(e) => setCustomEditUrl(e.target.value)}
                            placeholder="https://www.amazon.in/... or supplier portal URL"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>

                        {/* Custom Procurement Notes */}
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-xs font-semibold text-white">Wholesale / Vendor Procurement Notes</label>
                          <textarea
                            rows={2}
                            value={customEditNote}
                            onChange={(e) => setCustomEditNote(e.target.value)}
                            placeholder="e.g. Negotiated 12% bulk rebate with vendor for orders > 5 units"
                            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                      </div>

                      {/* Save Status & Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          {customEditSuccess ? (
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                              <span>✓</span>
                              <span>Custom specification saved! Hardware totals updated.</span>
                            </span>
                          ) : isCustomActive ? (
                            <span className="text-xs text-amber-300 font-mono">
                              Active: ₹{currentCustom?.price?.toLocaleString() || "0"} ({currentCustom?.brand || "Custom"})
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Currently using factory fleet default pick.
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => handleResetToDefaultBrand(activeProcurementModal)}
                            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Reset to Default Pick
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveCustomSpec}
                            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>💾</span>
                            <span>Save & Apply Price</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 px-6 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Real-time sync to Top KPI Bar & Itemized BOM Table</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProcurementModal(null)}
                    className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

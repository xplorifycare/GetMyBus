"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";

export interface ItemDef {
  name: string;
  model: string;
  place: string;
  status: string;
  tagColor: string;
  min: number;
  max: number;
  desc: string;
  svg: string;
  link: string | null;
  store: string;
  specs: string[];
}

export const ITEMS_DB: Record<string, Record<string, ItemDef>> = {
  screen: {
    existing: {
      name: "Existing Normal In-Bus TV",
      model: "24\" or 32\" LED Screen (Non-Smart)",
      place: "Ceiling Bulkhead",
      status: "Pre-Installed",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Bus already has TV installed. Standard HDMI/AV input ready. Requires zero display capex.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: null,
      store: "Pre-Installed",
      specs: [
        "Pre-installed 24\" or 32\" transit TV display panel",
        "Standard HDMI / Composite AV input ready",
        "Direct 230V AC feed via existing vehicle power inverter",
        "₹0 Capex allocation — Saved ~₹7,400"
      ]
    },
    existing_smart: {
      name: "Existing Smart Android TV",
      model: "32\" Smart Android TV (Built-in OS)",
      place: "Ceiling Bulkhead",
      status: "Pre-Installed",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Bus has working Smart Android TV. APK runs natively on TV without external TV box.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: null,
      store: "Pre-Installed",
      specs: [
        "32\" Smart Android TV with native Android OS & Wi-Fi",
        "Runs GetMyBus signage APK directly as system app",
        "Accepts u-blox USB GPS puck directly into TV's USB port",
        "Zero external compute box needed — Saved ~₹9,400"
      ]
    },
    new_basic: {
      name: "32-inch Non-Smart LED TV",
      model: "Visio World / Candes 32\" Frameless HD IPS",
      place: "Ceiling Bulkhead",
      status: "HDMI Screen",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 6800,
      max: 8000,
      desc: "Bright IPS panel with auto-power on when bus starts.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: "https://www.amazon.in/Visio-World-Frameless-VW32A-Black/dp/B08XMWZ51X",
      store: "Amazon India",
      specs: [
        "32-inch (80cm) HD Ready 1366x768 A+ Grade IPS Panel",
        "Wide 178° viewing angle with 300+ nits daylight brightness",
        "2x HDMI 2.0 ports + 2x USB + 20W stereo speakers",
        "Auto-power on upon ignition AC voltage return"
      ]
    },
    new_smart: {
      name: "32-inch Smart Android TV",
      model: "Foxsky / Candes 32\" Frameless Android",
      place: "Ceiling Bulkhead",
      status: "All-in-One",
      tagColor: "bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/25",
      min: 8000,
      max: 9200,
      desc: "Built-in CPU & Wi-Fi. Eliminates external box capex.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: "https://www.amazon.in/Foxsky-Inches-Ready-Smart-32FS-VS/dp/B09CYP2P2B",
      store: "Amazon India",
      specs: [
        "32-inch Frameless Smart Android IPS Panel",
        "Quad-Core ARM Cortex CPU + 1GB RAM + 8GB Storage",
        "Built-in 2.4GHz Wi-Fi receiver + RJ45 Ethernet",
        "Pre-loaded Android TV OS with background APK autostart"
      ]
    },
    commercial: {
      name: "32-inch Commercial IPS Display",
      model: "Industrial High-Bright Bus Display Panel",
      place: "Ceiling Bulkhead",
      status: "Commercial",
      tagColor: "bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/25",
      min: 12000,
      max: 15000,
      desc: "Metal chassis, ultra-bright 450 nits for direct sunlit windshields.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: "https://dir.indiamart.com/search.mp?ss=32+inch+commercial+display+panel",
      store: "IndiaMART",
      specs: [
        "32-inch Commercial High-Bright IPS panel (450+ nits)",
        "Reinforced metal vibration-resistant steel casing",
        "Continuous 24/7 commercial transit duty rating",
        "Optional 9V–36V DC wide direct bus electrical input"
      ]
    }
  },
  power: {
    existing: {
      name: "Existing Mount & Inverter",
      model: "Vehicle 24V Inverter & Steel Bracket",
      place: "Behind TV",
      status: "Pre-Wired",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Utilizes bus's pre-wired AC inverter power and steel frame.",
      svg: "/uploads/hardware/inverter_mount.svg",
      link: null,
      store: "Pre-Installed",
      specs: [
        "Existing bus roof-mounted reinforced steel bracket",
        "Pre-wired 24V DC to 230V AC inverter circuit",
        "Switched from driver dashboard electrical panel",
        "₹0 Capex allocation — Saved ~₹3,500"
      ]
    },
    need_power: {
      name: "Ceiling VESA Mount + Inverter",
      model: "Adjustable Drop Ceiling Bracket + 150W Inverter",
      place: "Ceiling & Battery Line",
      status: "Automotive Wire",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 3200,
      max: 3800,
      desc: "Heavy-duty anti-vibration drop mount + 150W inverter.",
      svg: "/uploads/hardware/inverter_mount.svg",
      link: "https://www.amazon.in/Universal-Adjustable-Ceiling-Bracket-Screens/dp/B07V5P52P6",
      store: "Amazon India",
      specs: [
        "Heavy-duty adjustable ceiling drop bracket (swivel + tilt)",
        "Universal VESA 100x100 / 200x200 cold-rolled steel plate",
        "150W pure sine wave vehicle power inverter (12V/24V to 230V)",
        "Low-voltage auto-disconnect to prevent battery drainage"
      ]
    },
    dc_buck: {
      name: "Automotive DC-DC Buck",
      model: "IP67 Waterproof 12V/24V to 5V 3.5A Stepdown",
      place: "Behind Fuse Panel",
      status: "Direct 24V DC",
      tagColor: "bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/25",
      min: 800,
      max: 1200,
      desc: "Direct DC conversion for TV box without AC inverter.",
      svg: "/uploads/hardware/dc_buck.svg",
      link: "https://robu.in/product/waterproof-dc-dc-converter-12v-24v-step-down-to-5v-3a-power-supply-module-with-micro-usb/",
      store: "Robu.in",
      specs: [
        "Input range: 8V – 35V DC (12V & 24V bus electrical compatible)",
        "Regulated output: 5V DC up to 3.5A (17.5W max continuous)",
        "IP67 fully sealed waterproof & vibration-proof epoxy potting",
        "Over-voltage, over-current, and thermal cutoff protection"
      ]
    }
  },
  compute: {
    android_box: {
      name: "4G Android TV Box",
      model: "Tanix W2 / X96 Mini (2GB RAM / 16GB ROM)",
      place: "Taped behind TV",
      status: "Plug & Play",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 1800,
      max: 2200,
      desc: "2x USB-A ports, hardware 1080p video decode, auto-boot.",
      svg: "/uploads/hardware/android_box.svg",
      link: "https://www.amazon.in/X96-Mini-Android-Amlogic-Supported/dp/B07J5BPF4K",
      store: "Amazon India",
      specs: [
        "Amlogic S905W / Allwinner H618 Quad-Core ARM Cortex-A53",
        "2GB DDR3 RAM + 16GB eMMC high-speed flash storage",
        "2x USB 2.0 host ports (concurrent GPS puck + 4G dongle)",
        "HDMI 2.0 output with 1080p hardware H.265/HEVC decoding",
        "Auto-power on boot upon electrical supply (no remote needed)",
        "Android 11 AOSP kiosk autostart"
      ]
    },
    smart_tv_builtin: {
      name: "Smart TV Built-in Processor",
      model: "Internal Android SoC",
      place: "Inside TV",
      status: "Integrated",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "No external compute hardware required. TV runs APK directly.",
      svg: "/uploads/hardware/tv_screen.svg",
      link: null,
      store: "Built into TV",
      specs: [
        "Integrated Smart Android SoC inside TV chassis",
        "Zero external compute box or HDMI patch cabling",
        "Runs GetMyBus TV signage client directly as system app",
        "Requires Smart TV with Android 9+ — Saved ~₹2,000"
      ]
    },
    orange_pi: {
      name: "Orange Pi Zero 3 (2GB)",
      model: "Allwinner H618 Quad-Core SBC + Metal Case",
      place: "Behind TV in Case",
      status: "Linux SBC",
      tagColor: "bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/25",
      min: 2200,
      max: 2800,
      desc: "Low-power Linux OS or Android 12 TV with dual USB & micro-HDMI.",
      svg: "/uploads/hardware/orange_pi.svg",
      link: "https://robu.in/product/orange-pi-zero-3-2gb-ram-allwinner-h618-quad-core-cortex-a53-single-board-computer/",
      store: "Robu.in",
      specs: [
        "Allwinner H618 Quad-Core Cortex-A53 @ 1.5GHz + Mali G31 GPU",
        "2GB LPDDR4 memory + MicroSD high endurance card",
        "Micro-HDMI (4K@60fps) output + Gigabit Ethernet port",
        "3x USB 2.0 host ports + dual-band Wi-Fi & BT 5.0"
      ]
    },
    rpi4: {
      name: "Raspberry Pi 4 (4GB)",
      model: "RPi 4 Model B + Dual-Fan Armor Heatsink",
      place: "Enclosure behind TV",
      status: "Linux SBC",
      tagColor: "bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/25",
      min: 5200,
      max: 6000,
      desc: "Industrial dual-screen edge hub for telemetry & digital signage.",
      svg: "/uploads/hardware/rpi4_armor.svg",
      link: "https://robu.in/product/raspberry-pi-4-model-b-with-4-gb-ram/",
      store: "Robu.in",
      specs: [
        "Broadcom BCM2711 64-bit Quad-Core Cortex-A72 @ 1.5GHz",
        "4GB LPDDR4-3200 SDRAM for local video caching & edge analytics",
        "Dual-fan CNC aluminum armor case with active/passive heatsink",
        "2x micro-HDMI (4Kp60) + 2x USB 3.0 + 2x USB 2.0 ports"
      ]
    }
  },
  gps: {
    usb_puck: {
      name: "u-blox USB GPS Puck",
      model: "Model VK-162 G-Mouse (2m shielded cable)",
      place: "Front Dashboard Glass",
      status: "USB Serial",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 650,
      max: 800,
      desc: "Plugs into Android box or Smart TV USB. 0ms local read on bus dashboard.",
      svg: "/uploads/hardware/usb_gps_puck.svg",
      link: "https://www.amazon.in/Navigation-External-Receiver-Raspberry-Geekstory/dp/B078Y52FGQ",
      store: "Amazon India",
      specs: [
        "u-blox 7th-gen UBX-G7020-KT 56-channel high-sensitivity engine",
        "Standard NMEA 0183 output via CP2102/PL2303 USB-UART bridge",
        "Ultra-fast acquisition: Cold start 29s, Hot start 1s, -162dBm tracking",
        "Built-in 25x25mm ceramic patch antenna + magnetic base",
        "2-meter flexible shielded cable routes along driver pillar"
      ]
    },
    sinotrack_4g: {
      name: "SinoTrack ST-901L 4G",
      model: "Hardwired Automotive GPS Tracker (3-wire harness)",
      place: "Under Driver Dash",
      status: "24/7 Hardwired",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 1600,
      max: 1900,
      desc: "Direct to 24V battery with internal backup battery & ACC wire.",
      svg: "/uploads/hardware/sinotrack_gps.svg",
      link: "https://www.amazon.in/SinoTrack-Vehicles-Real-Time-Waterproof-Motorcycle/dp/B0DZMJV9CV",
      store: "Amazon India",
      specs: [
        "4G LTE-FDD / LTE-TDD + 2G GSM quad-band auto-fallback",
        "9V – 80V wide DC vehicle operating voltage (direct bus battery)",
        "Built-in 150mAh rechargeable backup battery with power-cut alert",
        "IP67 waterproof and vibration-resistant automotive casing",
        "ACC wire detects vehicle ignition ON/OFF status automatically"
      ]
    },
    existing_gps: {
      name: "Existing Vehicle GPS (AIS-140)",
      model: "Pre-installed Vehicle Telematics Unit",
      place: "Under Driver Dash",
      status: "Pre-Wired",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Reuses bus's existing AIS-140 GPS or ST-901 tracker via server-to-server stream.",
      svg: "/uploads/hardware/sinotrack_gps.svg",
      link: null,
      store: "Pre-Installed",
      specs: [
        "Vehicle already equipped with certified AIS-140 GPS telematics unit",
        "Direct server-to-server API telemetry ingestion",
        "Continuous vehicle battery backed power",
        "₹0 Capex allocation — Saved ~₹1,750"
      ]
    },
    sim7600_hat: {
      name: "Waveshare SIM7600 HAT",
      model: "4G LTE Cat-4 + GNSS HAT + Roof Antennas",
      place: "Mounted on RPi Header",
      status: "GPIO HAT",
      tagColor: "bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/25",
      min: 3500,
      max: 4200,
      desc: "High-precision GNSS + LTE module on 40-pin GPIO header.",
      svg: "/uploads/hardware/sim7600_hat.svg",
      link: "https://robu.in/product/waveshare-sim7600g-h-4g-hat-for-raspberry-pi/",
      store: "Robu.in",
      specs: [
        "SIMCom SIM7600G-H global multi-band 4G LTE Cat-4 modem",
        "Concurrent multi-constellation GNSS: GPS, GLONASS, BeiDou, Galileo",
        "Standard Raspberry Pi 40-PIN GPIO pinout compatibility",
        "Includes external active GPS antenna with SMA connector"
      ]
    },
    phone_gps: {
      name: "Conductor Phone GPS",
      model: "Android Location Provider Service",
      place: "In Conductor's pocket",
      status: "App Telemetry",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Uses conductor's smartphone GPS. Zero dedicated hardware cost.",
      svg: "/uploads/hardware/usb_gps_puck.svg",
      link: null,
      store: "Phone Sensor",
      specs: [
        "Uses conductor's existing Android smartphone GPS chip",
        "Transmits coordinates to server via background web socket",
        "Zero capex requirement for standalone GPS receiver"
      ]
    }
  },
  net: {
    usb_dongle: {
      name: "4G LTE USB Wi-Fi Dongle",
      model: "Universal 4G USB Data Card / Hotspot",
      place: "Side USB port of Box / TV",
      status: "USB Modem",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 1200,
      max: 1500,
      desc: "Standard 4G SIM. High cellular sensitivity & auto-reconnect.",
      svg: "/uploads/hardware/usb_dongle.svg",
      link: "https://www.amazon.in/Generic-Wireless-Hotspot-Internet-Broadband/dp/B0C39K9SZC",
      store: "Amazon India",
      specs: [
        "4G LTE Cat 4: 150 Mbps download / 50 Mbps upload speeds",
        "Compatible with all Indian telecom operators (Jio, Airtel, Vi, BSNL)",
        "Integrated 802.11 b/g/n 2.4GHz Wi-Fi access point (up to 10 clients)",
        "Standard USB-A male interface powered directly by TV Box USB port",
        "Automatic cellular APN configuration and persistent auto-reconnect"
      ]
    },
    m2m_router: {
      name: "Industrial 4G IoT Router",
      model: "Teltonika RUT241 Industrial Cellular Router",
      place: "Driver Console",
      status: "Industrial 4G",
      tagColor: "bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/25",
      min: 3200,
      max: 4500,
      desc: "Dual SIM failover, external paddle antennas, rugged casing.",
      svg: "/uploads/hardware/m2m_router.svg",
      link: "https://robu.in/product/teltonika-rut241-industrial-cellular-router/",
      store: "Robu.in",
      specs: [
        "Industrial 4G LTE Cat 4 (150 Mbps) with 3G/2G fallback",
        "Rugged aluminum housing with DIN rail / surface chassis mounting",
        "Wide operating temperature range: -40°C to 75°C",
        "9V – 30V DC input range with reverse polarity protection"
      ]
    },
    sim7600_cellular: {
      name: "Cellular via SIM7600 HAT",
      model: "Direct onboard 4G LTE modem",
      place: "On Compute board",
      status: "Integrated HAT",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Included in SIM7600 hardware. Zero separate modem needed.",
      svg: "/uploads/hardware/sim7600_hat.svg",
      link: null,
      store: "Included in HAT",
      specs: [
        "Direct cellular channel via Waveshare SIM7600 expansion board",
        "PPP / QMI high-speed data interface over Linux kernel",
        "Zero external Wi-Fi dongle or extra USB port consumption"
      ]
    },
    phone_hotspot: {
      name: "Conductor Phone Hotspot",
      model: "Wi-Fi Tethering from conductor smartphone",
      place: "Shared in bus cabin",
      status: "Mobile Hotspot",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Zero extra modem hardware. TV box connects to conductor phone.",
      svg: "/uploads/hardware/usb_dongle.svg",
      link: null,
      store: "Phone Wi-Fi",
      specs: [
        "Tethers Android Box to conductor's personal mobile data pack",
        "Zero capex or separate monthly data card SIM subscription",
        "Suitable for initial proof-of-concept testing"
      ]
    }
  },
  etm: {
    none: {
      name: "No ETM Subsystem (Phase 1 Cash/Tickets)",
      model: "Existing Manual Cash / Pre-printed Tickets",
      place: "Conductor Hand",
      status: "Phase 1 Deferred",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Phase 1: Zero conductor friction. Focus on TV ads & tracking.",
      svg: "/uploads/hardware/sunmi_v2s.svg",
      link: null,
      store: "Phase 1 Deferred",
      specs: [
        "Conductor continues existing physical paper ticket rack / cash bag",
        "Eliminates ~₹14,000 upfront capex per bus entirely",
        "Zero training curve or crew resistance during passenger launch",
        "Allows fleet operator to prove passenger tracking & ad ROI first"
      ]
    },
    existing_etm: {
      name: "Existing Electronic Ticket Machine",
      model: "Conductor Handheld ETM (Reused)",
      place: "Conductor Handheld",
      status: "Pre-Owned",
      tagColor: "bg-[#30D158]/10 text-[#30D158] border-[#30D158]/25",
      min: 0,
      max: 0,
      desc: "Conductor continues using existing handheld ETM. Synced via backend/API.",
      svg: "/uploads/hardware/sunmi_v2s.svg",
      link: null,
      store: "Pre-Owned",
      specs: [
        "Reuses existing route-approved bus ticketing terminal",
        "Conductor already trained and comfortable with day-to-day operation",
        "Zero friction and zero new ticketing hardware capex",
        "Saved ~₹14,500 capex per bus"
      ]
    },
    phone_bt: {
      name: "Phone + BT Thermal Printer",
      model: "58mm Wireless Thermal Printer + Android Phone",
      place: "Conductor Belt",
      status: "Bluetooth Kit",
      tagColor: "bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/25",
      min: 6500,
      max: 7200,
      desc: "Low-cost mobile ticketing combo with 58mm QR ticket printing.",
      svg: "/uploads/hardware/pos_printer.svg",
      link: "https://www.amazon.in/Thermal-Printer-Bluetooth-Handheld-Rechargeable/dp/B07WCSBDRD",
      store: "Amazon India",
      specs: [
        "58mm (2-inch) portable mini wireless Bluetooth thermal receipt printer",
        "Bluetooth 4.0 BLE + USB interface, ESC/POS command protocol",
        "High-speed printing: up to 90mm/sec, 203 DPI sharp QR code resolution",
        "Built-in 1500mAh rechargeable Li-ion battery (lasts 4-5 days standby)"
      ]
    },
    sunmi_pos: {
      name: "Sunmi V2s Android POS",
      model: "Sunmi V2s Handheld Smart Mobile POS Terminal",
      place: "Conductor Handheld",
      status: "Commercial POS",
      tagColor: "bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/25",
      min: 13500,
      max: 15500,
      desc: "Commercial all-in-one POS: 58mm printer, 4G, barcode scanner.",
      svg: "/uploads/hardware/sunmi_v2s.svg",
      link: "https://dir.indiamart.com/search.mp?ss=sunmi+v2s+handheld+pos+terminal",
      store: "IndiaMART",
      specs: [
        "Quad-core 2.0GHz Cortex-A53 CPU, 2GB RAM + 16GB ROM, Android 11",
        "Integrated 58mm high-speed Seiko thermal printer (70mm/s)",
        "5.45-inch HD+ (1440x720) IPS anti-glare capacitive touchscreen",
        "4G LTE, dual-band Wi-Fi, Bluetooth 4.2 BLE, GPS/GLONASS/Beidou",
        "Removable 7.7V/3500mAh battery (equivalent to 7000mAh 3.85V)",
        "1D/2D QR camera barcode reader with flash LED for night tickets"
      ]
    }
  },
  consumables: {
    pack: {
      name: "Cables, 3M VHB Tape & Ties Kit",
      model: "3M VHB 4910 Tape + 0.5m HDMI 2.0 + Zip Ties Kit",
      place: "Behind TV",
      status: "Fasteners",
      tagColor: "bg-white/[0.04] text-white/50 border-white/[0.08]",
      min: 500,
      max: 650,
      desc: "Automotive-grade mounting adhesives, interconnects & wire ties.",
      svg: "/uploads/hardware/consumables_kit.svg",
      link: "https://www.amazon.in/3M-Double-Sided-Heavy-Duty-Mounting/dp/B00004Z4A8",
      store: "Amazon India",
      specs: [
        "3M VHB 4910 heavy-duty clear double-sided acrylic foam mounting tape",
        "0.5m ultra-slim gold-plated high-speed HDMI 2.0 cable (supports 4K@60Hz)",
        "Pack of 50 UV-resistant heavy-duty automotive nylon cable zip ties",
        "Self-adhesive nylon cable tie anchor mounts for clean wire routing"
      ]
    }
  }
};

export const COMBINATIONS: Record<string, {
  phase: 1 | 2 | 3;
  title: string;
  shortTitle: string;
  tag: string;
  badge: string;
  speed: string;
  speedBadge: string;
  screen: string;
  power: string;
  compute: string;
  gps: string;
  net: string;
  etm: string;
  highlight: string;
  tagColor: string;
  priceRange: string;
  desc: string;
  reusedSummary: string;
  installSummary: string;
}> = {
  combo_1a: {
    phase: 1,
    title: "Phase 1 (1A): Existing Normal TV (No ETM)",
    shortTitle: "Normal TV (No ETM)",
    tag: "Phase 1: Existing TV",
    badge: "Phase 1 (Combo 1A)",
    speed: "⏱️ ~25 Mins Installation",
    speedBadge: "⏱️ 25m",
    screen: "existing",
    power: "existing",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "none",
    highlight: "1A • MOST COMMON",
    tagColor: "bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30",
    priceRange: "₹4,150 – ₹5,150",
    desc: "Bus has working dumb TV + 24V inverter. Conductor keeps paper tickets. Adds Android box, GPS puck & 4G dongle.",
    reusedSummary: "TV Display, Inverter, Steel Mount",
    installSummary: "Tanix W2 Box, GPS Puck, 4G Dongle"
  },
  combo_1b: {
    phase: 1,
    title: "Phase 1 (1B): Existing Android Smart TV (Direct USB GPS)",
    shortTitle: "Smart Android TV",
    tag: "Phase 1: Smart TV",
    badge: "Phase 1 (Combo 1B)",
    speed: "⏱️ ~15 Mins Plug & Play",
    speedBadge: "⏱️ 15m",
    screen: "existing_smart",
    power: "existing",
    compute: "smart_tv_builtin",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "none",
    highlight: "1B • ULTRA LEAN",
    tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
    priceRange: "₹1,850 – ₹2,300",
    desc: "Bus has Smart Android TV. APK runs natively on TV with direct USB GPS. Zero external compute box needed.",
    reusedSummary: "Smart TV, TV Compute, Inverter",
    installSummary: "u-blox USB GPS Puck + 4G LTE Dongle"
  },
  combo_1c: {
    phase: 1,
    title: "Phase 1 (1C): Smart TV + Existing ETM Reused",
    shortTitle: "Smart TV + Existing ETM",
    tag: "Phase 1: Smart TV + ETM",
    badge: "Phase 1 (Combo 1C)",
    speed: "⏱️ ~15 Mins Fast Onboard",
    speedBadge: "⏱️ 15m",
    screen: "existing_smart",
    power: "existing",
    compute: "smart_tv_builtin",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "existing_etm",
    highlight: "1C • ZERO CAPEX",
    tagColor: "bg-[#BF5AF2]/15 text-[#BF5AF2] border-[#BF5AF2]/30",
    priceRange: "₹1,850 – ₹2,300",
    desc: "Bus has Smart TV and conductor uses a digital ticket machine. We sync software via cloud API with USB GPS.",
    reusedSummary: "Smart TV, Inverter, Existing ETM",
    installSummary: "u-blox USB GPS Puck + 4G LTE Dongle"
  },
  combo_1d: {
    phase: 1,
    title: "Phase 1 (1D): Normal TV + Existing ETM Reused",
    shortTitle: "Normal TV + Existing ETM",
    tag: "Phase 1: Normal TV + ETM",
    badge: "Phase 1 (Combo 1D)",
    speed: "⏱️ ~25 Mins Installation",
    speedBadge: "⏱️ 25m",
    screen: "existing",
    power: "existing",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "existing_etm",
    highlight: "1D • REUSE ETM",
    tagColor: "bg-white/[0.06] text-white/75 border-white/[0.12]",
    priceRange: "₹4,150 – ₹5,150",
    desc: "Bus has normal TV; conductor already has an electronic ticket machine. We add Android box + USB GPS for digital ads.",
    reusedSummary: "TV Display, Inverter, Existing ETM",
    installSummary: "Tanix W2 Box, GPS Puck, 4G Dongle"
  },
  combo_1e: {
    phase: 1,
    title: "Phase 1 (1E): Existing TV + Add Sunmi V2s POS ETM",
    shortTitle: "Existing TV + Sunmi POS",
    tag: "Phase 1: ETM Upgrade",
    badge: "Phase 1 (Combo 1E)",
    speed: "⏱️ ~35 Mins Deployment",
    speedBadge: "⏱️ 35m",
    screen: "existing",
    power: "existing",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "sunmi_pos",
    highlight: "1E • SMART ETM",
    tagColor: "bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/30",
    priceRange: "₹17,650 – ₹20,650",
    desc: "Bus has TV, operator upgrades conductor to high-speed digital Sunmi V2s POS terminal with instant QR tickets.",
    reusedSummary: "TV Display, Inverter, Steel Mount",
    installSummary: "Android Box, GPS, Dongle, Sunmi V2s"
  },
  combo_2a: {
    phase: 2,
    title: "Phase 2 (2A): Display Retrofit Only (No ETM)",
    shortTitle: "32\" HD LED TV (No ETM)",
    tag: "Phase 2: Screen Retrofit",
    badge: "Phase 2 (Combo 2A)",
    speed: "⏱️ ~1.5 Hours Installation",
    speedBadge: "⏱️ ~1.5h",
    screen: "new_basic",
    power: "need_power",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "none",
    highlight: "2A • RETROFIT BASIC",
    tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
    priceRange: "₹14,150 – ₹16,950",
    desc: "Bus has no screen. Installs 32\" HD LED TV, heavy ceiling VESA bracket, 150W Inverter, Android Box, GPS & 4G.",
    reusedSummary: "Vehicle 24V Electrical Line",
    installSummary: "32\" TV, Mount, Inverter, Box, GPS, Dongle"
  },
  combo_2b: {
    phase: 2,
    title: "Phase 2 (2B): Smart TV Retrofit (All-in-One)",
    shortTitle: "32\" Smart Android TV",
    tag: "Phase 2: Smart TV Retrofit",
    badge: "Phase 2 (Combo 2B)",
    speed: "⏱️ ~1.2 Hours Installation",
    speedBadge: "⏱️ ~1.2h",
    screen: "new_smart",
    power: "need_power",
    compute: "smart_tv_builtin",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "none",
    highlight: "2B • ALL-IN-ONE",
    tagColor: "bg-[#BF5AF2]/15 text-[#BF5AF2] border-[#BF5AF2]/30",
    priceRange: "₹14,050 – ₹16,400",
    desc: "Installs 32\" Smart Android TV (eliminates external box capex), ceiling bracket, inverter, and plugs GPS into TV USB.",
    reusedSummary: "Vehicle 24V Line, Built-in OS",
    installSummary: "32\" Smart TV, Mount, Inverter, GPS, Dongle"
  },
  combo_2c: {
    phase: 2,
    title: "Phase 2 (2C): Display Retrofit + Keep Existing ETM",
    shortTitle: "32\" Screen + Keep ETM",
    tag: "Phase 2: Display + ETM",
    badge: "Phase 2 (Combo 2C)",
    speed: "⏱️ ~1.5 Hours Installation",
    speedBadge: "⏱️ ~1.5h",
    screen: "new_basic",
    power: "need_power",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "existing_etm",
    highlight: "2C • REUSE ETM",
    tagColor: "bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30",
    priceRange: "₹14,150 – ₹16,950",
    desc: "Bus has no TV, but conductor uses digital ticketing. Installs 32\" screen package; reuses existing ETM at ₹0 cost.",
    reusedSummary: "Existing Conductor ETM (Saved ₹14,500)",
    installSummary: "32\" TV, Mount, Inverter, Box, GPS, Dongle"
  },
  combo_3a: {
    phase: 3,
    title: "Phase 3 (3A): Commercial Standard (32\" TV + SinoTrack 4G + Sunmi POS)",
    shortTitle: "TV + SinoTrack 4G + Sunmi POS",
    tag: "Phase 3: Turnkey Fleet",
    badge: "Phase 3 (Combo 3A)",
    speed: "⏱️ ~2.5 Hours Deployment",
    speedBadge: "⏱️ ~2.5h",
    screen: "new_basic",
    power: "need_power",
    compute: "android_box",
    gps: "sinotrack_4g",
    net: "usb_dongle",
    etm: "sunmi_pos",
    highlight: "3A • COMMERCIAL",
    tagColor: "bg-[#BF5AF2]/15 text-[#BF5AF2] border-[#BF5AF2]/30",
    priceRange: "₹27,650 – ₹32,450",
    desc: "Complete smart bus: 32\" TV + Bracket/Inverter + Android Box + SinoTrack ST-901L 4G vehicle GPS + Sunmi V2s POS ticketing.",
    reusedSummary: "Turnkey Greenfield Build",
    installSummary: "32\" TV, Inverter, SinoTrack 4G, Sunmi V2s"
  },
  combo_3b: {
    phase: 3,
    title: "Phase 3 (3B): Value Turnkey (TV + USB GPS + Phone & BT Printer)",
    shortTitle: "TV + USB GPS + Phone & BT",
    tag: "Phase 3: Value Combo",
    badge: "Phase 3 (Combo 3B)",
    speed: "⏱️ ~2 Hours Deployment",
    speedBadge: "⏱️ ~2.0h",
    screen: "new_basic",
    power: "need_power",
    compute: "android_box",
    gps: "usb_puck",
    net: "usb_dongle",
    etm: "phone_bt",
    highlight: "3B • VALUE COMBO",
    tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
    priceRange: "₹20,650 – ₹24,150",
    desc: "Full digital signage + digital ticketing at lower cost: 32\" TV + Android Box + USB GPS + Dedicated Android Phone & BT printer.",
    reusedSummary: "Turnkey Greenfield Build",
    installSummary: "32\" TV, Box, GPS, Android Phone + BT Printer"
  },
  combo_3c: {
    phase: 3,
    title: "Phase 3 (3C): Industrial Heavy-Duty (450nit Display + M2M Router + Sunmi)",
    shortTitle: "450nit Panel + M2M Router",
    tag: "Phase 3: Industrial",
    badge: "Phase 3 (Combo 3C)",
    speed: "⏱️ ~3 Hours Deployment",
    speedBadge: "⏱️ ~3.0h",
    screen: "commercial",
    power: "need_power",
    compute: "android_box",
    gps: "sinotrack_4g",
    net: "m2m_router",
    etm: "sunmi_pos",
    highlight: "3C • INDUSTRIAL",
    tagColor: "bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/30",
    priceRange: "₹35,000 – ₹41,000",
    desc: "Heavy duty: 32\" Commercial 450-nit metal IPS display + Teltonika RUT241 Industrial 4G Router + SinoTrack 4G + Sunmi V2s POS.",
    reusedSummary: "Heavy-Duty Transit Standard",
    installSummary: "32\" 450nit IPS, M2M Router, SinoTrack, Sunmi"
  }
};

export default function HardwareConfigurator({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";

  const [fleetCount, setFleetCount] = useState(3);
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | "custom">(1);
  const [currentComboId, setCurrentComboId] = useState<string>("combo_1a");

  // Selections
  const [screen, setScreen] = useState("existing");
  const [power, setPower] = useState("existing");
  const [compute, setCompute] = useState("android_box");
  const [gps, setGps] = useState("usb_puck");
  const [net, setNet] = useState("usb_dongle");
  const [etm, setEtm] = useState("none");

  // Filters & Views
  const [tableFilter, setTableFilter] = useState<"all" | "new" | "free">("all");
  const [topologyView, setTopologyView] = useState<"diagram" | "cards">("diagram");

  // Handlers
  const handleFleetChange = (delta: number) => {
    playClickSound();
    setFleetCount((prev) => Math.max(1, Math.min(100, prev + delta)));
  };

  const handleSelectPhase = (phase: 1 | 2 | 3 | "custom") => {
    playClickSound();
    setCurrentPhase(phase);
    if (phase === 1) {
      applyCombo("combo_1a");
    } else if (phase === 2) {
      applyCombo("combo_2a");
    } else if (phase === 3) {
      applyCombo("combo_3a");
    }
  };

  const applyCombo = (comboId: string) => {
    playClickSound();
    setCurrentComboId(comboId);
    const cfg = COMBINATIONS[comboId];
    if (!cfg) return;
    setScreen(cfg.screen);
    setPower(cfg.power);
    setCompute(cfg.compute);
    setGps(cfg.gps);
    setNet(cfg.net);
    setEtm(cfg.etm);
  };

  const handleCustomOption = (category: string, value: string) => {
    playClickSound();
    setCurrentComboId("custom");
    if (category === "screen") {
      setScreen(value);
      if (value === "existing_smart" || value === "new_smart") {
        setCompute("smart_tv_builtin");
      } else if (compute === "smart_tv_builtin") {
        setCompute("android_box");
      }
      if (value === "new_basic" || value === "new_smart" || value === "commercial") {
        setPower("need_power");
      } else if (value === "existing" || value === "existing_smart") {
        setPower("existing");
      }
    } else if (category === "power") {
      setPower(value);
    } else if (category === "compute") {
      setCompute(value);
    } else if (category === "gps") {
      setGps(value);
    } else if (category === "net") {
      setNet(value);
    } else if (category === "etm") {
      setEtm(value);
    }
  };

  // Selections list
  const selections = useMemo(() => [
    { area: "Display Screen", cat: "screen", item: ITEMS_DB.screen[screen] || ITEMS_DB.screen.existing },
    { area: "Mount & Power", cat: "power", item: ITEMS_DB.power[power] || ITEMS_DB.power.existing },
    { area: "Display Compute", cat: "compute", item: ITEMS_DB.compute[compute] || ITEMS_DB.compute.android_box },
    { area: "GPS Telemetry", cat: "gps", item: ITEMS_DB.gps[gps] || ITEMS_DB.gps.usb_puck },
    { area: "4G Connectivity", cat: "net", item: ITEMS_DB.net[net] || ITEMS_DB.net.usb_dongle },
    { area: "Conductor ETM", cat: "etm", item: ITEMS_DB.etm[etm] || ITEMS_DB.etm.none },
    { area: "Cabling & Supplies", cat: "consumables", item: ITEMS_DB.consumables.pack }
  ], [screen, power, compute, gps, net, etm]);

  // Financial calculations
  const { unitMin, unitMax, fleetMin, fleetMax, totalSaved, neededItems, reusedItems } = useMemo(() => {
    let uMin = 0;
    let uMax = 0;
    let saved = 0;
    const needed: ItemDef[] = [];
    const reused: { name: string; model: string; saved: number; specs: string }[] = [];

    selections.forEach((s) => {
      const isFree = s.item.min === 0 && s.item.max === 0;
      if (isFree) {
        let est = 0;
        if (s.cat === "screen") est = 7400;
        else if (s.cat === "power") est = 3500;
        else if (s.cat === "compute") est = 2000;
        else if (s.cat === "etm" && s.item === ITEMS_DB.etm.existing_etm) est = 14500;
        else if (s.cat === "gps" && s.item === ITEMS_DB.gps.existing_gps) est = 1750;

        saved += est;
        reused.push({
          name: s.item.name,
          model: s.item.model,
          saved: est,
          specs: s.item.specs ? s.item.specs[0] : "Reused in-bus asset"
        });
      } else {
        uMin += s.item.min;
        uMax += s.item.max;
        needed.push(s.item);
      }
    });

    return {
      unitMin: uMin,
      unitMax: uMax,
      fleetMin: uMin * fleetCount,
      fleetMax: uMax * fleetCount,
      totalSaved: saved,
      neededItems: needed,
      reusedItems: reused
    };
  }, [selections, fleetCount]);

  // OPEX & Revenue
  const { totalOpex, simCost, serverCost, paperCost, totalRev, paybackMonths } = useMemo(() => {
    let simCardsPerBus = gps === "sinotrack_4g" ? 2 : 1;
    if (etm === "sunmi_pos" || etm === "phone_bt") simCardsPerBus += 1;
    const totalSim = simCardsPerBus * fleetCount * 199;
    const server = 1000;
    const paper = (etm === "none" || etm === "existing_etm") ? 0 : fleetCount * 200;
    const opex = totalSim + server + paper;

    const revPerBus = 5333; // ~₹16,000 for 3 buses
    const rev = fleetCount * revPerBus;

    const avgCapex = (fleetMin + fleetMax) / 2;
    const netProfit = Math.max(1, rev - opex - (fleetCount * 2500)); // owner share ₹2500
    const payback = avgCapex === 0 ? "Immediate" : `~${(avgCapex / netProfit).toFixed(1)} Months`;

    return {
      totalOpex: opex,
      simCost: totalSim,
      serverCost: server,
      paperCost: paper,
      totalRev: rev,
      paybackMonths: payback
    };
  }, [gps, etm, fleetCount, fleetMin, fleetMax]);

  const activeCombo = COMBINATIONS[currentComboId];

  const renderComboCard = (cId: string) => {
    const c = COMBINATIONS[cId];
    if (!c) return null;
    const isSelected = currentComboId === cId;
    return (
      <div
        key={cId}
        onClick={() => applyCombo(cId)}
        onMouseEnter={() => playHoverSound(0.01)}
        className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none relative overflow-hidden group h-full ${
          isSelected
            ? "bg-[#0A84FF]/10 border-[#0A84FF] shadow-[0_0_24px_-4px_rgba(10,132,255,0.35)] ring-1 ring-[#0A84FF]"
            : isLight
              ? "bg-white border-slate-200 hover:border-[#0A84FF]/40 shadow-sm hover:shadow"
              : "bg-[#0f1015]/90 border-white/[0.07] hover:border-[#0A84FF]/40 hover:bg-[#12131b]"
        }`}
      >
        <div>
          {/* Top Badges Row */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold truncate border ${c.tagColor || "bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30"}`}>
              {c.highlight}
            </span>
            <span className={`text-[10.5px] font-mono whitespace-nowrap flex-shrink-0 px-1.5 py-0.5 rounded ${
              isLight ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-white/[0.04] text-white/50 border border-white/[0.06]"
            }`}>
              {c.speedBadge || c.speed}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-[13px] font-semibold tracking-tight leading-snug line-clamp-1 group-hover:text-[#0A84FF] transition-colors ${
            isSelected ? "text-[#0A84FF]" : isLight ? "text-slate-900" : "text-white"
          }`} title={c.title}>
            {c.shortTitle || c.title}
          </h3>

          {/* Description */}
          <p className={`text-[11px] mt-1.5 leading-relaxed line-clamp-2 min-h-[34px] ${isLight ? "text-slate-500" : "text-white/50"}`}>
            {c.desc}
          </p>

          {/* Subsystem mini checklist */}
          <div className={`mt-3 p-2 rounded-lg border text-[10.5px] space-y-1 font-sans ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#070709] border-white/[0.05]"
          }`}>
            <div className="text-[#30D158] font-mono font-medium truncate flex items-center gap-1">
              <span>✓</span> <span className="truncate">{c.reusedSummary}</span>
            </div>
            <div className={`truncate flex items-center gap-1 ${isLight ? "text-slate-600" : "text-white/70"}`}>
              <span className="text-[#0A84FF]">•</span> <span className="truncate">{c.installSummary}</span>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className={`mt-3.5 pt-2.5 border-t flex items-center justify-between ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
          <span className={`text-[10.5px] font-mono ${isSelected ? "text-[#0A84FF] font-semibold" : isLight ? "text-slate-400" : "text-white/40"}`}>
            {isSelected ? "● ACTIVE" : "Capex / Bus:"}
          </span>
          <span className="font-mono text-xs font-bold text-[#30D158]">
            {c.priceRange}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-8 select-text transition-colors duration-300 ${isLight ? "text-slate-900" : "text-white"}`}>

      {/* =========================================================================
          1. HERO HEADER & FLEET MULTIPLIER
          ========================================================================= */}
      <header className={`p-6 md:p-8 rounded-2xl relative overflow-hidden border backdrop-blur-xl transition-all ${
        isLight
          ? "bg-white/80 border-slate-200/80 shadow-sm"
          : "bg-gradient-to-br from-[#0c0d12] via-[#090a0d] to-[#070708] border-white/[0.07] shadow-2xl"
      }`}>
        {/* Glow ambient */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#0A84FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.18em] uppercase block mb-2">
              Kerala Private Bus Hardware Specification
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight leading-tight">
              Hardware Fleet Planner &amp; <span className="font-bold">Cost Configurator</span>
            </h1>
            <p className={`text-xs md:text-sm font-light mt-2 max-w-2xl leading-relaxed ${isLight ? "text-slate-600" : "text-white/60"}`}>
              Configure onboard hardware for Kerala private bus fleets. Compare baseline presets, tailor each component, view real-time wiring topology, and calculate Capex/Opex return with zero low-quality AI image dependencies.
            </p>

            {/* Value Badges */}
            <div className={`flex flex-wrap items-center gap-2 mt-4 pt-4 border-t ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#0A84FF] font-medium">
                ⚡ Lean MVP: ~₹4,500 / bus
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#30D158]/10 border border-[#30D158]/20 text-[#30D158] font-medium">
                ✓ Pre-installed TV reuse
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${isLight ? "border-slate-200 bg-slate-100 text-slate-700" : "border-white/[0.08] bg-white/[0.03] text-white/70"}`}>
                🛡️ Zero Conductor Friction (Phase 1 Cash/Tickets)
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF9F0A]/10 border border-[#FF9F0A]/20 text-[#FF9F0A] font-medium">
                ⏱️ Payback: ~1.2 Months
              </span>
            </div>
          </div>

          {/* Fleet Multiplier Widget */}
          <div className={`self-start lg:self-center p-4 rounded-2xl border flex flex-col items-center gap-3 min-w-[220px] shadow-lg ${
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#121214] border-white/[0.08]"
          }`}>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-white/50"}`}>
              Fleet Multiplier
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleFleetChange(-1)}
                className={`w-8 h-8 rounded-xl border font-medium flex items-center justify-center transition active:scale-95 ${
                  isLight
                    ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                    : "border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.1] text-white"
                }`}
                aria-label="Decrease fleet count"
              >
                −
              </button>
              <div className="text-center">
                <span className="font-mono text-2xl font-bold text-[#0A84FF]">{fleetCount}</span>
                <span className={`block text-[10px] uppercase tracking-widest mt-0.5 ${isLight ? "text-slate-400" : "text-white/40"}`}>
                  Buses
                </span>
              </div>
              <button
                onClick={() => handleFleetChange(1)}
                className={`w-8 h-8 rounded-xl border font-medium flex items-center justify-center transition active:scale-95 ${
                  isLight
                    ? "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                    : "border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.1] text-white"
                }`}
                aria-label="Increase fleet count"
              >
                +
              </button>
            </div>
            <button
              onClick={() => window.print()}
              className="w-full text-center py-1 text-[11px] font-medium text-[#0A84FF] hover:underline"
            >
              🖨️ Print Hardware Spec Sheet
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. STEP 1: FLEET ONBOARDING PHASES & COMBINATIONS
          ========================================================================= */}
      <section className={`p-6 md:p-8 rounded-2xl border backdrop-blur-xl transition-all space-y-6 ${
        isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
      }`}>
        {/* Step Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
                Step 1 — Fleet Onboarding Architecture
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] text-[#30D158] font-mono">Kerala Private Bus Inventory Matrix</span>
            </div>
            <h2 className="text-xl md:text-2xl font-normal tracking-tight">
              Select Your Bus Onboarding <span className="font-bold">Phase &amp; Inventory</span>
            </h2>
            <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
              Filter by what each bus already possesses. We calculate exact onboarding Capex, identify newly required hardware to place on the vehicle, and highlight capital saved by reusing existing equipment.
            </p>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono self-start md:self-auto ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-[#141418] border-white/[0.08]"
          }`}>
            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
            <span className={isLight ? "text-slate-500" : "text-white/50"}>Active:</span>
            <span className="text-[#0A84FF] font-medium truncate max-w-[180px]">
              {activeCombo ? activeCombo.badge : "Custom Profile"}
            </span>
          </div>
        </div>

        {/* Phase Tabs Bar */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 rounded-2xl border ${
          isLight ? "bg-slate-100/80 border-slate-200" : "bg-[#070709] border-white/[0.06]"
        }`}>
          {[
            {
              id: 1 as const,
              tag: "★ RAPID ONBOARD",
              tagColor: "bg-[#30D158]/15 text-[#30D158] border-[#30D158]/30",
              icon: "📺",
              title: "Phase 1: Bus Has TV",
              subtitle: "Existing TV / Smart TV / Optional ETM",
              price: "₹1,850 – ₹5,150",
              unit: "/ bus"
            },
            {
              id: 2 as const,
              tag: "DISPLAY RETROFIT",
              tagColor: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30",
              icon: "⚡",
              title: "Phase 2: Bus Has NO TV",
              subtitle: "Screenless Fleet / Optional ETM",
              price: "₹14,050 – ₹16,950",
              unit: "/ bus"
            },
            {
              id: 3 as const,
              tag: "FULL TURNKEY",
              tagColor: "bg-[#BF5AF2]/15 text-[#BF5AF2] border-[#BF5AF2]/30",
              icon: "🚀",
              title: "Phase 3: TV + ETM Package",
              subtitle: "Greenfield Turnkey Automation",
              price: "₹20,650 – ₹32,450",
              unit: "/ bus"
            },
            {
              id: "custom" as const,
              tag: "CUSTOM BUILDER",
              tagColor: "bg-[#FF9F0A]/15 text-[#FF9F0A] border-[#FF9F0A]/30",
              icon: "⚙️",
              title: "Custom Bus Profile",
              subtitle: "Configure 4 Subsystems Individually",
              price: "Interactive",
              unit: "Real-time"
            }
          ].map((tab) => {
            const isActive = currentPhase === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectPhase(tab.id)}
                onMouseEnter={() => playHoverSound(0.01)}
                className={`text-left p-3.5 rounded-xl transition-all flex flex-col justify-between border select-none ${
                  isActive
                    ? "bg-[#0A84FF]/10 border-[#0A84FF] shadow-[0_0_20px_-4px_rgba(10,132,255,0.25)]"
                    : isLight
                      ? "bg-white/80 border-slate-200/80 hover:border-slate-300"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-semibold ${tab.tagColor}`}>
                    {tab.tag}
                  </span>
                  <span className="text-base">{tab.icon}</span>
                </div>
                <div>
                  <div className={`text-xs font-semibold ${isActive ? "text-[#0A84FF]" : ""}`}>{tab.title}</div>
                  <div className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/50"}`}>{tab.subtitle}</div>
                </div>
                <div className="mt-2.5 text-[11px] font-mono font-medium text-[#30D158]">
                  {tab.price} <span className="font-normal text-[10px] opacity-60">{tab.unit}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Combinations List */}
        {currentPhase === 1 && (
          <div className="space-y-3">
            <div className={`text-xs font-medium flex items-center justify-between ${isLight ? "text-slate-700" : "text-white/80"}`}>
              <div className="flex items-center gap-2">
                <span>🎯</span> <span>Select Phase 1 Bus Inventory Combination:</span>
              </div>
              <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                5 Presets Available
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 items-stretch">
              {["combo_1a", "combo_1b", "combo_1c", "combo_1d", "combo_1e"].map(renderComboCard)}
            </div>
          </div>
        )}

        {currentPhase === 2 && (
          <div className="space-y-3">
            <div className={`text-xs font-medium flex items-center justify-between ${isLight ? "text-slate-700" : "text-white/80"}`}>
              <div className="flex items-center gap-2">
                <span>⚡</span> <span>Select Phase 2 Screen Retrofit Combination:</span>
              </div>
              <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                3 Screenless Presets
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
              {["combo_2a", "combo_2b", "combo_2c"].map(renderComboCard)}
            </div>
          </div>
        )}

        {currentPhase === 3 && (
          <div className="space-y-3">
            <div className={`text-xs font-medium flex items-center justify-between ${isLight ? "text-slate-700" : "text-white/80"}`}>
              <div className="flex items-center gap-2">
                <span>🚀</span> <span>Select Phase 3 Greenfield Turnkey Combination:</span>
              </div>
              <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                3 Turnkey Packages
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
              {["combo_3a", "combo_3b", "combo_3c"].map(renderComboCard)}
            </div>
          </div>
        )}

        {/* Custom Profile Questions */}
        {currentPhase === "custom" && (
          <div className="space-y-4">
            <div className={`text-xs font-medium flex items-center gap-2 ${isLight ? "text-slate-700" : "text-white/80"}`}>
              <span>⚙️</span> Interactive Bus Profile Checklist — Select what this bus has:
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 md:p-5 rounded-xl border ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-[#070709] border-white/[0.06]"
            }`}>
              {/* Q1: TV Screen */}
              <div className="space-y-2">
                <label className={`text-[11px] font-semibold uppercase tracking-wider block ${isLight ? "text-slate-600" : "text-white/70"}`}>
                  1. Passenger Television Screen:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "existing", label: "✓ Normal TV (Existing)", price: "₹0" },
                    { id: "existing_smart", label: "✓ Smart Android TV", price: "₹0" },
                    { id: "new_basic", label: "❌ No TV (Need 32\" Screen)" },
                    { id: "commercial", label: "⚡ Commercial 450nit" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleCustomOption("screen", btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 select-none ${
                        screen === btn.id
                          ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm font-medium"
                          : isLight
                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>{btn.label}</span>
                      {btn.price && <span className="text-[#30D158] font-mono text-[10px]">{btn.price}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: ETM */}
              <div className="space-y-2">
                <label className={`text-[11px] font-semibold uppercase tracking-wider block ${isLight ? "text-slate-600" : "text-white/70"}`}>
                  2. Conductor Ticketing Machine (ETM):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "none", label: "❌ No ETM (Cash/Tickets)", price: "₹0" },
                    { id: "existing_etm", label: "✓ Existing ETM (Reused)", price: "₹0" },
                    { id: "phone_bt", label: "🎫 Phone + BT Printer" },
                    { id: "sunmi_pos", label: "🚀 Sunmi V2s POS" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleCustomOption("etm", btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 select-none ${
                        etm === btn.id
                          ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm font-medium"
                          : isLight
                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>{btn.label}</span>
                      {btn.price && <span className="text-[#30D158] font-mono text-[10px]">{btn.price}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: GPS */}
              <div className="space-y-2">
                <label className={`text-[11px] font-semibold uppercase tracking-wider block ${isLight ? "text-slate-600" : "text-white/70"}`}>
                  3. Vehicle GPS Telemetry:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "usb_puck", label: "📍 u-blox USB GPS Puck" },
                    { id: "sinotrack_4g", label: "🔋 SinoTrack 4G Hardwired" },
                    { id: "existing_gps", label: "✓ Existing AIS-140 GPS", price: "₹0" },
                    { id: "phone_gps", label: "📱 Conductor Phone GPS", price: "₹0" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleCustomOption("gps", btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 select-none ${
                        gps === btn.id
                          ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm font-medium"
                          : isLight
                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>{btn.label}</span>
                      {btn.price && <span className="text-[#30D158] font-mono text-[10px]">{btn.price}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Internet */}
              <div className="space-y-2">
                <label className={`text-[11px] font-semibold uppercase tracking-wider block ${isLight ? "text-slate-600" : "text-white/70"}`}>
                  4. In-Bus 4G Connectivity:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "usb_dongle", label: "📶 4G LTE USB Dongle" },
                    { id: "m2m_router", label: "📡 Industrial M2M Router" },
                    { id: "phone_hotspot", label: "📱 Mobile Hotspot", price: "₹0" }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleCustomOption("net", btn.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 select-none ${
                        net === btn.id
                          ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm font-medium"
                          : isLight
                            ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            : "bg-white/[0.04] text-white/70 border-white/[0.08] hover:bg-white/[0.08]"
                      }`}
                    >
                      <span>{btn.label}</span>
                      {btn.price && <span className="text-[#30D158] font-mono text-[10px]">{btn.price}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Onboarding Summary Banner */}
        <div className={`rounded-2xl p-5 md:p-6 border shadow-xl relative overflow-hidden ${
          isLight ? "bg-slate-50/90 border-slate-200" : "bg-[#070709] border-white/[0.09]"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#0A84FF]/15 text-[#0A84FF] border border-[#0A84FF]/25 font-semibold">
                  {activeCombo ? activeCombo.tag : "Custom Profile"}
                </span>
                <span className={`text-xs font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                  {activeCombo ? activeCombo.speed : "⏱️ ~30 Mins Deployment"}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-semibold mt-1">
                {activeCombo ? activeCombo.title : "Custom Tailored Bus Configuration"}
              </h3>
            </div>

            {/* Total Price Badges */}
            <div className={`border px-4 py-2.5 rounded-xl flex items-center gap-4 self-start md:self-auto ${
              isLight ? "bg-white border-slate-200" : "bg-[#141418] border-white/[0.08]"
            }`}>
              <div>
                <span className={`block text-[10px] uppercase tracking-wider font-mono ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Unit Capex / Bus:
                </span>
                <span className="font-mono text-sm md:text-base font-bold text-[#30D158]">
                  ₹{unitMin.toLocaleString()} – ₹{unitMax.toLocaleString()}
                </span>
              </div>
              <div className={`w-px h-8 ${isLight ? "bg-slate-200" : "bg-white/[0.08]"}`} />
              <div>
                <span className={`block text-[10px] uppercase tracking-wider font-mono ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Fleet Total ({fleetCount} Buses):
                </span>
                <span className="font-mono text-sm md:text-base font-bold text-[#0A84FF]">
                  ₹{fleetMin.toLocaleString()} – ₹{fleetMax.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Column: Reused vs New Hardware Needed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            {/* Left: Reused Assets */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? "text-slate-700" : "text-white/80"}`}>
                  <span className="text-[#30D158]">🟢</span> Equipment Already on Bus (Saved ₹):
                </span>
                <span className="text-[10px] text-[#30D158] font-mono font-bold">
                  {totalSaved > 0 ? `~₹${totalSaved.toLocaleString()} Saved / Bus` : "Greenfield Build"}
                </span>
              </div>
              <div className="space-y-2">
                {reusedItems.length === 0 ? (
                  <div className={`p-3 rounded-xl border text-xs ${isLight ? "bg-white border-slate-200 text-slate-500" : "bg-white/[0.02] border-white/[0.06] text-white/50"}`}>
                    No existing in-bus assets reused. Complete greenfield hardware setup required.
                  </div>
                ) : (
                  reusedItems.map((r, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                        isLight ? "bg-emerald-50/50 border-emerald-200" : "bg-[#0e1612] border-[#30D158]/20"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#30D158] flex items-center gap-1">
                          <span>✓</span> {r.name}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/50"}`}>{r.model}</div>
                      </div>
                      {r.saved > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/25 whitespace-nowrap font-medium">
                          Saved ~₹{r.saved.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Exact Hardware Needed (With vector SVGs) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? "text-slate-700" : "text-white/80"}`}>
                  <span className="text-[#0A84FF]">📦</span> Exact Hardwares Needed to Place on Bus:
                </span>
                <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-white/50"}`}>
                  Vector Technical Schematics
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                {neededItems.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between transition ${
                      isLight
                        ? "bg-white border-slate-200 hover:border-[#0A84FF]/40 shadow-sm"
                        : "bg-[#121216] border-white/[0.08] hover:border-[#0A84FF]/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-12 h-12 rounded-lg border p-1 flex-shrink-0 flex items-center justify-center overflow-hidden ${
                          isLight ? "bg-slate-100 border-slate-200" : "bg-[#070708] border-white/[0.08]"
                        }`}>
                          <Image
                            src={item.svg}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold truncate">{item.name}</div>
                          <div className={`text-[10px] font-mono mt-0.5 truncate ${isLight ? "text-slate-500" : "text-white/40"}`}>
                            {item.model}
                          </div>
                          <div className="text-[11px] font-mono text-[#0A84FF] font-bold mt-1">
                            ₹{item.min.toLocaleString()} – ₹{item.max.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-2 pt-2 border-t flex items-center justify-between ${isLight ? "border-slate-100" : "border-white/[0.05]"}`}>
                      <span className={`text-[9.5px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>{item.place}</span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9.5px] text-[#0A84FF] hover:text-white bg-[#0A84FF]/10 hover:bg-[#0A84FF] border border-[#0A84FF]/25 px-1.5 py-0.5 rounded transition font-medium"
                        >
                          <span>🛒 {item.store}</span>
                        </a>
                      ) : (
                        <span className="text-[9.5px] text-white/40">Included</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. STEP 2: COMPONENT-BY-COMPONENT TAILOR SELECTOR
          ========================================================================= */}
      <section className={`p-6 rounded-2xl border backdrop-blur-xl transition-all ${
        isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
          <div>
            <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
              Step 2 — Tailor Subsystems
            </span>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight mt-0.5">Hardware Component Selector</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#30D158]">
            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
            Live Cost Matrix Updated Instantly
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { cat: "screen", label: "1. In-Bus TV Screen", type: "Display", value: screen, setter: setScreen, items: ITEMS_DB.screen },
            { cat: "power", label: "2. TV Mount & Inverter Power", type: "Power", value: power, setter: setPower, items: ITEMS_DB.power },
            { cat: "compute", label: "3. Display Compute Unit", type: "Compute", value: compute, setter: setCompute, items: ITEMS_DB.compute },
            { cat: "gps", label: "4. GPS Telemetry Source", type: "Telemetry", value: gps, setter: setGps, items: ITEMS_DB.gps },
            { cat: "net", label: "5. In-Bus 4G Internet", type: "Cellular", value: net, setter: setNet, items: ITEMS_DB.net },
            { cat: "etm", label: "6. Conductor Ticketing (ETM)", type: "Ticketing", value: etm, setter: setEtm, items: ITEMS_DB.etm }
          ].map((block) => {
            const activeItem = block.items[block.value] || Object.values(block.items)[0];
            return (
              <div
                key={block.cat}
                className={`border rounded-xl p-4 flex flex-col justify-between transition ${
                  isLight
                    ? "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold">{block.label}</label>
                    <span className="text-[10px] text-[#0A84FF] uppercase tracking-wider font-mono font-semibold">{block.type}</span>
                  </div>

                  <div className="flex items-start gap-3 mb-2.5">
                    <div className={`w-20 h-20 rounded-xl border p-1 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner ${
                      isLight ? "bg-slate-100 border-slate-200" : "bg-[#070708] border-white/[0.08]"
                    }`}>
                      <Image
                        src={activeItem.svg}
                        alt={activeItem.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <select
                        value={block.value}
                        onChange={(e) => {
                          handleCustomOption(block.cat, e.target.value);
                        }}
                        className={`w-full text-xs rounded-lg px-2.5 py-2 border outline-none ${
                          isLight
                            ? "bg-slate-50 border-slate-300 text-slate-800 focus:border-[#0A84FF]"
                            : "bg-[#121214] border-white/[0.09] text-white focus:border-[#0A84FF]"
                        }`}
                      >
                        {Object.entries(block.items).map(([k, item]) => (
                          <option key={k} value={k}>
                            {item.name} {item.min === 0 ? "(₹0)" : `(₹${item.min.toLocaleString()} - ₹${item.max.toLocaleString()})`}
                          </option>
                        ))}
                      </select>
                      <p className={`text-[11px] mt-1.5 leading-normal ${isLight ? "text-slate-500" : "text-white/50"}`}>
                        {activeItem.desc}
                      </p>
                    </div>
                  </div>

                  {activeItem.specs && activeItem.specs.length > 0 && (
                    <div className={`mt-2 p-2.5 rounded-lg border text-[10.5px] space-y-1 ${
                      isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-[#070708] border-white/[0.06] text-white/70"
                    }`}>
                      <div className="font-semibold text-[#0A84FF] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <span>⚙️</span> Technical Specifications:
                      </div>
                      {activeItem.specs.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#0A84FF] font-bold">•</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
                  <span className="font-mono text-[11px] font-bold text-[#30D158]">
                    {activeItem.min === 0 && activeItem.max === 0
                      ? "✓ ₹0 (Pre-Installed)"
                      : `₹${activeItem.min.toLocaleString()} – ₹${activeItem.max.toLocaleString()}`}
                  </span>
                  {activeItem.link ? (
                    <a
                      href={activeItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A84FF]/15 hover:bg-[#0A84FF] text-[#0A84FF] hover:text-white border border-[#0A84FF]/30 transition text-[11px] font-medium"
                    >
                      <span>🛒 View on {activeItem.store}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className={`text-[10px] font-mono px-2 py-1 rounded border ${isLight ? "bg-slate-100 border-slate-200 text-slate-500" : "bg-white/[0.03] border-white/[0.06] text-white/40"}`}>
                      ✓ {activeItem.store}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. VISUAL SYSTEM ARCHITECTURE & TOPOLOGY
          ========================================================================= */}
      <section className={`p-6 rounded-2xl border backdrop-blur-xl transition-all ${
        isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
              Visual System Architecture
            </span>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight mt-0.5">In-Bus Topology &amp; Wiring Route</h2>
          </div>

          <div className={`flex items-center p-1 rounded-xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-[#121214] border-white/[0.08]"}`}>
            <button
              onClick={() => { playClickSound(); setTopologyView("diagram"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                topologyView === "diagram"
                  ? "bg-[#0A84FF] text-white shadow-sm"
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-white/60 hover:text-white"
              }`}
            >
              📊 System Flowchart
            </button>
            <button
              onClick={() => { playClickSound(); setTopologyView("cards"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                topologyView === "cards"
                  ? "bg-[#0A84FF] text-white shadow-sm"
                  : isLight ? "text-slate-600 hover:text-slate-900" : "text-white/60 hover:text-white"
              }`}
            >
              🚌 In-Bus Spatial Map
            </button>
          </div>
        </div>

        {topologyView === "diagram" ? (
          /* Pure Vector React Topology Diagram */
          <div className={`p-6 rounded-xl border overflow-x-auto ${isLight ? "bg-slate-50 border-slate-200" : "bg-[#070709] border-white/[0.06]"}`}>
            <svg viewBox="0 0 900 320" className="w-full max-w-5xl mx-auto min-w-[700px] h-auto font-sans block" fill="none">
              <defs>
                <linearGradient id="busPowerGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF9F0A" />
                  <stop offset="100%" stopColor="#0A84FF" />
                </linearGradient>
                <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#BF5AF2" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Subgraph: Bus Power & Battery */}
              <rect x="20" y="30" width="180" height="260" rx="12" fill={isLight ? "#f8fafc" : "#0d0e12"} stroke={isLight ? "#cbd5e1" : "#1e2028"} strokeWidth="1.5" />
              <text x="35" y="55" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="11" fontWeight="bold" letterSpacing="0.5">VEHICLE POWER</text>
              
              <rect x="35" y="80" width="150" height="50" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke={isLight ? "#e2e8f0" : "#2a2c36"} />
              <text x="45" y="102" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">24V / 12V Bus Battery</text>
              <text x="45" y="118" fill="#FF9F0A" fontSize="9.5" fontFamily="monospace">Alternator DC Feed</text>

              <rect x="35" y="150" width="150" height="55" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke="#FF9F0A" strokeWidth="1.2" />
              <text x="45" y="172" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">Power Conditioning</text>
              <text x="45" y="188" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9.5">{power === "need_power" ? "150W Inverter (230V AC)" : power === "dc_buck" ? "5V 3.5A DC Buck" : "Vehicle AC Circuit"}</text>

              {/* Subgraph: Passenger Cabin (Bulkhead) */}
              <rect x="230" y="30" width="370" height="260" rx="12" fill={isLight ? "#f8fafc" : "#0d0e12"} stroke={isLight ? "#cbd5e1" : "#1e2028"} strokeWidth="1.5" />
              <text x="245" y="55" fill="#0A84FF" fontSize="11" fontWeight="bold" letterSpacing="0.5">CEILING BULKHEAD &amp; CABIN</text>

              {/* Compute Box */}
              <rect x="250" y="80" width="160" height="70" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke="#0A84FF" strokeWidth="1.5" />
              <text x="262" y="102" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">{compute === "smart_tv_builtin" ? "Smart TV Processor" : compute === "rpi4" ? "Raspberry Pi 4" : "4G Android TV Box"}</text>
              <text x="262" y="118" fill="#0A84FF" fontSize="9.5" fontFamily="monospace">GetMyBus Signage APK</text>
              <text x="262" y="134" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">1080p Ad Video Cache</text>

              {/* TV Screen */}
              <rect x="430" y="80" width="150" height="70" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke="#30D158" strokeWidth="1.5" />
              <text x="442" y="102" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">{screen === "commercial" ? "32\" Commercial IPS" : screen === "new_smart" ? "32\" Smart Android TV" : "32\" Transit LED TV"}</text>
              <text x="442" y="118" fill="#30D158" fontSize="9.5">178° Wide Viewing</text>
              <text x="442" y="134" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">Malayalam Audio &amp; Chime</text>

              {/* GPS & 4G Dongle Nodes */}
              <rect x="250" y="180" width="160" height="45" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke="#30D158" strokeWidth="1.2" />
              <text x="262" y="200" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="10.5" fontWeight="bold">{gps === "sinotrack_4g" ? "SinoTrack 4G Tracker" : "u-blox USB GPS Puck"}</text>
              <text x="262" y="215" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">Windshield Glass Mount</text>

              <rect x="430" y="180" width="150" height="45" rx="8" fill={isLight ? "#ffffff" : "#15161c"} stroke="#0A84FF" strokeWidth="1.2" />
              <text x="442" y="200" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="10.5" fontWeight="bold">{net === "m2m_router" ? "Industrial M2M Router" : "4G LTE USB Dongle"}</text>
              <text x="442" y="215" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">Airtel / Jio 4G LTE</text>

              {/* Subgraph: Cloud Ingest & Passengers */}
              <rect x="630" y="30" width="245" height="260" rx="12" fill="url(#cloudGrad)" stroke="#0A84FF" strokeWidth="1.5" />
              <text x="645" y="55" fill="#BF5AF2" fontSize="11" fontWeight="bold" letterSpacing="0.5">GETMYBUS CLOUD &amp; COMMUTERS</text>

              <rect x="645" y="80" width="215" height="60" rx="8" fill={isLight ? "#ffffff" : "#14141a"} stroke="#0A84FF" strokeWidth="1" />
              <text x="658" y="102" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">Cloud Ingest API &amp; Sockets</text>
              <text x="658" y="118" fill="#0A84FF" fontSize="9.5" fontFamily="monospace">4-Sec Telemetry Stream</text>
              <text x="658" y="132" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">Ad Impression Verification</text>

              <rect x="645" y="160" width="215" height="60" rx="8" fill={isLight ? "#ffffff" : "#14141a"} stroke="#30D158" strokeWidth="1" />
              <text x="658" y="182" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="11" fontWeight="bold">Commuter Mobile App</text>
              <text x="658" y="198" fill="#30D158" fontSize="9.5">Live Bus Tracking Map</text>
              <text x="658" y="212" fill={isLight ? "#64748b" : "#94a3b8"} fontSize="9">Accurate Walk-time Alerts</text>

              {/* Conductor Node if active */}
              <rect x="645" y="235" width="215" height="40" rx="6" fill={isLight ? "#ffffff" : "#15161c"} stroke={etm === "none" ? "#64748b" : "#BF5AF2"} strokeWidth="1" />
              <text x="658" y="258" fill={isLight ? "#0f172a" : "#ffffff"} fontSize="10" fontWeight="bold">{etm === "sunmi_pos" ? "Sunmi V2s Cloud POS ETM" : etm === "phone_bt" ? "Phone + BT Thermal Ticket ETM" : "Phase 1: Traditional Cash/Tickets"}</text>

              {/* Connecting Lines */}
              <path d="M110 130 L110 150" stroke="#FF9F0A" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M185 175 L250 115" stroke="#FF9F0A" strokeWidth="2" />
              <path d="M410 115 L430 115" stroke="#30D158" strokeWidth="2.5" />
              <path d="M330 180 L330 150" stroke="#30D158" strokeWidth="1.8" />
              <path d="M505 180 L410 135" stroke="#0A84FF" strokeWidth="1.8" />
              <path d="M580 200 L645 110" stroke="#0A84FF" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M750 140 L750 160" stroke="#30D158" strokeWidth="2" />
            </svg>
          </div>
        ) : (
          /* Spatial Placement Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: "1. Front Dashboard",
                color: "#30D158",
                item: ITEMS_DB.gps[gps] || ITEMS_DB.gps.usb_puck,
                desc: gps === "usb_puck" ? "USB GPS puck sitting flat on dashboard glass next to inspection tag with 2m lead." : "Hardwired 4G tracker concealed under dashboard with ignition ACC wire."
              },
              {
                num: "2. Behind TV Screen",
                color: "#0A84FF",
                item: ITEMS_DB.compute[compute] || ITEMS_DB.compute.android_box,
                desc: compute === "smart_tv_builtin" ? "Integrated inside Smart TV. Zero external box or extra cables required." : "Taped to TV backplate with 3M VHB. Connects to TV via 0.5m HDMI cable."
              },
              {
                num: "3. Passenger Screen",
                color: "#BF5AF2",
                item: ITEMS_DB.screen[screen] || ITEMS_DB.screen.existing,
                desc: "Plays 1080p cached video ads + Malayalam & English stop chimes on bus speakers."
              },
              {
                num: "4. Conductor Area",
                color: "#FF9F0A",
                item: ITEMS_DB.etm[etm] || ITEMS_DB.etm.none,
                desc: etm === "none" ? "No ticketing hardware in Phase 1. Traditional cash/tickets, zero crew friction." : (etm === "existing_etm" ? "Conductor existing ticketing machine reused with cloud API sync." : "Digital QR ticketing with real-time cloud sync.")
              }
            ].map((c, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                  isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#121216] border-white/[0.07]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold" style={{ color: c.color }}>
                      {c.num}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-xl border p-1 flex-shrink-0 flex items-center justify-center ${
                      isLight ? "bg-slate-100 border-slate-200" : "bg-[#070708] border-white/[0.08]"
                    }`}>
                      <Image
                        src={c.item.svg}
                        alt={c.item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs">{c.item.name}</div>
                      <div className={`text-[11px] mt-0.5 truncate ${isLight ? "text-slate-500" : "text-white/40"}`}>{c.item.model}</div>
                    </div>
                  </div>
                  <div className={`mt-3 text-[10px] font-mono p-2.5 rounded-lg border ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-[#070708] border-white/[0.06] text-white/60"
                  }`}>
                    {c.desc}
                  </div>
                </div>

                <div className="mt-3">
                  {c.item.link ? (
                    <a
                      href={c.item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#0A84FF] hover:text-white bg-[#0A84FF]/10 hover:bg-[#0A84FF] border border-[#0A84FF]/30 px-2.5 py-1 rounded-lg transition font-medium"
                    >
                      <span>🛒 View on {c.item.store}</span>
                    </a>
                  ) : (
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-400" : "text-white/40"}`}>
                      ✓ Pre-Installed / Reused
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. ITEMIZED COST COMPARISON TABLE MATRIX
          ========================================================================= */}
      <section className={`p-6 rounded-2xl border backdrop-blur-xl transition-all ${
        isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-semibold text-[#30D158] tracking-[0.15em] uppercase">
              Cost Breakdown Matrix
            </span>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight mt-0.5">Itemized Hardware &amp; Capex Comparison</h2>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: "all" as const, label: "All Items (7)" },
              { id: "new" as const, label: "New To Buy Only" },
              { id: "free" as const, label: "Pre-Installed (₹0)" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => { playClickSound(); setTableFilter(f.id); }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition border ${
                  tableFilter === f.id
                    ? "bg-[#0A84FF] text-white border-[#0A84FF] shadow-sm"
                    : isLight
                      ? "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      : "bg-white/[0.04] text-white/60 border-white/[0.08] hover:bg-white/[0.08]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                isLight ? "border-slate-200 text-slate-400 bg-slate-50" : "border-white/[0.08] text-white/40 bg-white/[0.01]"
              }`}>
                <th className="py-3 px-4">Component Area</th>
                <th className="py-3 px-4">Selected Hardware / Model</th>
                <th className="py-3 px-4">Placement / Route</th>
                <th className="py-3 px-4">Status &amp; Link</th>
                <th className="py-3 px-4 text-right">Unit Cost (Min - Max)</th>
                <th className="py-3 px-4 text-right">Total for Fleet</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${isLight ? "divide-slate-100" : "divide-white/[0.04]"}`}>
              {selections.map((row, idx) => {
                const isFree = row.item.min === 0 && row.item.max === 0;
                if (tableFilter === "new" && isFree) return null;
                if (tableFilter === "free" && !isFree) return null;

                const rowFleetMin = row.item.min * fleetCount;
                const rowFleetMax = row.item.max * fleetCount;

                return (
                  <tr key={idx} className={`transition ${isLight ? "hover:bg-slate-50/60" : "hover:bg-white/[0.02]"}`}>
                    <td className={`py-3.5 px-4 font-sans ${isLight ? "text-slate-600" : "text-white/70"}`}>{row.area}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg border p-1 flex-shrink-0 flex items-center justify-center ${
                          isLight ? "bg-slate-100 border-slate-200" : "bg-[#0c0c0f] border-white/[0.08]"
                        }`}>
                          <Image
                            src={row.item.svg}
                            alt={row.item.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-xs">{row.item.name}</div>
                          <div className={`text-[10px] mt-0.5 ${isLight ? "text-slate-400" : "text-white/40"}`}>{row.item.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-sans text-[11px] ${isLight ? "text-slate-500" : "text-white/50"}`}>{row.item.place}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${row.item.tagColor} inline-block w-fit font-medium`}>
                          {row.item.status}
                        </span>
                        {row.item.link ? (
                          <a
                            href={row.item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-[#0A84FF] hover:text-white bg-[#0A84FF]/10 hover:bg-[#0A84FF] border border-[#0A84FF]/30 px-2 py-0.5 rounded-md transition font-medium"
                          >
                            <span>🛒 {row.item.store}</span>
                          </a>
                        ) : (
                          <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-white/40"}`}>✓ Reused</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isFree ? (
                        <span className="text-[#30D158] font-semibold">₹0 (Pre-Installed)</span>
                      ) : (
                        `₹${row.item.min.toLocaleString()} – ₹${row.item.max.toLocaleString()}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold">
                      {rowFleetMin === 0 && rowFleetMax === 0 ? (
                        <span className="text-[#30D158]">₹0</span>
                      ) : (
                        `₹${rowFleetMin.toLocaleString()} – ₹${rowFleetMax.toLocaleString()}`
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className={`border-t font-mono font-bold ${
              isLight ? "border-slate-300 bg-slate-50" : "border-white/[0.1] bg-white/[0.02]"
            }`}>
              <tr>
                <td colSpan={4} className="py-3.5 px-4 text-xs">TOTAL ONE-TIME CAPEX:</td>
                <td className="py-3.5 px-4 text-right text-[#0A84FF] text-xs">
                  ₹{unitMin.toLocaleString()} – ₹{unitMax.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right text-[#30D158] text-sm">
                  ₹{fleetMin.toLocaleString()} – ₹{fleetMax.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* =========================================================================
          6. FINANCIAL SUMMARY & RETURN PROJECTIONS
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capex Card */}
        <div className={`p-6 rounded-2xl border border-l-4 border-l-[#0A84FF] transition ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-white/40"}`}>
            Total Fleet Capex
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono mt-2 text-[#0A84FF]">
            ₹{fleetMin.toLocaleString()} – ₹{fleetMax.toLocaleString()}
          </div>
          <div className={`text-xs mt-2 ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Calculated for <span className="font-bold">{fleetCount}</span> buses (₹{unitMin.toLocaleString()} - ₹{unitMax.toLocaleString()} / bus).
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-[#0A84FF] flex items-center gap-1.5 font-medium">
            <span>⚡</span>
            <span>~85% cheaper than traditional setup (~₹90,000 saved).</span>
          </div>
        </div>

        {/* Monthly Opex */}
        <div className={`p-6 rounded-2xl border border-l-4 border-l-[#FF9F0A] transition ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-white/40"}`}>
            Monthly Operating Cost (OPEX)
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono mt-2 text-[#FF9F0A]">
            ₹{totalOpex.toLocaleString()} / mo
          </div>
          <div className={`text-xs mt-2 space-y-1.5 ${isLight ? "text-slate-500" : "text-white/50"}`}>
            <div className="flex justify-between">
              <span>• 4G SIM Cards:</span>
              <span className="font-mono font-medium">₹{simCost.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between">
              <span>• Cloud Server (Backend):</span>
              <span className="font-mono font-medium">₹{serverCost.toLocaleString()} / mo</span>
            </div>
            <div className="flex justify-between">
              <span>• Thermal Paper Rolls:</span>
              <span className="font-mono font-medium">₹{paperCost.toLocaleString()} / mo</span>
            </div>
          </div>
        </div>

        {/* Ad Revenue & Payback */}
        <div className={`p-6 rounded-2xl border border-l-4 border-l-[#30D158] transition ${
          isLight ? "bg-white border-slate-200 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
        }`}>
          <div className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400" : "text-white/40"}`}>
            Projected Monthly Ad Revenue
          </div>
          <div className="text-2xl md:text-3xl font-bold font-mono mt-2 text-[#30D158]">
            ₹{totalRev.toLocaleString()} / mo
          </div>
          <div className={`text-xs mt-2 ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Based on 4 advertisers @ ₹4,000/mo across {fleetCount} buses.
          </div>
          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${isLight ? "border-slate-200" : "border-white/[0.06]"}`}>
            <span className={isLight ? "text-slate-600" : "text-white/60"}>Estimated Payback:</span>
            <span className="font-mono font-bold text-[#30D158] text-sm">{paybackMonths}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FIELD ENGINEERING NOTES & DEPLOYMENT PROTOCOLS
          ========================================================================= */}
      <section className={`p-6 rounded-2xl border backdrop-blur-xl transition-all ${
        isLight ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#0b0b0e] border-white/[0.07] shadow-xl"
      }`}>
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.15em] uppercase">
            Field Engineering Notes
          </span>
          <h2 className="text-lg font-semibold tracking-tight mt-0.5">Kerala In-Bus Installation Best Practices</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs leading-relaxed">
          {[
            {
              icon: "📍",
              title: "GPS Antenna Placement",
              color: "#30D158",
              text: "Place the USB GPS puck flat on the glass dashboard right next to the inspection sticker. Bus metal roofs act as a Faraday shield—dashboard placement gets 100% sky view and instant 1-sec lock."
            },
            {
              icon: "⚡",
              title: "Vibration & Mounting",
              color: "#0A84FF",
              text: "Kerala road bumps loosen screws. Use 3M VHB double-sided heavy automotive foam tape to anchor the Android Box directly behind the TV backplate. Zero rattling, zero fallen cables."
            },
            {
              icon: "📶",
              title: "4G Thermal & Power",
              color: "#FF9F0A",
              text: "A standard 4G USB dongle plugged directly into the Android box draws negligible power (0.3A). When bus ignition turns off, power cuts safely without battery drain risk."
            },
            {
              icon: "🎫",
              title: "Phased ETM Rollout",
              color: "#BF5AF2",
              text: "Conductors initially resist new ticket machines. Starting Phase 1 with zero ETM hardware lets you prove ad revenue and passenger live tracking first, building trust before introducing Sunmi POS."
            }
          ].map((note, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-white/[0.015] border-white/[0.06] text-white/60"
              }`}
            >
              <div className="font-semibold text-xs mb-1 flex items-center gap-1.5" style={{ color: note.color }}>
                <span>{note.icon}</span> {note.title}
              </div>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

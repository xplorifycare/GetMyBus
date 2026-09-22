"use client";

import { useState } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import HardwareConfigurator from "@/components/HardwareConfigurator";

export default function HardwarePlannerStandalonePage() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white transition-colors duration-500 ${
      isLight ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"
    }`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <div className="w-full max-w-[1720px] mx-auto pt-28 pb-20 px-6 md:px-12">
        <HardwareConfigurator theme={theme} />
      </div>

      <Footer theme={theme} />
      <ScrollToTop />
    </main>
  );
}

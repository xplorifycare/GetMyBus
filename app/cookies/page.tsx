"use client";

import { useState } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${theme === "light" ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"}`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 md:px-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Cookie Policy</h1>
        <p className="text-[13px] themed-text-muted mb-10">Last Updated: July 11, 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed themed-text-muted">
          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">1. What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, improve your user experience, and provide information to the owners of the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">2. How We Use Local Storage & Cookies</h2>
            <p>
              GetMyBus does not use tracking cookies or advertising cookies. We only use essential client-side storage technologies (such as <strong>localStorage</strong> and <strong>sessionStorage</strong>) for the following basic features:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Interface Settings:</strong> Storing your sound setting preference (muted/unmuted) under the key `getmybus_sound_enabled` so it persists between page visits.
              </li>
              <li>
                <strong>Admin Authentication:</strong> Securely holding your admin session password token in `sessionStorage` (`gmb_admin_pass`) so you remain logged in to the admin console without needing to enter the password on every page reload.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">3. Managing your Preferences</h2>
            <p>
              Since we only use essential localStorage variables for system functionality (sound toggle and admin session state), they cannot be disabled from a cookie consent banner without breaking these UI preferences.
            </p>
            <p>
              However, you can delete your browser’s cache, local storage, and cookies at any time through your browser settings. Refer to your browser&apos;s Help page for instructions on how to clear this data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">4. Contact Us</h2>
            <p>
              If you have any questions about our use of storage preferences or cookies, please email us at:
              <br />
              <strong className="themed-text">admin@getmybus.in</strong>
            </p>
          </section>
        </div>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

"use client";

import { useState } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${theme === "light" ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"}`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 md:px-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Privacy Policy</h1>
        <p className="text-[13px] themed-text-muted mb-10">Last Updated: July 11, 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed themed-text-muted">
          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">1. Introduction</h2>
            <p>
              Welcome to <strong>GetMyBus</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). GetMyBus is committed to protecting the privacy of our commuters, bus operators, and advertising partners. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you use our website (getmybus.in), mobile applications, and onboard transit services.
            </p>
            <p>
              We comply with the Information Technology Act, 2000, and the Digital Personal Data Protection (DPDP) Act, 2023, of India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">2. Information We Collect</h2>
            <div className="space-y-2">
              <p>We may collect information about you in the following ways:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Waitlist & Contact Forms:</strong> When you register on our platform as a Commuter, Operator, or Advertiser, we collect your name, email address, phone number, and any message or files you provide.
                </li>
                <li>
                  <strong>Transit & Telemetry Data:</strong> For our live GPS tracking service, we collect real-time location data from GPS units and Electronic Ticket Machines (ETM) installed on partner buses. This data is associated with the vehicle and route, not with individual passengers.
                </li>
                <li>
                  <strong>Ticketing Transactions:</strong> If you buy bus tickets cashlessly, payment details are processed securely by our partner UPI gateways and banks. We do not store your bank account details or UPI PINs.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">3. How We Use Your Information</h2>
            <div className="space-y-2">
              <p>We use the collected information for purposes including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Providing real-time bus tracking and walk-time alerts on the GetMyBus commuter app.</li>
                <li>Processing partnership requests and onboarding private bus operators in Kerala.</li>
                <li>Delivering route-targeted advertising campaigns for brands on our onboard smart screens.</li>
                <li>Sending system updates, waitlist confirmations, and instant Telegram alerts.</li>
                <li>Complying with legal and transit regulatory audits in the State of Kerala.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">4. Information Sharing & Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share information with trusted third-party service providers (such as hosting services, database hosts like Supabase, payment gateways, and notification engines) who assist us in operating our platform, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">5. Data Security</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to protect your personal data. Your contact details are stored in secure cloud databases (Supabase/PostgreSQL) with Row-Level Security enabled and administrative bypass controls. However, no electronic transmission over the internet or storage technology can be guaranteed 100% secure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">6. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate data, or request the deletion of your waitlist information at any time. To exercise these rights, please contact us at the email listed below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">7. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact our Grievance Officer:
            </p>
            <div className="bg-black/5 dark:bg-white/5 border themed-divider rounded-xl p-4 mt-2">
              <p className="font-semibold themed-text">GetMyBus Operations</p>
              <p>Email: admin@getmybus.in</p>
              <p>Address: Mayyanad, Kollam, Kerala, India - 691303</p>
            </div>
          </section>
        </div>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

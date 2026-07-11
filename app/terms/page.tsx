"use client";

import { useState } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${theme === "light" ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"}`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <div className="max-w-3xl mx-auto pt-32 pb-24 px-6 md:px-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Terms of Service</h1>
        <p className="text-[13px] themed-text-muted mb-10">Last Updated: July 11, 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed themed-text-muted">
          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website (getmybus.in), commuter applications, or onboard services operated by <strong>GetMyBus</strong> (&quot;Services&quot;), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not access or use our Services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">2. Description of Service</h2>
            <p>
              GetMyBus provides a public transit digitisation platform in Kerala. Our services include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Real-time bus tracking and estimated arrival times for commuters.</li>
              <li>A digital platform linking bus operators, ticket systems (ETM), and ad revenue.</li>
              <li>Onboard screen display ad delivery for advertisers.</li>
            </ul>
            <p>
              You acknowledge that live telemetry location estimates are subject to mobile network coverage, GPS satellite visibility, and operational variables, and are provided on an &quot;as-is&quot; basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">3. Waitlist & User Registrations</h2>
            <p>
              By registering on our waitlist or submitting inquiries as a commuter, operator, or brand advertiser:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You agree to provide true, accurate, and current contact details.</li>
              <li>You consent to receive updates, emails, and phone/SMS confirmations related to GetMyBus services.</li>
              <li>We reserve the right to limit waitlist approvals or pilot participation at our sole discretion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">4. Rules for Bus Operators</h2>
            <p>
              Bus operators who join the GetMyBus pilot cohort agree to the specific pilot guidelines, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintaining ETM devices and onboard ad screens in fully powered and operational states during routes.</li>
              <li>Receiving a 50% monthly share of onboard advertising revenue generated on their specific vehicles.</li>
              <li>Allowing the placement of GPS tracking hardware.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">5. Intellectual Property</h2>
            <p>
              The design, brand name, logo marks, code, content structure, and graphics on this website are the intellectual property of GetMyBus. You may not copy, reproduce, or reuse any part of the site without our prior written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">6. Limitation of Liability</h2>
            <p>
              In no event shall GetMyBus, its founders, or team members be liable for any direct, indirect, incidental, or consequential damages arising out of your use or inability to use the Services, including but not limited to missed bus arrivals, transit delays, or ETM payment processing failures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold themed-text">7. Governing Law & Jurisdiction</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Kollam, Kerala, India</strong>.
            </p>
          </section>
        </div>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

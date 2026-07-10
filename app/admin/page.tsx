"use client";

import { useState, useEffect } from "react";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { playClickSound, playSuccessChime } from "@/components/SoundEffects";
// @ts-ignore
import Calculator from "@/components/Calculator";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  timestamp: string;
}

export default function AdminPortal() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "calculator">("leads");

  // Check session storage on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("gmb_admin_pass");
    if (savedPassword) {
      setPassword(savedPassword);
      handleLogin(savedPassword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (passToSubmit?: string) => {
    const activePassword = passToSubmit || password;
    if (!activePassword) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/inquiries?password=${encodeURIComponent(activePassword)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setInquiries(data.inquiries);
        setIsAuthenticated(true);
        sessionStorage.setItem("gmb_admin_pass", activePassword);
        if (!passToSubmit) playSuccessChime();
      } else {
        setError(data.error || "Incorrect admin password.");
        sessionStorage.removeItem("gmb_admin_pass");
      }
    } catch (err) {
      console.error(err);
      setError("Network error while logging in.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    playClickSound();
    setIsAuthenticated(false);
    setPassword("");
    setInquiries([]);
    sessionStorage.removeItem("gmb_admin_pass");
  };

  // Filtered list
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesRole = filterRole === "all" || inq.role === filterRole;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  // Calculate statistics
  const totalLeads = inquiries.length;
  const operatorLeads = inquiries.filter((i) => i.role === "operator").length;
  const advertiserLeads = inquiries.filter((i) => ["advertiser", "agency"].includes(i.role)).length;
  const commuterLeads = inquiries.filter((i) => i.role === "commuter").length;

  const S_ADMIN = `
    .admin-card {
      background: linear-gradient(145deg, rgba(10, 14, 30, 0.45) 0%, rgba(5, 7, 16, 0.65) 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      transition: all 0.3s ease;
    }
    .light-theme .admin-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 244, 255, 0.85) 100%);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
    .admin-input {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: white;
      transition: all 0.2s ease;
    }
    .light-theme .admin-input {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: black;
    }
    .admin-input:focus {
      border-color: #0A84FF;
      outline: none;
      box-shadow: 0 0 10px rgba(10, 132, 255, 0.15);
    }
  `;

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white transition-colors duration-500 ${
      isLight ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"
    }`}>
      <style dangerouslySetInnerHTML={{ __html: S_ADMIN }} />

      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[50vw] h-[50vw] rounded-full overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="w-full h-full opacity-5 blur-[90px]" style={{ background: "radial-gradient(circle, #0A84FF 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-32 pb-24 px-6">
        
        {!isAuthenticated ? (
          /* ==========================================
             LOGIN VIEW
             ========================================== */
          <div className="max-w-md mx-auto my-12 p-8 rounded-[24px] admin-card shadow-2xl text-center">
            <span className="text-[10px] font-semibold text-[#0A84FF] tracking-[0.2em] uppercase mb-4 block">
              Security Access
            </span>
            <h1 className={`text-[28px] font-normal tracking-tight mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
              Admin <span className="font-bold">Portal</span>
            </h1>
            
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 text-left">
              <div>
                <label className={`block text-[12px] font-medium mb-1.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                  Enter Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl text-[14px] admin-input"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-[12px] font-medium text-center">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-xl bg-[#0A84FF] text-white font-semibold text-[13px] hover:bg-[#0070e3] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(10,132,255,0.25)]"
              >
                {loading ? "Authenticating..." : "Access Dashboard"}
              </button>
            </form>
          </div>
        ) : (
          /* ==========================================
             DASHBOARD VIEW
             ========================================== */
          <div>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className={`text-[clamp(28px,4vw,40px)] font-normal tracking-tight leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                  Dashboard <span className="font-bold">Console</span>
                </h1>
                <p className={`text-[13px] font-light mt-1 ${isLight ? "text-slate-500" : "text-white/45"}`}>
                  Manage GetMyBus transit operations, leads, and projections.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`h-9 px-4 rounded-lg border text-[12px] font-medium transition-all ${
                  isLight
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "border-white/[0.1] text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                Logout Account
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex gap-2 border-b border-white/[0.06] mb-8 pb-3">
              <button
                onClick={() => { playClickSound(); setActiveTab("leads"); }}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === "leads"
                    ? "bg-[#0A84FF] text-white shadow-sm"
                    : isLight
                      ? "text-slate-600 hover:bg-slate-200/50"
                      : "text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                📥 Leads Inbox ({totalLeads})
              </button>
              <button
                onClick={() => { playClickSound(); setActiveTab("calculator"); }}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === "calculator"
                    ? "bg-[#0A84FF] text-white shadow-sm"
                    : isLight
                      ? "text-slate-600 hover:bg-slate-200/50"
                      : "text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                📈 Financial Simulator
              </button>
            </div>

            {activeTab === "leads" ? (
              /* ==========================================
                 TAB 1: LEADS INBOX
                 ========================================== */
              <div>
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Leads", value: totalLeads, color: "#0A84FF" },
                    { label: "Operators", value: operatorLeads, color: "#34D399" },
                    { label: "Advertisers", value: advertiserLeads, color: "#A78BFA" },
                    { label: "Commuters", value: commuterLeads, color: "#FFB300" },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl admin-card relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ backgroundColor: stat.color }} />
                      <span className={`text-[11px] font-medium tracking-wide block mb-1 ${isLight ? "text-slate-500" : "text-white/40"}`}>
                        {stat.label}
                      </span>
                      <span className={`text-[28px] font-semibold leading-none ${isLight ? "text-slate-900" : "text-white"}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  {/* Role filter buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { value: "all", label: "All Leads" },
                      { value: "operator", label: "Operators" },
                      { value: "advertiser", label: "Advertisers" },
                      { value: "commuter", label: "Commuters" },
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => { playClickSound(); setFilterRole(btn.value); }}
                        className={`px-4 h-8 rounded-full text-[12px] font-medium transition-all ${
                          filterRole === btn.value
                            ? "bg-[#0A84FF] text-white shadow-sm"
                            : isLight
                              ? "bg-slate-200/60 text-slate-700 hover:bg-slate-200"
                              : "bg-white/[0.03] text-white/60 hover:bg-white/[0.06]"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, text, email..."
                      className="w-full h-8 px-4 rounded-full text-[12px] admin-input"
                    />
                  </div>
                </div>

                {/* Table Container */}
                <div className="p-6 rounded-[24px] admin-card overflow-x-auto shadow-lg">
                  {filteredInquiries.length === 0 ? (
                    <div className="py-12 text-center">
                      <span className="text-[32px] block mb-2">📥</span>
                      <p className={`text-[14px] font-light ${isLight ? "text-slate-400" : "text-white/30"}`}>
                        No matching inquiries found.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[11px] font-semibold tracking-wider uppercase ${
                          isLight ? "border-slate-200 text-slate-400" : "border-white/[0.05] text-white/30"
                        }`}>
                          <th className="pb-3 pr-4">Timestamp</th>
                          <th className="pb-3 pr-4">Contact Info</th>
                          <th className="pb-3 pr-4">Segment</th>
                          <th className="pb-3 pr-4">Message</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y text-[13px] font-light ${
                        isLight ? "divide-slate-100" : "divide-white/[0.03]"
                      }`}>
                        {filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-white/[0.01] transition-colors">
                            {/* Time */}
                            <td className={`py-4 pr-4 align-top whitespace-nowrap text-[11px] ${isLight ? "text-slate-500" : "text-white/40"}`}>
                              {new Date(inq.timestamp).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            
                            {/* Contact details */}
                            <td className="py-4 pr-4 align-top">
                              <div className={`font-semibold ${isLight ? "text-slate-800" : "text-white/80"}`}>{inq.name}</div>
                              <div className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>{inq.email}</div>
                              <div className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-white/40"}`}>{inq.phone}</div>
                            </td>

                            {/* Segment badge */}
                            <td className="py-4 pr-4 align-top whitespace-nowrap">
                              <span
                                className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full inline-block"
                                style={{
                                  backgroundColor:
                                    inq.role === "operator"
                                      ? "rgba(52,211,153,0.15)"
                                      : inq.role === "commuter"
                                        ? "rgba(255,179,0,0.15)"
                                        : "rgba(167,139,250,0.15)",
                                  color:
                                    inq.role === "operator"
                                      ? "#34D399"
                                      : inq.role === "commuter"
                                        ? "#FFB300"
                                        : "#A78BFA",
                                  border: `1px solid ${
                                    inq.role === "operator"
                                      ? "rgba(52,211,153,0.25)"
                                      : inq.role === "commuter"
                                        ? "rgba(255,179,0,0.25)"
                                        : "rgba(167,139,250,0.25)"
                                  }`,
                                }}
                              >
                                {inq.role}
                              </span>
                            </td>

                            {/* Message body */}
                            <td className="py-4 pr-4 align-top leading-relaxed text-[13px] max-w-sm break-words select-text">
                              {inq.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : (
              /* ==========================================
                 TAB 2: BUSINESS CALCULATOR
                 ========================================== */
              <div className="p-6 rounded-[24px] admin-card shadow-lg overflow-x-hidden">
                <Calculator />
              </div>
            )}
          </div>
        )}

      </div>

      <Footer theme={theme} />
      <ScrollToTop />
    </main>
  );
}

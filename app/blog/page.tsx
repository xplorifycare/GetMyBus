"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { blogArticles } from "@/lib/blogData";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";

export default function BlogPortal() {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";

  // Aurora background overrides
  const S_PORTAL = `
    .c-noise {
      position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.03;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .blog-glow-card {
      background: linear-gradient(145deg, rgba(10, 14, 30, 0.45) 0%, rgba(5, 7, 16, 0.65) 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .light-theme .blog-glow-card {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 244, 255, 0.85) 100%);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
  `;

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${
      isLight ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"
    } ${lang === "ML" ? "malayalam-font" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: S_PORTAL }} />
      <div className="c-noise" aria-hidden />

      {/* Navbar wrapper */}
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] rounded-full overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="w-full h-full opacity-10 blur-[80px]" style={{ background: "radial-gradient(circle, #0A84FF 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-32 pb-24 px-6">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.2em] uppercase mb-4 block">
            {lang === "ML" ? "ഔദ്യോഗിക ബ്ലോഗ്" : "Official Blog"}
          </span>
          <h1 className={`text-[clamp(32px,5vw,52px)] font-normal tracking-tight leading-[1.08] mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>
            {lang === "ML" ? (
              <>
                ബസ് സർവീസുകൾ ഡിജിറ്റലാവുന്നു,
                <br />
                <span className="text-silver-matte font-black">ഉടമകൾക്ക് വരുമാനവും!</span>
              </>
            ) : (
              <>
                Transit Digitisation &amp;
                <br />
                <span className="text-silver-matte font-black">Operator Monetisation</span>
              </>
            )}
          </h1>
          <p className={`text-[15px] leading-relaxed font-light ${isLight ? "text-slate-500" : "text-white/45"}`}>
            {lang === "ML" 
              ? "GetMyBus അണിയറപ്രവർത്തകർ തയ്യാറാക്കുന്ന സാങ്കേതിക വിവരങ്ങളും, ബസ് പരസ്യ വരുമാന ഗൈഡുകളും, പുതിയ അപ്ഡേറ്റുകളും ഇവിടെ വായിക്കാം."
              : "Read our engineering stories, bus operator monetisation guides, and local transit advertising reports directly from the GetMyBus team."
            }
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound(0.005)}
              className="group flex flex-col justify-between p-8 rounded-[24px] blog-glow-card hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/20"
            >
              <div>
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: article.color }}
                    />
                    <span className={`text-[12px] font-semibold tracking-wide ${isLight ? "text-slate-800" : "text-white/80"}`}>
                      {article.author}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-md tracking-wider ${isLight ? "bg-slate-100 text-slate-500" : "bg-white/[0.04] text-white/40"}`}>
                    {lang === "ML" ? article.tagMl : article.tag}
                  </span>
                </div>

                {/* Headline */}
                <h2 className={`text-[20px] sm:text-[22px] leading-tight font-medium mb-4 tracking-tight group-hover:text-[#0A84FF] transition-colors ${isLight ? "text-slate-900" : "text-white"}`}>
                  {lang === "ML" ? article.headlineMl : article.headline}
                </h2>

                {/* Snippet */}
                <p className={`text-[14px] leading-relaxed mb-8 font-light ${isLight ? "text-slate-600" : "text-white/45"}`}>
                  {lang === "ML" ? article.snippetMl : article.snippet}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto">
                <span className={`text-[11px] ${isLight ? "text-slate-900/40" : "text-white/30"}`}>
                  {lang === "ML" ? article.dateMl : article.date}
                </span>
                <span className="text-[12px] font-semibold text-[#0A84FF] hover:text-[#0070e3] flex items-center gap-1 transition-colors">
                  <span>{lang === "ML" ? "വായിക്കുക" : "Read Article"}</span>
                  <svg className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer theme={theme} />
      <ScrollToTop />
    </main>
  );
}

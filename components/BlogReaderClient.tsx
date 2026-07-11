"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar, { Lang } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { BlogArticle } from "@/lib/blogData";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";

export default function BlogReaderClient({ article }: { article: BlogArticle }) {
  const [lang, setLang] = useState<Lang>("EN");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";
  
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  const handleShare = async () => {
    const shareData = {
      title: `${lang === "ML" ? article.headlineMl : article.headline} | GetMyBus Blog`,
      text: lang === "ML" ? article.snippetMl : article.snippet,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("copied");
        playClickSound();
        setTimeout(() => setShareStatus("idle"), 2000);
      } catch (err) {
        console.log("Clipboard error:", err);
      }
    }
  };

  const S_READER = `
    .c-noise {
      position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.03;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    .article-body p {
      margin-bottom: 1.5rem;
      font-size: 15px;
      line-height: 1.8;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.75);
    }
    .light-theme .article-body p {
      color: rgba(18, 19, 22, 0.8);
    }
    .article-body h2 {
      font-size: 20px;
      font-weight: 500;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .light-theme .article-body h2 {
      color: #121316;
    }
    .article-body blockquote {
      border-left: 2px solid #0A84FF;
      padding-left: 1.25rem;
      font-style: italic;
      color: rgba(255, 255, 255, 0.6);
      margin: 2rem 0;
    }
    .light-theme .article-body blockquote {
      color: rgba(18, 19, 22, 0.65);
    }
    .article-body strong {
      font-weight: 500;
      color: #ffffff;
    }
    .light-theme .article-body strong {
      color: #121316;
    }
    .article-body a {
      color: #0A84FF;
      text-decoration: underline;
      text-underline-offset: 4px;
      transition: color 0.2s ease;
    }
    .article-body a:hover {
      color: #0070e3;
    }
  `;

  return (
    <main className={`relative min-h-screen selection:bg-[#0A84FF] selection:text-white no-scrollbar transition-colors duration-500 ${
      isLight ? "bg-[#f4f5f7] text-[#121316] light-theme" : "bg-[#070708] text-white dark-theme"
    } ${lang === "ML" ? "malayalam-font" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: S_READER }} />
      <div className="c-noise" aria-hidden />

      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[8%] right-[15%] w-[45vw] h-[45vw] rounded-full overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="w-full h-full opacity-[0.06] blur-[90px]" style={{ background: "radial-gradient(circle, #34D399 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto pt-32 pb-24 px-6">
        
        {/* Breadcrumb navigation */}
        <div className="mb-10 flex items-center gap-2 text-[12px] font-normal leading-none select-none">
          <Link
            href="/"
            onClick={() => playClickSound()}
            onMouseEnter={() => playHoverSound(0.005)}
            className={`transition-colors hover:text-[#0A84FF] ${isLight ? "text-slate-500" : "text-white/40"}`}
          >
            {lang === "ML" ? "ഹോം" : "Home"}
          </Link>
          <span className={isLight ? "text-slate-300" : "text-white/20"}>/</span>
          <Link
            href="/blog"
            onClick={() => playClickSound()}
            onMouseEnter={() => playHoverSound(0.005)}
            className={`transition-colors hover:text-[#0A84FF] ${isLight ? "text-slate-500" : "text-white/40"}`}
          >
            {lang === "ML" ? "ബ്ലോഗ്" : "Blog"}
          </Link>
          <span className={isLight ? "text-slate-300" : "text-white/20"}>/</span>
          <span className={`line-clamp-1 font-medium ${isLight ? "text-slate-800" : "text-white/85"}`}>
            {lang === "ML" ? article.headlineMl : article.headline}
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Tag & Read Time */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-md tracking-wider ${
              isLight ? "bg-slate-100 text-slate-500" : "bg-white/[0.04] text-white/40"
            }`}>
              {lang === "ML" ? article.tagMl : article.tag}
            </span>
            <span className={`text-[12px] ${isLight ? "text-slate-400" : "text-white/30"}`}>
              {lang === "ML" ? article.readTimeMl : article.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-[clamp(28px,4.5vw,42px)] font-bold tracking-tight leading-[1.12] mb-6 ${
            isLight ? "text-slate-900" : "text-white"
          }`}>
            {lang === "ML" ? article.headlineMl : article.headline}
          </h1>

          {/* Author & Date info */}
          <div className="flex items-center justify-between py-4 border-y border-white/[0.04] themed-divider-vertical">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0A84FF]/10 border border-[#0A84FF]/25 text-[#0A84FF] font-bold text-[11px] flex items-center justify-center select-none uppercase">
                GT
              </div>
              <div className="flex flex-col text-left">
                <span className={`text-[12px] font-semibold ${isLight ? "text-slate-800" : "text-white/80"}`}>
                  {article.author}
                </span>
                <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-white/30"}`}>
                  {lang === "ML" 
                    ? `പ്രസിദ്ധീകരിച്ചത്: ${article.dateMl} · GetMyBus` 
                    : `Published on ${article.date} · GetMyBus Insights`
                  }
                </span>
              </div>
            </div>

            {/* Localized Share Button */}
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all duration-200 ${
                isLight 
                  ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100" 
                  : "border-white/[0.06] bg-white/[0.03] text-white/80 hover:bg-white/[0.08]"
              }`}
            >
              <svg className="w-3.5 h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>
                {shareStatus === "copied"
                  ? (lang === "ML" ? "ലിങ്ക് കോപ്പി ചെയ്തു!" : "Link Copied!")
                  : (lang === "ML" ? "പങ്കുവെക്കുക" : "Share")
                }
              </span>
            </button>
          </div>
        </header>

        {/* Article Content */}
        <article className="article-body mb-20">
          <div dangerouslySetInnerHTML={{ __html: lang === "ML" ? article.contentHtmlMl : article.contentHtml }} />
        </article>

        {/* Bottom CTA Block */}
        <div className={`p-8 rounded-[24px] border text-center transition-all duration-300 ${
          isLight
            ? "bg-slate-50 border-slate-200/80 shadow-md"
            : "bg-white/[0.015] border-white/[0.05] shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        }`}>
          <h3 className={`text-[18px] font-medium mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
            {lang === "ML" ? "യാത്രാനുഭവം മെച്ചപ്പെടുത്താൻ തയാറാണോ?" : "Ready to upgrade your transit experience?"}
          </h3>
          <p className={`text-[13px] max-w-md mx-auto mb-6 ${isLight ? "text-slate-500" : "text-white/45"}`}>
            {lang === "ML" 
              ? "കൊല്ലം-തിരുവനന്തപുരം റൂട്ടിലെ വെയിറ്റ്‌ലിസ്റ്റിൽ ചേരാൻ താഴെയുള്ള ബട്ടണിൽ അമർത്തുക. ബസ് ഉടമകൾക്ക് ഞങ്ങളുടെ പോർട്ടലിലൂടെ വരുമാനം വർദ്ധിപ്പിക്കാനും സാധിക്കും."
              : "Join our Kollam–Thiruvananthapuram corridor waitlist or register your private passenger bus for monetization today."
            }
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/#partner"
              onClick={() => playClickSound()}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#0A84FF] to-[#0070e3] text-white px-6 h-10 font-semibold text-[12px] rounded-lg transition-transform hover:scale-[1.02]"
            >
              {lang === "ML" ? "വെയിറ്റ്‌ലിസ്റ്റിൽ ചേരുക" : "Join waitlist"}
            </Link>
            <Link
              href="/"
              onClick={() => playClickSound()}
              className={`inline-flex items-center justify-center px-6 h-10 font-semibold text-[12px] rounded-lg border transition-all ${
                isLight
                  ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                  : "border-white/[0.1] text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              {lang === "ML" ? "ഹോമിലേക്ക് മടങ്ങുക" : "Back to Home"}
            </Link>
          </div>
        </div>

      </div>

      <Footer theme={theme} />
      <ScrollToTop />
    </main>
  );
}

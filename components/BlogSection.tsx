"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";
import { blogArticles } from "@/lib/blogData";

export default function BlogSection({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLight = theme === "light";

  return (
    <section
      id="blog"
      ref={ref}
      className={`relative w-full py-24 px-6 md:px-12 overflow-hidden border-t themed-divider ${
        isLight ? "bg-white" : "bg-[#060810]"
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[#0A84FF] tracking-[0.18em] uppercase mb-3">
            Blog &amp; Insights
          </p>
          <h2 className="text-[clamp(26px,4vw,38px)] font-normal themed-text tracking-tight mb-4 leading-tight">
            Latest from our Blog
          </h2>
          <p className="text-[14px] themed-text-muted max-w-md font-normal leading-relaxed">
            Stay updated with transit innovation stories, operational guides for fleet owners, and local advertising strategies.
          </p>
        </motion.div>

        {/* Blog Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {blogArticles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => playHoverSound(0.005)}
              className={`group flex flex-col justify-between p-6 sm:p-7 rounded-[20px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isLight
                  ? "bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-[#0A84FF]/30 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
                  : "bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.025] hover:border-indigo-500/20 shadow-[0_8px_40px_rgb(0,0,0,0.2)]"
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                  {/* Author Badge */}
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: article.color }}
                    />
                    <span className={`text-[12px] font-semibold tracking-wide ${
                      isLight ? "text-slate-800" : "text-white/80"
                    }`}>
                      {article.author}
                    </span>
                  </div>

                  {/* Tag & Read Time */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md tracking-wider ${
                      isLight 
                        ? "bg-slate-100 text-slate-500" 
                        : "bg-white/[0.04] text-white/40"
                    }`}>
                      {article.tag}
                    </span>
                    <span className="text-[11px] text-white/30 hidden sm:inline">{article.readTime}</span>
                  </div>
                </div>

                {/* Headline */}
                <h3 className={`text-[16px] sm:text-[17px] leading-snug font-medium mb-3 tracking-tight group-hover:text-[#0A84FF] transition-colors ${
                  isLight ? "text-slate-900" : "text-white"
                }`}>
                  {article.headline}
                </h3>

                {/* Snippet */}
                <p className="text-[13px] leading-relaxed mb-6 font-normal themed-text-muted">
                  {article.snippet}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-auto">
                <span className="text-[11px] text-white/30">{article.date}</span>
                
                <Link
                  href={`/blog/${article.slug}`}
                  onClick={() => playClickSound()}
                  className="text-[12px] font-medium text-[#0A84FF] hover:text-[#0070e3] flex items-center gap-1 transition-colors group/link"
                >
                  <span>Read Article</span>
                  <svg 
                    className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover/link:translate-x-1" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blog CTA */}
        <div className="flex justify-center">
          <Link href="/blog" passHref legacyBehavior>
            <motion.a
              onClick={() => playClickSound()}
              onMouseEnter={() => playHoverSound(0.01)}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`inline-flex items-center gap-2 text-[13px] font-medium px-6 py-3 rounded-full border transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                isLight
                  ? "border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50"
                  : "border-white/[0.1] hover:border-white/[0.18] text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <svg className="w-4 h-4 text-[#0A84FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Visit Our Blog Portal
            </motion.a>
          </Link>
        </div>

      </div>
    </section>
  );
}

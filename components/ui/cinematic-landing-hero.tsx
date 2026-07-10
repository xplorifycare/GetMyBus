"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { playClickSound } from "@/components/SoundEffects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const S = `
  .gsap-reveal { visibility: hidden; }

  /* noise */
  .c-noise {
    position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.03;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* aurora */
  @keyframes ao1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(80px,-50px) scale(1.2)}70%{transform:translate(-40px,40px) scale(.9)}}
  @keyframes ao2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-90px,60px) scale(1.15)}70%{transform:translate(60px,-35px) scale(.85)}}
  @keyframes ao3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,70px) scale(1.1)}}
  .ao1{animation:ao1 14s ease-in-out infinite}
  .ao2{animation:ao2 18s ease-in-out infinite}
  .ao3{animation:ao3 11s ease-in-out infinite}

  /* grid */
  .c-grid{
    background-size:56px 56px;
    background-image:
      linear-gradient(to right,rgba(99,102,241,.05) 1px,transparent 1px),
      linear-gradient(to bottom,rgba(99,102,241,.05) 1px,transparent 1px);
    mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%);
  }

  /* ── CARD ── */
  .c-card{
    background:linear-gradient(145deg,rgba(8,12,30,.97) 0%,rgba(5,8,20,.99) 100%);
    border:1px solid rgba(99,102,241,.12);
    box-shadow:
      0 0 0 1px rgba(255,255,255,.025),
      0 60px 140px -25px rgba(0,0,0,.95),
      0 0 100px -15px rgba(99,102,241,.07),
      inset 0 1px 0 rgba(255,255,255,.05);
    position:relative;
  }
  .c-card::before{
    content:'';position:absolute;inset:-1px;border-radius:inherit;
    background:conic-gradient(from 180deg at 50% 50%,
      rgba(99,102,241,.5) 0deg, rgba(6,182,212,.25) 80deg,
      rgba(139,92,246,.35) 160deg, rgba(99,102,241,.05) 220deg,
      rgba(6,182,212,.15) 280deg, rgba(99,102,241,.5) 360deg);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
    pointer-events:none;opacity:.6;
  }
  .c-spotlight{
    position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;
    background:radial-gradient(700px circle at var(--mx,50%) var(--my,50%),
      rgba(99,102,241,.06) 0%,transparent 65%);
  }

  /* gradients text */
  .gt-indigo{background:linear-gradient(135deg,#e0e7ff 0%,#a5b4fc 35%,#818cf8 65%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .gt-cyan{background:linear-gradient(135deg,#cffafe 0%,#67e8f9 35%,#22d3ee 65%,#0891b2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .gt-white{background:linear-gradient(180deg,#fff 0%,rgba(255,255,255,.5) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

  /* skeuomorphic premium text styles */
  .text-3d-matte {
    color: #ffffff;
    text-shadow: 
      0 10px 30px rgba(255, 255, 255, 0.18), 
      0 2px 4px rgba(255, 255, 255, 0.08);
  }
  .text-silver-matte {
    background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.53) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: 
      drop-shadow(0px 10px 20px rgba(255, 255, 255, 0.15)) 
      drop-shadow(0px 2px 4px rgba(255, 255, 255, 0.08));
  }

  /* Light Theme overrides */
  .light-theme .text-3d-matte {
    color: #121316;
    text-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.05), 
      0 2px 4px rgba(0, 0, 0, 0.03);
  }
  .light-theme .text-silver-matte {
    background: linear-gradient(180deg, #121316 0%, rgba(18, 19, 22, 0.65) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .light-theme .c-pill {
    background: rgba(10, 132, 255, 0.06);
    border: 1px solid rgba(10, 132, 255, 0.15);
    color: #0A84FF;
  }
  .light-theme .c-pill span {
    color: #0A84FF !important;
  }
  .light-theme .ht-stat span {
    color: #0A84FF !important;
  }
  .light-theme .ht-stat .c-ping {
    background-color: #0A84FF !important;
  }
  .light-theme .ht-stat span.relative + span {
    color: #0A84FF !important;
  }
  .light-theme .c-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 243, 250, 0.9) 100%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 
      0 0 0 1px rgba(0, 0, 0, 0.01),
      0 40px 100px -20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  .light-theme .c-card .text-white {
    color: #121316 !important;
  }
  .light-theme .c-card .text-white\/45 {
    color: rgba(18, 19, 22, 0.6) !important;
  }
  .light-theme .c-card .bg-white\/5 {
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-color: rgba(0, 0, 0, 0.06) !important;
  }
  .light-theme .c-card .text-white\/30 {
    color: rgba(18, 19, 22, 0.45) !important;
  }
  .light-theme .c-card .text-white\/80 {
    color: rgba(18, 19, 22, 0.85) !important;
  }

  /* ── phone ── */
  .c-phone{
    width: 230px;
    height: 460px;
    background:linear-gradient(150deg,#1d1d1f,#0d0d0f);
    box-shadow:
      inset 0 0 0 1.5px #3a3a3c,
      inset 0 0 0 6px #000,
      0 60px 120px -15px rgba(0,0,0,.95),
      0 25px 50px rgba(0,0,0,.7),
      0 0 0 1px rgba(255,255,255,.03),
      0 0 60px -5px rgba(99,102,241,.15);
    transition: width 0.3s ease, height 0.3s ease;
  }
  @media (min-width: 1024px) {
    .c-phone {
      width: 270px;
      height: 550px;
    }
  }
  @media (min-width: 1280px) {
    .c-phone {
      width: 290px;
      height: 580px;
    }
  }
  .c-phone-btn{background:linear-gradient(90deg,#3a3a3c,#1c1c1e);box-shadow:-1px 0 4px rgba(0,0,0,.6)}
  .c-screen-bg{background:radial-gradient(ellipse at 35% 20%,#0c1836 0%,#04070e 65%)}
  .c-sheen{background:linear-gradient(120deg,rgba(255,255,255,.07) 0%,transparent 55%)}
  .c-widget{
    background:rgba(255,255,255,.035);
    border:1px solid rgba(255,255,255,.06);
    box-shadow:0 8px 24px rgba(0,0,0,.4),inset 0 1px rgba(255,255,255,.04);
  }

  /* badges */
  .c-badge{
    background:linear-gradient(135deg,rgba(12,18,45,.92),rgba(8,12,30,.96));
    border:1px solid rgba(99,102,241,.2);
    box-shadow:0 0 0 1px rgba(255,255,255,.03),0 24px 60px rgba(0,0,0,.6),0 0 40px rgba(99,102,241,.08),inset 0 1px rgba(255,255,255,.07);
    backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  }

  /* progress ring */
  .c-ring{
    transform:rotate(-90deg);transform-origin:center;
    stroke-dasharray:402;stroke-dashoffset:402;
    stroke-linecap:round;
    filter:drop-shadow(0 0 10px rgba(99,102,241,.9));
  }
  @keyframes rp{0%{transform:scale(1);opacity:.4}100%{transform:scale(1.5);opacity:0}}
  .rp1{animation:rp 2.4s ease-out infinite}
  .rp2{animation:rp 2.4s ease-out infinite .9s}
  .rp3{animation:rp 2.4s ease-out infinite 1.8s}

  /* stat pills */
  .c-pill{background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18);box-shadow:0 0 20px rgba(99,102,241,.06)}

  /* float animations */
  @keyframes fa{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes fb{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes fc{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  .fa{animation:fa 6s ease-in-out infinite}
  .fb{animation:fb 7.5s ease-in-out infinite .7s}
  .fc{animation:fc 5.5s ease-in-out infinite 1.4s}


  /* store download buttons */
  .c-btn-store {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    border-radius: 14px;
    width: 168px;
    height: 56px;
    flex-shrink: 0;
    transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .c-btn-store:hover { transform: translateY(-3px); }
  .c-btn-store:active { transform: translateY(0px); }
  .c-btn-apple {
    background: #fff;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
    color: #000;
  }
  .c-btn-apple:hover {
    background: #f0f0f0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.6);
  }
  .c-btn-play {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
    color: #fff;
  }
  .c-btn-play:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(99,102,241,0.4);
    box-shadow: 0 12px 32px rgba(99,102,241,0.18), 0 4px 20px rgba(0,0,0,0.4);
  }
  .c-btn-apple .btn-label-top { color: rgba(0,0,0,0.55); }
  .c-btn-apple .btn-label-main { color: #000; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
  .c-btn-play .btn-label-top { color: rgba(255,255,255,0.45); }
  .c-btn-play .btn-label-main { color: #fff; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
  .btn-label-top { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 600; line-height: 1; margin-bottom: 2px; }
  .btn-icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; }



  /* route line animation */
  @keyframes dash{to{stroke-dashoffset:-20}}
  .c-route{animation:dash 1.6s linear infinite}

  /* live dot */
  @keyframes ping{0%{transform:scale(1);opacity:.8}70%{transform:scale(2.6);opacity:0}100%{transform:scale(2.6);opacity:0}}
  .c-ping{animation:ping 1.9s ease-out infinite}

  /* intro clip reveal */
  .clip-start{clip-path:inset(0 100% 0 0)}

  /* scroll-linked counter */
  .c-counter{}
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  theme?: "dark" | "light";
}

export function CinematicHero({
  brandName = "GetMyBus",
  tagline1 = "Kerala's private buses,",
  tagline2 = "live and earning.",
  cardHeading = "Real-Time Transit Intelligence",
  cardDescription = <>
    <span className="text-white font-semibold">GetMyBus</span> brings live GPS
    tracking, cashless ETM billing and smart onboard screens to every private
    bus in Kerala — giving commuters live tracking and bus owners ₹3,500/month.
  </>,
  metricValue = 2,
  metricLabel = "Pilot Buses Live",
  ctaHeading = "Get the GetMyBus App",
  ctaDescription = "Live GPS tracking, UPI payments and real-time bus schedules — all in one app.",
  theme = "dark",
  className,
  id,
  style,
}: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const phoneRef     = useRef<HTMLDivElement>(null);
  const raf          = useRef(0);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* GSAP Combined Intro & Mouse Spotlight Animations */
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        if (!cardRef.current || !phoneRef.current) return;
        const r = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        cardRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
        const nx = (e.clientX / window.innerWidth  - .5) * 2;
        const ny = (e.clientY / window.innerHeight - .5) * 2;
        gsap.to(phoneRef.current, { rotationY: nx * 9, rotationX: -ny * 9, ease: "power3.out", duration: 1.5 });
      });
    };
    window.addEventListener("mousemove", onMove);

    let ctx: gsap.Context | null = null;
    try {
      const mob = window.innerWidth < 768;

      ctx = gsap.context(() => {
        /* initial states */
        gsap.set(".c-card",  { y: window.innerHeight + 280, autoAlpha: 1 });
        gsap.set([".ci-left",".ci-phone-wrap",".ci-badge",".ci-widget"], { autoAlpha: 0 });
        gsap.set(".ci-badge", { z: 80, transformPerspective: 1200 });
        gsap.set(".cta-s",   { autoAlpha: 0, scale: .82, filter: "blur(32px)" });

        /* 1. Intro Animation — runs immediately on mount */
        gsap.timeline({ delay: .12 })
          .from(".ht1",     { duration: 1.7, autoAlpha: 0, y: 90, filter: "blur(28px)", rotationX: -28, ease: "expo.out" })
          .from(".ht2",     { duration: 1.3, clipPath: "inset(0 100% 0 0)", ease: "power4.inOut" }, "-=.9")
          .from(".ht-sub",  { duration: 1,   autoAlpha: 0, y: 28, ease: "expo.out" }, "-=.5")
          .from(".ht-stat", { duration: .9,  autoAlpha: 0, y: 18, ease: "expo.out", stagger: .08 }, "-=.4");

        /* 2. Scroll-Linked Animation Timeline */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=7500",
            pin: true,
            scrub: 1,
            anticipatePin: 1
          },
        });

        tl
          /* P1 — background text blurs away, card rises */
          .to([".ht-wrap",".c-grid",".c-aura"], { scale: 1.15, filter: "blur(20px)", autoAlpha: 0, ease: "power2.inOut", duration: 2 }, 0)
          .to(".c-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)

          /* P2 — card fills screen */
          .to(".c-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })

          /* P3 — phone rockets from depth */
          .fromTo(".ci-phone-wrap",
            { y: 340, z: -700, rotationX: 60, rotationY: -20, autoAlpha: 0, scale: .5 },
            { y: 0,   z: 0,    rotationX: 0,  rotationY: 0,  autoAlpha: 1, scale: 1, ease: "expo.out", duration: 3 }, "-=.5")

          /* P4 — phone widgets stagger in */
          .fromTo(".ci-widget",
            { y: 55, autoAlpha: 0, scale: .88 },
            { y: 0,  autoAlpha: 1, scale: 1, stagger: .14, ease: "back.out(1.4)", duration: 1.5 }, "-=1.8")

          /* progress ring + live counter */
          .to(".c-ring",    { strokeDashoffset: 78, duration: 2.4, ease: "power3.inOut" }, "-=1.3")
          .to(".c-counter", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2.2, ease: "expo.out" }, "-=2.2")

          /* P5 — floating badges spring */
          .fromTo(".ci-badge",
            { y: 100, z: 80, autoAlpha: 0, scale: .6, rotationZ: -10 },
            { y: 0,   z: 80, autoAlpha: 1, scale: 1,  rotationZ: 0,   ease: "back.out(1.7)", duration: 1.5, stagger: .16 }, "-=2")

          /* P6 — left content slides in */
          .fromTo(".ci-left",
            { x: -80, autoAlpha: 0 },
            { x:  0,  autoAlpha: 1, ease: "power4.out", duration: 1.8 }, "-=1.5")

          /* hold viewport state */
          .to({}, { duration: 3 })

          /* P7 — CTA swap */
          .set(".cta-s",   { autoAlpha: 1 })
          .to({}, { duration: 1.5 })

          .to([".ci-phone-wrap",".ci-badge",".ci-left"],
            { scale: .86, y: -55, z: -250, autoAlpha: 0, ease: "power3.in", duration: 1.3, stagger: .04 })

          .to(".c-card",
            { width: mob ? "94vw" : "85vw", height: mob ? "92vh" : "84vh",
              borderRadius: mob ? "28px" : "32px", ease: "expo.inOut", duration: 2 }, "pb")
          .to(".cta-s", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 2 }, "pb")

          /* fly off upward */
          .to(".c-card", { y: -window.innerHeight - 400, ease: "power3.in", duration: 1.5 });

      }, containerRef);
    } catch (e) {
      console.warn("GSAP/ScrollTrigger failed to load", e);
    }

    return () => { 
      window.removeEventListener("mousemove", onMove); 
      cancelAnimationFrame(raf.current); 
      ctx?.revert(); 
    };
  }, [metricValue]);

  if (isMobile) {
    return (
      <div
        id={id}
        className={cn(
          "relative w-full min-h-screen pt-36 pb-24 px-4 sm:px-6 flex flex-col items-center justify-start font-sans antialiased",
          theme === "light" ? "bg-[#f4f5f7] light-theme text-[#121316]" : "bg-[#03050d] dark-theme text-white",
          className
        )}
        style={style}
      >
        <style dangerouslySetInnerHTML={{ __html: S }} />
        <div className="c-noise" aria-hidden />

        {/* Aurora glow background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[10%] left-[10%] w-[80vw] h-[80vw] rounded-full"
            style={{ background: "radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 70%)", filter: "blur(60px)" }} />
        </div>

        {/* 1. INTRO HEADER */}
        <div className="relative z-10 w-full max-w-xl text-center mb-28 flex flex-col items-center">
          {/* eyebrow */}
          <div className="c-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-indigo-500/10 bg-indigo-500/5 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            <span className="text-[10px] text-indigo-300 tracking-[0.1em] uppercase font-bold">
              Coming Soon · Kollam–TVM Corridor
            </span>
          </div>

          {/* headline */}
          <h1 className="text-3d-matte text-3xl sm:text-4xl font-black tracking-[-0.03em] leading-[1.25] mb-6">
            {tagline1} <span className="text-silver-matte">{tagline2}</span>
          </h1>

          {/* subtitle */}
          <p className="text-white/45 text-xs sm:text-sm max-w-sm leading-relaxed font-light mb-8">
            Real-time tracking for commuters · ₹3,500/month for bus owners
          </p>

          {/* stats pills */}
          <div className="flex flex-wrap justify-center gap-3 max-w-md w-full">
            {[
              { v: String(metricValue), l: metricLabel },
              { v: "Kollam-TVM", l: "First corridor" },
              { v: "4 s", l: "GPS refresh" },
              { v: "₹0", l: "Self-funded" },
            ].map(s => (
              <div key={s.l} className="c-pill px-3 py-1.5 rounded-full flex items-center gap-2 border border-indigo-500/10 bg-indigo-500/5 backdrop-blur-md">
                <span className="text-[11px] font-bold text-indigo-300">{s.v}</span>
                <span className="text-[9px] text-white/35 font-medium whitespace-nowrap">{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. THE CENTRAL INTERACTIVE PREVIEW CARD */}
        <div className="relative z-10 w-full max-w-md c-card rounded-[24px] p-5 sm:p-6 mb-20 flex flex-col gap-6">
          <div className="c-spotlight" aria-hidden />

          {/* Watermark brand name */}
          <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden opacity-30" aria-hidden>
            <span className="font-black tracking-[-0.06em] select-none text-[5rem] text-white/5">
              {brandName}.
            </span>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col gap-6">
            {/* Phone screen on top for mobile visually */}
            <div className="flex justify-center">
              <div className="c-phone rounded-[2.5rem] relative scale-[0.95] sm:scale-100 flex-shrink-0">
                {/* Dynamic Island */}
                <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-black rounded-full z-40 flex items-center justify-end px-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                </div>

                {/* Map screen */}
                <div className="absolute inset-[6px] rounded-[2.2rem] overflow-hidden text-white bg-[#070913]">
                  {/* Map SVG */}
                  <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 260 520" fill="none">
                    <path d="M0 60h260M0 120h260M0 180h260M0 240h260M0 300h260M0 360h260M0 420h260M0 480h260" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                    <path d="M-10 100 C 60 120, 40 180, 80 210 C 120 230, 90 280, 140 320 Z" fill="#0c1d3a" opacity="0.45" />
                    <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="#16223F" strokeWidth="5" />
                    <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="#0A84FF" strokeWidth="3" strokeDasharray="8 6" className="c-route" />
                    <circle cx="150" cy="200" r="3.5" fill="#0A84FF" stroke="#070913" strokeWidth="1" />
                  </svg>
                  
                  {/* Floating User Location Pin */}
                  <div className="absolute top-[200px] left-[150px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="relative flex h-8 w-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-40" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0A84FF] border-2 border-white" />
                    </span>
                  </div>

                  {/* Floating Bus Marker */}
                  <div className="absolute top-[290px] left-[88px] -translate-x-1/2 -translate-y-1/2">
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-35" />
                      <div className="relative w-5 h-5 rounded-full bg-[#34D399] border border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="4" y="3" width="16" height="13" rx="2" />
                          <circle cx="8" cy="20" r="1.5" />
                          <circle cx="16" cy="20" r="1.5" />
                        </svg>
                      </div>
                    </span>
                  </div>

                  {/* App UI */}
                  <div className="relative w-full h-full pt-10 px-3 pb-4 flex flex-col justify-between z-10 pointer-events-none">
                    <div className="w-full h-8 rounded-full border border-white/[0.08] bg-[#070913]/90 backdrop-blur-md px-3 flex items-center justify-between shadow-lg">
                      <span className="text-[8px] font-semibold text-white/95">Kollam – TVM Corridor</span>
                      <span className="text-[7px] text-[#34D399] font-bold uppercase tracking-wider">{metricValue} LIVE</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/20 backdrop-blur-md rounded-full px-3 py-1 text-emerald-400">
                        <span className="text-[8px] font-semibold uppercase">Bus Arriving</span>
                        <span className="text-[8px] font-bold">2 Mins Away</span>
                      </div>

                      <div className="c-widget rounded-xl p-2.5 text-left shadow-2xl relative overflow-hidden bg-[#070913]/90">
                        <h4 className="text-[9px] font-bold text-white leading-tight">KL-15-A-4020</h4>
                        <span className="text-[7px] text-white/40 font-medium uppercase">Fast Express</span>
                        <div className="flex justify-between items-center text-[8px] text-white/70 mt-1 mb-1">
                          <span>Vytila Hub</span>
                          <span className="text-white font-semibold">350m away</span>
                        </div>
                        <div className="w-full h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0A84FF] w-[85%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Stats below */}
            <div className="text-center">
              <h3 className="text-white font-bold text-[20px] mb-3 leading-tight">
                {cardHeading}
              </h3>
              <p className="text-white/60 text-[13px] leading-relaxed mb-6 font-normal">
                {cardDescription}
              </p>

              {/* 2x2 Stat Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { lbl: "GPS Refresh", val: "4s", desc: "Live interval" },
                  { lbl: "Cashless Ready", val: "UPI", desc: "ETM & QR ticketing" },
                  { lbl: "Pilot Buses", val: String(metricValue), desc: "Kollam-TVM" },
                  { lbl: "Districts Roadmap", val: "14", desc: "Systematic path" }
                ].map(s => (
                  <div key={s.lbl} className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-left">
                    <div className="text-[14px] font-bold text-white mb-0.5">{s.val}</div>
                    <div className="text-[10px] font-semibold text-white/80 leading-tight mb-0.5">{s.lbl}</div>
                    <div className="text-[9px] text-white/40">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. SUB CTA BOTTOM BAR */}
        <div className="relative z-10 w-full max-w-md text-center flex flex-col items-center">
          <div className="c-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-indigo-500/10">
            <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">Early Access · Live Portal</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-none mb-3 gt-indigo">{ctaHeading}</h2>
          <p className="text-white/45 text-xs mb-6 max-w-xs">{ctaDescription}</p>
          <a
            href="#partner"
            onClick={() => playClickSound()}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A84FF] to-[#0070e3] text-white px-8 h-12 font-semibold text-[13px] rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center font-sans antialiased transition-colors duration-500",
        theme === "light" ? "bg-[#f4f5f7] light-theme text-[#121316]" : "bg-[#03050d] dark-theme text-white",
        className
      )}
      style={{ perspective: "1800px", ...style }}
    >
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <div className="c-noise" aria-hidden />

      {/* aurora */}
      <div className="c-aura absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="ao1 absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(99,102,241,.2) 0%,transparent 70%)", filter: "blur(70px)" }} />
        <div className="ao2 absolute -bottom-[30%] -right-[15%] w-[65vw] h-[65vw] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(6,182,212,.15) 0%,transparent 70%)", filter: "blur(90px)" }} />
        <div className="ao3 absolute top-[35%] left-[35%] w-[45vw] h-[45vw] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(139,92,246,.12) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <div className="c-grid absolute inset-0 z-0 pointer-events-none" aria-hidden />

      {/* ══════════════════════════════════════
          BG 1 — Intro hero text (Vertically centered full screen)
      ══════════════════════════════════════ */}
      <div className="ht-wrap absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none">

        {/* eyebrow */}
        <div className="ht-stat c-pill inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 sm:mb-10 max-w-[90%] justify-center border border-indigo-500/10 bg-indigo-500/5 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </span>
          <span className="text-[10px] sm:text-xs text-indigo-300 tracking-[0.1em] sm:tracking-[.15em] uppercase font-bold whitespace-nowrap overflow-hidden text-ellipsis">
            Coming Soon · Kollam–TVM Corridor
          </span>
        </div>

        {/* headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[1.05] pb-1 mb-6">
          <span className="ht1 text-3d-matte block mb-1">{tagline1}</span>
          <span className="ht2 text-silver-matte block">{tagline2}</span>
        </h1>

        {/* sub */}
        <p className="ht-sub text-white/40 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md leading-relaxed font-light mb-8 sm:mb-10 px-4">
          Real-time tracking for commuters · ₹3,500/month for bus owners
        </p>

        {/* stat row */}
        <div className="grid grid-cols-2 gap-2.5 max-w-[340px] sm:max-w-md w-full px-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          {[
            { v: String(metricValue), l: metricLabel },
            { v: "Kollam-TVM", l: "First corridor" },
            { v: "4 s", l: "GPS refresh" },
            { v: "₹0", l: "Self-funded" },
          ].map(s => (
            <div key={s.l} className="ht-stat c-pill px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center justify-center sm:justify-start gap-2 border border-indigo-500/10 bg-indigo-500/5 backdrop-blur-md">
              <span className="text-xs sm:text-sm font-bold text-indigo-300">{s.v}</span>
              <span className="text-[10px] sm:text-xs text-white/35 font-medium whitespace-nowrap">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BG 2 — CTA
      ══════════════════════════════════════ */}
      <div className="cta-s absolute z-10 w-full flex flex-col items-center justify-center text-center px-6 gsap-reveal pointer-events-auto">
        <div className="c-pill inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
          </span>
          <span className="text-xs text-indigo-300 tracking-[.15em] uppercase font-semibold">Early Access · Register Now</span>
        </div>

        <h2 className="text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-[.92] mb-6 gt-indigo">{ctaHeading}</h2>
        <p className="text-white/40 text-lg mb-14 max-w-sm font-light leading-relaxed">{ctaDescription}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#partner"
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0A84FF] to-[#0070e3] hover:from-[#0070e3] hover:to-[#005cbe] text-white px-9 h-14 font-semibold text-[15px] rounded-[14px] transition-all duration-200 shadow-[0_8px_30px_rgba(10,132,255,0.35)] hover:shadow-[0_12px_40px_rgba(10,132,255,0.55)] hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="tracking-wide">Join the Waitlist</span>
            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FOREGROUND — The Card
      ══════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1800px" }}>
        <div ref={cardRef}
          className="c-card gsap-reveal relative overflow-hidden flex items-center justify-center pointer-events-auto w-[94vw] md:w-[86vw] h-[92vh] md:h-[86vh] rounded-[28px] md:rounded-[32px]">

          <div className="c-spotlight" aria-hidden />

          {/* card inner aurora */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute -top-1/2 -right-1/4 w-[55%] h-[70%] rounded-full"
              style={{ background: "radial-gradient(ellipse,rgba(99,102,241,.18) 0%,transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute -bottom-1/2 -left-1/4 w-[45%] h-[60%] rounded-full"
              style={{ background: "radial-gradient(ellipse,rgba(6,182,212,.12) 0%,transparent 70%)", filter: "blur(70px)" }} />
          </div>

          {/* ── GHOST BRAND WATERMARK behind everything ── */}
          <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden>
            <span className="font-black tracking-[-0.06em] select-none whitespace-nowrap"
              style={{
                fontSize: "clamp(5rem,16vw,18rem)",
                background: "linear-gradient(180deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.01) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "blur(0px)",
              }}>
              {brandName}.
            </span>
          </div>

          {/* ── 2-col layout ── */}
          <div className="relative z-10 w-full h-full overflow-y-auto lg:overflow-y-hidden grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 sm:px-8 lg:px-16 xl:px-24 py-8 lg:py-10 no-scrollbar">

            {/* ╔══════════════════════════╗
                ║  LEFT: Copy              ║
                ╚══════════════════════════╝ */}
            <div className="ci-left gsap-reveal flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left">

              {/* eyebrow pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md mb-5 self-center lg:self-start max-w-[90%] justify-center">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
                </span>
                <span className="text-[9px] text-indigo-300 uppercase tracking-[.14em] font-bold whitespace-nowrap overflow-hidden text-ellipsis">Coming Soon · Kollam–TVM</span>
              </div>

              {/* heading */}
              <h2 className="font-bold tracking-tight leading-[1.08] mb-5 text-center lg:text-left"
                style={{ fontSize: "clamp(2rem,4vw,3.6rem)" }}>
                {cardHeading.includes(" & ") ? (
                  <>
                    <span className="text-white">{cardHeading.split(" & ")[0]}</span><br />
                    <span className="bg-gradient-to-r from-[#0A84FF] to-[#34D399] bg-clip-text text-transparent">& {cardHeading.split(" & ")[1]}</span>
                  </>
                ) : cardHeading.includes(" and ") ? (
                  <>
                    <span className="text-white">{cardHeading.split(" and ")[0]}</span><br />
                    <span className="bg-gradient-to-r from-[#0A84FF] to-[#34D399] bg-clip-text text-transparent">& {cardHeading.split(" and ")[1]}</span>
                  </>
                ) : (
                  <span className="text-white">{cardHeading}</span>
                )}
              </h2>

              {/* description */}
              <div className="text-white/60 text-[14px] lg:text-[16px] leading-relaxed max-w-md mx-auto lg:mx-0 mb-6 lg:mb-8 font-normal text-center lg:text-left">
                {cardDescription}
              </div>

              {/* 2x2 grid stat dashboard cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md w-full mb-6 lg:mb-8 mx-auto lg:mx-0">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#0A84FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ),
                    val: "4s",
                    lbl: "GPS Refresh",
                    desc: "Live tracking interval",
                    color: "from-[#0A84FF]/30 to-transparent",
                    borderColor: "hover:border-[#0A84FF]/35"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#34D399]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                        <path d="M6 14h.01M10 14h.01" strokeWidth="2.5" />
                      </svg>
                    ),
                    val: "UPI",
                    lbl: "Cashless Ready",
                    desc: "ETM & QR ticketing",
                    color: "from-[#34D399]/30 to-transparent",
                    borderColor: "hover:border-[#34D399]/35"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="3" width="16" height="13" rx="2" />
                        <circle cx="9" cy="20" r="1" fill="currentColor" />
                        <circle cx="15" cy="20" r="1" fill="currentColor" />
                        <path d="M12 16v4" />
                      </svg>
                    ),
                    val: "2",
                    lbl: "Pilot Buses",
                    desc: "Starting Kollam-TVM",
                    color: "from-[#F59E0B]/30 to-transparent",
                    borderColor: "hover:border-[#F59E0B]/35"
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                        <line x1="9" y1="3" x2="9" y2="18" />
                        <line x1="15" y1="6" x2="15" y2="21" />
                      </svg>
                    ),
                    val: "14",
                    lbl: "Districts",
                    desc: "Systematic roadmap",
                    color: "from-[#A78BFA]/30 to-transparent",
                    borderColor: "hover:border-[#A78BFA]/35"
                  },
                ].map(s => (
                  <div 
                    key={s.lbl} 
                    className={`relative group/card p-3 sm:p-4 rounded-[16px] border border-white/[0.08] bg-white/[0.035] backdrop-blur-md hover:bg-white/[0.06] transition-all duration-300 text-left overflow-hidden ${s.borderColor}`}
                  >
                    {/* Hover Glow effect */}
                    <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-gradient-to-br ${s.color} blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="mb-2 select-none">{s.icon}</div>
                    <div className="text-[15px] sm:text-[17px] font-bold text-white tracking-tight leading-none mb-1.5">{s.val}</div>
                    <div className="text-[11px] sm:text-[12px] font-semibold text-white/80 leading-none mb-1">{s.lbl}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/45 font-normal leading-normal">{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* CTA buttons — in-card */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6 lg:mb-0">
                <a
                  href="#partner"
                  className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0A84FF] to-[#0070e3] hover:from-[#0070e3] hover:to-[#005cbe] text-white px-7 h-12 font-medium text-[14px] rounded-[12px] transition-all duration-200 shadow-[0_4px_24px_rgba(10,132,255,0.35)] hover:shadow-[0_8px_32px_rgba(10,132,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="tracking-wide">Join the Waitlist</span>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="ci-phone-wrap gsap-reveal order-1 lg:order-2 flex items-center justify-center relative"
              style={{ perspective: "1200px" }}>

              {/* phone wrapper with float */}
              <div className="fa relative" style={{ transformStyle: "preserve-3d" }}>

                <div ref={phoneRef}
                  className="relative c-phone rounded-[3.5rem] z-10"
                  style={{ transformStyle: "preserve-3d" }}>

                  {/* hardware side buttons */}
                  <div className="absolute top-[110px] -left-[3px] w-[3px] h-[26px] c-phone-btn rounded-l-md" aria-hidden />
                  <div className="absolute top-[150px] -left-[3px] w-[3px] h-[48px] c-phone-btn rounded-l-md" aria-hidden />
                  <div className="absolute top-[212px] -left-[3px] w-[3px] h-[48px] c-phone-btn rounded-l-md" aria-hidden />
                  <div className="absolute top-[168px] -right-[3px] w-[3px] h-[72px] c-phone-btn rounded-r-md" aria-hidden />

                  {/* screen */}
                  <div className="absolute inset-[7px] rounded-[3rem] overflow-hidden text-white bg-[#070913]">
                    <div className="absolute inset-0 c-sheen z-30 pointer-events-none" aria-hidden />

                    {/* Dynamic Island */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[98px] h-[28px] bg-black rounded-full z-40 flex items-center justify-end px-3.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="c-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                    </div>

                    {/* ── HIGH FIDELITY MAP INTERFACE ── */}
                    <div className="absolute inset-0 z-0 select-none">
                      {/* Map Background SVG */}
                      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Grid grid lines */}
                        <path d="M0 60h260M0 120h260M0 180h260M0 240h260M0 300h260M0 360h260M0 420h260M0 480h260" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                        <path d="M50 0v520M100 0v520M150 0v520M200 0v520" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />

                        {/* Ashtamudi Lake / River (Water Body) */}
                        <path d="M-10 100 C 60 120, 40 180, 80 210 C 120 230, 90 280, 140 320 C 190 350, 180 430, 270 450 L 270 530 L -10 530 Z" fill="#0c1d3a" opacity="0.45" />
                        <text x="20" y="490" fill="rgba(10,132,255,0.22)" fontSize="8" fontWeight="bold" letterSpacing="0.05em">ASHTAMUDI LAKE</text>

                        {/* Greenery / Park block */}
                        <rect x="180" y="80" width="60" height="90" rx="12" fill="#08221b" opacity="0.35" />
                        <text x="189" y="130" fill="rgba(52,211,153,0.12)" fontSize="7" fontWeight="bold">RESERVE PARK</text>

                        {/* Main City Grid Roads (Faint Secondary Roads) */}
                        <path d="M 0 150 H 260" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                        <path d="M 0 380 H 260" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                        <path d="M 90 0 V 520" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                        <path d="M 220 0 V 520" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />

                        {/* Diagonal Secondary Roads */}
                        <path d="M-20 40 L 280 200" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
                        <path d="M-20 450 L 280 250" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

                        {/* NH 66 Major Highway Roadbed (dark thick road underlay) */}
                        <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="rgba(255,255,255,0.06)" strokeWidth="7" strokeLinecap="round" />
                        <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="#16223F" strokeWidth="5" strokeLinecap="round" />

                        {/* Active GPS Route Path (nh-66 alignment) */}
                        <path d="M 120 520 C 120 400, 70 300, 150 200 C 230 100, 140 40, 140 0" stroke="#0A84FF" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6" className="c-route" />

                        {/* Road Labels */}
                        <text x="65" y="325" fill="rgba(255,255,255,0.18)" fontSize="6" fontWeight="bold" transform="rotate(-55 65 325)">NH 66 HIGHWAY</text>
                        <text x="175" y="115" fill="rgba(255,255,255,0.18)" fontSize="6" fontWeight="bold" transform="rotate(45 175 115)">BYPASS LINK</text>

                        {/* Landmark / Stop Pins */}
                        <g transform="translate(150, 200)">
                          <circle cx="0" cy="0" r="3.5" fill="#0A84FF" stroke="#070913" strokeWidth="1" />
                          <text x="6" y="2.5" fill="rgba(255,255,255,0.4)" fontSize="7" fontWeight="bold">VYTILA HUB</text>
                        </g>

                        <g transform="translate(138, 70)">
                          <circle cx="0" cy="0" r="2.5" fill="rgba(255,255,255,0.25)" stroke="#070913" strokeWidth="1" />
                          <text x="6" y="2.5" fill="rgba(255,255,255,0.25)" fontSize="6" fontWeight="bold">ALUVA STOP</text>
                        </g>

                        <g transform="translate(108, 380)">
                          <circle cx="0" cy="0" r="2.5" fill="rgba(255,255,255,0.25)" stroke="#070913" strokeWidth="1" />
                          <text x="-48" y="2" fill="rgba(255,255,255,0.25)" fontSize="6" fontWeight="bold">AROOR JUNCTION</text>
                        </g>
                      </svg>

                      {/* GPS User Location Pin (Vytila Hub Stop) */}
                      <div className="absolute top-[200px] left-[150px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <span className="relative flex h-8 w-8">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-40" />
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0A84FF] border-2 border-white shadow-lg" />
                        </span>
                      </div>

                      {/* Moving live bus marker (Bus approaching on the highway curve) */}
                      <div className="absolute top-[290px] left-[88px] -translate-x-1/2 -translate-y-1/2">
                        <span className="relative flex h-10 w-10 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-35" />
                          <div className="relative w-6 h-6 rounded-full bg-[#34D399] border border-white shadow-2xl flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="4" y="3" width="16" height="13" rx="2" />
                              <circle cx="8" cy="20" r="1.5" />
                              <circle cx="16" cy="20" r="1.5" />
                            </svg>
                          </div>
                        </span>
                      </div>
                    </div>

                    {/* App Overlay Layout */}
                    <div className="relative w-full h-full pt-12 px-4 pb-6 flex flex-col justify-between z-10 pointer-events-none">
                      
                      {/* Search Bar / Route Indicator Header */}
                      <div className="w-full h-10 rounded-full border border-white/[0.08] bg-[#070913]/90 backdrop-blur-md px-3.5 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                          <span className="text-[10px] font-semibold text-white/90">Kollam – TVM Corridor</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded-full">
                          <span className="text-[8px] text-[#34D399] font-bold uppercase tracking-wider"><span className="c-counter">0</span> LIVE</span>
                        </div>
                      </div>

                      {/* Bottom Floating Cards Stack */}
                      <div className="flex flex-col gap-2">
                        
                        {/* Floating Card 1: Arrival Alert Notification Banner */}
                        <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/20 backdrop-blur-md rounded-full px-3.5 py-1.5 text-emerald-400">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            <span className="text-[9px] font-semibold tracking-wide uppercase">Bus Arriving</span>
                          </div>
                          <span className="text-[9px] font-bold">2 Mins Away</span>
                        </div>

                        {/* Floating Card 2: Bus Details Telemetry card */}
                        <div className="c-widget rounded-2xl p-3.5 text-left shadow-2xl relative overflow-hidden backdrop-blur-md">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-[11px] font-bold text-white leading-tight">KL-15-A-4020</h4>
                              <span className="text-[8px] text-white/40 font-medium uppercase tracking-wider">Fast Express</span>
                            </div>
                            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded-md">
                              <span className="text-[8px] font-bold text-[#34D399]">UPI</span>
                              <span className="text-[8px] text-white/30 font-medium">Cashless</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[9px] text-white/70 mb-1.5 font-medium">
                            <span>Vytila Hub</span>
                            <span className="text-white font-semibold">350m away</span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#34D399] w-[85%] rounded-full animate-pulse" />
                          </div>

                          <div className="flex justify-between items-center text-[8px] text-white/30 border-t border-white/[0.04] pt-2">
                            <span>Speed: 42 km/h</span>
                            <span>Seats: ~12 free</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hidden elements for GSAP selector safety */}
                      <svg className="hidden" aria-hidden>
                        <circle className="c-ring" />
                        <path className="c-route" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ── Badge: GPS (placed after the phone container to render on top in DOM order) ── */}
                {/* ── Badge: GPS (placed after the phone container to render on top in DOM order) ── */}
                <div className="ci-badge fb c-badge absolute rounded-2xl p-3 hidden sm:flex items-center gap-2.5 z-30 min-w-[155px]"
                  style={{ top: "10%", left: "-45px", transform: "translate3d(0, 0, 80px)" }}>
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(10,132,255,.14)", border: "1px solid rgba(10,132,255,.28)" }}>
                    <svg className="w-5 h-5 text-[#0A84FF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-[11px] font-bold tracking-tight mb-0.5">GPS Telemetry</div>
                    <div className="text-[#0A84FF]/75 text-[9px] font-medium leading-none">4s update interval</div>
                  </div>
                </div>

                {/* ── Badge: UPI (placed after the phone container to render on top in DOM order) ── */}
                <div className="ci-badge fc c-badge absolute rounded-2xl p-3 hidden sm:flex items-center gap-2.5 z-30 min-w-[155px]"
                  style={{ bottom: "25%", right: "-45px", transform: "translate3d(0, 0, 80px)" }}>
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,.14)", border: "1px solid rgba(52,211,153,.28)" }}>
                    <svg className="w-5 h-5 text-[#34D399]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-[11px] font-bold tracking-tight mb-0.5">UPI Cashless</div>
                    <div className="text-[#34D399]/75 text-[9px] font-medium leading-none">Digital ticketing</div>
                  </div>
                </div>

                {/* ── Badge: Seats (placed after the phone container to render on top in DOM order) ── */}
                <div className="ci-badge fb c-badge absolute rounded-2xl p-3 hidden sm:flex items-center gap-2.5 z-30 min-w-[155px]"
                  style={{ bottom: "5%", left: "-30px", transform: "translate3d(0, 0, 80px)" }}>
                  <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(245,158,11,.14)", border: "1px solid rgba(245,158,11,.28)" }}>
                    <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-white text-[11px] font-bold tracking-tight mb-0.5">Seat Estimation</div>
                    <div className="text-[#F59E0B]/75 text-[9px] font-medium leading-none">Calculated by sales</div>
                  </div>
                </div>

              </div>
            </div>
          </div>{/* grid */}
        </div>{/* card */}
      </div>
    </div>
  );
}

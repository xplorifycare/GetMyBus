"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";

interface TextOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

function Shimmer({ children }: { children: React.ReactNode }) {
  return <span className="text-shimmer">{children}</span>;
}

// Typewriter hook
function useTypewriter(text: string, speed = 45, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [started, text, speed, startDelay]);

  return { displayed, setStarted };
}

export default function TextOverlay({ containerRef }: TextOverlayProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacityScene1 = useTransform(scrollYProgress, [0.00, 0.03, 0.12, 0.15], [0, 1, 1, 0]);
  const opacityScene2 = useTransform(scrollYProgress, [0.15, 0.18, 0.28, 0.31], [0, 1, 1, 0]);
  const opacityScene3 = useTransform(scrollYProgress, [0.31, 0.34, 0.44, 0.47], [0, 1, 1, 0]);
  const opacityScene4 = useTransform(scrollYProgress, [0.47, 0.50, 0.59, 0.62], [0, 1, 1, 0]);
  const opacityScene5 = useTransform(scrollYProgress, [0.62, 0.65, 0.75, 0.78], [0, 1, 1, 0]);
  const opacityScene6 = useTransform(scrollYProgress, [0.78, 0.81, 0.84, 0.87], [0, 1, 1, 0]);
  const opacityScene7 = useTransform(scrollYProgress, [0.87, 0.90, 0.97, 1.00], [0, 1, 1, 0]);

  const yScene1 = useTransform(scrollYProgress, [0.00, 0.03, 0.12, 0.15], [15, 0, 0, -15]);
  const yScene2 = useTransform(scrollYProgress, [0.15, 0.18, 0.28, 0.31], [15, 0, 0, -15]);
  const yScene3 = useTransform(scrollYProgress, [0.31, 0.34, 0.44, 0.47], [15, 0, 0, -15]);
  const yScene4 = useTransform(scrollYProgress, [0.47, 0.50, 0.59, 0.62], [15, 0, 0, -15]);
  const yScene5 = useTransform(scrollYProgress, [0.62, 0.65, 0.75, 0.78], [15, 0, 0, -15]);
  const yScene6 = useTransform(scrollYProgress, [0.78, 0.81, 0.84, 0.87], [15, 0, 0, -15]);
  const yScene7 = useTransform(scrollYProgress, [0.87, 0.90, 0.97, 1.00], [15, 0, 0, -15]);

  // Typewriter: trigger when scene 1 is active
  const { displayed: typewriterText, setStarted } = useTypewriter("Connecting bus owners, commuters, and advertisers.", 38, 400);
  const [scene1Active, setScene1Active] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const s1 = p >= 0.03 && p < 0.15;
    if (s1 && !scene1Active) {
      setScene1Active(true);
      setStarted(true);
    }
    if (!s1) {
      setScene1Active(false);
      setStarted(false);
    }
  });

  return (
    <div className="absolute inset-0 z-20 pointer-events-none w-full h-full">
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center p-6 md:p-12 overflow-hidden">

        {/* SCENE 1 — with typewriter subheadline */}
        <motion.div
          style={{ opacity: opacityScene1, y: yScene1 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-xl md:bottom-[10%] md:left-[10%] md:-translate-x-0 md:w-auto text-center md:text-left bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas"
        >
          <h1 className="text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            Transit. <Shimmer>Digitised.</Shimmer>
          </h1>
          <p className="text-[clamp(13px,1.6vw,18px)] font-normal opacity-85 leading-relaxed min-h-[1.6em]">
            {typewriterText}
            {/* Blinking cursor */}
            {scene1Active && typewriterText.length < 52 && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="inline-block w-[2px] h-[1em] bg-white/80 ml-0.5 align-middle"
              />
            )}
          </p>
        </motion.div>

        {/* SCENE 2 */}
        <motion.div 
          style={{ opacity: opacityScene2, y: yScene2 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-2xl md:bottom-[15%] md:left-1/2 md:-translate-x-1/2 md:w-auto text-center bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas px-4"
        >
          <h2 className="text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            Your bus. <Shimmer>Live.</Shimmer>
          </h2>
          <p className="text-[clamp(13px,1.6vw,18px)] font-normal opacity-85 leading-relaxed">
            Live GPS updates every 4 seconds. Watch your bus move in real time on our passenger app, GetMyBus.
          </p>
        </motion.div>

        {/* SCENE 3 */}
        <motion.div 
          style={{ opacity: opacityScene3, y: yScene3 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-xl md:bottom-[10%] md:right-[10%] md:left-auto md:translate-x-0 md:w-auto text-center md:text-right bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas"
        >
          <h2 className="text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            Onboard <Shimmer>Smart Screens.</Shimmer>
          </h2>
          <p className="text-[clamp(13px,1.6vw,18px)] font-normal opacity-85 leading-relaxed">
            Engage commuters with smart video/image loops. Geotargeted ads play as the bus approaches key hubs.
          </p>
        </motion.div>

        {/* SCENE 4 */}
        <motion.div 
          style={{ opacity: opacityScene4, y: yScene4 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-2xl md:bottom-[15%] md:left-1/2 md:-translate-x-1/2 md:w-auto text-center bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas px-4"
        >
          <h2 className="text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            Revenue <Shimmer>Redefined.</Shimmer>
          </h2>
          <p className="text-[clamp(13px,1.6vw,18px)] font-normal opacity-85 leading-relaxed">
            Generate ₹6,000+ monthly passive income per bus, directly offsetting recent fare drops.
          </p>
        </motion.div>

        {/* SCENE 5 */}
        <motion.div 
          style={{ opacity: opacityScene5, y: yScene5 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-xl md:left-[10%] md:bottom-auto md:top-[35%] md:-translate-x-0 md:w-auto text-center md:text-left bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas"
        >
          <h2 className="text-[clamp(28px,4.5vw,56px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            Cashless <Shimmer>QR Ticketing.</Shimmer>
          </h2>
          <p className="text-[clamp(13px,1.6vw,18px)] font-normal opacity-85 leading-relaxed">
            UPI ticketing via conductor ETMs or passenger seat scans. Stop fare leakages and loose-change disputes.
          </p>
        </motion.div>

        {/* SCENE 6 */}
        <motion.div 
          style={{ opacity: opacityScene6, y: yScene6 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-3xl md:top-[20%] md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:w-auto text-center bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas px-4"
        >
          <h2 className="text-[clamp(32px,5vw,64px)] tracking-[-0.02em] font-normal leading-[1.1] mb-3">
            A Unified <Shimmer>Ecosystem.</Shimmer>
          </h2>
          <p className="text-[clamp(14px,1.8vw,20px)] font-normal opacity-85 leading-relaxed">
            Supporting public welfare goals while maintaining a financially thriving private fleet.
          </p>
        </motion.div>

        {/* SCENE 7 */}
        <motion.div 
          style={{ opacity: opacityScene7, y: yScene7 }}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-4xl md:left-1/2 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:-translate-x-1/2 md:w-auto text-center bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border border-white/10 md:border-none rounded-[24px] md:rounded-none p-5 md:p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:shadow-none text-white text-shadow-canvas px-4"
        >
          <h2 className="text-[clamp(36px,5.5vw,72px)] tracking-[-0.02em] font-normal leading-[1.05] mb-4">
            Kerala. <Shimmer>Connected.</Shimmer>
          </h2>
          <p className="text-[clamp(15px,2vw,22px)] font-normal opacity-85 leading-relaxed">
            12,000+ buses. 98 cities. Cashless, live, and sustainable. Welcome to GetMyBus.
          </p>
        </motion.div>

      </div>
    </div>
  );
}

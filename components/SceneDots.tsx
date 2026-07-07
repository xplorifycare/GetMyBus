"use client";

import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { playClickSound, playHoverSound } from "@/components/SoundEffects";

interface SceneDotsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const scenes = [
  "Waiting is over",
  "Your bus. Live",
  "It arrived on time",
  "Board with confidence",
  "The commute, reimagined",
  "Calm every morning",
  "Kerala. Connected",
];

const sceneRanges = [
  [0.00, 0.15],
  [0.15, 0.31],
  [0.31, 0.47],
  [0.47, 0.62],
  [0.62, 0.78],
  [0.78, 0.87],
  [0.87, 1.00],
];

export default function SceneDots({ containerRef }: SceneDotsProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeScene, setActiveScene] = useState(0);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  // Fade the entire indicator in/out: show after scene starts, hide at end
  const opacity = useTransform(scrollYProgress, [0.0, 0.02, 0.97, 1.0], [0, 1, 1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    for (let i = sceneRanges.length - 1; i >= 0; i--) {
      if (progress >= sceneRanges[i][0]) {
        setActiveScene(i);
        break;
      }
    }
  });

  const handleDotClick = (idx: number) => {
    playClickSound();
    if (typeof window !== "undefined") {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = docHeight * sceneRanges[idx][0] + 10; // add minor offset to trigger transition cleanly
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.div
      style={{ opacity }}
      className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-auto select-none"
    >
      {scenes.map((label, idx) => {
        const isActive = activeScene === idx;
        const isPast = activeScene > idx;

        return (
          <div
            key={idx}
            className="relative flex items-center"
            onMouseEnter={() => {
              setShowTooltip(idx);
              playHoverSound(0.005);
            }}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => handleDotClick(idx)}
          >
            {/* Tooltip */}
            {showTooltip === idx && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-7 bg-black/80 backdrop-blur-sm border border-white/10 rounded-[6px] px-2.5 py-1 whitespace-nowrap pointer-events-none"
              >
                <span className="text-[11px] text-white/70 font-normal">{label}</span>
              </motion.div>
            )}

            {/* Dot */}
            <div className="relative w-2.5 h-2.5 cursor-pointer flex items-center justify-center">
              {/* Background dot */}
              <div
                className={`absolute w-2 h-2 rounded-full transition-all duration-300 ${
                  isPast ? "bg-[#0A84FF]" : "bg-white/20"
                }`}
              />
              {/* Active fill ring */}
              {isActive && (
                <div className="absolute w-2.5 h-2.5 rounded-full border-2 border-[#0A84FF] scale-[1.8] opacity-60" />
              )}
              {/* Active center fill */}
              {isActive && (
                <div className="absolute w-2 h-2 rounded-full bg-[#0A84FF]" />
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

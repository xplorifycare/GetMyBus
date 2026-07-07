"use client";

import { motion } from "framer-motion";

export default function StatsTicker() {
  // Combine stats text for marquee string
  const tickerText = "96 frames of real Kerala  ·  4s GPS refresh  ·  12,000+ buses  ·  98% on-time";
  
  // Duplicating array elements to make it infinite and seamless
  const repeatedItems = Array(12).fill(tickerText);

  return (
    <div className="bg-white text-black py-8 border-y border-system-gray-5 overflow-hidden select-none relative z-30">
      <motion.div
        className="flex whitespace-nowrap gap-12 text-sm tracking-widest uppercase font-normal"
        animate={{ x: [0, -1000] }}
        transition={{
          ease: "linear",
          duration: 35,
          repeat: Infinity,
        }}
      >
        {repeatedItems.map((text, idx) => (
          <span key={idx} className="flex-shrink-0 flex items-center space-x-12">
            <span>{text}</span>
            <span className="text-accent">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

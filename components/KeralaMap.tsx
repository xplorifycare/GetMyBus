"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { playClickSound, playHoverSound, playSuccessChime } from "@/components/SoundEffects";

const cities = [
  { name: "Kozhikode",          x: 80,  y: 125, buses: 2100, region: "Malabar" },
  { name: "Kannur",             x: 55,  y: 75,  buses: 980,  region: "North Malabar" },
  { name: "Palakkad",           x: 134, y: 155, buses: 760,  region: "Central Kerala" },
  { name: "Thrissur",           x: 120, y: 210, buses: 1870, region: "Cultural Capital" },
  { name: "Ernakulam",          x: 112, y: 275, buses: 3240, region: "Commercial Hub" },
  { name: "Trivandrum", x: 165, y: 430, buses: 2550, region: "Capital Corridor" },
];

// Connections between cities (indices)
const connections = [
  [0, 1], // Kozhikode — Kannur
  [0, 2], // Kozhikode — Palakkad
  [2, 3], // Palakkad — Thrissur
  [3, 4], // Thrissur — Ernakulam
  [4, 5], // Ernakulam — Thiruvananthapuram
  [1, 2], // Kannur — Palakkad
];

// BFS pathfinder
const findShortestPath = (startIdx: number, endIdx: number): number[] => {
  const queue: number[][] = [[startIdx]];
  const visited = new Set<number>();
  
  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];
    
    if (node === endIdx) return path;
    
    if (!visited.has(node)) {
      visited.add(node);
      const neighbors = connections
        .filter(([a, b]) => a === node || b === node)
        .map(([a, b]) => (a === node ? b : a));
        
      for (const neighbor of neighbors) {
        queue.push([...path, neighbor]);
      }
    }
  }
  return [];
};

function AnimatedLine({ x1, y1, x2, y2, delay, active = false }: { x1: number; y1: number; x2: number; y2: number; delay: number; active?: boolean }) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={active ? "rgba(10,132,255,0.85)" : "rgba(10,132,255,0.18)"}
      strokeWidth={active ? "2" : "1"}
      strokeDasharray={length}
      strokeDashoffset={length}
      strokeLinecap="round"
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeInOut" }}
      style={active ? { filter: "drop-shadow(0 0 4px rgba(10,132,255,0.6))" } : {}}
    />
  );
}

export default function KeralaMap({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [startCity, setStartCity] = useState<number | null>(null);
  const [endCity, setEndCity] = useState<number | null>(null);
  const [hoverCity, setHoverCity] = useState<number | null>(null);
  const [activePath, setActivePath] = useState<number[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState(55);
  const [simTimeRemaining, setSimTimeRemaining] = useState(120);

  // BFS Path calculation on selection change
  useEffect(() => {
    if (startCity !== null && endCity !== null) {
      const path = findShortestPath(startCity, endCity);
      setActivePath(path);
      setIsSimulating(true);
      setTimeout(() => playSuccessChime(), 100);
      const stopsCount = path.length;
      setSimTimeRemaining(stopsCount * 45 - 20);
    } else {
      setActivePath(null);
      setIsSimulating(false);
    }
  }, [startCity, endCity]);

  // Telemetry simulation ticker
  useEffect(() => {
    if (!isSimulating || startCity === null || endCity === null) return;
    const interval = setInterval(() => {
      setSimTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSimulating(false);
          return 0;
        }
        return prev - 1;
      });
      setSimSpeed((prev) => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        const next = prev + drift;
        return next > 65 ? 65 : next < 30 ? 30 : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating, startCity, endCity]);

  // City list or dot click handler
  const handleCitySelect = (idx: number) => {
    playClickSound();
    if (startCity === null) {
      setStartCity(idx);
    } else if (startCity === idx) {
      setStartCity(null);
      setEndCity(null);
    } else if (endCity === null) {
      setEndCity(idx);
    } else if (endCity === idx) {
      setEndCity(null);
    } else {
      setStartCity(idx);
      setEndCity(null);
    }
  };

  const handleReset = () => {
    playClickSound();
    setStartCity(null);
    setEndCity(null);
  };

  const getPathD = (path: number[]) => {
    return path.map((idx, i) => `${i === 0 ? 'M' : 'L'} ${cities[idx].x} ${cities[idx].y}`).join(" ");
  };

  const renderCockpit = () => {
    return (
      <div className="relative min-h-[160px] w-full">
        {startCity !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="themed-card border rounded-[16px] p-5 w-full shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b themed-divider">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A84FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A84FF]" />
                </span>
                <span className="text-[11px] font-medium text-[#0A84FF] tracking-wider uppercase">
                  Route Telemetry Cockpit
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-[11px] themed-text-sub hover:themed-text font-medium transition-colors"
              >
                Reset Route ✕
              </button>
            </div>

            {endCity === null ? (
              <div className="text-center py-4">
                <p className="text-[13px] themed-text-muted">
                  Please select a <span className="text-[#34D399] font-medium">Destination City</span> in the list or on the map.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] themed-text-sub uppercase tracking-wider font-normal mb-1">Active Route</span>
                  <span className="text-[13px] themed-text font-medium truncate">
                    {cities[startCity].name} ➔ {cities[endCity].name}
                  </span>
                </div>
                
                <div className="flex flex-col text-left">
                  <span className="text-[10px] themed-text-sub uppercase tracking-wider font-normal mb-1">Corridor Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    <span className="text-[13px] text-[#34D399] font-medium">Live (GPS Lock)</span>
                  </div>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] themed-text-sub uppercase tracking-wider font-normal mb-1">Simulated Speed</span>
                  <span className="text-[13px] themed-text font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {simSpeed} km/h
                  </span>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] themed-text-sub uppercase tracking-wider font-normal mb-1">Time Remaining</span>
                  <span className="text-[13px] text-[#0A84FF] font-medium" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.floor(simTimeRemaining / 60)}m {simTimeRemaining % 60}s
                  </span>
                </div>

                <div className="flex flex-col text-left">
                  <span className="text-[10px] themed-text-sub uppercase tracking-wider font-normal mb-1">Route Corridor</span>
                  <span className="text-[11px] themed-text-muted truncate font-normal">
                    {activePath ? activePath.map(i => cities[i].name).join(" ➔ ") : "Calculating..."}
                  </span>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsSimulating(!isSimulating);
                    }}
                    className={`h-7 px-3 text-[11px] font-medium rounded-full transition-all duration-200 w-full flex items-center justify-center gap-1 border ${
                      isSimulating 
                        ? "bg-black/[0.04] dark:bg-white/[0.04] border-black/10 dark:border-white/10 themed-text hover:bg-black/[0.08] dark:hover:bg-white/[0.08]" 
                        : "bg-[#0A84FF]/15 border-[#0A84FF]/25 text-[#0A84FF] hover:bg-[#0A84FF]/25"
                    }`}
                  >
                    <span>{isSimulating ? "⏸ Pause Sim" : "▶ Resume Sim"}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="bg-black/[0.015] dark:bg-white/[0.015] border themed-divider border-dashed rounded-[16px] p-6 text-center flex flex-col items-center justify-center min-h-[140px]">
            <svg className="w-6 h-6 themed-text-sub mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            <p className="text-[13px] themed-text-sub">
              Select a starting city above to configure the telemetry cockpit
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section ref={ref} className="relative w-full themed-bg py-24 px-6 md:px-12 overflow-hidden border-t themed-divider">
      {/* Ambient glass glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0A84FF]/[0.02] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#34D399]/[0.015] rounded-full blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left: Text & Simulation Cockpit Control Panel */}
          <div className="flex-1 text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 50, filter: "blur(12px)", rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
            >
              <p className="text-[11px] font-medium text-[#0A84FF] tracking-[0.15em] uppercase mb-3">
                Interactive Telemetry
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-normal themed-text tracking-tight leading-[1.1] mb-6">
                Kerala,{" "}
                <br />
                <span className="text-shimmer">fully connected.</span>
              </h2>
              <p className="text-[14px] themed-text-muted leading-relaxed font-normal max-w-md mb-8">
                Click cities on the map or in the list below to chart a custom transit route and watch the live simulation cockpit calculate telemetry in real-time.
              </p>
            </motion.div>

            {/* City Selection Buttons list */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {cities.map((city, idx) => {
                const isSelected = startCity === idx || endCity === idx;
                const isStart = startCity === idx;
                const isEnd = endCity === idx;
                const isHovered = hoverCity === idx;

                return (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.25 + idx * 0.05 }}
                    onClick={() => handleCitySelect(idx)}
                    onMouseEnter={() => {
                      setHoverCity(idx);
                      playHoverSound(0.008);
                    }}
                    onMouseLeave={() => setHoverCity(null)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-[12px] border cursor-pointer select-none relative overflow-hidden transition-colors duration-300 z-10 ${
                      isStart
                        ? "border-[#0A84FF] text-white"
                        : isEnd
                        ? "border-[#34D399] text-white"
                        : isHovered
                        ? "bg-black/[0.04] dark:bg-white/[0.04] border-black/15 dark:border-white/15 themed-text"
                        : "bg-black/[0.015] dark:bg-white/[0.015] border-black/[0.06] dark:border-white/[0.06] themed-text-muted hover:border-black/15 dark:hover:border-white/15"
                    }`}
                  >
                    {isStart && (
                      <motion.div
                        layoutId="startPillGlow"
                        className="absolute inset-0 bg-[#0A84FF]/10 z-0 pointer-events-none"
                      />
                    )}
                    {isEnd && (
                      <motion.div
                        layoutId="endPillGlow"
                        className="absolute inset-0 bg-[#34D399]/10 z-0 pointer-events-none"
                      />
                    )}

                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors relative z-10 ${
                        isStart
                          ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                          : isEnd
                          ? "bg-[#34D399] border-[#34D399] text-white"
                          : isHovered
                          ? "bg-black/[0.05] border-black/20 text-[#0A84FF]"
                          : "bg-black/[0.02] border-black/10 text-white/40"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[13px] font-medium relative z-10 truncate">
                      {city.name}
                    </span>

                    {isSelected && (
                      <span
                        className={`text-[8px] uppercase tracking-wider font-bold ml-auto px-1.5 py-0.5 rounded relative z-10 ${
                          isStart ? "bg-[#0A84FF]/15 text-[#0A84FF]" : "bg-[#34D399]/15 text-[#34D399]"
                        }`}
                      >
                        {isStart ? "Start" : "Dest"}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Cockpit HUD */}
            <div className="w-full">
              {renderCockpit()}
            </div>
          </div>

          {/* Right: SVG Interactive Kerala Map */}
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] mx-auto flex-shrink-0">
            
            {/* Soft glowing status tag above map */}
            <div className="absolute top-2 left-0 flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 backdrop-blur-md rounded-full px-3 py-1.5 z-20 pointer-events-none select-none text-[11px] themed-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping-slow" />
              <span className="font-medium">99.8% Network Health</span>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -12, transformPerspective: 1200 }}
              animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              className="relative w-full"
            >
              <svg
                viewBox="0 0 250 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
              >
                {/* Kerala state outline image */}
                <image
                  href="/kerala_map.png"
                  x="-27.98"
                  y="5.06"
                  width="287.19"
                  height="445.03"
                  preserveAspectRatio="none"
                  className={theme === "light" ? "opacity-25" : "opacity-35"}
                  style={{
                    mixBlendMode: theme === "light" ? "multiply" : "screen",
                  }}
                />

                {/* Animated connection lines (rendered when no active path is selected) */}
                {activePath === null && connections.map(([a, b], idx) => {
                  const isHoveredLine = hoverCity === a || hoverCity === b;
                  return (
                    <AnimatedLine
                      key={`conn-${a}-${b}`}
                      x1={cities[a].x} y1={cities[a].y}
                      x2={cities[b].x} y2={cities[b].y}
                      delay={0.3 + idx * 0.1}
                      active={isHoveredLine}
                    />
                  );
                })}

                {/* Simulated Glowing fiber optic route path line (rendered when route is resolved) */}
                {activePath && activePath.length > 0 && (
                  <>
                    {/* Glowing background wide trace line */}
                    <motion.path
                      id="route-path-glow"
                      d={getPathD(activePath)}
                      stroke="rgba(10,132,255,0.4)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      style={{ filter: "blur(4px)" }}
                    />
                    
                    {/* Primary neon fiber line */}
                    <motion.path
                      id="kerala-telemetry-path"
                      d={getPathD(activePath)}
                      stroke="#0A84FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* Clean inner core white line */}
                    <motion.path
                      d={getPathD(activePath)}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </>
                )}

                {/* Animated Telemetry Bus Node (Rides SVG path dynamically) */}
                {isSimulating && activePath && activePath.length > 0 && (
                  <g key={`telemetry-node-${activePath.join("-")}`}>
                    <circle r="7.5" fill="rgba(10,132,255,0.25)" style={{ filter: "blur(2px)" }} />
                    <circle r="4.5" fill="#0A84FF" />
                    <circle r="4.5" fill="#0A84FF" className="animate-ping" style={{ animationDuration: "1.8s" }} />
                    {/* White focal dot */}
                    <circle r="1.5" fill="#FFFFFF" />
                    
                    <animateMotion
                      dur={`${Math.max(3, activePath.length * 1.5)}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href="#kerala-telemetry-path" />
                    </animateMotion>
                  </g>
                )}

                {/* City nodes */}
                {cities.map((city, idx) => {
                  const isSelected = startCity === idx || endCity === idx;
                  const isStart = startCity === idx;
                  const isEnd = endCity === idx;
                  const isHovered = hoverCity === idx;

                  return (
                    <g 
                      key={`node-${city.name}`} 
                      className="cursor-pointer" 
                      onClick={() => handleCitySelect(idx)}
                      onMouseEnter={() => {
                        setHoverCity(idx);
                        playHoverSound(0.008);
                      }}
                      onMouseLeave={() => setHoverCity(null)}
                    >
                      {/* Pulse rings */}
                      {isInView && (
                        <motion.circle
                          cx={city.x} cy={city.y} r={isSelected || isHovered ? "11" : "7"}
                          fill={isStart ? "rgba(10,132,255,0.12)" : isEnd ? "rgba(52,211,153,0.12)" : "rgba(10,132,255,0.06)"}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.5, delay: 0.5 + idx * 0.15, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Outer Ring */}
                      <circle
                        cx={city.x} cy={city.y}
                        r={isSelected || isHovered ? "6.5" : "4.5"}
                        stroke={isStart ? "#0A84FF" : isEnd ? "#34D399" : isHovered ? (theme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)") : "rgba(10,132,255,0.3)"}
                        strokeWidth="1"
                        fill={theme === "light" ? "#f4f5f7" : "#060608"}
                        className="transition-all duration-300"
                      />

                      {/* Center Dot */}
                      <circle
                        cx={city.x} cy={city.y}
                        r={isSelected || isHovered ? "3.5" : "2"}
                        fill={isStart ? "#0A84FF" : isEnd ? "#34D399" : isHovered ? (theme === "light" ? "#121316" : "#FFFFFF") : "rgba(10,132,255,0.7)"}
                        className="transition-all duration-300"
                        style={isSelected || isHovered ? { filter: `drop-shadow(0 0 3px ${isStart ? '#0A84FF' : isEnd ? '#34D399' : theme === 'light' ? '#000000' : '#FFFFFF'})` } : {}}
                      />

                      {/* City label text overlay */}
                      <motion.text
                        x={city.x + 9} y={city.y + 3.5}
                        fill={isSelected ? (theme === "light" ? "#121316" : "#FFFFFF") : isHovered ? (theme === "light" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)") : (theme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)")}
                        fontSize="8.5"
                        fontFamily="sans-serif"
                        className="transition-all duration-300 select-none font-medium pointer-events-none"
                      >
                        {city.name}
                      </motion.text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
            
          </div>



        </div>
      </div>
    </section>
  );
}

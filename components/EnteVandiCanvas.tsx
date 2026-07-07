"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "framer-motion";

interface EnteVandiCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function EnteVandiCanvas({ containerRef }: EnteVandiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for tracking image sequence and draw states inside animation loop
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(0); // 0 means unpainted
  const lastProgressRef = useRef<number>(-1);

  // Mouse tracking states for interactive depth follower
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isMouseActive, setIsMouseActive] = useState(false);

  // Hook into scroll container progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll indicator fadeout and slight translation downwards on scroll
  const opacityScrollIndicator = useTransform(scrollYProgress, [0.0, 0.02], [1, 0]);
  const yScrollIndicator = useTransform(scrollYProgress, [0.0, 0.02], [0, 15]);

  // Preload all 240 images on mount
  useEffect(() => {
    const totalFrames = 240;
    const preloadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    const checkAllLoaded = () => {
      loaded++;
      setLoadedCount(loaded);
      if (loaded === totalFrames) {
        setIsLoaded(true);
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameStr = i.toString().padStart(3, "0");
      img.src = `/images/bus/ezgif-frame-${frameStr}.jpg`;
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
      preloadedImages.push(img);
    }

    imagesRef.current = preloadedImages;
  }, []);

  // Track mouse movements for soft glowing focal follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isMouseActive) setIsMouseActive(true);
    };
    const handleMouseLeave = () => setIsMouseActive(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMouseActive]);

  // Update target frame based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const totalFrames = 240;
    const frameIndex = Math.min(
      totalFrames,
      Math.max(1, Math.floor(progress * totalFrames) + 1)
    );
    targetFrameRef.current = frameIndex;
  });

  // Canvas painting helper using object-fit: cover + dynamic zoom parallax scaling
  const drawImage = (img: HTMLImageElement, progress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    // Use device pixel ratio for crystal clear rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save context state before applying camera zoom transformations
    ctx.save();

    // 1. Cinematic Zoom Parallax: Scales slightly inwards (1.0 -> 1.08) centered around screen center
    const scaleFactor = 1.0 + progress * 0.08;
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    const imgWidth = img.naturalWidth || img.width || 1920;
    const imgHeight = img.naturalHeight || img.height || 1080;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Cover height, crop width sides
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      
      // On narrow mobile viewports, crop slightly more from the right side and less from the left
      // (focal bias = 0.43) to keep both the boy's face and the phone mockup perfectly in frame!
      const isMobile = canvasWidth < 768;
      const focalBias = isMobile ? 0.43 : 0.50;
      offsetX = (canvasWidth - drawWidth) * focalBias;
    } else {
      // Cover width, crop height top/bottom
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    // Paint onto viewport
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Restore context state to prevent translations accumulating on subsequent ticks
    ctx.restore();
  };

  // requestAnimationFrame engine loop: paints on scroll change OR on scale changes
  useEffect(() => {
    if (!isLoaded) return;

    let animationFrameId: number;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const progress = scrollYProgress.get();
      const progressDiff = Math.abs(progress - lastProgressRef.current);

      // Repaint if the requested frame index changed OR if the scale zoom shifted dynamically
      if (target !== current || progressDiff > 0.001) {
        const img = imagesRef.current[target - 1];
        if (img && (img.complete || img.naturalWidth > 0)) {
          drawImage(img, progress);
          currentFrameRef.current = target;
          lastProgressRef.current = progress;
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    // Initial render
    const initialImg = imagesRef.current[0];
    if (initialImg) {
      if (initialImg.complete) {
        drawImage(initialImg, 0);
        currentFrameRef.current = 1;
        lastProgressRef.current = 0;
      } else {
        initialImg.onload = () => {
          drawImage(initialImg, 0);
          currentFrameRef.current = 1;
          lastProgressRef.current = 0;
        };
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, scrollYProgress]);

  // Handle window resizing dynamically
  useEffect(() => {
    const handleResize = () => {
      const activeFrame = currentFrameRef.current || 1;
      const img = imagesRef.current[activeFrame - 1];
      const progress = scrollYProgress.get();
      if (img && (img.complete || img.naturalWidth > 0)) {
        drawImage(img, progress);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollYProgress]);

  return (
    <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black select-none z-10">
      
      {/* 1. Loading Progress Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-40 transition-opacity duration-500">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="text-[13px] text-[#8E8E93] font-medium tracking-wider uppercase">
              Loading {Math.round((loadedCount / 240) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive mouse tracker lens (Desktop only, spring duration transition) */}
      {isLoaded && isMouseActive && (
        <div
          className="fixed pointer-events-none rounded-full w-[350px] h-[350px] bg-[#0A84FF]/[0.035] blur-[80px] z-30 transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      )}

      {/* 3a. CINEMATIC EDGE VIGNETTE — strong radial dark corners */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 15,
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* 3b. BOTTOM GRADIENT — grounds the page, makes bottom text readable */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 16,
          height: "45%",
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 40%, transparent 100%)",
        }}
      />

      {/* 3c. TOP GRADIENT — softens top edge for navbar readability */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 16,
          height: "25%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}
      />

      {/* 3d. SIDE VIGNETTES — left & right edge darkening for cinematic letterbox feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 16,
          background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* 3e. COLOR GRADE OVERLAY — subtle warm golden tone matching Kerala visuals */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply"
        style={{
          zIndex: 17,
          background: "radial-gradient(ellipse at 50% 80%, rgba(180,100,20,0.08) 0%, transparent 65%)",
        }}
      />

      {/* 3f. Film Grain Overlay */}
      <div
        className="absolute inset-0 film-grain pointer-events-none mix-blend-overlay"
        style={{ zIndex: 18 }}
      />

      {/* 4. Elegant Breathing Mouse Scroll Indicator (Fades out past 2% scroll progress) */}
      {isLoaded && (
        <motion.div
          style={{ opacity: opacityScrollIndicator, y: yScrollIndicator, zIndex: 30 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none"
        >
          <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase font-medium mb-3">
            Scroll to explore
          </span>
          <div className="w-[18px] h-[28px] rounded-full border border-white/30 p-[3px] flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]"
            />
          </div>
        </motion.div>
      )}

      {/* 5. Hero Canvas element — warm color grade: slightly boosted saturation + warm tone */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          width: "100%",
          height: "100%",
          filter: "saturate(1.12) contrast(1.04) brightness(0.96) sepia(0.06)",
        }}
      />
    </div>
  );
}

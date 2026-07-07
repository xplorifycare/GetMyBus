"use client";

import React, { useEffect, useRef } from "react";

interface FluidWaveBackgroundProps {
  theme?: "dark" | "light";
  opacity?: number;
}

const HeroWave = ({ theme = "dark", opacity = 0.8 }: FluidWaveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = (w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      width = w;
      height = h;
    };

    // Use ResizeObserver to reliably get size updates of the canvas parent element
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: rWidth, height: rHeight } = entry.contentRect;
        if (rWidth > 0 && rHeight > 0) {
          handleResize(rWidth, rHeight);
        }
      }
    });

    resizeObserver.observe(canvas);

    // Configure organic fluid waves with vibrant brand colors
    const waves = [
      {
        y: 0.45,
        frequency: 0.003,
        amplitude: 65,
        speed: 0.005,
        color: theme === "light" ? "rgba(10, 132, 255, 0.07)" : "rgba(10, 132, 255, 0.16)",
        strokeColor: theme === "light" ? "rgba(10, 132, 255, 0.18)" : "rgba(10, 132, 255, 0.35)",
        phase: 0,
      },
      {
        y: 0.54,
        frequency: 0.002,
        amplitude: 80,
        speed: -0.003,
        color: theme === "light" ? "rgba(52, 211, 153, 0.05)" : "rgba(52, 211, 153, 0.12)",
        strokeColor: theme === "light" ? "rgba(52, 211, 153, 0.12)" : "rgba(52, 211, 153, 0.28)",
        phase: Math.PI / 3,
      },
      {
        y: 0.49,
        frequency: 0.004,
        amplitude: 50,
        speed: 0.007,
        color: theme === "light" ? "rgba(167, 139, 250, 0.04)" : "rgba(139, 92, 246, 0.1)",
        strokeColor: theme === "light" ? "rgba(167, 139, 250, 0.1)" : "rgba(139, 92, 246, 0.24)",
        phase: Math.PI / 1.5,
      },
    ];

    const draw = () => {
      if (!ctx || width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);

      waves.forEach((wave) => {
        wave.phase += wave.speed;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const y =
            height * wave.y +
            Math.sin(x * wave.frequency + wave.phase) *
              wave.amplitude *
              Math.cos(wave.phase * 0.4);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Close path to fill wave gradient
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height * wave.y - wave.amplitude, 0, height);
        grad.addColorStop(0, wave.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke wave top boundary line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const y =
            height * wave.y +
            Math.sin(x * wave.frequency + wave.phase) *
              wave.amplitude *
              Math.cos(wave.phase * 0.4);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
};

export default HeroWave;

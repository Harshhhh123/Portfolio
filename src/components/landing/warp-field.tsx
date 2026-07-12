"use client";

import { useEffect, useRef } from "react";

/* Hyperspace warp: streaks accelerate outward from center in the
   provider color. Runs while mounted; used during ACCESS GRANTED. */
export function WarpField({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    interface S {
      angle: number;
      r: number;
      speed: number;
    }
    let streaks: S[] = [];

    function seed() {
      streaks = Array.from({ length: 240 }, () => ({
        angle: Math.random() * Math.PI * 2,
        r: Math.random() * 60 * dpr,
        speed: 1 + Math.random() * 3,
      }));
    }

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      seed();
    }
    resize();
    window.addEventListener("resize", resize);

    let accel = 1;
    function frame() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(cx, cy);

      // motion trail: translucent black instead of full clear
      ctx.fillStyle = "rgba(10,10,11,0.32)";
      ctx.fillRect(0, 0, w, h);

      accel *= 1.018; // keep accelerating while visible

      for (const s of streaks) {
        const prevR = s.r;
        s.r += s.speed * accel * dpr;
        if (s.r > maxR) {
          s.r = Math.random() * 40 * dpr;
          s.speed = 1 + Math.random() * 3;
          continue;
        }
        const x1 = cx + Math.cos(s.angle) * prevR;
        const y1 = cy + Math.sin(s.angle) * prevR;
        const x2 = cx + Math.cos(s.angle) * s.r;
        const y2 = cy + Math.sin(s.angle) * s.r;
        const alpha = Math.min(0.85, 0.1 + (s.r / maxR) * 0.9);

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = (0.6 + (s.r / maxR) * 2.2) * dpr;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return <canvas ref={canvasRef} className={className} />;
}

"use client";

import { useEffect, useRef } from "react";

/* Slow-drifting dust particles with mouse parallax. Sits behind the
   selection duel to give the black void some depth. */
export function DustField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    interface P {
      x: number;
      y: number;
      z: number; // depth 0..1 (parallax + size)
      vx: number;
      vy: number;
    }
    let particles: P[] = [];

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      particles = Array.from({ length: 110 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        vy: (Math.random() - 0.5) * 0.12 * dpr,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouse(e: MouseEvent) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    }
    window.addEventListener("mousemove", onMouse);

    function frame() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const offX = (mouseX - 0.5) * 30 * dpr;
      const offY = (mouseY - 0.5) * 30 * dpr;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;

        const px = p.x + offX * p.z;
        const py = p.y + offY * p.z;
        const alpha = 0.05 + p.z * 0.22;
        ctx.beginPath();
        ctx.arc(px, py, (0.6 + p.z * 1.4) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

"use client";

import { useEffect, useRef } from "react";

/* "Infrastructure assembling itself": 27 shaded 3D containers fly in
   from scattered space and snap into a rotating 3x3x3 cluster. Faces
   are lit and backface-culled, side faces carry corrugation ribs like
   shipping containers, and some pods blink a status LED. Random pods
   pop out and reschedule with an AWS-orange or GCP-blue glow.
   Pure canvas 3D — no libraries. */

const GRID = [-1, 0, 1];
const SPACING = 1.08;
const HALF = 0.42;
const ACCENTS = ["#ff9900", "#4285f4"];

const CORNERS: [number, number, number][] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

// faces: corner indices (consistent winding) + outward normal
const FACES: { idx: [number, number, number, number]; n: [number, number, number] }[] = [
  { idx: [0, 1, 2, 3], n: [0, 0, -1] },
  { idx: [5, 4, 7, 6], n: [0, 0, 1] },
  { idx: [4, 5, 1, 0], n: [0, -1, 0] },
  { idx: [3, 2, 6, 7], n: [0, 1, 0] },
  { idx: [4, 0, 3, 7], n: [-1, 0, 0] },
  { idx: [1, 5, 6, 2], n: [1, 0, 0] },
];

// light direction (normalized-ish), pointing from scene toward light
const LIGHT: [number, number, number] = [0.45, -0.75, -0.5];

interface Pod {
  home: [number, number, number];
  scatter: [number, number, number];
  delay: number;
  eventStart: number;
  eventColor: string;
  dir: [number, number, number];
  led: boolean;
  ledPhase: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function ContainerCube({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    const t0 = performance.now();

    const pods: Pod[] = [];
    for (const gx of GRID) {
      for (const gy of GRID) {
        for (const gz of GRID) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 3.4 + Math.random() * 2.2;
          const len = Math.hypot(gx, gy, gz) || 1;
          pods.push({
            home: [gx * SPACING, gy * SPACING, gz * SPACING],
            scatter: [
              Math.sin(phi) * Math.cos(theta) * r,
              Math.sin(phi) * Math.sin(theta) * r,
              Math.cos(phi) * r,
            ],
            delay: Math.random() * 0.55,
            eventStart: -1,
            eventColor: ACCENTS[0],
            dir: [gx / len, gy / len, gz / len],
            led: Math.random() < 0.4,
            ledPhase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    let nextEventAt = 1.9;

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function frame(now: number) {
      if (!canvas || !ctx) return;
      const t = (now - t0) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // ambient glow behind the cluster
      const glow = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0,
        w / 2,
        h / 2,
        Math.min(w, h) * 0.42
      );
      glow.addColorStop(0, "rgba(255,255,255,0.05)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const R = Math.min(w, h) * 0.155;
      const f = R * 5.4;
      const rotY = t * 0.42;
      const rotX = 0.42 + Math.sin(t * 0.35) * 0.12;
      const breathe = 1 + Math.sin(t * 1.6) * 0.012;

      if (t > nextEventAt) {
        const idle = pods.filter((p) => p.eventStart < 0);
        if (idle.length) {
          const pod = idle[Math.floor(Math.random() * idle.length)];
          pod.eventStart = t;
          pod.eventColor = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
          if (pod.home[0] === 0 && pod.home[1] === 0 && pod.home[2] === 0) {
            pod.dir = [0, -1, 0];
          }
        }
        nextEventAt = t + 1.4 + Math.random() * 1.4;
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const rotate = (x: number, y: number, z: number): [number, number, number] => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        return [x1, y1, z2];
      };

      // compute pod centers first so we can paint far-to-near
      const drawList = pods.map((pod) => {
        const at = Math.min(1, Math.max(0, (t - pod.delay) / 1.1));
        const a = easeOutCubic(at);

        let popOffset = 0;
        let hot = 0;
        if (pod.eventStart >= 0) {
          const et = (t - pod.eventStart) / 0.95;
          if (et >= 1) {
            pod.eventStart = -1;
          } else {
            popOffset = Math.sin(et * Math.PI) * 0.85;
            hot = Math.sin(et * Math.PI);
          }
        }

        const cx =
          (pod.scatter[0] + (pod.home[0] - pod.scatter[0]) * a + pod.dir[0] * popOffset) *
          breathe;
        const cy =
          (pod.scatter[1] + (pod.home[1] - pod.scatter[1]) * a + pod.dir[1] * popOffset) *
          breathe;
        const cz =
          (pod.scatter[2] + (pod.home[2] - pod.scatter[2]) * a + pod.dir[2] * popOffset) *
          breathe;
        const [, , rz] = rotate(cx, cy, cz);
        return { pod, a, hot, cx, cy, cz, depth: rz };
      });
      drawList.sort((p, q) => q.depth - p.depth); // far first

      for (const { pod, a, hot, cx, cy, cz } of drawList) {
        if (a <= 0.01) continue;

        // project corners; keep rotated z for depth cues
        const pts: [number, number, number][] = CORNERS.map(([ux, uy, uz]) => {
          const [x1, y1, z2] = rotate(cx + ux * HALF, cy + uy * HALF, cz + uz * HALF);
          const scale = f / (f + z2 * R);
          return [w / 2 + x1 * R * scale, h / 2 + y1 * R * scale, z2];
        });

        const avgZ = pts.reduce((s, p) => s + p[2], 0) / 8;
        const depthFade = 0.55 + (1 - (avgZ + 2) / 4) * 0.45; // nearer = brighter

        for (const face of FACES) {
          const [nx, ny, nz] = rotate(face.n[0], face.n[1], face.n[2]);
          if (nz >= 0) continue; // backface cull (viewer looks along -z)

          // diffuse shade
          const dot = -(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
          const lum = Math.max(0.12, Math.min(1, 0.3 + dot * 0.75)) * depthFade;

          const q = face.idx.map((i) => pts[i]);
          ctx.beginPath();
          ctx.moveTo(q[0][0], q[0][1]);
          ctx.lineTo(q[1][0], q[1][1]);
          ctx.lineTo(q[2][0], q[2][1]);
          ctx.lineTo(q[3][0], q[3][1]);
          ctx.closePath();

          if (hot > 0) {
            ctx.fillStyle = pod.eventColor;
            ctx.globalAlpha = a * (0.1 + hot * 0.35) * lum;
          } else {
            ctx.fillStyle = "#cfe3ff";
            ctx.globalAlpha = a * 0.16 * lum;
          }
          ctx.fill();

          // edge stroke
          if (hot > 0) {
            ctx.strokeStyle = pod.eventColor;
            ctx.globalAlpha = a * Math.min(1, 0.35 + hot * 0.65);
            ctx.lineWidth = (1 + hot * 1.3) * dpr;
            ctx.shadowColor = pod.eventColor;
            ctx.shadowBlur = 16 * hot * dpr;
          } else {
            ctx.strokeStyle = "#ffffff";
            ctx.globalAlpha = a * (0.28 + lum * 0.4);
            ctx.lineWidth = 1 * dpr;
            ctx.shadowBlur = 0;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;

          // corrugation ribs on vertical faces (the container look)
          if (face.n[1] === 0) {
            ctx.beginPath();
            for (const tFrac of [0.33, 0.66]) {
              const ax = q[0][0] + (q[1][0] - q[0][0]) * tFrac;
              const ay = q[0][1] + (q[1][1] - q[0][1]) * tFrac;
              const bx = q[3][0] + (q[2][0] - q[3][0]) * tFrac;
              const by = q[3][1] + (q[2][1] - q[3][1]) * tFrac;
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
            }
            ctx.strokeStyle = hot > 0 ? pod.eventColor : "#ffffff";
            ctx.globalAlpha = a * 0.14 * lum;
            ctx.lineWidth = 0.8 * dpr;
            ctx.stroke();
          }

          // blinking status LED near a corner of front-ish faces
          if (pod.led && face.n[2] !== 0) {
            const blink = (Math.sin(t * 3.2 + pod.ledPhase) + 1) / 2;
            if (blink > 0.35) {
              const lx = q[0][0] + (q[2][0] - q[0][0]) * 0.16;
              const ly = q[0][1] + (q[2][1] - q[0][1]) * 0.16;
              ctx.beginPath();
              ctx.arc(lx, ly, 1.5 * dpr, 0, Math.PI * 2);
              ctx.fillStyle = "#7ee787";
              ctx.globalAlpha = a * blink * 0.9;
              ctx.shadowColor = "#7ee787";
              ctx.shadowBlur = 6 * dpr * blink;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }

        // in-flight pods leave a faint trail dot
        if (a < 1) {
          ctx.globalAlpha = (1 - a) * 0.4;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(
            pts[0][0] + (pts[6][0] - pts[0][0]) / 2,
            pts[0][1] + (pts[6][1] - pts[0][1]) / 2,
            1.4 * dpr,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

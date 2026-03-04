import { useEffect, useRef } from "react";

interface GradientMeshProps {
  primaryColor?: string;
  isDark?: boolean;
  className?: string;
}

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
}

export const GradientMesh = ({
  primaryColor = "#3B5EF5",
  isDark = false,
  className = "",
}: GradientMeshProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const [hue, sat] = hexToHSL(primaryColor);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      if (blobsRef.current.length === 0) {
        const blobConfigs = isDark
          ? [
              { hOff: 0, s: Math.max(sat, 40), l: 30, a: 0.35 },
              { hOff: 8, s: Math.max(sat - 5, 35), l: 25, a: 0.3 },
              { hOff: -8, s: Math.max(sat + 5, 45), l: 35, a: 0.25 },
              { hOff: 4, s: Math.max(sat - 10, 30), l: 20, a: 0.3 },
            ]
          : [
              { hOff: 0, s: Math.max(sat, 45), l: 80, a: 0.25 },
              { hOff: 8, s: Math.max(sat - 5, 40), l: 75, a: 0.2 },
              { hOff: -8, s: Math.max(sat + 5, 50), l: 82, a: 0.18 },
              { hOff: 4, s: Math.max(sat - 10, 35), l: 78, a: 0.22 },
            ];

        blobsRef.current = blobConfigs.map((cfg, i) => ({
          x: w * (0.15 + i * 0.25),
          y: h * (0.25 + (i % 2) * 0.35),
          vx: (0.5 + Math.random() * 0.6) * (i % 2 === 0 ? 1 : -1),
          vy: (0.35 + Math.random() * 0.45) * (i < 2 ? 1 : -1),
          radius: Math.min(w, h) * (0.3 + Math.random() * 0.1),
          hue: (hue + cfg.hOff + 360) % 360,
          sat: cfg.s,
          light: cfg.l,
          alpha: cfg.a,
        }));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      for (const blob of blobsRef.current) {
        blob.x += blob.vx;
        blob.y += blob.vy;

        const pad = blob.radius * 0.2;
        if (blob.x < -pad || blob.x > w + pad) blob.vx *= -1;
        if (blob.y < -pad || blob.y > h + pad) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${blob.alpha})`);
        gradient.addColorStop(0.6, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${blob.alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, 0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [primaryColor, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

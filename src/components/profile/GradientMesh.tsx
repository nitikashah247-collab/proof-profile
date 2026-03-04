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
              { hOff: 0,   s: 70, l: 40, a: 0.7 },
              { hOff: 15,  s: 65, l: 35, a: 0.6 },
              { hOff: -12, s: 75, l: 45, a: 0.55 },
              { hOff: 8,   s: 60, l: 30, a: 0.65 },
            ]
          : [
              { hOff: 0,   s: 65, l: 70, a: 0.6 },
              { hOff: 15,  s: 60, l: 65, a: 0.5 },
              { hOff: -12, s: 70, l: 72, a: 0.45 },
              { hOff: 8,   s: 55, l: 68, a: 0.55 },
            ];

        blobsRef.current = blobConfigs.map((cfg, i) => ({
          x: w * (0.1 + i * 0.28),
          y: h * (0.2 + (i % 2) * 0.4),
          vx: (0.6 + Math.random() * 0.7) * (i % 2 === 0 ? 1 : -1),
          vy: (0.4 + Math.random() * 0.5) * (i < 2 ? 1 : -1),
          radius: Math.min(w, h) * (0.4 + Math.random() * 0.15),
          hue: (hue + cfg.hOff + 360) % 360,
          sat: cfg.s,
          light: cfg.l,
          alpha: cfg.a,
        }));
      }
    };

    const draw = () => {
      if (isDark) {
        ctx.fillStyle = `hsl(${hue}, 30%, 8%)`;
      } else {
        ctx.fillStyle = `hsl(${hue}, 25%, 92%)`;
      }
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";

      for (const blob of blobsRef.current) {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < -blob.radius * 0.5 || blob.x > w + blob.radius * 0.5) blob.vx *= -1;
        if (blob.y < -blob.radius * 0.5 || blob.y > h + blob.radius * 0.5) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${blob.alpha})`);
        gradient.addColorStop(0.4, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${blob.alpha * 0.7})`);
        gradient.addColorStop(0.7, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${blob.alpha * 0.3})`);
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

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
  color: string;
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

    const [hue] = hexToHSL(primaryColor);

    const baseL = isDark ? 20 : 92;
    const baseSat = isDark ? 40 : 30;

    const colors = [
      `hsla(${hue}, ${baseSat}%, ${baseL}%, 0.8)`,
      `hsla(${(hue + 30) % 360}, ${baseSat + 5}%, ${baseL - 3}%, 0.6)`,
      `hsla(${(hue + 330) % 360}, ${baseSat - 5}%, ${baseL + 2}%, 0.7)`,
      `hsla(${(hue + 15) % 360}, ${baseSat + 10}%, ${baseL - 5}%, 0.5)`,
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = w;
      canvas.height = h;

      if (blobsRef.current.length === 0) {
        blobsRef.current = colors.map((color, i) => ({
          x: w * (0.2 + (i * 0.25)),
          y: h * (0.3 + (i % 2) * 0.3),
          vx: (0.15 + Math.random() * 0.2) * (i % 2 === 0 ? 1 : -1),
          vy: (0.1 + Math.random() * 0.15) * (i < 2 ? 1 : -1),
          radius: Math.max(w, h) * (0.35 + Math.random() * 0.15),
          color,
        }));
      }
    };

    const draw = () => {
      ctx.fillStyle = isDark
        ? `hsl(${hue}, 15%, 8%)`
        : `hsl(${hue}, 20%, 97%)`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = isDark ? "screen" : "multiply";

      for (const blob of blobsRef.current) {
        blob.x += blob.vx;
        blob.y += blob.vy;

        const pad = blob.radius * 0.3;
        if (blob.x < -pad || blob.x > w + pad) blob.vx *= -1;
        if (blob.y < -pad || blob.y > h + pad) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
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

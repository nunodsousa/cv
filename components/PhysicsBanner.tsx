/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** A projected interference surface inspired by two cylindrical wave sources.
 * This is a visual illustration, not a quantitative simulation. */
const PhysicsBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0.8);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !container || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    let phase = phaseRef.current;
    let previousTime = 0;
    let points: Array<{ x: number; z: number; a: number; b: number }> = [];
    let columns = 0;
    let rows = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mobile = width < 700;
      const centerX = width * (mobile ? 0.64 : 0.75);
      const centerY = height * (mobile ? 0.70 : 0.58);
      const spread = width * (mobile ? 0.039 : 0.021);
      const depth = height * 0.022;
      const amplitude = height * 0.075;
      const cos = Math.cos(phase);
      const sin = Math.sin(phase);
      const projected = points.map(({ x, z, a, b }) => {
        const wave = a * cos + b * sin;
        return {
          x: centerX + (x - z * 0.45) * spread,
          y: centerY + (z + x * 0.16) * depth - wave * amplitude,
          wave,
        };
      });

      // Depth-weighted traces keep the surface legible without a solid fill.
      ctx.lineWidth = mobile ? 0.65 : 0.85;
      for (let row = 0; row < rows; row++) {
        const alpha = 0.12 + (row / rows) * 0.42;
        ctx.strokeStyle = `rgba(111, 212, 239, ${alpha})`;
        ctx.beginPath();
        for (let col = 0; col < columns; col++) {
          const point = projected[row * columns + col];
          if (col === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }
      for (let col = 0; col < columns; col++) {
        ctx.strokeStyle = 'rgba(143, 148, 255, 0.22)';
        ctx.beginPath();
        for (let row = 0; row < rows; row++) {
          const point = projected[row * columns + col];
          if (row === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < projected.length; i += 23) {
        const point = projected[i];
        if (point.wave < 0.25) continue;
        ctx.fillStyle = 'rgba(178, 239, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const shouldAnimate = () => !paused && !motion.matches && visible && !document.hidden;
    const frame = (time: number) => {
      if (!shouldAnimate()) return;
      if (time - lastFrame >= 1000 / 30) {
        if (previousTime) phase += Math.min((time - previousTime) / 1000, 0.1) * 0.65;
        phaseRef.current = phase;
        previousTime = time;
        lastFrame = time;
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      previousTime = 0;
      draw();
      if (shouldAnimate()) raf = requestAnimationFrame(frame);
    };
    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = width < 700 ? 49 : 73;
      rows = width < 700 ? 29 : 37;
      points = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = (col / (columns - 1) - 0.5) * 36;
          const z = (row / (rows - 1) - 0.5) * 22;
          let a = 0;
          let b = 0;
          for (const sourceX of [-5, 5]) {
            const distance = Math.hypot(x - sourceX, z);
            const envelope = 1 / Math.sqrt(1 + distance * 0.23);
            a += Math.cos(distance * 1.1) * envelope;
            b += Math.sin(distance * 1.1) * envelope;
          }
          points.push({ x, z, a, b });
        }
      }
      sync();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(container);
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);

  return (
    <>
      <div className="physics-field" aria-hidden="true">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <div className="physics-caption print:hidden">
        <span>Inspired by wave interference</span>
        <button
          type="button"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'Resume physics animation' : 'Pause physics animation'}
          aria-pressed={paused}
          className="physics-toggle"
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
    </>
  );
};

export default PhysicsBanner;

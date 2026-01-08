/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

type Sparkle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
};

const ParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let sparkles: Sparkle[] = [];
    let lastTime = performance.now();

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      const area = width * height;
      const count = Math.max(80, Math.min(220, Math.floor(area / 3500)));
      sparkles = Array.from({ length: count }, () => {
        const hue = 205 + Math.random() * 25; // blue range
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08,
          r: 0.8 + Math.random() * 1.9,
          baseAlpha: 0.15 + Math.random() * 0.45,
          twinkleSpeed: 0.8 + Math.random() * 1.8,
          twinklePhase: Math.random() * Math.PI * 2,
          hue,
        };
      });
    };

    const update = (t: number, dtScale: number) => {
      // Subtle drift + wrap
      for (const s of sparkles) {
        s.x += s.vx * dtScale;
        s.y += s.vy * dtScale;
        if (s.x < -20) s.x = width + 20;
        if (s.x > width + 20) s.x = -20;
        if (s.y < -20) s.y = height + 20;
        if (s.y > height + 20) s.y = -20;
        // very slight curl to feel “alive”
        const curl = Math.sin(t * 0.0006 + s.twinklePhase) * 0.02;
        s.vx += curl * 0.02;
        s.vy -= curl * 0.02;
        s.vx *= 0.999;
        s.vy *= 0.999;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // vignette / depth
      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.55, 10, width * 0.5, height * 0.55, Math.max(width, height) * 0.75);
      vignette.addColorStop(0, 'rgba(59,130,246,0.06)');
      vignette.addColorStop(0.45, 'rgba(2,6,23,0.0)');
      vignette.addColorStop(1, 'rgba(2,6,23,0.9)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // sparkles (additive)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      sparkles.forEach(s => {
        const alpha = Math.max(
          0,
          Math.min(
            1,
            s.baseAlpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(performance.now() * 0.0015 * s.twinkleSpeed + s.twinklePhase)))
          )
        );

        // soft glow
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 10);
        g.addColorStop(0, `hsla(${s.hue}, 95%, 75%, ${alpha})`);
        g.addColorStop(0.35, `hsla(${s.hue}, 95%, 65%, ${alpha * 0.35})`);
        g.addColorStop(1, `hsla(${s.hue}, 95%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 10, 0, Math.PI * 2);
        ctx.fill();

        // crisp star point
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.9, alpha + 0.2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.8, s.r * 0.8), 0, Math.PI * 2);
        ctx.fill();
      });

      // subtle connections like shadcn (only local)
      ctx.beginPath();
      ctx.lineWidth = 1;
      for (let i = 0; i < sparkles.length; i++) {
        for (let j = i + 1; j < sparkles.length; j++) {
          const dx = sparkles[i].x - sparkles[j].x;
          const dy = sparkles[i].y - sparkles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 70 * 70) {
            const a = (1 - Math.sqrt(d2) / 70) * 0.08;
            ctx.strokeStyle = `rgba(96,165,250,${a})`;
            ctx.moveTo(sparkles[i].x, sparkles[i].y);
            ctx.lineTo(sparkles[j].x, sparkles[j].y);
          }
        }
      }
      ctx.stroke();

      ctx.restore();
    };

    const loop = (currentTime: number) => {
      // Calculate delta time
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // dtScale is 1.0 when running at 60fps (16.67ms per frame)
      // On 120Hz, deltaTime is ~8.33ms, so dtScale will be ~0.5
      const dtScale = Math.min(deltaTime / (1000 / 60), 2.0); // Cap to 2.0 to avoid huge jumps if tab backgrounded

      update(currentTime, dtScale);
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    init();
    // Start loop with first timestamp
    animationFrameId = requestAnimationFrame(loop);

    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-slate-950 overflow-hidden border-b border-slate-800">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        <div className="bg-slate-900/70 backdrop-blur-2xl p-10 rounded-[2rem] border border-white/10 shadow-2xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-3 font-serif bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Data Science Lead
          </h2>
          <p className="text-blue-400 text-sm md:text-base uppercase tracking-[0.4em] font-bold">
            Applied AI & Decision Systems
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParticleBanner;
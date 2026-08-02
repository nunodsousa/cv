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
  depth: number; // 0 = far background, 1 = near foreground
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  spawnTime: number;
  lifeMs: number;
};

const ParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let sparkles: Sparkle[] = [];
    let comets: Comet[] = [];
    let nextCometAt = 0;
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
        const hue = 178 + Math.random() * 25; // electric cyan range
        // Bias toward the background layer so the foreground constellation stays sparse and legible.
        const depth = Math.pow(Math.random(), 1.6);
        const speedScale = reduceMotion ? 0 : 0.18 + depth * 1.15;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55 * speedScale,
          vy: (Math.random() - 0.5) * 0.38 * speedScale,
          r: 0.6 + depth * 2.1,
          baseAlpha: (0.12 + depth * 0.5) * (0.7 + Math.random() * 0.3),
          twinkleSpeed: 0.8 + Math.random() * 1.8,
          twinklePhase: Math.random() * Math.PI * 2,
          hue,
          depth,
        };
      });
      comets = [];
      nextCometAt = performance.now() + 2500 + Math.random() * 3500;
    };

    const spawnComet = (t: number): Comet => {
      const fromLeft = Math.random() < 0.5;
      const speed = 6.5 + Math.random() * 3.5;
      const angle = (12 + Math.random() * 10) * (Math.PI / 180);
      return {
        x: fromLeft ? -60 : width + 60,
        y: Math.random() * height * 0.55,
        vx: (fromLeft ? 1 : -1) * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        spawnTime: t,
        lifeMs: 750 + Math.random() * 350,
      };
    };

    const update = (t: number, dtScale: number) => {
      for (const s of sparkles) {
        s.x += s.vx * dtScale;
        s.y += s.vy * dtScale;
        if (s.x < -20) s.x = width + 20;
        if (s.x > width + 20) s.x = -20;
        if (s.y < -20) s.y = height + 20;
        if (s.y > height + 20) s.y = -20;
        if (!reduceMotion) {
          const curl = Math.sin(t * 0.0006 + s.twinklePhase) * 0.02 * (0.3 + s.depth);
          s.vx += curl * 0.02;
          s.vy -= curl * 0.02;
          s.vx *= 0.999;
          s.vy *= 0.999;
        }
      }

      if (!reduceMotion) {
        if (t > nextCometAt) {
          comets.push(spawnComet(t));
          nextCometAt = t + 3500 + Math.random() * 4500;
        }
        for (const c of comets) {
          c.x += c.vx * dtScale;
          c.y += c.vy * dtScale;
        }
        comets = comets.filter(c => t - c.spawnTime < c.lifeMs && c.x > -100 && c.x < width + 100);
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#051424';
      ctx.fillRect(0, 0, width, height);

      // vignette / depth
      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.55, 10, width * 0.5, height * 0.55, Math.max(width, height) * 0.75);
      vignette.addColorStop(0, 'rgba(0,240,255,0.07)');
      vignette.addColorStop(0.45, 'rgba(5,20,36,0.0)');
      vignette.addColorStop(1, 'rgba(5,20,36,0.92)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // comet trails (drawn first, sit behind the star field's glow)
      for (const c of comets) {
        const age = (t - c.spawnTime) / c.lifeMs;
        const fade = age < 0.15 ? age / 0.15 : age > 0.7 ? 1 - (age - 0.7) / 0.3 : 1;
        const alpha = Math.max(0, Math.min(1, fade));
        const tailLen = 70;
        const mag = Math.hypot(c.vx, c.vy) || 1;
        const tx = c.x - (c.vx / mag) * tailLen;
        const ty = c.y - (c.vy / mag) * tailLen;
        const grad = ctx.createLinearGradient(c.x, c.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${0.95 * alpha})`);
        grad.addColorStop(0.4, `hsla(186, 95%, 75%, ${0.45 * alpha})`);
        grad.addColorStop(1, 'hsla(186, 95%, 65%, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // sparkles (additive)
      sparkles.forEach(s => {
        const alpha = Math.max(
          0,
          Math.min(
            1,
            s.baseAlpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.0015 * s.twinkleSpeed + s.twinklePhase)))
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

      // constellation lines: only among the nearer, brighter sparkles so the
      // network reads as a foreground layer instead of cluttering the whole sky
      const linked = sparkles.filter(s => s.depth > 0.45);
      ctx.beginPath();
      ctx.lineWidth = 1;
      for (let i = 0; i < linked.length; i++) {
        for (let j = i + 1; j < linked.length; j++) {
          const dx = linked[i].x - linked[j].x;
          const dy = linked[i].y - linked[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 80 * 80) {
            const a = (1 - Math.sqrt(d2) / 80) * 0.1;
            ctx.strokeStyle = `rgba(0,219,233,${a})`;
            ctx.moveTo(linked[i].x, linked[i].y);
            ctx.lineTo(linked[j].x, linked[j].y);
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
      draw(currentTime);
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
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-[#051424] overflow-hidden border-b border-white/10">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6 text-center">
        <h2 style={{
          fontFamily: "'Libre Caslon Text', serif",
          fontWeight: 700,
          fontSize: 'clamp(2.1rem, 5.5vw, 3.75rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#d4e4fa',
          textShadow: '0 2px 24px rgba(0,240,255,0.45), 0 1px 2px rgba(0,0,0,0.9)',
          whiteSpace: 'nowrap'
        }}>
          SME Data Science & AI
        </h2>
        <div style={{
          width: '3.5rem',
          height: '2px',
          margin: '0.9rem 0',
          background: 'linear-gradient(to right, transparent, #00dbe9, transparent)'
        }} />
        <p style={{
          fontFamily: "'Geist', monospace",
          fontSize: 'clamp(0.7rem, 1.6vw, 1rem)',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: '#7df4ff',
          letterSpacing: '0.3em',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)'
        }}>
          Applied AI & Decision Systems
        </p>
      </div>
    </div>
  );
};

export default ParticleBanner;

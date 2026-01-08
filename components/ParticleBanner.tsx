/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

const PARAMS = {
  particleCount: 50,
  sigma: 38.0,
  epsilon: 1.2,
  baseDt: 0.12,        // Base time step for 60fps
  maxForce: 45.0,
  cutoff: 38.0 * 2.5,
  targetTemp: 1.5,
  tau: 0.5,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
}

const LJParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Timing variables for delta calculation
    let lastTime = performance.now();

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const init = () => {
      resize();
      particles = Array.from({ length: PARAMS.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        ax: 0,
        ay: 0,
      }));
    };

    const computeAccelerations = () => {
      particles.forEach(p => { p.ax = 0; p.ay = 0; });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          let dx = p2.x - p1.x;
          let dy = p2.y - p1.y;

          if (dx > width / 2) dx -= width;
          else if (dx < -width / 2) dx += width;
          if (dy > height / 2) dy -= height;
          else if (dy < -height / 2) dy += height;

          const r2 = dx * dx + dy * dy;

          if (r2 < PARAMS.cutoff * PARAMS.cutoff && r2 > 1.0) {
            const s2_r2 = (PARAMS.sigma ** 2) / r2;
            const s6_r6 = s2_r2 ** 3;
            const s12_r12 = s6_r6 ** 2;

            let fMag = (24 * PARAMS.epsilon * (2 * s12_r12 - s6_r6)) / r2;
            fMag = Math.max(Math.min(fMag, PARAMS.maxForce), -PARAMS.maxForce);

            p1.ax -= fMag * dx;
            p1.ay -= fMag * dy;
            p2.ax += fMag * dx;
            p2.ay += fMag * dy;
          }
        }
      }
    };

    const update = (dtScale: number) => {
      // Adjust standard dt by the delta scale
      const dt = PARAMS.baseDt * dtScale;

      // 1. Verlet 1st half
      particles.forEach(p => {
        p.x += p.vx * dt + 0.5 * p.ax * (dt ** 2);
        p.y += p.vy * dt + 0.5 * p.ay * (dt ** 2);

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;
      });

      const oldAx = particles.map(p => p.ax);
      const oldAy = particles.map(p => p.ay);

      // 2. Accelerations
      computeAccelerations();

      // 3. Verlet 2nd half & Kinetic Energy
      let currentKineticEnergy = 0;
      particles.forEach((p, i) => {
        p.vx += 0.5 * (oldAx[i] + p.ax) * dt;
        p.vy += 0.5 * (oldAy[i] + p.ay) * dt;
        currentKineticEnergy += (p.vx ** 2 + p.vy ** 2);
      });

      // 4. Thermostat
      const currentTemp = currentKineticEnergy / PARAMS.particleCount;
      const lambda = Math.sqrt(1 + (dt / PARAMS.tau) * (PARAMS.targetTemp / currentTemp - 1));
      const safeLambda = Math.max(0.8, Math.min(1.2, lambda));

      particles.forEach(p => {
        p.vx *= safeLambda;
        p.vy *= safeLambda;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Connections
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx*dx + dy*dy < (PARAMS.sigma * 1.5)**2) {
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.stroke();

      // Particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#3b82f6';
        ctx.fill();
      });
    };

    const loop = (currentTime: number) => {
      // Calculate delta time
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // dtScale is 1.0 when running at 60fps (16.67ms per frame)
      // On 120Hz, deltaTime is ~8.33ms, so dtScale will be ~0.5
      const dtScale = Math.min(deltaTime / (1000 / 60), 2.0); // Cap to 2.0 to avoid huge jumps if tab backgrounded

      update(dtScale);
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

export default LJParticleBanner;
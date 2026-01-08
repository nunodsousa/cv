/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

// Simulation Parameters
const PARAMS = {
  particleCount: 50,
  sigma: 38.0,
  epsilon: 1.2,
  dt: 0.12,
  maxForce: 45.0,
  cutoff: 38.0 * 2.5,
  // Thermostat Settings
  targetTemp: 1.5,     // Target kinetic energy per particle
  tau: 0.5,            // Coupling time (lower is stronger correction)
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

    const computeAccelerations = (parts: Particle[]) => {
      parts.forEach(p => { p.ax = 0; p.ay = 0; });

      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const p1 = parts[i];
          const p2 = parts[j];

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

    const update = () => {
      // 1. Position update (Verlet 1st half)
      particles.forEach(p => {
        p.x += p.vx * PARAMS.dt + 0.5 * p.ax * (PARAMS.dt ** 2);
        p.y += p.vy * PARAMS.dt + 0.5 * p.ay * (PARAMS.dt ** 2);

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;
      });

      const oldAx = particles.map(p => p.ax);
      const oldAy = particles.map(p => p.ay);

      // 2. Compute new accelerations
      computeAccelerations(particles);

      // 3. Velocity update (Verlet 2nd half)
      let currentKineticEnergy = 0;
      particles.forEach((p, i) => {
        p.vx += 0.5 * (oldAx[i] + p.ax) * PARAMS.dt;
        p.vy += 0.5 * (oldAy[i] + p.ay) * PARAMS.dt;
        currentKineticEnergy += (p.vx ** 2 + p.vy ** 2);
      });

      // 4. Berendsen Thermostat Scaling
      // T_curr is avg kinetic energy per particle
      const currentTemp = currentKineticEnergy / PARAMS.particleCount;
      const lambda = Math.sqrt(1 + (PARAMS.dt / PARAMS.tau) * (PARAMS.targetTemp / currentTemp - 1));

      // Limit scaling to avoid instability
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

      // Draw Connections
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const d2 = dx*dx + dy*dy;
            // Visual connections within sigma range
            if (d2 < (PARAMS.sigma * 1.5)**2) {
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
        }
      }
      ctx.stroke();

      // Draw Particles
      particles.forEach(p => {
        const speed = Math.sqrt(p.vx**2 + p.vy**2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        // Color based on speed (kinetic energy)
        ctx.fillStyle = speed > 1.5 ? '#93c5fd' : '#3b82f6';
        ctx.fill();
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#3b82f6';
      });
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    init();
    loop();

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
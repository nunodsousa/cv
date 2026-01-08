/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';

const ParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    interface Body {
      x: number;
      y: number;
      vx: number;
      vy: number;
      mass: number;
      radius: number;
      color: string;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }

    const G = 0.5; // Gravitational constant (scaled for animation)
    const dt = 0.15; // Time step
    const softening = 120; // soften gravity to keep trajectories stable & visible

    // Initialize three bodies with more dynamic initial velocities
    const bodies: Body[] = [
      {
        x: width * 0.3,
        y: height * 0.5,
        vx: 1.5,
        vy: 0.8,
        mass: 50,
        radius: 8,
        color: 'rgba(59, 130, 246, 0.9)',
        trail: [],
      },
      {
        x: width * 0.7,
        y: height * 0.4,
        vx: -1.2,
        vy: 1.0,
        mass: 40,
        radius: 7,
        color: 'rgba(96, 165, 250, 0.9)',
        trail: [],
      },
      {
        x: width * 0.5,
        y: height * 0.7,
        vx: -0.3,
        vy: -1.8,
        mass: 30,
        radius: 6,
        color: 'rgba(147, 197, 253, 0.9)',
        trail: [],
      },
    ];

    // Massless tracer particles accelerated by the 3-body gravity field (this makes the dynamics obvious)
    interface Tracer {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }

    const tracerCount = 220;
    const tracers: Tracer[] = [];

    const resetTracer = (t: Tracer) => {
      // Spawn mostly around the banner edges so you can see flow around the title card
      const side = Math.floor(Math.random() * 4);
      const pad = 8;
      if (side === 0) { // top
        t.x = Math.random() * width;
        t.y = pad;
      } else if (side === 1) { // right
        t.x = width - pad;
        t.y = Math.random() * height;
      } else if (side === 2) { // bottom
        t.x = Math.random() * width;
        t.y = height - pad;
      } else { // left
        t.x = pad;
        t.y = Math.random() * height;
      }
      t.vx = (Math.random() - 0.5) * 0.4;
      t.vy = (Math.random() - 0.5) * 0.4;
      t.life = 1;
      t.trail = [];
    };

    const initTracers = () => {
      tracers.length = 0;
      for (let i = 0; i < tracerCount; i++) {
        const t: Tracer = { x: 0, y: 0, vx: 0, vy: 0, life: 1, trail: [] };
        resetTracer(t);
        // Stagger lifetime so not all reset at once
        t.life = 0.3 + Math.random() * 0.7;
        tracers.push(t);
      }
    };

    const calculateForces = () => {
      const forces: Array<{ fx: number; fy: number }> = [];

      for (let i = 0; i < bodies.length; i++) {
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue;

          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = 20; // Prevent division by zero

          if (distance > minDistance) {
            const force = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);
            fx += (force * dx) / distance;
            fy += (force * dy) / distance;
          }
        }

        forces.push({ fx, fy });
      }

      return forces;
    };

    const accelerationAt = (x: number, y: number) => {
      // Acceleration produced by the 3 masses at a point (x,y)
      let ax = 0;
      let ay = 0;
      for (const b of bodies) {
        const dx = b.x - x;
        const dy = b.y - y;
        const r2 = dx * dx + dy * dy + softening * softening;
        const r = Math.sqrt(r2);
        const a = (G * b.mass) / r2; // magnitude
        ax += (a * dx) / r;
        ay += (a * dy) / r;
      }
      return { ax, ay };
    };

    const updateBodies = () => {
      const forces = calculateForces();

      bodies.forEach((body, i) => {
        // Update velocity using force
        const ax = forces[i].fx / body.mass;
        const ay = forces[i].fy / body.mass;
        body.vx += ax * dt;
        body.vy += ay * dt;

        // Update position
        body.x += body.vx * dt;
        body.y += body.vy * dt;

        // Add to trail
        body.trail.push({ x: body.x, y: body.y, opacity: 1 });
        if (body.trail.length > 70) {
          body.trail.shift();
        }

        // Fade trail
        body.trail.forEach((point) => {
          point.opacity *= 0.98;
        });

        // Confine to banner with elastic collision
        const margin = body.radius;
        if (body.x < margin) {
          body.vx *= -0.7;
          body.x = margin;
        }
        if (body.x > width - margin) {
          body.vx *= -0.7;
          body.x = width - margin;
        }
        if (body.y < margin) {
          body.vy *= -0.7;
          body.y = margin;
        }
        if (body.y > height - margin) {
          body.vy *= -0.7;
          body.y = height - margin;
        }
      });
    };

    const updateTracers = () => {
      const margin = 2;
      for (const t of tracers) {
        const { ax, ay } = accelerationAt(t.x, t.y);
        // Stronger response for visuals; still stable due to softening
        t.vx += ax * dt * 2.2;
        t.vy += ay * dt * 2.2;

        // mild damping (fluid-like)
        t.vx *= 0.995;
        t.vy *= 0.995;

        t.x += t.vx * dt * 2.5;
        t.y += t.vy * dt * 2.5;

        // keep inside banner
        if (t.x < margin) { t.x = margin; t.vx *= -0.4; }
        if (t.x > width - margin) { t.x = width - margin; t.vx *= -0.4; }
        if (t.y < margin) { t.y = margin; t.vy *= -0.4; }
        if (t.y > height - margin) { t.y = height - margin; t.vy *= -0.4; }

        t.trail.push({ x: t.x, y: t.y, opacity: 0.9 });
        if (t.trail.length > 18) t.trail.shift();
        t.trail.forEach(p => { p.opacity *= 0.92; });

        // Slowly recycle particles to keep motion lively
        t.life -= 0.0015;
        if (t.life <= 0) resetTracer(t);
      }
    };

    const drawTrail = (body: Body) => {
      for (let i = 0; i < body.trail.length - 1; i++) {
        const point = body.trail[i];
        const nextPoint = body.trail[i + 1];

        const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y);
        const colorMatch = body.color.match(/rgba?\(([^)]+)\)/);
        if (colorMatch) {
          const values = colorMatch[1].split(',').map(v => parseFloat(v.trim()));
          gradient.addColorStop(0, `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${point.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${nextPoint.opacity * 0.4})`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }
    };

    const drawTracer = (t: Tracer) => {
      // trail
      for (let i = 0; i < t.trail.length - 1; i++) {
        const p = t.trail[i];
        const q = t.trail[i + 1];
        ctx.strokeStyle = `rgba(147, 197, 253, ${p.opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      // head
      ctx.fillStyle = 'rgba(191, 219, 254, 0.9)'; // blue-200
      ctx.beginPath();
      ctx.arc(t.x, t.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBody = (body: Body) => {
      // Draw trail
      drawTrail(body);

      // Draw gravitational field effect
      const gradient = ctx.createRadialGradient(
        body.x, body.y, 0,
        body.x, body.y, body.radius * 4
      );
      const colorMatch = body.color.match(/rgba?\(([^)]+)\)/);
      if (colorMatch) {
        const values = colorMatch[1].split(',').map(v => parseFloat(v.trim()));
        gradient.addColorStop(0, `rgba(${values[0]}, ${values[1]}, ${values[2]}, 0.3)`);
        gradient.addColorStop(0.5, `rgba(${values[0]}, ${values[1]}, ${values[2]}, 0.1)`);
        gradient.addColorStop(1, `rgba(${values[0]}, ${values[1]}, ${values[2]}, 0)`);
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw body
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(body.x - body.radius * 0.3, body.y - body.radius * 0.3, body.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawForceLines = () => {
      // Draw gravitational force lines between bodies
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 300) {
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(bodies[i].x, bodies[i].y);
            ctx.lineTo(bodies[j].x, bodies[j].y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      time += dt;

      // Clear with slight fade for trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Additive blend makes the motion visible even behind the title
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // Tracers first: show the field flow
      updateTracers();
      for (const t of tracers) drawTracer(t);

      // Draw force lines
      drawForceLines();

      // Update and draw bodies
      updateBodies();
      bodies.forEach((body) => drawBody(body));

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      if (width > 0 && height > 0) {
        // Reset bodies to initial positions with velocities
        bodies[0].x = width * 0.3;
        bodies[0].y = height * 0.5;
        bodies[0].vx = 1.5;
        bodies[0].vy = 0.8;
        bodies[0].trail = [];
        
        bodies[1].x = width * 0.7;
        bodies[1].y = height * 0.4;
        bodies[1].vx = -1.2;
        bodies[1].vy = 1.0;
        bodies[1].trail = [];
        
        bodies[2].x = width * 0.5;
        bodies[2].y = height * 0.7;
        bodies[2].vx = -0.3;
        bodies[2].vy = -1.8;
        bodies[2].trail = [];
        
        initTracers();

        animate();
      } else {
        setTimeout(init, 100);
      }
    };

    window.addEventListener('resize', resize);
    init();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Canvas for three-body problem simulation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }} />
      
      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
        }}
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
        <div className="relative">
          {/* Simple background box */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-blue-400/10 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl" />
          
          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Main Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif mb-2">
              <span className="bg-gradient-to-r from-white via-blue-200 via-blue-300 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Data Science Lead
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-slate-300 text-sm md:text-base lg:text-lg uppercase tracking-[0.2em] font-medium mb-4">
              Applied AI and Decision Systems
            </p>
          </div>
        </div>
      </div>
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/30 pointer-events-none" />
    </div>
  );
};

export default ParticleBanner;

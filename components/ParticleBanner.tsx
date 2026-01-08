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

    const G = 0.1; // Gravitational constant (scaled for animation)
    const dt = 0.1; // Time step

    // Initialize three bodies in a stable configuration
    const bodies: Body[] = [
      {
        x: width * 0.4,
        y: height * 0.5,
        vx: 0.3,
        vy: 0.2,
        mass: 50,
        radius: 8,
        color: 'rgba(59, 130, 246, 0.9)',
        trail: [],
      },
      {
        x: width * 0.6,
        y: height * 0.4,
        vx: -0.2,
        vy: 0.3,
        mass: 40,
        radius: 7,
        color: 'rgba(96, 165, 250, 0.9)',
        trail: [],
      },
      {
        x: width * 0.5,
        y: height * 0.6,
        vx: -0.1,
        vy: -0.5,
        mass: 30,
        radius: 6,
        color: 'rgba(147, 197, 253, 0.9)',
        trail: [],
      },
    ];

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
        if (body.trail.length > 100) {
          body.trail.shift();
        }

        // Fade trail
        body.trail.forEach((point) => {
          point.opacity *= 0.98;
        });

        // Wrap around edges (or bounce)
        if (body.x < 0 || body.x > width) {
          body.vx *= -0.5;
          body.x = Math.max(0, Math.min(width, body.x));
        }
        if (body.y < 0 || body.y > height) {
          body.vy *= -0.5;
          body.y = Math.max(0, Math.min(height, body.y));
        }
      });
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

      // Draw force lines
      drawForceLines();

      // Update and draw bodies
      updateBodies();
      bodies.forEach((body) => drawBody(body));

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      if (width > 0 && height > 0) {
        // Reset bodies to initial positions
        bodies[0].x = width * 0.4;
        bodies[0].y = height * 0.5;
        bodies[1].x = width * 0.6;
        bodies[1].y = height * 0.4;
        bodies[2].x = width * 0.5;
        bodies[2].y = height * 0.6;
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-400/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl" />
          
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

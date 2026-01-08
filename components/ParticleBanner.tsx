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

    interface Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      orbitRadius: number;
      centerX: number;
      centerY: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }

    const particles: Particle[] = [];
    const particleCount = 8;

    const initParticles = () => {
      particles.length = 0;
      const centers = [
        { x: width * 0.2, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.4 },
        { x: width * 0.8, y: height * 0.6 },
      ];

      for (let i = 0; i < particleCount; i++) {
        const center = centers[i % centers.length];
        particles.push({
          x: 0,
          y: 0,
          radius: 3 + Math.random() * 2,
          angle: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02,
          orbitRadius: 40 + Math.random() * 60,
          centerX: center.x + (Math.random() - 0.5) * 100,
          centerY: center.y + (Math.random() - 0.5) * 80,
          trail: [],
        });
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        // Orbital motion
        particle.angle += particle.speed;
        particle.x = particle.centerX + Math.cos(particle.angle) * particle.orbitRadius;
        particle.y = particle.centerY + Math.sin(particle.angle) * particle.orbitRadius;

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: 1 });
        if (particle.trail.length > 20) {
          particle.trail.shift();
        }

        // Fade trail
        particle.trail.forEach((point) => {
          point.opacity *= 0.92;
        });
      });
    };

    const drawFieldLines = () => {
      // Draw electromagnetic-like field lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 12; i++) {
        const startX = (width / 13) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        
        for (let y = 0; y < height; y += 5) {
          const x = startX + Math.sin(y * 0.02 + time * 0.01) * 30;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawParticle = (particle: Particle) => {
      // Draw trail
      for (let i = 0; i < particle.trail.length - 1; i++) {
        const point = particle.trail[i];
        const nextPoint = particle.trail[i + 1];
        
        const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${point.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(96, 165, 250, ${nextPoint.opacity * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }

      // Draw particle with glow
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      );
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.9)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.5)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core particle
      ctx.fillStyle = 'rgba(147, 197, 253, 0.9)';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawOrbit = (particle: Particle) => {
      // Draw faint orbit path
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(
        particle.centerX,
        particle.centerY,
        particle.orbitRadius,
        particle.orbitRadius,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      time += 0.5;

      // Clear with slight fade for trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Draw field lines
      drawFieldLines();

      // Draw orbits
      particles.forEach((particle) => drawOrbit(particle));

      // Update and draw particles
      updateParticles();
      particles.forEach((particle) => drawParticle(particle));

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      if (width > 0 && height > 0) {
        initParticles();
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
      {/* Canvas for physics animation */}
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import { BrainCircuit } from 'lucide-react';

const ParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3; // Slower movement for fog
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 4 + 2; // Larger particles for fog effect
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction (gentle repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (100 - distance) / 100;
          this.vx -= forceDirectionX * force * 0.05;
          this.vy -= forceDirectionY * force * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        // Create fog effect with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, 'rgba(148, 163, 184, 0.8)');
        gradient.addColorStop(0.5, 'rgba(148, 163, 184, 0.4)');
        gradient.addColorStop(1, 'rgba(148, 163, 184, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size - fewer particles for fog effect
      const area = width * height;
      const count = Math.floor(area / 3000); 
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles (no connections for fog effect)
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    window.addEventListener('resize', resize);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-40 md:h-56 relative bg-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
        <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/50 shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight font-serif mb-1">
            Data Science Lead
          </h2>
          <p className="text-slate-300 text-xs md:text-sm uppercase tracking-widest font-medium">
             Applied AI and Decision Systems
          </p>
        </div>
      </div>
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
    </div>
  );
};

export default ParticleBanner;
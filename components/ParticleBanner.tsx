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

    // Fluid blob structure
    interface Blob {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      phase: number;
    }

    const blobs: Blob[] = [];
    const blobCount = 5;

    const initBlobs = () => {
      blobs.length = 0;
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          x: Math.random() * width,
          y: height * (0.5 + Math.random() * 0.5),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          radius: height * (0.15 + Math.random() * 0.2),
          baseRadius: height * (0.15 + Math.random() * 0.2),
          color: `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 50}, ${246 - Math.random() * 50}, ${0.15 + Math.random() * 0.15})`,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const updateBlobs = () => {
      blobs.forEach((blob, i) => {
        // Update position with velocity
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Boundary collision with damping
        if (blob.x < -blob.radius || blob.x > width + blob.radius) {
          blob.vx *= -0.8;
          blob.x = Math.max(-blob.radius, Math.min(width + blob.radius, blob.x));
        }
        if (blob.y < height * 0.3 || blob.y > height + blob.radius) {
          blob.vy *= -0.8;
          blob.y = Math.max(height * 0.3, Math.min(height + blob.radius, blob.y));
        }

        // Fluid-like radius pulsing
        blob.radius = blob.baseRadius * (1 + Math.sin(time * 0.01 + blob.phase) * 0.2);

        // Inter-blob interaction (repulsion)
        blobs.forEach((other, j) => {
          if (i === j) return;
          const dx = blob.x - other.x;
          const dy = blob.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = blob.radius + other.radius;

          if (distance < minDist && distance > 0) {
            const force = (minDist - distance) / minDist;
            const angle = Math.atan2(dy, dx);
            blob.vx += Math.cos(angle) * force * 0.05;
            blob.vy += Math.sin(angle) * force * 0.05;
          }
        });

        // Damping for fluid-like behavior
        blob.vx *= 0.98;
        blob.vy *= 0.98;
      });
    };

    const drawBlob = (blob: Blob) => {
      // Create gradient for fluid effect
      const gradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.radius
      );
      gradient.addColorStop(0, blob.color);
      gradient.addColorStop(0.5, blob.color.replace(')', ', 0.1)').replace('rgba', 'rgba'));
      gradient.addColorStop(1, blob.color.replace(')', ', 0)').replace('rgba', 'rgba'));

      // Draw fluid blob with soft edges
      ctx.beginPath();
      const points = 32;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radiusVariation = blob.radius * (1 + Math.sin(angle * 3 + time * 0.02) * 0.1);
        const x = blob.x + Math.cos(angle) * radiusVariation;
        const y = blob.y + Math.sin(angle) * radiusVariation;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add subtle highlight
      const highlightGradient = ctx.createRadialGradient(
        blob.x - blob.radius * 0.3, blob.y - blob.radius * 0.3, 0,
        blob.x, blob.y, blob.radius * 0.5
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();
    };

    const drawConnections = () => {
      // Draw fluid connections between nearby blobs
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const dx = blobs[i].x - blobs[j].x;
          const dy = blobs[i].y - blobs[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = (blobs[i].radius + blobs[j].radius) * 1.5;

          if (distance < maxDist) {
            const opacity = (1 - distance / maxDist) * 0.2;
            const gradient = ctx.createLinearGradient(
              blobs[i].x, blobs[i].y,
              blobs[j].x, blobs[j].y
            );
            gradient.addColorStop(0, blobs[i].color.replace(/[\d\.]+\)$/, `${opacity})`));
            gradient.addColorStop(1, blobs[j].color.replace(/[\d\.]+\)$/, `${opacity})`));

            ctx.beginPath();
            ctx.moveTo(blobs[i].x, blobs[i].y);
            ctx.lineTo(blobs[j].x, blobs[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      time += 0.5;

      // Clear with slight fade for trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      updateBlobs();
      drawConnections();
      blobs.forEach(blob => drawBlob(blob));

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      if (width > 0 && height > 0) {
        initBlobs();
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
      {/* Canvas for fluid dynamics simulation */}
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

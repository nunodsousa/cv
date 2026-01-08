/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ParticleBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      if (width > 0 && height > 0) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      amplitude: number,
      frequency: number,
      phase: number,
      yOffset: number,
      gradient: CanvasGradient
    ) => {
      if (width === 0 || height === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x += 2) {
        // Multiple sine waves combined for organic feel
        const wave1 = Math.sin((x * frequency + phase) * 0.01) * amplitude;
        const wave2 = Math.sin((x * frequency * 1.5 + phase * 1.3) * 0.01) * amplitude * 0.5;
        const wave3 = Math.sin((x * frequency * 0.7 + phase * 0.8) * 0.01) * amplitude * 0.3;
        const y = yOffset + wave1 + wave2 + wave3;
        
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      time += 1.5; // Increased speed multiplier
      
      // Clear with slight fade for smooth trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Create multiple organic waves with gradients - using slate/blue theme
      const waves = [
        {
          amplitude: height * 0.15,
          frequency: 0.8,
          phase: time * 0.8, // Increased speed
          yOffset: height * 0.6,
          colors: ['rgba(59, 130, 246, 0.4)', 'rgba(96, 165, 250, 0.3)', 'rgba(59, 130, 246, 0.2)'] // blue-500, blue-400
        },
        {
          amplitude: height * 0.12,
          frequency: 1.2,
          phase: time * 1.0, // Increased speed
          yOffset: height * 0.7,
          colors: ['rgba(37, 99, 235, 0.35)', 'rgba(59, 130, 246, 0.25)', 'rgba(37, 99, 235, 0.15)'] // blue-600, blue-500
        },
        {
          amplitude: height * 0.1,
          frequency: 0.6,
          phase: time * 0.7, // Increased speed
          yOffset: height * 0.5,
          colors: ['rgba(96, 165, 250, 0.3)', 'rgba(147, 197, 253, 0.2)', 'rgba(96, 165, 250, 0.1)'] // blue-400, blue-300
        },
        {
          amplitude: height * 0.08,
          frequency: 1.5,
          phase: time * 0.9, // Increased speed
          yOffset: height * 0.8,
          colors: ['rgba(59, 130, 246, 0.25)', 'rgba(96, 165, 250, 0.15)', 'rgba(59, 130, 246, 0.08)'] // blue-500, blue-400
        }
      ];

      waves.forEach((wave, index) => {
        const gradient = ctx.createLinearGradient(0, wave.yOffset - wave.amplitude * 2, 0, height);
        const colorCount = wave.colors.length;
        wave.colors.forEach((color, i) => {
          const stop = colorCount > 1 ? i / (colorCount - 1) : i;
          gradient.addColorStop(stop, color);
        });
        
        drawWave(ctx, wave.amplitude, wave.frequency, wave.phase, wave.yOffset, gradient);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize with a small delay to ensure container is rendered
    const init = () => {
      resize();
      if (width > 0 && height > 0) {
        animate();
      } else {
        // Retry if dimensions aren't ready
        setTimeout(() => {
          resize();
          if (width > 0 && height > 0) {
            animate();
          }
        }, 100);
      }
    };

    window.addEventListener('resize', resize);
    init();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Canvas for organic waves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* Animated gradient background layers - using blue theme */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)', // blue-500
            'radial-gradient(ellipse at 80% 50%, rgba(37, 99, 235, 0.3) 0%, transparent 60%)', // blue-600
            'radial-gradient(ellipse at 50% 30%, rgba(96, 165, 250, 0.3) 0%, transparent 60%)', // blue-400
            'radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)', // blue-500
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Glowing background box */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-400/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
            animate={{
              boxShadow: [
                '0 0 40px rgba(37, 99, 235, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)', // blue-600, blue-500
                '0 0 60px rgba(59, 130, 246, 0.4), 0 0 100px rgba(96, 165, 250, 0.3)', // blue-500, blue-400
                '0 0 40px rgba(37, 99, 235, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)', // blue-600, blue-500
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Main Title */}
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif mb-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-white via-blue-200 via-blue-300 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Data Science Lead
              </span>
            </motion.h2>
            
            {/* Subtitle */}
            <motion.p
              className="text-slate-300 text-sm md:text-base lg:text-lg uppercase tracking-[0.2em] font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Applied AI and Decision Systems
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/30 pointer-events-none" />
    </div>
  );
};

export default ParticleBanner;
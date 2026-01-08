/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';

const ParticleBanner: React.FC = () => {
  // Inject CSS keyframes for fluid wave animations
  useEffect(() => {
    try {
      const styleId = 'particle-banner-waves';
      if (typeof document === 'undefined' || document.getElementById(styleId)) return;
      
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes wave1 {
          0% { 
            clip-path: polygon(0 60%, 10% 50%, 20% 55%, 30% 45%, 40% 55%, 50% 48%, 60% 58%, 70% 47%, 80% 57%, 90% 50%, 100% 55%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          25% { 
            clip-path: polygon(0 58%, 10% 52%, 20% 57%, 30% 47%, 40% 57%, 50% 50%, 60% 60%, 70% 49%, 80% 59%, 90% 52%, 100% 57%, 100% 100%, 0 100%);
            transform: translateX(2%);
          }
          50% { 
            clip-path: polygon(0 62%, 10% 48%, 20% 53%, 30% 43%, 40% 53%, 50% 46%, 60% 56%, 70% 45%, 80% 55%, 90% 48%, 100% 53%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          75% { 
            clip-path: polygon(0 59%, 10% 51%, 20% 56%, 30% 46%, 40% 56%, 50% 49%, 60% 59%, 70% 48%, 80% 58%, 90% 51%, 100% 56%, 100% 100%, 0 100%);
            transform: translateX(-2%);
          }
          100% { 
            clip-path: polygon(0 60%, 10% 50%, 20% 55%, 30% 45%, 40% 55%, 50% 48%, 60% 58%, 70% 47%, 80% 57%, 90% 50%, 100% 55%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
        }
        @keyframes wave2 {
          0% { 
            clip-path: polygon(0 70%, 15% 60%, 25% 65%, 35% 58%, 45% 68%, 55% 62%, 65% 72%, 75% 60%, 85% 70%, 95% 64%, 100% 68%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          25% { 
            clip-path: polygon(0 68%, 15% 62%, 25% 67%, 35% 60%, 45% 70%, 55% 64%, 65% 74%, 75% 62%, 85% 72%, 95% 66%, 100% 70%, 100% 100%, 0 100%);
            transform: translateX(-1.5%);
          }
          50% { 
            clip-path: polygon(0 72%, 15% 58%, 25% 63%, 35% 56%, 45% 66%, 55% 60%, 65% 70%, 75% 58%, 85% 68%, 95% 62%, 100% 66%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          75% { 
            clip-path: polygon(0 69%, 15% 61%, 25% 66%, 35% 59%, 45% 69%, 55% 63%, 65% 73%, 75% 61%, 85% 71%, 95% 65%, 100% 69%, 100% 100%, 0 100%);
            transform: translateX(1.5%);
          }
          100% { 
            clip-path: polygon(0 70%, 15% 60%, 25% 65%, 35% 58%, 45% 68%, 55% 62%, 65% 72%, 75% 60%, 85% 70%, 95% 64%, 100% 68%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
        }
        @keyframes wave3 {
          0% { 
            clip-path: polygon(0 80%, 20% 72%, 30% 78%, 40% 70%, 50% 80%, 60% 74%, 70% 82%, 80% 72%, 90% 78%, 100% 75%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          25% { 
            clip-path: polygon(0 78%, 20% 74%, 30% 80%, 40% 72%, 50% 82%, 60% 76%, 70% 84%, 80% 74%, 90% 80%, 100% 77%, 100% 100%, 0 100%);
            transform: translateX(1%);
          }
          50% { 
            clip-path: polygon(0 82%, 20% 70%, 30% 76%, 40% 68%, 50% 78%, 60% 72%, 70% 80%, 80% 70%, 90% 76%, 100% 73%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          75% { 
            clip-path: polygon(0 79%, 20% 73%, 30% 79%, 40% 71%, 50% 81%, 60% 75%, 70% 83%, 80% 73%, 90% 79%, 100% 76%, 100% 100%, 0 100%);
            transform: translateX(-1%);
          }
          100% { 
            clip-path: polygon(0 80%, 20% 72%, 30% 78%, 40% 70%, 50% 80%, 60% 74%, 70% 82%, 80% 72%, 90% 78%, 100% 75%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
        }
        @keyframes wave4 {
          0% { 
            clip-path: polygon(0 85%, 12% 80%, 22% 85%, 32% 78%, 42% 88%, 52% 82%, 62% 90%, 72% 80%, 82% 88%, 92% 83%, 100% 87%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          33% { 
            clip-path: polygon(0 83%, 12% 82%, 22% 87%, 32% 80%, 42% 90%, 52% 84%, 62% 92%, 72% 82%, 82% 90%, 92% 85%, 100% 89%, 100% 100%, 0 100%);
            transform: translateX(-0.8%);
          }
          66% { 
            clip-path: polygon(0 87%, 12% 78%, 22% 83%, 32% 76%, 42% 86%, 52% 80%, 62% 88%, 72% 78%, 82% 86%, 92% 81%, 100% 85%, 100% 100%, 0 100%);
            transform: translateX(0.8%);
          }
          100% { 
            clip-path: polygon(0 85%, 12% 80%, 22% 85%, 32% 78%, 42% 88%, 52% 82%, 62% 90%, 72% 80%, 82% 88%, 92% 83%, 100% 87%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        try {
          const existingStyle = document.getElementById(styleId);
          if (existingStyle) {
            existingStyle.remove();
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    } catch (error) {
      // Silently fail - page will still render without animations
    }
  }, []);

  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Fluid dynamic gradient waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave layer 1 - Fast, shallow */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
            clipPath: 'polygon(0 60%, 10% 50%, 20% 55%, 30% 45%, 40% 55%, 50% 48%, 60% 58%, 70% 47%, 80% 57%, 90% 50%, 100% 55%, 100% 100%, 0 100%)',
            animation: 'wave1 5s ease-in-out infinite',
            WebkitAnimation: 'wave1 5s ease-in-out infinite',
            willChange: 'clip-path, transform',
          }}
        />
        
        {/* Wave layer 2 - Medium speed */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-25"
          style={{
            background: 'linear-gradient(to top, rgba(37, 99, 235, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(37, 99, 235, 0.15) 100%)',
            clipPath: 'polygon(0 70%, 15% 60%, 25% 65%, 35% 58%, 45% 68%, 55% 62%, 65% 72%, 75% 60%, 85% 70%, 95% 64%, 100% 68%, 100% 100%, 0 100%)',
            animation: 'wave2 7s ease-in-out infinite',
            animationDelay: '0.3s',
            WebkitAnimation: 'wave2 7s ease-in-out infinite',
            WebkitAnimationDelay: '0.3s',
            willChange: 'clip-path, transform',
          }}
        />
        
        {/* Wave layer 3 - Slower, deeper */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(96, 165, 250, 0.3) 0%, rgba(147, 197, 253, 0.2) 50%, rgba(96, 165, 250, 0.1) 100%)',
            clipPath: 'polygon(0 80%, 20% 72%, 30% 78%, 40% 70%, 50% 80%, 60% 74%, 70% 82%, 80% 72%, 90% 78%, 100% 75%, 100% 100%, 0 100%)',
            animation: 'wave3 9s ease-in-out infinite',
            animationDelay: '0.6s',
            WebkitAnimation: 'wave3 9s ease-in-out infinite',
            WebkitAnimationDelay: '0.6s',
            willChange: 'clip-path, transform',
          }}
        />
        
        {/* Wave layer 4 - Deep, slow */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-15"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.25) 0%, rgba(96, 165, 250, 0.15) 50%, rgba(59, 130, 246, 0.1) 100%)',
            clipPath: 'polygon(0 85%, 12% 80%, 22% 85%, 32% 78%, 42% 88%, 52% 82%, 62% 90%, 72% 80%, 82% 88%, 92% 83%, 100% 87%, 100% 100%, 0 100%)',
            animation: 'wave4 11s ease-in-out infinite',
            animationDelay: '0.9s',
            WebkitAnimation: 'wave4 11s ease-in-out infinite',
            WebkitAnimationDelay: '0.9s',
            willChange: 'clip-path, transform',
          }}
        />
      </div>
      
      {/* Animated gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      
      {/* Add pulse animation for overlay */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.25; }
        }
      `}</style>
      
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

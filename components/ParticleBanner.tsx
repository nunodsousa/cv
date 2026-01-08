/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';

const ParticleBanner: React.FC = () => {
  // Inject CSS keyframes for wave animations
  useEffect(() => {
    try {
      const styleId = 'particle-banner-waves';
      if (typeof document === 'undefined' || document.getElementById(styleId)) return;
      
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes wave1 {
          0% { clip-path: polygon(0 60%, 15% 45%, 30% 60%, 45% 40%, 60% 60%, 75% 45%, 90% 60%, 100% 50%, 100% 100%, 0 100%); }
          50% { clip-path: polygon(0 65%, 15% 50%, 30% 65%, 45% 45%, 60% 65%, 75% 50%, 90% 65%, 100% 55%, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 60%, 15% 45%, 30% 60%, 45% 40%, 60% 60%, 75% 45%, 90% 60%, 100% 50%, 100% 100%, 0 100%); }
        }
        @keyframes wave2 {
          0% { clip-path: polygon(0 70%, 20% 55%, 40% 70%, 60% 50%, 80% 70%, 100% 60%, 100% 100%, 0 100%); }
          50% { clip-path: polygon(0 75%, 20% 60%, 40% 75%, 60% 55%, 80% 75%, 100% 65%, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 70%, 20% 55%, 40% 70%, 60% 50%, 80% 70%, 100% 60%, 100% 100%, 0 100%); }
        }
        @keyframes wave3 {
          0% { clip-path: polygon(0 80%, 25% 65%, 50% 80%, 75% 60%, 100% 75%, 100% 100%, 0 100%); }
          50% { clip-path: polygon(0 85%, 25% 70%, 50% 85%, 75% 65%, 100% 80%, 100% 100%, 0 100%); }
          100% { clip-path: polygon(0 80%, 25% 65%, 50% 80%, 75% 60%, 100% 75%, 100% 100%, 0 100%); }
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
      {/* Animated gradient waves with bigger amplitude */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave layer 1 - Bigger amplitude, animated */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
            clipPath: 'polygon(0 60%, 15% 45%, 30% 60%, 45% 40%, 60% 60%, 75% 45%, 90% 60%, 100% 50%, 100% 100%, 0 100%)',
            animation: 'wave1 6s ease-in-out infinite',
            WebkitAnimation: 'wave1 6s ease-in-out infinite',
          }}
        />
        
        {/* Wave layer 2 - Bigger amplitude, animated */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-25"
          style={{
            background: 'linear-gradient(to top, rgba(37, 99, 235, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(37, 99, 235, 0.15) 100%)',
            clipPath: 'polygon(0 70%, 20% 55%, 40% 70%, 60% 50%, 80% 70%, 100% 60%, 100% 100%, 0 100%)',
            animation: 'wave2 8s ease-in-out infinite',
            animationDelay: '0.5s',
            WebkitAnimation: 'wave2 8s ease-in-out infinite',
            WebkitAnimationDelay: '0.5s',
          }}
        />
        
        {/* Wave layer 3 - Bigger amplitude, animated */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(96, 165, 250, 0.3) 0%, rgba(147, 197, 253, 0.2) 50%, rgba(96, 165, 250, 0.1) 100%)',
            clipPath: 'polygon(0 80%, 25% 65%, 50% 80%, 75% 60%, 100% 75%, 100% 100%, 0 100%)',
            animation: 'wave3 10s ease-in-out infinite',
            animationDelay: '1s',
            WebkitAnimation: 'wave3 10s ease-in-out infinite',
            WebkitAnimationDelay: '1s',
          }}
        />
      </div>
      
      {/* Simple gradient overlay */}
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const ParticleBanner: React.FC = () => {
  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Larger static gradient waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave layer 1 - Larger */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
            clipPath: 'polygon(0 40%, 20% 35%, 40% 40%, 60% 35%, 80% 40%, 100% 35%, 100% 100%, 0 100%)',
          }}
        />
        
        {/* Wave layer 2 - Larger */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-25"
          style={{
            background: 'linear-gradient(to top, rgba(37, 99, 235, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(37, 99, 235, 0.15) 100%)',
            clipPath: 'polygon(0 50%, 15% 45%, 30% 50%, 45% 45%, 60% 50%, 75% 45%, 90% 50%, 100% 45%, 100% 100%, 0 100%)',
          }}
        />
        
        {/* Wave layer 3 - Larger */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(96, 165, 250, 0.3) 0%, rgba(147, 197, 253, 0.2) 50%, rgba(96, 165, 250, 0.1) 100%)',
            clipPath: 'polygon(0 60%, 25% 55%, 50% 60%, 75% 55%, 100% 60%, 100% 100%, 0 100%)',
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

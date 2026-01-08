/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ParticleBanner: React.FC = () => {
  // Inject CSS keyframes for wave animations
  useEffect(() => {
    const styleId = 'particle-banner-waves';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes wave1 {
        0%, 100% { clip-path: polygon(0 60%, 25% 55%, 50% 60%, 75% 55%, 100% 60%, 100% 100%, 0 100%); }
        50% { clip-path: polygon(0 65%, 25% 60%, 50% 65%, 75% 60%, 100% 65%, 100% 100%, 0 100%); }
      }
      @keyframes wave2 {
        0%, 100% { clip-path: polygon(0 70%, 20% 65%, 40% 70%, 60% 65%, 80% 70%, 100% 65%, 100% 100%, 0 100%); }
        50% { clip-path: polygon(0 75%, 20% 70%, 40% 75%, 60% 70%, 80% 75%, 100% 70%, 100% 100%, 0 100%); }
      }
      @keyframes wave3 {
        0%, 100% { clip-path: polygon(0 80%, 30% 75%, 60% 80%, 100% 75%, 100% 100%, 0 100%); }
        50% { clip-path: polygon(0 85%, 30% 80%, 60% 85%, 100% 80%, 100% 100%, 0 100%); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Simple CSS-based wave layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave layer 1 */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(59, 130, 246, 0.4) 0%, rgba(96, 165, 250, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
            clipPath: 'polygon(0 60%, 25% 55%, 50% 60%, 75% 55%, 100% 60%, 100% 100%, 0 100%)',
            animation: 'wave1 8s ease-in-out infinite',
          }}
        />
        
        {/* Wave layer 2 */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-25"
          style={{
            background: 'linear-gradient(to top, rgba(37, 99, 235, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(37, 99, 235, 0.15) 100%)',
            clipPath: 'polygon(0 70%, 20% 65%, 40% 70%, 60% 65%, 80% 70%, 100% 65%, 100% 100%, 0 100%)',
            animation: 'wave2 10s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        
        {/* Wave layer 3 */}
        <div 
          className="absolute bottom-0 w-full h-full opacity-20"
          style={{
            background: 'linear-gradient(to top, rgba(96, 165, 250, 0.3) 0%, rgba(147, 197, 253, 0.2) 50%, rgba(96, 165, 250, 0.1) 100%)',
            clipPath: 'polygon(0 80%, 30% 75%, 60% 80%, 100% 75%, 100% 100%, 0 100%)',
            animation: 'wave3 12s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
      </div>
      
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const ParticleBanner: React.FC = () => {
  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* CSS-based wave animation - safer and more reliable */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 200">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                <stop offset="50%" stopColor="rgba(96, 165, 250, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
              </linearGradient>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(37, 99, 235, 0.35)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.25)" />
                <stop offset="100%" stopColor="rgba(37, 99, 235, 0.15)" />
              </linearGradient>
              <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(96, 165, 250, 0.3)" />
                <stop offset="50%" stopColor="rgba(147, 197, 253, 0.2)" />
                <stop offset="100%" stopColor="rgba(96, 165, 250, 0.1)" />
              </linearGradient>
            </defs>
            
            {/* Wave 1 */}
            <motion.path
              d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
              fill="url(#wave1)"
              animate={{
                d: [
                  "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
                  "M0,100 Q300,80 600,100 T1200,100 L1200,200 L0,200 Z",
                  "M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Wave 2 */}
            <motion.path
              d="M0,120 Q400,70 800,120 T1200,120 L1200,200 L0,200 Z"
              fill="url(#wave2)"
              animate={{
                d: [
                  "M0,120 Q400,70 800,120 T1200,120 L1200,200 L0,200 Z",
                  "M0,120 Q400,90 800,120 T1200,120 L1200,200 L0,200 Z",
                  "M0,120 Q400,70 800,120 T1200,120 L1200,200 L0,200 Z",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            
            {/* Wave 3 */}
            <motion.path
              d="M0,140 Q200,90 400,140 T800,140 T1200,140 L1200,200 L0,200 Z"
              fill="url(#wave3)"
              animate={{
                d: [
                  "M0,140 Q200,90 400,140 T800,140 T1200,140 L1200,200 L0,200 Z",
                  "M0,140 Q200,110 400,140 T800,140 T1200,140 L1200,200 L0,200 Z",
                  "M0,140 Q200,90 400,140 T800,140 T1200,140 L1200,200 L0,200 Z",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </svg>
        </div>
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

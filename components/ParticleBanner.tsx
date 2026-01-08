import React, { useEffect, useRef } from 'react';

const PlanetarySystemBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      // Use a slightly larger canvas than the container so orbits don't get cut off sharply at edges
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      // Increase internal resolution for smoother trails
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      // Avoid accumulating scale on repeated resizes
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };

    // -- Physics Constants --
    // Lower G for more majestic, slower orbital mechanics relative to screen size
    const G = 0.05; 
    const dt = 0.5; // Time step

    interface CelestialBody {
      x: number;
      y: number;
      vx: number;
      vy: number;
      mass: number;
      radius: number;
      color: string;
      glowColor: string;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }

    let theSun: CelestialBody;
    const planets: CelestialBody[] = [];
    
    // Massless particles for the asteroid belt
    interface Asteroid {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
    }
    const asteroids: Asteroid[] = [];
    const asteroidCount = 600;

    // Helper to convert hex to rgb (for gradients / glows)
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    };


    const initSystem = () => {
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Initialize The Sun (massive, stationary central body)
      theSun = {
        x: centerX,
        y: centerY + height * 0.1, // Offset slightly downwards for better banner composition
        vx: 0,
        vy: 0,
        mass: 15000, // Huge mass dominates gravity
        radius: 35,
        color: '#fcd34d', // Amber-300
        glowColor: 'rgba(251, 191, 36, 0.4)', // Amber-400 with opacity
        trail: [],
      };

      planets.length = 0;
      asteroids.length = 0;

      // 2. Initialize Planets with Orbital Velocity
      const planetDefinitions = [
        // Site-consistent blue palette (varying shades for depth)
        { r: 70, size: 5, speedMod: 1.1, color: '#93c5fd' }, // blue-300
        { r: 110, size: 8, speedMod: 1.0, color: '#60a5fa' }, // blue-400
        { r: 160, size: 9, speedMod: 1.0, color: '#3b82f6' }, // blue-500
        { r: 220, size: 7, speedMod: 0.95, color: '#2563eb' }, // blue-600
        { r: 320, size: 14, speedMod: 0.9, color: '#1d4ed8' }, // blue-700
        { r: 420, size: 12, speedMod: 0.85, color: '#38bdf8' }, // sky-400
      ];

      planetDefinitions.forEach((def, i) => {
        const angle = (Math.random() * Math.PI * 2); // Random starting angle
        const radius = def.r * (0.9 + Math.random() * 0.2); // Varied radius based on definintion
        const x = theSun.x + radius * Math.cos(angle);
        const y = theSun.y + radius * Math.sin(angle);

        // Calculate velocity for a stable circular orbit: v = sqrt(G*M_central / r)
        const distance = Math.sqrt(Math.pow(x - theSun.x, 2) + Math.pow(y - theSun.y, 2));
        let orbitalSpeed = Math.sqrt((G * theSun.mass) / distance);
        
        // Adjust speed slightly for elliptical variance
        orbitalSpeed *= def.speedMod; 

        // Velocity vector is perpendicular to the position vector
        const vx = orbitalSpeed * -Math.sin(angle);
        const vy = orbitalSpeed * Math.cos(angle);

        planets.push({
          x, y, vx, vy,
          mass: def.size * 2, // Mass roughly proportional to size
          radius: def.size,
          color: def.color,
          glowColor: `rgba(${hexToRgb(def.color)}, 0.35)`,
          trail: []
        });
      });

      // 3. Initialize Asteroid Belt
      const minBeltRadius = 240;
      const maxBeltRadius = 290;
      
      for (let i = 0; i < asteroidCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          // Distribute randomly within the belt band
          const radius = minBeltRadius + Math.random() * (maxBeltRadius - minBeltRadius);
          const x = theSun.x + radius * Math.cos(angle);
          const y = theSun.y + radius * Math.sin(angle);

          // Orbital velocity for asteroids
          const orbitalSpeed = Math.sqrt((G * theSun.mass) / radius);
          const vx = orbitalSpeed * -Math.sin(angle);
          const vy = orbitalSpeed * Math.cos(angle);

          asteroids.push({
              x, y, vx, vy,
              size: Math.random() > 0.8 ? 1.5 : 0.8 // Varying sizes
          });
      }
    };

    const updatePhysics = () => {
      // We only calculate forces exerted BY the sun ON the planets/asteroids.
      // Ignoring inter-planetary forces keeps the system stable for a banner.

      // Update Planets
      planets.forEach(p => {
        const dx = theSun.x - p.x;
        const dy = theSun.y - p.y;
        const distSq = dx * dx + dy * dy;
        const distance = Math.sqrt(distSq);

        // Gravity Force magnitude: F = G * M1 * M2 / r^2
        const force = (G * theSun.mass * p.mass) / distSq;

        // Acceleration: F = ma  =>  a = F / m
        const ax = (force * dx / distance) / p.mass;
        const ay = (force * dy / distance) / p.mass;

        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Add to trail
        p.trail.push({ x: p.x, y: p.y, opacity: 1.0 });
        if (p.trail.length > 150) p.trail.shift(); // Longer trails for orbits
        p.trail.forEach(pt => { pt.opacity *= 0.99; });
      });

      // Update Asteroids
      asteroids.forEach(a => {
          const dx = theSun.x - a.x;
          const dy = theSun.y - a.y;
          const distSq = dx * dx + dy * dy;
          const distance = Math.sqrt(distSq);
          // Massless particles, just calculate acceleration directly: a = GM/r^2
          const accel = (G * theSun.mass) / distSq;
          const ax = accel * dx / distance;
          const ay = accel * dy / distance;

          a.vx += ax * dt;
          a.vy += ay * dt;
          a.x += a.vx * dt;
          a.y += a.vy * dt;
      });
    };

    const drawTrail = (body: CelestialBody) => {
      if (body.trail.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(body.trail[0].x, body.trail[0].y);
      for (let i = 1; i < body.trail.length; i++) {
        ctx.lineTo(body.trail[i].x, body.trail[i].y);
      }
      
      // Create a fading gradient along the path
      const gradient = ctx.createLinearGradient(
          body.trail[0].x, body.trail[0].y,
          body.trail[body.trail.length -1].x, body.trail[body.trail.length -1].y
      );
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, body.color);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4; // Generally faint trails
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    const drawBody = (body: CelestialBody, isSun: boolean) => {
      if (!isSun) drawTrail(body);

      // Glow gradient
      const glowRadius = isSun ? body.radius * 8 : body.radius * 3;
      const gradient = ctx.createRadialGradient(
        body.x, body.y, body.radius * 0.5,
        body.x, body.y, glowRadius
      );
      
      if (isSun) {
        gradient.addColorStop(0, 'rgba(255, 251, 235, 0.8)'); // bright center
        gradient.addColorStop(0.2, body.glowColor);
        gradient.addColorStop(1, 'transparent');
      } else {
        // Planet glow is subtler
        const baseColor = body.color.startsWith('#') ? hexToRgb(body.color) : '100,100,100';
        gradient.addColorStop(0, `rgba(${baseColor}, 0.4)`);
        gradient.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = isSun ? 'screen' : 'lighter';
      ctx.beginPath();
      ctx.arc(body.x, body.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Solid body center
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawAsteroids = () => {
        ctx.fillStyle = 'rgba(209, 213, 219, 0.6)'; // gray-300 semi-transparent
        ctx.beginPath();
        for (const a of asteroids) {
            // Draw them as tiny squares for performance instead of arcs
            ctx.rect(a.x, a.y, a.size, a.size);
        }
        ctx.fill();
    };

    const animate = () => {
      if (!theSun || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      updatePhysics();

      // Clear canvas
      ctx.fillStyle = 'rgba(2, 6, 23, 1)'; // Very dark slate background
      ctx.fillRect(0, 0, width, height);

      // Draw Asteroid Belt (bottom layer)
      drawAsteroids();

      // Draw Planets and trails
      planets.forEach(p => drawBody(p, false));

      // Draw Sun (top layer)
      drawBody(theSun, true);

      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      // Small delay to ensure container has dimensions
      setTimeout(() => {
          resize();
          if (width > 0 && height > 0) {
            initSystem();
            animate();
          }
      }, 100);
    };

    window.addEventListener('resize', resize);
    init();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-48 md:h-72 lg:h-80 relative bg-slate-950 overflow-hidden shrink-0 border-b border-slate-800">
      {/* Canvas for planetary simulation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Gradient overlay for depth and color toning */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          // A subtle radial gradient emphasizing the center, deep blue/purple tones
          background: 'radial-gradient(circle at 50% 60%, rgba(79, 70, 229, 0.15) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(2, 6, 23, 0.8) 100%)',
          mixBlendMode: 'overlay'
        }}
      />

       {/* subtle star speckles overlay (static CSS) */}
       <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-screen"></div>

      
      {/* Overlay Content (kept identical to original) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4 text-center">
        <div className="relative">
          {/* Simple background box */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-slate-900/50 to-blue-950/50 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl" />
          
          <div className="relative p-6 md:p-8 lg:p-10">
            {/* Main Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif mb-2">
              <span className="bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-2xl">
                Data Science Lead
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-indigo-200/80 text-sm md:text-base lg:text-lg uppercase tracking-[0.2em] font-medium mb-4">
              Applied AI and Decision Systems
            </p>
          </div>
        </div>
      </div>
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
};

export default PlanetarySystemBanner;
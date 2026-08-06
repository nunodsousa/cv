/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Light scattering in a disordered medium — the subject of the thesis this
 * CV describes, drawn honestly rather than decoratively.
 *
 * A set of point scatterers is illuminated by a monochromatic source. Each
 * one re-radiates a cylindrical wave, and what you see is their superposition:
 *
 *     ψ(r, t) = Σ  a_j · cos(k·r_j − ωt) ,   a_j ∝ 1/√r_j
 *
 * The 1/√r falloff is the 2D (cylindrical) one — energy spreading over a
 * circumference rather than a sphere.
 *
 * The whole thing is cheap to animate because the geometry never moves. Only
 * the phase advances, so the time dependence factors out exactly:
 *
 *     ψ(r, t) = A(r)·cos(ωt) + B(r)·sin(ωt)
 *     A = Σ a_j cos(k·r_j),  B = Σ a_j sin(k·r_j)
 *
 * A and B are computed once per resize. Each frame is then two multiplies and
 * an add per pixel — no trigonometry in the animation loop at all.
 */

import React, { useEffect, useRef } from 'react';

/** Compute the field at 1/3 resolution and let the GPU upscale it. The
 *  bilinear smoothing costs nothing and reads as a soft optical glow. */
const SCALE = 3;

// Few scatterers and a long wavelength on purpose: tight fringes read as
// visual noise, while broad ones read as wave optics.
const SCATTERERS = 6;
const WAVELENGTH = 32; // px, in low-resolution units
const OMEGA = 1.5; // rad/s — one slow, calm cycle

/** Deterministic PRNG, so the speckle pattern is the same on every visit. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const PhysicsBanner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    let width = 0;
    let height = 0;
    let fieldA = new Float32Array(0);
    let fieldB = new Float32Array(0);
    let envelopeMax = 1;
    let image: ImageData | null = null;
    let rafId = 0;
    let running = false;

    /** Accent colour, read from the same CSS variables the rest of the page uses. */
    const readAccent = (): [number, number, number] => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      const parts = raw.split(/[\s,]+/).map(Number).filter((n) => !Number.isNaN(n));
      return parts.length === 3 ? [parts[0], parts[1], parts[2]] : [0, 113, 227];
    };

    /** Precompute the standing pattern: everything that doesn't depend on t. */
    const build = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      width = Math.max(1, Math.floor(parent.offsetWidth / SCALE));
      height = Math.max(1, Math.floor(parent.offsetHeight / SCALE));

      canvas.width = width;
      canvas.height = height;

      const random = makeRandom(20260803);
      const k = (2 * Math.PI) / WAVELENGTH;

      // Scatterers sit slightly below the strip and spread across it, so the
      // wavefronts arc upward into the banner rather than radiating from its centre.
      const scatterers: Array<{ x: number; y: number }> = [];
      for (let j = 0; j < SCATTERERS; j++) {
        scatterers.push({
          x: width * ((j + 0.5) / SCATTERERS + (random() - 0.5) * 0.2),
          y: height * (0.95 + random() * 0.7),
        });
      }

      fieldA = new Float32Array(width * height);
      fieldB = new Float32Array(width * height);
      envelopeMax = 1e-6;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let a = 0;
          let b = 0;
          for (let j = 0; j < scatterers.length; j++) {
            const dx = x - scatterers[j].x;
            const dy = y - scatterers[j].y;
            const r = Math.sqrt(dx * dx + dy * dy);
            const amp = 1 / Math.sqrt(r + 8); // cylindrical falloff, softened at the core
            const phase = k * r;
            a += amp * Math.cos(phase);
            b += amp * Math.sin(phase);
          }
          const i = y * width + x;
          fieldA[i] = a;
          fieldB[i] = b;
          const envelope = Math.hypot(a, b);
          if (envelope > envelopeMax) envelopeMax = envelope;
        }
      }

      image = ctx.createImageData(width, height);
    };

    /** One frame: ψ = A·cos(ωt) + B·sin(ωt), mapped to opacity. */
    const draw = (timeMs: number) => {
      if (!image) return;
      const [r, g, b] = readAccent();
      const phase = (timeMs / 1000) * OMEGA;
      const cos = Math.cos(phase);
      const sin = Math.sin(phase);
      // Dark backgrounds need a brighter trace to read at the same weight.
      const gain = darkQuery.matches ? 0.5 : 0.4;
      const data = image.data;

      for (let i = 0; i < fieldA.length; i++) {
        const psi = fieldA[i] * cos + fieldB[i] * sin;
        // |ψ| gives crest-and-trough fringes; the exponent softens the mid-tones
        // so the pattern stays quiet instead of banding.
        const t = Math.abs(psi) / envelopeMax;
        const alpha = Math.pow(t, 1.6) * gain;
        const o = i * 4;
        data[o] = r;
        data[o + 1] = g;
        data[o + 2] = b;
        data[o + 3] = alpha * 255;
      }

      ctx.putImageData(image, 0, 0);
    };

    const loop = (t: number) => {
      draw(t);
      if (running) rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (motionQuery.matches) {
        // Reduced motion keeps the physics, drops the movement: one still frame.
        running = false;
        draw(0);
      } else {
        running = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const rebuild = () => {
      build();
      start();
    };

    rebuild();

    const observer = new ResizeObserver(rebuild);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    motionQuery.addEventListener('change', start);
    darkQuery.addEventListener('change', start);

    // Nothing to compute while the tab is in the background.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else {
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      motionQuery.removeEventListener('change', start);
      darkQuery.removeEventListener('change', start);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div
      className="relative h-40 w-full overflow-hidden bg-grouped sm:h-52 lg:h-60 print:hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        // The field dissolves into the page instead of ending on a hard edge.
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
        }}
      />
    </div>
  );
};

export default PhysicsBanner;

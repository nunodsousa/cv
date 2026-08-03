/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * A sheet that behaves like a physical object.
 *
 * - Tracks the pointer 1:1 while dragging down, with no lag.
 * - Rubber-bands when dragged up past its resting position instead of
 *   stopping dead against the boundary.
 * - On release, projects where the flick was *going* (Apple's scroll
 *   deceleration curve) and commits to dismiss or return based on that
 *   projection, then hands the release velocity to the spring so there is
 *   no seam between the drag and the animation.
 * - Interruptible throughout: springs animate from the live on-screen value,
 *   so a sheet caught mid-dismissal follows the finger again immediately.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Where a flick comes to rest, using the same exponential decay as native
 * scroll views. This is the function from Apple's "Designing Fluid Interfaces"
 * sample code — not the physics-textbook v²/(2a) form.
 */
function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

// Critically damped: reaches the target gracefully with no overshoot.
// Overshoot on a sheet returning home would read as sloppiness, not physicality.
const RETURN_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.4 };

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open, onClose, title, subtitle, icon, children }) => {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const reduceMotion = useReducedMotion();

  // The scrim dims continuously *during* the drag, not only at the end —
  // the user sees the dismissal being decided as they move.
  const scrimOpacity = useTransform(y, [0, 400], [1, 0.2], { clamp: true });

  const handleDragEnd = useCallback(
    (_: PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y;
      const offset = y.get();
      const height = sheetRef.current?.offsetHeight ?? 600;

      // Decide from where the gesture was *heading*, not where the finger
      // happened to stop. A short fast flick should dismiss; a long slow
      // drag that was already reversing should not.
      const projectedEndpoint = offset + project(velocity);
      const shouldDismiss = projectedEndpoint > height * 0.4;

      if (shouldDismiss) {
        onClose();
      } else {
        // Hand the release velocity to the spring so the return continues
        // at exactly the speed the finger left off at — no seam between
        // the drag and the animation.
        animate(y, 0, { ...RETURN_SPRING, velocity });
      }
    },
    [onClose, y],
  );

  // Lock background scroll while the sheet owns the screen.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape always gets you out — never trap the user.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Reset position whenever the sheet is presented, so it always enters
  // from the same place it exits to.
  useEffect(() => {
    if (open) {
      y.set(0);
      setAtTop(true);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
    }
  }, [open, y]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center print:hidden">
          {/* Dimming scrim: this is a modal task, so the background is pushed
              back — but it stays visible, so the page you came from is still
              legible behind the sheet.
              Two layers on purpose: the outer one owns the enter/exit fade,
              the inner one tracks the drag, so the two never fight over
              the same opacity value. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            aria-hidden="true"
          >
            <motion.div
              className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
              style={{ opacity: reduceMotion ? 1 : scrimOpacity }}
            />
          </motion.div>

          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="material-sheet relative flex max-h-[88vh] w-full flex-col
                       overflow-hidden rounded-t-sheet border border-separator/60
                       sm:max-h-[84vh] sm:max-w-3xl sm:rounded-sheet"
            style={{ y, touchAction: 'none' }}
            drag={reduceMotion ? false : 'y'}
            // Only the top edge is constrained. Downward is free so the sheet
            // stays glued to the finger all the way to dismissal.
            dragConstraints={{ top: 0 }}
            // Progressive resistance past the top boundary — the sheet
            // resists rather than freezing.
            dragElastic={{ top: 0.55, bottom: 0 }}
            dragListener={false}
            dragControls={dragControls}
            onDragEnd={handleDragEnd}
            // Enters and exits along the same path (§ spatial consistency),
            // materialising with scale rather than a flat fade.
            initial={reduceMotion ? { opacity: 0 } : { y: '100%', scale: 0.96, opacity: 0.6 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%', scale: 0.98, opacity: 0.5 }}
            transition={reduceMotion ? { duration: 0.15 } : { ...RETURN_SPRING }}
          >
            {/* Grab area. Pointer-down here starts the drag immediately —
                feedback never waits for a release. */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="shrink-0 cursor-grab touch-none px-5 pb-3 pt-2.5 active:cursor-grabbing sm:px-7"
            >
              <div className="mx-auto mb-4 h-1.5 w-9 rounded-full bg-tertiary/50 sm:hidden" />

              <div className="flex items-start gap-3">
                {icon && <div className="mt-0.5 shrink-0 text-accent">{icon}</div>}
                <div className="min-w-0 flex-1">
                  <h2 className="type-headline on-material truncate text-[1.0625rem] text-label">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="type-caption mt-0.5 truncate text-[0.8125rem] text-secondary">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 -mt-1 shrink-0 rounded-full bg-fill p-2 text-secondary
                             transition-[transform,background-color] duration-150 ease-out
                             hover:text-label active:scale-90"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Content scrolls under a soft edge rather than against a hard rule. */}
            <div
              ref={scrollRef}
              onScroll={(e) => setAtTop(e.currentTarget.scrollTop <= 0)}
              // Dragging from the content only takes over once the list is
              // already at the top — otherwise the gesture belongs to scrolling.
              onPointerDown={(e) => {
                if (atTop && !reduceMotion) dragControls.start(e);
              }}
              className="thin-scroll scroll-edge min-h-0 flex-1 overflow-y-auto overscroll-contain
                         px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-7"
              style={{ touchAction: atTop ? 'pan-y' : 'auto' }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sheet;

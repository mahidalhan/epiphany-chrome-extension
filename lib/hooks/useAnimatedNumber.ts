/**
 * useAnimatedNumber - Smoothly animate a number from its current value to a target.
 *
 * Uses requestAnimationFrame for 60fps smooth animation with easeOutCubic easing.
 * Useful for score counters, percentages, and other numeric displays.
 *
 * @param target - The target number to animate towards
 * @param duration - Animation duration in milliseconds (default: 500)
 * @returns The current animated value
 *
 * @example
 * const animatedScore = useAnimatedNumber(score, 500);
 * return <span>{Math.round(animatedScore)}</span>
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Easing function: easeOutCubic
 * Starts fast, decelerates towards the end for a natural feel.
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useAnimatedNumber(target: number, duration = 500): number {
  const [current, setCurrent] = useState(target);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(target);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip animation if target hasn't changed
    if (current === target) return;

    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Store starting values
    startValueRef.current = current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const newValue =
        startValueRef.current + (target - startValueRef.current) * easedProgress;

      setCurrent(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we land exactly on target
        setCurrent(target);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when target changes
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration]); // Note: current intentionally excluded to avoid infinite loop

  return current;
}

export default useAnimatedNumber;

'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionValue, useInView, useSpring, useTransform } from 'framer-motion';

function Digit({
  place,
  value,
  digitHeight,
  duration,
}: {
  place: number;
  value: number;
  digitHeight: number;
  duration: number;
}) {
  const valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace, {
    duration: duration * 1000, // Convert to milliseconds
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div style={{ height: digitHeight }} className="relative w-[1ch] tabular-nums overflow-hidden">
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} digitHeight={digitHeight} />
      ))}
    </div>
  );
}

function Number({ mv, number, digitHeight }: { mv: MotionValue<number>; number: number; digitHeight: number }) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * digitHeight;

    if (offset > 5) {
      memo -= 10 * digitHeight;
    }

    return memo;
  });

  return (
    <motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
      {number}
    </motion.span>
  );
}

interface SlidingNumberProps {
  from: number;
  to: number;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  once?: boolean;
  className?: string;
  onComplete?: () => void;
  digitHeight?: number;
}

export function SlidingNumber({
  from,
  to,
  duration = 2,
  delay = 0,
  startOnView = true,
  once = false,
  className = '',
  onComplete,
  digitHeight = 40,
}: SlidingNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [currentValue, setCurrentValue] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable callback reference
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset animation state when from/to values change
  useEffect(() => {
    setCurrentValue(from);
    setHasAnimated(false);
    setAnimationKey((prev) => prev + 1);

    // Cancel any ongoing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [from, to]);

  // Determine if animation should start
  const shouldStart = useMemo(() => {
    if (!startOnView) return true;
    if (!isInView) return false;
    if (once && hasAnimated) return false;
    return true;
  }, [startOnView, isInView, once, hasAnimated]);

  // Main animation effect
  useEffect(() => {
    if (!shouldStart) return;

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setHasAnimated(true);

    timeoutRef.current = setTimeout(() => {
      const startTime = Date.now();
      // Always animate from 'from' prop to 'to' prop (not from currentValue).
      // This prevents infinite loop: using currentValue in dependencies would
      // cause the effect to re-trigger on every animation frame update.
      // Note: If props change mid-animation, it will restart from the new 'from' value.
      // This is intentional - the animation should reflect the updated target values.
      const difference = to - from;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const newValue = from + difference * easeOutCubic;

        setCurrentValue(newValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(to);
          animationFrameRef.current = null;
          onCompleteRef.current?.();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [shouldStart, from, to, duration, delay]);

  // Round the current value to avoid showing decimals during animation
  const roundedValue = Math.round(currentValue);
  const absValue = Math.abs(roundedValue);

  // Determine the maximum number of digits needed
  const maxDigits = Math.max(Math.abs(from).toString().length, Math.abs(to).toString().length);

  // Create array of place values (1, 10, 100, 1000, etc.)
  const places = useMemo(
    () => Array.from({ length: maxDigits }, (_, i) => Math.pow(10, maxDigits - i - 1)),
    [maxDigits],
  );

  return (
    <div ref={ref} className={`flex items-center ${className}`}>
      {roundedValue < 0 && '-'}
      {places.map((place) => (
        <Digit
          key={`${place}-${animationKey}`}
          place={place}
          value={absValue}
          digitHeight={digitHeight}
          duration={duration}
        />
      ))}
    </div>
  );
}

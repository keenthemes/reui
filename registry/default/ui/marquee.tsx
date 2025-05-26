import React, { ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number;
  /**
   * If true, automatically repeats children enough to fill the visible area
   */
  autoFill?: boolean;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  /**
   * ARIA live region politeness
   */
  ariaLive?: 'off' | 'polite' | 'assertive';
  /**
   * ARIA role
   */
  ariaRole?: string;
  /**
   * Called when marquee animation starts
   */
  onStart?: () => void;
  /**
   * Called when marquee animation ends (one full cycle)
   */
  onEnd?: () => void;
  /**
   * Called when marquee is paused
   */
  onPause?: () => void;
  /**
   * Called when marquee resumes
   */
  onResume?: () => void;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  onStart,
  onEnd,
  onPause,
  onResume,
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  // Animation event handlers
  useEffect(() => {
    if (!marqueeRef.current) return;
    const el = marqueeRef.current as HTMLElement;
    let started = false;
    let paused = false;
    const handleAnimationStart = () => {
      if (!started) {
        started = true;
        onStart?.();
      }
    };
    const handleAnimationIteration = () => {
      onEnd?.();
    };
    const handlePause = () => {
      if (!paused) {
        paused = true;
        onPause?.();
      }
    };
    const handleResume = () => {
      if (paused) {
        paused = false;
        onResume?.();
      }
    };
    el.addEventListener('animationstart', handleAnimationStart);
    el.addEventListener('animationiteration', handleAnimationIteration);
    el.addEventListener('animationpause', handlePause);
    el.addEventListener('animationresume', handleResume);
    return () => {
      el.removeEventListener('animationstart', handleAnimationStart);
      el.removeEventListener('animationiteration', handleAnimationIteration);
      el.removeEventListener('animationpause', handlePause);
      el.removeEventListener('animationresume', handleResume);
    };
  }, [onStart, onEnd, onPause, onResume]);

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                key={i}
                className={cn(
                  !vertical
                    ? 'flex-row [gap:var(--gap)]'
                    : 'flex-col [gap:var(--gap)]',
                  'flex shrink-0 justify-around',
                  !vertical && 'animate-marquee flex-row',
                  vertical && 'animate-marquee-vertical flex-col',
                  pauseOnHover && 'group-hover:[animation-play-state:paused]',
                  reverse && '[animation-direction:reverse]',
                )}
              >
                {children}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse],
      )}
    </div>
  );
}

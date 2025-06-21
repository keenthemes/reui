'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

interface GithubButtonProps {
  /** Initial number of stars */
  initialStars?: number;
  /** Target number of stars to animate to */
  targetStars?: number;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Animation delay in seconds */
  animationDelay?: number;
  /** Whether to start animation automatically */
  autoAnimate?: boolean;
  /** Custom className */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Whether to show Github icon */
  showGithubIcon?: boolean;
  /** Custom star icon color */
  starColor?: string;
  /** Whether stars should be filled */
  filled?: boolean;
  /** Repository URL for actual Github integration */
  repoUrl?: string;
  /** Custom click handler */
  onClick?: () => void;
}

const GithubButton = React.forwardRef<HTMLButtonElement, GithubButtonProps>(
  (
    {
      initialStars = 0,
      targetStars = 1501,
      animationDuration = 2,
      animationDelay = 0,
      autoAnimate = true,
      className,
      variant = 'outline',
      size = 'default',
      onAnimationComplete,
      showGithubIcon = true,
      starColor = 'currentColor',
      filled = false,
      repoUrl,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [currentStars, setCurrentStars] = useState(initialStars);
    const [isAnimating, setIsAnimating] = useState(false);
    const [starProgress, setStarProgress] = useState(filled ? 100 : 0);

    // Format number with commas
    const formatNumber = (num: number) => {
      return num.toLocaleString();
    };

    // Start animation
    const startAnimation = useCallback(() => {
      if (isAnimating) return;

      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = currentStars;
      const endValue = targetStars;
      const duration = animationDuration * 1000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const newValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        setCurrentStars(newValue);

        // Animate star fill progress
        setStarProgress(progress * 100);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onAnimationComplete?.();
        }
      };

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, animationDelay * 1000);
    }, [isAnimating, currentStars, targetStars, animationDuration, animationDelay, onAnimationComplete]);

    // Auto-start animation
    useEffect(() => {
      if (autoAnimate) {
        startAnimation();
      }
    }, [autoAnimate, startAnimation]);

    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (repoUrl) {
        window.open(repoUrl, '_blank', 'noopener,noreferrer');
      } else {
        startAnimation();
      }
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'relative overflow-hidden transition-all duration-200 hover:scale-105',
          'bg-gray-900 hover:bg-gray-800 text-white border-gray-700',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <div className="flex items-center gap-2">
          {showGithubIcon && <Github className="h-4 w-4" />}

          {/* Animated Star Icon */}
          <div className="relative">
            <motion.div
              className="relative"
              animate={{
                rotate: isAnimating ? [0, 360] : 0,
              }}
              transition={{
                duration: animationDuration,
                ease: 'easeInOut',
              }}
            >
              {/* Background star */}
              <Star className="h-4 w-4 text-gray-400" fill="none" />

              {/* Animated fill star */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${starProgress}%`,
                  }}
                  transition={{
                    duration: 0.1,
                    ease: 'linear',
                  }}
                >
                  <Star className="h-4 w-4 text-yellow-400" fill={starColor} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Animated Number Counter */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStars}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="block font-medium"
              >
                {formatNumber(currentStars)}
              </motion.span>
            </AnimatePresence>
          </div>

          <span className="text-sm text-gray-300">{currentStars === 1 ? 'Star' : 'Stars'}</span>
        </div>

        {/* Sparkle animation overlay */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: animationDuration,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </Button>
    );
  },
);

GithubButton.displayName = 'GithubButton';

export { GithubButton };
export type { GithubButtonProps };

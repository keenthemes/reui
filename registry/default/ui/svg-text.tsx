'use client';

import * as React from 'react';
import { ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SvgTextProps {
  /**
   * The SVG content to display inside the text
   */
  svg: ReactNode;
  /**
   * The content to display (will have the SVG "inside" it)
   */
  children: ReactNode;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Font size for the text mask (in viewport width units or CSS units)
   * @default "20vw"
   */
  fontSize?: string | number;
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: string | number;
  /**
   * The element type to render for the container
   * @default "div"
   */
  as?: ElementType;
}

/**
 * SvgText displays content with an SVG background fill effect.
 * The SVG is masked by the content, creating a dynamic text look.
 */
export function SvgText({
  svg,
  children,
  className = '',
  fontSize = '20vw',
  fontWeight = 'bold',
  as: Component = 'div',
}: SvgTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [textDimensions, setTextDimensions] = useState({ width: 0, height: 0 });
  const content = React.Children.toArray(children).join('');
  const maskId = React.useId();

  useEffect(() => {
    if (!textRef.current) return;

    const updateDimensions = () => {
      const rect = textRef.current?.getBoundingClientRect();
      if (rect) {
        setTextDimensions({
          width: Math.max(rect.width, 200),
          height: Math.max(rect.height, 100),
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(textRef.current);

    return () => resizeObserver.disconnect();
  }, [content, fontSize, fontWeight]);

  return (
    <Component className={cn('relative inline-block', className)}>
      {/* Hidden text for measuring */}
      <div
        ref={textRef}
        className="opacity-0 absolute pointer-events-none font-bold whitespace-nowrap"
        style={{
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {content}
      </div>

      {/* SVG with text mask */}
      <svg
        className="block"
        width={textDimensions.width}
        height={textDimensions.height}
        viewBox={`0 0 ${textDimensions.width} ${textDimensions.height}`}
        style={{
          fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
          fontWeight,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="white"
              style={{
                fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
                fontWeight,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {content}
            </text>
          </mask>
        </defs>

        {/* Background SVG with proper scaling */}
        <g mask={`url(#${maskId})`}>
          <foreignObject
            width="100%"
            height="100%"
            style={{
              overflow: 'visible',
            }}
          >
            <div
              style={{
                width: `${textDimensions.width}px`,
                height: `${textDimensions.height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '400px',
                  height: '200px',
                  transform: `scale(${Math.max(textDimensions.width / 400, textDimensions.height / 200)})`,
                  transformOrigin: 'center',
                }}
              >
                {svg}
              </div>
            </div>
          </foreignObject>
        </g>
      </svg>

      {/* Screen reader text */}
      <span className="sr-only">{content}</span>
    </Component>
  );
}

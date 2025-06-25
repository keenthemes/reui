import { SvgText } from '@/registry/default/ui/svg-text';

const LiquidSvg = () => (
  <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f640" />
        <stop offset="50%" stopColor="#1e40af80" />
        <stop offset="100%" stopColor="#3b82f660" />
      </linearGradient>
      <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e40af30" />
        <stop offset="50%" stopColor="#3b82f650" />
        <stop offset="100%" stopColor="#1e40af40" />
      </linearGradient>
    </defs>

    {/* Background liquid */}
    <rect width="100%" height="100%" fill="url(#liquidGradient)" />

    {/* Animated wave layer 1 */}
    <path fill="url(#waveGradient1)" opacity="0.6">
      <animate
        attributeName="d"
        dur="3s"
        repeatCount="indefinite"
        values="M0,100 Q100,80 200,100 T400,100 L400,200 L0,200 Z;
                M0,100 Q100,120 200,100 T400,100 L400,200 L0,200 Z;
                M0,100 Q100,80 200,100 T400,100 L400,200 L0,200 Z"
      />
    </path>

    {/* Animated wave layer 2 */}
    <path fill="url(#waveGradient2)" opacity="0.4">
      <animate
        attributeName="d"
        dur="4s"
        repeatCount="indefinite"
        values="M0,120 Q150,100 300,120 T600,120 L600,200 L0,200 Z;
                M0,120 Q150,140 300,120 T600,120 L600,200 L0,200 Z;
                M0,120 Q150,100 300,120 T600,120 L600,200 L0,200 Z"
      />
    </path>

    {/* Surface waves */}
    <path fill="url(#waveGradient1)" opacity="0.3">
      <animate
        attributeName="d"
        dur="2s"
        repeatCount="indefinite"
        values="M0,90 Q200,70 400,90 L400,110 Q200,130 0,110 Z;
                M0,90 Q200,110 400,90 L400,110 Q200,90 0,110 Z;
                M0,90 Q200,70 400,90 L400,110 Q200,130 0,110 Z"
      />
    </path>

    {/* Floating bubbles */}
    <circle r="3" fill="#ffffff40">
      <animateMotion dur="6s" repeatCount="indefinite" path="M50,150 Q200,50 350,150 Q200,100 50,150" />
    </circle>
    <circle r="2" fill="#ffffff30">
      <animateMotion dur="8s" repeatCount="indefinite" path="M100,170 Q250,70 400,170 Q250,120 100,170" />
    </circle>
    <circle r="4" fill="#ffffff20">
      <animateMotion dur="5s" repeatCount="indefinite" path="M150,160 Q300,60 450,160 Q300,110 150,160" />
    </circle>
    <circle r="1.5" fill="#ffffff50">
      <animateMotion dur="7s" repeatCount="indefinite" path="M80,140 Q220,80 360,140 Q220,90 80,140" />
    </circle>
  </svg>
);

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <SvgText svg={<LiquidSvg />} fontSize="12rem" fontWeight="900">
        REUI
      </SvgText>
    </div>
  );
}

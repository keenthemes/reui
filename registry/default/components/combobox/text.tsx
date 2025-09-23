'use client';

import { useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Card } from '@/registry/default/ui/card';
import { Slider } from '@/registry/default/ui/slider';

const tiers = [
  { name: 'Lite', value: 0, points: 0 },
  { name: 'Plus', value: 1, points: 1000 },
  { name: 'Prime', value: 2, points: 2500 },
  { name: 'Gold', value: 3, points: 4000 },
  { name: 'VIP', value: 4, points: 5000 },
];

const tierIcons = {
  Lite: '🌟',
  Plus: '⭐',
  Prime: '💎',
  Gold: '🏆',
  VIP: '👑',
};

export default function LoyaltyTierSlider() {
  const [currentTier, setCurrentTier] = useState(3); // Gold tier
  const currentPoints = 4250;
  const nextTierPoints = tiers[Math.min(currentTier + 1, tiers.length - 1)]?.points || 5000;
  const progressPercentage = Math.round((currentPoints / nextTierPoints) * 100);

  const handleSliderChange = (value: number[]) => {
    setCurrentTier(value[0]);
  };

  return (
    <div className="w-[600px]">
      <Card className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Loyalty Tier</h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tierIcons[tiers[currentTier].name as keyof typeof tierIcons]}</span>
              <div>
                <span className="text-3xl font-bold">{tiers[currentTier].name}</span>
                <span className="text-lg text-muted-foreground ml-2">Level {currentTier + 1}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="px-6 bg-transparent">
            Review
          </Button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            {/* Custom gradient track background with glow effect */}
            <div
              className="absolute inset-0 h-3 rounded-full opacity-20 shadow-lg"
              style={{
                background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6, #14b8a6, #eab308, #ef4444)',
              }}
            ></div>

            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 h-3 rounded-full opacity-30 animate-pulse"
              style={{
                background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6, #14b8a6, #eab308, #ef4444)',
              }}
            ></div>

            <Slider
              value={[currentTier]}
              onValueChange={handleSliderChange}
              max={tiers.length - 1}
              min={0}
              step={1}
              className="w-full relative z-10 [&>span[role=slider]]:h-14 [&>span[role=slider]]:w-14 [&>span[role=slider]]:bg-gradient-to-br [&>span[role=slider]]:from-yellow-400 [&>span[role=slider]]:to-red-500 [&>span[role=slider]]:border-4 [&>span[role=slider]]:border-white [&>span[role=slider]]:shadow-2xl [&>span[role=slider]]:shadow-yellow-500/40 [&>span[role=slider]]:transition-all [&>span[role=slider]]:duration-300 [&>span[role=slider]]:ease-out hover:[&>span[role=slider]]:scale-110 hover:[&>span[role=slider]]:shadow-3xl hover:[&>span[role=slider]]:shadow-yellow-500/60 [&>span[role=slider]]:cursor-grab active:[&>span[role=slider]]:cursor-grabbing active:[&>span[role=slider]]:scale-105 [&>span[role=slider]]:rounded-full [&>span[role=slider]]:relative [&>span[role=slider]]:before:content-[''] [&>span[role=slider]]:before:absolute [&>span[role=slider]]:before:inset-3 [&>span[role=slider]]:before:bg-white [&>span[role=slider]]:before:rounded-full [&>span[role=slider]]:before:opacity-90 [&>span[role=slider]]:before:shadow-inner [&>span[role=slider]]:after:content-[''] [&>span[role=slider]]:after:absolute [&>span[role=slider]]:after:inset-4 [&>span[role=slider]]:after:bg-gradient-to-br [&>span[role=slider]]:after:from-yellow-300 [&>span[role=slider]]:after:to-orange-300 [&>span[role=slider]]:after:rounded-full [&>span[role=slider]]:after:opacity-80 [&>[data-orientation=horizontal]]:h-3 [&>[data-orientation=horizontal]]:rounded-full [&>[data-orientation=horizontal]]:shadow-inner"
              style={
                {
                  '--slider-track': 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6, #14b8a6, #eab308, #ef4444)',
                } as React.CSSProperties
              }
            />

            {/* Progress indicator showing current position with glow */}
            <div
              className="absolute top-0 h-3 rounded-full opacity-70 shadow-lg"
              style={{
                width: `${(currentTier / (tiers.length - 1)) * 100}%`,
                background: 'linear-gradient(to right, #ec4899, #a855f7, #3b82f6, #14b8a6, #eab308, #ef4444)',
              }}
            ></div>

            {/* Tier markers */}
            <div className="absolute top-0 h-3 w-full flex justify-between">
              {tiers.map((_, index) => (
                <div
                  key={index}
                  className="w-0.5 h-full bg-white/60 rounded-full"
                  style={{ marginLeft: index === 0 ? '0' : '-1px' }}
                ></div>
              ))}
            </div>

            {/* Bullet handle indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-yellow-400 transition-all duration-300 ease-out"
              style={{
                left: `calc(${(currentTier / (tiers.length - 1)) * 100}% - 6px)`,
                transform: 'translateY(-50%)',
              }}
            ></div>
          </div>

          {/* Tier Labels */}
          <div className="flex justify-between text-sm font-medium relative">
            {tiers.map((tier, index) => (
              <div key={tier.name} className="flex flex-col items-center">
                <span
                  className={`transition-all duration-300 ${
                    index === currentTier
                      ? 'text-foreground font-bold text-base scale-110'
                      : 'text-muted-foreground hover:text-foreground/80'
                  }`}
                >
                  {tier.name}
                </span>
                {/* Visual indicator for current tier */}
                {index === currentTier && (
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mt-1 shadow-lg"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-6">
          {/* Current Points */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Current Points</h3>
                <p className="text-sm text-muted-foreground">Earned through actions</p>
              </div>
            </div>
            <span className="text-2xl font-bold">{currentPoints.toLocaleString()}</span>
          </div>

          {/* Next Tier Goal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Next Tier Goal</h3>
                <p className="text-sm text-muted-foreground">Path to unlock next benefits</p>
              </div>
            </div>
            <span className="text-xl font-bold">
              <span className="text-muted-foreground">{currentPoints.toLocaleString()}</span>
              <span className="mx-1">/</span>
              <span>{nextTierPoints.toLocaleString()}</span>
            </span>
          </div>

          {/* Progress Percentage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 12l3 3 7-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Progress Percentage</h3>
                <p className="text-sm text-muted-foreground">Tier growth vs last month</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">↗ 4%</span>
              <span className="text-2xl font-bold">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

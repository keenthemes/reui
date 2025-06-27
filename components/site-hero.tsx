import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { Zap } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { Icons } from '@/components/icons';
import { MovingLabel } from '@/components/moving-border';

export default function SiteHero() {
  const brands = [
    {
      title: 'Tailwind 4',
      logo: Icons.tailwind,
      tooltip: '',
    },
    {
      title: 'React 19',
      logo: Icons.react,
      tooltip: '',
    },
    {
      title: 'Next.js 15.3',
      logo: Icons.nextjs,
      tooltip: '',
    },
    {
      title: 'Radix UI',
      logo: Icons.radixui,
      tooltip: '',
      className: 'h-full w-full ms-1',
    },
    {
      title: 'shadcn/ui',
      logo: Icons.shadcn,
      tooltip: '',
    },
    {
      title: 'Motion',
      logo: Icons.motion,
      tooltip: '',
      className: 'size-10 -mt-2',
    },
  ];

  const handleGetStartedClick = () => {
    trackEvent({
      name: 'site_hero_get_started_link_click',
      properties: {
        category: 'conversion',
        label: 'Hero Get Started Click',
        destination: '/docs/installation',
      },
    });
  };

  const handleBrandClick = (brand: string) => {
    trackEvent({
      name: `site_hero_brand_${brand.toLowerCase().replace(/\./g, '')}_click`,
      properties: {
        category: 'engagement',
        label: `Hero Brand ${brand} Click`,
        brand,
      },
    });
  };

  const handleMovingLabelClick = () => {
    trackEvent({
      name: 'site_hero_weekly_releases_label_click',
      properties: {
        category: 'engagement',
        label: 'Hero Weekly Releases Label Click',
      },
    });
  };

  return (
    <div className="container">
      <div className="flex items-center justify-center py-10 lg:py-2 lg:h-[500px] mb-5">
        <div className="flex items-center flex-col justify-between gap-6">
          <MovingLabel
            borderRadius="1.75rem"
            duration={3500}
            className="bg-card border border-mono/15 text-foreground inline-flex items-center gap-2.5 cursor-pointer"
            containerClassName="w-[245px]"
            onClick={handleMovingLabelClick}
          >
            Weekly new feature releases
            <Zap className="size-4 text-muted-foreground" />
          </MovingLabel>

          <h1 className="text-2xl lg:text-[48px] font-bold text-center">UI Library for React</h1>

          <div className="text-center text-l max-w-2xl">
            Open-source collection of UI components and animated effects built with <strong>React</strong>,{' '}
            <strong>Typescript</strong>, <strong>Tailwind CSS</strong>, and <strong>Motion</strong>. Pairs beautifully
            with <strong>shadcn/ui</strong>.
          </div>

          <div className="flex items-center gap-3.5 mb-4">
            <Button asChild variant="mono" size="lg" className="text-nowrap px-4 rounded-lg gap-1.5">
              <Link href="/docs/installation" onClick={handleGetStartedClick}>
                Get Started <span className="opacity-70">- It&apos;s free</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 -ms-3">
            {brands.map((brand, index) => (
              <div key={index} className="flex flex-col items-center" onClick={() => handleBrandClick(brand.title)}>
                <Tooltip>
                  <TooltipTrigger className="size-6">
                    {brand.logo({
                      className: 'opacity-70' + (brand.className ? ` ${brand.className}` : 'w-full h-full'),
                    })}
                  </TooltipTrigger>
                  <TooltipContent>{brand.title}</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

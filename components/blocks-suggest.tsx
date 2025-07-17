import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import { Lightbulb } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function BlocksSuggestion() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 lg:py-12">
      <p className="text-base font-semibold">Didn&apos;t find what you were looking for?</p>
      <Button variant="mono" className="group hidden md:inline-flex" asChild>
        <Link href={siteConfig.links.suggestions} target="_blank" rel="noopener noreferrer">
          <Lightbulb className="group-hover:scale-120 transition-transform duration-300" />
          <span>Suggest block</span>
        </Link>
      </Button>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import { Lightbulb } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function BlocksSuggestion() {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-8 lg:py-12">
      <p className="text-base font-semibold">
        Didn&apos;t find what you were looking for?
      </p>
      <Button variant="mono" className="group hidden md:inline-flex" asChild>
        <Link href={siteConfig.links.suggestions}>
          <Lightbulb className="group-hover:scale-110 transition-transform duration-300 group-hover:text-yellow-600" />
          <span>Suggest block</span>
        </Link>
      </Button>
    </div>
  );
}

import { siteConfig } from '@/config/site';
import { Button } from '@/registry/default/ui/button';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function BlocksSuggestion() {
  return (
    <Button variant="outline" className="group hidden md:inline-flex" asChild>
      <Link href={siteConfig.links.suggestions}>
        <Lightbulb className="group-hover:scale-110 transition-transform duration-300 group-hover:text-yellow-600" />
        <span>Suggest block</span>
      </Link>
    </Button>
  );
}

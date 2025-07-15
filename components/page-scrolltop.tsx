import { Button } from '@/registry/default/ui/button';
import { ArrowUp } from 'lucide-react';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useIsMobile } from '@/hooks/use-mobile';

export function PageScrollTop() {
  const isMobile = useIsMobile();
  const scrollPosition = useScrollPosition();

  return (
    (!isMobile && scrollPosition > 1000) && (
      <div className="fixed z-10 bottom-10 end-1 2xl:end-5">
        <Button variant="outline" className="group/scrolltop" mode="icon" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp className="group-hover/scrolltop:-translate-y-0.5 transition-transform duration-300" />
        </Button> 
      </div>
    )
  );
}

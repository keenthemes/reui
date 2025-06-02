import { Button } from '@/registry/default/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/tooltip';
import { Info } from 'lucide-react';

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <Info className="h-4 w-4" />
            Light tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="light">
          <p>Get detailed information about this feature.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

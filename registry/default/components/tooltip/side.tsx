import { Button } from '@/registry/default/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/registry/default/ui/tooltip';
import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react';

export default function TooltipDemo() {
  return (
    <div className="flex items-center justify-center gap-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MoveLeft />
              Left
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MoveUp />
              Top
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MoveRight />
              Right
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MoveDown />
              Bottom
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

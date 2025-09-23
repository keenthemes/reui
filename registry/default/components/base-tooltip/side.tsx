import { Button } from '@/registry/default/ui/base-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/registry/default/ui/base-tooltip';
import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react';

export default function BaseTooltipDemo() {
  return (
    <div className="flex items-center justify-center gap-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <MoveLeft />
            Left
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <MoveUp />
            Top
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <MoveRight />
            Right
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            <MoveDown />
            Bottom
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Get detailed information about this feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/base-popover';
import { Button } from '@/registry/default/ui/button';
import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react';

export default function BasePopoverDemo() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <MoveLeft />
          Left
        </PopoverTrigger>
        <PopoverContent className="max-w-[250px] text-sm space-y-2" side="left">
          <p className="font-medium">Left Position</p>
          <p className="text-muted-foreground">This popover appears on the left side of the trigger button.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <MoveUp />
          Top
        </PopoverTrigger>
        <PopoverContent className="max-w-[250px] text-sm space-y-2" side="top">
          <p className="font-medium">Top Position</p>
          <p className="text-muted-foreground">This popover appears above the trigger button.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <MoveRight />
          Right
        </PopoverTrigger>
        <PopoverContent className="max-w-[250px] text-sm space-y-2" side="right">
          <p className="font-medium">Right Position</p>
          <p className="text-muted-foreground">This popover appears on the right side of the trigger button.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          <MoveDown />
          Bottom
        </PopoverTrigger>
        <PopoverContent className="max-w-[250px] text-sm space-y-2" side="bottom">
          <p className="font-medium">Bottom Position</p>
          <p className="text-muted-foreground">This popover appears below the trigger button.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

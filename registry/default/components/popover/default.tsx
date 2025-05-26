import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/default/ui/popover';

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Show Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[300px] text-sm space-y-2" side="top">
        {/* Title */}
        <p className="font-medium">Premium Plan</p>

        {/* Description */}
        <p className="text-muted-foreground">
          Advanced analytics provides deeper insights into your data, including
          trends, predictions, and detailed user behavior.
        </p>

        {/* Additional Note */}
        <p className="flex items-center space-x-1">
          <Badge variant="destructive" size="sm">
            Note!
          </Badge>
          <span className="text-xs text-muted-foreground">
            Plan upgrade is required.
          </span>
        </p>
      </PopoverContent>
    </Popover>
  );
}

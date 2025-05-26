import { Avatar, AvatarFallback } from '@/registry/default/ui/avatar';
import { User } from 'lucide-react';

export default function AvatarDemo() {
  return (
    <div className="flex gap-6">
      <Avatar>
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-destructive bg-destructive/10">
          AJ
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="text-primary bg-primary/10">
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

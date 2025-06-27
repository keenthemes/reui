import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator } from '@/registry/default/ui/avatar';
import { Badge } from '@/registry/default/ui/badge';

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Avatar>
        <AvatarImage className="rounded-lg" src="/media/avatars/14.png" alt="@reui" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-2 -top-2">
          <Badge variant="primary" size="xs" shape="circle" className="border border-background">
            6
          </Badge>
        </AvatarIndicator>
      </Avatar>

      <Avatar>
        <AvatarImage className="rounded-lg" src="/media/avatars/14.png" alt="@reui" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-2 -bottom-2">
          <Badge variant="destructive" size="xs" shape="circle" className="border border-background">
            3
          </Badge>
        </AvatarIndicator>
      </Avatar>
    </div>
  );
}

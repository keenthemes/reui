import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator, AvatarStatus } from '@/registry/default/ui/avatar';

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Avatar>
        <AvatarImage src="/media/avatars/14.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -top-1.5">
          <AvatarStatus variant="online" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/14.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -top-1.5">
          <AvatarStatus variant="offline" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/14.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -bottom-1.5">
          <AvatarStatus variant="busy" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/14.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1.5 -bottom-1.5">
          <AvatarStatus variant="away" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
    </div>
  );
}

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/registry/default/ui/avatar';

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar className="size-6">
        <AvatarImage src="/media/avatars/2.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-2 -top-2">
          <AvatarStatus variant="online" className="size-2" />
        </AvatarIndicator>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="/media/avatars/2.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-2 -top-2">
          <AvatarStatus variant="online" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
      <Avatar className="size-10">
        <AvatarImage src="/media/avatars/2.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-2 -top-2">
          <AvatarStatus variant="online" className="size-2.5" />
        </AvatarIndicator>
      </Avatar>
      <Avatar className="size-14">
        <AvatarImage src="/media/avatars/2.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-1 -top-1">
          <AvatarStatus variant="online" className="size-3" />
        </AvatarIndicator>
      </Avatar>
      <Avatar className="size-20">
        <AvatarImage src="/media/avatars/2.png" alt="@crudhunt" />
        <AvatarFallback>CH</AvatarFallback>
        <AvatarIndicator className="-end-px -top-px">
          <AvatarStatus variant="online" className="size-3" />
        </AvatarIndicator>
      </Avatar>
    </div>
  );
}

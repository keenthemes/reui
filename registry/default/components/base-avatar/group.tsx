import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/base-avatar';
import { Button } from '@/registry/default/ui/button';

export default function AvatarDemo() {
  return (
    <div className="flex -space-x-2">
      <Avatar>
        <AvatarImage src="/media/avatars/2.png" alt="@reui" className="border-2 border-background hover:z-10" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/4.png" alt="@reui" className="border-2 border-background hover:z-10" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/16.png" alt="@reui" className="border-2 border-background hover:z-10" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/media/avatars/8.png" alt="@reui" className="border-2 border-background hover:z-10" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <Button
        variant="secondary"
        mode="icon"
        shape="circle"
        className="relative size-10 border-2 border-background hover:z-10"
      >
        +7
      </Button>
    </div>
  );
}

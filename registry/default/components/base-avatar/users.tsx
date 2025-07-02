import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/base-avatar';

export default function AvatarDemo() {
  return (
    <div className="flex items-center rounded-full p-0.5 gap-1.5 border border-border shadow-sm shadow-black/5">
      <div className="flex -space-x-1">
        <Avatar className="size-7">
          <AvatarImage src="/media/avatars/2.png" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="/media/avatars/4.png" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="/media/avatars/6.png" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="/media/avatars/8.png" alt="@reui" className="border-2 border-background hover:z-10" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
      </div>

      <p className="text-xs text-muted-foreground me-1.5">
        Trusted by <span className="font-semibold text-foreground">100K+</span> useers.
      </p>
    </div>
  );
}

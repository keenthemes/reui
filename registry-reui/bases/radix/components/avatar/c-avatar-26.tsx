import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"

export default function Pattern() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full gap-1 pl-0.5"
    >
      <Avatar className="border-background size-6 border-2">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <span className="text-xs">@shadcn</span>
    </Button>
  )
}

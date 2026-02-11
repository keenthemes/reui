// Description: Avatar social proof with text label
// Order: 20

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="border-border style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full flex items-center gap-1.5 border p-1 shadow-sm shadow-black/5">
      <AvatarGroup>
        <Avatar className="size-7">
          <AvatarImage
            src="https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80"
            alt="Liam Thompson"
          />
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage
            src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80"
            alt="Nick Johnson"
          />
          <AvatarFallback>NJ</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage
            src="https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80"
            alt="Maria Garcia"
          />
          <AvatarFallback>MG</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
      </AvatarGroup>

      <p className="text-muted-foreground me-1.5 text-xs">
        Trusted by <span className="text-foreground font-semibold">100K+</span>{" "}
        users.
      </p>
    </div>
  )
}

// Description: 4:3 standard aspect ratio
// Order: 2

import Image from "next/image"

import { AspectRatio } from "@/registry/bases/base/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={4 / 3}
        className="bg-muted style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=2"
          alt="4:3"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  )
}

// Description: 3:2 classic photography aspect ratio
// Order: 6

import Image from "next/image"

import { AspectRatio } from "@/registry/bases/base/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={3 / 2}
        className="bg-muted style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=6"
          alt="3:2"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  )
}

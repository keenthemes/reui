// Description: 4:5 social media portrait aspect ratio
// Order: 7

import Image from "next/image"

import { AspectRatio } from "@/registry/bases/base/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={4 / 5}
        className="bg-muted style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=7"
          alt="4:5"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  )
}

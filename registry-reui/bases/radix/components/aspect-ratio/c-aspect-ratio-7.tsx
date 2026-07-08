import { AspectRatio } from "@/registry/bases/radix/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={4 / 5}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="https://picsum.photos/1000/800?grayscale&random=7"
          alt="4:5"
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

import { TextReveal } from "@/registry/default/ui/text-reveal"

export default function Component() {
  return (
    <TextReveal 
      variant="blur" 
      className="text-xl font-bold text-foreground"
    >
      Blur Animation
    </TextReveal>
  )
} 
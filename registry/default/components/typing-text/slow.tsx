import { TypingText } from "@/registry/default/ui/typing-text"

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <TypingText 
        text="Slow and steady typing..." 
        className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        speed={300}
        delay={400}
        showCursor={true}
        cursor="●"
        cursorClassName="text-purple-500"
      />
    </div>
  )
} 
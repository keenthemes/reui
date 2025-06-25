import { TypingText } from '@/registry/default/ui/typing-text';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <TypingText
        text="Hello, I'm a typing text animation!"
        className="text-2xl font-semibold"
        speed={80}
        showCursor={true}
        cursorClassName=""
      />
    </div>
  );
}

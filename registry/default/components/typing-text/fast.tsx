import { TypingText } from '@/registry/default/ui/typing-text';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <TypingText
        text="⚡ Lightning fast typing animation!"
        className="text-xl font-mono"
        speed={30}
        showCursor={true}
        cursor="▌"
        cursorClassName="text-yellow-500"
      />
    </div>
  );
}

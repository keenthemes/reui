import { TypingText } from '@/registry/default/ui/typing-text';

export default function Component() {
  return (
    <div className="grow flex items-center justify-start">
      <TypingText
        text="Creating beautiful interfaces with smooth animations"
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        cursor="|"
        cursorClassName="text-base text-muted-foreground"
        speed={80}
      />
    </div>
  );
}

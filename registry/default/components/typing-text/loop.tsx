import { TypingText } from '@/registry/default/ui/typing-text';

export default function Component() {
  return (
    <div className="flex items-center justify-start">
      <TypingText
        texts={['Build stunning UIs', 'Create smooth animations', 'Design with purpose', 'Code with passion']}
        className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent"
        cursor="_"
        cursorClassName="text-muted-foreground"
        speed={100}
        loop
        pauseDuration={1500}
      />
    </div>
  );
}

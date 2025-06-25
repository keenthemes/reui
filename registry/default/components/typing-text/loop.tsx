import { TypingText } from '@/registry/default/ui/typing-text';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      <TypingText
        texts={[
          'Welcome to our platform',
          'Build amazing projects',
          'Create beautiful designs',
          'Ship faster than ever',
        ]}
        className="text-2xl font-semibold"
        speed={100}
        loop={true}
        pauseDuration={1500}
        showCursor={true}
        cursor="_"
        cursorClassName="font-bold"
      />
    </div>
  );
}

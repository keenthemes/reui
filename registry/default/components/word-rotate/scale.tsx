import { WordRotate } from '@/registry/default/ui/word-rotate';

export default function Component() {
  return (
    <div className="">
      <WordRotate
        words={['Beautiful', 'Performant', 'Animated', 'Customizable', 'Accessible']}
        animationStyle="scale"
        className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        duration={1200}
        pauseDuration={500}
        loop={true}
      />
    </div>
  );
}

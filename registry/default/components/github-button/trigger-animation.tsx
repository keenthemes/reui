import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="w-80">
      <GithubButton autoAnimate={false} targetStars={999} onClick={() => console.log('Manual animation triggered!')} />
    </div>
  );
}

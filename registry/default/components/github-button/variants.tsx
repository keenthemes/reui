import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="flex gap-4 flex-wrap">
      <GithubButton variant="default" targetStars={1200} />
      <GithubButton variant="secondary" targetStars={850} />
      <GithubButton variant="ghost" targetStars={3400} />
    </div>
  );
}

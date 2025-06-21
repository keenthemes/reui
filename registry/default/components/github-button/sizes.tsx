import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <GithubButton size="sm" targetStars={500} />
      <GithubButton size="default" targetStars={1000} />
      <GithubButton size="lg" targetStars={1500} />
    </div>
  );
}

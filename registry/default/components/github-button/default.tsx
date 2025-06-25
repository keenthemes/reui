import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="space-y-4">
      <GithubButton targetStars={1501} label="Star on GitHub" repoUrl="https://github.com/keenthemes/reui" />
    </div>
  );
}

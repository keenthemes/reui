import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <GithubButton targetStars={1501} label="Small" size="sm" repoUrl="https://github.com/keenthemes/reui" />
      <GithubButton targetStars={1501} label="Medium" repoUrl="https://github.com/keenthemes/reui" />
      <GithubButton targetStars={1501} label="Large" size="lg" repoUrl="https://github.com/keenthemes/reui" />
    </div>
  );
}

import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="w-80">
      <GithubButton
        initialStars={0}
        targetStars={2500}
        animationDuration={3}
        animationDelay={0.5}
        starColor="#fbbf24"
        repoUrl="https://github.com/keenthemes/reui"
      />
    </div>
  );
}

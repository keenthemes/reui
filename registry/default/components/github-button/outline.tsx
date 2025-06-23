import { GithubButton } from '@/registry/default/ui/github-button';

export default function Component() {
  return (
    <div className="flex gap-4 flex-wrap">
      <GithubButton
        initialStars={8889}
        targetStars={80890}
        label="Github Stars"
        roundStars={true}
        repoUrl="https://github.com/keenthemes/reui"
        variant="outline"
      />
    </div>
  );
}

import { useConfig } from "@/hooks/use-config";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/registry/default/ui/button";
import { Check } from "lucide-react";

export function CliCodeCopyButton({ name }: { name: string } & React.ComponentProps<typeof Button>) {
  const { copy, copied } = useCopyToClipboard();
  const [config] = useConfig();
  const packageManager = config.packageManager || 'pnpm';
  const commands = {
    pnpm: `pnpm dlx shadcn@latest add https://reui.io/r/${name}.json`,
    npm: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    yarn: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    bun: `bunx --bun shadcn@latest add https://reui.io/r/${name}.json`,
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7.5 text-muted-foreground w-36 justify-start"
      title="Copy CLI command"
      onClick={() => {
        copy(commands[packageManager]);
      }}
    >
      {copied ? <Check className="text-secondary-foreground" /> : '>_'}
      <span className="truncate">{commands[packageManager]}</span>
    </Button>
  );
}
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';
import { useConfig } from '@/hooks/use-config';
import CliCopyButton from '@/components/cli-copy-button';

export default function CliCommands({ name }: { name: string }) {
  const [config, setConfig] = useConfig();
  const packageManager = config.packageManager || 'pnpm';

  const commands = {
    pnpm: `pnpm dlx shadcn@latest add https://reui.io/r/${name}.json`,
    npm: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    yarn: `npx shadcn@latest add https://reui.io/r/${name}.json`,
    bun: `bunx --bun shadcn@latest add https://reui.io/r/${name}.json`,
  };

  return (
    <div className="relative">
      <Tabs
        value={packageManager}
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as 'pnpm' | 'npm' | 'yarn' | 'bun',
          });
        }}
        className="rounded-lg bg-zinc-950 dark:bg-zinc-900"
      >
        <TabsList className="dark h-auto w-full justify-start rounded-none border-b bg-transparent px-4 py-0 gap-3.5">
          <TabsTrigger
            className="data-[state=active]:after:bg-zinc-200 relative rounded-none py-3 px-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="pnpm"
          >
            pnpm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-zinc-200 relative rounded-none py-3 px-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="npm"
          >
            npm
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-zinc-200 relative rounded-none py-3 px-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="yarn"
          >
            yarn
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:after:bg-zinc-200 relative rounded-none py-3 px-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="bun"
          >
            bun
          </TabsTrigger>
        </TabsList>
        {Object.entries(commands).map(([pkg, command]) => (
          <TabsContent className="m-0" key={pkg} value={pkg}>
            <pre className="overflow-auto p-4 font-mono text-[13px] text-zinc-100">
              {command}
            </pre>
          </TabsContent>
        ))}
      </Tabs>
      <CliCopyButton
        componentSource={commands[packageManager as keyof typeof commands]}
        className="top-1"
      />
    </div>
  );
}

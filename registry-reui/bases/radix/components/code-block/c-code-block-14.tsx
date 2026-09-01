"use client"

import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/registry-reui/bases/radix/reui/code-block/code-block"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/radix/reui/frame"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"

const samples = [
  {
    file: "greeting.tsx",
    language: "tsx",
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>
}`,
  },
  {
    file: "greeting.py",
    language: "python",
    code: `def greeting(name: str) -> str:
    return f"Hello {name}"`,
  },
  {
    file: "greeting.sql",
    language: "sql",
    code: `select id, email
from users
where created_at > now() - interval '7 days';`,
  },
  {
    file: "greeting.sh",
    language: "bash",
    code: `curl -s https://api.example.com/v1/users \\
  -H "Authorization: Bearer $TOKEN"`,
  },
]

/*
 * One grammar chunk loads per selected language, so switching files is also a
 * lazy-loading demo.
 *
 * A dense frame is what makes this read as one editor: the panel meets the
 * header with no gap or inset, and the ghost block inside contributes no
 * second border. The tabs live in the header, so the blocks stay headerless
 * and the copy button pins itself over the code.
 */
export default function Pattern() {
  return (
    <Tabs defaultValue={samples[0].file} className="w-full max-w-2xl">
      <Frame dense spacing="sm">
        <FrameHeader className="flex-row items-center gap-2">
          <FrameTitle>Examples</FrameTitle>
          <TabsList className="ml-auto bg-transparent">
            {samples.map((sample) => (
              <TabsTrigger key={sample.file} value={sample.file}>
                {sample.file}
              </TabsTrigger>
            ))}
          </TabsList>
        </FrameHeader>

        <FramePanel className="p-0!">
          {samples.map((sample) => (
            <TabsContent key={sample.file} value={sample.file}>
              <CodeBlock
                code={sample.code}
                language={sample.language}
                variant="ghost"
                showLineNumbers
              >
                <CodeBlockCopyButton
                  variant="outline"
                  size="icon-xs"
                  className="bg-card hover:bg-muted"
                />
              </CodeBlock>
            </TabsContent>
          ))}
        </FramePanel>
      </Frame>
    </Tabs>
  )
}

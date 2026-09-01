"use client"

import { useEffect, useState } from "react"
import {
  CodeBlock,
  CodeBlockCopyButton,
  markdownFences,
} from "@/registry-reui/bases/base/reui/code-block/code-block"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"

const reply = `Use the streaming helper, then render it:

\`\`\`tsx
const { messages } = useChat({ api: "/api/chat" })
\`\`\`

That keeps the transcript in sync.`

/*
 * `markdownFences` flags a fence whose closing delimiter has not arrived as
 * `open`, which is what lets the transcript render the partial block mid
 * stream instead of dropping it until the closer lands.
 */
export default function Pattern() {
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (length >= reply.length) return
    const id = window.setTimeout(() => setLength((value) => value + 4), 30)
    return () => window.clearTimeout(id)
  }, [length])

  const streamed = reply.slice(0, length)
  const streaming = length < reply.length

  return (
    <Frame dense className="w-full max-w-2xl">
      <FrameHeader>
        <FrameTitle>Assistant</FrameTitle>
        <FrameDescription>
          Generated responses may contain mistakes.
        </FrameDescription>
      </FrameHeader>

      <FramePanel className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Avatar className="size-7 shrink-0 rounded-full">
            <AvatarImage
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
              alt="Mira Stone"
            />
            <AvatarFallback className="text-[10px] font-medium">
              MS
            </AvatarFallback>
          </Avatar>
          <p className="pt-1 text-sm">How do I stream chat messages?</p>
        </div>

        <div className="flex gap-3">
          <Avatar className="size-7 shrink-0 rounded-full">
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
            {markdownFences(streamed).map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="text-sm whitespace-pre-wrap">
                  {part.content}
                </p>
              ) : (
                <CodeBlock
                  key={index}
                  code={part.content}
                  language={part.language}
                  streaming={streaming && part.open}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              )
            )}
          </div>
        </div>
      </FramePanel>
    </Frame>
  )
}

"use client"

import * as React from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import { cn } from "cn"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/base/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type Source = { id: number; title: string; domain: string; href: string }

const QUERIES = [
  { query: "localStorage session token xss risk", results: 8 },
  { query: "httponly cookie spa refresh token", results: 6 },
]

const SOURCES: Source[] = [
  {
    id: 1,
    title: "Session management cheat sheet",
    domain: "owasp.org",
    href: "#",
  },
  {
    id: 2,
    title: "Window: localStorage property",
    domain: "developer.mozilla.org",
    href: "#",
  },
  {
    id: 3,
    title: "Set-Cookie header",
    domain: "developer.mozilla.org",
    href: "#",
  },
  {
    id: 4,
    title: "OAuth 2.0 for browser-based apps",
    domain: "datatracker.ietf.org",
    href: "#",
  },
]

// A citation opens the sources and moves focus to the row it cites.
export default function Pattern() {
  const [sourcesOpen, setSourcesOpen] = React.useState(false)
  const [cited, setCited] = React.useState<number | null>(null)
  const linkRefs = React.useRef(new Map<number, HTMLAnchorElement>())

  // The panel mounts its rows only once it is open, so focus waits a frame.
  function showSource(id: number) {
    setSourcesOpen(true)
    setCited(id)
    window.requestAnimationFrame(() => linkRefs.current.get(id)?.focus())
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="Search01Icon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
              </TraceIcon>
              <TraceTitle>Searched the web {QUERIES.length} times</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {QUERIES.map((item) => (
                <TraceLine key={item.query}>
                  <TraceTitle>{item.query}</TraceTitle>
                  <TraceDescription>{item.results} results</TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="GlobeIcon"
                  tabler="IconWorld"
                  hugeicons="Globe02Icon"
                  phosphor="GlobeIcon"
                  remixicon="RiGlobalLine"
                />
              </TraceIcon>
              <TraceTitle>Read {SOURCES.length} sources</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {SOURCES.map((source) => (
                <a
                  key={source.id}
                  ref={(node) => {
                    if (node) linkRefs.current.set(source.id, node)
                    else linkRefs.current.delete(source.id)
                  }}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  onBlur={() => setCited(null)}
                >
                  <TraceLine>
                    <TraceTitle>
                      {/* The cited source keeps full contrast until focus
                          leaves it, so a mouse click shows where it landed. */}
                      <span
                        className={cn(cited === source.id && "text-foreground")}
                      >
                        {source.id}. {source.title}
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </TraceTitle>
                    <TraceDescription>{source.domain}</TraceDescription>
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="ArrowUpRightIcon"
                        tabler="IconArrowUpRight"
                        hugeicons="ArrowUpRight01Icon"
                        phosphor="ArrowUpRightIcon"
                        remixicon="RiArrowRightUpLine"
                      />
                    </TraceIcon>
                  </TraceLine>
                </a>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <p className="leading-relaxed text-pretty">
        No. Any XSS bug can read it
        <Cite id={1} onSelect={showSource} />
        <Cite id={2} onSelect={showSource} />. Use an HttpOnly cookie
        <Cite id={3} onSelect={showSource} /> and keep access tokens in memory
        <Cite id={4} onSelect={showSource} />.
      </p>
    </div>
  )
}

function Cite({
  id,
  onSelect,
}: {
  id: number
  onSelect: (id: number) => void
}) {
  const source = SOURCES.find((item) => item.id === id)
  return (
    <Badge
      render={<button type="button" />}
      variant="secondary"
      radius="full"
      aria-label={`Source ${id}: ${source?.title}`}
      onClick={() => onSelect(id)}
      className="ms-1 cursor-pointer align-middle"
    >
      {id}
    </Badge>
  )
}

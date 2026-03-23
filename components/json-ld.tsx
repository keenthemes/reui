import { stringifyJsonLd } from "@/lib/json-ld"

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <div
      hidden
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `<script type="application/ld+json">${stringifyJsonLd(data)}</script>`,
      }}
    />
  )
}

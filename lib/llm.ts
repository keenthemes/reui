import fs from "fs"
import path from "path"

import { getRegistryItemMetadata } from "@/lib/registry"

export function processMdxForLLMs(content: string) {
  if (!content || typeof content !== "string") {
    return content || ""
  }

  const tagRegex = /<(ComponentPreview|ComponentSource)\s+([^>]+)\/>/g

  return content.replace(tagRegex, (match, tag, attributes) => {
    try {
      const name = attributes.match(/name="([^"]+)"/)?.[1]
      const styleName =
        attributes.match(/styleName="([^"]+)"/)?.[1] || "base-nova"

      if (!name) return match

      const registryKey = styleName.startsWith("radix-") ? "radix" : "base"

      const item = getRegistryItemMetadata(name, registryKey)

      if (!item?.files?.length) {
        return match
      }

      const filePath = item.files[0].path
      const absolutePath = path.join(process.cwd(), filePath)

      if (!fs.existsSync(absolutePath)) {
        return match
      }

      let source = fs.readFileSync(absolutePath, "utf8")
      source = source.replaceAll(
        `@/registry-reui/bases/${registryKey}/`,
        "@/components/"
      )
      source = source.replaceAll("export default", "export")

      return `\`\`\`tsx
${source}
\`\`\``
    } catch (error) {
      console.error(`Error processing ${tag} for ${match}:`, error)
      return match
    }
  })
}

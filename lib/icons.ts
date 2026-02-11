import { iconLibraries, PRESETS, type IconLibraryName } from "@/registry/config"

export function getIconLibraryFromStyle(styleName: string): IconLibraryName {
  const preset = PRESETS.find(
    (p) => p.name === styleName || p.style === styleName
  )
  if (preset) return preset.iconLibrary

  if (styleName.includes("vega")) return "lucide"
  if (
    styleName.includes("nova") ||
    styleName.includes("maia") ||
    styleName.includes("mira")
  )
    return "hugeicons"
  if (styleName.includes("lyra")) return "hugeicons"
  return "lucide"
}

export function transformIcons(
  code: string,
  libraryName: IconLibraryName
): string {
  const library = iconLibraries[libraryName]
  if (!library) return code

  const iconPlaceholderRegex = /<IconPlaceholder\s+([^>]+)\/>/g
  const usedIcons = new Set<string>()
  const replacedIcons = new Set<string>()
  const iconPlaceholderImportRegex =
    /import\s+{\s*IconPlaceholder\s*}\s*from\s*["']@\/app\/\(create\)\/components\/icon-placeholder["'];?\n?/g

  let transformedCode = code.replace(iconPlaceholderRegex, (match, attrs) => {
    const attributes: Record<string, string> = {}
    const attrRegex = /([a-zA-Z0-9-]+)="([^"]+)"|([a-zA-Z0-9-]+)={([^}]+)}/gi
    let attrMatch
    let iconName = ""
    const currentReplacedIcons: string[] = []

    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const name = attrMatch[1] || attrMatch[3]
      const value = attrMatch[2] || attrMatch[4]

      if (name === libraryName) {
        iconName = value
      } else if (
        ["lucide", "tabler", "hugeicons", "phosphor", "remixicon"].includes(
          name
        )
      ) {
        currentReplacedIcons.push(value)
      } else {
        attributes[name] = value
      }
    }

    if (!iconName) return match

    usedIcons.add(iconName)
    currentReplacedIcons.forEach((icon) => replacedIcons.add(icon))

    const otherAttrs = Object.entries(attributes)
      .map(([name, value]) => `${name}="${value}"`)
      .join(" ")

    let usage = library.usage.replace(/ICON/g, iconName)
    if (otherAttrs) {
      if (usage.includes("/>")) {
        usage = usage.replace(/\/>/, ` ${otherAttrs} />`)
      } else if (usage.includes(">")) {
        usage = usage.replace(/>/, ` ${otherAttrs}>`)
      }
    }

    return usage
  })

  // Remove IconPlaceholder import
  transformedCode = transformedCode.replace(iconPlaceholderImportRegex, "")

  // Remove imports of replaced icons if they are no longer used
  if (replacedIcons.size > 0) {
    for (const icon of replacedIcons) {
      // Check if the icon is still used in the code (not as part of an import)
      // This is a simple check: look for the icon name not followed by " from" or in an import block
      const isUsed = new RegExp(
        `(?<!import\\s+\\{.*)\\b${icon}\\b(?!.*from\\s+['"])`,
        "s"
      ).test(transformedCode)

      if (!isUsed) {
        // Remove from named imports: { ..., Icon, ... } -> { ..., ... }
        // 1. { Icon } -> removed completely if it was the only one
        // 2. { Icon, Other } -> { Other }
        // 3. { Other, Icon } -> { Other }

        // This is tricky with regex, let's do a multi-step approach
        const importRegex = new RegExp(
          `import\\s+{[^}]*\\b${icon}\\b[^}]*}\\s+from\\s+['"][^'"]+['"];?\\n?`,
          "g"
        )
        transformedCode = transformedCode.replace(importRegex, (match) => {
          // Extract the part inside { }
          const namedMatch = match.match(/{([^}]+)}/)
          if (!namedMatch) return match

          const names = namedMatch[1]
            .split(",")
            .map((n) => n.trim())
            .filter((n) => n !== icon && n !== "")
          if (names.length === 0) {
            return "" // Remove whole line
          }
          return match.replace(namedMatch[1], ` ${names.join(", ")} `)
        })
      }
    }
  }

  if (usedIcons.size > 0) {
    const iconsArray = Array.from(usedIcons).sort()
    const iconsList = iconsArray.join(", ")

    // Use the import template from libraries.ts
    const importStatement = library.import.replace(/ICON/g, iconsList) + "\n"

    // Insert imports after the last existing import, or after "use client", or at the top
    const lastImportIndex = transformedCode.lastIndexOf("import ")
    const useClientIndex = transformedCode.indexOf('"use client"')
    const useClientSingleIndex = transformedCode.indexOf("'use client'")

    if (lastImportIndex !== -1) {
      // Find the end of the import statement (it might be multi-line)
      const searchSpace = transformedCode.slice(lastImportIndex)
      const importEndMatch = searchSpace.match(
        /from\s+["'][^"']+["'];?\n?|import\s+["'][^"']+["'];?\n?/
      )

      const endOfLastImport = importEndMatch
        ? lastImportIndex + importEndMatch.index! + importEndMatch[0].length
        : transformedCode.indexOf("\n", lastImportIndex) + 1

      transformedCode =
        transformedCode.slice(0, endOfLastImport) +
        importStatement +
        transformedCode.slice(endOfLastImport)
    } else if (useClientIndex !== -1 || useClientSingleIndex !== -1) {
      const index =
        useClientIndex !== -1 ? useClientIndex : useClientSingleIndex
      const endOfUseClient = transformedCode.indexOf("\n", index) + 1
      transformedCode =
        transformedCode.slice(0, endOfUseClient) +
        "\n" +
        importStatement +
        transformedCode.slice(endOfUseClient)
    } else {
      transformedCode = importStatement + transformedCode
    }
  }

  // Final cleanup: remove triple newlines and trim
  return transformedCode.replace(/\n{3,}/g, "\n\n").trim() + "\n"
}

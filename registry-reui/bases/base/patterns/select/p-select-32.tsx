// Description: Select with icon-labeled categories
// Order: 32

import { Field } from "@/registry/bases/base/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/base/ui/select"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const categories = [
  {
    value: "documents",
    label: "Documents",
    icon: (
      <IconPlaceholder
        lucide="FileTextIcon"
        tabler="IconFileText"
        hugeicons="File02Icon"
        phosphor="FileTextIcon"
        remixicon="RiFileTextLine"
        className="size-4"
      />
    ),
  },
  {
    value: "images",
    label: "Images",
    icon: (
      <IconPlaceholder
        lucide="ImageIcon"
        tabler="IconPhoto"
        hugeicons="ImageIcon"
        phosphor="ImageIcon"
        remixicon="RiImageLine"
        className="size-4"
      />
    ),
  },
  {
    value: "archives",
    label: "Archives",
    icon: (
      <IconPlaceholder
        lucide="ArchiveIcon"
        tabler="IconArchive"
        hugeicons="Archive02Icon"
        phosphor="ArchiveIcon"
        remixicon="RiArchiveLine"
        className="size-4"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <Field className="max-w-xs">
      <Select defaultValue={categories[0]} items={categories}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {(item: (typeof categories)[number]) => (
              <span className="flex items-center gap-2">
                {item.icon}
                <span>{item?.label}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category}>
                <span className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

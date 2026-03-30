// Description: Select with icon-labeled categories
// Order: 32

import { Field } from "@/registry/bases/radix/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/bases/radix/ui/select"
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
    value: "videos",
    label: "Videos",
    icon: (
      <IconPlaceholder
        lucide="VideoIcon"
        tabler="IconVideo"
        hugeicons="Video02Icon"
        phosphor="VideoCameraIcon"
        remixicon="RiVideoOnLine"
        className="size-4"
      />
    ),
  },
  {
    value: "audio",
    label: "Audio",
    icon: (
      <IconPlaceholder
        lucide="MusicIcon"
        tabler="IconMusic"
        hugeicons="MusicNote03Icon"
        phosphor="MusicNotesIcon"
        remixicon="RiMusic2Line"
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
      <Select defaultValue={categories[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
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

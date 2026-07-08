"use client"

import { lazy, memo, Suspense } from "react"

import type { IconLibraryName } from "@/registry/config"

const IconLucide = lazy(() =>
  import("@/registry/icons/icon-lucide").then((mod) => ({
    default: mod.IconLucide,
  }))
)

const IconTabler = lazy(() =>
  import("@/registry/icons/icon-tabler").then((mod) => ({
    default: mod.IconTabler,
  }))
)

const IconHugeicons = lazy(() =>
  import("@/registry/icons/icon-hugeicons").then((mod) => ({
    default: mod.IconHugeicons,
  }))
)

const IconPhosphor = lazy(() =>
  import("@/registry/icons/icon-phosphor").then((mod) => ({
    default: mod.IconPhosphor,
  }))
)

const IconRemixicon = lazy(() =>
  import("@/registry/icons/icon-remixicon").then((mod) => ({
    default: mod.IconRemixicon,
  }))
)

const PREVIEW_ICONS = {
  lucide: [
    "CopyIcon",
    "CircleAlertIcon",
    "TrashIcon",
    "ShareIcon",
    "ShoppingBagIcon",
    "MoreHorizontalIcon",
    "Loader2Icon",
    "PlusIcon",
    "MinusIcon",
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "CheckIcon",
    "ChevronDownIcon",
    "ChevronRightIcon",
  ],
  tabler: [
    "IconCopy",
    "IconExclamationCircle",
    "IconTrash",
    "IconShare",
    "IconShoppingBag",
    "IconDots",
    "IconLoader",
    "IconPlus",
    "IconMinus",
    "IconArrowLeft",
    "IconArrowRight",
    "IconCheck",
    "IconChevronDown",
    "IconChevronRight",
  ],
  hugeicons: [
    "Copy01Icon",
    "AlertCircleIcon",
    "Delete02Icon",
    "Share03Icon",
    "ShoppingBag01Icon",
    "MoreHorizontalCircle01Icon",
    "Loading03Icon",
    "PlusSignIcon",
    "MinusSignIcon",
    "ArrowLeft02Icon",
    "ArrowRight02Icon",
    "Tick02Icon",
    "ArrowDown01Icon",
    "ArrowRight01Icon",
  ],
  phosphor: [
    "CopyIcon",
    "WarningCircleIcon",
    "TrashIcon",
    "ShareIcon",
    "BagIcon",
    "DotsThreeIcon",
    "SpinnerIcon",
    "PlusIcon",
    "MinusIcon",
    "ArrowLeftIcon",
    "ArrowRightIcon",
    "CheckIcon",
    "CaretDownIcon",
    "CaretRightIcon",
  ],
  remixicon: [
    "RiFileCopyLine",
    "RiErrorWarningLine",
    "RiDeleteBinLine",
    "RiShareLine",
    "RiShoppingBagLine",
    "RiMoreLine",
    "RiLoaderLine",
    "RiAddLine",
    "RiSubtractLine",
    "RiArrowLeftLine",
    "RiArrowRightLine",
    "RiCheckLine",
    "RiArrowDownSLine",
    "RiArrowRightSLine",
  ],
} as const

export const IconLibraryPreview = memo(function IconLibraryPreview({
  iconLibrary,
}: {
  iconLibrary: IconLibraryName
}) {
  const previewIcons = PREVIEW_ICONS[iconLibrary]

  if (!previewIcons) {
    return null
  }

  const IconRenderer =
    iconLibrary === "lucide"
      ? IconLucide
      : iconLibrary === "tabler"
        ? IconTabler
        : iconLibrary === "hugeicons"
          ? IconHugeicons
          : iconLibrary === "phosphor"
            ? IconPhosphor
            : IconRemixicon

  return (
    <Suspense
      fallback={
        <div className="-mx-1 grid w-full grid-cols-7 gap-2">
          {previewIcons.map((iconName) => (
            <div
              key={iconName}
              className="bg-site-muted site-rounded-sm size-6 animate-pulse"
            />
          ))}
        </div>
      }
    >
      <div className="-mx-1 grid w-full grid-cols-7 gap-2">
        {previewIcons.map((iconName) => (
          <div
            key={iconName}
            className="flex size-6 items-center justify-center *:[svg]:size-5"
          >
            <IconRenderer name={iconName} />
          </div>
        ))}
      </div>
    </Suspense>
  )
})

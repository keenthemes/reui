"use client"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"
import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/**
 * `size="sm"` is a 32px tile, which is the one step that fits a two-line row:
 * `xs` reads as a stray glyph beside 34px of text and `default` is taller than
 * the text block it sits next to. Its 16px glyph is exactly the `size-4` the
 * bare icons used, so the drawing did not change size, only gained a frame.
 *
 * The tile needs no alignment class of its own. The row is `items-center`, and
 * the icon slot is a `shrink-0` flex box inside it, so a 32px tile centres
 * against the whole two-line block rather than hanging off the title.
 */
const globeIcon = (
  <IconTile variant="outline" size="sm">
    <IconPlaceholder
      lucide="GlobeIcon"
      tabler="IconWorld"
      hugeicons="Globe02Icon"
      phosphor="GlobeIcon"
      remixicon="RiGlobalLine"
      className="size-4"
    />
  </IconTile>
)
const pinIcon = (
  <IconTile variant="outline" size="sm">
    <IconPlaceholder
      lucide="MapPinIcon"
      tabler="IconMapPin"
      hugeicons="Location01Icon"
      phosphor="MapPinIcon"
      remixicon="RiMapPinLine"
      className="size-4"
    />
  </IconTile>
)

const locations: CascaderNode[] = [
  {
    value: "us",
    label: "United States",
    icon: globeIcon,
    description: "12 data centers",
    children: [
      {
        value: "us.ca",
        label: "California",
        icon: pinIcon,
        description: "3 regions",
        children: [
          {
            value: "us.ca.sfo",
            label: "San Francisco",
            icon: pinIcon,
            description: "us-west-1",
          },
          {
            value: "us.ca.lax",
            label: "Los Angeles",
            icon: pinIcon,
            description: "us-west-2",
          },
        ],
      },
      {
        value: "us.va",
        label: "Virginia",
        icon: pinIcon,
        description: "2 regions",
        children: [
          {
            value: "us.va.iad",
            label: "Ashburn",
            icon: pinIcon,
            description: "us-east-1",
          },
        ],
      },
      {
        value: "us.or",
        label: "Oregon",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "us.or.pdx",
            label: "Portland",
            icon: pinIcon,
            description: "us-west-3",
          },
        ],
      },
    ],
  },
  {
    value: "eu",
    label: "European Union",
    icon: globeIcon,
    description: "8 data centers",
    children: [
      {
        value: "eu.de",
        label: "Germany",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "eu.de.fra",
            label: "Frankfurt",
            icon: pinIcon,
            description: "eu-central-1",
          },
        ],
      },
      {
        value: "eu.ie",
        label: "Ireland",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "eu.ie.dub",
            label: "Dublin",
            icon: pinIcon,
            description: "eu-west-1",
          },
        ],
      },
    ],
  },
  {
    value: "uk",
    label: "United Kingdom",
    icon: globeIcon,
    description: "3 data centers",
    children: [
      {
        value: "uk.eng",
        label: "England",
        icon: pinIcon,
        description: "2 regions",
        children: [
          {
            value: "uk.eng.lhr",
            label: "London",
            icon: pinIcon,
            description: "eu-west-2",
          },
          {
            value: "uk.eng.man",
            label: "Manchester",
            icon: pinIcon,
            description: "eu-west-4",
          },
        ],
      },
    ],
  },
  {
    value: "ca",
    label: "Canada",
    icon: globeIcon,
    description: "2 data centers",
    children: [
      {
        value: "ca.on",
        label: "Ontario",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "ca.on.yyz",
            label: "Toronto",
            icon: pinIcon,
            description: "ca-central-1",
          },
        ],
      },
    ],
  },
  {
    value: "au",
    label: "Australia",
    icon: globeIcon,
    description: "2 data centers",
    children: [
      {
        value: "au.nsw",
        label: "New South Wales",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "au.nsw.syd",
            label: "Sydney",
            icon: pinIcon,
            description: "ap-southeast-2",
          },
        ],
      },
    ],
  },
  {
    value: "jp",
    label: "Japan",
    icon: globeIcon,
    description: "4 data centers",
    children: [
      {
        value: "jp.kanto",
        label: "Kanto",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "jp.kanto.nrt",
            label: "Tokyo",
            icon: pinIcon,
            description: "ap-northeast-1",
          },
        ],
      },
    ],
  },
  {
    value: "br",
    label: "Brazil",
    icon: globeIcon,
    description: "1 data center",
    children: [
      {
        value: "br.sp",
        label: "São Paulo state",
        icon: pinIcon,
        description: "1 region",
        children: [
          {
            value: "br.sp.gru",
            label: "São Paulo",
            icon: pinIcon,
            description: "sa-east-1",
          },
        ],
      },
    ],
  },
  {
    value: "cn",
    label: "China",
    icon: globeIcon,
    description: "Requires a separate account",
    disabled: true,
  },
]

/**
 * Two-line rows via `description`, and a disabled branch. A blocked option
 * stays rendered and `aria-disabled` rather than being dropped, so the reason
 * it is unavailable is still discoverable instead of the option seeming absent.
 *
 * The label and its description are one block with a 2px gap, not two rows of
 * a list: the row's text slot is `flex gap-2` in every style sheet - built
 * for pieces sitting side by side - and turning it into a column inherited that
 * 8px as a paragraph break. The cascader overrides it on its own element.
 *
 * That gap was only half of it. The remaining air is line box, not margin: at
 * their default leading the two lines reserve 20px and 16px for 14px and 12px
 * of type, so 10px of the stack is space nothing is drawn in. `renderLabel`
 * rebuilds the same two lines with `leading-tight` on both, which is why the
 * fix is stated here rather than as a smaller gap - closing the gap alone would
 * have pushed the lines together while each still sat in an oversized box. The
 * text block loses about 4px, which the panel gets back as visible rows.
 */
export default function Pattern() {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader
        items={locations}
        value={value}
        onValueChange={setValue}
        // Only the label block is replaced, so the icon tile, the chevron and
        // the check still come from the default row. `renderLabel` supplies the
        // description itself, so the node's own `description` is not drawn a
        // second time.
        renderLabel={(node) => (
          <>
            <span className="w-full truncate text-start leading-tight">
              {node.label}
            </span>
            {node.description ? (
              <span className="text-muted-foreground w-full truncate text-start text-xs leading-tight">
                {node.description}
              </span>
            ) : null}
          </>
        )}
      >
        <CascaderTrigger
          aria-label="Region"
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder="Select a region" />
        </CascaderTrigger>

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}

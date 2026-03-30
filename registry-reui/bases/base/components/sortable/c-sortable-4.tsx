// Description: Sortable playlist with frame
// Order: 4
// GridSize: 1

"use client"

import { useState } from "react"
import { Badge } from "@/registry-reui/bases/base/reui/badge"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/registry-reui/bases/base/reui/frame"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/registry-reui/bases/base/reui/sortable"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  plays: string
  active?: boolean
}

const defaultTracks: Track[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: "4:03",
    plays: "1.2B",
    active: true,
  },
  {
    id: "2",
    title: "Digital Love",
    artist: "Daft Punk",
    album: "Discovery",
    duration: "4:58",
    plays: "845M",
  },
  {
    id: "3",
    title: "Starlight",
    artist: "Muse",
    album: "Black Holes",
    duration: "3:59",
    plays: "720M",
  },
  {
    id: "4",
    title: "Take On Me",
    artist: "a-ha",
    album: "Hunting High and Low",
    duration: "3:48",
    plays: "1.8B",
  },
  {
    id: "5",
    title: "Blue Monday",
    artist: "New Order",
    album: "Power, Corruption",
    duration: "7:29",
    plays: "530M",
  },
]

export default function Pattern() {
  const [tracks, setTracks] = useState<Track[]>(defaultTracks)

  return (
    <div className="mx-auto w-full max-w-md">
      <Frame spacing="xs">
        <FrameHeader>
          <div className="flex items-center justify-between">
            <div>
              <FrameTitle>Queue</FrameTitle>
              <FrameDescription>{tracks.length} tracks</FrameDescription>
            </div>
            <Badge variant="outline" size="sm">
              <IconPlaceholder
                lucide="ListMusicIcon"
                tabler="IconPlaylist"
                hugeicons="PlayListIcon"
                phosphor="PlaylistIcon"
                remixicon="RiPlayListLine"
                className="size-3"
              />
              Playlist
            </Badge>
          </div>
        </FrameHeader>
        <Sortable
          value={tracks}
          onValueChange={setTracks}
          getItemValue={(item) => item.id}
          strategy="vertical"
          className="space-y-0.5"
        >
          {tracks.map((track, index) => (
            <SortableItem key={track.id} value={track.id}>
              <FramePanel className="p-0!">
                <div className="group flex items-center gap-3 px-3 py-2.5">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                    <IconPlaceholder
                      lucide="GripVerticalIcon"
                      tabler="IconGripVertical"
                      hugeicons="DragDropVerticalIcon"
                      phosphor="DotsSixVerticalIcon"
                      remixicon="RiDraggable"
                      className="size-4"
                    />
                  </SortableItemHandle>
                  <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
                    <IconPlaceholder
                      lucide="MusicIcon"
                      tabler="IconMusic"
                      hugeicons="MusicNote03Icon"
                      phosphor="MusicNotesIcon"
                      remixicon="RiMusic2Line"
                      className="text-muted-foreground size-4"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${track.active ? "text-primary" : ""}`}
                    >
                      {track.title}
                      {track.active && (
                        <Badge
                          variant="primary-light"
                          size="xs"
                          className="ms-1.5 align-middle"
                        >
                          Playing
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {track.artist} &middot; {track.album}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
                      {track.plays}
                    </span>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {track.duration}
                    </span>
                  </div>
                </div>
              </FramePanel>
            </SortableItem>
          ))}
        </Sortable>
      </Frame>
    </div>
  )
}

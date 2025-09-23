'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/base-popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/default/ui/base-select';
import { Toggle } from '@/registry/default/ui/base-toggle';
import { ToggleGroup, ToggleGroupItem } from '@/registry/default/ui/base-toggle-group';
import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/registry/default/ui/base-toolbar';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Download,
  Italic,
  Redo,
  Settings,
  Share,
  Underline,
  Undo,
} from 'lucide-react';

const fontSizes = [
  { label: 'Small', value: '12px' },
  { label: 'Medium', value: '14px' },
  { label: 'Large', value: '16px' },
  { label: 'Extra Large', value: '18px' },
];

export default function ToolbarDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Toolbar */}
      <Toolbar>
        {/* Text Formatting */}
        <ToggleGroup toggleMultiple={true}>
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
        </ToggleGroup>

        <ToolbarSeparator />

        {/* Text Alignment */}
        <ToggleGroup toggleMultiple={false}>
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
          <ToolbarButton
            size="icon"
            render={
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            }
          />
        </ToggleGroup>

        <ToolbarSeparator />

        {/* Font Size */}
        <Select indicatorPosition="right">
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToolbarSeparator />

        {/* Undo/Redo */}
        <ToolbarButton size="icon" aria-label="Undo">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton size="icon" aria-label="Redo">
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarSeparator />

        {/* Actions */}
        <ToolbarButton size="icon" variant="outline" aria-label="Download">
          <Download className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton size="icon" variant="outline" aria-label="Share">
          <Share className="h-4 w-4" />
        </ToolbarButton>

        {/* Settings */}
        <Popover>
          <ToolbarButton size="icon" variant="outline" render={<PopoverTrigger />} aria-label="Settings">
            <Settings className="h-4 w-4" />
          </ToolbarButton>
          <PopoverContent className="w-64">
            <h3>Editor Settings</h3>
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-save</label>
                <Toggle aria-label="Toggle auto-save" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Spell check</label>
                <Toggle aria-label="Toggle spell check" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dark mode</label>
                <Toggle aria-label="Toggle dark mode" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Toolbar>
    </div>
  );
}

import { useState } from 'react';
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteControl,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/registry/default/ui/base-autocomplete';
import { Label } from '@/registry/default/ui/base-label';

export default function AutocompleteSizeDemo() {
  const [smallValue, setSmallValue] = useState<string>('');
  const [mediumValue, setMediumValue] = useState<string>('');
  const [largeValue, setLargeValue] = useState<string>('');

  const smallFilteredItems = tags.filter((item) => item.value.toLowerCase().includes(smallValue.toLowerCase()));

  const mediumFilteredItems = tags.filter((item) => item.value.toLowerCase().includes(mediumValue.toLowerCase()));

  const largeFilteredItems = tags.filter((item) => item.value.toLowerCase().includes(largeValue.toLowerCase()));

  return (
    <div className="flex flex-col w-full max-w-xs gap-6">
      {/* Small Size */}
      <div className="flex flex-col gap-2.5">
        <Label className="text-sm font-medium">Small</Label>
        <Autocomplete
          value={smallValue}
          onValueChange={setSmallValue}
          items={smallFilteredItems}
          itemToStringValue={(item: unknown) => (item as Tag).value}
        >
          <AutocompleteControl>
            <AutocompleteInput variant="sm" placeholder="e.g. feature" />
            {smallValue && <AutocompleteClear />}
          </AutocompleteControl>
          <AutocompleteContent>
            <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
            <AutocompleteList>
              {(tag) => (
                <AutocompleteItem key={tag.id} value={tag}>
                  {tag.value}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </div>

      {/* Medium Size (Default) */}
      <div className="flex flex-col gap-2.5">
        <Label className="text-sm font-medium">Medium (Default)</Label>
        <Autocomplete
          value={mediumValue}
          onValueChange={setMediumValue}
          items={mediumFilteredItems}
          itemToStringValue={(item: unknown) => (item as Tag).value}
        >
          <AutocompleteControl>
            <AutocompleteInput placeholder="e.g. feature" />
            {mediumValue && <AutocompleteClear />}
          </AutocompleteControl>
          <AutocompleteContent>
            <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
            <AutocompleteList>
              {(tag) => (
                <AutocompleteItem key={tag.id} value={tag}>
                  {tag.value}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </div>

      {/* Large Size */}
      <div className="flex flex-col gap-2.5">
        <Label className="text-sm font-medium">Large</Label>
        <Autocomplete
          value={largeValue}
          onValueChange={setLargeValue}
          items={largeFilteredItems}
          itemToStringValue={(item: unknown) => (item as Tag).value}
        >
          <AutocompleteControl>
            <AutocompleteInput variant="lg" placeholder="e.g. feature" />
            {largeValue && <AutocompleteClear />}
          </AutocompleteControl>
          <AutocompleteContent>
            <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
            <AutocompleteList>
              {(tag) => (
                <AutocompleteItem key={tag.id} value={tag}>
                  {tag.value}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    </div>
  );
}

interface Tag {
  id: string;
  value: string;
}

const tags: Tag[] = [
  { id: 't1', value: 'feature' },
  { id: 't2', value: 'fix' },
  { id: 't3', value: 'bug' },
  { id: 't4', value: 'docs' },
  { id: 't5', value: 'internal' },
  { id: 't6', value: 'mobile' },
  { id: 'c-accordion', value: 'component: accordion' },
  { id: 'c-alert-dialog', value: 'component: alert dialog' },
  { id: 'c-autocomplete', value: 'component: autocomplete' },
  { id: 'c-avatar', value: 'component: avatar' },
  { id: 'c-checkbox', value: 'component: checkbox' },
  { id: 'c-checkbox-group', value: 'component: checkbox group' },
  { id: 'c-collapsible', value: 'component: collapsible' },
  { id: 'c-combobox', value: 'component: combobox' },
  { id: 'c-context-menu', value: 'component: context menu' },
  { id: 'c-dialog', value: 'component: dialog' },
  { id: 'c-field', value: 'component: field' },
  { id: 'c-fieldset', value: 'component: fieldset' },
  { id: 'c-filterable-menu', value: 'component: filterable menu' },
  { id: 'c-form', value: 'component: form' },
  { id: 'c-input', value: 'component: input' },
  { id: 'c-menu', value: 'component: menu' },
  { id: 'c-menubar', value: 'component: menubar' },
  { id: 'c-meter', value: 'component: meter' },
  { id: 'c-navigation-menu', value: 'component: navigation menu' },
  { id: 'c-number-field', value: 'component: number field' },
  { id: 'c-popover', value: 'component: popover' },
  { id: 'c-preview-card', value: 'component: preview card' },
  { id: 'c-progress', value: 'component: progress' },
  { id: 'c-radio', value: 'component: radio' },
  { id: 'c-scroll-area', value: 'component: scroll area' },
  { id: 'c-select', value: 'component: select' },
  { id: 'c-separator', value: 'component: separator' },
  { id: 'c-slider', value: 'component: slider' },
  { id: 'c-switch', value: 'component: switch' },
  { id: 'c-tabs', value: 'component: tabs' },
  { id: 'c-toast', value: 'component: toast' },
  { id: 'c-toggle', value: 'component: toggle' },
  { id: 'c-toggle-group', value: 'component: toggle group' },
  { id: 'c-toolbar', value: 'component: toolbar' },
  { id: 'c-tooltip', value: 'component: tooltip' },
];

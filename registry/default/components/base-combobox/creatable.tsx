'use client';

import * as React from 'react';
import { Button } from '@/registry/default/ui/base-button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxValue,
} from '@/registry/default/ui/base-combobox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/registry/default/ui/base-dialog';
import { Input } from '@/registry/default/ui/base-input';
import { Label } from '@/registry/default/ui/base-label';
import { PlusIcon } from 'lucide-react';

export default function ComboboxCreatableDemo() {
  const id = React.useId();

  const [labels, setLabels] = React.useState<LabelItem[]>(initialLabels);
  const [selected, setSelected] = React.useState<LabelItem[]>([]);
  const [query, setQuery] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const createInputRef = React.useRef<HTMLInputElement | null>(null);
  const comboboxInputRef = React.useRef<HTMLInputElement | null>(null);
  const pendingQueryRef = React.useRef('');

  function handleCreate() {
    const input = createInputRef.current || comboboxInputRef.current;
    const value = input ? input.value.trim() : '';
    if (!value) {
      return;
    }

    const normalized = value.toLocaleLowerCase();
    const baseId = normalized.replace(/\s+/g, '-');
    const existing = labels.find((l) => l.value.trim().toLocaleLowerCase() === normalized);

    if (existing) {
      setSelected((prev) => (prev.some((i) => i.id === existing.id) ? prev : [...prev, existing]));
      setOpenDialog(false);
      setQuery('');
      return;
    }

    const existingIds = new Set(labels.map((l) => l.id));
    let uniqueId = baseId;
    if (existingIds.has(uniqueId)) {
      let i = 2;
      while (existingIds.has(`${baseId}-${i}`)) {
        i += 1;
      }
      uniqueId = `${baseId}-${i}`;
    }

    const newItem: LabelItem = { id: uniqueId, value };

    if (!selected.find((item) => item.id === newItem.id)) {
      setLabels((prev) => [...prev, newItem]);
      setSelected((prev) => [...prev, newItem]);
    }

    setOpenDialog(false);
    setQuery('');
  }

  function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleCreate();
  }

  const trimmed = query.trim();
  const lowered = trimmed.toLocaleLowerCase();
  const exactExists = labels.some((l) => l.value.trim().toLocaleLowerCase() === lowered);
  const itemsForView: Array<LabelItem> =
    trimmed !== '' && !exactExists
      ? [
          ...labels,
          {
            creatable: trimmed,
            id: `create:${lowered}`,
            value: `Create "${trimmed}"`,
          },
        ]
      : labels;

  return (
    <React.Fragment>
      <Combobox
        items={itemsForView}
        multiple
        onValueChange={(items) => {
          const selectedItems = items as LabelItem[];
          const last = selectedItems[selectedItems.length - 1];
          if (last && last.creatable) {
            pendingQueryRef.current = last.creatable;
            setOpenDialog(true);
            return;
          }
          const clean = selectedItems.filter((i) => !i.creatable);
          setSelected(clean);
          setQuery('');
        }}
        value={selected}
        inputValue={query}
        onInputValueChange={setQuery}
        onOpenChange={(_open, details) => {
          if ('key' in details.event && details.event.key === 'Enter') {
            if (trimmed === '') {
              return;
            }

            const existing = labels.find((l) => l.value.trim().toLocaleLowerCase() === lowered);

            if (existing) {
              setSelected((prev) => (prev.some((i) => i.id === existing.id) ? prev : [...prev, existing]));
              setQuery('');
              return;
            }

            pendingQueryRef.current = trimmed;
            setOpenDialog(true);
          }
        }}
      >
        <div className="max-w-xs w-full flex flex-col gap-1">
          <Label htmlFor={id}>Labels</Label>
          <ComboboxChips className="w-full" ref={containerRef}>
            <ComboboxValue>
              {(value: LabelItem[]) => (
                <React.Fragment>
                  {value.map((label) => (
                    <ComboboxChip key={label.id} aria-label={label.value}>
                      {label.value}
                      <ComboboxChipRemove />
                    </ComboboxChip>
                  ))}
                  <ComboboxInput ref={comboboxInputRef} id={id} placeholder={value.length > 0 ? '' : 'e.g. bug'} />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
        </div>

        <ComboboxContent anchor={containerRef}>
          <ComboboxEmpty>No labels found.</ComboboxEmpty>
          <ComboboxList>
            {(item: LabelItem) =>
              item.creatable ? (
                <ComboboxItem key={item.id} value={item}>
                  <span className="col-start-1">
                    <PlusIcon className="size-3" />
                  </span>
                  <div className="col-start-2">Create &quot;{item.creatable}&quot;</div>
                </ComboboxItem>
              ) : (
                <ComboboxItem key={item.id} value={item}>
                  <ComboboxItemIndicator />
                  <div className="col-start-2">{item.value}</div>
                </ComboboxItem>
              )
            }
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent initialFocus={createInputRef} className="sm:max-w-md">
          <DialogTitle>Create new label</DialogTitle>
          <DialogDescription>Add a new label to select.</DialogDescription>
          <form onSubmit={handleCreateSubmit}>
            <Input ref={createInputRef} placeholder="Label name" defaultValue={pendingQueryRef.current} />
            <div className="mt-4 flex justify-end gap-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

interface LabelItem {
  creatable?: string;
  id: string;
  value: string;
}

const initialLabels: LabelItem[] = [
  { id: 'bug', value: 'bug' },
  { id: 'docs', value: 'documentation' },
  { id: 'enhancement', value: 'enhancement' },
  { id: 'help-wanted', value: 'help wanted' },
  { id: 'good-first-issue', value: 'good first issue' },
];

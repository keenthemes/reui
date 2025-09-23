'use client';

import * as React from 'react';
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
import { Label } from '@/registry/default/ui/base-label';

export default function MultiSelectComboboxExample() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const id = React.useId();

  return (
    <Combobox items={langs} multiple>
      <div className="w-full max-w-xs flex flex-col gap-3">
        <Label htmlFor={id}>Programming languages</Label>
        <ComboboxChips ref={containerRef}>
          <ComboboxValue>
            {(value: ProgrammingLanguage[]) => (
              <React.Fragment>
                {value.map((language) => (
                  <ComboboxChip key={language.id} aria-label={language.value}>
                    {language.value}
                    <ComboboxChipRemove />
                  </ComboboxChip>
                ))}
                <ComboboxInput id={id} placeholder={value.length > 0 ? '' : 'e.g. TypeScript'} />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>
      </div>

      <ComboboxContent anchor={containerRef}>
        <ComboboxEmpty>No languages found.</ComboboxEmpty>
        <ComboboxList>
          {(language: ProgrammingLanguage) => (
            <ComboboxItem key={language.id} value={language}>
              <ComboboxItemIndicator />
              <div className="col-start-2">{language.value}</div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

interface ProgrammingLanguage {
  id: string;
  value: string;
}

const langs: ProgrammingLanguage[] = [
  { id: 'js', value: 'JavaScript' },
  { id: 'ts', value: 'TypeScript' },
  { id: 'py', value: 'Python' },
  { id: 'java', value: 'Java' },
  { id: 'cpp', value: 'C++' },
  { id: 'cs', value: 'C#' },
  { id: 'php', value: 'PHP' },
  { id: 'ruby', value: 'Ruby' },
  { id: 'go', value: 'Go' },
  { id: 'rust', value: 'Rust' },
  { id: 'swift', value: 'Swift' },
];

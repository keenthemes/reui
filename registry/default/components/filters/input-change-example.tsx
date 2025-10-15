'use client';

import React, { useCallback, useState } from 'react';
import { Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import { Mail, MapPin, User } from 'lucide-react';

export default function InputChangeExample() {
  const [filters, setFilters] = useState<Filter[]>([]);

  // Example 1: Filter updates on blur (when user leaves input)
  const handleFiltersChangeOnBlur = useCallback((newFilters: Filter[]) => {
    console.log('Filters updated on blur:', newFilters);
    setFilters(newFilters);
  }, []);

  // Example 2: Filter updates on every keystroke (default behavior)
  const handleFiltersChangeOnKeystroke = useCallback((newFilters: Filter[]) => {
    console.log('Filters updated on keystroke:', newFilters);
    setFilters(newFilters);
  }, []);

  // Field configuration with onInputChange for blur-based updates
  const fieldsWithBlurUpdates: FilterFieldConfig[] = [
    {
      key: 'name',
      label: 'Name',
      icon: <User className="size-3.5" />,
      type: 'text',
      placeholder: 'Search names...',
      // This will trigger filter updates on blur instead of keystroke
      onInputChange: (e) => {
        console.log('Name input changed on blur:', e.target.value);
        // The filter will be updated when user leaves the input field
      },
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail className="size-3.5" />,
      type: 'email',
      placeholder: 'user@example.com',
      // This will trigger filter updates on blur instead of keystroke
      onInputChange: (e) => {
        console.log('Email input changed on blur:', e.target.value);
        // The filter will be updated when user leaves the input field
      },
    },
    {
      key: 'location',
      label: 'Location',
      icon: <MapPin className="size-3.5" />,
      type: 'text',
      placeholder: 'Search locations...',
      // This will trigger filter updates on blur instead of keystroke
      onInputChange: (e) => {
        console.log('Location input changed on blur:', e.target.value);
        // The filter will be updated when user leaves the input field
      },
    },
  ];

  // Field configuration without onInputChange (default keystroke behavior)
  const fieldsWithKeystrokeUpdates: FilterFieldConfig[] = [
    {
      key: 'name',
      label: 'Name',
      icon: <User className="size-3.5" />,
      type: 'text',
      placeholder: 'Search names...',
      // No onInputChange - will update on every keystroke (default behavior)
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail className="size-3.5" />,
      type: 'email',
      placeholder: 'user@example.com',
      // No onInputChange - will update on every keystroke (default behavior)
    },
    {
      key: 'location',
      label: 'Location',
      icon: <MapPin className="size-3.5" />,
      type: 'text',
      placeholder: 'Search locations...',
      // No onInputChange - will update on every keystroke (default behavior)
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Blur-based Filter Updates</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Filters update when user leaves the input field (on blur event)
        </p>
        <Filters
          filters={filters}
          fields={fieldsWithBlurUpdates}
          onChange={handleFiltersChangeOnBlur}
          variant="outline"
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Keystroke-based Filter Updates</h3>
        <p className="text-sm text-muted-foreground mb-4">Filters update on every keystroke (default behavior)</p>
        <Filters
          filters={filters}
          fields={fieldsWithKeystrokeUpdates}
          onChange={handleFiltersChangeOnKeystroke}
          variant="outline"
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Current Filters</h3>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </div>
  );
}

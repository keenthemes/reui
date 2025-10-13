'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/registry/default/ui/button';
import { createFilter, Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import {
  AlertCircle,
  Ban,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  FunnelPlus,
  Globe,
  Mail,
  Star,
  Tag,
} from 'lucide-react';

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'todo':
      return <Clock className="text-primary" />;
    case 'in-progress':
      return <AlertCircle className="text-yellow-500" />;
    case 'done':
      return <CheckCircle className="text-green-500" />;
    case 'cancelled':
      return <Ban className="text-destructive" />;
    default:
      return <Circle className="text-muted-foreground" />;
  }
};

// Priority icon component
const PriorityIcon = ({ priority }: { priority: string }) => {
  const colors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    urgent: 'text-red-500',
  };
  return <Star className={colors[priority as keyof typeof colors]} />;
};

export default function FiltersDemo() {
  // Basic filter fields for size variant demo
  const fields: FilterFieldConfig[] = [
    {
      key: 'text',
      label: 'Text',
      icon: <Tag className="size-3.5" />,
      type: 'text',
      className: 'w-36',
      placeholder: 'Search text...',
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail className="size-3.5" />,
      type: 'email',
      className: 'w-48',
      placeholder: 'user@example.com',
    },
    {
      key: 'website',
      label: 'Website',
      icon: <Globe className="size-3.5" />,
      type: 'url',
      className: 'w-40',
      placeholder: 'https://example.com',
    },
    {
      key: 'status',
      label: 'Status',
      icon: <Clock className="size-3.5" />,
      type: 'select',
      searchable: false,
      className: 'w-[200px]',
      options: [
        { value: 'todo', label: 'To Do', icon: <StatusIcon status="todo" /> },
        { value: 'in-progress', label: 'In Progress', icon: <StatusIcon status="in-progress" /> },
        { value: 'done', label: 'Done', icon: <StatusIcon status="done" /> },
        { value: 'cancelled', label: 'Cancelled', icon: <StatusIcon status="cancelled" /> },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      icon: <AlertCircle className="size-3.5" />,
      type: 'multiselect',
      className: 'w-[180px]',
      options: [
        { value: 'low', label: 'Low', icon: <PriorityIcon priority="low" /> },
        { value: 'medium', label: 'Medium', icon: <PriorityIcon priority="medium" /> },
        { value: 'high', label: 'High', icon: <PriorityIcon priority="high" /> },
        { value: 'urgent', label: 'Urgent', icon: <PriorityIcon priority="urgent" /> },
      ],
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      icon: <Calendar className="size-3.5" />,
      type: 'date',
      className: 'w-36',
    },
    {
      key: 'score',
      label: 'Score',
      icon: <Star className="size-3.5" />,
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      key: 'isActive',
      label: 'Active Status',
      icon: <CheckCircle className="size-3.5" />,
      type: 'boolean',
    },
  ];

  const [smallFilters, setSmallFilters] = useState<Filter[]>([createFilter('priority', 'is', ['high', 'urgent'])]);

  const [mediumFilters, setMediumFilters] = useState<Filter[]>([createFilter('status', 'is', ['todo'])]);

  const [largeFilters, setLargeFilters] = useState<Filter[]>([
    createFilter('email', 'contains', ['example@example.com']),
  ]);

  const handleSmallFiltersChange = useCallback((filters: Filter[]) => {
    console.log('Small filters updated:', filters);
    setSmallFilters(filters);
  }, []);

  const handleMediumFiltersChange = useCallback((filters: Filter[]) => {
    console.log('Medium filters updated:', filters);
    setMediumFilters(filters);
  }, []);

  const handleLargeFiltersChange = useCallback((filters: Filter[]) => {
    console.log('Large filters updated:', filters);
    setLargeFilters(filters);
  }, []);

  return (
    <div className="flex items-start flex-col gap-2.5 grow space-y-6 self-start content-start">
      <div>
        <h3 className="text-sm font-semibold mb-4">Small Size</h3>
        <Filters
          size="sm"
          filters={smallFilters}
          fields={fields}
          variant="outline"
          onChange={handleSmallFiltersChange}
          addButton={
            <Button size="sm" mode="icon" variant="outline">
              <FunnelPlus />
            </Button>
          }
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Medium Size (Default)</h3>
        <Filters
          size="md"
          filters={mediumFilters}
          fields={fields}
          variant="outline"
          onChange={handleMediumFiltersChange}
          addButton={
            <Button mode="icon" variant="outline">
              <FunnelPlus />
            </Button>
          }
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Large Size</h3>
        <Filters
          size="lg"
          filters={largeFilters}
          fields={fields}
          variant="outline"
          onChange={handleLargeFiltersChange}
          addButton={
            <Button size="lg" mode="icon" variant="outline">
              <FunnelPlus />
            </Button>
          }
        />
      </div>
    </div>
  );
}

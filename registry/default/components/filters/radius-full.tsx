'use client';

import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Button } from '@/registry/default/ui/button';
import { createFilter, Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import { AlertCircle, Calendar, CheckCircle, FunnelX, Globe, Mail, Star, Tag, User } from 'lucide-react';

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
  // Basic filter fields for outline variant demo
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
      key: 'assignee',
      label: 'Assignee',
      icon: <User className="size-3.5" />,
      type: 'select',
      searchable: false,
      className: 'w-[200px]',
      options: [
        {
          value: 'john',
          label: 'John Doe',
          icon: (
            <Avatar className="size-5">
              <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: 'jane',
          label: 'Jane Smith',
          icon: (
            <Avatar className="size-5">
              <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" alt="Jane Smith" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: 'bob',
          label: 'Bob Johnson',
          icon: (
            <Avatar className="size-5">
              <AvatarImage src="https://randomuser.me/api/portraits/men/3.jpg" alt="Bob Johnson" />
              <AvatarFallback>BJ</AvatarFallback>
            </Avatar>
          ),
        },
        {
          value: 'alice',
          label: 'Alice Brown',
          icon: (
            <Avatar className="size-5">
              <AvatarImage src="https://randomuser.me/api/portraits/women/4.jpg" alt="Alice Brown" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          ),
        },
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

  const [filters, setFilters] = useState<Filter[]>([createFilter('assignee', 'is', ['john'])]);

  const handleFiltersChange = useCallback((filters: Filter[]) => {
    console.log('Filters updated:', filters);
    setFilters(filters);
  }, []);

  return (
    <div className="flex items-start gap-2.5 grow space-y-6 self-start content-start">
      <div className="flex-1">
        <Filters
          filters={filters}
          fields={fields}
          radius="full"
          size="sm"
          variant="outline"
          onChange={handleFiltersChange}
        />
      </div>

      {filters.length > 0 && (
        <Button variant="outline" size="sm" radius="full" onClick={() => setFilters([])}>
          <FunnelX /> Clear
        </Button>
      )}
    </div>
  );
}

'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { DataGrid, DataGridContainer } from '@/registry/default/ui/data-grid';
import { DataGridColumnHeader } from '@/registry/default/ui/data-grid-column-header';
import { DataGridPagination } from '@/registry/default/ui/data-grid-pagination';
import { DataGridTable } from '@/registry/default/ui/data-grid-table';
import { Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Building, Calendar, CheckCircle, DollarSign, FunnelX, Mail, MapPin, User } from 'lucide-react';

interface IData {
  id: string;
  name: string;
  availability: 'online' | 'away' | 'busy' | 'offline';
  avatar: string;
  status: 'active' | 'inactive' | 'archived';
  flag: string;
  email: string;
  company: string;
  role: string;
  joined: string;
  location: string;
  balance: number;
}

const demoData: IData[] = [
  {
    id: '1',
    name: 'Kathryn Campbell',
    availability: 'online',
    avatar: '1.png',
    status: 'active',
    flag: '🇺🇸',
    email: 'kathryn@apple.com',
    company: 'Apple',
    role: 'CEO',
    joined: '2021-04-15',
    location: 'San Francisco, USA',
    balance: 5143.03,
  },
  {
    id: '2',
    name: 'Robert Smith',
    availability: 'away',
    avatar: '2.png',
    status: 'inactive',
    flag: '🇬🇧',
    email: 'robert@openai.com',
    company: 'OpenAI',
    role: 'CTO',
    joined: '2020-07-20',
    location: 'London, UK',
    balance: 4321.87,
  },
  {
    id: '3',
    name: 'Sophia Johnson',
    availability: 'busy',
    avatar: '3.png',
    status: 'active',
    flag: '🇨🇦',
    email: 'sophia@meta.com',
    company: 'Meta',
    role: 'Designer',
    joined: '2019-03-12',
    location: 'Toronto, Canada',
    balance: 7654.98,
  },
  {
    id: '4',
    name: 'Lucas Walker',
    availability: 'offline',
    avatar: '4.png',
    status: 'archived',
    flag: '🇦🇺',
    email: 'lucas@tesla.com',
    company: 'Tesla',
    role: 'Developer',
    joined: '2022-01-18',
    location: 'Sydney, Australia',
    balance: 3456.45,
  },
  {
    id: '5',
    name: 'Emily Davis',
    availability: 'online',
    avatar: '5.png',
    status: 'active',
    flag: '🇩🇪',
    email: 'emily@sap.com',
    company: 'SAP',
    role: 'Lawyer',
    joined: '2023-05-23',
    location: 'Berlin, Germany',
    balance: 9876.54,
  },
  {
    id: '6',
    name: 'James Lee',
    availability: 'away',
    avatar: '6.png',
    status: 'active',
    flag: '🇲🇾',
    email: 'james@keenthemes.com',
    company: 'Keenthemes',
    role: 'Director',
    joined: '2018-11-30',
    location: 'Kuala Lumpur, MY',
    balance: 6214.22,
  },
];

// Availability status component
const AvailabilityStatus = ({ availability }: { availability: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`size-2 rounded-full ${getStatusColor(availability)}`} />
      <span className="text-sm text-muted-foreground">{getStatusLabel(availability)}</span>
    </div>
  );
};

export default function NuqsDataGridDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);

  // Manual URL state management with readable URLs
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to create readable filter string
  const createReadableFilterString = (filter: Filter): string => {
    const { field, operator, values } = filter;
    const valueStr = values.join(',');
    return `${field}:${operator}:${valueStr}`;
  };

  // Helper function to parse readable filter string
  const parseReadableFilterString = (filterStr: string): Filter | null => {
    const parts = filterStr.split(':');
    if (parts.length < 3) return null;

    const [field, operator, valueStr] = parts;
    const values = valueStr.split(',').filter((v) => v.trim() !== '');

    if (values.length === 0) return null;

    return {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      field,
      operator,
      values,
    };
  };

  // Read filters from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersParam = urlParams.get('filters');

    if (filtersParam) {
      try {
        const filterStrings = filtersParam.split('|');
        const parsedFilters = filterStrings
          .map(parseReadableFilterString)
          .filter((filter): filter is Filter => filter !== null);
        setFilters(parsedFilters);
      } catch (error) {
        console.warn('Failed to parse filters from URL:', error);
        setFilters([]);
      }
    } else {
      setFilters([]);
    }

    setIsInitialized(true);
  }, []);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: Filter[]) => {
    const url = new URL(window.location.href);

    // Filter out empty filters before adding to URL
    const activeFilters = newFilters.filter((filter) => {
      const { values } = filter;

      if (!values || values.length === 0) return false;
      if (values.every((value) => typeof value === 'string' && value.trim() === '')) return false;
      if (values.every((value) => value === null || value === undefined)) return false;
      if (values.every((value) => Array.isArray(value) && value.length === 0)) return false;

      return true;
    });

    if (activeFilters.length > 0) {
      const filterStrings = activeFilters.map(createReadableFilterString);
      url.searchParams.set('filters', filterStrings.join('|'));
    } else {
      url.searchParams.delete('filters');
    }

    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Filter field configurations
  const fields: FilterFieldConfig[] = [
    {
      key: 'name',
      label: 'Name',
      icon: <User className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search names...',
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
      key: 'company',
      label: 'Company',
      icon: <Building className="size-3.5" />,
      type: 'select',
      searchable: true,
      className: 'w-[180px]',
      options: [
        { value: 'Apple', label: 'Apple' },
        { value: 'OpenAI', label: 'OpenAI' },
        { value: 'Meta', label: 'Meta' },
        { value: 'Tesla', label: 'Tesla' },
        { value: 'SAP', label: 'SAP' },
        { value: 'Keenthemes', label: 'Keenthemes' },
      ],
    },
    {
      key: 'role',
      label: 'Role',
      icon: <User className="size-3.5" />,
      type: 'select',
      searchable: true,
      className: 'w-[160px]',
      options: [
        { value: 'CEO', label: 'CEO' },
        { value: 'CTO', label: 'CTO' },
        { value: 'Designer', label: 'Designer' },
        { value: 'Developer', label: 'Developer' },
        { value: 'Lawyer', label: 'Lawyer' },
        { value: 'Director', label: 'Director' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      icon: <CheckCircle className="size-3.5" />,
      type: 'select',
      searchable: false,
      className: 'w-[140px]',
      options: [
        {
          value: 'active',
          label: 'Active',
          icon: <div className="size-2 bg-green-500 rounded-full"></div>,
        },
        {
          value: 'inactive',
          label: 'Inactive',
          icon: <div className="size-2 bg-destructive rounded-full"></div>,
        },
        {
          value: 'archived',
          label: 'Archived',
          icon: <div className="size-2 bg-secondary rounded-full"></div>,
        },
      ],
    },
    {
      key: 'availability',
      label: 'Availability',
      icon: <User className="size-3.5" />,
      type: 'select',
      searchable: false,
      className: 'w-[160px]',
      options: [
        {
          value: 'online',
          label: 'Online',
          icon: <div className="size-2 bg-green-500 rounded-full"></div>,
        },
        {
          value: 'away',
          label: 'Away',
          icon: <div className="size-2 bg-yellow-500 rounded-full"></div>,
        },
        {
          value: 'busy',
          label: 'Busy',
          icon: <div className="size-2 bg-red-500 rounded-full"></div>,
        },
        {
          value: 'offline',
          label: 'Offline',
          icon: <div className="size-2 bg-gray-400 rounded-full"></div>,
        },
      ],
    },
    {
      key: 'location',
      label: 'Location',
      icon: <MapPin className="size-3.5" />,
      type: 'text',
      className: 'w-40',
      placeholder: 'Search locations...',
    },
    {
      key: 'joined',
      label: 'Joined Date',
      icon: <Calendar className="size-3.5" />,
      type: 'date',
      className: 'w-36',
    },
    {
      key: 'balance',
      label: 'Balance',
      icon: <DollarSign className="size-3.5" />,
      type: 'number',
      min: 0,
      max: 10000,
      step: 100,
      className: 'w-32',
    },
  ];

  // Apply filters to data - only apply filters with non-empty values
  const filteredData = useMemo(() => {
    let filtered = [...demoData];

    // Filter out empty filters before applying
    const activeFilters = filters.filter((filter) => {
      const { values } = filter;

      if (!values || values.length === 0) return false;
      if (values.every((value) => typeof value === 'string' && value.trim() === '')) return false;
      if (values.every((value) => value === null || value === undefined)) return false;
      if (values.every((value) => Array.isArray(value) && value.length === 0)) return false;

      return true;
    });

    activeFilters.forEach((filter) => {
      const { field, operator, values } = filter;

      filtered = filtered.filter((item) => {
        const fieldValue = item[field as keyof IData];

        switch (operator) {
          case 'is':
            return values.includes(fieldValue);
          case 'is_not':
            return !values.includes(fieldValue);
          case 'contains':
            return values.some((value) => String(fieldValue).toLowerCase().includes(String(value).toLowerCase()));
          case 'not_contains':
            return !values.some((value) => String(fieldValue).toLowerCase().includes(String(value).toLowerCase()));
          case 'equals':
            return fieldValue === values[0];
          case 'not_equals':
            return fieldValue !== values[0];
          case 'greater_than':
            return Number(fieldValue) > Number(values[0]);
          case 'less_than':
            return Number(fieldValue) < Number(values[0]);
          case 'greater_than_or_equal':
            return Number(fieldValue) >= Number(values[0]);
          case 'less_than_or_equal':
            return Number(fieldValue) <= Number(values[0]);
          case 'between':
            if (values.length >= 2) {
              const min = Number(values[0]);
              const max = Number(values[1]);
              return Number(fieldValue) >= min && Number(fieldValue) <= max;
            }
            return true;
          case 'not_between':
            if (values.length >= 2) {
              const min = Number(values[0]);
              const max = Number(values[1]);
              return Number(fieldValue) < min || Number(fieldValue) > max;
            }
            return true;
          case 'before':
            return new Date(String(fieldValue)) < new Date(String(values[0]));
          case 'after':
            return new Date(String(fieldValue)) > new Date(String(values[0]));
          default:
            return true;
        }
      });
    });

    return filtered;
  }, [filters]);

  const handleFiltersChange = useCallback(
    (newFilters: Filter[]) => {
      console.log('URL state filters updated:', newFilters);
      setFilters(newFilters);
      updateURL(newFilters);
      // Reset pagination when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [updateURL],
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
    updateURL([]);
  }, [updateURL]);

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Staff" column={column} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={`/media/avatars/${row.original.avatar}`} alt={row.original.name} />
                <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{row.original.name}</div>
                <div className="text-muted-foreground text-xs truncate max-w-[120px]">{row.original.email}</div>
              </div>
            </div>
          );
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'company',
        id: 'company',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Role" column={column} />,
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;

          if (status == 'active') {
            return (
              <Badge variant="success" appearance="outline">
                Active
              </Badge>
            );
          } else if (status == 'inactive') {
            return (
              <Badge variant="destructive" appearance="outline">
                Inactive
              </Badge>
            );
          } else if (status == 'archived') {
            return (
              <Badge variant="secondary" appearance="outline">
                Archived
              </Badge>
            );
          }
        },
        size: 100,
      },
      {
        accessorKey: 'availability',
        id: 'availability',
        header: 'Availability',
        cell: ({ row }) => <AvailabilityStatus availability={row.original.availability} />,
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: 'location',
        id: 'location',
        header: ({ column }) => <DataGridColumnHeader title="Location" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">{row.original.flag}</span>
            <span>{row.original.location}</span>
          </div>
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => <DataGridColumnHeader title="Balance" column={column} />,
        cell: ({ row }) => <span className="font-medium">${row.original.balance.toLocaleString()}</span>,
        size: 120,
        enableSorting: true,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full self-start">
      {/* Filters Section */}
      <div className="flex items-start gap-2.5 mb-5">
        <div className="flex-1">
          {isInitialized ? (
            <Filters filters={filters} fields={fields} onChange={handleFiltersChange} variant="outline" size="sm" />
          ) : (
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Loading filters...</span>
            </div>
          )}
        </div>
        {filters.length > 0 && isInitialized && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <FunnelX /> Clear
          </Button>
        )}
      </div>

      {/* Data Grid */}
      <DataGrid
        table={table}
        recordCount={filteredData?.length || 0}
        tableLayout={{
          columnsMovable: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>
    </div>
  );
}

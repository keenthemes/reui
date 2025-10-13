'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { DataGrid, DataGridContainer } from '@/registry/default/ui/data-grid';
import { DataGridColumnHeader } from '@/registry/default/ui/data-grid-column-header';
import { DataGridPagination } from '@/registry/default/ui/data-grid-pagination';
import { DataGridTable } from '@/registry/default/ui/data-grid-table';
import { createFilter, Filters, type Filter, type FilterFieldConfig } from '@/registry/default/ui/filters';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';
import { Skeleton } from '@/registry/default/ui/skeleton';
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
import { Building, Calendar, CircleAlert, DollarSign, FunnelX, Mail, MapPin, User } from 'lucide-react';

interface IData {
  id: string;
  name: string;
  availability: 'online' | 'away' | 'busy' | 'offline';
  avatar: string;
  status: 'active' | 'inactive';
  flag: string; // Emoji flags
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
    status: 'inactive',
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
  {
    id: '7',
    name: 'Isabella Martinez',
    availability: 'busy',
    avatar: '7.png',
    status: 'inactive',
    flag: '🇪🇸',
    email: 'isabella@bbva.es',
    company: 'BBVA',
    role: 'Product Manager',
    joined: '2021-06-14',
    location: 'Barcelona, Spain',
    balance: 5321.77,
  },
  {
    id: '8',
    name: 'Benjamin Harris',
    availability: 'offline',
    avatar: '8.png',
    status: 'active',
    flag: '🇯🇵',
    email: 'benjamin@sony.jp',
    company: 'Sony',
    role: 'Marketing Lead',
    joined: '2020-10-22',
    location: 'Tokyo, Japan',
    balance: 8452.39,
  },
  {
    id: '9',
    name: 'Olivia Brown',
    availability: 'online',
    avatar: '9.png',
    status: 'active',
    flag: '🇫🇷',
    email: 'olivia@lvmh.fr',
    company: 'LVMH',
    role: 'Data Scientist',
    joined: '2019-09-17',
    location: 'Paris, France',
    balance: 7345.1,
  },
  {
    id: '10',
    name: 'Michael Clark',
    availability: 'away',
    avatar: '10.png',
    status: 'inactive',
    flag: '🇮🇹',
    email: 'michael@eni.it',
    company: 'ENI',
    role: 'Engineer',
    joined: '2023-02-11',
    location: 'Milan, Italy',
    balance: 5214.88,
  },
  {
    id: '11',
    name: 'Ava Wilson',
    availability: 'busy',
    avatar: '11.png',
    status: 'active',
    flag: '🇧🇷',
    email: 'ava@vale.br',
    company: 'Vale',
    role: 'Software Engineer',
    joined: '2022-12-01',
    location: 'Rio de Janeiro, Brazil',
    balance: 9421.5,
  },
  {
    id: '12',
    name: 'David Young',
    availability: 'offline',
    avatar: '12.png',
    status: 'active',
    flag: '🇮🇳',
    email: 'david@tata.in',
    company: 'Tata',
    role: 'Sales Manager',
    joined: '2020-03-27',
    location: 'Mumbai, India',
    balance: 4521.67,
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

export default function AsyncDataGridDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [filters, setFilters] = useState<Filter[]>([createFilter('status', 'is', ['active'])]);

  // Async state management
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<IData[]>(demoData);
  const isInitialLoad = useRef(true);

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
        { value: 'BBVA', label: 'BBVA' },
        { value: 'Sony', label: 'Sony' },
        { value: 'LVMH', label: 'LVMH' },
        { value: 'ENI', label: 'ENI' },
        { value: 'Vale', label: 'Vale' },
        { value: 'Tata', label: 'Tata' },
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
        { value: 'Product Manager', label: 'Product Manager' },
        { value: 'Marketing Lead', label: 'Marketing Lead' },
        { value: 'Data Scientist', label: 'Data Scientist' },
        { value: 'Engineer', label: 'Engineer' },
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Sales Manager', label: 'Sales Manager' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      icon: <User className="size-3.5" />,
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
          icon: <div className="size-2 bg-zinc-400 rounded-full"></div>,
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
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          ),
        },
        {
          value: 'away',
          label: 'Away',
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-yellow-500" />
              <span>Away</span>
            </div>
          ),
        },
        {
          value: 'busy',
          label: 'Busy',
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500" />
              <span>Busy</span>
            </div>
          ),
        },
        {
          value: 'offline',
          label: 'Offline',
          icon: (
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-gray-400" />
              <span>Offline</span>
            </div>
          ),
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

  // Apply filters to data (shared function)
  const applyFiltersToData = useCallback((newFilters: Filter[]) => {
    let filtered = [...demoData];

    // Filter out empty filters before applying
    const activeFilters = newFilters.filter((filter) => {
      const { values } = filter;

      // Check if filter has meaningful values
      if (!values || values.length === 0) return false;

      // For text/string values, check if they're not empty strings
      if (values.every((value) => typeof value === 'string' && value.trim() === '')) return false;

      // For number values, check if they're not null/undefined
      if (values.every((value) => value === null || value === undefined)) return false;

      // For arrays, check if they're not empty
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
  }, []);

  // Simulate async data filtering
  const simulateAsyncFiltering = useCallback(
    async (newFilters: Filter[]) => {
      setIsLoading(true); // Show loading on current data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

      // Apply filters and update data after timeout
      const filtered = applyFiltersToData(newFilters);
      setFilteredData(filtered);
      setIsLoading(false);
    },
    [applyFiltersToData],
  );

  const handleFiltersChange = useCallback(
    (newFilters: Filter[]) => {
      console.log('Async data grid filters updated:', newFilters);
      setFilters(newFilters);
      // Reset pagination when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      // Trigger async filtering
      simulateAsyncFiltering(newFilters);
    },
    [simulateAsyncFiltering],
  );

  // Initial data load - only run once on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      // Apply initial filter without loading state
      const initialFiltered = applyFiltersToData(filters);
      setFilteredData(initialFiltered);
      isInitialLoad.current = false;
    }
  }, [filters, applyFiltersToData]);

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
        meta: {
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'company',
        id: 'company',
        header: ({ column }) => <DataGridColumnHeader title="Company" column={column} />,
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: 'role',
        id: 'role',
        header: ({ column }) => <DataGridColumnHeader title="Occupation" column={column} />,
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 125,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
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
        meta: {
          skeleton: <Skeleton className="h-4 w-16 rounded-full" />,
        },
      },
      {
        accessorKey: 'availability',
        id: 'availability',
        header: 'Availability',
        cell: ({ row }) => <AvailabilityStatus availability={row.original.availability} />,
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: (
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          ),
        },
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
        meta: {
          skeleton: (
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ),
        },
      },
      {
        accessorKey: 'balance',
        id: 'balance',
        header: ({ column }) => <DataGridColumnHeader title="Balance" column={column} />,
        cell: ({ row }) => <span className="font-medium">${row.original.balance.toLocaleString()}</span>,
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-16" />,
        },
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
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="flex-1">
          <Filters filters={filters} fields={fields} onChange={handleFiltersChange} variant="outline" size="sm" />
        </div>
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters([]);
              simulateAsyncFiltering([]);
            }}
            disabled={isLoading}
          >
            <FunnelX /> Clear
          </Button>
        )}
      </div>

      {/* Data Grid */}
      <DataGrid
        table={table}
        isLoading={isLoading}
        loadingMode="skeleton"
        recordCount={filteredData?.length || 0}
        tableLayout={{
          dense: true,
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

      {/* Async Info Alert */}
      <Alert variant="success" appearance="light" close={false} className="mt-5">
        <AlertIcon>
          <CircleAlert />
        </AlertIcon>
        <AlertTitle>
          Async Mode: Simulated API Delay of <strong>800-2000ms</strong>
        </AlertTitle>
      </Alert>
    </div>
  );
}

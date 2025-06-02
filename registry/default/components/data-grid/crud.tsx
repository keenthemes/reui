import { useMemo, useState } from 'react';
import { useCopyToClipboard } from '@/registry/default/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Card, CardFooter, CardHeader, CardHeading, CardTable, CardToolbar } from '@/registry/default/ui/card';
import { Checkbox } from '@/registry/default/ui/checkbox';
import { DataGrid } from '@/registry/default/ui/data-grid';
import { DataGridColumnHeader } from '@/registry/default/ui/data-grid-column-header';
import { DataGridPagination } from '@/registry/default/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/registry/default/ui/data-grid-table';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/default/ui/popover';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Ellipsis, Filter, Search, UserRoundPlus, X } from 'lucide-react';
import { toast } from 'sonner';

interface IData {
  id: string;
  name: string;
  availability: 'online' | 'away' | 'busy' | 'offline';
  avatar: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
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
    status: 'Active',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Inactive',
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
    status: 'Active',
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
    status: 'Pending',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Pending',
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
    status: 'Inactive',
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
    status: 'Blocked',
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
    status: 'Active',
    flag: '🇮🇳',
    email: 'david@tata.in',
    company: 'Tata',
    role: 'Sales Manager',
    joined: '2020-03-27',
    location: 'Mumbai, India',
    balance: 4521.67,
  },
];

function ActionsCell({ row }: { row: Row<IData> }) {
  const { copy } = useCopyToClipboard();
  const handleCopyId = () => {
    copy(row.original.id);
    const message = `Employee ID successfully copied: ${row.original.id}`;
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="primary" close={false} onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DataGridDemo() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    return demoData.filter((item) => {
      // Filter by status
      const matchesStatus = !selectedStatuses?.length || selectedStatuses.includes(item.status);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        Object.values(item)
          .join(' ') // Combine all fields into a single string
          .toLowerCase()
          .includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedStatuses]);

  const statusCounts = useMemo(() => {
    return demoData.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses(
      (
        prev = [], // Default to an empty array
      ) => (checked ? [...prev, value] : prev.filter((v) => v !== value)),
    );
  };

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        meta: {
          headerClassName: '',
          cellClassName: '',
        },
        enableResizing: false,
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="User" visibility={true} column={column} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={`/media/avatars/${row.original.avatar}`} alt={row.original.name} />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              <div className="space-y-px">
                <div className="font-medium text-foreground">{row.original.name}</div>
                <div className="text-muted-foreground">{row.original.email}</div>
              </div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: 'location',
        id: 'location',
        header: ({ column }) => <DataGridColumnHeader title="Location" visibility={true} column={column} />,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1.5">
              {row.original.flag}
              <div className="font-medium text-foreground">{row.original.location}</div>
            </div>
          );
        },
        size: 200,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start',
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader title="Status" visibility={true} column={column} />,
        cell: ({ row }) => {
          const status = row.original.status;

          if (status == 'Active') {
            return (
              <Badge variant="primary" appearance="outline">
                Approved
              </Badge>
            );
          } else if (status == 'Blocked') {
            return (
              <Badge variant="destructive" appearance="outline">
                Blocked
              </Badge>
            );
          } else if (status == 'Inactive') {
            return (
              <Badge variant="secondary" appearance="outline">
                Inactive
              </Badge>
            );
          } else {
            return (
              <Badge variant="secondary" appearance="outline">
                Pending
              </Badge>
            );
          }
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
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
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card>
        <CardHeader className="py-4">
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge size="sm" appearance="stroke">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">Filters</div>
                    <div className="space-y-3">
                      {Object.keys(statusCounts).map((status) => (
                        <div key={status} className="flex items-center gap-2.5">
                          <Checkbox
                            id={status}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) => handleStatusChange(checked === true, status)}
                          />
                          <Label
                            htmlFor={status}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {status}
                            <span className="text-muted-foreground">{statusCounts[status]}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeading>
          <CardToolbar>
            <Button>
              <UserRoundPlus />
              Add new
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}

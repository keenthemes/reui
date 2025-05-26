import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/registry/default/ui/avatar';
import { DataGrid, DataGridContainer } from '@/registry/default/ui/data-grid';
import {
  DataGridTableDndRowHandle,
  DataGridTableDndRows,
} from '@/registry/default/ui/data-grid-table-dnd-rows';
import { ScrollArea, ScrollBar } from '@/registry/default/ui/scroll-area';
import { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

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
];

export default function DataGridDemo() {
  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        id: 'drag',
        cell: ({ row }) => <DataGridTableDndRowHandle rowId={row.id} />,
        size: 40,
      },
      {
        accessorKey: 'name',
        id: 'name',
        header: 'Name',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={`/media/avatars/${row.original.avatar}`}
                  alt={row.original.name}
                />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              <Link
                href="#"
                className="font-medium text-foreground hover:text-primary"
              >
                {row.original.name}
              </Link>
            </div>
          );
        },
        size: 175,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'email',
        id: 'email',
        header: 'Email',
        cell: (info) => (
          <Link
            href={`mailto:${info.getValue()}`}
            className="hover:text-primary hover:underline"
          >
            {info.getValue() as string}
          </Link>
        ),
        size: 200,
        meta: {
          headerClassName: '',
          cellClassName: '',
        },
      },
      {
        accessorKey: 'location',
        id: 'location',
        header: 'Location',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1.5">
              {row.original.flag}
              <div className="font-medium text-foreground">
                {row.original.location}
              </div>
            </div>
          );
        },
        size: 170,
        meta: {
          headerClassName: '',
          cellClassName: 'text-start',
        },
      },
    ],
    [],
  );

  const [data, setData] = useState(demoData);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  };

  const table = useReactTable({
    columns,
    data,
    getRowId: (row: IData) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={data?.length || 0}
      tableLayout={{ rowsDraggable: true }}
    >
      <DataGridContainer>
        <ScrollArea>
          <DataGridTableDndRows
            handleDragEnd={handleDragEnd}
            dataIds={dataIds}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DataGridContainer>
    </DataGrid>
  );
}

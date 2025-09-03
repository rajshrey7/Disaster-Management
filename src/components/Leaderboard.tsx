"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

export type LeaderboardRow = {
  id: string;
  name: string;
  class: string;
  xp: number;
  level: number;
  badges: number;
};

interface LeaderboardProps {
  title?: string;
  description?: string;
  rows: LeaderboardRow[];
}

export function Leaderboard({ title = 'Leaderboard', description = 'Top students by XP', rows }: LeaderboardProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'xp', desc: true }]);

  const columns = useMemo<ColumnDef<LeaderboardRow>[]>(() => [
    { accessorKey: 'name', header: 'Student' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'level', header: 'Level' },
    { accessorKey: 'xp', header: 'XP' },
    {
      accessorKey: 'badges',
      header: 'Badges',
      cell: ({ getValue }) => <Badge variant="secondary">{String(getValue() ?? 0)}</Badge>,
    },
  ], []);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-2 border-b cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: '▲', desc: '▼' }[header.column.getIsSorted() as string] || null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr key={row.id} className={idx < 3 ? 'bg-yellow-50' : ''}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext()) || String(cell.getValue() ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}



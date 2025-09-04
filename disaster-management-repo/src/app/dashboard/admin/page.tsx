"use client";

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Users, Shield, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

type StudentRow = {
  id: string;
  name: string;
  class: string;
  progress: number;
  drillsPassed: number;
};

const mockStudents: StudentRow[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `Student ${i + 1}`,
  class: `Class ${6 + (i % 5)}`,
  progress: Math.round(40 + Math.random() * 60),
  drillsPassed: Math.round(1 + Math.random() * 5),
}));

const progressSeries = Array.from({ length: 8 }).map((_, i) => ({
  name: `Week ${i + 1}`,
  progress: Math.round(30 + i * 7 + Math.random() * 10),
}));

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const columns = useMemo<ColumnDef<StudentRow>[]>(() => [
    { accessorKey: 'name', header: 'Student' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'progress', header: 'Module %' },
    { accessorKey: 'drillsPassed', header: 'Drills Passed' },
  ], []);

  const table = useReactTable({
    data: mockStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [rollTotals, setRollTotals] = useState({ SAFE: 0, MISSING: 0, NEEDS_ATTENTION: 0 });
  useEffect(() => {
    fetch('/api/progress/rollcall')
      .then((r) => r.json())
      .then((res) => {
        if (res?.data?.totals) setRollTotals(res.data.totals);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Administrator Dashboard</h1>
        <p className="text-sm text-gray-600">Monitor & Manage school-wide preparedness</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Preparedness</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="progress" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Roll Call (Live)</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Badge variant="secondary">Safe: {rollTotals.SAFE}</Badge>
                  <Badge variant="outline">Missing: {rollTotals.MISSING}</Badge>
                  <Badge variant="destructive">Needs Attention: {rollTotals.NEEDS_ATTENTION}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drill Participation</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={progressSeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Broadcast Alerts</CardTitle>
              <CardDescription>Send one-way notifications to all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await fetch('/api/communication', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'x-user-role': 'ADMINISTRATOR' },
                      body: JSON.stringify({ action: 'broadcast', data: { message: 'Test alert', broadcastType: 'emergency', priority: 'high' } }),
                    });
                  }}
                >
                  Send Test Alert
                </Button>
                <Button variant="outline" onClick={() => router.push('/communication')}>Open Comms</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Students Overview
              </CardTitle>
              <CardDescription>Sortable list of students and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((header) => (
                          <th key={header.id} className="text-left p-2 border-b">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
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
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Digital Roll Call</CardTitle>
              <CardDescription>Teachers can mark students during drills or incidents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => fetch('/api/progress/rollcall', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'TEACHER', 'x-user-id': 'T-1' }, body: JSON.stringify({ status: 'SAFE' }) })}>Mark Me Safe</Button>
                <Button variant="outline" onClick={() => fetch('/api/progress/rollcall', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'TEACHER', 'x-user-id': 'T-1' }, body: JSON.stringify({ status: 'MISSING' }) })}>Mark Missing</Button>
                <Button variant="destructive" onClick={() => fetch('/api/progress/rollcall', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'TEACHER', 'x-user-id': 'T-1' }, body: JSON.stringify({ status: 'NEEDS_ATTENTION' }) })}>Needs Attention</Button>
              </div>
              <Separator />
              <p className="text-sm text-gray-600">Admins see live aggregates in Overview.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



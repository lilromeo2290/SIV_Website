'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Building2,
  User,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { ClientRow } from './page';

const GROUP_OPTIONS = [
  'Corporate',
  'Industrial',
  'Government',
  'Educational',
  'Healthcare',
  'VIP',
  'Prospective',
  'Inactive',
];

const STATUS_OPTIONS = ['active', 'inactive', 'prospective'];

const TYPE_OPTIONS = ['Individual', 'Company'];

function getGroupBadgeStyle(group: string | null) {
  const styles: Record<string, string> = {
    Corporate: 'bg-slate-700 text-white border-slate-600',
    Industrial: 'bg-amber-100 text-amber-800 border-amber-200',
    Government: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Educational: 'bg-violet-100 text-violet-800 border-violet-200',
    Healthcare: 'bg-rose-100 text-rose-800 border-rose-200',
    VIP: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Prospective: 'bg-sky-100 text-sky-800 border-sky-200',
    Inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return styles[group || ''] || 'bg-gray-100 text-gray-600 border-gray-200';
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'prospective':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getTypeBadgeStyle(type: string) {
  return type === 'Company'
    ? 'bg-slate-600 text-white border-slate-500'
    : 'bg-sky-600 text-white border-sky-500';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ClientListClient({
  clients,
}: {
  clients: ClientRow[];
}) {
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => c.status === 'active').length;
    const corporate = clients.filter(
      (c) => c.clientType === 'Company'
    ).length;
    const individual = clients.filter(
      (c) => c.clientType === 'Individual'
    ).length;
    return { total, active, corporate, individual };
  }, [clients]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.clientId.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.companyName && c.companyName.toLowerCase().includes(q));

      const matchesGroup =
        filterGroup === 'all' || c.group === filterGroup;
      const matchesStatus =
        filterStatus === 'all' || c.status === filterStatus;
      const matchesType =
        filterType === 'all' || c.clientType === filterType;

      return matchesSearch && matchesGroup && matchesStatus && matchesType;
    });
  }, [clients, search, filterGroup, filterStatus, filterType]);

  const statCards = [
    {
      label: 'Total Clients',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Corporate',
      value: stats.corporate,
      icon: Building2,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
    {
      label: 'Individual',
      value: stats.individual,
      icon: User,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Client Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage and view all your clients in one place.
          </p>
        </div>
        <Link href="/crm/clients/add">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-slate-200">
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.bg}`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {card.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, ID, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Filter:</span>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-9 w-[130px] text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="h-9 w-[140px] text-xs">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {GROUP_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-[130px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            All Clients{' '}
            <span className="font-normal text-slate-400">
              ({filtered.length} of {clients.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[480px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Client ID
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Group
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Registered
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-sm text-slate-400"
                    >
                      {clients.length === 0
                        ? 'No clients yet. Click "Add Client" to get started.'
                        : 'No clients match your search or filters.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((client) => (
                    <TableRow
                      key={client.id}
                      className="border-slate-100"
                    >
                      <TableCell className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">
                        {client.clientId}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-800">
                            {client.fullName}
                          </span>
                          {client.companyName && (
                            <span className="text-xs text-slate-400">
                              {client.companyName}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-slate-600">
                        {client.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-slate-600">
                        {client.email || '—'}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={
                            'border text-[10px] font-semibold uppercase tracking-wide ' +
                            getTypeBadgeStyle(client.clientType)
                          }
                        >
                          {client.clientType}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {client.group ? (
                          <Badge
                            className={
                              'border text-[10px] font-semibold uppercase tracking-wide ' +
                              getGroupBadgeStyle(client.group)
                            }
                          >
                            {client.group}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={
                            'border text-[10px] font-semibold uppercase tracking-wide ' +
                            getStatusBadgeStyle(client.status)
                          }
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(client.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  MoreHorizontal,
  Users,
  Shield,
  Eye,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Building,
  Calendar,
  Filter,
  LayoutGrid,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CRMUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  modules: string | null;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-red-100 text-red-800',
  Admin: 'bg-blue-100 text-blue-800',
  Engineer: 'bg-amber-100 text-amber-800',
  'Customer Service': 'bg-green-100 text-green-800',
  Finance: 'bg-purple-100 text-purple-800',
  Marketing: 'bg-pink-100 text-pink-800',
  Staff: 'bg-slate-100 text-slate-800',
  staff: 'bg-slate-100 text-slate-800',
};

const getRoleColor = (roleName: string) => {
  return roleColors[roleName] || roleColors[roleName.trim()] || 'bg-slate-100 text-slate-700';
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-slate-100 text-slate-600',
  suspended: 'bg-red-100 text-red-800',
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function UsersPage() {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      params.set('limit', '50');

      const res = await fetch(`/crm/api/users?${params}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/crm/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteId(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const roleStats = [
    { role: 'Super Admin', color: 'text-red-600', bg: 'bg-red-50' },
    { role: 'Admin', color: 'text-blue-600', bg: 'bg-blue-50' },
    { role: 'Engineer', color: 'text-amber-600', bg: 'bg-amber-50' },
    { role: 'Customer Service', color: 'text-green-600', bg: 'bg-green-50' },
    { role: 'Finance', color: 'text-purple-600', bg: 'bg-purple-50' },
    { role: 'Marketing', color: 'text-pink-600', bg: 'bg-pink-50' },
  ].map((r) => ({
    ...r,
    count: users.filter((u) => u.role.includes(r.role)).length,
  }));

  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, manage, and configure system users and their roles
          </p>
        </div>
        <Link href="/crm/users/add">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{total}</p>
                <p className="text-xs text-slate-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                <p className="text-xs text-slate-500">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <UserX className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{inactiveCount}</p>
                <p className="text-xs text-slate-500">Inactive Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{roleStats.filter((r) => r.count > 0).length}</p>
                <p className="text-xs text-slate-500">Active Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-blue-600" />
            Role Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {roleStats.map((r) => (
              <div
                key={r.role}
                className={`flex flex-col items-center rounded-lg border p-3 ${r.bg}`}
              >
                <p className={`text-2xl font-bold ${r.color}`}>{r.count}</p>
                <p className="mt-0.5 text-xs text-slate-600">{r.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, email, phone, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background pl-9 pr-8 text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <span className="ml-3 text-sm text-slate-500">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-700">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search || roleFilter || statusFilter
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first user'}
              </p>
              {!search && !roleFilter && !statusFilter && (
                <Link href="/crm/users/add" className="mt-4">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">User</TableHead>
                    <TableHead className="font-semibold text-slate-700">Role</TableHead>
                    <TableHead className="font-semibold text-slate-700">Modules</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Last Login</TableHead>
                    <TableHead className="font-semibold text-slate-700">Created</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-sm font-semibold text-blue-700">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.role.split(',').map((r, i) => (
                            <Badge
                              key={i}
                              className={getRoleColor(r)}
                              variant="secondary"
                            >
                              {r.trim()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.modules ? (
                          <div className="flex flex-wrap gap-1">
                            {user.modules.split(',').map((m, i) => (
                              <Badge
                                key={i}
                                className="bg-emerald-100 text-emerald-800"
                                variant="secondary"
                              >
                                <LayoutGrid className="mr-1 h-3 w-3" />
                                {m.trim()}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">All</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={statusColors[user.status] || 'bg-slate-100 text-slate-700'}
                          variant="secondary"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/crm/users/edit?id=${user.id}`} className="gap-2">
                                <Eye className="h-4 w-4" />
                                View / Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-red-600 focus:text-red-600"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

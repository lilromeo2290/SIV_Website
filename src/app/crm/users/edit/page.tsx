'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Building,
  Phone,
  Mail,
  Lock,
  Shield,
  User,
  Trash2,
  Calendar,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roles = [
  { value: 'Super Admin', label: 'Super Admin', color: 'bg-red-100 text-red-800', desc: 'Full system access with all permissions' },
  { value: 'Admin', label: 'Admin', color: 'bg-blue-100 text-blue-800', desc: 'Manage most modules and settings' },
  { value: 'Engineer', label: 'Engineer', color: 'bg-amber-100 text-amber-800', desc: 'Service requests and diagnostics' },
  { value: 'Customer Service', label: 'Customer Service', color: 'bg-green-100 text-green-800', desc: 'Client interaction and support' },
  { value: 'Finance', label: 'Finance', color: 'bg-purple-100 text-purple-800', desc: 'Quotations, invoices, and billing' },
  { value: 'Marketing', label: 'Marketing', color: 'bg-pink-100 text-pink-800', desc: 'Campaigns and client communication' },
  { value: 'Staff', label: 'Staff', color: 'bg-slate-100 text-slate-700', desc: 'Basic access' },
];

const departments = [
  'Engineering',
  'Diagnostics',
  'Customer Service',
  'Finance',
  'Marketing',
  'Management',
  'IT',
  'Operations',
];

function EditUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: '',
    status: 'active',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalData, setOriginalData] = useState<Record<string, unknown> | null>(null);

  const toggleRole = (roleValue: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((r) => r !== roleValue)
        : [...prev, roleValue]
    );
  };

  useEffect(() => {
    if (!userId) {
      router.push('/crm/users');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/crm/api/users/${userId}`);
        const data = await res.json();
        if (data.user) {
          setForm({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            password: '',
            confirmPassword: '',
            department: data.user.department || '',
            status: data.user.status,
          });
          // Parse comma-separated roles
          const roleStr = data.user.role || '';
          setSelectedRoles(
            roleStr.split(',').map((r: string) => r.trim()).filter(Boolean)
          );
          setOriginalData(data.user);
        }
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Please assign at least one role');
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const updateData: Record<string, string> = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: selectedRoles.join(','),
        department: form.department,
        status: form.status,
      };
      if (form.password) {
        updateData.password = form.password;
      }

      const res = await fetch(`/crm/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('User updated successfully');
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/crm/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/crm/users');
      }
    } catch {
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-sm text-slate-500">Loading user...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit User
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update user information, roles, and permissions
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* User Info Summary */}
      {originalData && (
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                Created: {new Date(originalData.createdAt as string).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600">
                Last Updated: {new Date(originalData.updatedAt as string).toLocaleDateString()}
              </span>
            </div>
            {originalData.lastLogin && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Last Login: {new Date(originalData.lastLogin as string).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {success}
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        id="department"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
                      >
                        <option value="">Select department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <p className="mb-3 text-sm text-slate-500">
                    Leave password fields empty to keep the current password unchanged.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Leave empty to keep current"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className="pl-9 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Role & Status Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                Assign Roles
              </CardTitle>
              <p className="text-xs text-slate-500">
                Select one or more roles for this user
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedRoles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5 rounded-lg bg-blue-50 p-2">
                  <span className="text-xs font-medium text-blue-700">Selected ({selectedRoles.length}):</span>
                  {selectedRoles.map((r) => {
                    const roleInfo = roles.find((role) => role.value === r);
                    return (
                      <Badge key={r} className={roleInfo?.color || ''} variant="secondary">
                        {roleInfo?.label || r}
                      </Badge>
                    );
                  })}
                </div>
              )}
              {roles.map((role) => {
                const isSelected = selectedRoles.includes(role.value);
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => toggleRole(role.value)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <Badge className={role.color} variant="secondary">
                        {role.label}
                      </Badge>
                      <p className="mt-1 text-xs text-slate-500">{role.desc}</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 'active' })}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    form.status === 'active'
                      ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-3 w-3 rounded-full ${form.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Active</p>
                    <p className="text-xs text-slate-500">User can log in</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 'inactive' })}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    form.status === 'inactive'
                      ? 'border-slate-500 bg-slate-50 ring-1 ring-slate-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-3 w-3 rounded-full ${form.status === 'inactive' ? 'bg-slate-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Inactive</p>
                    <p className="text-xs text-slate-500">Account is disabled</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 'suspended' })}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    form.status === 'suspended'
                      ? 'border-red-500 bg-red-50 ring-1 ring-red-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-3 w-3 rounded-full ${form.status === 'suspended' ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Suspended</p>
                    <p className="text-xs text-slate-500">Temporarily locked</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <EditUserContent />
    </Suspense>
  );
}

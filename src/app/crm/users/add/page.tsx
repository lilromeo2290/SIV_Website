'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  Save,
  Building,
  Phone,
  Mail,
  Lock,
  Shield,
  User,
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
  { value: 'staff', label: 'Staff', color: 'bg-slate-100 text-slate-700', desc: 'Basic access' },
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

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('staff');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/crm/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: selectedRole,
          department: form.department,
          status: form.status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/crm/users');
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/crm/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add New User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new system user with specific role and permissions
          </p>
        </div>
      </div>

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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
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
                        placeholder="user@sivgh.com"
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
                        placeholder="+233 XX XXX XXXX"
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="pl-9 pr-9"
                        required
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
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Role Selection Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                Assign Role
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge className={role.color} variant="secondary">
                      {role.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{role.desc}</p>
                </button>
              ))}
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
                    <p className="text-xs text-slate-500">User can log in immediately</p>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Shield,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Key,
  Globe,
  Clock,
  Database,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const userRoles = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    color: 'bg-red-100 text-red-800',
    permissions: ['All modules', 'User management', 'System settings', 'API configuration'],
  },
  {
    name: 'Admin',
    description: 'Manage most modules and settings',
    color: 'bg-blue-100 text-blue-800',
    permissions: ['CRM modules', 'Reports', 'Campaign management'],
  },
  {
    name: 'Engineer',
    description: 'Service requests and diagnostics',
    color: 'bg-amber-100 text-amber-800',
    permissions: ['Service requests', 'Diagnostics', 'Client view'],
  },
  {
    name: 'Customer Service',
    description: 'Client interaction and support',
    color: 'bg-green-100 text-green-800',
    permissions: ['Client management', 'Messaging', 'Service requests view'],
  },
  {
    name: 'Finance',
    description: 'Quotations, invoices, and billing',
    color: 'bg-purple-100 text-purple-800',
    permissions: ['Quotations', 'Invoices', 'Financial reports'],
  },
  {
    name: 'Marketing',
    description: 'Campaigns and client communication',
    color: 'bg-pink-100 text-pink-800',
    permissions: ['Campaigns', 'Messaging', 'Birthday automation'],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage user roles, system settings, and integrations
        </p>
      </div>

      {/* User Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            User Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {userRoles.map((role) => (
              <div
                key={role.name}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{role.name}</h3>
                  <Badge className={role.color} variant="secondary">
                    Role
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-slate-500">{role.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-blue-600" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Company Name</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">SIV Engineering</p>
              <p className="mt-1 text-xs text-slate-400">Primary business name used throughout the system</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Default Phone</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">+27 (XX) XXX-XXXX</p>
              <p className="mt-1 text-xs text-slate-400">Default contact number for outgoing messages</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Timezone</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">Africa/Johannesburg (SAST)</p>
              <p className="mt-1 text-xs text-slate-400">Used for scheduling and date calculations</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Reply Email</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">info@sivengineering.co.za</p>
              <p className="mt-1 text-xs text-slate-400">Email address for client correspondence</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Data Retention</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">365 days</p>
              <p className="mt-1 text-xs text-slate-400">How long historical data is preserved</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-700">Max Users</h3>
              </div>
              <p className="text-sm font-medium text-slate-900">25 / 50</p>
              <p className="mt-1 text-xs text-slate-400">Current user count vs license limit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {[
              { label: 'New Service Request', description: 'Get notified when a new service request is submitted', defaultChecked: true },
              { label: 'Client Birthday', description: 'Reminder for upcoming client birthdays', defaultChecked: true },
              { label: 'Invoice Overdue', description: 'Alert when an invoice payment is overdue', defaultChecked: true },
              { label: 'Campaign Completed', description: 'Notify when a marketing campaign finishes', defaultChecked: false },
              { label: 'Quote Approved', description: 'Alert when a quotation is approved by client', defaultChecked: true },
              { label: 'System Alerts', description: 'Critical system notifications and errors', defaultChecked: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <Switch defaultChecked={item.defaultChecked} aria-label={item.label} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5 text-blue-600" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* SMS API */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-slate-700">SMS Gateway</h3>
                <Badge className="bg-green-100 text-green-800" variant="secondary">Active</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">API Key</Label>
                  <Input type="password" defaultValue="sk_sms_••••••••••••" readOnly className="bg-slate-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">Sender ID</Label>
                  <Input defaultValue="SIVENG" readOnly className="bg-slate-50" />
                </div>
              </div>
            </div>

            <Separator />

            {/* WhatsApp API */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                <h3 className="font-semibold text-slate-700">WhatsApp Business API</h3>
                <Badge className="bg-amber-100 text-amber-800" variant="secondary">Pending Setup</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">Business Number</Label>
                  <Input defaultValue="+27 XX XXX XXXX" readOnly className="bg-slate-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">Access Token</Label>
                  <Input type="password" defaultValue="EAA••••••••••••" readOnly className="bg-slate-50" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Email API */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-slate-700">Email SMTP</h3>
                <Badge className="bg-green-100 text-green-800" variant="secondary">Active</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">SMTP Host</Label>
                  <Input defaultValue="smtp.example.com" readOnly className="bg-slate-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">Port</Label>
                  <Input defaultValue="587" readOnly className="bg-slate-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-slate-500">Username</Label>
                  <Input defaultValue="crm@sivengineering.co.za" readOnly className="bg-slate-50" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Key className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

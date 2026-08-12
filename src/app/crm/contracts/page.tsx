import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building2,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default function ContractsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Contract Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage service contracts and maintenance agreements with clients
        </p>
      </div>

      {/* Coming Soon Banner */}
      <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Contract Management Coming Soon
              </h2>
              <p className="mt-1 text-sm text-blue-700">
                We are building a comprehensive contract management module. This will include
                service agreements, maintenance contracts, SLA tracking, renewal reminders,
                and contract documentation.
              </p>
            </div>
          </div>
          <Button variant="outline" className="shrink-0 gap-2 border-blue-200 text-blue-700 hover:bg-blue-100">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Placeholder Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Contracts</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Expired</p>
              <p className="text-2xl font-bold text-slate-900">—</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            Upcoming Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Contract Creation</h3>
              <p className="text-xs text-slate-500">
                Create and manage service agreements with customizable terms and conditions.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Renewal Tracking</h3>
              <p className="text-xs text-slate-500">
                Automated reminders for contract renewals and expiry dates.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">SLA Monitoring</h3>
              <p className="text-xs text-slate-500">
                Track service level agreements and ensure compliance with contract terms.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                <Building2 className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Client Contracts</h3>
              <p className="text-xs text-slate-500">
                View all contracts per client with status history and document attachments.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Expiry Alerts</h3>
              <p className="text-xs text-slate-500">
                Get notified before contracts expire to take timely action.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-slate-700">Reporting</h3>
              <p className="text-xs text-slate-500">
                Contract analytics including revenue, renewal rates, and performance metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

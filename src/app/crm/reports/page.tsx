import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  Wrench,
  MessageSquare,
  TrendingUp,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PieChart,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

export default async function ReportsPage() {
  let totalClients = 0;
  let totalRevenue = 0;
  let totalServiceRequests = 0;
  let totalMessages = 0;
  let activeClients = 0;
  let completedServices = 0;
  let pendingServices = 0;

  try {
    totalClients = await db.client.count();
  } catch { /* empty */ }

  try {
    const invoices = await db.invoice.findMany();
    totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  } catch { /* empty */ }

  try {
    totalServiceRequests = await db.serviceRequest.count();
  } catch { /* empty */ }

  try {
    totalMessages = await db.message.count();
  } catch { /* empty */ }

  try {
    activeClients = await db.client.count({ where: { status: 'active' } });
  } catch { /* empty */ }

  try {
    completedServices = await db.serviceRequest.count({ where: { status: 'completed' } });
  } catch { /* empty */ }

  try {
    pendingServices = await db.serviceRequest.count({ where: { status: 'pending' } });
  } catch { /* empty */ }

  const inactiveClients = totalClients - activeClients;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Comprehensive overview of your CRM performance and key metrics
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Clients</p>
              <p className="text-3xl font-bold text-slate-900">{totalClients}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{activeClients} active</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                From invoice payments
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Wrench className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Service Requests</p>
              <p className="text-3xl font-bold text-slate-900">{totalServiceRequests}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="text-amber-600">{pendingServices} pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Messages</p>
              <p className="text-3xl font-bold text-slate-900">{totalMessages}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                SMS, WhatsApp & Email
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client Growth Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-blue-600" />
              Client Growth Summary
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Active Clients</span>
                  <span className="text-2xl font-bold text-slate-900">{activeClients}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Inactive Clients</span>
                  <span className="text-2xl font-bold text-slate-900">{inactiveClients}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <ArrowDownRight className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Total Clients</span>
                  <span className="text-2xl font-bold text-blue-700">{totalClients}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Active clients are those currently engaged with your services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Performance Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-5 w-5 text-amber-600" />
              Service Performance
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Total Requests</span>
                  <span className="text-2xl font-bold text-slate-900">{totalServiceRequests}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Completed</span>
                  <span className="text-2xl font-bold text-green-700">{completedServices}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Pending</span>
                  <span className="text-2xl font-bold text-amber-700">{pendingServices}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              {totalServiceRequests > 0 && (
                <div className="mt-2 rounded-lg bg-slate-50 p-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Completion Rate</span>
                    <span className="font-medium text-slate-700">
                      {Math.round((completedServices / totalServiceRequests) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${(completedServices / totalServiceRequests) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5 text-green-600" />
              Revenue Summary
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
              <Download className="h-3 w-3" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Total Revenue</span>
                  <span className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Avg per Client</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {totalClients > 0
                      ? formatCurrency(totalRevenue / totalClients)
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">Messages Sent</span>
                  <span className="text-2xl font-bold text-purple-700">{totalMessages}</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Revenue is calculated from paid invoice amounts.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Client Report</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Wrench className="h-5 w-5 text-amber-600" />
              <span className="text-xs">Service Report</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-xs">Revenue Report</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-xs">Message Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

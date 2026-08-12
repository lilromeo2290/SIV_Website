import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Receipt, DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'unpaid':
      return 'bg-red-100 text-red-800';
    case 'partial':
      return 'bg-amber-100 text-amber-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default async function InvoicesPage() {
  let invoices: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    paidAmount: number;
    status: string;
    paymentDate: Date | null;
    createdAt: Date;
    client: {
      fullName: string;
      companyName: string | null;
    } | null;
  }> = [];

  try {
    invoices = await db.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    invoices = [];
  }

  const totalInvoices = invoices.length;
  const unpaidCount = invoices.filter((inv) => inv.status === 'unpaid').length;
  const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Invoice Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage client invoices and payments
          </p>
        </div>
        <Button className="gap-2">
          <Receipt className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-900">{totalInvoices}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Unpaid</p>
              <p className="text-2xl font-bold text-slate-900">{unpaidCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Paid</p>
              <p className="text-2xl font-bold text-slate-900">{paidCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-blue-600" />
            All Invoices
            <Badge variant="secondary">{totalInvoices}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-36">Invoice #</TableHead>
                  <TableHead className="w-44">Client</TableHead>
                  <TableHead className="w-32 text-right">Total Amount</TableHead>
                  <TableHead className="w-32 text-right">Paid Amount</TableHead>
                  <TableHead className="w-32 text-right">Balance</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-36">Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                      No invoices created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => {
                    const balance = invoice.totalAmount - invoice.paidAmount;
                    return (
                      <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-mono text-sm font-medium text-blue-700">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">
                              {invoice.client?.fullName || 'Unknown'}
                            </p>
                            {invoice.client?.companyName && (
                              <p className="text-xs text-slate-500">
                                {invoice.client.companyName}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatCurrency(invoice.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-700">
                          {formatCurrency(invoice.paidAmount)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${balance > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                          {formatCurrency(balance)}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusBadgeVariant(invoice.status)} variant="secondary">
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {invoice.paymentDate ? formatDate(invoice.paymentDate) : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

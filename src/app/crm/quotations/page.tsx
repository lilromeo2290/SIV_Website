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
import { Calculator, FileText, CheckCircle, XCircle, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-700';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default async function QuotationsPage() {
  let quotations: Array<{
    id: string;
    quoteNumber: string;
    items: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    client: {
      fullName: string;
      companyName: string | null;
    } | null;
  }> = [];

  try {
    quotations = await db.quotation.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    quotations = [];
  }

  const totalQuotations = quotations.length;
  const draftCount = quotations.filter((q) => q.status === 'draft').length;
  const approvedCount = quotations.filter((q) => q.status === 'approved').length;
  const totalValue = quotations.reduce((acc, q) => acc + q.totalAmount, 0);

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
            Quotation Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, track, and manage client quotations
          </p>
        </div>
        <Button className="gap-2">
          <Calculator className="h-4 w-4" />
          New Quotation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Quotations</p>
              <p className="text-2xl font-bold text-slate-900">{totalQuotations}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Draft</p>
              <p className="text-2xl font-bold text-slate-900">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Approved</p>
              <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
            All Quotations
            <Badge variant="secondary">{totalQuotations}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-32">Quote #</TableHead>
                  <TableHead className="w-44">Client</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="w-36 text-right">Total Amount</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-36">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                      No quotations created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  quotations.map((quotation) => (
                    <TableRow key={quotation.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-sm font-medium text-blue-700">
                        {quotation.quoteNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">
                            {quotation.client?.fullName || 'Unknown'}
                          </p>
                          {quotation.client?.companyName && (
                            <p className="text-xs text-slate-500">
                              {quotation.client.companyName}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-500">
                        {quotation.items.length > 100
                          ? quotation.items.substring(0, 100) + '...'
                          : quotation.items}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        {formatCurrency(quotation.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadgeVariant(quotation.status)} variant="secondary">
                          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(quotation.createdAt)}
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

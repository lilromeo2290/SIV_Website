'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Download,
  CheckCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  items: string;
  totalAmount: number;
  status: string;
  paidAmount: number;
  paymentDate: string | null;
  createdAt: string;
  client: {
    fullName: string;
    companyName: string | null;
    phone: string;
    email: string | null;
    physicalAddress: string | null;
  } | null;
}

const statusBadgeClass = (status: string) => {
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

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/crm/api/invoices?id=${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setInvoice(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleRecordPayment = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) return;
    setPaying(true);
    setError('');
    try {
      const res = await fetch('/crm/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: invoice?.id,
          paidAmount: (invoice?.paidAmount || 0) + parseFloat(payAmount),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInvoice(updated);
        setPayAmount('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to record payment');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setPaying(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GHS' }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-lg text-slate-500">Invoice not found</p>
        <Button variant="outline" onClick={() => router.push('/crm/invoices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
        </Button>
      </div>
    );
  }

  let lineItems: { description: string; quantity: number; unitPrice: number }[] = [];
  try {
    lineItems = JSON.parse(invoice.items);
  } catch {}

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const balance = invoice.totalAmount - invoice.paidAmount;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar - hidden in print */}
      <div className="print:hidden flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/crm/invoices')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Created {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Card - printable area */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm print:shadow-none print:border-none print:rounded-none">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-6 text-white print:bg-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
                S
              </div>
              <div>
                <h2 className="text-xl font-bold">SIV Engineering & Diagnostics</h2>
                <p className="text-sm text-blue-200">Services LTD</p>
                <div className="mt-2 flex flex-col gap-0.5 text-xs text-blue-200">
                  <span>Community 25, Tema, Greater Accra, Ghana</span>
                  <span>Tel: 233 242 266 935 / 233 20 671 6522</span>
                  <span>Email: info@sivgh.com</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-bold tracking-wide">INVOICE</h3>
              <p className="mt-1 text-sm text-blue-200">#{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="border-b bg-slate-50 px-8 py-4 print:bg-white">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Invoice Date</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
              <Badge className={`mt-1 ${statusBadgeClass(invoice.status)}`} variant="secondary">
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Amount</p>
              <p className="mt-1 text-sm font-bold text-blue-700">{formatCurrency(invoice.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="border-b px-8 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bill To</p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 print:bg-white print:border-slate-300">
            {invoice.client ? (
              <div className="text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{invoice.client.fullName}</p>
                {invoice.client.companyName && <p>{invoice.client.companyName}</p>}
                {invoice.client.physicalAddress && <p className="text-slate-500">{invoice.client.physicalAddress}</p>}
                {invoice.client.phone && <p className="text-slate-500">Tel: {invoice.client.phone}</p>}
                {invoice.client.email && <p className="text-slate-500">{invoice.client.email}</p>}
              </div>
            ) : (
              <p className="text-sm italic text-slate-400">Client details not available</p>
            )}
          </div>
        </div>

        {/* Line Items */}
        <div className="px-8 py-5">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                <th className="pb-3 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Unit Price</th>
                <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => {
                const amount = item.quantity * item.unitPrice;
                return (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 text-sm text-slate-400">{index + 1}</td>
                    <td className="py-3 pl-4 text-sm text-slate-700">{item.description}</td>
                    <td className="py-3 pl-4 text-right text-sm text-slate-700">{item.quantity}</td>
                    <td className="py-3 pl-4 text-right text-sm text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 pl-4 text-right text-sm font-medium text-slate-800">
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t bg-slate-50 px-8 py-5 print:bg-white">
          <div className="ml-auto max-w-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-300 pt-2">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-base font-bold text-blue-700">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-bold text-slate-900">Balance Due</span>
                  <span className={`text-sm font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t px-8 py-5 print:py-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 print:bg-white print:border-slate-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Payment Information</p>
            <div className="space-y-1.5 text-sm text-slate-600">
              <p><span className="font-medium text-slate-700">Bank:</span> GCB Bank</p>
              <p><span className="font-medium text-slate-700">Account Name:</span> SIV Engineering & Diagnostics Services LTD</p>
              <p><span className="font-medium text-slate-700">Account Number:</span> —</p>
              <p><span className="font-medium text-slate-700">Branch:</span> Tema</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-8 py-3 text-center print:bg-white">
          <p className="text-xs text-slate-400">
            Thank you for your business — SIV Engineering & Diagnostics Services LTD
          </p>
        </div>
      </div>

      {/* Record Payment Section - hidden in print */}
      <div className="print:hidden rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Record Payment</h2>
        {error && (
          <p className="mb-3 text-sm text-red-600">{error}</p>
        )}
        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Amount (GHS)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </div>
          <Button
            onClick={handleRecordPayment}
            disabled={paying || !payAmount}
            className="gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            {paying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <DollarSign className="h-4 w-4" />
            )}
            Record Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

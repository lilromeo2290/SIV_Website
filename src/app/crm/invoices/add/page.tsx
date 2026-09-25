'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Client {
  id: string;
  fullName: string;
  companyName: string | null;
  phone: string;
  email: string | null;
  physicalAddress: string | null;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function AddInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [error, setError] = useState('');

  const [clientId, setClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [status, setStatus] = useState('unpaid');
  const [paidAmount, setPaidAmount] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/crm/api/clients');
        if (!res.ok) throw new Error('Failed to fetch clients');
        const data = await res.json();
        if (Array.isArray(data)) setClients(data);
      } catch (err) {
        console.error('Failed to load clients:', err);
      } finally {
        setFetchingClients(false);
      }
    }
    fetchClients();
  }, []);

  useEffect(() => {
    const c = clients.find((cl) => cl.id === clientId);
    setSelectedClient(c || null);
  }, [clientId, clients]);

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };
  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vat = subtotal * 0.0; // No VAT for now, can be adjusted
  const totalAmount = subtotal + vat;
  const balance = totalAmount - (parseFloat(paidAmount) || 0);

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!clientId) { setError('Please select a client'); return; }
    if (items.some((item) => !item.description.trim())) { setError('All items must have a description'); return; }
    setLoading(true);
    try {
      const res = await fetch('/crm/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          items: JSON.stringify(items),
          totalAmount,
          status,
          paidAmount: parseFloat(paidAmount) || 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = `/crm/invoices/${data.id}`;
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create invoice');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/crm/invoices')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Invoice</h1>
            <p className="mt-1 text-sm text-slate-500">Create a professional invoice</p>
          </div>
        </div>
        <Button type="submit" form="invoice-form" disabled={loading} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </div>
          ) : 'Create Invoice'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form id="invoice-form" onSubmit={handleSubmit}>
        {/* Invoice Preview Card */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {/* Company Header - Blue Gradient */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-6 text-white">
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
                <p className="mt-1 text-sm text-blue-200">#{invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details Bar */}
          <div className="border-b bg-slate-50 px-8 py-4">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Invoice Date</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{today}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Date</p>
                <div className="mt-1">
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
                <div className="mt-1">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount Paid (GHS)</p>
                <div className="mt-1">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bill To & Client Selection */}
          <div className="border-b px-8 py-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Client</p>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder={fetchingClients ? 'Loading clients...' : 'Choose a client...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {fetchingClients ? (
                      <SelectItem value="_loading" disabled>Loading...</SelectItem>
                    ) : clients.length === 0 ? (
                      <SelectItem value="_empty" disabled>No clients found — add clients first</SelectItem>
                    ) : (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName}
                          {client.companyName ? ` (${client.companyName})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bill To</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {selectedClient ? (
                    <div className="text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{selectedClient.fullName}</p>
                      {selectedClient.companyName && <p>{selectedClient.companyName}</p>}
                      {selectedClient.physicalAddress && <p className="text-slate-500">{selectedClient.physicalAddress}</p>}
                      {selectedClient.phone && <p className="text-slate-500">Tel: {selectedClient.phone}</p>}
                      {selectedClient.email && <p className="text-slate-500">{selectedClient.email}</p>}
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-400">Select a client to see billing details</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="px-8 py-5">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                  <th className="pb-3 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Description</th>
                  <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                  <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Unit Price</th>
                  <th className="pb-3 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="pb-3 pl-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const amount = item.quantity * item.unitPrice;
                  return (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-400">{index + 1}</td>
                      <td className="py-3 pl-4">
                        <Input
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="h-8 text-sm border-slate-200"
                        />
                      </td>
                      <td className="py-3 pl-4">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="h-8 w-20 text-sm text-right border-slate-200"
                        />
                      </td>
                      <td className="py-3 pl-4">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8 w-28 text-sm text-right border-slate-200"
                        />
                      </td>
                      <td className="py-3 pl-4 text-right text-sm font-medium text-slate-800">
                        GHS {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 pl-4 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="text-slate-300 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addItem}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Line Item
            </button>
          </div>

          {/* Totals Section */}
          <div className="border-t bg-slate-50 px-8 py-5">
            <div className="ml-auto max-w-sm space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">
                  GHS {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {vat > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">VAT (0%)</span>
                  <span className="font-medium text-slate-700">
                    GHS {vat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-slate-300 pt-2">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-base font-bold text-blue-700">
                  GHS {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {parseFloat(paidAmount) > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Amount Paid</span>
                    <span className="font-medium text-green-600">
                      GHS {(parseFloat(paidAmount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-bold text-slate-900">Balance Due</span>
                    <span className="text-sm font-bold text-red-600">
                      GHS {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes & Payment Info */}
          <div className="border-t px-8 py-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Notes / Terms</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Payment terms, bank details, or additional notes..."
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  rows={4}
                />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Payment Information</p>
                <div className="space-y-1.5 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-700">Bank:</span> GCB Bank</p>
                  <p><span className="font-medium text-slate-700">Account Name:</span> SIV Engineering & Diagnostics Services LTD</p>
                  <p><span className="font-medium text-slate-700">Account Number:</span> —</p>
                  <p><span className="font-medium text-slate-700">Branch:</span> Tema</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-slate-50 px-8 py-3 text-center">
            <p className="text-xs text-slate-400">
              Thank you for your business — SIV Engineering & Diagnostics Services LTD
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

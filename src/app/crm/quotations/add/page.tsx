'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calculator,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function AddQuotationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState('');

  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState('draft');
  const [items, setItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    fetch('/crm/api/clients')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setClients(data);
      })
      .catch(() => {});
  }, []);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientId) {
      setError('Please select a client');
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      setError('All items must have a description');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/crm/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          items: JSON.stringify(items),
          totalAmount,
          status,
        }),
      });

      if (res.ok) {
        window.location.href = '/crm/quotations';
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create quotation');
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/crm/quotations')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Quotation</h1>
          <p className="mt-1 text-sm text-slate-500">Create a new quotation for a client</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Line Items */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Quotation Items</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {items.map((item, index) => (
                  <div key={index} className="grid gap-3 sm:grid-cols-[1fr_80px_120px_40px]">
                    <div>
                      {index === 0 && <Label className="mb-1.5 text-xs text-slate-500">Description</Label>}
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      {index === 0 && <Label className="mb-1.5 text-xs text-slate-500">Qty</Label>}
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      {index === 0 && <Label className="mb-1.5 text-xs text-slate-500">Unit Price (GHS)</Label>}
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="gap-2" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Client & Status</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Select Client</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.fullName}
                          {client.companyName ? ` (${client.companyName})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">Summary</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-sm">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="font-bold text-slate-900">
                    GHS {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </div>
              ) : (
                <>
                  <Calculator className="h-4 w-4" />
                  Create Quotation
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

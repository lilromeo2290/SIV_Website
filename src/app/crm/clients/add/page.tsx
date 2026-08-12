'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CLIENT_GROUPS = [
  'Corporate',
  'Industrial',
  'Government',
  'Educational',
  'Healthcare',
  'VIP',
  'Prospective',
  'Inactive',
];

const INDUSTRY_CATEGORIES = [
  'Agriculture',
  'Construction',
  'Education',
  'Energy & Utilities',
  'Financial Services',
  'Government',
  'Healthcare',
  'Hospitality',
  'Manufacturing',
  'Mining',
  'Oil & Gas',
  'Real Estate',
  'Retail',
  'Technology',
  'Telecommunications',
  'Transportation',
  'Other',
];

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [clientType, setClientType] = useState('Individual');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [physicalAddress, setPhysicalAddress] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState('');
  const [industryCategory, setIndustryCategory] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [group, setGroup] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/crm/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientType,
          fullName: fullName.trim(),
          companyName: clientType === 'Company' ? companyName.trim() : '',
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim(),
          physicalAddress: physicalAddress.trim(),
          gpsCoordinates: gpsCoordinates.trim(),
          industryCategory,
          dateOfBirth: dateOfBirth || null,
          anniversaryDate: anniversaryDate || null,
          notes: notes.trim(),
          group: group || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create client.');
      }

      router.push('/crm/clients');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/crm/clients">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add New Client
            </h1>
            <p className="text-sm text-slate-500">
              Fill in the details below to register a new client.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientType">
                  Client Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={clientType}
                  onValueChange={setClientType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {clientType === 'Company' && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Enter contact person name"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. +260 977 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  placeholder="e.g. +260 977 123 456"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="physicalAddress">Physical Address</Label>
                <Input
                  id="physicalAddress"
                  placeholder="Street address, city, country"
                  value={physicalAddress}
                  onChange={(e) => setPhysicalAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                <Input
                  id="gpsCoordinates"
                  placeholder="e.g. -15.3875, 28.3228"
                  value={gpsCoordinates}
                  onChange={(e) => setGpsCoordinates(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">
                Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industryCategory">Industry Category</Label>
                <Select
                  value={industryCategory}
                  onValueChange={setIndustryCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Customer Group</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anniversaryDate">Anniversary Date</Label>
                <Input
                  id="anniversaryDate"
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                placeholder="Any additional notes or information about this client..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/crm/clients">
              <Button
                type="button"
                variant="outline"
                className="border-slate-300"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Create Client'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

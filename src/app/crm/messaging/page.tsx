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
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case 'SMS':
      return 'bg-green-100 text-green-800';
    case 'WhatsApp':
      return 'bg-emerald-100 text-emerald-800';
    case 'Email':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'scheduled':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'sent':
      return <Send className="h-3 w-3" />;
    case 'delivered':
      return <CheckCircle className="h-3 w-3" />;
    case 'failed':
      return <XCircle className="h-3 w-3" />;
    case 'scheduled':
      return <Clock className="h-3 w-3" />;
    default:
      return null;
  }
};

export default async function MessagingPage() {
  let messages: Array<{
    id: string;
    type: string;
    recipient: string;
    subject: string | null;
    content: string;
    status: string;
    scheduledAt: Date | null;
    sentAt: Date;
  }> = [];

  try {
    messages = await db.message.findMany({
      orderBy: { sentAt: 'desc' },
      take: 100,
    });
  } catch {
    messages = [];
  }

  const totalSent = messages.filter((m) => m.status === 'sent' || m.status === 'delivered').length;
  const smsCount = messages.filter((m) => m.type === 'SMS').length;
  const whatsappCount = messages.filter((m) => m.type === 'WhatsApp').length;
  const emailCount = messages.filter((m) => m.type === 'Email').length;

  const sentMessages = messages.filter((m) => m.status !== 'scheduled');
  const scheduledMessages = messages.filter((m) => m.status === 'scheduled');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Messaging Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage SMS, WhatsApp, and Email communications with clients
          </p>
        </div>
        <Link href="/crm/messaging/compose">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Sent</p>
              <p className="text-2xl font-bold text-slate-900">{totalSent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">SMS Count</p>
              <p className="text-2xl font-bold text-slate-900">{smsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">WhatsApp Count</p>
              <p className="text-2xl font-bold text-slate-900">{whatsappCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Email Count</p>
              <p className="text-2xl font-bold text-slate-900">{emailCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sent Messages Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5 text-blue-600" />
            Sent Messages
          </CardTitle>
          <Badge variant="secondary">{sentMessages.length} messages</Badge>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="w-36">Recipient</TableHead>
                  <TableHead className="w-48">Subject</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-44">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                      No sent messages yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  sentMessages.map((msg) => (
                    <TableRow key={msg.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Badge className={typeBadgeVariant(msg.type)} variant="secondary">
                          {msg.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {msg.recipient}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {msg.subject || '—'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-500">
                        {msg.content.length > 80
                          ? msg.content.substring(0, 80) + '...'
                          : msg.content}
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${statusBadgeVariant(msg.status)}`} variant="secondary">
                          {statusIcon(msg.status)}
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(msg.sentAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Templates Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            Message Templates
          </CardTitle>
          <Badge variant="secondary">Ready to use</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800" variant="secondary">SMS</Badge>
                <span className="text-sm font-medium text-slate-700">Service Reminder</span>
              </div>
              <p className="text-xs text-slate-500">
                Dear {`{ClientName}`}, your {`{ServiceDate}`} appointment with {`{EngineerName}`} at SIV Engineering is confirmed...
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-emerald-100 text-emerald-800" variant="secondary">WhatsApp</Badge>
                <span className="text-sm font-medium text-slate-700">Follow-up</span>
              </div>
              <p className="text-xs text-slate-500">
                Hi {`{ClientName}`}, we hope you&apos;re satisfied with our service. {`{CompanyName}`} — your feedback matters...
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800" variant="secondary">Email</Badge>
                <span className="text-sm font-medium text-slate-700">Invoice Alert</span>
              </div>
              <p className="text-xs text-slate-500">
                Dear {`{ClientName}`}, please find attached your invoice from {`{CompanyName}`}. Payment is due within 30 days...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-amber-600" />
            Scheduled Messages
          </CardTitle>
          <Badge variant="secondary">{scheduledMessages.length} scheduled</Badge>
        </CardHeader>
        <CardContent>
          {scheduledMessages.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">No scheduled messages</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-24">Type</TableHead>
                    <TableHead className="w-36">Recipient</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead className="w-44">Scheduled For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledMessages.map((msg) => (
                    <TableRow key={msg.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <Badge className={typeBadgeVariant(msg.type)} variant="secondary">
                          {msg.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {msg.recipient}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-500">
                        {msg.content.length > 80
                          ? msg.content.substring(0, 80) + '...'
                          : msg.content}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {msg.scheduledAt ? formatDate(msg.scheduledAt) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

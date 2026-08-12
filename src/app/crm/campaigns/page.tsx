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
import { Megaphone, Send, CheckCircle, XCircle, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-700';
    case 'scheduled':
      return 'bg-amber-100 text-amber-800';
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default async function CampaignsPage() {
  let campaigns: Array<{
    id: string;
    name: string;
    type: string;
    targetGroup: string | null;
    status: string;
    sentCount: number;
    deliveredCount: number;
    failedCount: number;
    responseCount: number;
    createdAt: Date;
  }> = [];

  try {
    campaigns = await db.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    campaigns = [];
  }

  const totalCampaigns = campaigns.length;
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + c.failedCount, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Marketing Campaigns
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage marketing campaigns across SMS, WhatsApp, and Email
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Megaphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-slate-900">{totalCampaigns}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Send className="h-5 w-5 text-blue-600" />
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
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Delivered</p>
              <p className="text-2xl font-bold text-slate-900">{totalDelivered}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Failed</p>
              <p className="text-2xl font-bold text-slate-900">{totalFailed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-blue-600" />
            All Campaigns
            <Badge variant="secondary">{totalCampaigns}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Campaign Name</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead className="w-36">Target Group</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-20 text-center">Sent</TableHead>
                  <TableHead className="w-20 text-center">Delivered</TableHead>
                  <TableHead className="w-20 text-center">Failed</TableHead>
                  <TableHead className="w-36">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-slate-400">
                      No campaigns created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-900">
                        {campaign.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {campaign.targetGroup || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadgeVariant(campaign.status)} variant="secondary">
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-slate-700">
                        {campaign.sentCount}
                      </TableCell>
                      <TableCell className="text-center font-medium text-green-700">
                        {campaign.deliveredCount}
                      </TableCell>
                      <TableCell className="text-center font-medium text-red-700">
                        {campaign.failedCount}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(campaign.createdAt)}
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

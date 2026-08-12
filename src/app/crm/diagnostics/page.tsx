import Link from 'next/link'
import { db } from '@/lib/db'
import { Activity, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  assigned: {
    label: 'Assigned',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  awaiting_approval: {
    label: 'Awaiting Approval',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  closed: {
    label: 'Closed',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

export default async function DiagnosticsPage() {
  const diagnosticRecords = await db.serviceRequest.findMany({
    where: {
      diagnosticFindings: { not: null },
    },
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Diagnostics
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View diagnostic findings and recommendations for service requests.
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                <Activity className="h-5 w-5 text-teal-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Diagnostics
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {diagnosticRecords.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <FileText className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  With Recommendations
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {diagnosticRecords.filter(
                    (r) => r.recommendations && r.recommendations.trim().length > 0
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnostics Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Service #
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Client
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Equipment
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Findings
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Recommendations
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Completion Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diagnosticRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-slate-400"
                    >
                      No diagnostic records found. Diagnostics will appear here
                      once findings are recorded for service requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  diagnosticRecords.map((record) => {
                    const statusInfo = statusConfig[record.status] || {
                      label: record.status,
                      className:
                        'bg-slate-100 text-slate-600 border-slate-200',
                    }

                    return (
                      <TableRow key={record.id}>
                        <TableCell className="px-4 font-medium text-slate-900">
                          {record.serviceNumber}
                        </TableCell>
                        <TableCell className="px-4 text-slate-700">
                          {record.client.fullName}
                        </TableCell>
                        <TableCell className="px-4 text-slate-700">
                          {record.equipmentName}
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate px-4 text-slate-600"
                          title={record.diagnosticFindings || undefined}
                        >
                          {record.diagnosticFindings}
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate px-4 text-slate-600"
                          title={record.recommendations || undefined}
                        >
                          {record.recommendations || '—'}
                        </TableCell>
                        <TableCell className="px-4">
                          <Badge
                            variant="outline"
                            className={statusInfo.className}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 text-slate-500">
                          {record.completionDate
                            ? record.completionDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

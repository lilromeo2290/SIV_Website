import Link from 'next/link'
import { db } from '@/lib/db'
import { Plus, Wrench, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
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

export default async function ServicesPage() {
  const serviceRequests = await db.serviceRequest.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  const totalRequests = serviceRequests.length
  const pendingCount = serviceRequests.filter(
    (r) => r.status === 'pending'
  ).length
  const inProgressCount = serviceRequests.filter(
    (r) => r.status === 'in_progress'
  ).length
  const completedCount = serviceRequests.filter(
    (r) => r.status === 'completed' || r.status === 'closed'
  ).length

  const stats = [
    {
      label: 'Total Requests',
      value: totalRequests,
      icon: Wrench,
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
    },
    {
      label: 'Pending',
      value: pendingCount,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: Loader2,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Service Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track all equipment service and repair requests.
          </p>
        </div>
        <Button asChild>
          <Link href="/crm/services/add">
            <Plus className="mr-2 h-4 w-4" />
            New Service Request
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={`border ${stat.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Service Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Service #
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Client Name
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Equipment
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Type
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Problem
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Engineer
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Status
                  </TableHead>
                  <TableHead className="px-4 font-semibold text-slate-600">
                    Date Received
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-slate-400"
                    >
                      No service requests found. Create your first request to
                      get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  serviceRequests.map((request) => {
                    const statusInfo = statusConfig[request.status] || {
                      label: request.status,
                      className: 'bg-slate-100 text-slate-600 border-slate-200',
                    }

                    return (
                      <TableRow key={request.id}>
                        <TableCell className="px-4 font-medium text-slate-900">
                          {request.serviceNumber}
                        </TableCell>
                        <TableCell className="px-4 text-slate-700">
                          {request.client.fullName}
                        </TableCell>
                        <TableCell className="px-4 text-slate-700">
                          {request.equipmentName}
                        </TableCell>
                        <TableCell className="px-4 text-slate-500">
                          {request.equipmentType || '—'}
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate px-4 text-slate-600"
                          title={request.problemDescription}
                        >
                          {request.problemDescription}
                        </TableCell>
                        <TableCell className="px-4 text-slate-500">
                          {request.assignedEngineer || '—'}
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
                          {request.dateReceived.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
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

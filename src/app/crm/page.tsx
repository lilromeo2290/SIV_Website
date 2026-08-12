import { db } from '@/lib/db'
import {
  Users,
  UserPlus,
  Wrench,
  CheckCircle,
  Activity,
  DollarSign,
  MessageSquare,
  Clock,
  Plus,
  Send,
  Calculator,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

// ── Data Fetching ──────────────────────────────────────────────

async function getTotalClients() {
  try {
    return await db.client.count()
  } catch {
    return 0
  }
}

async function getNewClientsThisMonth() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return await db.client.count({
      where: { registrationDate: { gte: startOfMonth } },
    })
  } catch {
    return 0
  }
}

async function getActiveServiceRequests() {
  try {
    return await db.serviceRequest.count({
      where: {
        status: { notIn: ['completed', 'closed'] },
      },
    })
  } catch {
    return 0
  }
}

async function getCompletedJobs() {
  try {
    return await db.serviceRequest.count({
      where: { status: 'completed' },
    })
  } catch {
    return 0
  }
}

async function getPendingDiagnostics() {
  try {
    return await db.serviceRequest.count({
      where: { status: 'pending' },
    })
  } catch {
    return 0
  }
}

async function getTotalRevenue() {
  try {
    const result = await db.invoice.aggregate({
      _sum: { paidAmount: true },
    })
    return result._sum.paidAmount ?? 0
  } catch {
    return 0
  }
}

async function getMessagesSent() {
  try {
    return await db.message.count()
  } catch {
    return 0
  }
}

async function getUpcomingFollowUps() {
  try {
    return await db.followUp.count({
      where: { status: 'pending' },
    })
  } catch {
    return 0
  }
}

async function getRecentServiceRequests() {
  try {
    return await db.serviceRequest.findMany({
      take: 5,
      orderBy: { dateReceived: 'desc' },
      include: { client: { select: { fullName: true } } },
    })
  } catch {
    return []
  }
}

async function getRecentFollowUps() {
  try {
    return await db.followUp.findMany({
      take: 5,
        orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

async function getRecentMessages() {
  try {
    return await db.message.findMany({
      take: 5,
      orderBy: { sentAt: 'desc' },
    })
  } catch {
    return []
  }
}

// ── Helpers ─────────────────────────────────────────────────────

const statusBadge: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  awaiting_approval: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  scheduled: 'bg-purple-100 text-purple-800',
}

function badge(status: string) {
  const cls = statusBadge[status] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function fmtDate(d: Date | null | undefined) {
  if (!d) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

// ── Page ────────────────────────────────────────────────────────

export default async function CRMPage() {
  const [
    totalClients,
    newClientsThisMonth,
    activeServiceRequests,
    completedJobs,
    pendingDiagnostics,
    totalRevenue,
    messagesSent,
    upcomingFollowUps,
    recentServiceRequests,
    recentFollowUps,
    recentMessages,
  ] = await Promise.all([
    getTotalClients(),
    getNewClientsThisMonth(),
    getActiveServiceRequests(),
    getCompletedJobs(),
    getPendingDiagnostics(),
    getTotalRevenue(),
    getMessagesSent(),
    getUpcomingFollowUps(),
    getRecentServiceRequests(),
    getRecentFollowUps(),
    getRecentMessages(),
  ])

  const stats = [
    { label: 'Total Clients', value: totalClients, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'New Clients This Month', value: newClientsThisMonth, icon: UserPlus, color: 'bg-green-100 text-green-600' },
    { label: 'Active Service Requests', value: activeServiceRequests, icon: Wrench, color: 'bg-orange-100 text-orange-600' },
    { label: 'Completed Jobs', value: completedJobs, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Diagnostics', value: pendingDiagnostics, icon: Activity, color: 'bg-amber-100 text-amber-600' },
    { label: 'Total Revenue', value: fmtCurrency(totalRevenue), icon: DollarSign, color: 'bg-emerald-100 text-emerald-600', raw: true },
    { label: 'Messages Sent', value: messagesSent, icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
    { label: 'Upcoming Follow-ups', value: upcomingFollowUps, icon: Clock, color: 'bg-red-100 text-red-600' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back to SIV Engineering CRM. Here is your overview.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-slate-900">
                {s.raw ? s.value : (s.value as number).toLocaleString()}
              </p>
              <p className="truncate text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Section ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Service Requests */}
        <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Service Requests</h2>

          {recentServiceRequests.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No data</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="pb-3 pr-4">Service #</th>
                    <th className="pb-3 pr-4">Client</th>
                    <th className="pb-3 pr-4">Equipment</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentServiceRequests.map((sr) => (
                    <tr key={sr.id} className="transition-colors hover:bg-slate-50">
                      <td className="py-3 pr-4 font-medium text-slate-700">{sr.serviceNumber}</td>
                      <td className="py-3 pr-4 text-slate-600">{sr.client.fullName}</td>
                      <td className="max-w-[180px] truncate py-3 pr-4 text-slate-600">{sr.equipmentName}</td>
                      <td className="py-3 pr-4">{badge(sr.status)}</td>
                      <td className="whitespace-nowrap py-3 text-slate-500">{fmtDate(sr.dateReceived)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick Actions + Follow-ups */}
        <aside className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/crm/clients"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Plus className="h-4 w-4" /> Add Client
              </a>
              <a
                href="/crm/service-requests"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Wrench className="h-4 w-4" /> New Service Request
              </a>
              <a
                href="/crm/messages"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Send className="h-4 w-4" /> Send Message
              </a>
              <a
                href="/crm/quotations"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Calculator className="h-4 w-4" /> Create Quotation
              </a>
            </div>
          </div>

          {/* Upcoming Follow-ups */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Upcoming Follow-ups</h2>

            {recentFollowUps.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No data</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recentFollowUps.map((fu) => (
                  <li key={fu.id} className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">{fu.description}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{fu.type} &middot; {fmtDate(fu.dueDate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {/* ── Bottom Section: Recent Messages ────────────────────── */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Recent Messages</h2>

        {recentMessages.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Recipient</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="transition-colors hover:bg-slate-50">
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          msg.type === 'SMS'
                            ? 'bg-blue-100 text-blue-800'
                            : msg.type === 'WhatsApp'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {msg.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{msg.recipient}</td>
                    <td className="py-3 pr-4">{badge(msg.status)}</td>
                    <td className="whitespace-nowrap py-3 text-slate-500">{fmtDate(msg.sentAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

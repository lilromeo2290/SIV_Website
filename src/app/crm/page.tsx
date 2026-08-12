import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Calendar, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getQuotes() {
  try {
    return await db.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getAppointments() {
  try {
    return await db.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function CRMPage() {
  const quotes = await getQuotes()
  const appointments = await getAppointments()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Website
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-2xl font-bold">CRM Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            SIV Engineering &amp; Diagnostics Services LTD
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quotes.length}</p>
                <p className="text-sm text-muted-foreground">Total Quotes</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {quotes.filter((q) => q.status === 'pending').length +
                    appointments.filter((a) => a.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set([
                    ...quotes.map((q) => q.phone),
                    ...appointments.map((a) => a.phone),
                  ]).size}
                </p>
                <p className="text-sm text-muted-foreground">Unique Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Requests */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="size-5 text-blue-600" />
            Quote Requests ({quotes.length})
          </h2>
          <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
            {quotes.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No quote requests yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Email</th>
                    <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">Vehicle</th>
                    <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Service</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((q) => (
                    <tr key={q.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{q.name}</td>
                      <td className="px-4 py-3">{q.phone}</td>
                      <td className="hidden px-4 py-3 md:table-cell">{q.email}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        {q.vehicleMake} {q.vehicleModel} ({q.vehicleYear})
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">{q.service}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            q.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : q.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : q.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Appointments */}
        <div>
          <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
            <Calendar className="size-5 text-orange-600" />
            Appointments ({appointments.length})
          </h2>
          <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No appointments yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Vehicle</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Time</th>
                    <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Service</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{a.name}</td>
                      <td className="px-4 py-3">{a.phone}</td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {a.vehicleMake} {a.vehicleModel} ({a.vehicleYear})
                      </td>
                      <td className="px-4 py-3">{a.preferredDate}</td>
                      <td className="px-4 py-3">{a.preferredTime}</td>
                      <td className="hidden px-4 py-3 sm:table-cell">{a.service}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            a.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : a.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : a.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

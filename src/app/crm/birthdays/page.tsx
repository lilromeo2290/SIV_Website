import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cake, Heart, Phone, MessageSquare, Gift } from 'lucide-react';

export const dynamic = 'force-dynamic';

function parseDate(dateStr: string): { month: number; day: number; year?: number } | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return { month: d.getMonth() + 1, day: d.getDate(), year: d.getFullYear() };
  } catch {
    return null;
  }
}

function getMonthName(month: number): string {
  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month] || '';
}

export default async function BirthdaysPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  let clients: Array<{
    id: string;
    fullName: string;
    phone: string;
    whatsappNumber: string | null;
    email: string | null;
    dateOfBirth: string | null;
    anniversaryDate: string | null;
    companyName: string | null;
  }> = [];

  try {
    clients = await db.client.findMany({
      where: {
        OR: [
          { dateOfBirth: { not: null } },
          { anniversaryDate: { not: null } },
        ],
      },
    });
  } catch {
    clients = [];
  }

  // Separate birthdays and anniversaries for this month
  const birthdaysThisMonth = clients
    .filter((c) => {
      const parsed = parseDate(c.dateOfBirth!);
      return parsed && parsed.month === currentMonth;
    })
    .map((c) => {
      const parsed = parseDate(c.dateOfBirth!);
      return {
        ...c,
        eventDay: parsed!.day,
        eventType: 'birthday' as const,
      };
    })
    .sort((a, b) => a.eventDay - b.eventDay);

  const anniversariesThisMonth = clients
    .filter((c) => {
      const parsed = parseDate(c.anniversaryDate!);
      return parsed && parsed.month === currentMonth;
    })
    .map((c) => {
      const parsed = parseDate(c.anniversaryDate!);
      return {
        ...c,
        eventDay: parsed!.day,
        eventType: 'anniversary' as const,
      };
    })
    .sort((a, b) => a.eventDay - b.eventDay);

  const totalBirthdays = clients.filter((c) => c.dateOfBirth).length;
  const totalAnniversaries = clients.filter((c) => c.anniversaryDate).length;

  const birthdayTemplate = `Happy Birthday, {ClientName}! 🎂
Wishing you a wonderful day filled with joy and happiness.
From all of us at SIV Engineering.`;

  const anniversaryTemplate = `Happy Anniversary, {ClientName}! 🎉
Thank you for being a valued part of the SIV Engineering family.
We look forward to many more years together.`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Birthday & Anniversary Automation
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Automatically track and send greetings for client birthdays and anniversaries
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100">
              <Cake className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Birthdays</p>
              <p className="text-2xl font-bold text-slate-900">{totalBirthdays}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Anniversaries</p>
              <p className="text-2xl font-bold text-slate-900">{totalAnniversaries}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-2xl font-bold text-slate-900">{birthdaysThisMonth.length + anniversariesThisMonth.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Messages Sent</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Birthdays This Month */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cake className="h-5 w-5 text-pink-600" />
            Birthdays in {getMonthName(currentMonth)}
            <Badge variant="secondary">{birthdaysThisMonth.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {birthdaysThisMonth.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">No birthdays this month</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {birthdaysThisMonth.map((client) => (
                <div
                  key={client.id}
                  className="rounded-lg border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.fullName}</h3>
                      {client.companyName && (
                        <p className="text-sm text-slate-500">{client.companyName}</p>
                      )}
                    </div>
                    <Badge className="bg-pink-100 text-pink-800" variant="secondary">
                      <Cake className="mr-1 h-3 w-3" />
                      Birthday
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      🎂 {getMonthName(currentMonth)} {client.eventDay}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="gap-2 text-pink-700 hover:bg-pink-50 hover:text-pink-800">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Send Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anniversaries This Month */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-red-600" />
            Anniversaries in {getMonthName(currentMonth)}
            <Badge variant="secondary">{anniversariesThisMonth.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {anniversariesThisMonth.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <p className="text-sm text-slate-400">No anniversaries this month</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {anniversariesThisMonth.map((client) => (
                <div
                  key={client.id}
                  className="rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.fullName}</h3>
                      {client.companyName && (
                        <p className="text-sm text-slate-500">{client.companyName}</p>
                      )}
                    </div>
                    <Badge className="bg-red-100 text-red-800" variant="secondary">
                      <Heart className="mr-1 h-3 w-3" />
                      Anniversary
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      🎉 {getMonthName(currentMonth)} {client.eventDay}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="gap-2 text-red-700 hover:bg-red-50 hover:text-red-800">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Send Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Message Templates</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cake className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-semibold text-slate-700">Birthday Template</span>
            </div>
            <pre className="whitespace-pre-wrap rounded bg-white p-3 text-sm text-slate-600">
              {birthdayTemplate}
            </pre>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-slate-700">Anniversary Template</span>
            </div>
            <pre className="whitespace-pre-wrap rounded bg-white p-3 text-sm text-slate-600">
              {anniversaryTemplate}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { db } from '@/lib/db';
import ClientListClient from './ClientListClient';

export const dynamic = 'force-dynamic';

export type ClientRow = {
  id: string;
  clientId: string;
  clientType: string;
  fullName: string;
  companyName: string | null;
  phone: string;
  email: string | null;
  status: string;
  group: string | null;
  createdAt: string;
};

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serialized: ClientRow[] = clients.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    clientType: c.clientType,
    fullName: c.fullName,
    companyName: c.companyName,
    phone: c.phone,
    email: c.email,
    status: c.status,
    group: c.group,
    createdAt: c.createdAt.toISOString(),
  }));

  return <ClientListClient clients={serialized} />;
}

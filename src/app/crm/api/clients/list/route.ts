import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clients = await db.client.findMany({
      select: {
        id: true,
        fullName: true,
        phone: true,
      },
      orderBy: { fullName: 'asc' },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Failed to fetch clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

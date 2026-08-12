import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const services = await db.serviceRequest.findMany({
      include: {
        client: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to fetch service requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      equipmentName,
      equipmentType,
      serialNumber,
      problemDescription,
      assignedEngineer,
    } = body

    if (!clientId || !equipmentName || !problemDescription) {
      return NextResponse.json(
        { error: 'Client, equipment name, and problem description are required' },
        { status: 400 }
      )
    }

    // Auto-generate service number
    const count = await db.serviceRequest.count()
    const paddedNumber = String(count + 1).padStart(4, '0')
    const serviceNumber = `SRV-${paddedNumber}`

    const serviceRequest = await db.serviceRequest.create({
      data: {
        serviceNumber,
        clientId,
        equipmentName,
        equipmentType: equipmentType || null,
        serialNumber: serialNumber || null,
        problemDescription,
        assignedEngineer: assignedEngineer || null,
        status: 'pending',
      },
      include: {
        client: true,
      },
    })

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (error) {
    console.error('Failed to create service request:', error)
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    )
  }
}

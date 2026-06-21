import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      serviceType,
      message,
    } = body

    if (
      !name ||
      !email ||
      !phone ||
      !vehicleMake ||
      !vehicleModel ||
      !vehicleYear ||
      !serviceType
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const quoteRequest = await db.quoteRequest.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        vehicleMake: String(vehicleMake).trim(),
        vehicleModel: String(vehicleModel).trim(),
        vehicleYear: String(vehicleYear).trim(),
        service: String(serviceType).trim(),
        message: message ? String(message).trim() : null,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Quote request received successfully', data: quoteRequest },
      { status: 200 }
    )
  } catch (error) {
    console.error('Quote request error:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
}

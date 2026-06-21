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
      preferredDate,
      preferredTime,
      message,
    } = body

    if (
      !name ||
      !email ||
      !phone ||
      !vehicleMake ||
      !vehicleModel ||
      !vehicleYear ||
      !serviceType ||
      !preferredDate ||
      !preferredTime
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        vehicleMake: String(vehicleMake).trim(),
        vehicleModel: String(vehicleModel).trim(),
        vehicleYear: String(vehicleYear).trim(),
        service: String(serviceType).trim(),
        preferredDate: String(preferredDate).trim(),
        preferredTime: String(preferredTime).trim(),
        message: message ? String(message).trim() : null,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Appointment booked successfully', data: appointment },
      { status: 200 }
    )
  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    )
  }
}

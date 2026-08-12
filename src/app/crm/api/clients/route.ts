import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      clientType,
      fullName,
      companyName,
      contactPerson,
      phone,
      whatsappNumber,
      email,
      physicalAddress,
      gpsCoordinates,
      industryCategory,
      dateOfBirth,
      anniversaryDate,
      notes,
      group,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone number are required.' },
        { status: 400 }
      );
    }

    const count = await db.client.count();
    const paddedNumber = String(count + 1).padStart(4, '0');
    const clientId = `SIV-${paddedNumber}`;

    const client = await db.client.create({
      data: {
        clientId,
        clientType: clientType || 'Individual',
        fullName,
        companyName: companyName || null,
        contactPerson: contactPerson || null,
        phone,
        whatsappNumber: whatsappNumber || null,
        email: email || null,
        physicalAddress: physicalAddress || null,
        gpsCoordinates: gpsCoordinates || null,
        industryCategory: industryCategory || null,
        dateOfBirth: dateOfBirth || null,
        anniversaryDate: anniversaryDate || null,
        notes: notes || null,
        group: group || null,
        status: 'active',
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client. Please try again.' },
      { status: 500 }
    );
  }
}

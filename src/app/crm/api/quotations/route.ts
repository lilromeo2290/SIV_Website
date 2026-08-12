import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function generateQuoteNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `QUO-${num}`;
}

export async function GET() {
  try {
    const quotations = await db.quotation.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, items, totalAmount, status } = body;

    if (!clientId || !items || totalAmount === undefined) {
      return NextResponse.json(
        { error: 'ClientId, items, and totalAmount are required' },
        { status: 400 }
      );
    }

    let quoteNumber = generateQuoteNumber();

    // Ensure uniqueness
    let exists = await db.quotation.findUnique({ where: { quoteNumber } });
    while (exists) {
      quoteNumber = generateQuoteNumber();
      exists = await db.quotation.findUnique({ where: { quoteNumber } });
    }

    const quotation = await db.quotation.create({
      data: {
        quoteNumber,
        clientId,
        items,
        totalAmount: parseFloat(totalAmount),
        status: status || 'draft',
      },
      include: { client: true },
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

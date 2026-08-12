import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function generateInvoiceNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `INV-${num}`;
}

export async function GET() {
  try {
    const invoices = await db.invoice.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, quotationId, items, totalAmount, status, paidAmount } = body;

    if (!clientId || !items || totalAmount === undefined) {
      return NextResponse.json(
        { error: 'ClientId, items, and totalAmount are required' },
        { status: 400 }
      );
    }

    let invoiceNumber = generateInvoiceNumber();

    // Ensure uniqueness
    let exists = await db.invoice.findUnique({ where: { invoiceNumber } });
    while (exists) {
      invoiceNumber = generateInvoiceNumber();
      exists = await db.invoice.findUnique({ where: { invoiceNumber } });
    }

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        quotationId: quotationId || null,
        clientId,
        items,
        totalAmount: parseFloat(totalAmount),
        status: status || 'unpaid',
        paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
      },
      include: { client: true, quotation: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

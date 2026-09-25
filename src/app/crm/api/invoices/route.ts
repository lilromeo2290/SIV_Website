import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function generateInvoiceNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `INV-${num}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch single invoice
      const invoice = await db.invoice.findUnique({
        where: { id },
        include: { client: true, quotation: true },
      });
      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      return NextResponse.json(invoice);
    }

    // Fetch all invoices
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, paidAmount, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const existing = await db.invoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const newPaidAmount = paidAmount !== undefined ? parseFloat(paidAmount) : existing.paidAmount;
    const newStatus = status || (newPaidAmount >= existing.totalAmount ? 'paid' : newPaidAmount > 0 ? 'partial' : 'unpaid');

    const invoice = await db.invoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        paymentDate: newStatus === 'paid' ? new Date() : existing.paymentDate,
      },
      include: { client: true, quotation: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { sentAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, recipient, recipientGroup, subject, content, scheduledAt } = body;

    if (!type || !recipient || !content) {
      return NextResponse.json(
        { error: 'Type, recipient, and content are required' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        type,
        recipient,
        recipientGroup: recipientGroup || null,
        subject: subject || null,
        content,
        status: scheduledAt ? 'scheduled' : 'sent',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

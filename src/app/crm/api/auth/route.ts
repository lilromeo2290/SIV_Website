import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode('siv-crm-secret-key-2024-secure');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email or name
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: email },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Simple password check (plain text for now)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Account is inactive or suspended. Contact admin.' }, { status: 403 });
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      modules: user.modules,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        modules: user.modules,
      },
      message: 'Login successful',
    });

    response.cookies.set('crm-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('crm-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

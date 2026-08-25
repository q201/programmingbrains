
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: string | object | Buffer): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): jwt.JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export type Role = 'USER' | 'ADMIN' | 'user' | 'admin';

export type AuthenticatedUser = {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
};

export function withAuth<T extends unknown[] = unknown[]>(
  handler: (req: NextRequest, user: AuthenticatedUser, ...args: T) => Promise<NextResponse | Response>,
  requiredRoles: Role[]
) {
  return async (req: NextRequest, ...args: T) => {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as (jwt.JwtPayload & { id: string }) | null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userRole = (user.role as string).toLowerCase() as Role;
    const normalizedRequiredRoles = requiredRoles.map(r => r.toLowerCase());

    if (requiredRoles.length > 0 && !normalizedRequiredRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, { id: user.id, role: userRole, name: user.name, email: user.email }, ...args);
  };
}


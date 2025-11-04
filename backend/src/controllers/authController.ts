import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required');

const parseExpiresIn = (value: string): number => {
  const match = value.match(/^(\d+)([smhdwMy])$/);
  if (!match) return 3600;
  const num = parseInt(match[1], 10);
  const unit = match[2];
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, M: 2592000, y: 31536000 };
  return num * (units[unit] || 3600);
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role = 'client' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Required fields missing' });

  try {
    const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, 1) RETURNING id, name, email, role',
      [name, email, hashed, role]
    );

    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: parseExpiresIn(process.env.JWT_EXPIRES_IN || '1h')
    });

    await db.query('INSERT INTO login_logs (user_id, role) VALUES ($1, $2)', [user.id, user.role]);

    res.status(201).json({ message: 'Registered', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: parseExpiresIn(process.env.JWT_EXPIRES_IN || '1h')
    });

    await db.query('INSERT INTO login_logs (user_id, role) VALUES ($1, $2)', [user.id, user.role]);

    res.json({ message: 'Login success', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
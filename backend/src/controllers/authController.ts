// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db';
import { User, AuthenticatedRequest } from '../types';

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

const generateJwtToken = (user: User): string => {
  const expiresIn = parseExpiresIn(process.env.JWT_EXPIRES_IN || '1h');
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn }
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role = 'client' } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  try {
    const { rowCount } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if ((rowCount ?? 0) > 0) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role, status, created_at) VALUES ($1, $2, $3, $4, 1, NOW()) RETURNING id, name, email, role',
      [name, email, hashed, role]
    );

    const user = rows[0];
    const token = generateJwtToken(user);

    await db.query('INSERT INTO login_logs (user_id, role, login_at) VALUES ($1, $2, NOW())', [user.id, user.role]);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateJwtToken(user);
    await db.query('INSERT INTO login_logs (user_id, role, login_at) VALUES ($1, $2, NOW())', [user.id, user.role]);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

interface ChartRow {
  date: string;
  count: string | number;
}

export const getDashboardData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { rows: registerData } = await db.query<ChartRow>(
      "SELECT DATE(created_at) as date, COUNT(*) as count FROM users WHERE role = 'client' GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7"
    );
    const { rows: loginData } = await db.query<ChartRow>(
      "SELECT DATE(login_at) as date, COUNT(*) as count FROM login_logs WHERE role = 'client' GROUP BY DATE(login_at) ORDER BY date DESC LIMIT 7"
    );

    const totalRegs = await db.query<{ total: string }>("SELECT COUNT(*) as total FROM users WHERE role = 'client'");
    const totalLogins = await db.query<{ total: string }>("SELECT COUNT(*) as total FROM login_logs WHERE role = 'client'");

    res.json({
      registerData: registerData.map((r: ChartRow) => ({ date: r.date, count: Number(r.count) })),
      loginData: loginData.map((r: ChartRow) => ({ date: r.date, count: Number(r.count) })),
      totalRegisters: Number(totalRegs.rows[0]?.total ?? 0),
      totalLogins: Number(totalLogins.rows[0]?.total ?? 0),
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

interface RecentActivityRow {
  name: string;
  role: string;
  login_at: string;
}

export const getRecentActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { rows } = await db.query<RecentActivityRow>(
      'SELECT u.name, l.role, l.login_at FROM login_logs l JOIN users u ON l.user_id = u.id ORDER BY l.login_at DESC LIMIT 3'
    );
    const activities = rows.map((r: RecentActivityRow) => ({
      message: `User ${r.name} (${r.role}) logged in`,
      timestamp: r.login_at,
    }));
    res.json(activities);
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};
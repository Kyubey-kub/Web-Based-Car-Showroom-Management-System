// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import db from '../config/db';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /api/users/admin-email
router.get('/admin-email', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT email FROM users WHERE role = $1 LIMIT 1', ['admin']);
    res.json({ success: true, email: rows[0]?.email || 'admin@example.com' });
  } catch (error) {
    console.error('[GET /admin-email]', error);
    res.json({ success: true, email: 'admin@example.com' });
  }
});

// GET /api/users
router.get('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT id, name, email, role, 
             CASE WHEN status = 1 THEN 'Active' ELSE 'Inactive' END as status
      FROM users ORDER BY created_at DESC
    `);
    res.json(rows.map((u: any) => ({
      id: u.id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
    })));
  } catch (error) {
    console.error('[GET /users]', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
router.get('/:userId', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const { rows } = await db.query('SELECT id, name, email, role, status FROM users WHERE id = $1', [userId]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET /user]', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { name, email, password, role, status } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
      [name, email, hashed, role, status ?? 1]
    );
    res.status(201).json({ id: rows[0].id, message: 'User created' });
  } catch (error: any) {
    console.error('[POST /users]', error);
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
});

// PUT /api/users/:id — แก้ 500: ลบ updated_at
router.put('/:userId', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }

  try {
    // ตรวจ email ซ้ำ (ยกเว้นตัวเอง)
    const { rows: dup } = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );
    if (dup.length > 0) return res.status(400).json({ error: 'Email already in use' });

    const updates: string[] = ['name = $1', 'email = $2', 'role = $3'];
    const values: any[] = [name, email, role];
    let idx = 4;

    if (password && password.trim()) {
      if (password.length < 6) return res.status(400).json({ error: 'Password too short' });
      const hashed = await bcrypt.hash(password, 10);
      updates.push(`password = $${idx++}`);
      values.push(hashed);
    }

    // ลบ updated_at ออก เพราะไม่มีในตาราง
    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, name, email, role`;
    const { rows } = await db.query(query, values);

    if (!rows[0]) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: rows[0] });
  } catch (error: any) {
    console.error('[PUT /users]', error);
    res.status(500).json({ error: error.message || 'Failed to update user' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('[DELETE /users]', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
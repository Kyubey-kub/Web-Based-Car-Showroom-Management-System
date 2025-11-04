// src/routes/userRoutes.ts

import { Router, Request, Response } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import db from '../config/db';
import bcrypt from 'bcryptjs';

const router = Router();

// ========================================
// 1. GET /api/users/admin-email (admin only)
// ========================================
router.get('/admin-email', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: admins } = await db.query(
      'SELECT email FROM users WHERE role = $1 LIMIT 1',
      ['admin']
    );

    if (admins.length > 0) {
      res.status(200).json({ success: true, email: admins[0].email });
    } else {
      res.status(200).json({ success: true, email: 'admin@example.com' });
    }
  } catch (error) {
    console.error('[GET /api/users/admin-email] Error:', error);
    res.status(200).json({ success: true, email: 'admin@example.com' });
  }
});

// ========================================
// 2. GET /api/users (Get all users)
// ========================================
router.get('/', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: users } = await db.query(
      `SELECT id, name, email, role, 
              CASE WHEN status = 1 THEN 'Active' ELSE 'Inactive' END as status
       FROM users ORDER BY created_at DESC`
    );

    res.status(200).json(users.map((user: any) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })));
  } catch (error) {
    console.error('[GET /api/users] Error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ========================================
// 3. GET /api/users/:userId (Get single user)
// ========================================
router.get('/:userId', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const { rows: users } = await db.query(
      'SELECT id, name, email, role, status FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error('[GET /api/users/:userId] Error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ========================================
// 4. POST /api/users (Create new user)
// ========================================
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, status } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'Name, email, password, and role are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  try {
    // ตรวจสอบ email ซ้ำ
    const { rows: existingUsers } = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role, status, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
      [name, email, hashedPassword, role, status ?? 1]
    );

    res.status(201).json({ 
      id: rows[0].id, 
      message: 'User created successfully' 
    });
  } catch (error: any) {
    console.error('[POST /api/users] Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// ========================================
// 5. PUT /api/users/:userId (Update user)
// ========================================
router.put('/:userId', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    res.status(400).json({ error: 'Name, email, and role are required' });
    return;
  }

  try {
    // ตรวจสอบ email ซ้ำ (ยกเว้นตัวเอง)
    const { rows: existingUsers } = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({ error: 'Email is already in use by another user' });
      return;
    }

    // Build update fields
    let updateFields = ['name = $1', 'email = $2', 'role = $3'];
    let params: any[] = [name, email, role];

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = $' + (params.length + 1));
      params.push(hashedPassword);
    }

    updateFields.push('updated_at = NOW()');
    params.push(userId);

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${params.length} RETURNING id, name, email, role`;

    const { rows } = await db.query(updateQuery, params);

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error('[PUT /api/users/:userId] Error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ========================================
// 6. DELETE /api/users/:id (Delete user)
// ========================================
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/users/:id] Error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
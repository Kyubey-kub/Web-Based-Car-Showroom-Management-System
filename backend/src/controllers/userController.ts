// src/controllers/userController.ts

import { Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../types';

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { rows: users } = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    const { rows: lastLogins } = await db.query(
      'SELECT user_id, MAX(login_at) as last_login FROM login_logs GROUP BY user_id'
    );

    const usersWithStatus = users.map((user: any) => {
      const lastLogin = lastLogins.find((log: any) => log.user_id === user.id);
      const now = new Date();
      const lastLoginDate = lastLogin ? new Date(lastLogin.last_login) : null;
      const isActive = lastLoginDate && (now.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24) <= 30;
      return {
        ...user,
        status: isActive ? 'Active' : 'Inactive',
      };
    });

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.params;

  if (req.user.id === parseInt(id)) {
    res.status(400).json({ error: 'Cannot delete your own account' });
    return;
  }

  try {
    const { rows: user } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await db.query('DELETE FROM login_logs WHERE user_id = $1', [id]);
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getAdminEmail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { rows: admins } = await db.query(
      'SELECT email FROM users WHERE role = $1 LIMIT 1',
      ['admin']
    );

    if (admins.length === 0) {
      res.status(404).json({ error: 'Admin user not found' });
      return;
    }

    res.status(200).json({ email: admins[0].email });
  } catch (error) {
    console.error('Error in getAdminEmail:', error);
    res.status(500).json({ error: 'Failed to fetch admin email' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const { name, email, role, password } = req.body;

  if (!name || !email || !role) {
    res.status(400).json({ error: 'Name, email, and role are required' });
    return;
  }

  try {
    const { rows: user } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let hashedPassword = user[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      'UPDATE users SET name = $1, email = $2, role = $3, password = $4 WHERE id = $5',
      [name, email, role, hashedPassword, id]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const addUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json({ error: 'Name, email, password, and role are required' });
    return;
  }

  try {
    const { rows: existingUsers } = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error in addUser:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};
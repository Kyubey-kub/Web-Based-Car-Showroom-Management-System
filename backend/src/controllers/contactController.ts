// src/controllers/contactController.ts
import { Request, Response } from 'express';
import db from '../config/db';
import { AuthenticatedRequest } from '../types';

// === ส่งข้อความติดต่อ (client) ===
export const createContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, email, subject, message, file_name, file_path } = req.body;
  const userId = req.user?.id || null;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  try {
    // ลบ file_name, file_path ออก เพราะไม่มีในตาราง
    const { rows } = await db.query(
      `INSERT INTO contacts 
         (user_id, name, email, subject, message, status, created_at) 
       VALUES 
         ($1, $2, $3, $4, $5, 'pending', NOW()) 
       RETURNING 
         id, user_id, name, email, subject, message, status, created_at`,
      [userId, name, email, subject || null, message]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error('[createContact] Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create contact' });
  }
};

// === ดูข้อความทั้งหมด (admin) ===
export const getAllContacts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  try {
    const { rows } = await db.query(
      `SELECT 
         c.*, 
         u.name AS user_name,
         u.email AS user_email
       FROM contacts c
       LEFT JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (error: any) {
    console.error('[getAllContacts] Error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// === ดูข้อความ 1 รายการ (admin) ===
export const getContactById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT 
         c.*, 
         u.name AS user_name,
         u.email AS user_email
       FROM contacts c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('[getContactById] Error:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

// === อัปเดตสถานะ + ตอบกลับ (admin) ===
export const updateContactStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;
  const { status, reply } = req.body;

  if (!status || !['pending', 'replied', 'closed'].includes(status)) {
    res.status(400).json({ error: 'Valid status is required (pending, replied, closed)' });
    return;
  }

  try {
    // ลบ updated_at ออก เพราะไม่มีในตาราง
    const { rows } = await db.query(
      `UPDATE contacts 
       SET status = $1, reply = $2
       WHERE id = $3 
       RETURNING *`,
      [status, reply || null, id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('[updateContactStatus] Error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

// === ลบข้อความ (admin) ===
export const deleteContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;

  try {
    const { rowCount } = await db.query('DELETE FROM contacts WHERE id = $1', [id]);

    if (rowCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    console.error('[deleteContact] Error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
// src/controllers/contactController.ts

import { Request, Response } from 'express';
import db from '../config/db';
import { Contact, AuthenticatedRequest } from '../types';

export const createContact = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message, file_name, file_path } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO contacts (name, email, subject, message, file_name, file_path, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) 
       RETURNING id, name, email, subject, message, file_name, file_path, status, created_at`,
      [name, email, subject || null, message, file_name || null, file_path || null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

export const getAllContacts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  try {
    const { rows } = await db.query(
      `SELECT * FROM contacts ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const getContactById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM contacts WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

export const updateContactStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'replied'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    const { rows } = await db.query(
      `UPDATE contacts SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (rows.length === 0) {
    res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  const { id } = req.params;

  try {
    const { rowCount } = await db.query(`DELETE FROM contacts WHERE id = $1`, [id]);

    if (rowCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};
import { Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { Booking, CustomRequest } from '../types';

export const createBooking = async (req: CustomRequest, res: Response): Promise<void> => {
  const { carId, bookingDate, type, message } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }
  if (!carId || !bookingDate || !type) {
    res.status(400).json({ error: 'Car ID, booking date, and type are required' });
    return;
  }
  if (!['test_drive', 'inquiry'].includes(type)) {
    res.status(400).json({ error: 'Invalid type' });
    return;
  }

  try {
    const { rowCount } = await db.query("SELECT id FROM cars WHERE id = $1 AND status = 'available'", [carId]);
    if (rowCount === 0) {
      res.status(400).json({ error: 'Car is not available' });
      return;
    }

    const { rows } = await db.query(
      'INSERT INTO bookings (user_id, car_id, booking_date, status, type, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, carId, bookingDate, 'pending', type, message || null]
    );

    await db.query("UPDATE cars SET status = 'reserved' WHERE id = $1", [carId]);

    res.status(201).json({ id: rows[0].id, ...req.body, status: 'pending' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT b.*, u.name as username, c.*, m.name as model_name, br.name as brand_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      JOIN models m ON c.model_id = m.id
      JOIN brands br ON m.brand_id = br.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getMyBookings = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  try {
    const { rows } = await db.query(`
      SELECT b.*, m.name as model_name, br.name as brand_name
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      JOIN models m ON c.model_id = m.id
      JOIN brands br ON m.brand_id = br.id
      WHERE b.user_id = $1
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch your bookings' });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Status is required' });
    return;
  }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    const { rowCount } = await db.query('SELECT id FROM bookings WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    await db.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, id]);

    if (status === 'rejected') {
      const { rows } = await db.query('SELECT car_id FROM bookings WHERE id = $1', [id]);
      await db.query("UPDATE cars SET status = 'available' WHERE id = $1", [rows[0].car_id]);
    }

    res.json({ id: Number(id), status });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};
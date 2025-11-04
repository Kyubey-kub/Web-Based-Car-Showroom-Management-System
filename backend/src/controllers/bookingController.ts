import { Request, Response } from 'express';
import db from '../config/db';

interface CustomRequest extends Request {
  user?: { id: number; role: 'client' | 'admin' };
}

export const createBooking = async (req: CustomRequest, res: Response) => {
  const { carId, bookingDate, type, message } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!carId || !bookingDate || !type) return res.status(400).json({ error: 'Missing fields' });
  if (!['test_drive', 'inquiry'].includes(type)) return res.status(400).json({ error: 'Invalid type' });

  try {
    const { rowCount } = await db.query("SELECT id FROM cars WHERE id = $1 AND status = 'available'", [carId]);
    if (rowCount === 0) return res.status(400).json({ error: 'Car not available' });

    const { rows } = await db.query(
      'INSERT INTO bookings (user_id, car_id, booking_date, status, type, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, carId, bookingDate, 'pending', type, message || null]
    );

    await db.query("UPDATE cars SET status = 'reserved' WHERE id = $1", [carId]);

    res.status(201).json({ id: rows[0].id, status: 'pending', carId, bookingDate, type });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed' });
  }
};
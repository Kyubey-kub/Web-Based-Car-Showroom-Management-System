// src/routes/index.ts

import { Router, Request, Response } from 'express';
import db from '../config/db';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { format, isValid, parseISO } from 'date-fns';
import { register, login } from '../controllers/authController';
import { getCarById } from '../controllers/carController';
import { 
  createContact, 
  getAllContacts, 
  updateContactStatus, 
  deleteContact 
} from '../controllers/contactController';
import { getUserActivity, getRegistrationTrends } from '../controllers/reportController';
import { AuthenticatedRequest } from '../types';

const router = Router();

// ==================== PUBLIC ROUTES ====================

// Get all cars with brand and model information
router.get('/cars', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: cars } = await db.query(
      `SELECT cars.*, models.name AS model_name, brands.name AS brand_name 
       FROM cars 
       LEFT JOIN models ON cars.model_id = models.id 
       LEFT JOIN brands ON models.brand_id = brands.id`
    );
    res.status(200).json(cars);
  } catch (error) {
    console.error('[GET /cars] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch cars', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get all brands
router.get('/brands', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: brands } = await db.query('SELECT name FROM brands');
    res.status(200).json(brands.map((b: any) => b.name));
  } catch (error) {
    console.error('[GET /brands] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch brands', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get all years
router.get('/years', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: years } = await db.query('SELECT DISTINCT year FROM cars ORDER BY year DESC');
    res.status(200).json(years.map((y: any) => y.year.toString()));
  } catch (error) {
    console.error('[GET /years] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch years', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get car by ID
router.get('/cars/:id', getCarById);

// Get all reviews
router.get('/reviews', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows: reviews } = await db.query(
      `SELECT reviews.*, users.email AS user_email, 
              cars.year, models.name AS model_name, brands.name AS brand_name 
       FROM reviews 
       JOIN users ON reviews.user_id = users.id 
       JOIN cars ON reviews.car_id = cars.id 
       JOIN models ON cars.model_id = models.id 
       JOIN brands ON models.brand_id = brands.id
       ORDER BY reviews.created_at DESC`
    );
    res.status(200).json(reviews);
  } catch (error) {
    console.error('[GET /reviews] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reviews', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// ==================== AUTH ROUTES (PUBLIC) ====================
router.post('/auth/register', register);
router.post('/auth/login', login);

// ==================== AUTHENTICATED ROUTES ====================

// Create a review
router.post('/reviews', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { car_id, rating, comment } = req.body;
  const user_id = authenticatedReq.user.id;

  if (!car_id || !rating || !comment) {
    res.status(400).json({ error: 'Car ID, rating, and comment are required' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5' });
    return;
  }

  try {
    const { rows: cars } = await db.query('SELECT * FROM cars WHERE id = $1', [car_id]);
    if (cars.length === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    const { rows } = await db.query(
      'INSERT INTO reviews (user_id, car_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [user_id, car_id, rating, comment]
    );
    
    res.status(201).json({ 
      id: rows[0].id, 
      user_id, 
      car_id, 
      rating, 
      comment, 
      created_at: new Date().toISOString() 
    });
  } catch (error) {
    console.error('[POST /reviews] Error:', error);
    res.status(500).json({ 
      error: 'Failed to create review', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update a review
router.put('/reviews/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const reviewId = parseInt(req.params.id);
  const { rating, comment } = req.body;
  const user_id = authenticatedReq.user.id;
  const user_role = authenticatedReq.user.role;

  if (!rating || !comment) {
    res.status(400).json({ error: 'Rating and comment are required' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Rating must be between 1 and 5' });
    return;
  }

  try {
    const { rows: reviews } = await db.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    if (reviews.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    const review = reviews[0];
    if (review.user_id !== user_id && user_role !== 'admin') {
      res.status(403).json({ error: 'You can only edit your own reviews' });
      return;
    }

    await db.query(
      'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3',
      [rating, comment, reviewId]
    );
    
    res.status(200).json({ id: reviewId, rating, comment });
  } catch (error) {
    console.error('[PUT /reviews/:id] Error:', error);
    res.status(500).json({ 
      error: 'Failed to update review', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete a review
router.delete('/reviews/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const reviewId = parseInt(req.params.id);
  const user_id = authenticatedReq.user.id;
  const user_role = authenticatedReq.user.role;

  try {
    const { rows: reviews } = await db.query('SELECT * FROM reviews WHERE id = $1', [reviewId]);
    if (reviews.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    const review = reviews[0];
    if (review.user_id !== user_id && user_role !== 'admin') {
      res.status(403).json({ error: 'You can only delete your own reviews' });
      return;
    }

    await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('[DELETE /reviews/:id] Error:', error);
    res.status(500).json({ 
      error: 'Failed to delete review', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// ==================== BOOKING ROUTES ====================

// Get user's bookings
router.get('/bookings/my-bookings', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const user_id = authenticatedReq.user.id;

  try {
    const { rows: bookings } = await db.query(
      `SELECT bookings.*, 
              cars.year, 
              models.name AS model_name, 
              brands.name AS brand_name 
       FROM bookings 
       JOIN cars ON bookings.car_id = cars.id 
       JOIN models ON cars.model_id = models.id 
       JOIN brands ON models.brand_id = brands.id 
       WHERE bookings.user_id = $1
       ORDER BY bookings.booking_date DESC`,
      [user_id]
    );

    console.log(`[GET /bookings/my-bookings] userId: ${user_id}, bookings count: ${bookings.length}`);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('[GET /bookings/my-bookings] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Create a booking
router.post('/bookings', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { carId, bookingDate, type, message } = req.body;
  const userId = authenticatedReq.user.id;

  if (!carId || !bookingDate || !type) {
    res.status(400).json({ error: 'Car ID, booking date, and type are required' });
    return;
  }

  if (!['test_drive', 'inquiry'].includes(type)) {
    res.status(400).json({ error: 'Type must be either "test_drive" or "inquiry"' });
    return;
  }

  try {
    const { rows: cars } = await db.query('SELECT * FROM cars WHERE id = $1', [carId]);
    if (cars.length === 0) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    const parsedDate = parseISO(bookingDate);
    if (!isValid(parsedDate)) {
      res.status(400).json({ 
        error: 'Invalid booking date format. Use ISO 8601 format (e.g., 2025-03-27T19:09:00.900Z)' 
      });
      return;
    }

    const formattedBookingDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

    const { rows } = await db.query(
      'INSERT INTO bookings (user_id, car_id, booking_date, type, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, carId, formattedBookingDate, type, message, 'pending']
    );
    
    res.status(201).json({ 
      id: rows[0].id, 
      carId, 
      bookingDate: formattedBookingDate, 
      type, 
      message, 
      userId, 
      status: 'pending' 
    });
  } catch (error) {
    console.error('[POST /bookings] Error:', error);
    res.status(500).json({ 
      error: 'Failed to create booking', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Delete a booking
router.delete('/bookings/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const bookingId = parseInt(req.params.id);
  const user_id = authenticatedReq.user.id;

  try {
    const { rows: bookings } = await db.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [bookingId, user_id]
    );

    if (bookings.length === 0) {
      res.status(404).json({ error: 'Booking not found or not authorized' });
      return;
    }

    const booking = bookings[0];
    if (booking.status !== 'pending') {
      res.status(400).json({ error: 'Only pending bookings can be deleted' });
      return;
    }

    await db.query('DELETE FROM bookings WHERE id = $1', [bookingId]);

    // Update car status back to available
    await db.query('UPDATE cars SET status = $1 WHERE id = $2', ['available', booking.car_id]);

    console.log(`[DELETE /bookings/:id] Deleted booking ${bookingId}, car ${booking.car_id} set to available`);

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('[DELETE /bookings/:id] Error:', error);
    res.status(500).json({ 
      error: 'Failed to delete booking', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// ==================== CONTACT ROUTES ====================

router.post('/contacts', authMiddleware, createContact);
router.get('/contacts', authMiddleware, adminMiddleware, getAllContacts);
router.put('/contacts/:id/status', authMiddleware, adminMiddleware, updateContactStatus);
router.delete('/contacts/:id', authMiddleware, adminMiddleware, deleteContact);

// ==================== REPORT ROUTES ====================

router.get('/reports/user-activity', authMiddleware, adminMiddleware, getUserActivity);
router.get('/reports/registration-trends', authMiddleware, adminMiddleware, getRegistrationTrends);

export default router;
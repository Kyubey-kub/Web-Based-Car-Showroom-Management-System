// src/controllers/carController.ts

import { Request, Response } from 'express';
import db from '../config/db';
import { Car, AuthenticatedRequest } from '../types';

export const getAllCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT c.*, m.name as model_name, b.name as brand_name
      FROM cars c
      JOIN models m ON c.model_id = m.id
      JOIN brands b ON m.brand_id = b.id
      WHERE c.status = 'available'
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT c.*, m.name as model_name, b.name as brand_name
      FROM cars c
      JOIN models m ON c.model_id = m.id
      JOIN brands b ON m.brand_id = b.id
      WHERE c.id = $1
    `, [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'ไม่พบรถ' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

export const createCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const car: Car = req.body;
  if (!designatedFieldsPresent(car)) {
    res.status(400).json({ error: 'กรุณาระบุทุกช่องที่จำเป็น' });
    return;
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO cars (model_id, year, price, description, image_url, model_3d_url, status, color, mileage, fuel_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [car.modelId, car.year, car.price, car.description, car.imageUrl, car.model3dUrl, car.status, car.color || null, car.mileage || 0, car.fuelType || 'petrol']
    );
    res.status(201).json({ ...car, id: rows[0].id });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
};

export const updateCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const { id } = req.params;
  const car: Partial<Car> = req.body;

  if (!designatedFieldsPresent(car as Car)) {
    res.status(400).json({ error: 'กรุณาระบุทุกช่องที่จำเป็น' });
    return;
  }

  try {
    const fields = [
      car.modelId, car.year, car.price, car.description,
      car.imageUrl, car.model3dUrl, car.status,
      car.color || null, car.mileage || 0, car.fuelType || 'petrol', id
    ];

    const { rows } = await db.query(
      `UPDATE cars SET 
         model_id = $1, year = $2, price = $3, description = $4,
         image_url = $5, model_3d_url = $6, status = $7,
         color = $8, mileage = $9, fuel_type = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      fields
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'ไม่พบรถ' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
};

export const deleteCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const { id } = req.params;

  try {
    const { rowCount } = await db.query('DELETE FROM cars WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ error: 'ไม่พบรถ' });
      return;
    }

    res.json({ message: 'ลบรถสำเร็จ' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
};

const designatedFieldsPresent = (car: Car): boolean => {
  return !!(car.modelId && car.year && car.price && car.description && car.imageUrl && car.model3dUrl && car.status);
};
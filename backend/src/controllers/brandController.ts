import { Request, Response } from 'express';
import db from '../config/db';

export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM brands');
    res.json(rows);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getModelsByBrand = async (req: Request, res: Response): Promise<void> => {
  const { brand_id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM models WHERE brand_id = $1', [brand_id]);
    res.json(rows);
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};
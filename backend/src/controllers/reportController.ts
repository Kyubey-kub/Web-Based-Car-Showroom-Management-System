// src/controllers/reportController.ts

import { Response } from 'express';
import db from '../config/db';
import { AuthenticatedRequest } from '../types';

export const getUserActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { rows: logs } = await db.query(
      `SELECT 
         DATE(login_at) as date, 
         COUNT(*) as count 
       FROM login_logs 
       WHERE login_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(login_at)
       ORDER BY date DESC`
    );

    res.status(200).json(logs.map((log: any) => ({
      date: log.date,
      count: Number(log.count)
    })));
  } catch (error) {
    console.error('Error in getUserActivity:', error);
    res.status(500).json({ error: 'Failed to generate user activity report' });
  }
};

export const getRegistrationTrends = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { rows: trends } = await db.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as date, 
         COUNT(*) as count 
       FROM users 
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY date DESC`
    );

    res.status(200).json(trends.map((t: any) => ({
      date: t.date,
      count: Number(t.count)
    })));
  } catch (error) {
    console.error('Error in getRegistrationTrends:', error);
    res.status(500).json({ error: 'Failed to generate registration trends report' });
  }
};
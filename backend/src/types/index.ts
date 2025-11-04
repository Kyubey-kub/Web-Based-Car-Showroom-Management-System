import { Request } from 'express';
import { JwtPayload as JwtPayloadBase } from 'jsonwebtoken';

// เพิ่ม type สำหรับ chart data
export interface ChartRow {
  date: string;
  count: string | number;
}

// เพิ่ม type สำหรับ recent activity
export interface ActivityRow {
  name: string;
  role: string;
  login_at: string | Date;
}

export interface User {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role: 'client' | 'admin';
  created_at?: Date;
  iat?: number;
  exp?: number;
}

export interface JwtPayload extends JwtPayloadBase {
  id: number;
  email?: string;
  role: 'client' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface CustomRequest extends Request {
  user?: {
    id: number;
    email?: string;
    role: 'client' | 'admin';
    iat?: number;
    exp?: number;
  };
}

export interface Car {
  id?: number;
  modelId: number;
  year: number;
  price: number;
  description: string;
  imageUrl: string;
  model3dUrl: string;
  status: 'available' | 'sold' | 'reserved';
  color?: string;
  mileage?: number;
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  created_at?: Date;
  updated_at?: Date;
}

export interface Booking {
  id?: number;
  userId: number;
  carId: number;
  bookingDate?: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'approved' | 'rejected';
  createdAt?: Date;
  type?: 'test_drive' | 'inquiry';
  message?: string;
}

export interface Contact {
  id?: number;
  user_id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  file_name?: string;
  file_path?: string;
  status?: 'pending' | 'replied';
  created_at?: Date;
}

export interface Brand {
  id?: number;
  name: string;
  created_at?: Date;
}

export interface Model {
  id?: number;
  brand_id: number;
  name: string;
  created_at?: Date;
}
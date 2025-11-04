// src/routes/contactRoutes.ts

import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { 
  createContact,      // เปลี่ยนจาก sendContact
  getAllContacts,     // เปลี่ยนจาก getContacts
  updateContactStatus, // เปลี่ยนจาก replyContact
  deleteContact 
} from '../controllers/contactController';

const router = Router();

// ส่งข้อความติดต่อ (ต้อง login)
router.post('/', authMiddleware, createContact);

// ดูข้อความทั้งหมด (admin เท่านั้น)
router.get('/', authMiddleware, adminMiddleware, getAllContacts);

// ตอบกลับ/เปลี่ยนสถานะ (admin เท่านั้น)
router.put('/:id/status', authMiddleware, adminMiddleware, updateContactStatus);

// ลบข้อความ (admin เท่านั้น)
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

export default router;
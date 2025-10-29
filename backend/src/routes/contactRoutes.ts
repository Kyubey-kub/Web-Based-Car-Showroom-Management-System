import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { sendContact, getContacts, replyContact, deleteContact } from '../controllers/contactController';

const router = Router();

// ✅ ส่งข้อความติดต่อ (ต้อง login)
router.post('/', authMiddleware, sendContact);

// ✅ ดูข้อความทั้งหมด (admin เท่านั้น)
router.get('/', authMiddleware, adminMiddleware, getContacts);

// ✅ ตอบกลับข้อความ (admin เท่านั้น)
router.post('/:id/reply', authMiddleware, adminMiddleware, replyContact);

// ✅ ลบข้อความ (admin เท่านั้น)
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

export default router;
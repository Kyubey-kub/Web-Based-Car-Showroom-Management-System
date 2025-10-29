import { Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import { WebSocketServer, WebSocket } from 'ws';
import db from '../config/db';
import { Contact, AuthenticatedRequest } from '../types';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';

// สร้าง WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// เก็บการเชื่อมต่อของ Admin
const adminConnections: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  console.log('New WebSocket connection');
  adminConnections.add(ws);

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    adminConnections.delete(ws);
  });
});

// ส่งการแจ้งเตือนไปยัง Admin ผ่าน WebSocket
const notifyAdmins = (message: string) => {
  adminConnections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'notification', message }));
    }
  });
};

// ตรวจสอบว่าควรเปิดใช้งานอีเมลหรือไม่
const isEmailEnabled = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_ADMIN;

// ตั้งค่า Nodemailer (เฉพาะถ้ามี email config)
let transporter: nodemailer.Transporter | null = null;
if (isEmailEnabled) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('✅ Email functionality enabled');
} else {
  console.warn('⚠️  Email environment variables not set. Email functionality will be disabled.');
}

// ✅ ส่งข้อความติดต่อ (แก้ไขแล้ว - รองรับ subject)
export const sendContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { name, email, subject, message } = req.body;
    const file = req.file;

    console.log('sendContact called with:', { userId: req.user.id, name, email, subject, message, file: file?.filename });

    // ✅ ตรวจสอบข้อมูลที่จำเป็น (เพิ่ม subject)
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'Name, email, subject, and message are required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // ✅ บันทึกข้อความลงฐานข้อมูล (เพิ่ม subject)
    const filePath = file ? `/uploads/${file.filename}` : null;
    const [result]: any = await db.query(
      'INSERT INTO contacts (user_id, name, email, subject, message, file_name, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [req.user.id, name, email, subject, message, filePath]
    );

    console.log('✅ Contact message saved:', result);

    // ส่งอีเมลเฉพาะถ้าเปิดใช้งาน
    if (isEmailEnabled && transporter) {
      try {
        const mailOptions: nodemailer.SendMailOptions = {
          from: `"Contact Form" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_ADMIN!,
          subject: `New Contact Message: ${subject}`,
          text: `
            New contact message received:
            
            From: ${name} (${email})
            Subject: ${subject}
            Message: ${message}
            
            ${filePath ? `Attachment: ${filePath}` : 'No attachment'}
          `,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            ${filePath ? `<p><strong>Attachment:</strong> ${filePath}</p>` : ''}
          `,
          attachments: file
            ? [
                {
                  filename: file.filename,
                  path: path.join(__dirname, '../../uploads', file.filename),
                },
              ]
            : undefined,
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // ไม่ throw error เพื่อให้ระบบทำงานต่อได้
      }
    } else {
      console.log('📧 Email disabled - Contact saved to database only');
    }

    notifyAdmins(`New contact message from ${name}: ${subject}`);

    res.status(200).json({ 
      message: 'Contact message sent successfully',
      contactId: result.insertId 
    });
  } catch (error) {
    console.error('Error in sendContact:', error);
    res.status(500).json({ 
      error: 'Failed to send contact message', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// ✅ ดึงข้อความทั้งหมด (Admin only) - แก้ไขให้ส่ง Array โดยตรง
export const getContacts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Admins only.' });
    return;
  }

  try {
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email
      FROM contacts c
      LEFT JOIN users u ON c.user_id = u.id
    `;
    
    const params: any[] = [];
    
    if (status && ['pending', 'replied', 'closed'].includes(status as string)) {
      query += ' WHERE c.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY c.created_at DESC';
    
    const [rows] = await db.query<(RowDataPacket & Contact)[]>(query, params);
    
    console.log(`✅ Fetched ${rows.length} contacts`);
    
    // ✅ แก้ไข: ส่ง Array โดยตรง แทนที่จะเป็น Object
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch contacts', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// ✅ ตอบกลับข้อความ (Admin only - แก้ไขแล้ว)
export const replyContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Admins only.' });
    return;
  }

  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!id || !reply) {
      res.status(400).json({ error: 'ID and reply message are required' });
      return;
    }

    const [contact] = await db.query<(RowDataPacket & Contact)[]>(
      'SELECT * FROM contacts WHERE id = ?', 
      [id]
    );
    
    if (contact.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    // ✅ อัปเดตการตอบกลับและ status
    await db.query(
      'UPDATE contacts SET reply = ?, status = ? WHERE id = ?',
      [reply, 'replied', id]
    );

    // ส่งอีเมลเฉพาะถ้าเปิดใช้งาน
    if (isEmailEnabled && transporter) {
      try {
        const mailOptions: nodemailer.SendMailOptions = {
          from: `"Admin" <${process.env.EMAIL_USER}>`,
          to: contact[0].email,
          subject: `Re: ${contact[0].subject || 'Your Message'}`,
          text: `Dear ${contact[0].name},\n\n${reply}\n\nBest regards,\nAdmin`,
          html: `
            <p>Dear ${contact[0].name},</p>
            <p>Thank you for contacting us. Here is our response:</p>
            <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; color: #555;">${reply}</blockquote>
            <p>Best regards,<br><strong>Car Showroom Team</strong></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Reply email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send reply email:', emailError);
        // ไม่ throw error เพื่อให้ระบบทำงานต่อได้
      }
    } else {
      console.log('📧 Email disabled - Reply saved to database only');
    }

    notifyAdmins(`Replied to contact message from ${contact[0].name}`);

    res.status(200).json({ message: 'Contact replied successfully' });
  } catch (error) {
    console.error('Error in replyContact:', error);
    res.status(500).json({ 
      error: 'Failed to reply to contact', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// ✅ ลบข้อความ (Admin only)
export const deleteContact = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Admins only.' });
    return;
  }

  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'ID is required' });
      return;
    }

    const [contact] = await db.query<(RowDataPacket & Contact)[]>(
      'SELECT file_name FROM contacts WHERE id = ?', 
      [id]
    );
    
    if (contact.length === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    // ลบไฟล์แนบถ้ามี
    if (contact[0].file_name) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(contact[0].file_name));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('✅ File deleted:', filePath);
      }
    }

    await db.query('DELETE FROM contacts WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error in deleteContact:', error);
    res.status(500).json({ 
      error: 'Failed to delete contact', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
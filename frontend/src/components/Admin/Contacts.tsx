import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'pending' | 'replied';
  reply?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        console.log('❌ No token, redirecting to login...');
        navigate('/admin/login');
        return;
      }

      console.log('🔄 Fetching contacts...');
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      console.log('📦 Raw contacts response:', data);
      console.log('📦 Response type:', typeof data);
      console.log('📦 Is Array?', Array.isArray(data));

      // ✅ Handle multiple response formats
      let contactsArray: Contact[] = [];

      if (Array.isArray(data)) {
        // Format 1: Direct array
        contactsArray = data;
        console.log('✅ Response is direct array');
      } else if (data && typeof data === 'object') {
        // Format 2: Check all possible properties
        if (Array.isArray(data.contacts)) {
          contactsArray = data.contacts;
          console.log('✅ Response has contacts property (array)');
        } else if (Array.isArray(data.data)) {
          contactsArray = data.data;
          console.log('✅ Response has data property (array)');
        } else if (Array.isArray(data.results)) {
          contactsArray = data.results;
          console.log('✅ Response has results property (array)');
        } else {
          // Try to find any array property
          const arrayProp = Object.keys(data).find(key => Array.isArray(data[key]));
          if (arrayProp) {
            contactsArray = data[arrayProp];
            console.log(`✅ Found array in property: ${arrayProp}`);
          } else {
            console.warn('⚠️ Unknown response format:', data);
            console.warn('⚠️ Available keys:', Object.keys(data));
            contactsArray = [];
          }
        }
      } else {
        console.warn('⚠️ Unexpected response type:', typeof data);
        contactsArray = [];
      }

      // Validate that contactsArray is actually an array
      if (!Array.isArray(contactsArray)) {
        console.error('❌ contactsArray is not an array after processing!');
        console.error('❌ Final value:', contactsArray);
        contactsArray = [];
      }

      console.log(`✅ Setting ${contactsArray.length} contacts to state`);
      setContacts(contactsArray);

    } catch (err: any) {
      console.error('❌ Error fetching contacts:', err);
      console.error('❌ Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
      setContacts([]); // Always set empty array on error
      
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        console.log('❌ Unauthorized, redirecting to login...');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
      console.log('✅ Fetch contacts completed');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleReply = async (contactId: number) => {
    if (!replyText.trim()) {
      alert('กรุณาใส่ข้อความตอบกลับ');
      return;
    }

    try {
      setSubmitting(true);
      console.log(`🔄 Sending reply to contact ${contactId}...`);
      
      const response = await fetch(`${API_URL}/contacts/${contactId}/reply`, {
        method: 'POST',
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({ reply: replyText }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      console.log('✅ Reply sent successfully');
      alert('ส่งการตอบกลับสำเร็จ');
      setSelectedContact(null);
      setReplyText('');
      fetchContacts(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Error sending reply:', err);
      alert('เกิดข้อผิดพลาดในการส่งการตอบกลับ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId: number) => {
    if (!confirm('คุณต้องการลบข้อความนี้หรือไม่?')) {
      return;
    }

    try {
      console.log(`🔄 Deleting contact ${contactId}...`);
      
      const response = await fetch(`${API_URL}/contacts/${contactId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      console.log('✅ Contact deleted successfully');
      alert('ลบข้อความสำเร็จ');
      fetchContacts(); // Refresh the list
    } catch (err: any) {
      console.error('❌ Error deleting contact:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อความ');
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white">
      <div className="max-w-[1400px] mx-auto px-5 py-20">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-5xl font-bold uppercase text-center flex-1"
            style={{
              background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 8s linear infinite',
              backgroundSize: '300%',
            }}
          >
            การติดต่อ
          </h1>
          <button
            onClick={() => navigate('/admin/home')}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 hover:scale-105"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            กลับไปหน้าแดชบอร์ด
          </button>
        </div>
        <p className="text-center text-lg opacity-80 mb-10">
          รายการข้อความจากผู้ใช้ ({contacts.length} รายการ)
        </p>

        {loading ? (
          <div className="flex items-center justify-center mt-10">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mr-4"></div>
            <p className="text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center mt-10">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchContacts()}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all hover:scale-105"
              >
                ลองโหลดใหม่
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <div className="overflow-x-auto rounded-lg shadow-2xl border border-slate-800">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gradient-to-r from-slate-900 to-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">ชื่อ</th>
                    <th scope="col" className="px-6 py-4 text-left">อีเมล</th>
                    <th scope="col" className="px-6 py-4 text-left">หัวข้อ</th>
                    <th scope="col" className="px-6 py-4 text-left">ข้อความ</th>
                    <th scope="col" className="px-6 py-4 text-left">วันที่ส่ง</th>
                    <th scope="col" className="px-6 py-4 text-left">สถานะ</th>
                    <th scope="col" className="px-6 py-4 text-center">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">{contact.name}</td>
                        <td className="px-6 py-4 text-gray-400">{contact.email}</td>
                        <td className="px-6 py-4">{contact.subject}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{contact.message}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(contact.created_at).toLocaleString('th-TH')}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              contact.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {contact.status === 'pending' ? 'รอดำเนินการ' : 'ตอบกลับแล้ว'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => {
                                setSelectedContact(contact);
                                setReplyText(contact.reply || '');
                              }}
                              className="px-3 py-1 bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-all hover:scale-105 text-xs"
                            >
                              ตอบกลับ
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              className="px-3 py-1 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-all hover:scale-105 text-xs"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        ไม่มีข้อความติดต่อ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg p-6 max-w-2xl w-full border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">ตอบกลับข้อความ</h2>
            <div className="mb-4 p-4 bg-slate-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">จาก: {selectedContact.name}</p>
              <p className="text-sm text-gray-400 mb-2">อีเมล: {selectedContact.email}</p>
              <p className="text-sm text-gray-400 mb-2">หัวข้อ: {selectedContact.subject}</p>
              <p className="text-sm mb-2">ข้อความ:</p>
              <p className="text-gray-300">{selectedContact.message}</p>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="พิมพ์ข้อความตอบกลับ..."
              className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => {
                  setSelectedContact(null);
                  setReplyText('');
                }}
                disabled={submitting}
                className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleReply(selectedContact.id)}
                disabled={submitting}
                className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    กำลังส่ง...
                  </>
                ) : (
                  'ส่งการตอบกลับ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Contacts;
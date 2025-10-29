// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create headers with proper CORS handling
const getHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to handle API responses with better error handling
const handleResponse = async (response: Response) => {
  // Handle empty responses
  if (response.status === 204) {
    return { success: true };
  }

  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let error;
    try {
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      } else {
        const text = await response.text();
        error = { error: text || 'Network error' };
      }
    } catch (e) {
      error = { error: `HTTP error! status: ${response.status}` };
    }
    throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
  }

  // Parse JSON response
  try {
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { success: true };
    }
  } catch (e) {
    console.error('Error parsing response:', e);
    return { success: true };
  }
};

// Wrapper for fetch with timeout and better error handling
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      credentials: 'include',
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// ==================== AUTH APIs ====================

export const register = async (email: string, password: string, role: string = 'client') => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, role }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/dashboard`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Dashboard data error:', error);
    throw error;
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/auth/recent-activity`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Recent activity error:', error);
    throw error;
  }
};

// ==================== CAR APIs ====================

export const getCars = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/cars`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get cars error:', error);
    throw error;
  }
};

export const getCarById = async (id: number) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/cars/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get car by ID error:', error);
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/brands`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get brands error:', error);
    throw error;
  }
};

export const getYears = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/years`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get years error:', error);
    throw error;
  }
};

// ==================== REVIEW APIs ====================

export const getReviews = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reviews`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get reviews error:', error);
    throw error;
  }
};

export const createReview = async (car_id: number, rating: number, comment: string) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ car_id, rating, comment }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

export const updateReview = async (id: number, rating: number, comment: string) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

export const deleteReview = async (id: number) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// ==================== BOOKING APIs ====================

export const getMyBookings = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/bookings/my-bookings`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get my bookings error:', error);
    throw error;
  }
};

export const createBooking = async (
  carId: number, 
  bookingDate: string, 
  type: 'test_drive' | 'inquiry', 
  message?: string
) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ carId, bookingDate, type, message }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
};

export const deleteBooking = async (id: number) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete booking error:', error);
    throw error;
  }
};

// ==================== CONTACT APIs ====================

// ✅ แก้ไข sendContact ให้ส่ง JSON แทน FormData
export const sendContact = async (name: string, email: string, subject: string, message: string, file?: File) => {
  try {
    const token = getAuthToken();
    
    // ถ้ามีไฟล์แนบ ใช้ FormData
    if (file) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('file', file);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetchWithTimeout(`${API_URL}/contacts`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return handleResponse(response);
    }
    
    // ✅ ถ้าไม่มีไฟล์ ใช้ JSON
    const response = await fetchWithTimeout(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Send contact error:', error);
    throw error;
  }
};

export const getContacts = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/contacts`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get contacts error:', error);
    throw error;
  }
};

export const replyContact = async (id: number, reply: string) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/contacts/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reply }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Reply contact error:', error);
    throw error;
  }
};

export const deleteContact = async (id: number) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete contact error:', error);
    throw error;
  }
};

// ==================== REPORT APIs ====================

export const getUserActivity = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reports/user-activity`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get user activity error:', error);
    throw error;
  }
};

export const getRegistrationTrends = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/reports/registration-trends`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Get registration trends error:', error);
    throw error;
  }
};

// Export all APIs
export default {
  // Auth
  register,
  login,
  getDashboardData,
  getRecentActivity,
  
  // Cars
  getCars,
  getCarById,
  getBrands,
  getYears,
  
  // Reviews
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  
  // Bookings
  getMyBookings,
  createBooking,
  deleteBooking,
  
  // Contacts
  sendContact,
  getContacts,
  replyContact,
  deleteContact,
  
  // Reports
  getUserActivity,
  getRegistrationTrends,
};
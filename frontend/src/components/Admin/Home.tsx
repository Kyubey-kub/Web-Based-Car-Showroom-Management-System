import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DashboardData {
  registerData: { date: string; count: number }[];
  loginData: { date: string; count: number }[];
  totalRegisters: number;
  totalLogins: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  file_name: string | null;
  created_at: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

interface RecentActivity {
  message: string;
  timestamp: string;
}

interface ReportData {
  userActivity?: { date: string; count: number }[];
  registrationTrends?: { date: string; count: number }[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Card: React.FC<{
  title: string;
  total: number;
  percentage: string;
  data: { date: string; count: number }[];
  chartData: { labels: string[]; data: number[] };
}> = ({ title, total, percentage, data, chartData }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
      <div className="absolute inset-px rounded-[11px] bg-slate-950" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="text-xs font-medium text-slate-400">Total</p>
            <p className="text-lg font-semibold text-white">{total}</p>
            <span className="text-xs font-medium text-emerald-500">{percentage}</span>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="text-xs font-medium text-slate-400">Last Day</p>
            <p className="text-lg font-semibold text-white">{data[0]?.count || 0}</p>
            <span className="text-xs font-medium text-emerald-500">Recent</span>
          </div>
        </div>
        <div className="mb-4 h-24 w-full overflow-hidden rounded-lg bg-slate-900/50 p-3">
          <Line data={chartDataConfig} options={chartOptions} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Last 7 days</span>
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            onClick={() => window.location.href = '/admin/activity-details'}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
          >
            View Details
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>('#dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [adminEmail, setAdminEmail] = useState<string>('admin@example.com');
  const [theme, setTheme] = useState<string>('dark');
  const [reportData, setReportData] = useState<ReportData>({});
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'client' });
  const { logout, userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef<HTMLUListElement>(null);

  // ✅ แทนที่ useEffect ทั้ง 4 ตัวใน Home.tsx

// 1️⃣ Fetch Dashboard Data (บรรทัดประมาณ 165-205)
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        console.log('❌ User not authenticated');
        throw new Error('User not authenticated');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        throw new Error('No authentication token found');
      }

      console.log('🔄 Fetching dashboard data...');
      const response = await apiClient.get('/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Dashboard response:', response.data);

      // ✅ Validate and set dashboard data with proper defaults
      const dashData = {
        registerData: Array.isArray(response.data.registerData) ? response.data.registerData : [],
        loginData: Array.isArray(response.data.loginData) ? response.data.loginData : [],
        totalRegisters: Number(response.data.totalRegisters) || 0,
        totalLogins: Number(response.data.totalLogins) || 0,
      };

      console.log('✅ Processed dashboard data:', dashData);
      setDashboardData(dashData);

      // ✅ Fetch recent activity with separate try-catch
      try {
        console.log('🔄 Fetching recent activity...');
        const recentActivityResponse = await apiClient.get('/auth/recent-activity', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('✅ Recent activity response:', recentActivityResponse.data);

        if (Array.isArray(recentActivityResponse.data)) {
          const activities = recentActivityResponse.data.map((activity: any) => ({
            message: activity.message || activity.action || 'No message',
            timestamp: activity.timestamp 
              ? new Date(activity.timestamp).toLocaleString()
              : activity.created_at
              ? new Date(activity.created_at).toLocaleString()
              : 'No date',
          }));
          setRecentActivities(activities);
          console.log('✅ Recent activities set:', activities);
        } else {
          console.warn('⚠️ Recent activity is not an array');
          setRecentActivities([]);
        }
      } catch (activityError: any) {
        console.error('❌ Error fetching recent activity:', activityError);
        setRecentActivities([]);
      }

    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load dashboard data';
      setError(errorMessage);
      
      // ✅ Set safe default values on error
      setDashboardData({
        registerData: [],
        loginData: [],
        totalRegisters: 0,
        totalLogins: 0,
      });
      setRecentActivities([]);
      
      if (error.response?.status === 401) {
        console.log('❌ Unauthorized, logging out...');
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
      console.log('✅ Dashboard data fetch complete');
    }
  };
  
  fetchDashboardData();
}, [isAuthenticated, logout, navigate]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No token for users fetch');
        return;
      }

      console.log('🔄 Fetching users...');
      const response = await apiClient.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Users response:', response.data);

      // ✅ Validate array
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log(`✅ Set ${response.data.length} users`);
      } else {
        console.warn('⚠️ Users response is not an array:', response.data);
        setUsers([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    }
  };
  
  if (isAuthenticated) {
    fetchUsers();
  }
}, [isAuthenticated]);

  // 3️⃣ Fetch Contact Messages (บรรทัดประมาณ 227-245)
useEffect(() => {
  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No token for contacts fetch');
        return;
      }

      console.log('🔄 Fetching contact messages...');
      const response = await apiClient.get('/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Contacts response:', response.data);

      // ✅ Validate array
      if (Array.isArray(response.data)) {
        setContactMessages(response.data);
        console.log(`✅ Set ${response.data.length} contact messages`);
      } else {
        console.warn('⚠️ Contacts response is not an array:', response.data);
        setContactMessages([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching contact messages:', error);
      setContactMessages([]);
    }
  };
  
  if (isAuthenticated) {
    fetchContactMessages();
  }
}, [isAuthenticated]);

  // 4️⃣ Fetch Admin Email (บรรทัดประมาณ 247-265)
useEffect(() => {
  const fetchAdminEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ No token for admin email fetch');
        return;
      }

      console.log('🔄 Fetching admin email...');
      const response = await apiClient.get('/users/admin-email', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Admin email response:', response.data);

      // ✅ Handle different response formats
      if (response.data?.email) {
        setAdminEmail(response.data.email);
        console.log('✅ Admin email set:', response.data.email);
      } else if (response.data?.success && response.data?.email) {
        setAdminEmail(response.data.email);
        console.log('✅ Admin email set (with success flag):', response.data.email);
      } else if (typeof response.data === 'string') {
        setAdminEmail(response.data);
        console.log('✅ Admin email set (string):', response.data);
      } else {
        console.warn('⚠️ Unexpected admin email response format:', response.data);
        setAdminEmail('admin@example.com');
      }
    } catch (error: any) {
      console.error('❌ Error fetching admin email:', error);
      setAdminEmail('admin@example.com');
    }
  };

  if (isAuthenticated) {
    fetchAdminEmail();
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  document.body.classList.toggle('light', savedTheme === 'light');
}, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    if (isMenuOpen) toggleMenu();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      alert('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditUser = (user: User) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleViewContact = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/contacts/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessages(contactMessages.filter((msg) => msg.id !== contactId));
      alert('Message deleted successfully');
    } catch (error: any) {
      console.error('Error deleting contact message:', error);
      alert('Failed to delete message: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('light', theme === 'light');
    alert('Settings saved successfully');
  };

  const handleGenerateReport = async (type: 'userActivity' | 'registrationTrends') => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'userActivity' ? '/reports/user-activity' : '/reports/registration-trends';
      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReportData((prev) => ({
        ...prev,
        [type]: response.data,
      }));
      alert('Report generated successfully');
    } catch (error: any) {
      console.error(`Error generating ${type} report:`, error);
      alert('Failed to generate report: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddUser = async () => {
    // Validation
    if (!newUser.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!newUser.email.trim()) {
      alert('Please enter an email');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!newUser.password) {
      alert('Please enter a password');
      return;
    }

    if (newUser.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Prepare user data with proper formatting
      const userData = {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        role: newUser.role,
        status: 1  // 👈 เปลี่ยนจาก 'Active' เป็น 1 (integer สำหรับ active)
      };

      console.log('Adding user with data:', { ...userData, password: '***' });

      const response = await apiClient.post('/users', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json',  // 👈 เพิ่มบรรทัดนี้
        },
      });
      
      console.log('User added successfully:', response.data);
      
      // Refresh user list
      const refreshResponse = await apiClient.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(refreshResponse.data);
      
      // Close modal and reset form
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'client' });
      // alert('User added successfully');
      alert(`User added successfully!\n\nLogin Credentials:\nEmail: ${userData.email}\nPassword: ${newUser.password}\n\nPlease save these credentials.`);
    } catch (error: any) {
      console.error('Error adding user:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle specific error messages
      let errorMessage = 'Failed to add user';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Check for duplicate email error
      if (errorMessage.includes('Duplicate') || errorMessage.includes('already exists')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      }

      alert(errorMessage);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await apiClient.get('/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactMessages(response.data);
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const navbarStyle = {
    backdropFilter: 'blur(12px)',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    ...(isScrolled && {
      padding: '0.8rem 5%',
      background: 'rgba(10, 10, 10, 0.95)',
    }),
  };

  const logoStyle = {
    background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient 8s linear infinite',
    backgroundSize: '300%',
    letterSpacing: '-0.5px',
  };

  const navLinkStyle = (isActive: boolean) => ({
    color: isActive ? 'transparent' : 'white',
    background: isActive
      ? 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)'
      : 'none',
    WebkitBackgroundClip: isActive ? 'text' : 'none',
    backgroundClip: isActive ? 'text' : 'none',
    WebkitTextFillColor: isActive ? 'transparent' : 'white',
    animation: isActive ? 'gradient 8s linear infinite' : 'none',
    backgroundSize: isActive ? '300%' : 'none',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    transition: 'all 0.3s ease',
    fontSize: '1.05rem',
    letterSpacing: '0.3px',
    position: 'relative' as const,
    whiteSpace: 'nowrap' as const,
  });

  const sectionStyle = {
    minHeight: '100vh',
    padding: '100px 5% 80px',  // 👈 ลดจาก 120px เป็น 100px เพื่อดึง navbar ลงมา
    position: 'relative' as const,
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const sectionContentStyle = {
    maxWidth: '1400px',
    width: '100%',
    position: 'relative' as const,
    zIndex: 1,
    margin: '0 auto',
  };

  const sectionTitleStyle = {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'gradient 8s linear infinite',
    backgroundSize: '300%',
    lineHeight: 1.1,
    textTransform: 'uppercase' as const,
    letterSpacing: '-2px',
    textAlign: 'center' as const,
  };

  const sectionDescriptionStyle = {
    fontSize: 'clamp(1rem, 1.2rem, 1.5rem)',
    maxWidth: '800px',
    margin: '0 auto 2rem',
    lineHeight: 1.6,
    opacity: 0.8,
    color: 'white',
    textAlign: 'center' as const,
  };

  const bgEffectStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
    zIndex: 0,
  };

  return (
    <div className={`bg-[#0a0a0a] min-h-screen font-sans w-full ${theme}`}>
      <nav className="navbar fixed top-0 left-0 w-full px-5 py-3 z-50" style={navbarStyle}>
        <div className="navbar-container max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="logo text-2xl font-bold" style={logoStyle}>
            Admin Panel
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-wrapper hidden md:flex items-center">
            <ul className="nav-links flex gap-4 list-none">
              <li><a href="#dashboard" onClick={() => handleLinkClick('#dashboard')} style={navLinkStyle(activeLink === '#dashboard')}>Dashboard</a></li>
              <li><a href="#users" onClick={() => handleLinkClick('#users')} style={navLinkStyle(activeLink === '#users')}>Users</a></li>
              <li><a href="#contacts" onClick={() => handleLinkClick('#contacts')} style={navLinkStyle(activeLink === '#contacts')}>Contacts</a></li>
              <li><a href="#settings" onClick={() => handleLinkClick('#settings')} style={navLinkStyle(activeLink === '#settings')}>Settings</a></li>
              <li><a href="#reports" onClick={() => handleLinkClick('#reports')} style={navLinkStyle(activeLink === '#reports')}>Reports</a></li>
              <li>
                <button
                  onClick={handleLogout}
                  style={navLinkStyle(activeLink === '#logout')}
                  className="logout-button"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-nav-toggle md:hidden bg-transparent border-none cursor-pointer w-10 h-10 relative z-[1001] rounded-full transition-colors hover:bg-[rgba(255,255,255,0.1)]"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-all duration-300"
              style={{ top: '14px', ...(isMenuOpen && { transform: 'translate(-50%, 5px) rotate(45deg)', width: '24px' }) }}
            />
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-opacity duration-300"
              style={{ top: '19px', ...(isMenuOpen && { opacity: 0 }) }}
            />
            <span
              className="bar absolute left-1/2 transform -translate-x-1/2 w-5 h-[2px] bg-white transition-all duration-300"
              style={{ top: '24px', ...(isMenuOpen && { transform: 'translate(-50%, -5px) rotate(-45deg)', width: '24px' }) }}
            />
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`overlay fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] transition-opacity duration-300 z-[1000] backdrop-blur-sm ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
          onClick={toggleMenu}
        />

        {/* Mobile Sidebar Menu */}
        <ul
          ref={navRef}
          className={`nav-links-mobile fixed top-0 right-0 h-screen w-[85%] max-w-[400px] flex flex-col justify-start items-start gap-6 pt-24 px-8 transition-all duration-300 ease-in-out z-[1020] bg-gradient-to-b from-[rgba(10,10,10,0.98)] via-[rgba(20,20,30,0.98)] to-[rgba(30,20,40,0.98)] backdrop-blur-xl shadow-[-5px_0_30px_rgba(0,0,0,0.5)] border-l border-l-[rgba(255,255,255,0.1)] md:hidden ${
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <li className="w-full"><a href="#dashboard" onClick={() => handleLinkClick('#dashboard')} style={navLinkStyle(activeLink === '#dashboard')} className="block w-full text-left">Dashboard</a></li>
          <li className="w-full"><a href="#users" onClick={() => handleLinkClick('#users')} style={navLinkStyle(activeLink === '#users')} className="block w-full text-left">Users</a></li>
          <li className="w-full"><a href="#contacts" onClick={() => handleLinkClick('#contacts')} style={navLinkStyle(activeLink === '#contacts')} className="block w-full text-left">Contacts</a></li>
          <li className="w-full"><a href="#settings" onClick={() => handleLinkClick('#settings')} style={navLinkStyle(activeLink === '#settings')} className="block w-full text-left">Settings</a></li>
          <li className="w-full"><a href="#reports" onClick={() => handleLinkClick('#reports')} style={navLinkStyle(activeLink === '#reports')} className="block w-full text-left">Reports</a></li>
          <li className="w-full">
            <button
              onClick={handleLogout}
              style={navLinkStyle(activeLink === '#logout')}
              className="logout-button block w-full text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav> 

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 animate-fadeIn"
        >
          <p>{notif.message}</p>
          <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
          <button
            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
            className="mt-2 px-4 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      ))}

      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-950 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg font-semibold text-white mb-4">Contact Message Details</h2>
            <p className="text-white"><strong>Name:</strong> {selectedContact.name}</p>
            <p className="text-white"><strong>Email:</strong> {selectedContact.email}</p>
            <p className="text-white"><strong>Message:</strong> {selectedContact.message}</p>
            <p className="text-white"><strong>File:</strong> {selectedContact.file_name || 'No file'}</p>
            <p className="text-white"><strong>Date:</strong> {new Date(selectedContact.created_at).toLocaleString()}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-950 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-lg font-semibold text-white mb-4">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-slate-400 mt-1">Password must be at least 6 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: '', email: '', password: '', role: 'client' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="dashboard" style={sectionStyle}>
        <div className="bg-effect bg-effect-1" style={bgEffectStyle} />
        <div className="section-content" style={sectionContentStyle}>
          <h1 className="section-title" style={sectionTitleStyle}>
            Dashboard
          </h1>
          <p className="section-description" style={sectionDescriptionStyle}>
            Monitor client activity and usage statistics
          </p>

          {loading ? (
            <div className="flex items-center justify-center mt-10">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mr-4"></div>
              <p className="text-white">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center mt-10">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
              >
                Retry
              </button>
            </div>
          ) : dashboardData ? (
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <Card
                title="Client Registrations"
                total={dashboardData.totalRegisters}
                percentage="+0%"
                data={dashboardData.registerData}
                chartData={{
                  labels: dashboardData.registerData.map((item) => item.date),
                  data: dashboardData.registerData.map((item) => item.count),
                }}
              />
              <Card
                title="Client Logins"
                total={dashboardData.totalLogins}
                percentage="+0%"
                data={dashboardData.loginData}
                chartData={{
                  labels: dashboardData.loginData.map((item) => item.date),
                  data: dashboardData.loginData.map((item) => item.count),
                }}
              />
              <div className="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
                <div className="absolute inset-px rounded-[11px] bg-slate-950" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>
                  <div className="mb-4">
                    <ul className="space-y-2 text-sm text-white">
                      {recentActivities.slice(0, 3).map((activity, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{activity.message}</span>
                          <span className="text-slate-400">{activity.timestamp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/admin/activity-details')}
                      className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
                    >
                      View All
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white text-center mt-10">No dashboard data available.</p>
          )}
        </div>
      </section>

      <section id="users" style={sectionStyle}>
        <div className="bg-effect bg-effect-2" style={{ ...bgEffectStyle, background: 'radial-gradient(circle, rgba(72, 52, 212, 0.1) 0%, rgba(0, 0, 0, 0) 70%)' }} />
        <div className="section-content" style={sectionContentStyle}>
          <h1 className="section-title" style={sectionTitleStyle}>
            Users
          </h1>
          <p className="section-description" style={sectionDescriptionStyle}>
            View and manage all user accounts
          </p>
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">User List ({users.length} total)</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-2xl">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.status === 'Active' || user.status === '1' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-gray-500/10 text-gray-500'
                        }`}>
                          {user.status === '1' ? 'Active' : user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-500 hover:text-indigo-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="contacts" style={sectionStyle}>
        <div className="bg-effect bg-effect-1" style={bgEffectStyle} />
        <div className="section-content" style={sectionContentStyle}>
          <h1 className="section-title" style={sectionTitleStyle}>
            Contact Messages
          </h1>
          <p className="section-description" style={sectionDescriptionStyle}>
            View and manage messages from the Contact Us form
          </p>
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Message List ({contactMessages.length} total)</h2>
              <button
                onClick={() => fetchContactMessages()}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow-2xl">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Message</th>
                    <th scope="col" className="px-6 py-3">File</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((msg) => (
                    <tr key={msg.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                      <td className="px-6 py-4">{msg.name}</td>
                      <td className="px-6 py-4">{msg.email}</td>
                      <td className="px-6 py-4 max-w-xs truncate">{msg.message}</td>
                      <td className="px-6 py-4">{msg.file_name || 'No file'}</td>
                      <td className="px-6 py-4">{new Date(msg.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleViewContact(msg)}
                          className="text-indigo-500 hover:text-indigo-400 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteContact(msg.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="settings" style={sectionStyle}>
        <div className="bg-effect bg-effect-1" style={bgEffectStyle} />
        <div className="section-content" style={sectionContentStyle}>
          <h1 className="section-title" style={sectionTitleStyle}>
            Settings
          </h1>
          <p className="section-description" style={sectionDescriptionStyle}>
            Configure your admin preferences
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="group relative flex flex-col rounded-xl bg-slate-950 p-6 shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
              <div className="absolute inset-px rounded-[11px] bg-slate-950" />
              <div className="relative space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Admin Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={adminEmail}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Notification Settings</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="h-4 w-4 text-indigo-500 bg-slate-900 border-slate-800 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="email-notifications" className="text-sm text-white">Enable Email Notifications</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Theme</label>
                  <select
                    className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reports" style={sectionStyle}>
        <div className="bg-effect bg-effect-2" style={{ ...bgEffectStyle, background: 'radial-gradient(circle, rgba(72, 52, 212, 0.1) 0%, rgba(0, 0, 0, 0) 70%)' }} />
        <div className="section-content" style={sectionContentStyle}>
          <h1 className="section-title" style={sectionTitleStyle}>
            Reports
          </h1>
          <p className="section-description" style={sectionDescriptionStyle}>
            Analyze and generate detailed reports
          </p>
          <div className="mt-10 flex flex-wrap gap-6 justify-center">
            <div className="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
              <div className="absolute inset-px rounded-[11px] bg-slate-950" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6m-6 4h6m-6 4h6m-6 4h6" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">User Activity Report</h3>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-400">Generate a report of user activity over the last 30 days.</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateReport('userActivity')}
                    className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Generate Report
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {reportData.userActivity && (
                  <div className="mt-4">
                    <h4 className="text-sm text-white">User Activity (Last 30 Days)</h4>
                    <ul className="text-xs text-slate-400">
                      {reportData.userActivity.map((item, index) => (
                        <li key={index}>{item.date}: {item.count} logins</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
              <div className="absolute inset-px rounded-[11px] bg-slate-950" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Registration Trends</h3>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-400">Analyze registration trends over the past 6 months.</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleGenerateReport('registrationTrends')}
                    className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
                  >
                    Generate Report
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {reportData.registrationTrends && (
                  <div className="mt-4">
                    <h4 className="text-sm text-white">Registration Trends (Last 6 Months)</h4>
                    <ul className="text-xs text-slate-400">
                      {reportData.registrationTrends.map((item, index) => (
                        <li key={index}>{item.date}: {item.count} registrations</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .mobile-nav-toggle {
              display: block;
            }
            .nav-links {
              display: none;
            }
            .nav-links.active {
              display: flex;
              right: 0;
              flex-direction: column;
              align-items: center;
            }
            .nav-links li {
              width: 100%;
              text-align: center;
            }
            .nav-links li ul {
              position: static;
              width: 100%;
              background: transparent;
              box-shadow: none;
            }
            .nav-links li ul li {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .section-title {
              font-size: 12vw;
            }
            .section-description {
              font-size: 1rem;
            }
            .logout-button {
              display: block !important;
              width: 100%;
              padding: 1rem 0 !important;
              font-size: 1.2rem !important;
            }
          }

          @media (min-width: 769px) {
            .nav-links {
              display: flex !important;
              opacity: 1 !important;
              flex-wrap: nowrap;
              overflow-x: auto;
              max-width: 100%;
            }
            .nav-links li {
              display: block;
              flex: 0 0 auto;
            }
            .logout-button {
              display: block !important;
              font-size: 1.1rem !important;
            }
          }

          body {
            overflow-x: hidden;
          }

          .nav-links {
            overflow-x: auto;
            scroll-behavior: smooth;
            white-space: nowrap;
            padding-bottom: 5px;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .nav-links::-webkit-scrollbar {
            display: none;
          }

          .nav-links a:hover,
          .nav-links button:hover {
            transform: scale(1.05);
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .logout-button {
            border: 2px solid rgba(255, 51, 102, 0.7);
            border-radius: 8px;
            padding: 0.5rem 1rem !important;
            transition: all 0.3s ease;
            color: #ff3366 !important;
          }

          .logout-button:hover {
            background: rgba(255, 51, 102, 0.3);
            color: #ffffff !important;
          }

          .light {
            background-color: #f0f0f0;
            color: #333;
          }

          .light .bg-slate-950 {
            background-color: #ffffff;
            color: #333;
          }

          .light .text-white {
            color: #333;
          }

          .light .bg-slate-900\\/50 {
            background-color: #e0e0e0;
          }

          .light .text-slate-400 {
            color: #666;
          }
        `}
      </style>
    </div>
  );
};

export default Home;
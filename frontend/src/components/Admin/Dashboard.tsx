import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';

interface DashboardStats {
  totalUsers: number;
  totalCars: number;
  totalBookings: number;
  pendingContacts: number;
  recentActivities: Activity[];
}

interface Activity {
  id: number;
  message: string;
  timestamp: string;
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

const Dashboard: React.FC = () => {
  // ✅ Initialize as empty/zero values
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    pendingContacts: 0,
    recentActivities: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) {
          console.log('No token found, redirecting to login...');
          navigate('/admin/login');
          return;
        }

        console.log('Fetching dashboard data...');
        const response = await fetch(`${API_URL}/auth/dashboard`, {
          method: 'GET',
          headers: getHeaders(),
          mode: 'cors',
          credentials: 'include',
        });

        console.log('Dashboard response status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login...');
            navigate('/admin/login');
            return;
          }
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('Dashboard data received:', data);
        
        // ✅ Safely format the data with fallbacks
        setStats({
          totalUsers: Number(data.totalUsers) || 0,
          totalCars: Number(data.totalCars) || 0,
          totalBookings: Number(data.totalBookings) || 0,
          pendingContacts: Number(data.pendingContacts) || 0,
          recentActivities: Array.isArray(data.recentActivities) 
            ? data.recentActivities.map((activity: any) => ({
                id: activity.id || 0,
                message: activity.message || activity.action || 'No message',
                timestamp: activity.timestamp 
                  ? new Date(activity.timestamp).toLocaleString('th-TH')
                  : activity.created_at
                  ? new Date(activity.created_at).toLocaleString('th-TH')
                  : 'No date',
              }))
            : [],
        });

        console.log('Stats updated successfully');
      } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        const errorMessage = error.message || 'ไม่สามารถโหลดข้อมูลได้';
        setError(errorMessage);
        
        // ✅ Keep default empty state on error instead of showing nothing
        setStats({
          totalUsers: 0,
          totalCars: 0,
          totalBookings: 0,
          pendingContacts: 0,
          recentActivities: [],
        });
        
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-xl">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-8 max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 mb-4 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all hover:scale-105"
            >
              ลองโหลดใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-white">
      <div className="max-w-[1400px] mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-bold uppercase mb-4"
            style={{
              background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 8s linear infinite',
              backgroundSize: '300%',
            }}
          >
            DASHBOARD
          </h1>
          <p className="text-lg opacity-80">ภาพรวมของระบบ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="ผู้ใช้ทั้งหมด"
            value={stats.totalUsers}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="รถทั้งหมด"
            value={stats.totalCars}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            }
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="การจองทั้งหมด"
            value={stats.totalBookings}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="ข้อความรอตอบกลับ"
            value={stats.pendingContacts}
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            color="from-yellow-500 to-orange-500"
          />
        </div>

        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              กิจกรรมล่าสุด
            </h2>
            <button
              onClick={() => navigate('/admin/activity-details')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm flex items-center gap-1"
            >
              ดูทั้งหมด
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {stats.recentActivities && stats.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-300">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>ยังไม่มีกิจกรรม</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition-all hover:scale-105 text-left"
          >
            <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-1">จัดการผู้ใช้</h3>
            <p className="text-sm text-gray-400">ดู แก้ไข และจัดการผู้ใช้</p>
          </button>

          <button
            onClick={() => navigate('/admin/contacts')}
            className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all hover:scale-105 text-left"
          >
            <svg className="w-8 h-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold mb-1">ข้อความติดต่อ</h3>
            <p className="text-sm text-gray-400">ตอบกลับและจัดการข้อความ</p>
          </button>

          <button
            onClick={() => navigate('/admin/activity-details')}
            className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all hover:scale-105 text-left"
          >
            <svg className="w-8 h-8 text-green-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold mb-1">รายงานกิจกรรม</h3>
            <p className="text-sm text-gray-400">ดูสถิติและกิจกรรมโดยละเอียด</p>
          </button>
        </div>
      </div>

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

export default Dashboard;
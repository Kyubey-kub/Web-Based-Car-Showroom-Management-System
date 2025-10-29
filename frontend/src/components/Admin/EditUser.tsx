// src/components/Admin/EditUser.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
  });
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await apiClient.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        setUserData({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
        });
        setOriginalEmail(user.email);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching user:', error);
        alert('Failed to load user data');
        navigate('/admin/home');
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleSave = async () => {
    // Validation
    if (!userData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!userData.email.trim()) {
      alert('Please enter an email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password validation (only if changed)
    if (userData.password && userData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      // Prepare update data
      const updateData: any = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        role: userData.role,
      };

      // Only include password if it's being changed
      if (userData.password) {
        updateData.password = userData.password;
      }

      await apiClient.put(`/users/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('User updated successfully');
      navigate('/admin/home#users');
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update user';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-5 pb-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">
            <span
              style={{
                background: 'linear-gradient(45deg, #ff3366, #ff6b6b, #4834d4, #686de0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient 8s linear infinite',
                backgroundSize: '300%',
              }}
            >
              Edit User
            </span>
          </h1>
          <button
            onClick={() => navigate('/admin/home#users')}
            className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </button>
        </div>

        <div className="group relative flex flex-col rounded-xl bg-slate-950 p-6 shadow-2xl">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
          <div className="absolute inset-px rounded-[11px] bg-slate-950" />
          
          <div className="relative space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Name *</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email *</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter email address"
                required
              />
              {userData.email !== originalEmail && (
                <p className="text-xs text-yellow-500 mt-1">
                  Warning: Changing email will require the user to login with the new email
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                New Password (leave empty to keep current)
              </label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password (optional)"
                minLength={6}
              />
              <p className="text-xs text-slate-400 mt-1">
                {userData.password 
                  ? 'Password must be at least 6 characters' 
                  : 'Leave empty to keep the current password'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Role *</label>
              <select
                value={userData.role}
                onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                className="w-full rounded-lg bg-slate-900/50 p-3 text-white border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => navigate('/admin/home#users')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <h3 className="text-sm font-medium text-white mb-2">Important Notes:</h3>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>All fields marked with * are required</li>
            <li>Email must be unique across all users</li>
            <li>Password changes are optional - leave empty to keep current password</li>
            <li>Changing email will require the user to login with the new email</li>
            <li>Role changes take effect immediately after saving</li>
          </ul>
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

export default EditUser;
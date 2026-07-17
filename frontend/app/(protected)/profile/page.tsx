'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useGetCurrentUserQuery } from '@/lib/redux/features/auth/authApi';
import { useUpdateProfileMutation } from '@/lib/redux/features/student/studentApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  // Fetch current user data
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: currentUser, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUserQuery(undefined, {
    skip: !authUser,
  });
  const user = currentUser ?? authUser;

  const [updateProfile, { isLoading: isUpdateLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Pre‑fill form fields when user data arrives
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        mobile: user.phone || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.mobile,
      }).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile.');
    }
  };

  // ---------- Loading state ----------
  if (isUserLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  // ---------- Error state ----------
  if (isUserError || !user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
        Failed to load user profile. Please try again later.
      </div>
    );
  }

  // ---------- Success / normal rendering ----------
  const isVerified = false; // adjust if you have a verified field

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div
                  className={`absolute top-0 right-0 text-xs font-semibold px-2 py-1 rounded-full ${
                    isVerified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isVerified ? '✓ Verified' : '✕ Not Verified'}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {user.name || 'User'}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {user.role === 'admin' ? 'Administrator' : 'Student'}
              </p>
              <button className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors font-medium text-sm sm:text-base">
                <Upload size={16} className="inline mr-2" />
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Personal Information
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed text-sm"
                placeholder="Enter email address"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Passwords */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Security &amp; Passwords
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isUpdateLoading}
          className="w-full px-6 py-3 sm:py-4 bg-primary hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
        >
          {isUpdateLoading && <Loader2 size={18} className="animate-spin" />}
          {isUpdateLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
}

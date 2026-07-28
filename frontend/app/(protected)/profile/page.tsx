/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Loader2 } from 'lucide-react';
import { useGetCurrentUserQuery } from '@/lib/redux/features/auth/authApi';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/lib/redux/features/profile/profileApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { PropagateLoader } from 'react-spinners';
import { toast } from 'sonner';
import { getUserProfileImageFromUser } from '@/lib/auth/profileImage';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === 'string'
  ) {
    return (error as { data?: { message?: string } }).data?.message ?? fallback;
  }

  return fallback;
};

export default function AccountSettingsPage() {
  // --- Get current user ---
  const authUser = useAppSelector((state) => state.auth.user);
  const { data: currentUser, isLoading: isUserLoading, isError: isUserError } = useGetCurrentUserQuery(undefined, {
    skip: !authUser,
  });
  const user = currentUser ?? authUser;

  // --- Mutations ---
  const [updateProfile, { isLoading: isProfileUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isPasswordUpdating }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  // Pre‑fill form fields when user data arrives
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        mobile: user.phone || '',
        email: user.email || '',
      }));
      if (!profileImageFile) {
        setProfileImagePreview(getUserProfileImageFromUser(user));
      }
    }
  }, [user, profileImageFile]);

  useEffect(() => {
    return () => {
      if (profileImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 10MB.');
      return;
    }

    if (profileImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(profileImagePreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setProfileImageFile(file);
    setProfileImagePreview(objectUrl);
  };

  // --- Update profile ---
  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.mobile,
        profileImageFile: profileImageFile,
      }).unwrap();
      toast.success('Profile updated successfully!');
      setProfileImageFile(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update profile.'));
    }
  };

  // --- Change password ---
  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.info('Please fill in all password fields.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();
      toast.success('Password changed successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to change password.'));
    }
  };

  // ---------- Loading ----------
  if (isUserLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  // ---------- Error ----------
  if (isUserError || !user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
        Failed to load user profile. Please try again later.
      </div>
    );
  }

  // ---------- Render ----------
  const isVerified = false; // Adjust if you have a verification field

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-white">
      <div className="mx-auto w-full max-w-5xl px-2 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10">
        {/* Profile Header */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-4 sm:mb-8 sm:p-6 lg:mb-10 lg:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                {profileImagePreview ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-primary sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    <Image
                      src={profileImagePreview}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-linear-to-br from-violet-100 to-violet-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    <span className="text-3xl font-bold text-primary">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute -right-2 -top-2 rounded-full px-2 py-1 text-[10px] font-semibold sm:right-0 sm:top-0 sm:text-xs ${
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
            <div className="w-full flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {user.name || 'User'}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {user.role === 'admin' ? 'Administrator' : 'Student'}
              </p>
              <label className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary sm:w-auto sm:px-6 sm:text-base">
                <Upload size={16} className="inline mr-2" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:mb-8 sm:p-6 lg:mb-10 lg:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Personal Information
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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

            {/* Email (read‑only) */}
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
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:mb-8 sm:p-6 lg:mb-10 lg:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Security &amp; Passwords
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
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

            <button
              onClick={handleChangePassword}
              disabled={isPasswordUpdating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:bg-violet-400 md:w-auto"
            >
              {isPasswordUpdating && <Loader2 size={16} className="animate-spin" />}
              {isPasswordUpdating ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Update Profile Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isProfileUpdating}
          className="w-full px-6 py-3 sm:py-4 bg-primary hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
        >
          {isProfileUpdating && <Loader2 size={18} className="animate-spin" />}
          {isProfileUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
}

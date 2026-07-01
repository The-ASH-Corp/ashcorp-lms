'use client';

import { useState } from 'react';
import { Shield, Upload } from 'lucide-react';


export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    name: 'Alex Rivers',
    mobile: '+1 (555) 799-4408',
    email: 'alex.rivers@ash-academy.edu',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="w-full bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Profile Section */}
        <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-violet-600 bg-linear-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                  <Shield size={48} className="text-violet-600" />
                </div>
                <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                  ✕ Not Verified
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Alex Rivers
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Premium Member
              </p>
              <button className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-violet-600 hover:text-violet-600 transition-colors font-medium text-sm sm:text-base">
                <Upload size={16} className="inline mr-2" />
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Personal Information
          </h3>

          <div className="space-y-6">
            {/* Name and Mobile Row */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            {/* Email Row */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Security & Passwords */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 lg:p-10 mb-8 lg:mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Security & Passwords
          </h3>

          <div className="space-y-6">
            {/* Password Fields Grid */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors text-sm"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Button */}
        <button
          onClick={handleUpdateProfile}
          disabled={isLoading}
          className="w-full px-6 py-3 sm:py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-lg font-semibold text-base transition-colors mb-12"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
}

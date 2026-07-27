'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useCreateStudentMutation } from '@/lib/redux/features/student/studentApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ── Validation Schema ─────────────────────────────────────────────────────────
const createStudentSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .length(10, 'Phone number must be exactly 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    verifyByDefault: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }
  });

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  verifyByDefault: false,
};

type FormData = typeof initialFormData;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CreateStudent() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [createStudent, { isLoading }] = useCreateStudentMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, verifyByDefault: !prev.verifyByDefault }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStudentSchema.safeParse(formData);

    if (!result.success) {
      const nextErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (typeof field === 'string') {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    const res = await createStudent({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      verifyByDefault: formData.verifyByDefault,
    });

    if ('data' in res) {
      toast.success('Student account created successfully');
      router.push('/admin/students');
    } else if ('error' in res) {
      const err = res.error as { data?: { message?: string; error?: string } } | undefined;
      const message = err?.data?.message ?? err?.data?.error ?? 'Failed to create student';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Create Student Account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add a new student to enroll them in Ash Academy
            </p>
          </div>
        </div>

        <form className="space-y-4 sm:space-y-6 lg:space-y-8" onSubmit={handleSubmit}>

          {/* ── Personal Information Section ─────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-primary text-lg font-bold">👤</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Julian Ashwell"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.fullName ? (
                  <p className="text-xs text-red-500 mt-2">{errors.fullName}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.fullName.length}/50 characters
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@ashacademy.com"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-2">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-2">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Security & Access Section ─────────────────────────────── */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-primary text-lg font-bold">🔒</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Security &amp; Access
              </h2>
            </div>

            <div className="space-y-6">
              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter student password"
                      className="w-full h-12 px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-2">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter password again"
                      className="w-full h-12 px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Verify by Default Toggle */}
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    Verify Account by Default
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Skip email verification and mark account as verified immediately
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                    formData.verifyByDefault ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.verifyByDefault ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ── Action Buttons ────────────────────────────────────────── */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/students')}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Student Account'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "@/lib/redux/features/student/studentApi";

const studentSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().length(10, "Phone number must be exactly 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters").optional().or(z.literal("")),
    verifyByDefault: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords must match",
      });
    }
  });

interface StudentFormProps {
  mode?: "create" | "edit";
  studentId?: string;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    verifyByDefault?: boolean;
  } | null;
}

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  verifyByDefault: false,
};

type FormData = typeof initialFormData;
type FormErrors = Partial<Record<keyof FormData, string>>;

export function StudentForm({ mode = "create", studentId, initialValues }: StudentFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    ...(initialValues ?? {}),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }));
    }
  };

  const handleToggle = () => {
    setFormData((previous) => ({ ...previous, verifyByDefault: !previous.verifyByDefault }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationResult = studentSchema.safeParse({
      ...formData,
      password: mode === "edit" ? formData.password : formData.password,
    });

    if (!validationResult.success) {
      const nextErrors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string") {
          nextErrors[fieldName as keyof FormErrors] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      if (mode === "edit" && studentId) {
        await updateStudent({
          id: studentId,
          student: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || undefined,
            confirmPassword: formData.confirmPassword || undefined,
          },
        }).unwrap();
        toast.success("Student updated successfully");
      } else {
        await createStudent({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          verifyByDefault: formData.verifyByDefault,
        }).unwrap();
        toast.success("Student account created successfully");
      }

      router.push("/admin/students");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data?: { message?: string } }).data?.message
          : mode === "edit"
            ? "Failed to update student"
            : "Failed to create student";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        <form className="space-y-4 sm:space-y-6 lg:space-y-8" onSubmit={handleSubmit}>
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-primary text-lg font-bold">👤</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Julian Ashwell"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.name ? (
                  <p className="text-xs text-red-500 mt-2">{errors.name}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">{formData.name.length}/50 characters</p>
                )}
              </div>

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
                {errors.email && <p className="text-xs text-red-500 mt-2">{errors.email}</p>}
              </div>

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
                {errors.phone && <p className="text-xs text-red-500 mt-2">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-primary text-lg font-bold">🔒</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Security &amp; Access</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Password {mode === "create" && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={mode === "edit" ? "Leave blank to keep current password" : "Enter student password"}
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
                  {errors.password && <p className="text-xs text-red-500 mt-2">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Confirm Password {mode === "create" && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={mode === "edit" ? "Leave blank to keep current password" : "Enter password again"}
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
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-2">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Verify Account by Default</p>
                  <p className="text-xs text-gray-500 mt-0.5">Skip email verification and mark account as verified immediately</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${formData.verifyByDefault ? "bg-primary" : "bg-gray-300"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.verifyByDefault ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/students")}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <Button type="submit" disabled={isCreating || isUpdating} className="px-8 py-3 bg-primary h-12 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {isCreating || isUpdating ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update Student Account" : "Create Student Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;

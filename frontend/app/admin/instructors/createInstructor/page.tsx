"use client";

import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createInstructorSchema } from "@/lib/validations/instructor";
import { useCreateInstructorMutation } from "@/lib/redux/features/instructor/instructorApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  instructorTitle: "",
  about: "",
  password: "",
  confirmPassword: "",
  isFeatured: false,
  verifyByDefault: false,
};

type FormData = typeof initialFormData;
type FormErrors = Partial<Record<keyof FormData | "profileImage", string>>;

export default function CreateInstructorPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [createInstructor, { data, isLoading, isError }] =
    useCreateInstructorMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggle = (
    name: keyof Pick<FormData, "isFeatured" | "verifyByDefault">,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      if (errors.profileImage) {
        setErrors((prev) => ({ ...prev, profileImage: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = createInstructorSchema.safeParse({
      ...formData,
      profileImage,
    });

    if (!validationResult.success) {
      const nextErrors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FormErrors;
        if (typeof fieldName === "string") {
          nextErrors[fieldName] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("instructorTitle", formData.instructorTitle);
    payload.append("about", formData.about);
    payload.append("password", formData.password);
    payload.append("confirmPassword", formData.confirmPassword);
    payload.append("isFeatured", String(formData.isFeatured));
    payload.append("verifyByDefault", String(formData.verifyByDefault));

    if (profileImage) {
      payload.append("profileImage", profileImage);
    }

    
    console.log("Instructor form validated", payload);
    const res = await createInstructor(payload);
    if (res.data) {
      toast.success("Instructor created successfully");
      router.push("/admin/instructors");
    }
    if (res.error) {
      toast.error("Instructor creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Form Container */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12">
        <form
          className="space-y-4 sm:space-y-6 lg:space-y-8"
          onSubmit={handleSubmit}
        >
          {/* Personal Information Section */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-violet-600 text-lg font-bold">👤</span>
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.name ? (
                  <p className="text-xs text-red-500 mt-2">{errors.name}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">0/50 characters</p>
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
                  onChange={handleInputChange}
                  placeholder="Enter user email"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
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
                  onChange={handleInputChange}
                  placeholder="Enter user phone"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-2">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Profile Section */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-violet-600 text-lg font-bold">📚</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Academic Profile
              </h2>
            </div>

            <div className="space-y-6">
              {/* Instructor Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Instructor Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="instructorTitle"
                  value={formData.instructorTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="w-full h-12 px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                />
                {errors.instructorTitle ? (
                  <p className="text-xs text-red-500 mt-2">
                    {errors.instructorTitle}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">0/60 characters</p>
                )}
              </div>

              {/* Profile Picture and Instructor About */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Profile Picture (JPG, JPEG, PNG){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-violet-600 transition-colors cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer block"
                    >
                      <Upload
                        className="mx-auto mb-2 text-gray-400"
                        size={32}
                      />
                      <p className="text-gray-600 text-sm font-medium mb-1">
                        Drag and drop or{" "}
                        <span className="text-violet-600 font-bold">
                          Choose a file
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        RECOMMENDED SIZE: 800x800px
                      </p>
                    </label>
                  </div>
                  {profileImage && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ {profileImage.name}
                    </p>
                  )}
                  {errors.profileImage && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.profileImage}
                    </p>
                  )}
                </div>

                {/* Instructor About */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Instructor About <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Share a brief academic biography..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors resize-none"
                  />
                  {errors.about ? (
                    <p className="text-xs text-red-500 mt-2">{errors.about}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">
                      0/500 characters
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Visibility Section */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <span className="text-violet-600 text-lg font-bold">🔒</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Security & Visibility
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter user password"
                      className="w-full h-12 px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Enter user password again"
                      className="w-full h-12 px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-violet-600 focus:ring-2 focus:ring-violet-100 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 flex gap-3 justify-evenly">
                {/* Feature on Homepage Toggle */}
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg gap-3">
                  <label className="text-sm sm:text-base text-gray-700 font-medium cursor-pointer ">
                    Feature on Homepage
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggle("isFeatured")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isFeatured ? "bg-violet-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isFeatured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Verify Account by Default Toggle */}
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg h-fit gap-3">
                  <label className="text-sm sm:text-base text-gray-700 font-medium cursor-pointer">
                    Verify Account by Default
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggle("verifyByDefault")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.verifyByDefault ? "bg-violet-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.verifyByDefault
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
            <button
              type="submit"
              className="px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors"
            >
              Create Instructor Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

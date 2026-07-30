import { api } from "../../services/api";

export interface UpdateProfileRequest {
  name?: string;
  phone?: string | number;
  profileImageFile?: File | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    phone: string;
    email: string;
    profileImage?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: "/student/update-profile",
        method: "PATCH",
        body: (() => {
          const formData = new FormData();

          if (data.name !== undefined) {
            formData.append("name", data.name);
          }

          if (data.phone !== undefined) {
            formData.append("phone", String(data.phone));
          }

          if (data.profileImageFile) {
            formData.append("profileImage", data.profileImageFile);
          }

          return formData;
        })(),
      }),
      invalidatesTags: ["User", "Student"],
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;
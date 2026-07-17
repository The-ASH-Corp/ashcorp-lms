import { api } from "../../services/api";

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    phone: string;
    email: string;
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
        body: data,
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
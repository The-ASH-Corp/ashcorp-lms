import { api } from "../../services/api";

export interface SubmitInquiryRequest {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface SubmitInquiryResponse {
  success: boolean;
  message: string;
}

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitInquiry: builder.mutation<SubmitInquiryResponse, SubmitInquiryRequest>({
      query: (payload) => ({
        url: "/contact/submit",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useSubmitInquiryMutation } = contactApi;

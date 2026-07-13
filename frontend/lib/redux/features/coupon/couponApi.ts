import { api } from "../../services/api";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  applicableFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  discount: number;
  applicableFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface UpdateCouponRequest extends CreateCouponRequest {
  id: string;
}

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCoupon: builder.mutation<void, CreateCouponRequest>({
      query: (coupon) => ({
        url: "/coupon/create",
        method: "POST",
        body: coupon,
      }),
      invalidatesTags: ["Coupon"],
    }),

    getCouponById: builder.query<Coupon, string>({
      query: (id) => `/coupon/${id}`,
      transformResponse: (response: any) => response.data as Coupon,
      providesTags: (_result, _error, id) => [{ type: "Coupon", id }],
    }),

    updateCoupon: builder.mutation<Coupon, UpdateCouponRequest>({
      query: ({ id, ...coupon }) => ({
        url: `/coupon/${id}`,
        method: "PATCH",
        body: coupon,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Coupon",
        { type: "Coupon", id },
      ],
    }),

    getAllCoupons: builder.query<Coupon[], void>({
      query: () => "/coupon/all-coupons",
      transformResponse: (response: any) => response.data as Coupon[],
      providesTags: ["Coupon"],
    }),

    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/coupon/delete-coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),

    toggleCouponStatus: builder.mutation<Coupon, string>({
      query: (id) => ({
        url: `/coupon/toggle-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} = couponApi;

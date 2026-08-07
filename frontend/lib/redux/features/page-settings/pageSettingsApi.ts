import { api } from "@/lib/redux/services/api";

export interface ITestimonial {
  id: string;
  quote: string;
  authorName: string;
  role?: string;
  rating?: number;
  isApproved: boolean;
}

export interface IHomepageSettings {
  _id?: string;
  hero: {
    enabled: boolean;
    badgeText: string;
    mainHeadline: string;
    headlineHighlight: string;
    subHeadline: string;
    searchPlaceholder: string;
    tags: string[];
  };
  stats: {
    enabled: boolean;
  };
  categories: {
    enabled: boolean;
    subtitle: string;
    title: string;
    description: string;
  };
  trendingWorkshops: {
    enabled: boolean;
    subtitle: string;
    title: string;
    description: string;
  };
  graduates: {
    enabled: boolean;
    subtitle: string;
    title: string;
  };
  testimonialsSection: {
    enabled: boolean;
    subtitle: string;
    title: string;
    items: ITestimonial[];
  };
  footer: {
    enabled: boolean;
    brandDescription: string;
    copyrightText: string;
    contactEmail: string;
  };
}

export interface IVisionary {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface ICoreValue {
  id: string;
  title: string;
  description: string;
}

export interface IAboutPageSettings {
  _id?: string;
  sectionVisibility: {
    hero: boolean;
    coreValues: boolean;
    leadership: boolean;
    impactMetrics: boolean;
    philosophy: boolean;
  };
  hero: {
    enabled: boolean;
    mainHeadline: string;
    bodyNarrative: string;
  };
  leadership: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: IVisionary[];
  };
  impactMetrics: {
    enabled: boolean;
  };
  coreValues: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: ICoreValue[];
  };
  philosophy: {
    enabled: boolean;
    sectionHeading: string;
    philosophyContent: string;
    image: string;
  };
  updatedAt?: string;
}

export const pageSettingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomepageSettings: builder.query<IHomepageSettings, void>({
      query: () => "/page-settings/homepage",
      transformResponse: (response: { success: boolean; data: IHomepageSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateHomepageSettings: builder.mutation<
      IHomepageSettings,
      Partial<IHomepageSettings>
    >({
      query: (body) => ({
        url: "/page-settings/homepage",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IHomepageSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
    getAboutSettings: builder.query<IAboutPageSettings, void>({
      query: () => "/page-settings/about",
      transformResponse: (response: { success: boolean; data: IAboutPageSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateAboutSettings: builder.mutation<
      IAboutPageSettings,
      Partial<IAboutPageSettings>
    >({
      query: (body) => ({
        url: "/page-settings/about",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IAboutPageSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
  }),
});

export const {
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  useGetAboutSettingsQuery,
  useUpdateAboutSettingsMutation,
} = pageSettingsApi;

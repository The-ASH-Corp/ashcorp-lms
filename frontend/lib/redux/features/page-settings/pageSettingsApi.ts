import { api } from "@/lib/redux/services/api";

export interface IGeneralSettings {
  _id?: string;
  logoUrl: string;
}

export interface IAuthSettings {
  _id?: string;
  heroImage: string;
  heading: string;
  headingHighlight1: string;
  headingHighlight2: string;
  description: string;
  footerText: string;
}

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

export interface IFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface IContactPageSettings {
  _id?: string;
  sectionVisibility: {
    hero: boolean;
    supportCards: boolean;
    inquiryForm: boolean;
    institutionMap: boolean;
    faqs: boolean;
  };
  metadata: {
    pageTitle: string;
    metaDescription: string;
  };
  hero: {
    badgeText: string;
    headline: string;
    description: string;
  };
  inquiryForm: {
    formHeading: string;
    routingEmail: string;
    successMessage: string;
  };
  directories: {
    studentSupport: {
      phone: string;
      email: string;
      description: string;
    };
    partnerships: {
      email: string;
      description: string;
    };
  };
  locationMap: {
    enabled: boolean;
    title: string;
    address: string;
    mapEmbedUrl: string;
  };
  faqs: {
    title: string;
    subtitle: string;
    items: IFaqItem[];
  };
  updatedAt?: string;
}

export interface IPolicySectionItem {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
}

export interface IPrivacyPolicySettings {
  _id?: string;
  sectionVisibility: {
    hero: boolean;
    policySections: boolean;
    supportCta: boolean;
  };
  metadata: {
    pageTitle: string;
    metaDescription: string;
  };
  hero: {
    enabled: boolean;
    badgeText: string;
    headline: string;
    description: string;
    lastUpdatedDate: string;
  };
  policySections: {
    enabled: boolean;
    items: IPolicySectionItem[];
  };
  supportCta: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
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
    getContactSettings: builder.query<IContactPageSettings, void>({
      query: () => "/page-settings/contact",
      transformResponse: (response: { success: boolean; data: IContactPageSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateContactSettings: builder.mutation<
      IContactPageSettings,
      Partial<IContactPageSettings>
    >({
      query: (body) => ({
        url: "/page-settings/contact",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IContactPageSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
    getPrivacyPolicySettings: builder.query<IPrivacyPolicySettings, void>({
      query: () => "/page-settings/privacy-policy",
      transformResponse: (response: { success: boolean; data: IPrivacyPolicySettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updatePrivacyPolicySettings: builder.mutation<
      IPrivacyPolicySettings,
      Partial<IPrivacyPolicySettings>
    >({
      query: (body) => ({
        url: "/page-settings/privacy-policy",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IPrivacyPolicySettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
    getTermsConditionsSettings: builder.query<ITermsConditionsSettings, void>({
      query: () => "/page-settings/terms-conditions",
      transformResponse: (response: { success: boolean; data: ITermsConditionsSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateTermsConditionsSettings: builder.mutation<
      ITermsConditionsSettings,
      Partial<ITermsConditionsSettings>
    >({
      query: (body) => ({
        url: "/page-settings/terms-conditions",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: ITermsConditionsSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
    uploadImage: builder.mutation<{ success: boolean; message: string; url: string }, FormData>({
      query: (body) => ({
        url: "/page-settings/upload-image",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; message: string; url: string }) => response,
    }),
    getGeneralSettings: builder.query<IGeneralSettings, void>({
      query: () => "/page-settings/general",
      transformResponse: (response: { success: boolean; data: IGeneralSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateGeneralSettings: builder.mutation<
      IGeneralSettings,
      Partial<IGeneralSettings>
    >({
      query: (body) => ({
        url: "/page-settings/general",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IGeneralSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
    getAuthSettings: builder.query<IAuthSettings, void>({
      query: () => "/page-settings/auth",
      transformResponse: (response: { success: boolean; data: IAuthSettings }) =>
        response.data,
      providesTags: ["PageSettings"],
    }),
    updateAuthSettings: builder.mutation<
      IAuthSettings,
      Partial<IAuthSettings>
    >({
      query: (body) => ({
        url: "/page-settings/auth",
        method: "PUT",
        body,
      }),
      transformResponse: (response: { success: boolean; data: IAuthSettings }) =>
        response.data,
      invalidatesTags: ["PageSettings"],
    }),
  }),
});

export interface ITermsSectionItem {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
}

export interface ITermsConditionsSettings {
  _id?: string;
  sectionVisibility: {
    hero: boolean;
    termsSections: boolean;
  };
  metadata: {
    pageTitle: string;
    metaDescription: string;
  };
  hero: {
    enabled: boolean;
    badgeText: string;
    headline: string;
    description: string;
    lastUpdatedDate: string;
  };
  termsSections: {
    enabled: boolean;
    items: ITermsSectionItem[];
  };
  updatedAt?: string;
}

export const {
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  useGetAboutSettingsQuery,
  useUpdateAboutSettingsMutation,
  useGetContactSettingsQuery,
  useUpdateContactSettingsMutation,
  useGetPrivacyPolicySettingsQuery,
  useUpdatePrivacyPolicySettingsMutation,
  useGetTermsConditionsSettingsQuery,
  useUpdateTermsConditionsSettingsMutation,
  useUploadImageMutation,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useGetAuthSettingsQuery,
  useUpdateAuthSettingsMutation,
} = pageSettingsApi;

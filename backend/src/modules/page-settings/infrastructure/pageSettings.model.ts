import { Schema, model, Document } from "mongoose";

export interface ITestimonial {
  id: string;
  quote: string;
  authorName: string;
  role?: string;
  rating?: number;
  isApproved: boolean;
}

export interface IHomepageSettings extends Document {
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
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  id: { type: String, required: true },
  quote: { type: String, required: true },
  authorName: { type: String, required: true },
  role: { type: String, default: "Student" },
  rating: { type: Number, default: 5 },
  isApproved: { type: Boolean, default: true },
});

const homepageSettingsSchema = new Schema<IHomepageSettings>(
  {
    hero: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "Creative learning for builders" },
      mainHeadline: { type: String, default: "Master the Art of" },
      headlineHighlight: { type: String, default: "Creative Learning" },
      subHeadline: {
        type: String,
        default:
          "Join 1k+ students building the future through design, code, and digital art.",
      },
      searchPlaceholder: {
        type: String,
        default: "What do you want to learn today?",
      },
      tags: {
        type: [String],
        default: ["Design tracks", "Live mentorship"],
      },
    },
    stats: {
      enabled: { type: Boolean, default: true },
    },
    categories: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "CATEGORIES" },
      title: { type: String, default: "Explore Categories" },
      description: {
        type: String,
        default: "Hand-picked creative pathways just for you.",
      },
    },
    trendingWorkshops: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "POPULAR WORKSHOPS" },
      title: { type: String, default: "Trending Courses" },
      description: {
        type: String,
        default: "The most purchased courses right now.",
      },
    },
    graduates: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "GRADUATES & ALUMNI" },
      title: { type: String, default: "Our Alumni Work at World-Class Companies" },
    },
    testimonialsSection: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "Testimonials" },
      title: { type: String, default: "What our Students say about us" },
      items: {
        type: [testimonialSchema],
        default: [
          {
            id: "static-1",
            quote:
              "At first, I was worried that MERN Stack would be too difficult. But the way each topic was explained made learning feel much less overwhelming. The recorded classes were a huge help.",
            authorName: "VishnuPriya",
            role: "Full Stack Student",
            rating: 5,
            isApproved: true,
          },
          {
            id: "static-2",
            quote:
              "I never thought designing could be this easy to learn. The lessons were clear, and being able to replay the videos helped me improve with every project.",
            authorName: "Safa",
            role: "UI/UX Student",
            rating: 5,
            isApproved: true,
          },
          {
            id: "static-3",
            quote:
              "I joined the Digital Marketing course just to learn the basics, but it gave me much more than I expected. The classes were simple, practical, and easy to follow from home.",
            authorName: "Shafal",
            role: "Digital Marketer",
            rating: 5,
            isApproved: true,
          },
        ],
      },
    },
    footer: {
      enabled: { type: Boolean, default: true },
      brandDescription: {
        type: String,
        default:
          "Making creative education accessible, fun, and results-driven for learners everywhere.",
      },
      copyrightText: {
        type: String,
        default: "© 2026 Ash Academy. Empowering learners worldwide.",
      },
      contactEmail: { type: String, default: "support@ashacademy.com" },
    },
  },
  { timestamps: true }
);

export const HomepageSettingsModel = model<IHomepageSettings>(
  "HomepageSettings",
  homepageSettingsSchema
);

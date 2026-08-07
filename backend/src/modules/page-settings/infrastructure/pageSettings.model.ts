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

// --- About Page Settings Schema ---
const visionarySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: "" },
});

const coreValueSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const aboutSettingsSchema = new Schema(
  {
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      coreValues: { type: Boolean, default: true },
      leadership: { type: Boolean, default: true },
      impactMetrics: { type: Boolean, default: true },
      philosophy: { type: Boolean, default: true },
    },
    hero: {
      enabled: { type: Boolean, default: true },
      mainHeadline: { type: String, default: "Learn Anywhere Grow Everywhere" },
      bodyNarrative: {
        type: String,
        default:
          "ASH Academy LMS was built on one idea: great learning shouldn't be limited by time, place, or pace. Through expertly crafted courses, self-paced flexibility, and lifetime access, we help learners turn curiosity into capability - building real skills that open real doors, wherever they are in the world.",
      },
    },
    leadership: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Meet Our Visionaries" },
      subtitle: {
        type: String,
        default:
          "Leading with conviction, our executive board combines decades of experience across academia and industry.",
      },
      items: {
        type: [visionarySchema],
        default: [
          {
            id: "vis-1",
            name: "SUFAIL P",
            role: "Chief Executive Officer",
            image: "/images/ASH_LMS_SUFAIL_photo.jpeg",
          },
          {
            id: "vis-2",
            name: "SHIBILI RAHIMAN KP",
            role: "Co-founder",
            image: "/images/ASH_LMS_SR_photo.jpeg",
          },
          {
            id: "vis-3",
            name: "GOPIKA",
            role: "HUMAN RESOURCE",
            image: "/images/ASH_LMS_HR_photo.jpeg",
          },
          {
            id: "vis-4",
            name: "MOHAMMED HASHIR U",
            role: "ACADEMIC COORDINATOR",
            image: "/images/ASH_LMS_HASHIR_photo.jpeg",
          },
        ],
      },
    },
    impactMetrics: {
      enabled: { type: Boolean, default: true },
    },
    coreValues: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "The Pillars of ASH Academy" },
      subtitle: {
        type: String,
        default:
          "These aren't just values on a page they're the foundation behind every course we build and every learner we support.",
      },
      items: {
        type: [coreValueSchema],
        default: [
          {
            id: "cv-1",
            title: "Innovation",
            description:
              "We constantly evolve our courses and platform, blending modern teaching methods with practical, real-world skills learners can actually use.",
          },
          {
            id: "cv-2",
            title: "Integrity",
            description:
              "We're honest about what our courses deliver — no filler, no false promises. Just clear, quality content that respects your time and trust.",
          },
          {
            id: "cv-3",
            title: "Community",
            description:
              "We're building a growing network of learners, mentors, and industry experts who support each other's growth, long after a course ends.",
          },
          {
            id: "cv-4",
            title: "Excellence",
            description:
              "We hold every course to a high standard — because 'good enough' isn't good enough when it comes to your career and your goals.",
          },
        ],
      },
    },
    philosophy: {
      enabled: { type: Boolean, default: true },
      sectionHeading: { type: String, default: "Built for Learners, Not Just Learning" },
      philosophyContent: {
        type: String,
        default:
          "ASH Academy LMS started with a simple observation, most online courses are built for content, not for people. We set out to change that designing a platform where every course is crafted with care, every lesson respects your time and every learner has the freedom to move at their own pace.\n\nWhat began as a small idea has grown into a platform trusted by learners worldwide. Today, we offer lifetime access to expertly designed courses that turn curiosity into real, career-ready skills because we believe education should adapt to your life, not the other way around.",
      },
      image: { type: String, default: "/images/campus.png" },
    },
  },
  { timestamps: true }
);

export const AboutSettingsModel = model("AboutSettings", aboutSettingsSchema);


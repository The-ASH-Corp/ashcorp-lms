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

// --- Contact Page Settings Schema ---
const faqItemSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const contactSettingsSchema = new Schema(
  {
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      supportCards: { type: Boolean, default: true },
      inquiryForm: { type: Boolean, default: true },
      institutionMap: { type: Boolean, default: true },
      faqs: { type: Boolean, default: true },
    },
    metadata: {
      pageTitle: { type: String, default: "Contact Ash Academy" },
      metaDescription: {
        type: String,
        default:
          "Get in touch with Ash Academy for admissions, institutional partnerships, and general inquiries.",
      },
    },
    hero: {
      badgeText: { type: String, default: "Connect with Us" },
      headline: { type: String, default: "Get in Touch with Academic Zenith" },
      description: {
        type: String,
        default:
          "Whether you're a prospective student seeking guidance, a corporate entity looking for strategic partnerships, or a media representative, our specialized teams are ready to provide the professional support you deserve.",
      },
    },
    inquiryForm: {
      formHeading: { type: String, default: "Send an Inquiry" },
      routingEmail: { type: String, default: "inquiries@ashacademy.ai" },
      successMessage: {
        type: String,
        default: "Thank you for contacting Ash Academy. A representative will respond within 24 hours.",
      },
    },
    directories: {
      studentSupport: {
        phone: { type: String, default: "+91 9037009400" },
        email: { type: String, default: "connect@ashacademy.ai" },
        description: {
          type: String,
          default: "Dedicated assistance for enrollment, course access, and technical inquiries.",
        },
      },
      partnerships: {
        email: { type: String, default: "hr@ashacademy.ai" },
        description: {
          type: String,
          default: "Explore institutional collaboration and corporate training opportunities.",
        },
      },
    },
    locationMap: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Our Campus & Location" },
      address: {
        type: String,
        default: "Ashcorp Technology - Digital Marketing, Software Development, Tirur",
      },
      mapEmbedUrl: {
        type: String,
        default:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d712.5535472308395!2d75.94660271623343!3d10.953023494019337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b35545b7a371%3A0x59efa33ed27234a7!2sAshcorp%20Technology-%20Digital%20Marketing%2C%20Software%20Development%2C%20Flutter%20%2C%20MERN%20Stack%20Development%20in%20Tirur!5e1!3m2!1sen!2sin!4v1785563688272!5m2!1sen!2sin",
      },
    },
    faqs: {
      title: { type: String, default: "Frequently Asked Questions" },
      subtitle: { type: String, default: "Quick answers to common inquiries" },
      items: {
        type: [faqItemSchema],
        default: [
          {
            id: "faq-1",
            question: "Why should I choose ASH Academy?",
            answer:
              "ASH Academy focuses on practical, industry-relevant education through expert mentorship, hands-on training, real-world projects, and dedicated career support, helping learners become confident and job-ready professionals.",
          },
          {
            id: "faq-2",
            question: "Will I receive a certificate after completing the course?",
            answer:
              "Yes. Once you complete the course and successfully pass the final assessment, your certificate will be issued after verification.",
          },
          {
            id: "faq-3",
            question: "How can I contact support if I have an issue?",
            answer:
              "You can reach our support team anytime through the Contact Us page, and we'll get back to you promptly.",
          },
          {
            id: "faq-4",
            question: "What happens if I lose internet access mid-lesson?",
            answer: "You can pause and resume lessons anytime - your progress is automatically saved.",
          },
        ],
      },
    },
  },
  { timestamps: true }
);

export const ContactSettingsModel = model("ContactSettings", contactSettingsSchema);

// --- Privacy Policy Page Settings Schema ---
const policySectionItemSchema = new Schema({
  id: { type: String, required: true },
  sectionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const privacyPolicySettingsSchema = new Schema(
  {
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      policySections: { type: Boolean, default: true },
      supportCta: { type: Boolean, default: true },
    },
    metadata: {
      pageTitle: { type: String, default: "Privacy Policy | Ash Academy" },
      metaDescription: {
        type: String,
        default: "Learn how Ash Academy LMS collects, uses, and protects your personal data.",
      },
    },
    hero: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "Ash Academy • Privacy & Information" },
      headline: { type: String, default: "Privacy Policy" },
      description: {
        type: String,
        default:
          "Your privacy matters to us. This Privacy Policy explains how ASH Academy LMS collects, uses, and protects your personal information when you use our platform.",
      },
      lastUpdatedDate: { type: String, default: "July 29, 2026" },
    },
    policySections: {
      enabled: { type: Boolean, default: true },
      items: {
        type: [policySectionItemSchema],
        default: [
          {
            id: "pol-1",
            sectionNumber: 1,
            title: "Information We Collect",
            content:
              "We collect Account Information (Name, email address, password), Payment Information (Billing address, transaction history), Usage Data (Courses viewed, progress, quiz results), Device Information (IP address, browser type), and Communications (Support requests, feedback).",
          },
          {
            id: "pol-2",
            sectionNumber: 2,
            title: "How We Use Your Information",
            content:
              "To create and manage your account, provide access to purchased courses, track learning progress, process payments, send certificates, customer support responses, and platform updates.",
          },
          {
            id: "pol-3",
            sectionNumber: 3,
            title: "Cookies & Tracking Technologies",
            content:
              "We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how you use the Platform. You can control cookie preferences through your browser settings.",
          },
          {
            id: "pol-4",
            sectionNumber: 4,
            title: "How We Share Your Information",
            content:
              "We do not sell your personal information. We may share data with service providers (payment processors, hosting), course instructors (to support learning), and legal authorities when required by law.",
          },
          {
            id: "pol-5",
            sectionNumber: 5,
            title: "Data Retention",
            content:
              "We retain your personal information for as long as your account is active or as needed to provide lifetime course access. You may request account deletion at any time.",
          },
          {
            id: "pol-6",
            sectionNumber: 6,
            title: "Data Security",
            content:
              "We implement industry-standard security measures including encryption and secure servers to protect your personal information.",
          },
          {
            id: "pol-7",
            sectionNumber: 7,
            title: "Your Rights",
            content:
              "You have the right to access, correct, delete, or restrict processing of your personal data, and withdraw marketing consent anytime by contacting us.",
          },
          {
            id: "pol-8",
            sectionNumber: 8,
            title: "Children's Privacy",
            content:
              "ASH Academy LMS is not intended for children under 16. We do not knowingly collect personal information from children without parental consent.",
          },
          {
            id: "pol-9",
            sectionNumber: 9,
            title: "Third-Party Links",
            content:
              "Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of these third parties.",
          },
          {
            id: "pol-10",
            sectionNumber: 10,
            title: "International Data Transfers",
            content:
              "Your information may be processed in countries other than your own with appropriate data protection safeguards in place.",
          },
          {
            id: "pol-11",
            sectionNumber: 11,
            title: "Changes to This Policy",
            content:
              "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy with a revised date.",
          },
          {
            id: "pol-12",
            sectionNumber: 12,
            title: "Contact Us",
            content:
              "If you have questions about this Privacy Policy or how we handle your data, please reach out via our Contact Us page.",
          },
        ],
      },
    },
    supportCta: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Still have questions?" },
      description: {
        type: String,
        default:
          "Our support team is happy to help clarify any part of this policy or address your privacy concerns. Reach out anytime — we typically respond within one business day.",
      },
      buttonText: { type: String, default: "Contact Support" },
    },
  },
  { timestamps: true }
);

export const PrivacyPolicySettingsModel = model(
  "PrivacyPolicySettings",
  privacyPolicySettingsSchema
);




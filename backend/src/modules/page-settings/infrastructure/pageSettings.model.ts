import { Schema, model } from "mongoose";

// --- Homepage Settings Schema ---
const testimonialSchema = new Schema({
  id: { type: String, required: true },
  quote: { type: String, required: true },
  authorName: { type: String, required: true },
  role: { type: String, default: "" },
  rating: { type: Number, default: 5 },
  isApproved: { type: Boolean, default: true },
});

const homepageSettingsSchema = new Schema(
  {
    hero: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "ZENITH OF ACADEMIC EXCELLENCE" },
      mainHeadline: { type: String, default: "Master the Future of" },
      headlineHighlight: { type: String, default: "Technology & Business" },
      subHeadline: {
        type: String,
        default:
          "Empowering visionaries with industry-grade skills, expert mentorship, and career-defining certificates. Join thousands of high-achieving learners worldwide.",
      },
      searchPlaceholder: {
        type: String,
        default: "Search courses, technologies, skills...",
      },
      tags: {
        type: [String],
        default: [
          "MERN Stack",
          "Flutter App Dev",
          "Digital Marketing",
          "UI/UX Design",
          "Python AI",
        ],
      },
    },
    stats: {
      enabled: { type: Boolean, default: true },
    },
    categories: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "Curated Learning Tracks" },
      title: { type: String, default: "Explore Programs by Discipline" },
      description: {
        type: String,
        default:
          "Structured curricula designed by domain leaders to accelerate your professional journey from fundamentals to mastery.",
      },
    },
    trendingWorkshops: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "Featured Learning Programs" },
      title: { type: String, default: "Trending & Popular Courses" },
      description: {
        type: String,
        default:
          "Explore top-rated programs chosen by ambitious learners to master high-demand skills.",
      },
    },
    graduates: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "Career Achievements" },
      title: { type: String, default: "Our Graduates Excel at Global Leaders" },
    },
    testimonialsSection: {
      enabled: { type: Boolean, default: true },
      subtitle: { type: String, default: "Learner Success Stories" },
      title: { type: String, default: "What Our Students Say" },
      items: {
        type: [testimonialSchema],
        default: [
          {
            id: "t-1",
            quote:
              "ASH Academy completely transformed my career trajectory. The practical project-based learning and mentor guidance helped me land my dream role as a Full Stack Engineer.",
            authorName: "Rohan Sharma",
            role: "Software Engineer at TechCorp",
            rating: 5,
            isApproved: true,
          },
          {
            id: "t-2",
            quote:
              "The Flutter and Mobile Dev bootcamp was intense yet immensely rewarding. The curriculum is perfectly updated for 2026 industry standards.",
            authorName: "Ananya Patel",
            role: "Mobile Developer",
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
          "ASH Academy is committed to transforming career trajectories through rigorous, mentor-led tech education and industry-aligned certifications.",
      },
      copyrightText: {
        type: String,
        default: "© 2026 Ash Academy LMS. All rights reserved.",
      },
      contactEmail: { type: String, default: "connect@ashcorp.in" },
    },
  },
  { timestamps: true }
);

export const HomepageSettingsModel = model(
  "HomepageSettings",
  homepageSettingsSchema
);

// --- About Page Settings Schema ---
const visionarySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
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
      mainHeadline: { type: String, default: "Architecting the Next Era of Digital Leaders" },
      bodyNarrative: {
        type: String,
        default:
          "Founded on the relentless pursuit of educational excellence, Ash Academy bridges the gap between academic knowledge and real-world technology execution. We empower ambitious learners with hands-on mastery, expert mentorship, and career-defining skills.",
      },
    },
    leadership: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Guiding Visionaries" },
      subtitle: { type: String, default: "Meet the minds shaping our academic and technological standards" },
      items: {
        type: [visionarySchema],
        default: [
          {
            id: "lead-1",
            name: "Dr. Ashik Rahman",
            role: "Founder & Chief Academic Officer",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
          },
          {
            id: "lead-2",
            name: "Prof. Sarah Jenkins",
            role: "Head of Curriculum & AI Research",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
          },
        ],
      },
    },
    impactMetrics: {
      enabled: { type: Boolean, default: true },
    },
    coreValues: {
      enabled: { type: Boolean, default: true },
      title: { type: String, default: "Our Core Principles" },
      subtitle: { type: String, default: "The foundational values that guide our educational approach" },
      items: {
        type: [coreValueSchema],
        default: [
          {
            id: "cv-1",
            title: "Practical Mastery",
            description: "We prioritize project-based, hands-on learning over pure theory.",
          },
          {
            id: "cv-2",
            title: "Industry Alignment",
            description: "Curricula are continuously updated alongside top technology leaders.",
          },
          {
            id: "cv-3",
            title: "Inclusive Empowerment",
            description: "Making high-caliber technical education accessible to dedicated learners.",
          },
        ],
      },
    },
    philosophy: {
      enabled: { type: Boolean, default: true },
      sectionHeading: { type: String, default: "Our Pedagogical Philosophy" },
      philosophyContent: {
        type: String,
        default:
          "We believe education should be immersive, adaptive, and directly applicable. Every lesson is crafted to build real confidence through building real-world projects under the guidance of active industry practitioners.",
      },
      image: {
        type: String,
        default: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
      },
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
      pageTitle: { type: String, default: "Contact Ash Academy | Get in Touch" },
      metaDescription: {
        type: String,
        default: "Get in touch with Ash Academy for admissions, student support, and partnership inquiries.",
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
              "We collect the following types of information when you use ASH Academy LMS:\n- Account Information: Name, email address, password, profile picture\n- Payment Information: Billing address, transaction history (via third-party payment providers)\n- Usage Data: Courses viewed, progress, quiz results, time spent on lessons\n- Device Information: IP address, browser type, device type, operating system\n- Communications: Support requests, feedback, survey responses",
          },
          {
            id: "pol-2",
            sectionNumber: 2,
            title: "How We Use Your Information",
            content:
              "We use your information for the following purposes:\n- To create and manage your account\n- To provide access to purchased courses and track your learning progress\n- To process payments and send purchase confirmations\n- To send important updates, certificates, and customer support responses\n- To improve our platform, courses, and user experience\n- To send marketing communications, where you have opted in (you can unsubscribe anytime)",
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
              "We do not sell your personal information. We may share your data with:\n- Service Providers: Payment processors, hosting providers, and email/communication tools who help us operate the Platform\n- Instructors: Limited data (e.g. name, progress) may be shared with course instructors to support your learning\n- Legal Authorities: Where required by law, regulation, or legal process",
          },
          {
            id: "pol-5",
            sectionNumber: 5,
            title: "Data Retention",
            content:
              "We retain your personal information for as long as your account is active or as needed to provide you with lifetime course access. You may request deletion of your account and associated data at any time, subject to legal or contractual retention requirements.",
          },
          {
            id: "pol-6",
            sectionNumber: 6,
            title: "Data Security",
            content:
              "We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
          },
          {
            id: "pol-7",
            sectionNumber: 7,
            title: "Your Rights",
            content:
              "Depending on your location, you may have the right to:\n- Access the personal data we hold about you\n- Request correction of inaccurate data\n- Request deletion of your data\n- Object to or restrict certain data processing\n- Withdraw consent for marketing communications at any time\n\nTo exercise any of these rights, contact us via our Contact Us page.",
          },
          {
            id: "pol-8",
            sectionNumber: 8,
            title: "Children's Privacy",
            content:
              "ASH Academy LMS is not intended for children under 16. We do not knowingly collect personal information from children under this age without parental consent.",
          },
          {
            id: "pol-9",
            sectionNumber: 9,
            title: "Third-Party Links",
            content:
              "Our Platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties, and we encourage you to review their privacy policies.",
          },
          {
            id: "pol-10",
            sectionNumber: 10,
            title: "International Data Transfers",
            content:
              "Your information may be transferred to and processed in countries other than your own. We take steps to ensure your data is protected in accordance with this Privacy Policy wherever it is processed.",
          },
          {
            id: "pol-11",
            sectionNumber: 11,
            title: "Changes to This Policy",
            content:
              "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised \"Last updated\" date.",
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

// --- Terms & Conditions Page Settings Schema ---
const termsSectionItemSchema = new Schema({
  id: { type: String, required: true },
  sectionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const termsConditionsSettingsSchema = new Schema(
  {
    sectionVisibility: {
      hero: { type: Boolean, default: true },
      termsSections: { type: Boolean, default: true },
    },
    metadata: {
      pageTitle: { type: String, default: "Terms & Conditions | Ash Academy" },
      metaDescription: {
        type: String,
        default:
          "Read the terms and conditions governing the access and use of Ash Academy LMS.",
      },
    },
    hero: {
      enabled: { type: Boolean, default: true },
      badgeText: { type: String, default: "Legal Framework" },
      headline: { type: String, default: "Terms & Conditions" },
      description: {
        type: String,
        default:
          "Welcome to ASH Academy LMS. These Terms & Conditions govern your access to and use of our website, Learning Management System (LMS), and online courses. By creating an account, enrolling in a course, or using our platform, you agree to these Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our services.",
      },
      lastUpdatedDate: { type: String, default: "29 July 2026" },
    },
    termsSections: {
      enabled: { type: Boolean, default: true },
      items: {
        type: [termsSectionItemSchema],
        default: [
          {
            id: "tc-1",
            sectionNumber: 1,
            title: "Acceptance of Terms",
            content:
              "By accessing or using ASH Academy LMS, you agree to comply with these Terms & Conditions, along with our Privacy Policy and any other policies published on our website.",
          },
          {
            id: "tc-2",
            sectionNumber: 2,
            title: "Eligibility",
            content:
              "You must be at least 16 years of age to create an account on ASH Academy LMS.\n- Minimum Age: You must be at least 16 years of age to create an account on ASH Academy LMS.\n- Under 18 Users: If you are under 18, you confirm that you have permission from your parent or legal guardian to use our platform and enrol in our courses.",
          },
          {
            id: "tc-3",
            sectionNumber: 3,
            title: "Account Registration",
            content:
              "To access our courses, you must create an account using accurate and complete information. You are responsible for:\n- Keeping your login credentials secure.\n- Ensuring your account information remains accurate and up to date.\n- All activities carried out through your account.\n- Informing us immediately if you suspect any unauthorised access to your account.\n\nASH Academy LMS reserves the right to suspend or terminate accounts that contain false information or violate these Terms & Conditions.",
          },
          {
            id: "tc-4",
            sectionNumber: 4,
            title: "Course Access & Lifetime Access",
            content:
              "- After successful enrolment and payment, you will receive access to your purchased course through your ASH Academy LMS account.\n- Many of our courses include lifetime access, allowing you to learn at your own pace and revisit your lessons whenever you need.\n- Lifetime access means you can access your purchased course for as long as it remains available on ASH Academy LMS. We may update or improve course content from time to time to ensure it remains relevant and valuable.\n- Course access is provided for your personal learning only and must not be shared, transferred, resold, or used for commercial purposes.",
          },
          {
            id: "tc-5",
            sectionNumber: 5,
            title: "Payments & Pricing",
            content:
              "- Currency: All course fees are listed in Indian Rupees (₹) unless otherwise stated. Full payment must be completed before course access is granted.\n- Pricing Changes: Prices, offers, and discounts may change without prior notice.\n- Secure Payments: Payments are processed securely through trusted third-party payment providers.\n- Data Storage: ASH Academy LMS does not store your debit card, credit card, UPI, or banking details.",
          },
          {
            id: "tc-6",
            sectionNumber: 6,
            title: "Intellectual Property",
            content:
              "All content available on ASH Academy LMS — including videos, course materials, presentations, documents, graphics, logos, assessments, downloadable resources, and website content — is the intellectual property of ASH Academy LMS and is protected by applicable copyright laws.\n\nWithout prior written permission, you may not:\n- Copy or reproduce course content.\n- Record or download course videos.\n- Share your course access or account with others.\n- Upload course content to other websites or social media platforms.\n- Sell, distribute, or use our content for commercial purposes.\n\nUnauthorised use of our content may result in account suspension, termination, and legal action where applicable.",
          },
          {
            id: "tc-7",
            sectionNumber: 7,
            title: "Course Completion Certificates",
            content:
              "- Course Completion Certificates are issued only after you have successfully completed the required lessons and passed the final assessment.\n- Once your completion is verified and approved by our team, your certificate will be issued.\n- Certificates are awarded for learning and professional development purposes only. Completing a course does not guarantee employment, job placement, salary increases, or specific career outcomes.",
          },
          {
            id: "tc-8",
            sectionNumber: 8,
            title: "User Conduct",
            content:
              "By using ASH Academy LMS, you agree to use the platform responsibly. You must not:\n- Share your account or login credentials.\n- Copy, record, or distribute course content without permission.\n- Attempt to gain unauthorised access to the platform or its systems.\n- Upload harmful software or malicious content.\n- Use the platform for illegal, fraudulent, or unethical activities.\n\nFailure to comply with these Terms may result in the suspension or permanent termination of your account.",
          },
          {
            id: "tc-9",
            sectionNumber: 9,
            title: "Platform Availability",
            content:
              "We strive to keep ASH Academy LMS available at all times. However, temporary interruptions may occur due to scheduled maintenance, technical updates, or unforeseen circumstances beyond our control. We appreciate your understanding and will make every effort to restore services as quickly as possible.",
          },
          {
            id: "tc-10",
            sectionNumber: 10,
            title: "Account Suspension & Termination",
            content:
              "ASH Academy LMS reserves the right to suspend or terminate any account that violates these Terms & Conditions or engages in activities that may harm the platform, its users, or its content.\n\nRefund eligibility, if any, will be determined in accordance with our Refund Policy.",
          },
          {
            id: "tc-11",
            sectionNumber: 11,
            title: "Limitation of Liability",
            content:
              "\"ASH Academy LMS provides educational content to support your learning and skill development.\"\n\nWhile we strive to provide accurate, up-to-date, and high-quality content, we do not guarantee:\n- Employment opportunities\n- Job placements\n- Salary increases\n- Business success\n- Specific career outcomes\n\nYour success depends on your dedication, effort, and application of the knowledge and skills gained through our courses.",
          },
          {
            id: "tc-12",
            sectionNumber: 12,
            title: "Changes to These Terms",
            content:
              "We may update these Terms & Conditions from time to time to reflect improvements to our platform, changes in our services, or legal requirements.\n\nAny updates will be published on this page with the revised Last Updated date. Your continued use of ASH Academy LMS after any changes means you accept the updated Terms & Conditions.",
          },
          {
            id: "tc-13",
            sectionNumber: 13,
            title: "Contact Us",
            content:
              "If you have any questions about these Terms & Conditions, we're here to help.",
          },
        ],
      },
    },
  },
  { timestamps: true }
);

export const TermsConditionsSettingsModel = model(
  "TermsConditionsSettings",
  termsConditionsSettingsSchema
);

// --- General Settings Schema ---
const generalSettingsSchema = new Schema(
  {
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const GeneralSettingsModel = model(
  "GeneralSettings",
  generalSettingsSchema
);

// --- Auth Page Settings Schema ---
const authSettingsSchema = new Schema(
  {
    heroImage: { type: String, default: "/globe_hero.png" },
    heading: { type: String, default: "Ascend to your" },
    headingHighlight1: { type: String, default: "Academic" },
    headingHighlight2: { type: String, default: "Zenith." },
    description: {
      type: String,
      default:
        "Join an elite community of scholars and industry leaders. Access world-class courses designed for the visionaries of tomorrow.",
    },
    footerText: {
      type: String,
      default: "© 2026 Ash Academy. All rights reserved.",
    },
  },
  { timestamps: true }
);

export const AuthSettingsModel = model(
  "AuthSettings",
  authSettingsSchema
);

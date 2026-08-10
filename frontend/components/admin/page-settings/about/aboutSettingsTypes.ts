export interface IVisionary {
  id: string;
  name: string;
  role: string;
  image: string; // Base64 or local static URL path
}

export interface ICoreValue {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface IAboutPageSettings {
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
    image: string; // Base64 or local static URL path
  };
  lastUpdated?: string;
}

export const defaultAboutPageSettings: IAboutPageSettings = {
  sectionVisibility: {
    hero: true,
    coreValues: true,
    leadership: true,
    impactMetrics: true,
    philosophy: true,
  },
  hero: {
    enabled: true,
    mainHeadline: "Forging the Future of Technical Excellence",
    bodyNarrative:
      "Founded on the principle that mastery requires both rigorous theory and hands-on application, Ash Academy provides an unparalleled environment for ambitious learners. We bridge the gap between academic potential and industry reality.",
  },
  leadership: {
    enabled: true,
    title: "Meet Our Visionaries",
    subtitle: "Manage the profiles displayed in the leadership grid.",
    items: [
      {
        id: "vis-1",
        name: "Sufail P",
        role: "Founder & CEO",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "vis-2",
        name: "Shibili Rahi...",
        role: "Head of Product",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "vis-3",
        name: "Gopika",
        role: "Director of Ops",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "vis-4",
        name: "Mohammed...",
        role: "Lead Instructor",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      },
    ],
  },
  impactMetrics: {
    enabled: true,
  },
  coreValues: {
    enabled: true,
    title: "Core Values",
    subtitle: "The foundational principles guiding everything we build.",
    items: [
      {
        id: "cv-1",
        title: "Innovation",
        description: "We constantly push the boundaries of what's possible in modern tech education.",
      },
      {
        id: "cv-2",
        title: "Integrity",
        description: "Transparency and honesty guide our curriculum, assessments, and student relationships.",
      },
      {
        id: "cv-3",
        title: "Community",
        description: "Learning is best experienced together through peer mentorship and collaborative projects.",
      },
    ],
  },
  philosophy: {
    enabled: true,
    sectionHeading: "Built for Lifelong Learners",
    philosophyContent:
      "We believe that education should be adaptive, engaging, and directly applicable. Our curriculum design principles ensure that every module serves a clear purpose, eliminating busywork and focusing on practical skills that empower learners to excel.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  },
  lastUpdated: new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " • 14:32 PST",
};

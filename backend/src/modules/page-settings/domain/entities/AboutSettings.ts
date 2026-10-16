export interface IVisionaryEntity {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface ICoreValueEntity {
  id: string;
  title: string;
  description: string;
}

export interface IAboutSettingsEntity {
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
    items: IVisionaryEntity[];
  };
  impactMetrics: {
    enabled: boolean;
    source?: "db" | "frontend" | "manual";
    title?: string;
    subtitle?: string;
    studentsCount?: number;
    studentsLabel?: string;
    coursesCount?: number;
    coursesLabel?: string;
    rating?: number;
    ratingLabel?: string;
  };
  coreValues: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: ICoreValueEntity[];
  };
  philosophy: {
    enabled: boolean;
    sectionHeading: string;
    philosophyContent: string;
    image: string;
  };
  updatedAt?: Date;
}

export interface IPolicySectionItemEntity {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
}

export interface IPrivacyPolicySettingsEntity {
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
    items: IPolicySectionItemEntity[];
  };
  supportCta: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
  };
  updatedAt?: Date;
}

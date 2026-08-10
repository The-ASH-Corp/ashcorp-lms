export interface ITermsSectionItemEntity {
  id: string;
  sectionNumber: number;
  title: string;
  content: string;
}

export interface ITermsConditionsSettingsEntity {
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
    items: ITermsSectionItemEntity[];
  };
  updatedAt?: Date;
}

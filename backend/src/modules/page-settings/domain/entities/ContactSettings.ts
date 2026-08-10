export interface IFaqItemEntity {
  id: string;
  question: string;
  answer: string;
}

export interface IContactSettingsEntity {
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
    items: IFaqItemEntity[];
  };
  updatedAt?: Date;
}

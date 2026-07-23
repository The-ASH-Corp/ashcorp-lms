export interface CreateGraduateRequestDTO {
  name: string;
  image: string;
  positionName: string;
  companyLogo: string;
  featureOnLandingPage?: boolean;
}

export interface GraduateResponseDTO {
  id: string;
  name: string;
  image: string;
  positionName: string;
  companyLogo: string;
  featureOnLandingPage: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

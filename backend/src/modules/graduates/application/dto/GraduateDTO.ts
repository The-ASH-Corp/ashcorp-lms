export interface CreateGraduateRequestDTO {
  image: string;
  featureOnLandingPage?: boolean;
}

export interface GraduateResponseDTO {
  id: string;
  image: string;
  featureOnLandingPage: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

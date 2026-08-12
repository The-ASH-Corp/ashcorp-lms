export interface GraduateResponseDTO {
  id: string;
  image: string;
  featureOnLandingPage: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Graduate {
  constructor(
    public image: string,
    public featureOnLandingPage: boolean = false,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

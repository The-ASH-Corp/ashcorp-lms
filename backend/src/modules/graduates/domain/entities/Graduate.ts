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

export class Graduate {
  constructor(
    public name: string,
    public image: string,
    public positionName: string,
    public companyLogo: string,
    public featureOnLandingPage: boolean = false,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

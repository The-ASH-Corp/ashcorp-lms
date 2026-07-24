export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  details: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  isPublished: boolean;
  status: string;
}

export class Category {
  constructor(
    public categoryName: string,
    public details: string,
    public color: string,
    public iconUrl: string,
    public isFeatured: boolean,
    public isPublished: boolean,
    public status: string,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
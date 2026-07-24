export interface CategoryRequestDTO {
  categoryName: string;
  description: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  status: string;
}

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
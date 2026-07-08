export interface CategoryRequestDTO {
  categoryName: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  status: string;
}

export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  isPublished: boolean;
  status: string;
}
export interface CategoryRequestDTO {
  categoryName: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
}

export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}
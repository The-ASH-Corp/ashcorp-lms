export interface CategoryRequestDTO {
  categoryName: string;
  color: string;
  iconUrl: string;
  isFeatured: boolean;
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
  status: string;
}
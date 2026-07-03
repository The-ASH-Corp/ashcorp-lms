export interface CategoryRequestDTO {
  categoryName: string;
  color: string;
  iconUrl: string;
}

export interface CategoryResponseDTO {
  id: string;
  categoryName: string;
  color: string;
  iconUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
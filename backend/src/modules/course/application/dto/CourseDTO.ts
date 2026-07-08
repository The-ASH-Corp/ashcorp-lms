export interface CourseRequestDTO {
  title: string;
  description: string;
  price: number;
  offerPrice: number;
  instructor: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters?: string[];
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  offerPrice: number;
  instructor: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters: string[];
  isPublished: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

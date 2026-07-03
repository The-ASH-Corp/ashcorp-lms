export interface CourseRequestDTO {
  title: string;
  description: string;
  price: number;
  instructor: string;
  category: string;
  level: string;
  rating: number;
  duration: string;
  language: string;
  imageUrl: string;
  videoUrl: string;
  tags: string[];
  chapters: string[];
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  category: string;
  level: string;
  rating: number;
  duration: string;
  language: string;
  imageUrl: string;
  videoUrl: string;
  tags: string[];
  chapters: string[];
  createdAt: Date;
  updatedAt: Date;
}

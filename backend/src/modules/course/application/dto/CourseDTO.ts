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

interface CourseRatingDTO {
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: Date;
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  offerPrice: number;
  instructor: string;
  instructorTitle: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters: string[];
  enrolledStudents?: string[];
  isPublished: boolean;
  status: string;
  rating: CourseRatingDTO[];
  createdAt: Date;
  updatedAt: Date;
}

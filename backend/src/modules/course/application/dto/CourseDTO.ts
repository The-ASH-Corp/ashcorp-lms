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
  ratingSource?: "db" | "admin";
  staticRating?: number;
  staticRatingCount?: number;
  staticEnrolledCount?: number;
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
  instructorProfileImage: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  chapters: string[];
  enrolledStudents?: string[];
  isPublished: boolean;
  status: string;
  rating: CourseRatingDTO[];
  ratingSource?: "db" | "admin";
  staticRating?: number;
  staticRatingCount?: number;
  staticEnrolledCount?: number;
  effectiveRating?: number;
  totalReviews?: number;
  effectiveEnrolledCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

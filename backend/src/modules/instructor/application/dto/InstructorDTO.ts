export interface InstructorRequestDTO {
  name: string;
  email: string;
  phone: string;
  instructorTitle: string;
  about: string;
  password: string;
  isFeatured: boolean;
  verifyByDefault: boolean;
  confirmPassword?: string;
  profileImage?: string;
}

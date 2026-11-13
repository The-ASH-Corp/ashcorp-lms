export class Course {
  constructor(
    public title: string,
    public description: string,
    public price: number,
    public offerPrice: number,
    public instructor: string,
    public category: string,
    public imageUrl: string,
    public videoUrl: string,
    public createdAt: Date,
    public updatedAt: Date,
    public id?: string,
    public chapters?:{
       courseId?: string;
        title?: string;
        description?: string;
        videoUrl?: string;
        serialNumber?: number;
        contents?: string[];
    }[],
    public enrolledStudents?: string[],
    public isPublished?: boolean,
    public status?: string,
    public rating?:{
        userId: string;
        rating: number;
        review: string;
        createdAt: Date;
      }[],
    public ratingSource?: "db" | "admin",
    public staticRating?: number,
    public staticRatingCount?: number,
    public staticEnrolledCount?: number,
  ) {}
}

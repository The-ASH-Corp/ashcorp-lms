export class Instructor{
    constructor(
        public name: string,
        public email: string,
        public phone: string,
        public instructorTitle: string,
        public about: string,
        public password: string,
        public isFeatured: boolean,
        public verifyByDefault: boolean,
        public profileImage?: string,
        public role: string = "Instructor",
        public status: string = "Active",
        public rating?: Array<{
          userId?: string | null;
          rating?: number | null;
          review?: string | null;
          createdAt?: Date;
        }>,
        public _id?: string,
        
    ) {}
}

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
        public profileImage?: string
    ) {}
}
import { Contents } from "../../application/dto/ChapterDTO";

export class Chapter{
    constructor(
        public _id:string,
        public courseId:string,
        public title:string,
        public description:string,
        public videoUrl:string,
        public serialNumber:number,
        public contents:Contents[]
    ){}
}
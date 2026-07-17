import mongoose from "mongoose";

export class User{
    constructor(
        public name:string,
        public phone:number,
        public email:string,
        public password:string,
        public role:string,
        public status:string = "Active",
        public wishlist:string[] = [],
        public purchasedCourses:string[] = [],
        public courseProgress: Record<string, number> | Map<string, number> = {},
        public certificates:string[] = [],
        public _id?: mongoose.Types.ObjectId |string,
    ){}
}

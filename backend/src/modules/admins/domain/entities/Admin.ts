import mongoose from "mongoose";

export class Admin {
    constructor(
        public name: string,
        public phone: number,
        public email: string,
        public password: string,
        public role: string,
        public profileImage?: string,
        public _id?: mongoose.Types.ObjectId | string,
    ) {}
}
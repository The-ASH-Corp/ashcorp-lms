import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    courseId:{
        type:String,
        required:true,
        trim:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    serialNumber:{
        type:Number,
        required:true,
        trim:true,
    },
    contents:{
        type:[
            {
                contentTitle:{
                    type:String,
                    required:true,
                    trim:true,
                },
                sequance:{
                    type:Number,
                    required:true,
                    trim:true,
                },
                contentUrl:{
                    type:String,
                    required:true,
                    trim:true,
                },
                isFree:{
                    type:Boolean,
                    default:false,
                },
                duration:{
                    type:Number,
                    trim:true,
                }
            }
        ],
        required:true,
        default:[]
    }
},{timestamps:true})

export const ChapterModel = mongoose.model("Chapter", chapterSchema)

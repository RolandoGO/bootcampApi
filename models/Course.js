const mongoose = require("mongoose")


const CourseSchema = new mongoose.Schema({

    title:{
        type: String,
        required: [true, "add a name for the course"],
        
        trim:true,
        
    },

    

    description:{
        type:String,
        required: [true, "please add a description"]
        
    },
    weeks:{
        type:String,
        required: [true, "please add number of weeks"]

    },
    tuition:{
        type:Number,
        required: [true, "please add a tuition cost"]

    },
    minimumSkill:{
        type:String,
        required: [true, "please add a minimun Skill"],
        enum:["beginner", "intermediate", "advance"]

    },

    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:"Bootcamp",
        requier:true,

    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"Users",
        requier:true,

    }


})


module.exports = mongoose.model("Course", CourseSchema)
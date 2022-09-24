const mongoose = require("mongoose")


const BootcampSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
        unique:true,
        trim:true,
        maxlength: [50, "no more than 50 characters long"]
    },

    slug: String,

    description:{
        type:String,
        required: [true, "please add a description of the bootcamp"],
        maxlength: [500, "no more than 500 characters long"]
    },

    website:{
        type: String,
        required:[true, "please add a URL"],
        match: [/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, "use a valid url"]
    },

    phone:{
        type: String,
        required:[true, "please add a phone number"],
        maxlength:50
        
    },

    email:{
        type: String,
        unique:true,
        required:[true, "please add a email address"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "put a valid email"]
    },

    address:{
        type:String,
        required:[true,"add the address"]
    },
    careers:{
        type: [String],
        required:true,
        enum:[
            "Web Development", "UI/UX", "Business",
            "Mobile Development",
            
            "Data Science",
            "Others"
        ]
        
    },

    avarageRating:{
        type: Number,
    min: [1, "minimun of one number"],
        max: [10, "max of 10 numbers"]
    },

    avarageCost: Number,

    photo:{
        type:String,
        default: "no-photo.jpg"
    }
    ,

    housing:{
        type:Boolean,
        default:false
    },

    jobAssistance:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        requier:true,

    }



})

BootcampSchema.pre("remove", async function (next){

    await this.model("Course").deleteMany({bootcamp:this._id})
    next()

})
module.exports = mongoose.model("Bootcamp", BootcampSchema)
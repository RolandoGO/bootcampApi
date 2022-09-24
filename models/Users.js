const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        required:[true, "please add a name"],
        
        trim:true,
        maxlength: [20, "no more than 20 characters long"]
    },
    
    email:{
        type: String,
        unique:[true, "email already exist"],
        trim:true,
        required:[true, "please add a email address"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "put a valid email"]
    },

    password:{
        type: String,
        required: [true, "please add a password"],
        
        trim:true,
        minlength: [6, "the password has to be more than 6 characters"]
      
    },

    role:{
        type:String,
        enum:["publisher", "user"],
        default: "user"
    },

    resetPasswordToken:{
        type:String,
        default:""
    },
    resetPasswordExpire:{
        type:String,
        default:""
    },

    createdAt:{
        type:Date,
        default:Date.now()
    }
})

//validation for email unique propertie

UserSchema.path('email').validate(async(email)=>{
    const emailcount = await mongoose.models.User.countDocuments({email})
    return !emailcount
}, 'Email already exits')

//hash password before save in it

UserSchema.pre("save", async function(next){

    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
})
    

//check if the password form the body match the one in the db
UserSchema.methods.passwordCheck = async function(password){

    password = password.toString()

    
    return await bcryptjs.compare( password, this.password)
 
     
 }

//creatin the token to identify the user
UserSchema.methods.tokenGenerator = function(){

    const token = jwt.sign({id:this._id}, process.env.TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRE})
    return token
}


module.exports = mongoose.model("User", UserSchema)
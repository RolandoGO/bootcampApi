const User = require("../models/Users")
const ErrorResponse = require("../utils/errorResponse")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmailFunc")
const sendToken = require("../utils/sendToken")
const hasPassword = require("../utils/encryptPassword")
const hashPassword = require("../utils/encryptPassword")


//@desc  register user
//@auth  public
//@url   POST /api/v1/register

exports.register = async (req,res,next)=>{

    const {email,name,password,role} = req.body
    
 
    try{
        const user = await User.create({

            name,
            password,
            email,
            role
        })
        
        sendToken(user,res,201)
    }
    catch(err){next(err)}

}

//@desc  login user
//@auth  public
//@url   POST /api/v1/login

exports.login = async (req,res,next)=>{

    const {email,password} = req.body
 
    //checking if password and email exist in the req.body 

    if(!password){
        next(new ErrorResponse("add the password", 400))
        return
    }
    if(!email){
        next(new ErrorResponse("add the email", 400))
        return
    }
    else{
        //checking if the user email exist
       const user = await User.findOne({email})

       if(!user){
        next(new ErrorResponse("invalid credentials", 400))
        return

       }
        //comparing passwords

       const passwordCheck = await user.passwordCheck(password)

       if(!passwordCheck){
        next(new ErrorResponse("invalid password", 400))
        return
       }
       
       sendToken(user,res,200)

    }
}




//@desc  register user
//@auth  public
//@url   POST /api/v1/passwordreset

exports.sendResetPasswordToken = async (req,res,next)=>{

    try{
        const {email}=req.body

        const userEmail = await User.findOne({email})

        if(!userEmail){
            return next(new ErrorResponse("email not found in the database", 400))
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        const tokenExpire = Date.now() + 10 * 60 * 1000

        await User.findOneAndUpdate({email},{ resetPasswordToken:hashResetToken , resetPasswordExpire:tokenExpire})

        const createResetURL = `${req.protocol}://${req.get("host")}/api/v1/passwordreset/${resetToken}`
        const message = `You are recibin this email to restore your password, make a PUT request to this URL ${createResetURL}`

        const options = {
            email,
            message
        }
        
       const sendingEmial =  sendEmail(options)
       
       
        if(!sendingEmial){
            //if there is an error in the email sending, reset the value of the resetPassword and resetPassworExpire to undefine

            await User.findOneAndUpdate({email},{ resetPasswordToken:null, 
            resetPasswordExpire:null})

            next(new ErrorResponse("cant send email", 500))
            return
        }

        res.status(200).json({success:true})
    
  

    }

    catch(err){
        next(err)
    }

}



//@desc  register user
//@auth  public
//@url   PUT /api/v1/passwordreset/:resetToken

exports.resetPassword = async (req,res,next)=>{


    const password = await hashPassword(req.body.password.toString())

    if(!password){
        return next( new ErrorResponse("add the password", 400))
    }

    const resetToken = req.params.resetToken
    const hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    try{
        const user = await User.findOne({resetPasswordToken:hashResetToken})

        

        if(user.resetPasswordExpire > Date.now()===false){
            next(new ErrorResponse("token expire", 400))
            return
        }

        await User.findByIdAndUpdate(user.id, {password, resetPasswordToken:null, 
            resetPasswordExpire:null} )

        res.json({success:true, data: updateUser})

        
    }

    catch(err){
        next(new ErrorResponse("invalid token", 400))

    }
}
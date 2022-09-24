const User = require("../models/Users")
const ErrorResponse = require("../utils/errorResponse")
const bcryptjs = require("bcryptjs")
const hasPassword = require("../utils/encryptPassword")





//@desc  current user data
//@auth  private
//@url   GET /api/v1/user

exports.user = async (req,res,next)=>{
 
    try{
        const user = await User.findById(req.user.id)

        if(!user){
            next(new ErrorResponse("no user found", 401))
            return
        }
        const {name, email,role, id} = user

        //taking the password out of the data to send
        const userData = {
            name,
            email,
            role, 
            id
        }

        
        res.json({success:true, data:userData})
       
    }
    catch(err){next(err)}

}



//@desc  update user details (name, email)
//@auth  private
//@url   PUT /api/v1/user/userdetailsupdate

exports.updateUserDetails = async (req,res,next)=>{

    const {email,name} = req.body

    if(!email && !name){
        next(new ErrorResponse("cant be an empty field", 400))
        return 
    }
   
 
    try{
       const update = await User.findByIdAndUpdate(req.user.id , {email, name} )

       if(!update){
        next(new ErrorResponse("cant update user details", 500))
        return
       }
       
       res.json({success:true})
        
       
    }
    catch(err){next(err)}

}


//@desc  update user details (password)
//@auth  private
//@url   PUT /api/v1/user/userpasswordupdate

exports.updateUserPassword = async (req,res,next)=>{

    const {new_password, old_password} = req.body

    if(!new_password || !old_password){

        next(new ErrorResponse("fill both fileds", 400))
        return

    }
    

    try{
        const user = await User.findOne({email:req.user.email})

        if(!user){
            next(new ErrorResponse("invalid credentials", 400))
            return
           }

        const passwordCheck = await user.passwordCheck(old_password)

       if(!passwordCheck){
        next(new ErrorResponse("invalid password", 400))
        return
       }

       const hashNewPassword = await hasPassword(new_password)

        const update = await User.findByIdAndUpdate(req.user.id , {password: hashNewPassword} )

       if(!update){
        next( new ErrorResponse("cant update user password", 500))
        return
       }
       
       res.json({success:true})
        
       
    }
    catch(err){next(err)}

}

    
       
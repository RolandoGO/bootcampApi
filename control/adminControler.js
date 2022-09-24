const User = require("../models/Users")
const ErrorResponse = require("../utils/errorResponse")






//@desc  get all the users
//@auth  private
//@url   GET /api/v1/admin/users

exports.getAllUsers = async (req,res,next)=>{
 
    try{
        const users = await User.find()

        if(!users){
            next(new ErrorResponse("no users not found", 401))
            return
        }
      

    
        
        res.json({success:true, data:users})
       
    }
    catch(err){next(err)}

}


//CRUD OF USERS WHIT ADMIN CREDENTIALS


//@desc  get a single user
//@auth  private
//@url   GET /api/v1/admin/user/:id

exports.getUser = async (req,res,next)=>{

    const userId = req.params.id
 
    try{
        const user = await User.findById(userId)

        if(!user){
            next(new ErrorResponse("no user found", 404))
            return
        }
      

    
        
        res.json({success:true, data:user})
       
    }
    catch(err){next(err)}

}


//@desc  update user role
//@auth  private
//@url   PUT /api/v1/admin/user/:id

exports.updateUserRole = async (req,res,next)=>{

    const userId = req.params.id
    const newRole = req.body.role.toLowerCase().split(" ")[0]

    if(!newRole.match(/^(admin|user|publisher)$/)){
        next(new ErrorResponse("role not allow", 400))
        return
    }
 
    try{
        const user = await User.findByIdAndUpdate(userId, {role:newRole})

        if(!user){
            next(new ErrorResponse("no user found", 404))
            return
        }
      

    
        
        res.json({success:true})
       
    }
    catch(err){next(err)}

}


//@desc  delete user 
//@auth  private
//@url   DELETE /api/v1/admin/user/:id

exports.deleteUser = async (req,res,next)=>{

    const userId = req.params.id


    try{
        await User.findByIdAndDelete(userId)

        res.json({success:true})
        
       
    }
    catch(err){next(err)}

}

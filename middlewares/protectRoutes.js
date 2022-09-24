const ErrorResponse = require("../utils/errorResponse")
const jwt = require("jsonwebtoken")
const User = require("../models/Users")
require("dotenv").config()


//token protected routes

async function tokenProtectedRoutes (req,res,next){

    const authorizationHeaders = req.headers.authorization
    if(!authorizationHeaders){
        next(new ErrorResponse("auth header not found", 400))
        return
    }

    if(!authorizationHeaders.startsWith("Bearer")){
        next(new ErrorResponse("invalid credentials", 401))
        return
    }

    const token = authorizationHeaders.split(" ")[1]

    try{
        const jwtVerify = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findById(jwtVerify.id)
        if(!user){
            next(new ErrorResponse("user not found", 500))
            return
        } 

        req.user = user

        next()


    }
    catch{
        next(new ErrorResponse("invalid TOKEN", 401))
    }
}


//role protected routes

function roleProtectedRoute(...role){
    
    return function (req,res,next){

        if(!role.includes(req.user.role)){
            next(new ErrorResponse(`user whit role ${req.user.role} not authorize for this route`))
            return
        }
        next()

    }
    
       
}
module.exports = {tokenProtectedRoutes, roleProtectedRoute}
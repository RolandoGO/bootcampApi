const ErrorResponse = require("../utils/errorResponse")


function errorHandler(err, req,res,next){

    let error = {...err}

    console.log(err)
   //errors in the url ID
    if(err.name === "CastError"){
        
        error = new ErrorResponse("invalid id", 400)
    }

    //Error for Nothing found in the database

    if(err.name === "Error"){
        
        error = new ErrorResponse(err.message, err.statusCode)
    }


    // //Mongoose duplicate error
    
    if(err.name === "MongoServerError" && err.code === 11000){

        error  = new ErrorResponse(err.message, 400)
        
    }

    // //Mongoose validation error

    if(err.name=== "ValidationError"){
        const message = Object.values(err.errors).map(value=> value.message)
        
        error  = new ErrorResponse(message, 400)
    }
    

    res.status(error.statusCode || 500).json({message:error.message || "server error"}) 
    
}

module.exports = errorHandler
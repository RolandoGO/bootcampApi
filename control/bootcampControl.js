const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
require("dotenv").config()

//method for creating a bootcamp
exports.createBootcamp = async (req,res,next)=>{

    const user = req.user

    
   try{

    const bootcamp = await Bootcamp.findOne({user:user.id})

    //if user is not admin, cant create more than one bootcamp
   
    if(bootcamp && user.role !== "admin"){
        next(new ErrorResponse("user doesnt have the permision to create an other bootcamp", 403))
        return 
    }

     //append user id to req.body
    req.body.user = user.id
    await Bootcamp.create(req.body)
    res.status(201).json({message:"bootcamp created"})

   }

   catch(err){ next(err)}
    
}


//method for getting all the  bootcamps
exports.getBootcamps = async (req,res,next)=>{

    let query;

    let reqQuery ={...req.query}
//takin select off the query object
    const removeFields = ["select"]
    removeFields.forEach(field=> delete reqQuery[field])
//fixing up the query object adding the correct syntaxis for the operators (gt,gte,lt, etc..)
    let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`)

    query =  Bootcamp.find(JSON.parse(queryStr))

    if(req.query.select){
        const fields = req.query.select.split(",").join(" ")
        query = query.select(fields)
    }

    try{

        const bootcamps = await query

        if(bootcamps){

            
            res.status(200).json({message:`this are all the bootcamps`, bootcampCount:bootcamps.length, data:bootcamps})

        }
        else {
            res.status(204).json({message:`no bootcamps found`, bootcampCount:bootcamps.length, data:bootcamps})
        }


    }

    catch(err){next(err)}
    
}


//method for getting a bootcamp

exports.getBootcamp = async (req,res,next)=>{




    try{
        const call = await  Bootcamp.findById(req.params.id)

        if(call) res.status(200).json({message:"this is the bootcamp "+ req.params.id, data:call})

        else {
            return next(new ErrorResponse("no bootcamp found whit that id", 204))
        }


    }

    catch(err){
        next(err)
    }

}

//method for updating a  bootcamp

exports.updateBootcamps = async (req,res,next)=>{

    try{

        //Checking if the current user is the owner of the bootcamp

        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            next(new ErrorResponse("no bootcamp found, error in the id", 400))
            return
        }

        if(bootcamp.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            next(new ErrorResponse("unauthorize to update this bootcamp", 403))
            return
        }
        
        //updating bootcamp whit req.body info
        const call = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{ new:true, runValidators:true} )

        if(call) res.status(200).json({message:"update the bootcamp " + req.params.id, data:call})
        else next(new ErrorResponse("cant update", 500))
    }

    catch(err){
        next(err)
    }

}

//method for deleting a  bootcamp

exports.deleteBootcamp = async (req,res,next)=>{

    try{
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            next(new ErrorResponse("no bootcamp found, error in the id", 400))
            return
        }

        if(bootcamp.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            next(new ErrorResponse("unauthorize to delete this bootcamp", 403))
            return
        }

        
        await bootcamp.remove()
        res.status(200).json({message:"delete the bootcamp "+ req.params.id})

        
        

    }
    catch(err){
        next(err)
    }

}


//@desc method for uploading a bootcamp photo
//@access private
//@route  PUT /api/v1/bootcamps/photo/:id




exports.fileUpload = async (req,res,next)=>{


    try{

        const bootcamp = await Bootcamp.findById(req.params.id)

        if(bootcamp){
            if(req.files){

                const file = req.files.file

                if(file.size > process.env.FILE_UPLOAD_SIZE) next(new ErrorResponse("THE SIZE IS TO BIG (HAS TO BE LESS THAN 1000000)", 400))
                if(!file.mimetype.startsWith("image/")) next(new ErrorResponse("IS NOT AN IMAGE", 400))
                else {

                    const fileName = `${req.params.id}${file.name}`

                    file.mv("./uploadsFiles/"+fileName, async (err)=>{
        
                        if(err)next(new ErrorResponse("cant upload photo", 500))

                        else {

                            try{
                                const addPhotoToBootcamp = await  Bootcamp.findByIdAndUpdate(req.params.id, {photo: fileName})
                                res.json({message:"photo update successfully", photo:addPhotoToBootcamp})
                            }
                            catch(err){next(new ErrorResponse("cant add photo to bootcamp data", 500))}

                            
                            
                        }
                    })
                }
                    
                
            }
            else{
                next(new ErrorResponse("no file uploaded", 400))
            }
        }
        else{
            next(new ErrorResponse("no bootcamp found with that id"))
        }

    }

    catch(error){next(error)}
}

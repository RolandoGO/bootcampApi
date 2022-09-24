const Course = require("../models/Course")
const Bootcamp = require("../models/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")


//@desc  fetching all courses or all the courses bind to one bootcamp.
//@auth  public
//@url   GET /api/v1/courses or /api/v1/courses/bootcamp/:bootcampId

exports.getCourses = async (req,res,next)=>{

    

    try{
        if(req.params.bootcampId){

            
            const data = await Course.find({bootcamp: req.params.bootcampId}).populate({path:"bootcamp", select:"name description"})
    
            if(data) res.status(200).json({message:"courses for the bootcamp: "+req.params.bootcampId, count:data.length, data})

            else next(new ErrorResponse("no courses found", 204))
        }
        else{
            const data = await Course.find().populate({path:"bootcamp", select:"name description"})
    
            if(data) res.status(200).json({message:"this are all the courses", count:data.length, data})
            else next(new ErrorResponse("no courses found", 204))
        }
        
    }
    catch(error){ next(error) }

}

//@desc  fetching one course.
//@auth  public.
//@url   GET /api/v1/courses/:id

exports.getCourse = async (req,res,next)=>{

    

    try{

        const course = await Course.findById(req.params.id).populate({path:"bootcamp", select:"name description"})

       
        if(course)res.status(200).json({message:`this is the course ${req.params.id}`, data:course})

        else next(new ErrorResponse("no course found for that id",404))
            

    }
    
    catch(error){ next(error) }

}


//@desc  create one course.
//@auth  private.
//@url   POST /api/v1/courses/:bootcampId


exports.createCourse = async (req,res,next)=>{

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
   

    try{

        const bootcamp = await Bootcamp.findById(req.params.bootcampId)

        if(!bootcamp){
            next(new ErrorResponse("no bootcamp found, error in the id", 400))
            return
        }

        if(bootcamp.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            next(new ErrorResponse("unauthorize to create this course", 403))
            return
        }
        
        const course = await Course.create(req.body)

        res.status(201).json({message:"course created", data:course})
    
    }
    
    catch(error){ next(error) }

}

//@desc  updating one course.
//@auth  private
//@url   PUT /api/v1/courses/:id/

exports.updateCourse = async (req,res,next)=>{

    try{
        const course = await Course.findById(req.params.id)


        if(!course){
            next(new ErrorResponse("no course found, error in the id", 400))
            return
        }

        if(course.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            next(new ErrorResponse("unauthorize to update this course", 403))
            return
        }


   
        await Course.findByIdAndUpdate(req.params.id, req.body,{ new:true, runValidators:true} )

        res.status(200).json({message:"update the course " + req.params.id, data:course})
        
    }

    catch(err){
        next(err)
    }


}

//@desc  delete one course.
//@auth  private
//@url   DELETE /api/v1/courses/:id/

exports.deleteCourse = async (req,res,next)=>{


    try{
        const course = await Course.findById(req.params.id)


        if(!course){
            next(new ErrorResponse("no course found, error in the id", 400))
            return
        }

        if(course.user.toString() !== req.user._id.toString() && req.user.role !== "admin"){
            next(new ErrorResponse("unauthorize to delete this course", 403))
            return
        }

        await Course.findByIdAndRemove(req.params.id)

        res.status(200).json({message:"delete the course " + req.params.id, data:course})
        
    }

    catch(err){
        next(err)
    }


}
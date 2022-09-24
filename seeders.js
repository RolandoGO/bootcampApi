//import dependencies
const fs = require("fs")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

//initialization of .env variables in the file
dotenv.config()

//import model
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")
const User = require("./models/Users")




    

//parsing the data from the _data folder 
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`))

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`))

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`))


//import data into db

const importData = async ()=>{

    
    try{
        
        mongoose.connect(process.env.MONGO_URI)
        .then(async ()=>{
            await Bootcamp.create(bootcamps)
            await Course.create(courses)
            // await User.create(users)


            console.log("DATA IMPORTE TO THE DATABASE")
            process.exit()
        })
        .catch(error=>console.log("error importing the data to the database: "+error))
    
    }

    catch(error){

        console.log("error connecting to the database: "+error)

    }
}

//delete data from db

const deleteData = async ()=>{
    try{
        mongoose.connect(process.env.MONGO_URI)
        .then(async ()=>{

            await Bootcamp.deleteMany()
            await Course.deleteMany()
            await User.deleteMany()


            console.log("DATA DESTROY FROM THE DATABASE")
            process.exit()
                
        })
        
    }
    catch(error){

        console.error(error)

    }
}

//control flow for implementing the import or the deletion of data 
if(process.argv[2] === "-i"){ 
    
    importData()
}
else if (process.argv[2]=== "-d"){

    deleteData()
}
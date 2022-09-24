const mongoose = require("mongoose")
require("dotenv").config()

function configDb(){

    

        mongoose.connect(process.env.MONGO_URI, {})
        .then(result=>{
            console.log("database connected "+ result.connection.host)
        })
        .catch(error=>{
            console.log("Cant connect to the database, error: "+ error)
        })
       

    

    
}

module.exports = configDb
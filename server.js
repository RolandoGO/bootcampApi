const express = require("express")
const db = require("./configDb")
const mongoSanitize = require("express-mongo-sanitize")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const xss = require("xss-clean")

require("dotenv").config()


//files for routes
const bootcampRoutes = require("./routes/bootcampRoutes")
const courseRoutes = require("./routes/courseRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")


//files for middlewares
const errorHandler = require("./middlewares/errorHandler")
const ErrorResponse = require("./utils/errorResponse")
const fileUpload = require("express-fileupload")




//initiaization of express
const app = express()

//port variable
const PORT = process.env.PORT || 5050

//server config
app.use(express.json())
app.use(fileUpload())

//security config (prevent NOsql injection, cross side scripting, cors, rate limits, http params polution)
app.use(mongoSanitize())
app.use(xss())
app.use(cors())
app.use(hpp())
//limit of request

const reqLimit = rateLimit({
    windowMs: 10*60*1000, // 10'
    max:100
})

app.use(reqLimit)



//database initialization
db()


//routes

app.use("/api/v1/bootcamps", bootcampRoutes)
app.use("/api/v1/courses", courseRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/admin", adminRoutes)


//error handler middleware
app.use((req,res,next)=>{

    next(new ErrorResponse("not found", 404))
})

app.use(errorHandler)

app.listen(PORT, ()=>{console.log("listen in port "+ PORT)})
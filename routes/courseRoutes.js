const express = require("express")
const router = express.Router()
const {getCourses, getCourse, createCourse, updateCourse, deleteCourse} = require("../control/courseControler")
const {tokenProtectedRoutes, roleProtectedRoute} = require("../middlewares/protectRoutes")


router.get("/", getCourses )

router.get("/bootcamp/:bootcampId", getCourses)

router.get("/:id", getCourse )

router.post("/:bootcampId",tokenProtectedRoutes, roleProtectedRoute("publisher","admin") , createCourse )

router.put("/:id",tokenProtectedRoutes, roleProtectedRoute("publisher","admin"), updateCourse )

router.delete("/:id",tokenProtectedRoutes, roleProtectedRoute("publisher","admin") , deleteCourse )


module.exports = router
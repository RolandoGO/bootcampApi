const express = require("express")
const router = express.Router()
const {createBootcamp, getBootcamps, getBootcamp, updateBootcamps, deleteBootcamp, fileUpload} = require("../control/bootcampControl")
const {tokenProtectedRoutes, roleProtectedRoute} = require("../middlewares/protectRoutes")


router.put("/photo/:id", tokenProtectedRoutes, roleProtectedRoute("publisher","admin"), fileUpload)

router.get("/", getBootcamps)

router.get("/:id", getBootcamp)

router.post("/", tokenProtectedRoutes, roleProtectedRoute("publisher","admin"), createBootcamp)

router.put("/:id", tokenProtectedRoutes, roleProtectedRoute("publisher","admin"), updateBootcamps)

router.delete("/:id", tokenProtectedRoutes, roleProtectedRoute("publisher","admin"), deleteBootcamp)




module.exports = router
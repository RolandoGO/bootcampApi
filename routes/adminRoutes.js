const express = require("express")
const router = express.Router()
const {getAllUsers, getUser, deleteUser, updateUserRole} = require("../control/adminControler")
const {tokenProtectedRoutes, roleProtectedRoute} = require("../middlewares/protectRoutes")


router.use(tokenProtectedRoutes)
router.use(roleProtectedRoute("admin"))

router.get("/users", getAllUsers )

router.get("/user/:id", getUser )

router.put("/user/:id", updateUserRole)

router.delete("/user/:id", deleteUser)


module.exports = router
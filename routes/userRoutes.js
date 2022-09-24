const express = require("express")
const router = express.Router()
const {updateUserPassword, updateUserDetails, user} = require("../control/userControler")
const {tokenProtectedRoutes, roleProtectedRoute} = require("../middlewares/protectRoutes")


router.use(tokenProtectedRoutes)

router.get("/", user )

router.put("/updateuserpassword", updateUserPassword )
router.put("/updateuserdetails", updateUserDetails )






module.exports = router
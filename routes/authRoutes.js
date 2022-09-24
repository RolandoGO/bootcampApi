const express = require("express")
const router = express.Router()
const {register, login, sendResetPasswordToken, resetPassword} = require("../control/authControler")


router.post("/register", register )

router.post("/login", login)

router.post("/passwordreset", sendResetPasswordToken)

router.put("/passwordreset/:resetToken", resetPassword)



module.exports = router
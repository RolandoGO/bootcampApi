//function for creating token and send in it

function sendTokenInCookie(user, res, status){

    const token = user.tokenGenerator()
    

    res.status(status).json({success:true , token, user})

        
}

module.exports = sendTokenInCookie
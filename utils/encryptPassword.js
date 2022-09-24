
const bcryptjs = require("bcryptjs")


async function hashPassword(password){



    //hashing the password before saving it in the db
    const salt = await bcryptjs.genSalt(10)
    const hash = await bcryptjs.hash(password.toString(), salt)


    return hash

    
}

module.exports = hashPassword
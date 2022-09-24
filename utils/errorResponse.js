//taking the Error class and using it in this ErrorResponse class
class ErrorResponse extends Error {

    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
    
}

module.exports = ErrorResponse
const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText')


function validatePassword(req, res, next) {
    
    const password = req.body.password
    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
    const passwordValue = passwordPattern.test(password)

    if (password.length < 8) {
        const error = appError.create('password is too short' , 500 , httpStatusText.FAIL)
        return next(error)        
    }else if(password.length > 20){
        const error = appError.create('password is too long' , 500 , httpStatusText.FAIL)
        return next(error)
    }
    
    if(passwordValue){
        next();
    }else{
        const error = appError.create('Password must be between 8 and 20 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, *, #, or &).' , 500 , httpStatusText.FAIL)
        return next(error)
    }
}

module.exports = validatePassword;

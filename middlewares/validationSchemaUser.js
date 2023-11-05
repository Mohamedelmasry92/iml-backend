const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchemaUser = () => {

    return [
        body('fName')
            .notEmpty().withMessage("first name is required")
            .isLength({min: 2}).withMessage("first name at least is 2"),
        body('lName')
            .notEmpty().withMessage("last name is required")
            .isLength({min: 2}).withMessage("last name at least is 2"),
        body('email')
            .notEmpty().withMessage("email is required")
            .isLength({min: 2}).withMessage("email at least is 2")
            .isEmail(),
        body('password')
            .notEmpty().withMessage("password is required")
            .isLength({min: 2}).withMessage("password at least is 2"),
        body('phone')
            .notEmpty().withMessage("phone is required")
            .isLength({min: 2}).withMessage("phone at least is 2"),
        body('address')
            .notEmpty().withMessage("address is required")
            .isLength({min: 2}).withMessage("address at least is 2"),
        body('gender')
            .notEmpty().withMessage("gender is required"),
        // body('role')
        //     .notEmpty()
        //     .withMessage("role is required")
        ]

}


module.exports = {
    validationSchemaUser
}
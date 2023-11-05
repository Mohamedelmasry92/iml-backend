const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchemaInstructor = () => {

    return [
        body('fName')
            .notEmpty()
            .withMessage("first name is required")
            .isLength({min: 2}).withMessage("first name at least is 2"),
        body('lName')
            .notEmpty()
            .withMessage("last name is required")
            .isLength({min: 2}).withMessage("last name at least is 2"),
        body('instructorDetails')
            .notEmpty()
            .withMessage("instructor details is required")
            .isLength({min: 2}).withMessage("instructor details at least is 2"),
        ]

}


module.exports = {
    validationSchemaInstructor
}
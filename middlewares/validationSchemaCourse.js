const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchemaCourse = () => {

    return [
        body('instructor')
            .notEmpty()
            .withMessage("instructor is required")
            .isLength({min: 2}).withMessage("instructor at least is 2"),
        body('courseTitle')
            .notEmpty()
            .withMessage("course title is required")
            .isLength({min: 2}).withMessage("course title at least is 2"),
        body('courseDescribtion')
            .notEmpty()
            .withMessage("course Describtion is required")
            .isLength({min: 2}).withMessage("course Describtion at least is 2"),
        body('categoryCourse')
            .notEmpty()
            .withMessage("category course is required")
            .isLength({min: 2}).withMessage("category course at least is 2")
        ]

}


module.exports = {
    validationSchemaCourse
}
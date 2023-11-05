const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchemaCourseTopics = () => {

    return [
        body('categoryName')
            .notEmpty()
            .withMessage("category name is required")
            .isLength({min: 2}).withMessage("category name at least is 2"),
        body('categoryDescribtion')
            .notEmpty()
            .withMessage("category describtion is required")
            .isLength({min: 2}).withMessage("category describtion at least is 2"),
        ]

}


module.exports = {
    validationSchemaCourseTopics
}
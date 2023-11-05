const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchemaArticleTopics = () => {

    return [
        body('topicName')
            .notEmpty()
            .withMessage("topic name is required")
            .isLength({min: 2}).withMessage("topic name at least is 2"),
        body('topicDescribtion')
            .notEmpty()
            .withMessage("topic describtion is required")
            .isLength({min: 2}).withMessage("topic describtion at least is 2"),
        ]

}


module.exports = {
    validationSchemaArticleTopics
}
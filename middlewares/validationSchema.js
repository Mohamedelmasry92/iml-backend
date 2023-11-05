const {body} = require('express-validator')
const {validationResult} = require('express-validator')


const validationSchema = () => {

    return [
        body('author')
            .notEmpty()
            .withMessage("author is required")
            .isLength({min: 2}).withMessage("author at least is 2"),
        body('articleTitle')
            .notEmpty()
            .withMessage("article title is required")
            .isLength({min: 2}).withMessage("article title at least is 2"),
        body('articleDescribtion')
            .notEmpty()
            .withMessage("article Describtion is required")
            .isLength({min: 2}).withMessage("article Describtion at least is 2"),
        body('content')
            .notEmpty()
            .withMessage("content is required")
            .isLength({min: 2}).withMessage("content at least is 2"),
        body('categoryTopic')
            .notEmpty()
            .withMessage("category topic is required")
            .isLength({min: 2}).withMessage("category topic at least is 2"),
        // body('question')
        //     .notEmpty()
        //     .withMessage("question is required")
        //     .isLength({min: 2}).withMessage("question at least is 2"),
        // body('correctAnswer')
        //     .notEmpty()
        //     .withMessage("correct answer is required"),
        // body('answers')
        //     .notEmpty()
        //     .withMessage("answers is required")
        ]

}


module.exports = {
    validationSchema
}
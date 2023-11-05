const {validationResult} = require('express-validator')
const Quiz = require('../models/quizmodel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')


const getAllQuiz = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const quiz = await Quiz.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {quiz}});
    }
)


const getQuizById = asyncWrapper(
async (req , res , next) =>{
            const quiz = await Quiz.findById(req.params.quizId);
            if(!quiz){
                const error = appError.create('Quiz not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {quiz : "quiz not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {quiz}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)


const addQuiz = asyncWrapper(
    async (req , res , next) => {
        const { title, questions } = req.body;
 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }

        try {
            const newQuiz = new Quiz ({
                title,
                questions
           })
        
            await newQuiz.save();    
            res.status(201).json({status : httpStatusText.SUCCESS , data : {quiz: newQuiz}})
        } catch (error) {
            appError.create('Quiz creation failed' , 500 , httpStatusText.FAIL)
        return next(error)
        }        
}
)


const deleteQuiz = asyncWrapper(
    async (req , res ,next) =>{
        
        const quizId = req.params.quizId;
        const validatequiz = await Quiz.findById(quizId)
        
        if(!validatequiz){
            const error = appError.create('quiz not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{
            await Quiz.deleteOne({_id: quizId})
            return res.status(200).json({status : httpStatusText.SUCCESS , data : "Quiz deleted"});

        }
    }
)
 

const updateQuiz =  asyncWrapper( async (req , res , next) =>{
    try {
        const { title, questions } = req.body;
        const quizId = req.params.quizId;
        const validatequiz = await Quiz.findById(quizId)
        if(!validatequiz){
            const error = appError.create('quiz not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{   
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }
                const updatedquiz = await Quiz.updateOne({_id: quizId} , 
                {
                    title,
                    questions,
                })
                return res.status(200).json({status : httpStatusText.SUCCESS , data : {quiz: updatedquiz}})
            }
        }catch(error){
            return next(error)
        }

    }
)

module.exports = {
    getAllQuiz,
    getQuizById,
    addQuiz,
    updateQuiz,
    deleteQuiz
}
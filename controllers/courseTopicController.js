const {validationResult} = require('express-validator')
const CourseTopics = require('../models/courseTopicsModel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const oneDeletePhoto = require('../middlewares/onePhotoToDelete');

const getAllCourseTopics = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const coursetopics = await CourseTopics.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {coursetopics}});
    }
)


const getCourseTopicById = asyncWrapper(
async (req , res , next) =>{
            const courseTopicId = await CourseTopics.findById(req.params.courseTopicId);
            if(!courseTopicId){
                const error = appError.create('course Topic not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {course : "course not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {courseTopicId}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)


const addCourseTopic = asyncWrapper(
    async (req , res , next) => {
        const {categoryImage , categoryName , categoryDescribtion , publishedAt} = req.body
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }

        const newCourseTopic = new CourseTopics ({
                categoryImage : `${req.protocol}://${req.hostname}/uploads/${req.files['categoryImage'][0].filename}`,
                categoryName, 
                categoryDescribtion,
                publishedAt
           })
        
        await newCourseTopic.save();    
        res.status(201).json({status : httpStatusText.SUCCESS , data : {course: newCourseTopic}})
    }
)


const deleteCourseTopic = asyncWrapper(
    async (req , res ,next) =>{
        
        const courseTopicId = req.params.courseTopicId;
        const validatecourseTopic = await CourseTopics.findById(courseTopicId)
        
        if(!validatecourseTopic){
            const error = appError.create('course topic not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{

            const reqDeleted = validatecourseTopic
            const folderPath = 'uploads';
            const photoToDelete = reqDeleted.categoryImage.split('/')[4];    
            
            const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);

            await CourseTopics.deleteOne({_id: courseTopicId})
            return res.status(200).json({status : httpStatusText.SUCCESS , data : {deletionphoto}});

        }
    }
)
 

const updateCourseTopic =  asyncWrapper( async (req , res , next) =>{
    try {
    
        const {categoryImage , categoryName , categoryDescribtion , publishedAt} = req.body

        const courseTopicId = req.params.courseTopicId;
        const validatecourse = await CourseTopics.findById(courseTopicId)
        
        const paramsUpdated = req.body
        // console.log(paramsUpdated)
        if(!validatecourse){
            const error = appError.create('course topic not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{
                
                const reqDeleted = validatecourse
                const folderPath = 'uploads';
                const photoToDelete = reqDeleted.categoryImage.split('/')[4];
                oneDeletePhoto(folderPath, photoToDelete);    

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }                

                const updatedCourse = await CourseTopics.updateOne({_id: courseTopicId} , 
                    {categoryImage : `${req.protocol}://${req.hostname}/uploads/${req.files['categoryImage'][0].filename}`,
                    categoryName, 
                    categoryDescribtion,
                    publishedAt
                })

                // await updatedCourse.save();  

                return res.status(200).json({status : httpStatusText.SUCCESS , data : {course: updatedCourse}})
            }
        }catch(error){
            return next(error)
        }

    }
)

module.exports = {
    getAllCourseTopics,
    getCourseTopicById,
    addCourseTopic,
    deleteCourseTopic,
    updateCourseTopic
}
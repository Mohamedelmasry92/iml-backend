const {validationResult} = require('express-validator')
const Course = require('../models/coursemodel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const deleteVideos = require('../middlewares/photosToDelete');
const oneDeletePhoto = require('../middlewares/onePhotoToDelete');



const getAllCourses = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const courses = await Course.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {courses}});
    }
)


const getCourseById = asyncWrapper(
async (req , res , next) =>{
            const course = await Course.findById(req.params.courseId);
            if(!course){
                const error = appError.create('course not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {course : "course not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {course}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)


const addCourse = asyncWrapper(
    async (req , res , next) => {

        const {instructor , coverImage , courseTitle , courseDescribtion , duration , certificate , students , lectures , assessments , categoryCourse , urlVideos=[] , publishedAt , videoIntro} = req.body        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }
        
        const arr = req.files['urlVideos']
        for (let i = 0; i < arr.length; i++) {
            urlVideos.push(`${req.protocol}://${req.hostname}/uploads/${arr[i].filename}`);
        }
        // console.log(req.files)
        const newCourse = new Course ({
                instructor, 
                coverImage : `${req.protocol}://${req.hostname}/uploads/${req.files['coverImage'][0].filename}`,
                courseTitle, 
                courseDescribtion,  
                categoryCourse, 
                urlVideos,
                duration, 
                certificate,
                students, 
                lectures,
                assessments,
                publishedAt, 
                videoIntro: `${req.protocol}://${req.hostname}/uploads/${req.files['videoIntro'][0].filename}`,
           })
        
        await newCourse.save();    
        res.status(201).json({status : httpStatusText.SUCCESS , data : {course: newCourse}})
    }
)


const deleteCourse = asyncWrapper(
    async (req , res ,next) =>{
        
        const courseId = req.params.courseId;
        const validatecourse = await Course.findById(courseId)
        
        
        if(!validatecourse){
            const error = appError.create('course not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{
            const reqDeleted = validatecourse
            const arrDeleted = validatecourse.urlVideos
            
            await Course.deleteOne({_id: courseId})
            
            const folderPath = 'uploads';
            function videosToDelete() {
                const deleted = [];
                for (let i = 0; i < arrDeleted.length; i++) {
                  const deletedItem = (`${arrDeleted[i]}`).split('/')[4];
                  deleted.push(deletedItem);
                }
                return deleted;
              } 
            const photoToDelete = reqDeleted.coverImage.split('/')[4];    
            const videoToDelete = reqDeleted.videoIntro.split('/')[4];    
            
            const deletionStatus = deleteVideos(folderPath, videosToDelete());
            const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);
            const deletionvideo = oneDeletePhoto(folderPath, videoToDelete);

            return res.status(200).json({status : httpStatusText.SUCCESS , data : {deletionphoto,deletionStatus,deletionvideo}});

        }
    }
)
 

const updateCourse =  asyncWrapper( async (req , res , next) =>{
    try {
    
        const {instructor , coverImage , courseTitle , courseDescribtion , duration , certificate , students , lectures , assessments , categoryCourse , urlVideos=[] , publishedAt , videoIntro} = req.body

        const courseId = req.params.courseId;
        const validatecourse = await Course.findById(courseId)
        
        
        const paramsUpdated = req.body
        // console.log(paramsUpdated)
        if(!validatecourse){
            const error = appError.create('course not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{
            
            const reqDeleted = validatecourse
            const arrDeleted = validatecourse.urlVideos
                const folderPath = 'uploads';
                function videosToDelete() {
                    const deleted = [];
                    for (let i = 0; i < arrDeleted.length; i++) {
                      const deletedItem = (`${arrDeleted[i]}`).split('/')[4];
                      deleted.push(deletedItem);
                    }
                    return deleted;
                  }
                const photoToDelete = reqDeleted.coverImage.split('/')[4];
                const videoToDelete = reqDeleted.videoIntro.split('/')[4];
                oneDeletePhoto(folderPath, photoToDelete);    
                oneDeletePhoto(folderPath, videoToDelete);    
                deleteVideos(folderPath, videosToDelete());

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }
                
                const arrAdded = req.files['urlVideos']
                for (let i = 0; i < arrAdded.length; i++) {
                    urlVideos.push(`${req.protocol}://${req.hostname}/uploads/${arrAdded[i].filename}`);
                }
                

                const updatedCourse = await Course.updateOne({_id: courseId} , 
                    {
                        instructor,  
                        coverImage : `${req.protocol}://${req.hostname}/uploads/${req.files['coverImage'][0].filename}`,
                        courseTitle, 
                        courseDescribtion,  
                        categoryCourse, 
                        urlVideos,
                        duration, 
                        certificate,
                        students, 
                        lectures,
                        assessments,
                        publishedAt, 
                        videoIntro: `${req.protocol}://${req.hostname}/uploads/${req.files['videoIntro'][0].filename}`,
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
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
}
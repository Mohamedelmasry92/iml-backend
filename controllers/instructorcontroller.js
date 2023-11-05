const {validationResult} = require('express-validator')
const Instructor = require('../models/instructormodel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const oneDeletePhoto = require('../middlewares/onePhotoToDelete');

const getAllInstructors = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const instructors = await Instructor.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {instructors}});
    }
)


const getInstructorById = asyncWrapper(
async (req , res , next) =>{
            const instructor = await Instructor.findById(req.params.instructorId);
            if(!instructor){
                const error = appError.create('instructor not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {instructor : "instructor not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {instructor}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)


const addInstructor = asyncWrapper(
    async (req , res , next) => {
        const {fName , avatar , lName , instructorDetails , publishedAt } = req.body
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }

        // const arr2 = req.files['answers']
        // for (let i = 0; i < arr.length; i++) {
        //     answers.push(arr2[i]);
        // }

        const newinstructor = new Instructor ({
                fName, 
                avatar : `${req.protocol}://${req.hostname}/uploads/${req.files['avatar'][0].filename}`,
                lName, 
                instructorDetails,  
                publishedAt,

           })
        
        await newinstructor.save();    
        res.status(201).json({status : httpStatusText.SUCCESS , data : {instructor: newinstructor}})
    }
)


const deleteInstructor = asyncWrapper(
    async (req , res ,next) =>{
        
        const instructorId = req.params.instructorId;
        const validateinstructor = await Instructor.findById(instructorId)
        
        if(!validateinstructor){
            const error = appError.create('instructor not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{
            
            const reqDeleted = validateinstructor
            const folderPath = 'uploads';
            const photoToDelete = reqDeleted.avatar.split('/')[4];    
            
            const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);

            await Instructor.deleteOne({_id: instructorId})
            return res.status(200).json({status : httpStatusText.SUCCESS , data : {deletionphoto }});

        }
    }
)
 

const updateInstructor =  asyncWrapper( async (req , res , next) =>{
    try {
    
        const {fName , avatar , lName , instructorDetails , publishedAt} = req.body

        const instructorId = req.params.instructorId;
        const validateinstructor = await Instructor.findById(instructorId)
        const reqDeleted = validateinstructor
        
        const paramsUpdated = req.body
        // console.log(paramsUpdated)
        if(!validateinstructor){
            const error = appError.create('instructor not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{
                
                
                const folderPath = 'uploads';
                const photoToDelete = reqDeleted.avatar.split('/')[4];
                oneDeletePhoto(folderPath, photoToDelete);    

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }
                

                const updatedinstructor = await Instructor.updateOne({_id: instructorId} , 
                    {fName, 
                    avatar : `${req.protocol}://${req.hostname}/uploads/${req.files['avatar'][0].filename}`,
                    lName, 
                    instructorDetails,  
                    publishedAt,
                })

                // await updatedinstructor.save();  

                return res.status(200).json({status : httpStatusText.SUCCESS , data : {instructor: updatedinstructor}})
            }
        }catch(error){
            return next(error)
        }

    }
)

module.exports = {
    getAllInstructors,
    getInstructorById,
    addInstructor,
    updateInstructor,
    deleteInstructor
}
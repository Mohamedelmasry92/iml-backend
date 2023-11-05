const {validationResult} = require('express-validator')
const Articletopics = require('../models/articleTopicsModel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const oneDeletePhoto = require('../middlewares/onePhotoToDelete');



const getAllArticleTopics = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const articletopics = await Articletopics.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {articletopics}});
    }
)


const getArticleTopicById = asyncWrapper(
async (req , res , next) =>{
            const articleTopicId = await Articletopics.findById(req.params.articleTopicId);
            if(!articleTopicId){
                const error = appError.create('article Topic not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {article : "article not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {articleTopicId}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)

const addArticleTopic = asyncWrapper(
    async (req , res , next) => {
        const {topicImage , topicName , topicDescribtion ,publishedAt} = req.body
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }

        const newArticleTopic = new Articletopics ({
                topicImage : `${req.protocol}://${req.hostname}/uploads/${req.files['topicImage'][0].filename}`,
                topicName, 
                topicDescribtion,
                publishedAt
           })

           console.log()

        await newArticleTopic.save();    
        res.status(201).json({status : httpStatusText.SUCCESS , data : {article: newArticleTopic}})

    }
)


const deleteArticleTopic = asyncWrapper(
    async (req , res ,next) =>{
        
        const articleTopicId = req.params.articleTopicId;
        const validateArticleTopic = await Articletopics.findById(articleTopicId)
        
        if(!validateArticleTopic){
            const error = appError.create('article topic not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{
            const reqDeleted = validateArticleTopic
            const folderPath = 'uploads';
            const photoToDelete = reqDeleted.topicImage.split('/')[4];    
            
            const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);

            await Articletopics.deleteOne({_id: articleTopicId})
            return res.status(200).json({status : httpStatusText.SUCCESS , data : {deletionphoto}});

        }
    }
)
 

const updateArticleTopic =  asyncWrapper( async (req , res , next) =>{
    try {
    
        const {topicImage , topicName , topicDescribtion ,publishedAt} = req.body

        const articleTopicId = req.params.articleTopicId;
        const validateArticle = await Articletopics.findById(articleTopicId)
        
        const paramsUpdated = req.body
        // console.log(paramsUpdated)
        if(!validateArticle){
            const error = appError.create('article topic not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{
                
                const reqDeleted = validateArticle
                const folderPath = 'uploads';
                const photoToDelete = reqDeleted.topicImage.split('/')[4];
                oneDeletePhoto(folderPath, photoToDelete);    

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }                

                const updatedArticle = await Articletopics.updateOne({_id: articleTopicId} , 
                    {topicImage : `${req.protocol}://${req.hostname}/uploads/${req.files['topicImage'][0].filename}`,
                    topicName, 
                    topicDescribtion,
                    publishedAt
                })

                // await updatedArticle.save();  

                return res.status(200).json({status : httpStatusText.SUCCESS , data : {article: updatedArticle}})
            }
        }catch(error){
            return next(error)
        }

    }
)




module.exports = {
    getAllArticleTopics,
    getArticleTopicById,
    addArticleTopic,
    deleteArticleTopic,
    updateArticleTopic
}
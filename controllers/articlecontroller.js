const {validationResult} = require('express-validator')
const Article = require('../models/articlemodel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError')
const deletePhotos = require('../middlewares/photosToDelete');
const oneDeletePhoto = require('../middlewares/onePhotoToDelete');



const getAllArticles = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const articles = await Article.find({} , {"__v" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {articles}});
    }
)


const getArticleById = asyncWrapper(
async (req , res , next) =>{
            const article = await Article.findById(req.params.articleId);
            if(!article){
                const error = appError.create('article not found' , 404 , httpStatusText.FAIL)
                return next(error)
                // return res.status(404).json({status : httpStatusText.FAIL , data : {article : "article not found"}})
            }
            return res.json({status : httpStatusText.SUCCESS , data : {article}});
        // try {
        // } catch (err){
        // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
        // }
}
)


const addArticle = asyncWrapper(
    async (req , res , next) => {
        const {author , coverImage , articleTitle , articleDescribtion , content , categoryTopic , articleImages=[] , publishedAt } = req.body
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
            return next(error)
            // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
        }
        
        const arr = req.files['articleImages']
        for (let i = 0; i < arr.length; i++) {
            articleImages.push(`${req.protocol}://${req.hostname}/uploads/${arr[i].filename}`);
        }

        // const arr2 = req.files['answers']
        // for (let i = 0; i < arr.length; i++) {
        //     answers.push(arr2[i]);
        // }

        const newArticle = new Article ({
                author, 
                coverImage : `${req.protocol}://${req.hostname}/uploads/${req.files['coverImage'][0].filename}`,
                articleTitle, 
                articleDescribtion,  
                content,
                categoryTopic, 
                articleImages,
                publishedAt,

           })
        
        await newArticle.save();    
        res.status(201).json({status : httpStatusText.SUCCESS , data : {article: newArticle}})
    }
)


const deleteArticle = asyncWrapper(
    async (req , res ,next) =>{
        
        const articleId = req.params.articleId;
        const validateArticle = await Article.findById(articleId)
        
        if(!validateArticle){
            const error = appError.create('article not found' , 404 , httpStatusText.FAIL)
            return next(error)
            
        }else{
            
            const reqDeleted = validateArticle
            const arrDeleted = validateArticle.articleImages
            const folderPath = 'uploads';
            function photosToDelete() {
                const deleted = [];
                for (let i = 0; i < arrDeleted.length; i++) {
                  const deletedItem = (`${arrDeleted[i]}`).split('/')[4];
                  deleted.push(deletedItem);
                }
                return deleted;
              }
            const photoToDelete = reqDeleted.coverImage.split('/')[4];    
            
            const deletionStatus = deletePhotos(folderPath, photosToDelete());
            const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);

            await Article.deleteOne({_id: articleId})
            return res.status(200).json({status : httpStatusText.SUCCESS , data : {deletionphoto , deletionStatus}});

        }
    }
)
 

const updateArticle =  asyncWrapper( async (req , res , next) =>{
    try {
    
        const {author , coverImage , articleTitle , articleDescribtion , content , categoryTopic , articleImages=[] , publishedAt} = req.body

        const articleId = req.params.articleId;
        const validateArticle = await Article.findById(articleId)
        const reqDeleted = validateArticle
        
        const paramsUpdated = req.body
        // console.log(paramsUpdated)
        if(!validateArticle){
            const error = appError.create('article not found' , 404 , httpStatusText.FAIL)
            return next(error)
        }else{
                
            
                const arrDeleted = validateArticle.articleImages
                const folderPath = 'uploads';
                function photosToDelete() {
                    const deleted = [];
                    for (let i = 0; i < arrDeleted.length; i++) {
                      const deletedItem = (`${arrDeleted[i]}`).split('/')[4];
                      deleted.push(deletedItem);
                    }
                    return deleted;
                }
                const photoToDelete = reqDeleted.coverImage.split('/')[4];
                oneDeletePhoto(folderPath, photoToDelete);    
                deletePhotos(folderPath, photosToDelete());

                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                    return next(error)
                    // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
                }
                
                const arrAdded = req.files['articleImages']
                for (let i = 0; i < arrAdded.length; i++) {
                    articleImages.push(`${req.protocol}://${req.hostname}/uploads/${arrAdded[i].filename}`);
                }
                

                const updatedArticle = await Article.updateOne({_id: articleId} , 
                    {author, 
                    coverImage : `${req.protocol}://${req.hostname}/uploads/${req.files['coverImage'][0].filename}`,
                    articleTitle, 
                    articleDescribtion,  
                    content,
                    categoryTopic, 
                    articleImages,
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
    getAllArticles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle
}
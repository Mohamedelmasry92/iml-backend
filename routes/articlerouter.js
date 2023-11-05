const express = require('express');
const {body} = require('express-validator')

const router = express.Router();

const appError = require('../utils/appError')

const multer = require('multer')

const articlesController = require('../controllers/articlecontroller')
const {validationSchema} = require('../middlewares/validationSchema')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles');


const diskStorage = multer.diskStorage({
    destination: function (req , file , cb) {
        // console.log("File : ----> " , file)
        cb(null , 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        // const fileName = `user-${Date.now()}.${ext}`
        const fileName = `article-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`

        cb(null, fileName)
    }
})

const fileFilter = (req , file , cb) => {
    const imageType = file.mimetype.split('/')[0]
    if(imageType == 'image'){
        return cb(null , true)
    }else{
        return cb(appError.create('File must be an image' , 400 ) , false)
    }
}

const upload = multer({ 
    storage: diskStorage,
    fileFilter: fileFilter
})

const cpUpload = upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'articleImages', maxCount: 8 }]) 
// : 
// appError == true ? 
// upload.none()


router.route('/')
            .get( verifyToken, allowedTo(userRoles.ADMIN , userRoles.MANAGER) , articlesController.getAllArticles)
            .post( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , cpUpload , validationSchema()   , articlesController.addArticle)


router.route('/:articleId')
            .get( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , articlesController.getArticleById)
            .patch( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , cpUpload, validationSchema() , articlesController.updateArticle)
            .delete( verifyToken , upload.none() , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , articlesController.deleteArticle)


module.exports = router;